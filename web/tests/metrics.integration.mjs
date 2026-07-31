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
const NEXT_BIN = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const PRISMA_BIN = fileURLToPath(new URL("../node_modules/prisma/build/index.js", import.meta.url));
const TSCONFIG_PATH = fileURLToPath(new URL("../tsconfig.json", import.meta.url));
const BROWSER_UA = "Mozilla/5.0 Metrics Integration Browser";

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
  const locations = {
    "203.0.113.10": { city: "New York", region: "New York", country_code: "US" },
    "198.51.100.20": { city: "Paris", region: "Ile-de-France", country_code: "FR" },
    "2001:db8::1": { city: "Tokyo", region: "Tokyo", country_code: "JP" },
    "198.51.100.88": { city: "Sydney", region: "New South Wales", country_code: "AU" },
    "192.0.2.41": { city: "Toronto", region: "Ontario", country_code: "CA" },
  };
  return locations[ip] ?? null;
}

async function startGeoServer() {
  geoServer = http.createServer((request, response) => {
    const ip = decodeURIComponent((request.url || "/").slice(1));
    geoRequests.set(ip, (geoRequests.get(ip) || 0) + 1);
    const location = locationFor(ip);
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(location ? { success: true, ...location } : { success: false }));
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
    } catch {}
    await delay(250);
  }
  throw new Error(`Next.js test server did not become ready:\n${childOutput.join("")}`);
}

function baseHeaders(ip, origin = PUBLIC_ORIGIN, userAgent = BROWSER_UA) {
  return {
    ...(ip ? { "x-real-ip": ip } : {}),
    ...(origin ? { origin } : {}),
    "user-agent": userAgent,
    "x-forwarded-host": "hadith-hotel.com",
    "x-forwarded-proto": "https",
  };
}

async function rawRequest(path, { method = "GET", ip, origin, userAgent, cookie } = {}) {
  return fetch(`${APP_ORIGIN}${path}`, {
    method,
    headers: method === "POST"
      ? { ...baseHeaders(ip, origin, userAgent), ...(cookie ? { cookie } : {}) }
      : undefined,
  });
}

async function parse(response) {
  const payload = await response.text();
  try {
    return { response, body: JSON.parse(payload) };
  } catch {
    throw new Error(`${response.url} returned ${response.status}: ${payload.slice(0, 240)}`);
  }
}

class TestBrowser {
  constructor(ip, { acceptCookies = true, userAgent = BROWSER_UA } = {}) {
    this.ip = ip;
    this.acceptCookies = acceptCookies;
    this.userAgent = userAgent;
    this.cookie = null;
    this.lastSetCookie = null;
  }

  async post(path, origin = PUBLIC_ORIGIN) {
    const response = await rawRequest(path, {
      method: "POST",
      ip: this.ip,
      origin,
      userAgent: this.userAgent,
      cookie: this.cookie,
    });
    this.lastSetCookie = response.headers.get("set-cookie");
    if (this.acceptCookies && this.lastSetCookie) {
      this.cookie = this.lastSetCookie.split(";", 1)[0];
    }
    return parse(response);
  }

  async confirm(path) {
    let result = await this.post(path);
    if (result.body?.identityPending) result = await this.post(path);
    return result;
  }
}

async function getJson(path) {
  return parse(await rawRequest(path));
}

function metric(items, name) {
  return items.find((item) => item.name === name)?.count ?? 0;
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

async function cleanup() {
  await stopApp();
  if (geoServer) await new Promise((resolve) => geoServer.close(resolve));
  if (prisma) await prisma.$disconnect();
  if (originalTsconfig !== undefined) await writeFile(TSCONFIG_PATH, originalTsconfig);
}

async function startApp(env) {
  await rm(new URL("../.next/dev", import.meta.url), { force: true, recursive: true });
  appProcess = spawn(process.execPath, [NEXT_BIN, "dev", "--hostname", "127.0.0.1", "--port", String(APP_PORT)], {
    cwd: WEB_ROOT,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  appProcess.stdout.on("data", recordOutput);
  appProcess.stderr.on("data", recordOutput);
}

async function main() {
  originalTsconfig = await readFile(TSCONFIG_PATH);
  const geoPort = await startGeoServer();
  const env = {
    ...process.env,
    DATABASE_URL,
    VISITOR_ID_HASH_SECRET: "metrics-integration-secret",
    VISITOR_IP_HASH_SECRET: "",
    VISITOR_GEOLOOKUP_URL: `http://127.0.0.1:${geoPort}/{ip}`,
    PROFILE_DOCUMENT_VERSION: "test-v1",
    NODE_ENV: "test",
  };

  await runNode(PRISMA_BIN, ["db", "push", "--force-reset", "--skip-generate"], env);
  await runNode(PRISMA_BIN, ["db", "execute", "--file", "prisma/manual/enforce-unique-profile-download-count.sql", "--url", DATABASE_URL], env);
  process.env.DATABASE_URL = DATABASE_URL;
  const { PrismaClient } = await import("@prisma/client");
  prisma = new PrismaClient();

  await startApp(env);
  await waitForApp();

  const initial = await getJson("/api/visitors");
  assert.equal(initial.response.status, 200);
  assert.equal(initial.response.headers.get("cache-control"), "no-store");
  assert.equal(initial.body.count, 0);

  const attacker = new TestBrowser("203.0.113.10");
  assert.equal((await attacker.post("/api/visitors", "https://attacker.example")).response.status, 403);
  assert.equal((await getJson("/api/visitors")).body.count, 0);

  const cookieBlocked = new TestBrowser("203.0.113.10", { acceptCookies: false });
  for (let index = 0; index < 3; index += 1) {
    const result = await cookieBlocked.post("/api/visitors");
    assert.equal(result.response.status, 200);
    assert.equal(result.body.identityPending, true);
  }
  assert.equal((await getJson("/api/visitors")).body.count, 0, "Cookie-blocked requests are not guessed by IP");

  const bot = new TestBrowser("203.0.113.10", { userAgent: "Googlebot/2.1" });
  const botResult = await bot.post("/api/visitors");
  assert.equal(botResult.response.status, 200);
  assert.equal(bot.lastSetCookie, null);
  assert.equal((await getJson("/api/visitors")).body.count, 0);

  const healthMonitor = new TestBrowser("203.0.113.10", {
    userAgent: "EGI-Web-Monitoring/0.1 (Playwright)",
  });
  for (let index = 0; index < 3; index += 1) {
    const monitorResult = await healthMonitor.post("/api/visitors");
    assert.equal(monitorResult.response.status, 200);
    assert.equal(healthMonitor.lastSetCookie, null);
  }
  assert.equal((await getJson("/api/visitors")).body.count, 0, "The production health monitor must never count as a visitor");

  const browserA = new TestBrowser("203.0.113.10");
  const firstA = await browserA.post("/api/visitors");
  assert.equal(firstA.body.identityPending, true);
  assert.match(browserA.lastSetCookie, /HttpOnly/);
  assert.match(browserA.lastSetCookie, /SameSite=Lax/);
  assert.match(browserA.lastSetCookie, /Secure/);
  assert.equal((await browserA.post("/api/visitors")).body.count, 1);
  const aFirstRow = await prisma.websiteVisitor.findFirstOrThrow();
  await delay(15);
  assert.equal((await browserA.post("/api/visitors")).body.count, 1);
  const aRepeatedRow = await prisma.websiteVisitor.findUniqueOrThrow({ where: { visitorHash: aFirstRow.visitorHash } });
  assert.ok(aRepeatedRow.lastSeenAt > aFirstRow.lastSeenAt);

  const browserB = new TestBrowser("203.0.113.10");
  assert.equal((await browserB.confirm("/api/visitors")).body.count, 2, "Two browsers behind one IP count separately");

  browserA.ip = "198.51.100.20";
  assert.equal((await browserA.post("/api/visitors")).body.count, 2, "One browser changing IP remains one visitor");
  const persistedA = await prisma.websiteVisitor.findUniqueOrThrow({ where: { visitorHash: aFirstRow.visitorHash } });
  assert.equal(persistedA.city, "New York", "First-event geography stays stable");

  const browserC = new TestBrowser(null);
  assert.equal((await browserC.confirm("/api/visitors")).body.count, 3, "A cookie identity does not require an IP");
  const browserD = new TestBrowser("not-an-ip");
  assert.equal((await browserD.confirm("/api/visitors")).body.count, 4, "Malformed IP cannot become identity or break tracking");

  const parallel = await Promise.all(Array.from({ length: 25 }, () => browserA.post("/api/visitors")));
  assert.ok(parallel.every(({ response }) => response.status === 200));
  assert.equal(await prisma.websiteVisitor.count(), 4, "Parallel requests cannot duplicate one browser");

  const browserE = new TestBrowser("2001:db8::1");
  await browserE.confirm("/api/visitors");
  const browserF = new TestBrowser("198.51.100.88");
  await browserF.confirm("/api/visitors");
  assert.equal(await prisma.websiteVisitor.count(), 6);

  assert.equal((await browserA.post("/api/downloads/profile", "https://attacker.example")).response.status, 403);
  assert.equal((await getJson("/api/downloads/profile")).body.totalDownloads, 0);

  assert.equal((await browserA.confirm("/api/downloads/profile")).body.totalDownloads, 1);
  const firstDownload = await prisma.profileDownload.findFirstOrThrow();
  await delay(15);
  assert.equal((await browserA.post("/api/downloads/profile")).body.totalDownloads, 1);
  const repeatedDownload = await prisma.profileDownload.findUniqueOrThrow({
    where: { visitorHash_documentVersion: { visitorHash: firstDownload.visitorHash, documentVersion: "test-v1" } },
  });
  assert.equal(repeatedDownload.downloadCount, 1);
  assert.ok(repeatedDownload.lastDownloadedAt > firstDownload.lastDownloadedAt);

  assert.equal((await browserB.confirm("/api/downloads/profile")).body.totalDownloads, 2, "Same IP, different browser counts as a different downloader");
  assert.equal((await browserF.confirm("/api/downloads/profile")).body.totalDownloads, 3);

  const browserG = new TestBrowser("192.0.2.41");
  const directDownload = await browserG.confirm("/api/downloads/profile");
  assert.equal(directDownload.body.totalDownloads, 4, "A direct download establishes visitor and download records");
  assert.equal(await prisma.websiteVisitor.count(), 7);

  for (let index = 0; index < 2; index += 1) await cookieBlocked.post("/api/downloads/profile");
  assert.equal(await prisma.profileDownload.count(), 4, "Cookie-blocked downloads are not deduplicated by IP or counted as unique");

  const concurrentDownloads = await Promise.all(Array.from({ length: 25 }, () => browserE.post("/api/downloads/profile")));
  assert.ok(concurrentDownloads.every(({ response }) => response.status === 200));
  assert.equal(await prisma.profileDownload.count(), 5);

  const visitorGeo = (await getJson("/api/visitors/geography")).body;
  assert.equal(visitorGeo.totalRecorded, 7);
  assert.equal(visitorGeo.locatedRecords, 5);
  assert.equal(visitorGeo.unclassified, 2);
  assert.equal(metric(visitorGeo.topCities, "New York"), 2);
  assert.equal(metric(visitorGeo.topCountries, "United States"), 2);

  const downloadGeo = (await getJson("/api/downloads/profile/geography")).body;
  assert.equal(downloadGeo.totalRecorded, 5);
  assert.equal(downloadGeo.locatedRecords, 5);
  assert.equal(metric(downloadGeo.topCities, "New York"), 2);
  assert.equal(metric(downloadGeo.topCities, "Tokyo"), 1);

  const visitorRows = await prisma.websiteVisitor.findMany();
  const downloadRows = await prisma.profileDownload.findMany();
  assert.ok(visitorRows.every((row) => /^[a-f0-9]{64}$/.test(row.visitorHash)));
  assert.ok(downloadRows.every((row) => /^[a-f0-9]{64}$/.test(row.visitorHash)));
  assert.ok([...visitorRows, ...downloadRows].every((row) => !row.visitorHash.includes("203.0.113.10")));
  assert.equal(geoRequests.get("203.0.113.10"), 2, "Location is resolved once per distinct browser, not used as identity");

  await prisma.profileDownload.create({
    data: { visitorHash: firstDownload.visitorHash, documentVersion: "test-v2", lastDownloadedAt: new Date() },
  });
  assert.equal(await prisma.profileDownload.count(), 6, "A new document version may count the same browser again");
  await assert.rejects(
    prisma.profileDownload.create({
      data: { visitorHash: firstDownload.visitorHash, documentVersion: "test-v1", lastDownloadedAt: new Date() },
    }),
    /unique constraint/i,
  );
  await assert.rejects(
    prisma.profileDownload.updateMany({ data: { downloadCount: 2 } }),
    /ProfileDownload_downloadCount_unique_ip_check|constraint/i,
  );

  await stopApp();
  await startApp({ ...env, VISITOR_ID_HASH_SECRET: "", VISITOR_IP_HASH_SECRET: "" });
  await waitForApp([503]);
  for (const endpoint of ["/api/visitors", "/api/visitors/geography", "/api/downloads/profile", "/api/downloads/profile/geography"]) {
    assert.equal((await rawRequest(endpoint)).status, 503);
  }

  console.log("Metrics integration suite passed (anonymous identity, shared IP, cookie rejection, bot filtering, downloads, geo, concurrency, and privacy).");
}

try {
  await main();
} finally {
  await cleanup();
}
