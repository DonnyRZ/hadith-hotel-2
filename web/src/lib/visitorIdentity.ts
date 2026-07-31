/** Client IP hashing and same-origin helpers for visitor and download tracking. */

import { isIP } from "node:net";

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

export async function hashIp(ip: string): Promise<string> {
  const secret = process.env.VISITOR_IP_HASH_SECRET;
  if (!secret) throw new Error("VISITOR_IP_HASH_SECRET is not configured");

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
    new TextEncoder().encode(ip),
  );
  return Array.from(new Uint8Array(signature), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
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
