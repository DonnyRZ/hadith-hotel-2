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
    const [total, located, cities, regions, countries] = await Promise.all([
      prisma.profileDownload.aggregate({ _sum: { downloadCount: true } }),
      prisma.profileDownload.aggregate({
        where: locatedWhere,
        _sum: { downloadCount: true },
      }),
      prisma.profileDownload.groupBy({
        by: ["city", "countryCode"],
        where: { city: { not: null } },
        _sum: { downloadCount: true },
        orderBy: { _sum: { downloadCount: "desc" } },
        take: TAKE,
      }),
      prisma.profileDownload.groupBy({
        by: ["region", "countryCode"],
        where: { region: { not: null } },
        _sum: { downloadCount: true },
        orderBy: { _sum: { downloadCount: "desc" } },
        take: TAKE,
      }),
      prisma.profileDownload.groupBy({
        by: ["countryCode"],
        where: { countryCode: { not: null } },
        _sum: { downloadCount: true },
        orderBy: { _sum: { downloadCount: "desc" } },
        take: TAKE,
      }),
    ]);

    const totalRecorded = total._sum.downloadCount ?? 0;
    const locatedRecords = located._sum.downloadCount ?? 0;

    return response({
      totalRecorded,
      locatedRecords,
      unclassified: totalRecorded - locatedRecords,
      topCities: cities.map((item) => ({
        name: item.city,
        context: countryName(item.countryCode),
        count: item._sum.downloadCount ?? 0,
      })),
      topRegions: regions.map((item) => ({
        name: item.region,
        context: countryName(item.countryCode),
        count: item._sum.downloadCount ?? 0,
      })),
      topCountries: countries.map((item) => ({
        name: countryName(item.countryCode),
        context: item.countryCode,
        count: item._sum.downloadCount ?? 0,
      })),
    });
  } catch (error) {
    console.error("Profile download geography read failed", error);
    return response(null, 503);
  }
}
