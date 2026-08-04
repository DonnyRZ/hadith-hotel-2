"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

type FeatureSlide = {
  id: string;
  title: string;
  href: string;
  src: string;
};

const slides: FeatureSlide[] = [
  {
    id: "suites-rooms",
    title: "Suites & Rooms",
    href: "/suites-rooms",
    src: "/images/overview-hero/junior-suite.webp",
  },
  {
    id: "cafe-dining",
    title: "Cafe & Dining",
    href: "/cafe-dining",
    src: "/images/cafe-dining/cafe-1.webp",
  },
  {
    id: "experience",
    title: "Experience",
    href: "/experience",
    src: "/images/overview-hero/pool.webp",
  },
  {
    id: "meetings-weddings",
    title: "Meetings & Weddings",
    href: "/meetings-weddings",
    src: "/images/overview-features/meetings-weddings.webp",
  },
];

function FeatureMedia({
  slide,
}: {
  slide: FeatureSlide;
}) {
  return (
    <div className="overview-features__media">
      <Image
        className="overview-features__image"
        src={slide.src}
        alt={slide.title}
        fill
        sizes="(max-width: 720px) 100vw, 60vw"
      />
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
            <FeatureMedia slide={previous} />
          </button>

          <div className="overview-features__active">
            <FeatureMedia slide={current} />
            <div className="overview-features__card overview-features__card--compact">
              <p className="overview-features__card-eyebrow">
                Hotel experience
              </p>
              <h3 className="overview-features__card-title">{current.title}</h3>
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
            <FeatureMedia slide={next} />
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
