"use client";

import { useState } from "react";

type Venue = {
  id: string;
  heading: string;
  eyebrow: string;
  name: string;
  description: string;
  highlights: string[];
  variant: "blue" | "paper";
  reversed?: boolean;
  gallery?: string[];
};

const venues: Venue[] = [
  {
    id: "restaurant",
    heading: "Savour the Silk Road",
    eyebrow: "Food & Beverage · The Restaurant",
    name: "The Restaurant",
    description:
      "A 120-seat dining room framed by a slender white marble mihrab. The menu travels the Silk Road from Samarkand plov and Bukhara somsa to Indonesian-inspired creations prepared by our culinary team.",
    highlights: [
      "120 seats",
      "Breakfast, lunch and dinner",
      "Private dining room",
      "Halal certified",
    ],
    variant: "blue",
  },
  {
    id: "cafe",
    heading: "A Taste of Indonesia",
    eyebrow: "Food & Beverage · The Cafe",
    name: "The Cafe",
    description:
      "Discover curated Indonesian pastries and specialty coffees from across the archipelago, including classics such as Kopi Luwak. The cafe offers a warm social setting celebrating Indonesia’s rich coffee culture.",
    highlights: [
      "Indonesian specialty coffee",
      "Curated Indonesian pastries",
      "Relaxed social setting",
    ],
    variant: "paper",
    reversed: true,
    gallery: ["The Cafe", "Indonesian Coffee & Pastries", "Cafe Social Lounge"],
  },
];

function VenueMediaCarousel({ venue }: { venue: Venue }) {
  const slides = venue.gallery ?? [venue.name];
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const wrap = (value: number) => (value + count) % count;
  const progress = ((index + 1) / count) * 100;

  return (
    <div
      className="venue-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${venue.name} gallery`}
    >
      <div
        className={`media-placeholder venue__placeholder venue-carousel__slide media-placeholder--tone-${(index % 3) + 1}`}
        role="img"
        aria-label={`${slides[index]} image placeholder`}
      >
        <span>{slides[index]}</span>
      </div>

      <div className="venue-carousel__controls">
        <button
          type="button"
          className="venue-carousel__nav"
          onClick={() => setIndex((current) => wrap(current - 1))}
          aria-label={`Previous ${venue.name} photo`}
        >
          <span aria-hidden="true">‹</span> Previous
        </button>

        <div className="venue-carousel__progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <button
          type="button"
          className="venue-carousel__nav"
          onClick={() => setIndex((current) => wrap(current + 1))}
          aria-label={`Next ${venue.name} photo`}
        >
          Next <span aria-hidden="true">›</span>
        </button>

        <p className="venue-carousel__counter">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

export function CafeDiningVenues() {
  return (
    <>
      {venues.map((venue, index) => (
        <section
          key={venue.id}
          className={`venue venue--${venue.variant}`}
          aria-labelledby={`venue-heading-${venue.id}`}
        >
          <div className="venue__inner">
            <h2 id={`venue-heading-${venue.id}`} className="venue__heading">
              {venue.heading}
            </h2>

            <div className={`venue__layout${venue.reversed ? " is-reversed" : ""}`}>
              <div className="venue__media">
                {venue.gallery ? (
                  <VenueMediaCarousel venue={venue} />
                ) : (
                  <div
                    className={`media-placeholder venue__placeholder media-placeholder--tone-${(index % 3) + 1}`}
                    role="img"
                    aria-label={`${venue.name} image placeholder`}
                  >
                    <span>{venue.name}</span>
                  </div>
                )}
              </div>

              <div className="venue__card">
                <p className="venue__eyebrow">{venue.eyebrow}</p>
                <h3 className="venue__name">{venue.name}</h3>
                <p className="venue__body">{venue.description}</p>

                <ul className="venue__highlights">
                  {venue.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
