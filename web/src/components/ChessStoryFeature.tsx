"use client";

import { useTranslations } from "next-intl";
import SiteImage from "@/components/SiteImage";
import { Link } from "@/i18n/navigation";

const CHESS_STORY_HREF = "/stories/chess-journey";
const CHESS_STORY_IMAGE = "/images/reviews/chess-journey-samarkand.png";

export function ChessStoryFeature({ headingId = "chess-story-heading" }: { headingId?: string }) {
  const t = useTranslations("reviews.chessStory");

  return (
    <section className="story-feature" aria-labelledby={headingId}>
      <div className="story-feature__inner">
        <div className="story-feature__copy">
          <h2 id={headingId} className="story-feature__title">
            {t("title")}
          </h2>
          <p className="story-feature__body">{t("body")}</p>
          <Link className="story-feature__cta" href={CHESS_STORY_HREF}>
            <span>{t("cta")}</span>
          </Link>
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
