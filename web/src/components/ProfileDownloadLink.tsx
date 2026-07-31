"use client";

import type { ReactNode } from "react";
import {
  trackProfileDownload,
  type DownloadMetrics,
} from "@/lib/siteMetrics";

const PDF_HREF = "/docs/hadith-hotel-profile-summary.pdf";
const PDF_DOWNLOAD_NAME = "HADITH-Hotel-Profile-Summary.pdf";

type ProfileDownloadLinkProps = {
  className?: string;
  children: ReactNode;
  onTracked?: (metrics: DownloadMetrics) => void;
};

export function ProfileDownloadLink({
  className,
  children,
  onTracked,
}: ProfileDownloadLinkProps) {
  function handleClick() {
    void trackProfileDownload().then((metrics) => {
      if (metrics) onTracked?.(metrics);
    });
  }

  return (
    <a
      href={PDF_HREF}
      download={PDF_DOWNLOAD_NAME}
      className={className}
      onClick={handleClick}
    >
      <span>{children}</span>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
