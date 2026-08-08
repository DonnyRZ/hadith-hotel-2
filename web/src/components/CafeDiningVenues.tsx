"use client";

import SiteImage from "@/components/SiteImage";
import { useState } from "react";
import { useTranslations } from "next-intl";

type GallerySlide = { src: string; labelKey: string };

type Venue = {
  id: string;
  key: string;
  website?: string;
  variant: "blue" | "paper";
  reversed?: boolean;
  gallery: GallerySlide[];
};

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
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

const venues: Venue[] = [
  {
    id: "restaurant",
    key: "restaurant",
    website: "https://saji-nusantara.com/",
    variant: "blue",
    gallery: [
      { src: "/images/cafe-dining/saji-nusantara.webp", labelKey: "diningRoom" },
      { src: "/images/cafe-dining/buffet.webp", labelKey: "buffetCounter" },
    ],
  },
  {
    id: "cafe",
    key: "cafe",
    website: "https://7oz-espresso.com/",
    variant: "paper",
    reversed: true,
    gallery: [
      { src: "/images/cafe-dining/cafe-1.webp", labelKey: "counterLounge" },
      { src: "/images/cafe-dining/cafe-2.webp", labelKey: "coffeeBar" },
    ],
  },
];

function VenueMediaCarousel({
  venue,
  name,
  t,
}: {
  venue: Venue;
  name: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const slides = venue.gallery;
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const wrap = (value: number) => (value + count) % count;
  const progress = ((index + 1) / count) * 100;
  const slide = slides[index]!;
  const slideLabel = t(`venues.${venue.key}.gallery.${slide.labelKey}`);

  return (
    <div
      className="venue-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("carousel.ariaLabel", { name })}
    >
      <div
        className="venue__placeholder venue-carousel__slide venue-carousel__slide--photo"
        role="img"
        aria-label={slideLabel}
      >
        <SiteImage
          className="venue-carousel__image"
          src={slide.src}
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 58vw"
          priority={venue.id === "restaurant"}
          aria-hidden="true"
        />
      </div>

      <div className="venue-carousel__controls">
        <button
          type="button"
          className="venue-carousel__nav"
          onClick={() => setIndex((current) => wrap(current - 1))}
          aria-label={t("carousel.prevPhotoAria", { name })}
        >
          <span aria-hidden="true">‹</span> {t("carousel.previous")}
        </button>

        <div className="venue-carousel__progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <button
          type="button"
          className="venue-carousel__nav"
          onClick={() => setIndex((current) => wrap(current + 1))}
          aria-label={t("carousel.nextPhotoAria", { name })}
        >
          {t("carousel.next")} <span aria-hidden="true">›</span>
        </button>

        <p className="venue-carousel__counter">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

export function CafeDiningVenues() {
  const t = useTranslations("cafeDining");

  return (
    <>
      {venues.map((venue) => {
        const base = `venues.${venue.key}`;
        const name = t(`${base}.name`);
        const subname = t.has(`${base}.subname`) ? t(`${base}.subname`) : null;
        const highlights = t.raw(`${base}.highlights`) as string[];

        return (
          <section
            key={venue.id}
            className={`venue venue--${venue.variant}`}
            aria-labelledby={`venue-heading-${venue.id}`}
          >
            <div className="venue__inner">
              <h2 id={`venue-heading-${venue.id}`} className="venue__heading">
                {t(`${base}.heading`)}
              </h2>

              <div className={`venue__layout${venue.reversed ? " is-reversed" : ""}`}>
                <div className="venue__media">
                  <VenueMediaCarousel venue={venue} name={name} t={t} />
                </div>

                <div className="venue__card">
                  <h3 className="venue__name">{name}</h3>
                  {subname ? (
                    <p className="venue__subname">{subname}</p>
                  ) : null}
                  <p className="venue__body">{t(`${base}.description`)}</p>

                  <ul className="venue__highlights">
                    {highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>

                  {venue.website ? (
                    <a
                      className="venue__website"
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLinkIcon />
                      <span>{t("openWebsite")}</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
