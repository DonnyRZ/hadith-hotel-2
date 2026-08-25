-- Legacy filename: this used to FORCE downloadCount = 1 and add a CHECK.
-- That lock would block event counting. Running this file now only drops it.

ALTER TABLE "ProfileDownload"
  DROP CONSTRAINT IF EXISTS "ProfileDownload_downloadCount_unique_ip_check";
