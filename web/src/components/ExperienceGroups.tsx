"use client";

import SiteImage from "@/components/SiteImage";
import { ChessStoryFeature } from "@/components/ChessStoryFeature";
import { asset } from "@/lib/asset";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type WellnessSlideConfig = {
  id: string;
  key: string;
  src?: string;
};

const wellnessSlideConfigs: WellnessSlideConfig[] = [
  { id: "spa", key: "spa", src: "/images/experience/massage.webp" },
  { id: "sauna", key: "sauna", src: "/images/experience/sauna.webp" },
  { id: "hammam", key: "hammam", src: "/images/experience/hamam.webp" },
  { id: "pool", key: "pool", src: "/images/experience/pool.webp" },
  { id: "salon", key: "salon", src: "/images/experience/salon.jpeg" },
  { id: "fitness", key: "fitness", src: "/images/experience/gym.webp" },
];

const activeFamilyItemConfigs = [
  { id: "tennis", key: "tennis", src: "/images/experience/tennis.webp" },
  { id: "padel", key: "padel", src: "/images/experience/padel.webp" },
  {
    id: "kids-playground",
    key: "kidsPlayground",
    src: "/images/experience/playground.webp",
  },
];

type ActiveFamilyItem = {
  id: string;
  key: string;
  src: string;
  name: string;
};

type DestinationSlideConfig = {
  id: string;
  src: string;
  position?: string;
  video?: string;
};

type DestinationConfig = { key: string; mapsUrl: string };

type DestinationJourneyConfig = {
  id: string;
  key: string;
  destinations: DestinationConfig[];
  slides: DestinationSlideConfig[];
};

const destinationJourneyConfigs: DestinationJourneyConfig[] = [
  {
    id: "imam-al-bukhari-legacy",
    key: "imamAlBukhariLegacy",
    destinations: [
      {
        key: "mausoleum",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=39.814999,66.944485",
      },
      {
        key: "center",
        mapsUrl:
          "https://www.google.com/maps/search/?api=1&query=Imam+Bukhari+International+Scientific+Research+Center+Samarkand",
      },
    ],
    slides: [
      {
        id: "imam-bukhari-1",
        src: "/images/experience/destinations/imam-bukhari-1.png",
        video: "/videos/imam-al-bukhari-complex.mp4",
      },
      { id: "imam-bukhari-2", src: "/images/experience/destinations/imam-bukhari-2.png" },
      { id: "imam-bukhari-3", src: "/images/experience/destinations/imam-bukhari-3.png" },
      { id: "imam-bukhari-4", src: "/images/experience/destinations/imam-bukhari-4.png" },
      { id: "imam-bukhari-5", src: "/images/experience/destinations/imam-bukhari-5.png" },
    ],
  },
  {
    id: "registan-square",
    key: "registanSquare",
    destinations: [
      {
        key: "square",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=39.6545,66.9758",
      },
      {
        key: "madrasas",
        mapsUrl:
          "https://www.google.com/maps/search/?api=1&query=Ulugh+Beg+Madrasa+Registan+Samarkand",
      },
    ],
    slides: [
      {
        id: "registan-video",
        src: "/images/experience/destinations/registan-poster.jpg",
        video: "/videos/registan-square.mp4",
      },
      { id: "registan-1", src: "/images/experience/destinations/registan-1.png" },
      { id: "registan-2", src: "/images/experience/destinations/registan-2.png" },
      { id: "registan-3", src: "/images/experience/destinations/registan-3.png" },
    ],
  },
];

type ResolvedDestinationSlide = DestinationSlideConfig & { alt: string };

function WellnessMedia({
  title,
  src,
  tone,
  t,
}: {
  title: string;
  src?: string;
  tone: number;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="overview-features__media">
      {src ? (
        <SiteImage
          className="overview-features__image"
          src={src}
          alt={title}
          fill
          sizes="(max-width: 720px) 100vw, 60vw"
        />
      ) : (
        <div
          className={`media-placeholder overview-features__placeholder media-placeholder--tone-${tone}`}
          role="img"
          aria-label={t("wellness.photoSoonAria", { title })}
        >
          <span>{t("wellness.photoSoon")}</span>
        </div>
      )}
    </div>
  );
}

function ActiveFamilyMedia({
  item,
  featured = false,
  t,
}: {
  item: ActiveFamilyItem;
  featured?: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
      className={`overview-rooms__media${featured ? " overview-rooms__media--featured" : ""}`}
    >
      <SiteImage
        className="overview-rooms__image"
        src={item.src}
        alt={item.name}
        fill
        sizes={
          featured ? "(max-width: 960px) 100vw, 58vw" : "(max-width: 960px) 0px, 22vw"
        }
      />
      <span className="experience-active__badge">{t("active.badge")}</span>
    </div>
  );
}

function ActiveFamilyCarousel({
  items,
  t,
}: {
  items: ActiveFamilyItem[];
  t: ReturnType<typeof useTranslations>;
}) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  const wrap = useCallback(
    (value: number) => ((value % count) + count) % count,
    [count],
  );

  const goPrevious = () => setIndex((current) => wrap(current - 1));
  const goNext = () => setIndex((current) => wrap(current + 1));

  const previous = items[wrap(index - 1)]!;
  const current = items[index]!;
  const next = items[wrap(index + 1)]!;
  const progress = ((index + 1) / count) * 100;

  return (
    <div
      className="overview-rooms__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("active.ariaLabel")}
    >
      <div className="overview-rooms__stage">
        <button
          type="button"
          className="overview-rooms__slide overview-rooms__slide--side"
          onClick={goPrevious}
          aria-label={t("active.prevItemAria", { name: previous.name })}
        >
          <ActiveFamilyMedia item={previous} t={t} />
        </button>

        <div
          className="overview-rooms__slide overview-rooms__slide--center"
          aria-current="true"
        >
          <ActiveFamilyMedia item={current} featured t={t} />
        </div>

        <button
          type="button"
          className="overview-rooms__slide overview-rooms__slide--side"
          onClick={goNext}
          aria-label={t("active.nextItemAria", { name: next.name })}
        >
          <ActiveFamilyMedia item={next} t={t} />
        </button>
      </div>

      <div className="overview-rooms__meta-row">
        <div className="overview-rooms__meta-spacer" aria-hidden="true" />
        <div className="overview-rooms__meta">
          <p className="overview-rooms__room-name">{current.name}</p>
        </div>
        <div className="overview-rooms__meta-spacer" aria-hidden="true" />
      </div>

      <div className="overview-rooms__controls">
        <button
          type="button"
          className="overview-rooms__nav overview-rooms__nav--prev"
          onClick={goPrevious}
          aria-label={t("active.prevFacilityAria")}
        >
          <span aria-hidden="true">‹</span> {t("active.previous")}
        </button>

        <div
          className="overview-rooms__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={count}
          aria-valuenow={index + 1}
          aria-label={t("active.progressAria")}
        >
          <span
            className="overview-rooms__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          className="overview-rooms__nav overview-rooms__nav--next"
          onClick={goNext}
          aria-label={t("active.nextFacilityAria")}
        >
          {t("active.next")} <span aria-hidden="true">›</span>
        </button>

        <p className="overview-rooms__counter">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(count).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

function WellnessCarousel({
  slides,
  t,
}: {
  slides: Array<{ id: string; title: string; src?: string }>;
  t: ReturnType<typeof useTranslations>;
}) {
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

  return (
    <div
      className="overview-features__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("wellness.ariaLabel")}
    >
      <div className="overview-features__stage">
        <button
          type="button"
          className="overview-features__side overview-features__side--previous"
          onClick={goPrevious}
          aria-label={t("wellness.prevSlideAria", { title: previous.title })}
        >
          <WellnessMedia
            title={previous.title}
            src={previous.src}
            tone={(wrap(index - 1) % 3) + 1}
            t={t}
          />
        </button>

        <div className="overview-features__active">
          <WellnessMedia title={current.title} src={current.src} tone={(index % 3) + 1} t={t} />
          <div className="overview-features__card overview-features__card--compact">
            <p className="overview-features__card-eyebrow">{t("wellness.cardEyebrow")}</p>
            <h3 className="overview-features__card-title">{current.title}</h3>
          </div>
        </div>

        <button
          type="button"
          className="overview-features__side overview-features__side--next"
          onClick={goNext}
          aria-label={t("wellness.nextSlideAria", { title: next.title })}
        >
          <WellnessMedia
            title={next.title}
            src={next.src}
            tone={(wrap(index + 1) % 3) + 1}
            t={t}
          />
        </button>
      </div>

      <div className="overview-features__controls">
        <button
          type="button"
          className="overview-features__nav overview-features__nav--previous"
          onClick={goPrevious}
        >
          <span aria-hidden="true">‹</span> {t("wellness.previous")}
        </button>

        <div
          className="overview-features__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={count}
          aria-valuenow={index + 1}
          aria-label={t("wellness.progressAria")}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <button
          type="button"
          className="overview-features__nav overview-features__nav--next"
          onClick={goNext}
        >
          {t("wellness.next")} <span aria-hidden="true">›</span>
        </button>

        <p className="overview-features__counter">
          {index + 1} / {count}
        </p>
      </div>
    </div>
  );
}

function DestinationCarousel({
  slides,
  title,
  t,
}: {
  slides: ResolvedDestinationSlide[];
  title: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const [index, setIndex] = useState(0);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const count = slides.length;
  const progress = ((index + 1) / count) * 100;

  const goPrevious = () =>
    setIndex((currentIndex) => (currentIndex - 1 + count) % count);
  const goNext = () =>
    setIndex((currentIndex) => (currentIndex + 1) % count);

  useEffect(() => {
    slides.forEach((slide, slideIndex) => {
      const video = videoRefs.current[slide.id];
      if (!video) return;
      if (slideIndex !== index) {
        video.pause();
        return;
      }

      const paintFirstFrame = () => {
        const onSeeked = () => {
          video.pause();
          video.removeEventListener("seeked", onSeeked);
        };
        video.pause();
        video.addEventListener("seeked", onSeeked);
        try {
          video.currentTime = video.currentTime >= 0.05 ? 0 : 0.05;
        } catch {
          video.removeEventListener("seeked", onSeeked);
        }
      };

      if (video.readyState >= 2) paintFirstFrame();
      else video.addEventListener("loadeddata", paintFirstFrame, { once: true });
    });
  }, [index, slides]);

  return (
    <div
      className="destination-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("destinations.galleryAria", { title })}
    >
      <div className="destination-carousel__viewport">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;

          return (
            <div
              key={slide.id}
              className={`destination-carousel__slide${isActive ? " is-active" : ""}`}
              aria-hidden={!isActive}
            >
              {slide.video ? (
                isActive ? (
                  <video
                    ref={(node) => {
                      videoRefs.current[slide.id] = node;
                    }}
                    className="destination-carousel__video"
                    src={asset(slide.video)}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={slide.alt}
                  />
                ) : (
                  <SiteImage
                    className="destination-carousel__image"
                    src={slide.src}
                    alt=""
                    fill
                    sizes="(max-width: 920px) 100vw, 58vw"
                    style={{ objectPosition: slide.position ?? "50% 50%" }}
                  />
                )
              ) : (
                <SiteImage
                  className="destination-carousel__image"
                  src={slide.src}
                  alt={isActive ? slide.alt : ""}
                  fill
                  sizes="(max-width: 920px) 100vw, 58vw"
                  style={{ objectPosition: slide.position ?? "50% 50%" }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="destination-carousel__controls">
        <button
          type="button"
          className="destination-carousel__nav"
          onClick={goPrevious}
          aria-label={t("destinations.prevMediaAria", { title })}
        >
          <span aria-hidden="true">‹</span> {t("destinations.previous")}
        </button>

        <div
          className="destination-carousel__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={count}
          aria-valuenow={index + 1}
          aria-label={t("destinations.galleryProgressAria", { title })}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <button
          type="button"
          className="destination-carousel__nav"
          onClick={goNext}
          aria-label={t("destinations.nextMediaAria", { title })}
        >
          {t("destinations.next")} <span aria-hidden="true">›</span>
        </button>

        <p className="destination-carousel__counter" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

function DestinationsSection({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <section
      id="destinations"
      className="experience-destinations"
      aria-labelledby="experience-destinations-heading"
    >
      <div className="experience-destinations__intro">
        <p className="experience-destinations__eyebrow">{t("destinations.eyebrow")}</p>
        <h2
          id="experience-destinations-heading"
          className="experience-group__title"
        >
          {t("destinations.heading")}
        </h2>
        <p className="experience-group__lede">{t("destinations.lede")}</p>
      </div>

      <div className="experience-destinations__journeys">
        {destinationJourneyConfigs.map((journey, journeyIndex) => {
          const base = `destinations.journeys.${journey.key}`;
          const title = t(`${base}.title`);
          const highlights = t.raw(`${base}.highlights`) as string[];
          const slideAlts = t.raw(`${base}.slideAlts`) as string[];
          const resolvedSlides: ResolvedDestinationSlide[] = journey.slides.map(
            (slide, slideIndex) => ({
              ...slide,
              alt: slideAlts[slideIndex] ?? "",
            }),
          );

          return (
            <article
              key={journey.id}
              className={`destination-journey${journeyIndex % 2 === 1 ? " is-reversed" : ""}`}
            >
              <DestinationCarousel slides={resolvedSlides} title={title} t={t} />

              <div className="destination-journey__copy">
                <p className="destination-journey__eyebrow">{t(`${base}.eyebrow`)}</p>
                <h3 className="destination-journey__title">{title}</h3>
                <p className="destination-journey__description">
                  {t(`${base}.description`)}
                </p>

                <dl className="destination-journey__places">
                  {journey.destinations.map((destination) => {
                    const destBase = `${base}.destinations.${destination.key}`;
                    const name = t(`${destBase}.name`);
                    return (
                      <div key={destination.key} className="destination-journey__place">
                        <dt>{name}</dt>
                        <dd>{t(`${destBase}.detail`)}</dd>
                        <a
                          className="destination-journey__maps"
                          href={destination.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t("destinations.mapsAria", { name })}
                        >
                          <span
                            className="destination-journey__maps-icon"
                            aria-hidden="true"
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                              <path
                                d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 12 4.3a6.5 6.5 0 0 0-6.5 6.5C5.5 15.8 12 21 12 21Z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                              />
                              <circle
                                cx="12"
                                cy="10.8"
                                r="2.2"
                                stroke="currentColor"
                                strokeWidth="1.6"
                              />
                            </svg>
                          </span>
                          <span>{t("destinations.maps")}</span>
                        </a>
                      </div>
                    );
                  })}
                </dl>

                <ul
                  className="destination-journey__highlights"
                  aria-label={t("destinations.highlightsAriaLabel")}
                >
                  {highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ExperienceGroups() {
  const t = useTranslations("experience");

  const wellnessSlides = wellnessSlideConfigs.map((slide) => ({
    id: slide.id,
    title: t(`wellness.slides.${slide.key}`),
    src: slide.src,
  }));

  const activeFamilyItems: ActiveFamilyItem[] = activeFamilyItemConfigs.map((item) => ({
    id: item.id,
    key: item.key,
    src: item.src,
    name: t(`active.items.${item.key}`),
  }));

  return (
    <>
      <section
        className="experience-wellness"
        aria-labelledby="experience-wellness-heading"
      >
        <div className="experience-wellness__intro">
          <h2
            id="experience-wellness-heading"
            className="experience-group__title"
          >
            {t("wellness.heading")}
          </h2>
          <p className="experience-group__lede">{t("wellness.lede")}</p>
        </div>

        <WellnessCarousel slides={wellnessSlides} t={t} />
      </section>

      <DestinationsSection t={t} />

      <ChessStoryFeature headingId="experience-chess-story-heading" />

      <section
        className="experience-active"
        id="active"
        aria-labelledby="experience-active-heading"
      >
        <div className="experience-active__intro">
          <h2 id="experience-active-heading" className="experience-group__title">
            {t("active.heading")}
          </h2>
          <p className="experience-group__lede">{t("active.lede")}</p>
        </div>

        <ActiveFamilyCarousel items={activeFamilyItems} t={t} />
      </section>
    </>
  );
}
