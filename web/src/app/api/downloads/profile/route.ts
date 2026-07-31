export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  geolocateIp,
  type GeographicLocation,
} from "@/lib/geolocation";
import { getClientIp, hashIp, isSameOrigin } from "@/lib/visitorIdentity";

type DownloadMetrics = {
  totalDownloads: number;
  uniqueDownloaders: number;
};

function response(metrics: DownloadMetrics | null, status = 200) {
  return Response.json(metrics, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function downloadOverview(): Promise<DownloadMetrics> {
  const uniqueDownloaders = await prisma.profileDownload.count();

  return {
    totalDownloads: uniqueDownloaders,
    uniqueDownloaders,
  };
}

export async function GET() {
  if (!process.env.VISITOR_IP_HASH_SECRET) return response(null, 503);
  try {
    return response(await downloadOverview());
  } catch (error) {
    console.error("Profile download metrics read failed", error);
    return response(null, 503);
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return response(null, 403);
  if (!process.env.VISITOR_IP_HASH_SECRET) return response(null, 503);

  try {
    const ip = getClientIp(request);
    if (ip) {
      const visitorHash = await hashIp(ip);
      const now = new Date();
      const [existingVisitor, existingDownload] = await Promise.all([
        prisma.websiteVisitor.findUnique({
          where: { visitorHash },
          select: { city: true, region: true, countryCode: true },
        }),
        prisma.profileDownload.findUnique({
          where: { visitorHash },
          select: { city: true, region: true, countryCode: true },
        }),
      ]);
      const freshLocation = await geolocateIp(ip);
      const location: GeographicLocation = freshLocation ?? {
        city: existingVisitor?.city ?? null,
        region: existingVisitor?.region ?? null,
        countryCode: existingVisitor?.countryCode ?? null,
      };
      const shouldFillDownloadLocation = !existingDownload?.countryCode;

      await prisma.$transaction([
        prisma.profileDownload.upsert({
          where: { visitorHash },
          create: {
            visitorHash,
            lastDownloadedAt: now,
            downloadCount: 1,
            ...location,
            geoCheckedAt: now,
          },
          update: {
            lastDownloadedAt: now,
            ...(shouldFillDownloadLocation
              ? { ...location, geoCheckedAt: now }
              : {}),
          },
        }),
        prisma.websiteVisitor.upsert({
          where: { visitorHash },
          create: {
            visitorHash,
            lastSeenAt: now,
            ...location,
            geoCheckedAt: now,
          },
          update: {
            lastSeenAt: now,
            ...(freshLocation ? { ...freshLocation, geoCheckedAt: now } : {}),
          },
        }),
      ]);
    }
    return response(await downloadOverview());
  } catch (error) {
    console.error("Profile download track failed", error);
    return response(null, 503);
  }
}
