-- One row per counted visit so geography can follow the location of that visit,
-- not the first city stored on the browser row.

CREATE TABLE IF NOT EXISTS "WebsiteVisitorEvent" (
  "id" TEXT NOT NULL,
  "visitorHash" TEXT NOT NULL,
  "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "city" TEXT,
  "region" TEXT,
  "countryCode" TEXT,

  CONSTRAINT "WebsiteVisitorEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "WebsiteVisitorEvent_visitorHash_idx"
  ON "WebsiteVisitorEvent"("visitorHash");
CREATE INDEX IF NOT EXISTS "WebsiteVisitorEvent_seenAt_idx"
  ON "WebsiteVisitorEvent"("seenAt");
CREATE INDEX IF NOT EXISTS "WebsiteVisitorEvent_city_idx"
  ON "WebsiteVisitorEvent"("city");
CREATE INDEX IF NOT EXISTS "WebsiteVisitorEvent_region_idx"
  ON "WebsiteVisitorEvent"("region");
CREATE INDEX IF NOT EXISTS "WebsiteVisitorEvent_countryCode_idx"
  ON "WebsiteVisitorEvent"("countryCode");

COMMENT ON TABLE "WebsiteVisitorEvent" IS
  'Counted site visits. Homepage viewEvents = COUNT(*). Geography groups these rows.';

INSERT INTO "WebsiteVisitorEvent" (
  "id",
  "visitorHash",
  "seenAt",
  "city",
  "region",
  "countryCode"
)
SELECT
  gen_random_uuid()::text,
  v."visitorHash",
  v."lastSeenAt",
  v."city",
  v."region",
  v."countryCode"
FROM "WebsiteVisitor" v
CROSS JOIN generate_series(1, v."viewCount") AS gs(i)
WHERE NOT EXISTS (
  SELECT 1
  FROM "WebsiteVisitorEvent" e
  WHERE e."visitorHash" = v."visitorHash"
);
