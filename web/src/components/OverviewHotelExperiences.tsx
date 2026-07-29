"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

type FeatureSlide = {
  id: string;
  title: string;
  href: string;
  description: string;
};

const placeholderDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const slides: FeatureSlide[] = [
  {
    id: "suites-rooms",
    title: "Suites & Rooms",
    href: "/suites-rooms",
    description: placeholderDescription,
  },
  {
    id: "cafe-dining",
    title: "Cafe & Dining",
    href: "/cafe-dining",
    description: placeholderDescription,
  },
  {
    id: "experience",
    title: "Experience",
    href: "/experience",
    description: placeholderDescription,
  },
  {
    id: "meetings-weddings",
    title: "Meetings & Weddings",
    href: "/meetings-weddings",
    description: placeholderDescription,
  },
];

function FeaturePlaceholder({
  slide,
  tone,
}: {
  slide: FeatureSlide;
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

export function OverviewHotelExperiences() {
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
    <section
      className="overview-features"
      aria-labelledby="overview-features-heading"
    >
      <div className="overview-features__intro">
        <div>
          <p className="overview-features__lede">
            Discover every side of HADITH Hotel
          </p>
          <h2 id="overview-features-heading" className="overview-features__heading">
            A Complete Hotel Experience
          </h2>
        </div>
        <p className="overview-features__intro-copy">
          Explore the spaces and experiences that shape a stay at HADITH Hotel,
          from refined accommodation and dining to wellbeing and memorable
          celebrations.
        </p>
      </div>

      <div
        className="overview-features__carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Hotel experiences"
      >
        <div className="overview-features__stage">
          <button
            type="button"
            className="overview-features__side overview-features__side--previous"
            onClick={goPrevious}
            aria-label={`Previous slide, ${previous.title}`}
          >
            <FeaturePlaceholder
              slide={previous}
              tone={(wrap(index - 1) % 3) + 1}
            />
          </button>

          <div className="overview-features__active">
            <FeaturePlaceholder slide={current} tone={(index % 3) + 1} />
            <div className="overview-features__card">
              <p className="overview-features__card-eyebrow">
                Hotel experience
              </p>
              <h3 className="overview-features__card-title">{current.title}</h3>
              <p className="overview-features__card-body">
                {current.description}
              </p>
              <Link
                href={current.href}
                className="overview-features__explore"
              >
                Explore
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="overview-features__side overview-features__side--next"
            onClick={goNext}
            aria-label={`Next slide, ${next.title}`}
          >
            <FeaturePlaceholder
              slide={next}
              tone={(wrap(index + 1) % 3) + 1}
            />
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
    </section>
  );
}
