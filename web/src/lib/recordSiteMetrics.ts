/** Persist anonymous browser sightings and profile-download clicks. */

import { prisma } from "@/lib/prisma";
import {
  geolocateIp,
  type GeographicLocation,
} from "@/lib/geolocation";
import { UNKNOWN_GEO_RETRY_MS } from "@/lib/metricsContract";

async function lookupLocation(ip: string | null): Promise<GeographicLocation | null> {
  if (!ip) return null;
  try {
    return await geolocateIp(ip);
  } catch (error) {
    console.error("Visitor geolocation failed", error);
    return null;
  }
}

export async function recordVisitorSighting(
  visitorHash: string,
  ip: string | null,
) {
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
  const location = needsGeo ? await lookupLocation(ip) : null;

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
      viewCount: { increment: 1 },
    },
  });
}

export async function recordProfileDownload(
  visitorHash: string,
  ip: string | null,
  documentVersion: string,
) {
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
    (!lastGeoCheck || lastGeoCheck.getTime() < Date.now() - UNKNOWN_GEO_RETRY_MS);
  const freshLocation = shouldLookupLocation ? await lookupLocation(ip) : null;
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
        downloadCount: { increment: 1 },
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
