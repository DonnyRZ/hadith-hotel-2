export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  geolocateIp,
  type GeographicLocation,
} from "@/lib/geolocation";
import {
  getClientIp,
  hasVisitorSecret,
  isSameOrigin,
  resolveVisitorIdentity,
} from "@/lib/visitorIdentity";

type DownloadMetrics = {
  totalDownloads: number;
  uniqueDownloaders: number;
  identityPending?: boolean;
};

const UNKNOWN_GEO_RETRY_MS = 24 * 60 * 60 * 1000;

function response(
  metrics: DownloadMetrics | null,
  status = 200,
  setCookie: string | null = null,
) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (setCookie) headers.set("Set-Cookie", setCookie);
  return Response.json(metrics, {
    status,
    headers,
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
  if (!hasVisitorSecret()) return response(null, 503);
  try {
    return response(await downloadOverview());
  } catch (error) {
    console.error("Profile download metrics read failed", error);
    return response(null, 503);
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return response(null, 403);
  if (!hasVisitorSecret()) return response(null, 503);

  try {
    const identity = await resolveVisitorIdentity(request);
    if (identity.isBot) return response(await downloadOverview());
    if (!identity.visitorHash) {
      return response(
        { ...(await downloadOverview()), identityPending: true },
        200,
        identity.setCookie,
      );
    }
    const ip = getClientIp(request);
    {
      const visitorHash = identity.visitorHash;
      const documentVersion = process.env.PROFILE_DOCUMENT_VERSION || "2026-07";
      const now = new Date();
      const [existingVisitor, existingDownload] = await Promise.all([
        prisma.websiteVisitor.findUnique({
          where: { visitorHash },
          select: {
            city: true,
            region: true,
            countryCode: true,
            geoCheckedAt: true,
          },
        }),
        prisma.profileDownload.findUnique({
          where: { visitorHash_documentVersion: { visitorHash, documentVersion } },
          select: {
            city: true,
            region: true,
            countryCode: true,
            geoCheckedAt: true,
          },
        }),
      ]);
      const cachedLocation: GeographicLocation = {
        city: existingDownload?.city ?? existingVisitor?.city ?? null,
        region: existingDownload?.region ?? existingVisitor?.region ?? null,
        countryCode:
          existingDownload?.countryCode ?? existingVisitor?.countryCode ?? null,
      };
      const lastGeoCheck =
        existingDownload?.geoCheckedAt ?? existingVisitor?.geoCheckedAt ?? null;
      const hasCompleteLocation = Boolean(cachedLocation.countryCode);
      const shouldLookupLocation =
        !hasCompleteLocation &&
        (!lastGeoCheck ||
          lastGeoCheck.getTime() < Date.now() - UNKNOWN_GEO_RETRY_MS);
      const freshLocation = shouldLookupLocation && ip ? await geolocateIp(ip) : null;
      const location: GeographicLocation = freshLocation ?? cachedLocation;
      const locationUpdate = {
        ...(location.city ? { city: location.city } : {}),
        ...(location.region ? { region: location.region } : {}),
        ...(location.countryCode ? { countryCode: location.countryCode } : {}),
      };
      const freshLocationUpdate = freshLocation
        ? {
            ...(freshLocation.city ? { city: freshLocation.city } : {}),
            ...(freshLocation.region ? { region: freshLocation.region } : {}),
            ...(freshLocation.countryCode
              ? { countryCode: freshLocation.countryCode }
              : {}),
          }
        : {};
      const shouldFillDownloadLocation =
        !existingDownload?.countryCode &&
        Boolean(location.city || location.region || location.countryCode);

      await prisma.$transaction([
        prisma.profileDownload.upsert({
          where: { visitorHash_documentVersion: { visitorHash, documentVersion } },
          create: {
            visitorHash,
            documentVersion,
            lastDownloadedAt: now,
            downloadCount: 1,
            ...location,
            geoCheckedAt: now,
          },
          update: {
            lastDownloadedAt: now,
            ...(shouldFillDownloadLocation
              ? { ...locationUpdate, geoCheckedAt: now }
              : shouldLookupLocation
                ? { geoCheckedAt: now }
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
            ...(shouldLookupLocation
              ? { ...freshLocationUpdate, geoCheckedAt: now }
              : {}),
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
