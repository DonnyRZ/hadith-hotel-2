import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const DATABASE_URL =
  process.env.METRICS_TEST_DATABASE_URL ||
  "postgresql://hadith_test:hadith_test_password@127.0.0.1:55432/hadith_metrics_test?schema=metrics_test";
const APP_PORT = Number(process.env.METRICS_TEST_PORT || 3111);
const APP_ORIGIN = `http://127.0.0.1:${APP_PORT}`;
const PUBLIC_ORIGIN = "https://hadith-hotel.com";
const WEB_ROOT = fileURLToPath(new URL("..", import.meta.url));
const NEXT_BIN = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);
const PRISMA_BIN = fileURLToPath(
  new URL("../node_modules/prisma/build/index.js", import.meta.url),
);
const TSCONFIG_PATH = fileURLToPath(new URL("../tsconfig.json", import.meta.url));

const geoRequests = new Map();
const childOutput = [];
let appProcess;
let geoServer;
let prisma;
let originalTsconfig;

function recordOutput(chunk) {
  childOutput.push(String(chunk));
  if (childOutput.length > 200) childOutput.shift();
}

function runNode(scriptUrl, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptUrl, ...args], {
      cwd: WEB_ROOT,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", recordOutput);
    child.stderr.on("data", recordOutput);
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed (${code}): ${childOutput.slice(-20).join("")}`));
    });
  });
}

function locationFor(ip) {
  if (ip === "203.0.113.10") {
    return { city: "New York City", region: "New York", country_code: "US" };
  }
  if (ip === "198.51.100.20") {
    return { city: "Paris", region: "Île-de-France", country_code: "FR" };
  }
  if (ip === "2001:db8::1") {
    return { city: "Tokyo", region: "Tokyo", country_code: "JP" };
  }
  if (/^192\.0\.2\.4[1-6]$/.test(ip)) {
    return { city: "Toronto", region: "Ontario", country_code: "CA" };
  }
  if (ip === "198.51.100.88") {
    return { city: "Sydney", region: "New South Wales", country_code: "AU" };
  }
  if (ip === "198.51.100.77") {
    return { country_code: "GB" };
  }
  return null;
}

async function startGeoServer() {
  geoServer = http.createServer((request, response) => {
    const ip = decodeURIComponent((request.url || "/").slice(1));
    geoRequests.set(ip, (geoRequests.get(ip) || 0) + 1);
    if (ip === "203.0.113.98") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end("not-json");
      return;
    }
    if (ip === "203.0.113.97") {
      setTimeout(() => {
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify({ success: false }));
      }, 3_000);
      return;
    }
    const location = locationFor(ip);
    response.writeHead(200, { "content-type": "application/json" });
    response.end(
      JSON.stringify(location ? { success: true, ...location } : { success: false }),
    );
  });
  await new Promise((resolve) => geoServer.listen(0, "127.0.0.1", resolve));
  return geoServer.address().port;
}

async function waitForApp(expectedStatuses = [200]) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${APP_ORIGIN}/api/visitors`);
      if (expectedStatuses.includes(response.status)) return;
    } catch {
      // The app is still compiling or opening the port.
    }
    await delay(250);
  }
  throw new Error(`Next.js test server did not become ready:\n${childOutput.join("")}`);
}

function trackingHeaders(ip, origin = PUBLIC_ORIGIN) {
  return {
    ...(ip ? { "x-real-ip": ip } : {}),
    origin,
    "x-forwarded-host": "hadith-hotel.com",
    "x-forwarded-proto": "https",
  };
}

async function request(
  path,
  { ip, origin, method = "GET", extraHeaders = {} } = {},
) {
  return fetch(`${APP_ORIGIN}${path}`, {
    method,
    headers:
      method === "POST"
        ? { ...trackingHeaders(ip, origin), ...extraHeaders }
        : undefined,
  });
}

async function json(path, options) {
  const response = await request(path, options);
  const payload = await response.text();
  let body;
  try {
    body = JSON.parse(payload);
  } catch {
    throw new Error(
      `${path} returned ${response.status} ${response.headers.get("content-type")}: ` +
        `${payload.slice(0, 240)}\n${childOutput.slice(-30).join("")}`,
    );
  }
  return { response, body };
}

async function postMany(path, ip, count) {
  return Promise.all(
    Array.from({ length: count }, () => json(path, { ip, method: "POST" })),
  );
}

function metric(items, name) {
  return items.find((item) => item.name === name)?.count ?? 0;
}

async function cleanup() {
  await stopApp();
  if (geoServer) await new Promise((resolve) => geoServer.close(resolve));
  if (prisma) await prisma.$disconnect();
  if (originalTsconfig !== undefined) {
    await writeFile(TSCONFIG_PATH, originalTsconfig);
  }
}

async function stopApp() {
  if (appProcess && appProcess.exitCode === null) {
    appProcess.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => appProcess.once("exit", resolve)),
      delay(3_000),
    ]);
  }
  appProcess = undefined;
}

async function main() {
  originalTsconfig = await readFile(TSCONFIG_PATH);
  const geoPort = await startGeoServer();
  const env = {
    DATABASE_URL,
    VISITOR_IP_HASH_SECRET: "metrics-integration-secret",
    VISITOR_GEOLOOKUP_URL: `http://127.0.0.1:${geoPort}/{ip}`,
    NODE_ENV: "test",
  };

  await runNode(PRISMA_BIN, ["db", "push", "--force-reset", "--skip-generate"], env);

  process.env.DATABASE_URL = DATABASE_URL;
  const { PrismaClient } = await import("@prisma/client");
  prisma = new PrismaClient();

  await rm(new URL("../.next/dev", import.meta.url), {
    force: true,
    recursive: true,
  });
  appProcess = spawn(
    process.execPath,
    [NEXT_BIN, "dev", "--hostname", "127.0.0.1", "--port", String(APP_PORT)],
    {
      cwd: WEB_ROOT,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  appProcess.stdout.on("data", recordOutput);
  appProcess.stderr.on("data", recordOutput);
  await waitForApp();

  const initial = await json("/api/visitors");
  assert.equal(initial.response.status, 200);
  assert.equal(initial.response.headers.get("cache-control"), "no-store");
  assert.equal(initial.body.count, 0);

  const foreignOrigin = await json("/api/visitors", {
    ip: "203.0.113.10",
    method: "POST",
    origin: "https://attacker.example",
  });
  assert.equal(foreignOrigin.response.status, 403);
  assert.equal((await json("/api/visitors")).body.count, 0);

  assert.equal(
    (await json("/api/visitors", { method: "POST" })).response.status,
    200,
  );
  assert.equal(
    (
      await json("/api/visitors", {
        method: "POST",
        extraHeaders: { "x-forwarded-for": "203.0.113.10" },
      })
    ).response.status,
    200,
  );
  assert.equal(
    (
      await json("/api/visitors", {
        method: "POST",
        extraHeaders: { "cf-connecting-ip": "203.0.113.10" },
      })
    ).response.status,
    200,
  );
  assert.equal(
    (await json("/api/visitors", { ip: "not-an-ip", method: "POST" })).response.status,
    200,
  );
  assert.equal((await json("/api/visitors")).body.count, 0);

  const visitorIp = "203.0.113.10";
  assert.equal(
    (await json("/api/visitors", { ip: `  ${visitorIp}  `, method: "POST" })).response.status,
    200,
  );
  const firstVisitor = await prisma.websiteVisitor.findFirstOrThrow();
  await delay(15);
  const repeatedVisitors = await postMany("/api/visitors", visitorIp, 3);
  assert.ok(repeatedVisitors.every(({ response }) => response.status === 200));
  const repeatedVisitor = await prisma.websiteVisitor.findUniqueOrThrow({
    where: { visitorHash: firstVisitor.visitorHash },
  });
  assert.equal(await prisma.websiteVisitor.count(), 1);
  assert.ok(repeatedVisitor.lastSeenAt > firstVisitor.lastSeenAt);

  const expandedIpv6 = "2001:0db8:0:0:0:0:0:1";
  const compactIpv6 = "2001:db8::1";
  const ipv6Responses = await Promise.all([
    json("/api/visitors", { ip: expandedIpv6, method: "POST" }),
    json("/api/visitors", { ip: compactIpv6, method: "POST" }),
  ]);
  assert.ok(ipv6Responses.every(({ response }) => response.status === 200));
  assert.equal(await prisma.websiteVisitor.count(), 2);

  const concurrentIp = "198.51.100.20";
  const concurrentVisitors = await postMany("/api/visitors", concurrentIp, 25);
  assert.ok(
    concurrentVisitors.every(({ response }) => response.status === 200),
    "Every concurrent visitor request must succeed",
  );
  assert.equal(await prisma.websiteVisitor.count(), 3);

  const unknownIp = "203.0.113.99";
  assert.equal(
    (await json("/api/visitors", { ip: unknownIp, method: "POST" })).response.status,
    200,
  );
  const distinctIps = Array.from({ length: 6 }, (_, index) => `192.0.2.${41 + index}`);
  const distinctVisitors = await Promise.all(
    distinctIps.map((ip) => json("/api/visitors", { ip, method: "POST" })),
  );
  assert.ok(distinctVisitors.every(({ response }) => response.status === 200));
  assert.equal(await prisma.websiteVisitor.count(), 10);

  for (const ip of ["203.0.113.98", "203.0.113.97", "198.51.100.77"]) {
    const result = await json("/api/visitors", { ip, method: "POST" });
    assert.equal(result.response.status, 200);
  }
  assert.equal(await prisma.websiteVisitor.count(), 13);

  const foreignDownload = await json("/api/downloads/profile", {
    ip: visitorIp,
    method: "POST",
    origin: "https://attacker.example",
  });
  assert.equal(foreignDownload.response.status, 403);
  assert.equal((await json("/api/downloads/profile")).body.totalDownloads, 0);

  const firstDownload = await json("/api/downloads/profile", {
    ip: visitorIp,
    method: "POST",
  });
  assert.equal(firstDownload.response.status, 200);
  assert.equal(firstDownload.body.totalDownloads, 1);
  const initialDownloadRow = await prisma.profileDownload.findFirstOrThrow();
  await delay(15);
  const repeatedDownloads = await postMany("/api/downloads/profile", visitorIp, 4);
  assert.ok(repeatedDownloads.every(({ response }) => response.status === 200));
  const repeatedDownloadRow = await prisma.profileDownload.findUniqueOrThrow({
    where: { visitorHash: initialDownloadRow.visitorHash },
  });
  assert.equal(await prisma.profileDownload.count(), 1);
  assert.equal(repeatedDownloadRow.downloadCount, 1);
  assert.ok(repeatedDownloadRow.lastDownloadedAt > initialDownloadRow.lastDownloadedAt);

  const concurrentDownloads = await postMany(
    "/api/downloads/profile",
    concurrentIp,
    25,
  );
  assert.ok(
    concurrentDownloads.every(({ response }) => response.status === 200),
    "Every concurrent download request must succeed",
  );
  assert.equal(await prisma.profileDownload.count(), 2);

  await json("/api/downloads/profile", { ip: unknownIp, method: "POST" });
  const downloadOnlyIp = "198.51.100.88";
  await json("/api/downloads/profile", { ip: downloadOnlyIp, method: "POST" });
  assert.equal(await prisma.profileDownload.count(), 4);
  assert.equal(await prisma.websiteVisitor.count(), 14);

  const downloadOverview = await json("/api/downloads/profile");
  assert.deepEqual(downloadOverview.body, {
    totalDownloads: 4,
    uniqueDownloaders: 4,
  });

  const visitorGeo = (await json("/api/visitors/geography")).body;
  assert.equal(visitorGeo.totalRecorded, 14);
  assert.equal(visitorGeo.locatedRecords, 11);
  assert.equal(visitorGeo.unclassified, 3);
  assert.equal(metric(visitorGeo.topCities, "Toronto"), 6);
  assert.equal(metric(visitorGeo.topCountries, "Canada"), 6);
  assert.equal(metric(visitorGeo.topCities, "New York"), 1);
  assert.equal(metric(visitorGeo.topCities, "Tokyo"), 1);
  assert.equal(metric(visitorGeo.topCountries, "United Kingdom"), 1);

  const downloadGeo = (await json("/api/downloads/profile/geography")).body;
  assert.equal(downloadGeo.totalRecorded, 4);
  assert.equal(downloadGeo.locatedRecords, 3);
  assert.equal(downloadGeo.unclassified, 1);
  assert.equal(metric(downloadGeo.topCities, "New York"), 1);
  assert.equal(metric(downloadGeo.topCities, "Paris"), 1);
  assert.equal(metric(downloadGeo.topCities, "Sydney"), 1);
  assert.equal(metric(downloadGeo.topCountries, "Australia"), 1);

  const visitorRows = await prisma.websiteVisitor.findMany();
  const downloadRows = await prisma.profileDownload.findMany();
  assert.equal(new Set(visitorRows.map((row) => row.visitorHash)).size, visitorRows.length);
  assert.equal(new Set(downloadRows.map((row) => row.visitorHash)).size, downloadRows.length);
  assert.ok(visitorRows.every((row) => /^[a-f0-9]{64}$/.test(row.visitorHash)));
  assert.ok(downloadRows.every((row) => /^[a-f0-9]{64}$/.test(row.visitorHash)));
  assert.ok(
    [...visitorRows, ...downloadRows].every(
      (row) => ![visitorIp, compactIpv6, expandedIpv6].includes(row.visitorHash),
    ),
  );

  assert.equal(geoRequests.get(visitorIp), 1, "Known visitor location should be cached");
  assert.equal(geoRequests.get(unknownIp), 1, "Unknown locations should use the retry window");

  await stopApp();
  await rm(new URL("../.next/dev", import.meta.url), {
    force: true,
    recursive: true,
  });
  appProcess = spawn(
    process.execPath,
    [NEXT_BIN, "dev", "--hostname", "127.0.0.1", "--port", String(APP_PORT)],
    {
      cwd: WEB_ROOT,
      env: { ...env, VISITOR_IP_HASH_SECRET: "" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  appProcess.stdout.on("data", recordOutput);
  appProcess.stderr.on("data", recordOutput);
  await waitForApp([503]);
  for (const endpoint of [
    "/api/visitors",
    "/api/visitors/geography",
    "/api/downloads/profile",
    "/api/downloads/profile/geography",
  ]) {
    assert.equal((await request(endpoint)).status, 503);
  }
  console.log("Metrics integration suite passed (visitor, download, geo, concurrency, privacy)." );
}

try {
  await main();
} finally {
  await cleanup();
}
