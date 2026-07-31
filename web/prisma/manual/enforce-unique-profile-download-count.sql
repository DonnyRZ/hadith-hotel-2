UPDATE "ProfileDownload"
SET "downloadCount" = 1
WHERE "downloadCount" <> 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ProfileDownload_downloadCount_unique_ip_check'
      AND conrelid = '"ProfileDownload"'::regclass
  ) THEN
    ALTER TABLE "ProfileDownload"
      ADD CONSTRAINT "ProfileDownload_downloadCount_unique_ip_check"
      CHECK ("downloadCount" = 1);
  END IF;
END
$$;
