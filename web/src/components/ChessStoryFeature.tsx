"use client";

import { useTranslations } from "next-intl";
import SiteImage from "@/components/SiteImage";

const CHESS_STORY_URL =
  "https://en.chessbase.com/post/chess-journey-uzbekistan-olympiad-2026";
const CHESS_STORY_IMAGE = "/images/reviews/chess-journey-samarkand.png";

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M14 5h5v5M19 5l-8 8M18 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18V9a1.5 1.5 0 0 1 1.5-1.5H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChessStoryFeature({ headingId = "chess-story-heading" }: { headingId?: string }) {
  const t = useTranslations("reviews.chessStory");

  return (
    <section className="story-feature" aria-labelledby={headingId}>
      <div className="story-feature__inner">
        <div className="story-feature__copy">
          <p className="story-feature__eyebrow">{t("eyebrow")}</p>
          <h2 id={headingId} className="story-feature__title">
            {t("title")}
          </h2>
          <p className="story-feature__body">{t("body")}</p>
          <a
            className="story-feature__cta"
            href={CHESS_STORY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{t("cta")}</span>
            <ExternalLinkIcon />
          </a>
        </div>

        <div className="story-feature__media">
          <SiteImage
            className="story-feature__image"
            src={CHESS_STORY_IMAGE}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
          />
        </div>
      </div>
    </section>
  );
}
