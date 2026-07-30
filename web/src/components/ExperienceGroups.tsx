"use client";

import { useCallback, useState } from "react";

type WellnessSlide = {
  id: string;
  title: string;
  description: string;
};

const placeholderDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const wellnessSlides: WellnessSlide[] = [
  { id: "spa", title: "Spa / Massage Suite", description: placeholderDescription },
  { id: "salon", title: "Beauty Salon", description: placeholderDescription },
  { id: "sauna", title: "Sauna", description: placeholderDescription },
  { id: "hammam", title: "Turkish Hammam", description: placeholderDescription },
  { id: "pool", title: "Indoor Pool", description: placeholderDescription },
  { id: "fitness", title: "Fitness Centre", description: placeholderDescription },
];

const exploreItems = [
  { id: "imam-al-bukhari", name: "Imam al-Bukhari Memorial Complex" },
  { id: "makhdumi-azam", name: "Makhdumi A’zam Complex" },
  { id: "ulugh-beg-observatory", name: "Ulugh Beg Observatory" },
];

function WellnessPlaceholder({
  slide,
  tone,
}: {
  slide: WellnessSlide;
  tone: number;
}) {
  return (
    <div
      className={`media-placeholder overview-features__placeholder media-placeholder--tone-${tone}`}
      role="img"
      aria-label={`${slide.title} image placeholder`}
    >
      <span>{slide.title}</span>
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
          <WellnessPlaceholder
            slide={previous}
            tone={(wrap(index - 1) % 3) + 1}
          />
        </button>

        <div className="overview-features__active">
          <WellnessPlaceholder slide={current} tone={(index % 3) + 1} />
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
          <WellnessPlaceholder slide={next} tone={(wrap(index + 1) % 3) + 1} />
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
    </>
  );
}
