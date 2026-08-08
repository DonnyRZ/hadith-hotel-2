"use client";

import { Link } from "@/i18n/navigation";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { HeroMedia, type HeroMediaSlide } from "@/components/HeroMedia";
import { ScrollCue } from "@/components/ScrollCue";

export type PageHeroSlide = HeroMediaSlide;

type PageHeroCarouselProps = {
  title: string;
  slides: readonly PageHeroSlide[];
  intro?: {
    eyebrow: string;
    heading: string;
    body: string;
  };
};

export function PageHeroCarousel({
  title,
  slides,
  intro,
}: PageHeroCarouselProps) {
  const t = useTranslations("common.pageHero");
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const move = useCallback(
    (direction: number) => {
      setIndex((current) => (current + direction + count) % count);
    },
    [count],
  );

  return (
    <section
      className="page-hero"
      aria-label={t("galleryAriaLabel", { title })}
      aria-roledescription="carousel"
    >
      <h1 className="sr-only">{title}</h1>

      <div className="page-hero__viewport">
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            className={`page-hero__slide${slideIndex === index ? " is-active" : ""}`}
            aria-hidden={slideIndex !== index}
          >
            <HeroMedia
              slide={slide}
              priority={slideIndex === 0}
            />
          </div>
        ))}

        {count > 1 ? <div className="page-hero__controls">
          <div className="page-hero__navigation">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label={t("prevAria")}
            >
              <span aria-hidden="true">‹</span>
              {t("previous")}
            </button>

            <div className="page-hero__progress" aria-hidden="true">
              <span style={{ width: `${((index + 1) / count) * 100}%` }} />
            </div>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label={t("nextAria")}
            >
              {t("next")}
              <span aria-hidden="true">›</span>
            </button>
          </div>

          <div className="page-hero__status">
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
            <Link href="/gallery">{t("gallery")}</Link>
          </div>
        </div> : null}

        {intro ? (
          <div className="page-hero__intro">
            <p className="page-hero__intro-eyebrow">{intro.eyebrow}</p>
            <h2 className="page-hero__intro-heading">{intro.heading}</h2>
            <p className="page-hero__intro-body">{intro.body}</p>
          </div>
        ) : null}

        <ScrollCue />
      </div>

      <p className="sr-only" aria-live="polite">
        {t("imageStatus", {
          current: index + 1,
          total: count,
          label: slides[index]?.label ?? "",
        })}
      </p>
    </section>
  );
}
