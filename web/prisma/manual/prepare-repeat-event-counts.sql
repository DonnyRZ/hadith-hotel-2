-- Add viewCount and drop the downloadCount=1 lock so event counting can run.

ALTER TABLE "WebsiteVisitor"
  ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "ProfileDownload"
  DROP CONSTRAINT IF EXISTS "ProfileDownload_downloadCount_unique_ip_check";

COMMENT ON COLUMN "WebsiteVisitor"."viewCount" IS
  'Sightings for this browser. Increments on each full page load after the cookie exists.';

COMMENT ON COLUMN "ProfileDownload"."downloadCount" IS
  'Tracked clicks for this browser + document version. Increments on each tracked click.';
