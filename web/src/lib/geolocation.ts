export type GeographicLocation = {
  city: string | null;
  region: string | null;
  countryCode: string | null;
};

const LOOKUP_TIMEOUT_MS = 2500;

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

    if (!response.ok || data.success === false) return null;

    const countryCode = clean(data.country_code, 2)?.toUpperCase() ?? null;
    const location = {
      city: canonicalCity(data.city),
      region: clean(data.region, 80),
      countryCode,
    };

    return location.city || location.region || location.countryCode
      ? location
      : null;
  } catch {
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
