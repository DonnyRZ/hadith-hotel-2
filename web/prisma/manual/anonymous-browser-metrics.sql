ALTER TABLE "ProfileDownload"
  ADD COLUMN IF NOT EXISTS "documentVersion" TEXT NOT NULL DEFAULT 'legacy';

DROP INDEX IF EXISTS "ProfileDownload_visitorHash_key";

CREATE UNIQUE INDEX IF NOT EXISTS "ProfileDownload_visitorHash_documentVersion_key"
  ON "ProfileDownload"("visitorHash", "documentVersion");

COMMENT ON COLUMN "WebsiteVisitor"."visitorHash" IS
  'HMAC hash of an anonymous first-party browser identifier; legacy rows may contain historical IP hashes.';

COMMENT ON COLUMN "ProfileDownload"."visitorHash" IS
  'HMAC hash of an anonymous first-party browser identifier; legacy rows may contain historical IP hashes.';
