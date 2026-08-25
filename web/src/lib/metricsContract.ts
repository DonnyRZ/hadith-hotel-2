/**
 * Product vs storage for visitor and download metrics.
 *
 * Homepage numbers are event totals: viewEvents = COUNT(WebsiteVisitorEvent),
 * downloadEvents = SUM(downloadCount). One row per browser remains on
 * WebsiteVisitor; uniqueVisitors / uniqueDownloaders stay as row counts.
 * Visitor geography ranks visit events (location at the time of that visit).
 */

export type CityMetric = {
  city: string;
  region: string | null;
  count: number;
};

export type VisitorMetrics = {
  /** Unique browsers. */
  count: number;
  uniqueVisitors: number;
  /** COUNT(WebsiteVisitorEvent) — what the homepage shows. */
  viewEvents: number;
  activeVisitors: number;
  cities: number;
  topCities: CityMetric[];
  identityPending?: boolean;
};

export type DownloadMetrics = {
  /** Unique browsers per document version. */
  totalDownloads: number;
  uniqueDownloaders: number;
  /** SUM(downloadCount) — what the homepage shows. */
  downloadEvents: number;
  identityPending?: boolean;
};

export const ACTIVE_VISITOR_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const UNKNOWN_GEO_RETRY_MS = 24 * 60 * 60 * 1000;

export function profileDocumentVersion() {
  return process.env.PROFILE_DOCUMENT_VERSION || "2026-07";
}

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

