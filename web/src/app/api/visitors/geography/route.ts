export const dynamic = "force-dynamic";

import { countryName } from "@/lib/geolocation";
import { prisma } from "@/lib/prisma";
import { hasVisitorSecret } from "@/lib/visitorIdentity";

const TAKE = 8;

function response(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  if (!hasVisitorSecret()) return response(null, 503);

  try {
    const [totalRecorded, locatedRecords, cities, regions, countries] =
      await Promise.all([
        prisma.websiteVisitor.count(),
        prisma.websiteVisitor.count({
          where: {
            OR: [
              { city: { not: null } },
              { region: { not: null } },
              { countryCode: { not: null } },
            ],
          },
        }),
        prisma.websiteVisitor.groupBy({
          by: ["city", "countryCode"],
          where: { city: { not: null } },
          _count: { city: true },
          orderBy: { _count: { city: "desc" } },
          take: TAKE,
        }),
        prisma.websiteVisitor.groupBy({
          by: ["region", "countryCode"],
          where: { region: { not: null } },
          _count: { region: true },
          orderBy: { _count: { region: "desc" } },
          take: TAKE,
        }),
        prisma.websiteVisitor.groupBy({
          by: ["countryCode"],
          where: { countryCode: { not: null } },
          _count: { countryCode: true },
          orderBy: { _count: { countryCode: "desc" } },
          take: TAKE,
        }),
      ]);

    return response({
      totalRecorded,
      locatedRecords,
      unclassified: totalRecorded - locatedRecords,
      topCities: cities.map((item) => ({
        name: item.city,
        context: countryName(item.countryCode),
        count: item._count.city,
      })),
      topRegions: regions.map((item) => ({
        name: item.region,
        context: countryName(item.countryCode),
        count: item._count.region,
      })),
      topCountries: countries.map((item) => ({
        name: countryName(item.countryCode),
        context: item.countryCode,
        count: item._count.countryCode,
      })),
    });
  } catch (error) {
    console.error("Visitor geography read failed", error);
    return response(null, 503);
  }
}
