"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ScrollCue } from "@/components/ScrollCue";

type PageHeroCarouselProps = {
  title: string;
  slides: readonly string[];
};

export function PageHeroCarousel({
  title,
  slides,
}: PageHeroCarouselProps) {
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
      aria-label={`${title} image gallery`}
      aria-roledescription="carousel"
    >
      <h1 className="sr-only">{title}</h1>

      <div className="page-hero__viewport">
        {slides.map((label, slideIndex) => (
          <div
            key={label}
            className={`page-hero__slide${slideIndex === index ? " is-active" : ""}`}
            aria-hidden={slideIndex !== index}
          >
            <div
              className={`media-placeholder page-hero__placeholder media-placeholder--tone-${(slideIndex % 3) + 1}`}
              role="img"
              aria-label={label}
            >
              <span>{label}</span>
            </div>
          </div>
        ))}

        <div className="page-hero__controls">
          <div className="page-hero__navigation">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Show previous image"
            >
              <span aria-hidden="true">‹</span>
              Previous
            </button>

            <div className="page-hero__progress" aria-hidden="true">
              <span style={{ width: `${((index + 1) / count) * 100}%` }} />
            </div>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Show next image"
            >
              Next
              <span aria-hidden="true">›</span>
            </button>
          </div>

          <div className="page-hero__status">
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
            <Link href="/gallery">Gallery</Link>
          </div>
        </div>

        <ScrollCue />
      </div>

      <p className="sr-only" aria-live="polite">
        Image {index + 1} of {count}: {slides[index]}
      </p>
    </section>
  );
}
