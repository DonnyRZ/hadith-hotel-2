export type CityMetric = {
  city: string;
  region: string | null;
  count: number;
};

export type VisitorMetrics = {
  activeVisitors: number;
  cities: number;
  count: number;
  topCities: CityMetric[];
};

export type DownloadMetrics = {
  totalDownloads: number;
  uniqueDownloaders: number;
};

export type GeographicMetric = {
  name: string;
  context: string | null;
  count: number;
};

export type GeographicBreakdown = {
  totalRecorded: number;
  locatedRecords: number;
  unclassified: number;
  topCities: GeographicMetric[];
  topRegions: GeographicMetric[];
  topCountries: GeographicMetric[];
};

let registration: Promise<VisitorMetrics | null> | null = null;

function isVisitorMetrics(value: unknown): value is VisitorMetrics {
  if (!value || typeof value !== "object") return false;
  const metrics = value as Partial<VisitorMetrics>;
  return (
    typeof metrics.count === "number" &&
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
    typeof metrics.uniqueDownloaders === "number"
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
  registration ??= fetch("/api/visitors", { method: "POST", cache: "no-store" })
    .then((result) => (result.ok ? result.json() : null))
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
  return fetch("/api/downloads/profile", {
    method: "POST",
    cache: "no-store",
    keepalive: true,
  })
    .then((result) => (result.ok ? result.json() : null))
    .then((result: unknown) => (isDownloadMetrics(result) ? result : null))
    .catch(() => null);
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
