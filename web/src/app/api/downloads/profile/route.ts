export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
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
  const [uniqueDownloaders, aggregate] = await Promise.all([
    prisma.profileDownload.count(),
    prisma.profileDownload.aggregate({ _sum: { downloadCount: true } }),
  ]);

  return {
    totalDownloads: aggregate._sum.downloadCount ?? 0,
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
      await prisma.profileDownload.upsert({
        where: { visitorHash },
        create: { visitorHash, lastDownloadedAt: now, downloadCount: 1 },
        update: {
          lastDownloadedAt: now,
          downloadCount: { increment: 1 },
        },
      });
    }
    return response(await downloadOverview());
  } catch (error) {
    console.error("Profile download track failed", error);
    return response(null, 503);
  }
}
