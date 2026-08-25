/** Persist anonymous browser sightings and profile-download clicks. */

import { prisma } from "@/lib/prisma";
import {
  geolocateIp,
  type GeographicLocation,
} from "@/lib/geolocation";

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
  const now = new Date();
  const location = ip ? await lookupLocation(ip) : null;

  await prisma.$transaction([
    prisma.websiteVisitor.upsert({
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
    }),
    prisma.websiteVisitorEvent.create({
      data: {
        visitorHash,
        seenAt: now,
        city: location?.city ?? null,
        region: location?.region ?? null,
        countryCode: location?.countryCode ?? null,
      },
    }),
  ]);
}

export async function recordProfileDownload(
  visitorHash: string,
  ip: string | null,
  documentVersion: string,
) {
  const now = new Date();
  const existingVisitor = await prisma.websiteVisitor.findUnique({
    where: { visitorHash },
    select: { visitorHash: true },
  });
  const location = ip ? await lookupLocation(ip) : null;
  const geo = {
    city: location?.city ?? null,
    region: location?.region ?? null,
    countryCode: location?.countryCode ?? null,
  };

  await prisma.$transaction([
    prisma.profileDownload.upsert({
      where: { visitorHash_documentVersion: { visitorHash, documentVersion } },
      create: {
        visitorHash,
        documentVersion,
        lastDownloadedAt: now,
        downloadCount: 1,
        ...geo,
        geoCheckedAt: now,
      },
      update: {
        lastDownloadedAt: now,
        downloadCount: { increment: 1 },
      },
    }),
    prisma.websiteVisitor.upsert({
      where: { visitorHash },
      create: {
        visitorHash,
        lastSeenAt: now,
        ...geo,
        geoCheckedAt: now,
      },
      update: {
        lastSeenAt: now,
      },
    }),
    prisma.profileDownloadEvent.create({
      data: {
        visitorHash,
        documentVersion,
        downloadedAt: now,
        ...geo,
      },
    }),
    ...(existingVisitor
      ? []
      : [
          prisma.websiteVisitorEvent.create({
            data: {
              visitorHash,
              seenAt: now,
              ...geo,
            },
          }),
        ]),
  ]);
}
