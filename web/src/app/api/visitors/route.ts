export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  ACTIVE_VISITOR_WINDOW_MS,
  type VisitorMetrics,
} from "@/lib/metricsContract";
import { recordVisitorSighting } from "@/lib/recordSiteMetrics";
import {
  getClientIp,
  hasVisitorSecret,
  isSameOrigin,
  resolveVisitorIdentity,
} from "@/lib/visitorIdentity";

function response(
  overview: VisitorMetrics | null,
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

async function visitorTotals() {
  const activeSince = new Date(Date.now() - ACTIVE_VISITOR_WINDOW_MS);
  const [count, activeVisitors, viewEvents] = await Promise.all([
    prisma.websiteVisitor.count(),
    prisma.websiteVisitor.count({ where: { lastSeenAt: { gte: activeSince } } }),
    prisma.websiteVisitorEvent.count(),
  ]);
  return {
    count,
    uniqueVisitors: count,
    viewEvents,
    activeVisitors,
  };
}

async function visitorOverview(): Promise<VisitorMetrics> {
  const [totals, cityGroups, topGroups] = await Promise.all([
    visitorTotals(),
    prisma.websiteVisitorEvent.groupBy({
      by: ["city"],
      where: { city: { not: null } },
      _count: { id: true },
    }),
    prisma.websiteVisitorEvent.groupBy({
      by: ["city", "region"],
      where: { city: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    }),
  ]);

  return {
    ...totals,
    cities: cityGroups.length,
    topCities: topGroups
      .filter((row): row is typeof row & { city: string } => row.city !== null)
      .map((row) => ({
        city: row.city,
        region: row.region,
        count: row._count.id,
      }))
      .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
      .slice(0, 8),
  };
}

/** POST only needs unique counts for the cookie handshake; skip geo groupBys. */
async function visitorWriteAck(): Promise<VisitorMetrics> {
  const totals = await visitorTotals();
  return { ...totals, cities: 0, topCities: [] };
}

async function safeWriteAck(): Promise<VisitorMetrics> {
  try {
    return await visitorWriteAck();
  } catch (error) {
    console.error("Visitor counter ack failed", error);
    return {
      count: 0,
      uniqueVisitors: 0,
      viewEvents: 0,
      activeVisitors: 0,
      cities: 0,
      topCities: [],
    };
  }
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
    if (identity.isBot) return response(await safeWriteAck());
    if (!identity.visitorHash) {
      return response(
        { ...(await safeWriteAck()), identityPending: true },
        200,
        identity.setCookie,
      );
    }
    await recordVisitorSighting(identity.visitorHash, getClientIp(request));
    return response(await safeWriteAck());
  } catch (error) {
    console.error("Visitor counter write failed", error);
    return response(null, 503);
  }
}
