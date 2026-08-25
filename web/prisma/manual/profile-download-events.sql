-- One row per counted profile download so geography follows the click
-- location, not the first city stored on the downloader row.

CREATE TABLE IF NOT EXISTS "ProfileDownloadEvent" (
  "id" TEXT NOT NULL,
  "visitorHash" TEXT NOT NULL,
  "documentVersion" TEXT NOT NULL,
  "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "city" TEXT,
  "region" TEXT,
  "countryCode" TEXT,

  CONSTRAINT "ProfileDownloadEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProfileDownloadEvent_visitorHash_idx"
  ON "ProfileDownloadEvent"("visitorHash");
CREATE INDEX IF NOT EXISTS "ProfileDownloadEvent_documentVersion_idx"
  ON "ProfileDownloadEvent"("documentVersion");
CREATE INDEX IF NOT EXISTS "ProfileDownloadEvent_downloadedAt_idx"
  ON "ProfileDownloadEvent"("downloadedAt");
CREATE INDEX IF NOT EXISTS "ProfileDownloadEvent_city_idx"
  ON "ProfileDownloadEvent"("city");
CREATE INDEX IF NOT EXISTS "ProfileDownloadEvent_region_idx"
  ON "ProfileDownloadEvent"("region");
CREATE INDEX IF NOT EXISTS "ProfileDownloadEvent_countryCode_idx"
  ON "ProfileDownloadEvent"("countryCode");

COMMENT ON TABLE "ProfileDownloadEvent" IS
  'Counted profile downloads. Homepage downloadEvents = COUNT(*). Geography groups these rows.';

INSERT INTO "ProfileDownloadEvent" (
  "id",
  "visitorHash",
  "documentVersion",
  "downloadedAt",
  "city",
  "region",
  "countryCode"
)
SELECT
  gen_random_uuid()::text,
  d."visitorHash",
  d."documentVersion",
  d."lastDownloadedAt",
  d."city",
  d."region",
  d."countryCode"
FROM "ProfileDownload" d
CROSS JOIN generate_series(1, d."downloadCount") AS gs(i)
WHERE NOT EXISTS (
  SELECT 1
  FROM "ProfileDownloadEvent" e
  WHERE e."visitorHash" = d."visitorHash"
    AND e."documentVersion" = d."documentVersion"
);
