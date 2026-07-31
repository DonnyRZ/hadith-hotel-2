export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { geolocateIp } from "@/lib/geolocation";
import {
  getClientIp,
  hasVisitorSecret,
  isSameOrigin,
  resolveVisitorIdentity,
} from "@/lib/visitorIdentity";

type CityMetric = { city: string; region: string | null; count: number };
type Overview = {
  count: number;
  activeVisitors: number;
  cities: number;
  topCities: CityMetric[];
  identityPending?: boolean;
};

const ACTIVE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function response(
  overview: Overview | null,
  status = 200,
  setCookie: string | null = null,
) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (setCookie) headers.set("Set-Cookie", setCookie);
  return Response.json(overview, {
    status,
    headers,
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

async function registerVisitor(ip: string | null, visitorHash: string) {
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
  const needsGeo = !existing && Boolean(ip);
  const location = needsGeo && ip ? await geolocateIp(ip) : null;
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
  if (!hasVisitorSecret()) return response(null, 503);
  try {
    return response(await visitorOverview());
  } catch (error) {
    console.error("Visitor counter read failed", error);
    return response(null, 503);
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return response(null, 403);
  if (!hasVisitorSecret()) return response(null, 503);

  try {
    const identity = await resolveVisitorIdentity(request);
    if (identity.isBot) return response(await visitorOverview());
    if (!identity.visitorHash) {
      return response(
        { ...(await visitorOverview()), identityPending: true },
        200,
        identity.setCookie,
      );
    }
    await registerVisitor(getClientIp(request), identity.visitorHash);
    return response(await visitorOverview());
  } catch (error) {
    console.error("Visitor counter write failed", error);
    return response(null, 503);
  }
}
