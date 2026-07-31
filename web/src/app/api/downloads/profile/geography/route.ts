export const dynamic = "force-dynamic";

import { countryName } from "@/lib/geolocation";
import { prisma } from "@/lib/prisma";

const TAKE = 8;

function response(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  if (!process.env.VISITOR_IP_HASH_SECRET) return response(null, 503);

  try {
    const [totalRecorded, locatedRecords, cities, regions, countries] =
      await Promise.all([
        prisma.profileDownload.count(),
        prisma.profileDownload.count({
          where: {
            OR: [
              { city: { not: null } },
              { region: { not: null } },
              { countryCode: { not: null } },
            ],
          },
        }),
        prisma.profileDownload.groupBy({
          by: ["city", "countryCode"],
          where: { city: { not: null } },
          _count: { city: true },
          orderBy: { _count: { city: "desc" } },
          take: TAKE,
        }),
        prisma.profileDownload.groupBy({
          by: ["region", "countryCode"],
          where: { region: { not: null } },
          _count: { region: true },
          orderBy: { _count: { region: "desc" } },
          take: TAKE,
        }),
        prisma.profileDownload.groupBy({
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
    console.error("Profile download geography read failed", error);
    return response(null, 503);
  }
}
