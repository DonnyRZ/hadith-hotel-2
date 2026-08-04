"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { asset } from "@/lib/asset";

type OverviewDestinationSlide = {
  id: string;
  journeyEyebrow: string;
  title: string;
  description: string;
  video: string;
  poster: string;
  videoLabel: string;
  facts: Array<{ label: string; detail: string }>;
  tags: string[];
};

const slides: OverviewDestinationSlide[] = [
  {
    id: "imam-al-bukhari",
    journeyEyebrow: "A short visit · approximately 0.9 km",
    title: "The Legacy of Imam Al-Bukhari",
    description:
      "Visit the resting place of Imam Muhammad Al-Bukhari, then continue into a centre dedicated to scholarship, manuscripts, research, and international exchange.",
    video: "/videos/imam-al-bukhari-complex.mp4",
    poster: "/images/experience/destinations/imam-bukhari-1.png",
    videoLabel: "Imam Al-Bukhari Mausoleum complex near HADITH Hotel",
    facts: [
      { label: "Imam Al-Bukhari Mausoleum", detail: "0.9 km from the hotel" },
      {
        label: "Imam Bukhari International Centre",
        detail: "0.9 km from the hotel",
      },
    ],
    tags: [
      "Spiritual pilgrimage",
      "Islamic scholarship",
      "Monumental architecture",
    ],
  },
  {
    id: "registan-square",
    journeyEyebrow: "A half-day journey · approximately 17.2 km",
    title: "Registan Square",
    description:
      "Step into the heart of Samarkand at Registan Square, where three monumental madrasas create one of Central Asia's most iconic architectural ensembles. Discover grand portals, intricate blue tilework, and centuries of Silk Road history.",
    video: "/videos/registan-square.mp4",
    poster: "/images/experience/destinations/registan-poster.jpg",
    videoLabel: "Video tour of Registan Square in Samarkand",
    facts: [
      { label: "Registan Square", detail: "17.2 km from the hotel" },
      {
        label: "Ulugh Beg, Sher-Dor & Tilla-Kori Madrasas",
        detail: "Within the complex",
      },
    ],
    tags: [
      "Islamic architecture",
      "Blue tilework",
      "Silk Road heritage",
    ],
  },
];

export function OverviewDestinations() {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const count = slides.length;
  const slide = slides[index]!;
  const progress = ((index + 1) / count) * 100;

  const goPrevious = () =>
    setIndex((current) => (current - 1 + count) % count);
  const goNext = () => setIndex((current) => (current + 1) % count);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }, [index]);

  return (
    <section
      className="overview-destinations"
      aria-labelledby="overview-destinations-heading"
    >
      <div className="overview-destinations__inner">
        <div className="overview-destinations__media-col">
          <div className="overview-destinations__media">
            <video
              key={slide.id}
              ref={videoRef}
              className="overview-destinations__video"
              src={asset(slide.video)}
              poster={asset(slide.poster)}
              controls
              playsInline
              preload="metadata"
              aria-label={slide.videoLabel}
            />
          </div>

          <div className="overview-destinations__controls">
            <button
              type="button"
              className="overview-destinations__nav"
              onClick={goPrevious}
              aria-label="Previous destination"
            >
              <span aria-hidden="true">‹</span> Previous
            </button>

            <div
              className="overview-destinations__progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={count}
              aria-valuenow={index + 1}
              aria-label="Destination carousel progress"
            >
              <span style={{ width: `${progress}%` }} />
            </div>

            <button
              type="button"
              className="overview-destinations__nav"
              onClick={goNext}
              aria-label="Next destination"
            >
              Next <span aria-hidden="true">›</span>
            </button>

            <p className="overview-destinations__counter" aria-live="polite">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="overview-destinations__copy">
          <p className="overview-destinations__eyebrow">Beyond the Hotel</p>
          <p className="overview-destinations__journey">{slide.journeyEyebrow}</p>
          <h2
            id="overview-destinations-heading"
            className="overview-destinations__heading"
          >
            {slide.title}
          </h2>
          <p className="overview-destinations__body">{slide.description}</p>

          <dl className="destination-journey__places">
            {slide.facts.map((fact) => (
              <div key={fact.label} className="destination-journey__place">
                <dt>{fact.label}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>

          <ul
            className="destination-journey__highlights"
            aria-label="Highlights"
          >
            {slide.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          <Link
            href="/experience#destinations"
            className="overview-destinations__explore"
          >
            Explore Destinations <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
