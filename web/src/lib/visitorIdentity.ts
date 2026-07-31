/** Anonymous browser identity, geolocation IP, and same-origin helpers. */

import { isIP } from "node:net";

const VISITOR_COOKIE = "hadith_visitor_id";
const VISITOR_ID_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const BOT_PATTERN =
  /(?:bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|discordbot|linkedinbot|pinterest|yandex|baiduspider|duckduckbot|egi-web-monitoring)/i;

export type VisitorIdentity = {
  visitorHash: string | null;
  setCookie: string | null;
  isBot: boolean;
};

function normalizeIp(value: string | null): string | null {
  if (!value) return null;
  const address = value.trim();
  if (!address || address.length > 128) return null;

  const version = isIP(address);
  if (version === 4) return address;
  if (version !== 6) return null;

  try {
    return new URL(`http://[${address}]`).hostname.slice(1, -1).toLowerCase();
  } catch {
    return null;
  }
}

export function getClientIp(request: Request): string | null {
  const candidates = [
    request.headers.get("x-real-ip"),
    process.env.VISITOR_TRUST_CLOUDFLARE_HEADERS === "true"
      ? request.headers.get("cf-connecting-ip")
      : null,
  ];

  for (const candidate of candidates) {
    const address = normalizeIp(candidate);
    if (address) return address;
  }
  return null;
}

function visitorSecret(): string | null {
  return (
    process.env.VISITOR_ID_HASH_SECRET ||
    process.env.VISITOR_IP_HASH_SECRET ||
    null
  );
}

export function hasVisitorSecret(): boolean {
  return Boolean(visitorSecret());
}

async function hashVisitorId(visitorId: string): Promise<string> {
  const secret = visitorSecret();
  if (!secret) throw new Error("Visitor identity hash secret is not configured");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`browser:${visitorId}`),
  );
  return Array.from(new Uint8Array(signature), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
}

function cookieValue(request: Request): string | null {
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;

  for (const part of cookie.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() !== VISITOR_COOKIE) continue;
    const value = part.slice(separator + 1).trim();
    return VISITOR_ID_PATTERN.test(value) ? value : null;
  }
  return null;
}

function newVisitorId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Buffer.from(bytes).toString("base64url");
}

function cookieHeader(request: Request, visitorId: string): string {
  const secure =
    new URL(request.url).protocol === "https:" ||
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https";
  return [
    `${VISITOR_COOKIE}=${visitorId}`,
    "Path=/",
    "Max-Age=31536000",
    "HttpOnly",
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

export async function resolveVisitorIdentity(
  request: Request,
): Promise<VisitorIdentity> {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (BOT_PATTERN.test(userAgent)) {
    return { visitorHash: null, setCookie: null, isBot: true };
  }

  const visitorId = cookieValue(request);
  if (visitorId) {
    return {
      visitorHash: await hashVisitorId(visitorId),
      setCookie: null,
      isBot: false,
    };
  }

  const generatedId = newVisitorId();
  return {
    visitorHash: null,
    setCookie: cookieHeader(request, generatedId),
    isBot: false,
  };
}

function publicRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    url.protocol.replace(/:$/, "");
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    url.host;
  return `${protocol}://${host}`;
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === publicRequestOrigin(request);
}
