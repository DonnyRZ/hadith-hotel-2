export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  profileDocumentVersion,
  type DownloadMetrics,
} from "@/lib/metricsContract";
import { recordProfileDownload } from "@/lib/recordSiteMetrics";
import {
  getClientIp,
  hasVisitorSecret,
  isSameOrigin,
  resolveVisitorIdentity,
} from "@/lib/visitorIdentity";

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
  const [uniqueDownloaders, eventSum] = await Promise.all([
    prisma.profileDownload.count(),
    prisma.profileDownload.aggregate({ _sum: { downloadCount: true } }),
  ]);
  const downloadEvents = eventSum._sum.downloadCount ?? 0;

  return {
    totalDownloads: uniqueDownloaders,
    uniqueDownloaders,
    downloadEvents,
  };
}

async function safeDownloadOverview(): Promise<DownloadMetrics> {
  try {
    return await downloadOverview();
  } catch (error) {
    console.error("Profile download metrics ack failed", error);
    return { totalDownloads: 0, uniqueDownloaders: 0, downloadEvents: 0 };
  }
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
    if (identity.isBot) return response(await safeDownloadOverview());
    if (!identity.visitorHash) {
      return response(
        { ...(await safeDownloadOverview()), identityPending: true },
        200,
        identity.setCookie,
      );
    }
    await recordProfileDownload(
      identity.visitorHash,
      getClientIp(request),
      profileDocumentVersion(),
    );
    return response(await safeDownloadOverview());
  } catch (error) {
    console.error("Profile download track failed", error);
    return response(null, 503);
  }
}
