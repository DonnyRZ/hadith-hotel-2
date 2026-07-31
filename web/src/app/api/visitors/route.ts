export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { geolocateIp } from "@/lib/geolocation";
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

function response(overview: Overview | null, status = 200) {
  return Response.json(overview, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
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
  const refreshWindow = existing?.countryCode
    ? GEO_REFRESH_MS
    : 24 * 60 * 60 * 1000;
  const needsGeo =
    !existing?.geoCheckedAt ||
    existing.geoCheckedAt.getTime() < Date.now() - refreshWindow;
  const location = needsGeo ? await geolocateIp(ip) : null;
  const locationUpdate = location
    ? {
        ...(location.city ? { city: location.city } : {}),
        ...(location.region ? { region: location.region } : {}),
        ...(location.countryCode ? { countryCode: location.countryCode } : {}),
      }
    : {};

  await prisma.websiteVisitor.upsert({
    where: { visitorHash },
    create: {
      visitorHash,
      lastSeenAt: now,
      city: location?.city ?? null,
      region: location?.region ?? null,
      countryCode: location?.countryCode ?? null,
      geoCheckedAt: now,
    },
    update: {
      lastSeenAt: now,
      ...(needsGeo ? { ...locationUpdate, geoCheckedAt: now } : {}),
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
