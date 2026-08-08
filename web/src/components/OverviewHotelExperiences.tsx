"use client";

import SiteImage from "@/components/SiteImage";
import { Link } from "@/i18n/navigation";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

type FeatureSlide = {
  id: string;
  key: string;
  href: string;
  src: string;
};

const slides: FeatureSlide[] = [
  {
    id: "suites-rooms",
    key: "suitesRooms",
    href: "/suites-rooms",
    src: "/images/overview-hero/junior-suite.webp",
  },
  {
    id: "cafe-dining",
    key: "cafeDining",
    href: "/cafe-dining",
    src: "/images/cafe-dining/cafe-1.webp",
  },
  {
    id: "experience",
    key: "experience",
    href: "/experience",
    src: "/images/overview-hero/pool.webp",
  },
  {
    id: "meetings-weddings",
    key: "meetingsWeddings",
    href: "/meetings-weddings",
    src: "/images/overview-features/meetings-weddings.webp",
  },
];

function FeatureMedia({
  slide,
  title,
}: {
  slide: FeatureSlide;
  title: string;
}) {
  return (
    <div className="overview-features__media">
      <SiteImage
        className="overview-features__image"
        src={slide.src}
        alt={title}
        fill
        sizes="(max-width: 720px) 100vw, 60vw"
      />
    </div>
  );
}

export function OverviewHotelExperiences() {
  const t = useTranslations("overview.experiences");
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const wrap = useCallback(
    (value: number) => ((value % count) + count) % count,
    [count],
  );

  const goPrevious = () => setIndex((current) => wrap(current - 1));
  const goNext = () => setIndex((current) => wrap(current + 1));

  const previous = slides[wrap(index - 1)]!;
  const current = slides[index]!;
  const next = slides[wrap(index + 1)]!;
  const progress = ((index + 1) / count) * 100;

  const titleFor = (slide: FeatureSlide) => t(`slides.${slide.key}`);

  return (
    <section
      className="overview-features"
      aria-labelledby="overview-features-heading"
    >
      <div className="overview-features__intro">
        <div>
          <p className="overview-features__lede">{t("lede")}</p>
          <h2 id="overview-features-heading" className="overview-features__heading">
            {t("heading")}
          </h2>
        </div>
        <p className="overview-features__intro-copy">{t("introCopy")}</p>
      </div>

      <div
        className="overview-features__carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label={t("carouselAria")}
      >
        <div className="overview-features__stage">
          <button
            type="button"
            className="overview-features__side overview-features__side--previous"
            onClick={goPrevious}
            aria-label={t("prevSlideAria", { title: titleFor(previous) })}
          >
            <FeatureMedia slide={previous} title={titleFor(previous)} />
          </button>

          <div className="overview-features__active">
            <FeatureMedia slide={current} title={titleFor(current)} />
            <div className="overview-features__card overview-features__card--compact">
              <p className="overview-features__card-eyebrow">
                {t("cardEyebrow")}
              </p>
              <h3 className="overview-features__card-title">
                {titleFor(current)}
              </h3>
              <Link
                href={current.href}
                className="overview-features__explore"
              >
                {t("explore")}
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="overview-features__side overview-features__side--next"
            onClick={goNext}
            aria-label={t("nextSlideAria", { title: titleFor(next) })}
          >
            <FeatureMedia slide={next} title={titleFor(next)} />
          </button>
        </div>

        <div className="overview-features__controls">
          <button
            type="button"
            className="overview-features__nav overview-features__nav--previous"
            onClick={goPrevious}
          >
            <span aria-hidden="true">‹</span> {t("previous")}
          </button>

          <div
            className="overview-features__progress"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={count}
            aria-valuenow={index + 1}
            aria-label={t("progressAria")}
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <button
            type="button"
            className="overview-features__nav overview-features__nav--next"
            onClick={goNext}
          >
            {t("next")} <span aria-hidden="true">›</span>
          </button>

          <p className="overview-features__counter">
            {index + 1} / {count}
          </p>
        </div>
      </div>
    </section>
  );
}
