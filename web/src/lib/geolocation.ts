export type GeographicLocation = {
  city: string | null;
  region: string | null;
  countryCode: string | null;
};

const LOOKUP_TIMEOUT_MS = 2500;
const IP_GEO_TTL_MS = 24 * 60 * 60 * 1000;
const IP_GEO_NEGATIVE_TTL_MS = 10 * 60 * 1000;
const IP_GEO_CACHE_MAX = 4000;

const ipGeoCache = new Map<
  string,
  { expiresAt: number; location: GeographicLocation | null }
>();

function cachedIpLocation(ip: string) {
  const hit = ipGeoCache.get(ip);
  if (!hit) return undefined;
  if (hit.expiresAt <= Date.now()) {
    ipGeoCache.delete(ip);
    return undefined;
  }
  return hit.location;
}

function rememberIpLocation(
  ip: string,
  location: GeographicLocation | null,
) {
  if (ipGeoCache.size >= IP_GEO_CACHE_MAX) {
    const now = Date.now();
    for (const [key, value] of ipGeoCache) {
      if (value.expiresAt <= now) ipGeoCache.delete(key);
    }
    if (ipGeoCache.size >= IP_GEO_CACHE_MAX) ipGeoCache.clear();
  }
  ipGeoCache.set(ip, {
    location,
    expiresAt:
      Date.now() + (location ? IP_GEO_TTL_MS : IP_GEO_NEGATIVE_TTL_MS),
  });
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) || null
    : null;
}

function canonicalCity(value: unknown) {
  return clean(value, 80)?.replace(/\s+city$/i, "") ?? null;
}

export async function geolocateIp(
  ip: string,
): Promise<GeographicLocation | null> {
  const cached = cachedIpLocation(ip);
  if (cached !== undefined) return cached;

  const template = process.env.VISITOR_GEOLOOKUP_URL || "https://ipwho.is/{ip}";
  if (!template.includes("{ip}")) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);

  try {
    const response = await fetch(
      template.replace("{ip}", encodeURIComponent(ip)),
      { signal: controller.signal, cache: "no-store" },
    );
    const data = (await response.json()) as {
      city?: unknown;
      country_code?: unknown;
      region?: unknown;
      success?: unknown;
    };

    if (!response.ok || data.success === false) {
      rememberIpLocation(ip, null);
      return null;
    }

    const countryCode = clean(data.country_code, 2)?.toUpperCase() ?? null;
    const location = {
      city: canonicalCity(data.city),
      region: clean(data.region, 80),
      countryCode,
    };
    const resolved =
      location.city || location.region || location.countryCode
        ? location
        : null;
    rememberIpLocation(ip, resolved);
    return resolved;
  } catch {
    rememberIpLocation(ip, null);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function countryName(countryCode: string | null) {
  if (!countryCode) return "Location unavailable";
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) ||
      countryCode
    );
  } catch {
    return countryCode;
  }
}
