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
