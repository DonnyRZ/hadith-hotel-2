"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type WellnessSlide = {
  id: string;
  title: string;
  description: string;
  src?: string;
};

const placeholderDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const wellnessSlides: WellnessSlide[] = [
  {
    id: "spa",
    title: "Spa / Massage Suite",
    description: placeholderDescription,
    src: "/images/experience/massage.webp",
  },
  {
    id: "sauna",
    title: "Sauna",
    description: placeholderDescription,
    src: "/images/experience/sauna.webp",
  },
  {
    id: "hammam",
    title: "Turkish Hammam",
    description: placeholderDescription,
    src: "/images/experience/hamam.webp",
  },
  {
    id: "pool",
    title: "Indoor Pool",
    description: placeholderDescription,
    src: "/images/experience/pool.webp",
  },
  { id: "salon", title: "Beauty Salon", description: placeholderDescription },
  {
    id: "fitness",
    title: "Fitness Centre",
    description: placeholderDescription,
    src: "/images/experience/gym.webp",
  },
];

const activeFamilyItems = [
  { id: "tennis", name: "Tennis Court", src: "/images/experience/tennis.webp" },
  { id: "padel", name: "Padel Court", src: "/images/experience/padel.webp" },
  {
    id: "kids-playground",
    name: "Kids’ Playground",
    src: "/images/experience/playground.webp",
  },
];

type ActiveFamilyItem = (typeof activeFamilyItems)[number];

const exploreItems = [
  { id: "imam-al-bukhari", name: "Imam al-Bukhari Memorial Complex" },
  { id: "makhdumi-azam", name: "Makhdumi A’zam Complex" },
  { id: "ulugh-beg-observatory", name: "Ulugh Beg Observatory" },
];

function WellnessMedia({
  slide,
  tone,
}: {
  slide: WellnessSlide;
  tone: number;
}) {
  return (
    <div className="overview-features__media">
      {slide.src ? (
        <Image
          className="overview-features__image"
          src={slide.src}
          alt={slide.title}
          fill
          sizes="(max-width: 720px) 100vw, 60vw"
        />
      ) : (
        <div
          className={`media-placeholder overview-features__placeholder media-placeholder--tone-${tone}`}
          role="img"
          aria-label={`${slide.title} photo coming soon`}
        >
          <span>Photo Coming Soon</span>
        </div>
      )}
    </div>
  );
}

function ActiveFamilyMedia({
  item,
  featured = false,
}: {
  item: ActiveFamilyItem;
  featured?: boolean;
}) {
  return (
    <div
      className={`overview-rooms__media${featured ? " overview-rooms__media--featured" : ""}`}
    >
      <Image
        className="overview-rooms__image"
        src={item.src}
        alt={item.name}
        fill
        sizes={
          featured ? "(max-width: 960px) 100vw, 58vw" : "(max-width: 960px) 0px, 22vw"
        }
      />
      <span className="experience-active__badge">Coming Soon</span>
    </div>
  );
}

function ActiveFamilyCarousel() {
  const [index, setIndex] = useState(0);
  const count = activeFamilyItems.length;

  const wrap = useCallback(
    (value: number) => ((value % count) + count) % count,
    [count],
  );

  const goPrevious = () => setIndex((current) => wrap(current - 1));
  const goNext = () => setIndex((current) => wrap(current + 1));

  const previous = activeFamilyItems[wrap(index - 1)]!;
  const current = activeFamilyItems[index]!;
  const next = activeFamilyItems[wrap(index + 1)]!;
  const progress = ((index + 1) / count) * 100;

  return (
    <div
      className="overview-rooms__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Active and family facilities"
    >
      <div className="overview-rooms__stage">
        <button
          type="button"
          className="overview-rooms__slide overview-rooms__slide--side"
          onClick={goPrevious}
          aria-label={`Previous: ${previous.name}`}
        >
          <ActiveFamilyMedia item={previous} />
        </button>

        <div
          className="overview-rooms__slide overview-rooms__slide--center"
          aria-current="true"
        >
          <ActiveFamilyMedia item={current} featured />
        </div>

        <button
          type="button"
          className="overview-rooms__slide overview-rooms__slide--side"
          onClick={goNext}
          aria-label={`Next: ${next.name}`}
        >
          <ActiveFamilyMedia item={next} />
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
          aria-label="Previous facility"
        >
          <span aria-hidden="true">‹</span> Previous
        </button>

        <div
          className="overview-rooms__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={count}
          aria-valuenow={index + 1}
          aria-label="Carousel progress"
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
          aria-label="Next facility"
        >
          Next <span aria-hidden="true">›</span>
        </button>

        <p className="overview-rooms__counter">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(count).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

function WellnessCarousel() {
  const [index, setIndex] = useState(0);
  const count = wellnessSlides.length;

  const wrap = useCallback(
    (value: number) => ((value % count) + count) % count,
    [count],
  );

  const goPrevious = () => setIndex((current) => wrap(current - 1));
  const goNext = () => setIndex((current) => wrap(current + 1));

  const previous = wellnessSlides[wrap(index - 1)]!;
  const current = wellnessSlides[index]!;
  const next = wellnessSlides[wrap(index + 1)]!;
  const progress = ((index + 1) / count) * 100;

  return (
    <div
      className="overview-features__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Wellness and relaxation facilities"
    >
      <div className="overview-features__stage">
        <button
          type="button"
          className="overview-features__side overview-features__side--previous"
          onClick={goPrevious}
          aria-label={`Previous slide, ${previous.title}`}
        >
          <WellnessMedia slide={previous} tone={(wrap(index - 1) % 3) + 1} />
        </button>

        <div className="overview-features__active">
          <WellnessMedia slide={current} tone={(index % 3) + 1} />
          <div className="overview-features__card">
            <p className="overview-features__card-eyebrow">
              Wellness &amp; Relaxation
            </p>
            <h3 className="overview-features__card-title">{current.title}</h3>
            <p className="overview-features__card-body">
              {current.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="overview-features__side overview-features__side--next"
          onClick={goNext}
          aria-label={`Next slide, ${next.title}`}
        >
          <WellnessMedia slide={next} tone={(wrap(index + 1) % 3) + 1} />
        </button>
      </div>

      <div className="overview-features__controls">
        <button
          type="button"
          className="overview-features__nav overview-features__nav--previous"
          onClick={goPrevious}
        >
          <span aria-hidden="true">‹</span> Previous
        </button>

        <div
          className="overview-features__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={count}
          aria-valuenow={index + 1}
          aria-label="Carousel progress"
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <button
          type="button"
          className="overview-features__nav overview-features__nav--next"
          onClick={goNext}
        >
          Next <span aria-hidden="true">›</span>
        </button>

        <p className="overview-features__counter">
          {index + 1} / {count}
        </p>
      </div>
    </div>
  );
}

export function ExperienceGroups() {
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
            Wellness &amp; Relaxation
          </h2>
          <p className="experience-group__lede">
            Restore body and mind with spa rituals, thermal experiences, and a
            calm indoor pool.
          </p>
        </div>

        <WellnessCarousel />
      </section>

      <section
        className="experience-group experience-group--paper"
        aria-labelledby="experience-explore"
      >
        <div className="experience-group__inner">
          <div className="experience-group__intro">
            <h2 id="experience-explore" className="experience-group__title">
              Explore Samarkand
            </h2>
            <p className="experience-group__lede">
              Step beyond the hotel into the spiritual and architectural
              landmarks of Samarkand.
            </p>
          </div>

          <ul className="experience-group__grid">
            {exploreItems.map((item, itemIndex) => (
              <li key={item.id} className="experience-group__item">
                <div
                  className={`media-placeholder experience-group__media media-placeholder--tone-${(itemIndex % 3) + 1}`}
                  role="img"
                  aria-label={`${item.name} image placeholder`}
                >
                  <span>{item.name}</span>
                </div>
                <h3 className="experience-group__name">{item.name}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="experience-active"
        aria-labelledby="experience-active-heading"
      >
        <div className="experience-active__intro">
          <h2 id="experience-active-heading" className="experience-group__title">
            Active &amp; Family
          </h2>
          <p className="experience-group__lede">
            Courts and play spaces for guests who prefer to stay active during
            their stay.
          </p>
        </div>

        <ActiveFamilyCarousel />
      </section>
    </>
  );
}
