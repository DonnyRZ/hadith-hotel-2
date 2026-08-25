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

const locatedWhere = {
  OR: [
    { city: { not: null } },
    { region: { not: null } },
    { countryCode: { not: null } },
  ],
};

export async function GET() {
  if (!hasVisitorSecret()) return response(null, 503);

  try {
    const [totalRecorded, locatedRecords, cities, regions, countries] =
      await Promise.all([
        prisma.profileDownloadEvent.count(),
        prisma.profileDownloadEvent.count({ where: locatedWhere }),
        prisma.profileDownloadEvent.groupBy({
          by: ["city", "countryCode"],
          where: { city: { not: null } },
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: TAKE,
        }),
        prisma.profileDownloadEvent.groupBy({
          by: ["region", "countryCode"],
          where: { region: { not: null } },
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: TAKE,
        }),
        prisma.profileDownloadEvent.groupBy({
          by: ["countryCode"],
          where: { countryCode: { not: null } },
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
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
        count: item._count.id,
      })),
      topRegions: regions.map((item) => ({
        name: item.region,
        context: countryName(item.countryCode),
        count: item._count.id,
      })),
      topCountries: countries.map((item) => ({
        name: countryName(item.countryCode),
        context: item.countryCode,
        count: item._count.id,
      })),
    });
  } catch (error) {
    console.error("Profile download geography read failed", error);
    return response(null, 503);
  }
}
