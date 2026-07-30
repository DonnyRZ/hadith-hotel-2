"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { SoftOpeningFloat } from "@/components/SoftOpeningFloat";
import { ScrollCue } from "@/components/ScrollCue";

export type HeroSlide = {
  id: string;
  label: string;
  src: string;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
  /** Auto-advance interval in ms. Set 0 to disable. */
  intervalMs?: number;
};

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M14.5 5.5 8 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M9.5 5.5 16 12l-6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroCarousel({ slides, intervalMs = 3000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (count < 2 || intervalMs <= 0) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  if (count === 0) return null;

  return (
    <div
      className="hero-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Overview hero"
    >
      <div className="hero-carousel__viewport">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-carousel__slide${i === index ? " is-active" : ""}`}
            aria-hidden={i !== index}
          >
            <div className="hero-carousel__image-shell">
              <Image
                className="hero-carousel__image-backdrop"
                src={slide.src}
                alt=""
                fill
                sizes="100vw"
                aria-hidden="true"
              />
              <Image
                className="hero-carousel__image"
                src={slide.src}
                alt={slide.label}
                fill
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {count > 1 ? (
        <div className="hero-carousel__controls">
          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--prev"
            aria-label="Previous slide"
            onClick={goPrev}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--next"
            aria-label="Next slide"
            onClick={goNext}
          >
            <ChevronRight />
          </button>
        </div>
      ) : null}

      <SoftOpeningFloat />

      <ScrollCue href="#overview-content" />

      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {count}: {slides[index]?.label}
      </p>
    </div>
  );
}
