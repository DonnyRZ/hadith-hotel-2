import type {
  DownloadMetrics,
  GeographicBreakdown,
  VisitorMetrics,
} from "@/lib/metricsContract";

export type {
  CityMetric,
  DownloadMetrics,
  GeographicBreakdown,
  GeographicMetric,
  VisitorMetrics,
} from "@/lib/metricsContract";

let registration: Promise<VisitorMetrics | null> | null = null;

function isVisitorMetrics(value: unknown): value is VisitorMetrics {
  if (!value || typeof value !== "object") return false;
  const metrics = value as Partial<VisitorMetrics>;
  return (
    typeof metrics.count === "number" &&
    typeof metrics.viewEvents === "number" &&
    typeof metrics.activeVisitors === "number" &&
    typeof metrics.cities === "number" &&
    Array.isArray(metrics.topCities)
  );
}

function isDownloadMetrics(value: unknown): value is DownloadMetrics {
  if (!value || typeof value !== "object") return false;
  const metrics = value as Partial<DownloadMetrics>;
  return (
    typeof metrics.totalDownloads === "number" &&
    typeof metrics.uniqueDownloaders === "number" &&
    typeof metrics.downloadEvents === "number"
  );
}

function isGeographicBreakdown(
  value: unknown,
): value is GeographicBreakdown {
  if (!value || typeof value !== "object") return false;
  const breakdown = value as Partial<GeographicBreakdown>;
  return (
    typeof breakdown.totalRecorded === "number" &&
    typeof breakdown.locatedRecords === "number" &&
    typeof breakdown.unclassified === "number" &&
    Array.isArray(breakdown.topCities) &&
    Array.isArray(breakdown.topRegions) &&
    Array.isArray(breakdown.topCountries)
  );
}

export function registerVisitor() {
  registration ??= postWithIdentityRetry("/api/visitors")
    .then((result: unknown) => (isVisitorMetrics(result) ? result : null))
    .catch(() => null);
  return registration;
}

export function fetchVisitorMetrics() {
  return fetch("/api/visitors", { cache: "no-store" })
    .then((result) => (result.ok ? result.json() : null))
    .then((result: unknown) => (isVisitorMetrics(result) ? result : null))
    .catch(() => null);
}

export function trackProfileDownload() {
  return registerVisitor()
    .then(() => postWithIdentityRetry("/api/downloads/profile"))
    .then((result: unknown) => (isDownloadMetrics(result) ? result : null))
    .catch(() => null);
}

async function postWithIdentityRetry(endpoint: string): Promise<unknown> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      keepalive: true,
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { identityPending?: boolean };
    if (!payload.identityPending) return payload;
  }
  return null;
}

export function fetchDownloadMetrics() {
  return fetch("/api/downloads/profile", { cache: "no-store" })
    .then((result) => (result.ok ? result.json() : null))
    .then((result: unknown) => (isDownloadMetrics(result) ? result : null))
    .catch(() => null);
}

export function fetchGeographicBreakdown(
  metric: "downloads" | "visitors",
) {
  const endpoint =
    metric === "downloads"
      ? "/api/downloads/profile/geography"
      : "/api/visitors/geography";

  return fetch(endpoint, { cache: "no-store" })
    .then((result) => (result.ok ? result.json() : null))
    .then((result: unknown) =>
      isGeographicBreakdown(result) ? result : null,
    )
    .catch(() => null);
}
