"use client";

import { useTranslations } from "next-intl";
import SiteImage from "@/components/SiteImage";
import { Link } from "@/i18n/navigation";

const SOFT_OPENING_HREF = "/stories/soft-opening";
const SOFT_OPENING_IMAGE = "/images/news/soft-opening-samarkand.webp";

export function SoftOpeningStoryFeature({
  headingId = "soft-opening-story-heading",
}: {
  headingId?: string;
}) {
  const t = useTranslations("stories.softOpening");

  return (
    <section
      className="story-feature story-feature--soft-opening story-feature--reversed"
      aria-labelledby={headingId}
    >
      <div className="story-feature__inner">
        <div className="story-feature__copy">
          <h2 id={headingId} className="story-feature__title">
            {t("title")}
          </h2>
          <p className="story-feature__body">{t("body")}</p>
          <Link className="story-feature__cta" href={SOFT_OPENING_HREF}>
            <span>{t("cta")}</span>
          </Link>
        </div>

        <div className="story-feature__media">
          <SiteImage
            className="story-feature__photo"
            src={SOFT_OPENING_IMAGE}
            alt={t("imageAlt")}
            width={1024}
            height={576}
            sizes="(max-width: 900px) 100vw, 58vw"
          />
        </div>
      </div>
    </section>
  );
}
