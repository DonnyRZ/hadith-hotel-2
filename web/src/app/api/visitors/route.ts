export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getClientIp, hashIp, isSameOrigin } from "@/lib/visitorIdentity";

type CityMetric = { city: string; region: string | null; count: number };
type Overview = {
  count: number;
  activeVisitors: number;
  cities: number;
  topCities: CityMetric[];
};

const GEO_REFRESH_MS = 30 * 24 * 60 * 60 * 1000;
const ACTIVE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const defaultMajorCities = [
  "Jakarta", "West Jakarta", "East Jakarta", "South Jakarta",
  "North Jakarta", "Central Jakarta", "Bandung", "Surabaya", "Medan",
  "Semarang", "Makassar", "Palembang", "Bekasi", "Depok", "Tangerang",
  "South Tangerang", "Bogor", "Yogyakarta", "Malang", "Denpasar", "Batam",
  "Pekanbaru", "Samarinda", "Balikpapan", "Banjarmasin", "Padang",
  "Bandar Lampung", "Pontianak", "Manado", "Tashkent", "Samarkand",
  "Bukhara", "Namangan",
];

function response(overview: Overview | null, status = 200) {
  return Response.json(overview, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function majorCities() {
  const configured = process.env.VISITOR_MAJOR_CITIES?.split(",")
    .map((city) => city.trim())
    .filter(Boolean);
  return new Set(
    (configured?.length ? configured : defaultMajorCities).map((city) =>
      city.toLocaleLowerCase(),
    ),
  );
}

function canonicalCity(city: string) {
  return city.trim().replace(/\s+city$/i, "");
}

async function geolocate(ip: string) {
  const template = process.env.VISITOR_GEOLOOKUP_URL || "https://ipwho.is/{ip}";
  if (!template.includes("{ip}")) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  try {
    const result = await fetch(template.replace("{ip}", encodeURIComponent(ip)), {
      signal: controller.signal,
    });
    const location = (await result.json()) as {
      city?: unknown;
      country_code?: unknown;
      region?: unknown;
      success?: unknown;
    };
    if (!result.ok || location.success === false || typeof location.city !== "string") {
      return null;
    }
    const city = canonicalCity(location.city);
    if (!majorCities().has(city.toLocaleLowerCase())) return null;
    return {
      city,
      countryCode:
        typeof location.country_code === "string"
          ? location.country_code.slice(0, 2).toUpperCase()
          : null,
      region:
        typeof location.region === "string"
          ? location.region.trim().slice(0, 80)
          : null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function visitorOverview(): Promise<Overview> {
  const activeSince = new Date(Date.now() - ACTIVE_WINDOW_MS);
  const [count, activeVisitors, cityGroups, topGroups] = await Promise.all([
    prisma.websiteVisitor.count(),
    prisma.websiteVisitor.count({ where: { lastSeenAt: { gte: activeSince } } }),
    prisma.websiteVisitor.groupBy({
      by: ["city"],
      where: { city: { not: null } },
      _count: { _all: true },
    }),
    prisma.websiteVisitor.groupBy({
      by: ["city", "region"],
      where: { city: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { city: "desc" } },
      take: 8,
    }),
  ]);

  return {
    count,
    activeVisitors,
    cities: cityGroups.length,
    topCities: topGroups
      .filter((row): row is typeof row & { city: string } => row.city !== null)
      .map((row) => ({
        city: row.city,
        region: row.region,
        count: row._count._all,
      }))
      .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
      .slice(0, 8),
  };
}

async function registerVisitor(ip: string, visitorHash: string) {
  const existing = await prisma.websiteVisitor.findUnique({
    where: { visitorHash },
    select: {
      city: true,
      region: true,
      countryCode: true,
      geoCheckedAt: true,
    },
  });
  const now = new Date();
  const needsGeo =
    !existing?.geoCheckedAt ||
    existing.geoCheckedAt.getTime() < Date.now() - GEO_REFRESH_MS;
  const location = needsGeo ? await geolocate(ip) : null;

  if (existing) {
    await prisma.websiteVisitor.update({
      where: { visitorHash },
      data: {
        lastSeenAt: now,
        ...(needsGeo
          ? {
              city: location?.city ?? existing.city ?? null,
              region: location?.region ?? existing.region ?? null,
              countryCode: location?.countryCode ?? existing.countryCode ?? null,
              geoCheckedAt: now,
            }
          : {}),
      },
    });
    return;
  }

  await prisma.websiteVisitor.create({
    data: {
      visitorHash,
      lastSeenAt: now,
      city: location?.city ?? null,
      region: location?.region ?? null,
      countryCode: location?.countryCode ?? null,
      geoCheckedAt: now,
    },
  });
}

export async function GET() {
  if (!process.env.VISITOR_IP_HASH_SECRET) return response(null, 503);
  try {
    return response(await visitorOverview());
  } catch (error) {
    console.error("Visitor counter read failed", error);
    return response(null, 503);
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return response(null, 403);
  if (!process.env.VISITOR_IP_HASH_SECRET) return response(null, 503);

  try {
    const ip = getClientIp(request);
    if (ip) await registerVisitor(ip, await hashIp(ip));
    return response(await visitorOverview());
  } catch (error) {
    console.error("Visitor counter write failed", error);
    return response(null, 503);
  }
}
