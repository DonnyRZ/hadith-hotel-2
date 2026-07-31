ALTER TABLE "ProfileDownload"
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "region" TEXT,
  ADD COLUMN IF NOT EXISTS "countryCode" TEXT,
  ADD COLUMN IF NOT EXISTS "geoCheckedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "ProfileDownload_city_idx"
  ON "ProfileDownload"("city");
CREATE INDEX IF NOT EXISTS "ProfileDownload_region_idx"
  ON "ProfileDownload"("region");
CREATE INDEX IF NOT EXISTS "ProfileDownload_countryCode_idx"
  ON "ProfileDownload"("countryCode");

UPDATE "ProfileDownload" d
SET
  "city" = COALESCE(d."city", v.city),
  "region" = COALESCE(d."region", v.region),
  "countryCode" = COALESCE(d."countryCode", v."countryCode"),
  "geoCheckedAt" = COALESCE(d."geoCheckedAt", v."geoCheckedAt", CURRENT_TIMESTAMP)
FROM "WebsiteVisitor" v
WHERE v."visitorHash" = d."visitorHash";
