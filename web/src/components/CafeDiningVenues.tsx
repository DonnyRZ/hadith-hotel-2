"use client";

import SiteImage from "@/components/SiteImage";
import { useState } from "react";

type GallerySlide = { src: string; label: string };

type Venue = {
  id: string;
  heading: string;
  name: string;
  subname?: string;
  description: string;
  highlights: string[];
  variant: "blue" | "paper";
  reversed?: boolean;
  gallery: GallerySlide[];
};

const venues: Venue[] = [
  {
    id: "restaurant",
    heading: "Savour the Silk Road",
    name: "Saji Nusantara",
    subname: "Uzbek Cuisine",
    description:
      "A 120-seat dining room framed by a slender white marble mihrab. The menu travels the Silk Road from Samarkand plov and Bukhara somsa to Indonesian-inspired creations prepared by our culinary team.",
    highlights: [
      "Breakfast, lunch and dinner",
      "Private dining room",
      "Halal certified",
    ],
    variant: "blue",
    gallery: [
      {
        src: "/images/cafe-dining/saji-nusantara.webp",
        label: "Saji Nusantara dining room",
      },
      {
        src: "/images/cafe-dining/buffet.webp",
        label: "Saji Nusantara buffet counter",
      },
    ],
  },
  {
    id: "cafe",
    heading: "A Taste of Indonesia",
    name: "7oz Espresso",
    description:
      "Discover curated Indonesian pastries and specialty coffees from across the archipelago, including classics such as Kopi Luwak. The cafe offers a warm social setting celebrating Indonesia’s rich coffee culture.",
    highlights: [
      "Indonesian specialty coffee",
      "Curated Indonesian pastries",
      "Relaxed social setting",
    ],
    variant: "paper",
    reversed: true,
    gallery: [
      {
        src: "/images/cafe-dining/cafe-1.webp",
        label: "7oz cafe counter and lounge",
      },
      {
        src: "/images/cafe-dining/cafe-2.webp",
        label: "7oz coffee bar",
      },
    ],
  },
];

function VenueMediaCarousel({ venue }: { venue: Venue }) {
  const slides = venue.gallery;
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const wrap = (value: number) => (value + count) % count;
  const progress = ((index + 1) / count) * 100;
  const slide = slides[index]!;

  return (
    <div
      className="venue-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${venue.name} gallery`}
    >
      <div
        className="venue__placeholder venue-carousel__slide venue-carousel__slide--photo"
        role="img"
        aria-label={slide.label}
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
      {venues.map((venue) => (
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
                <VenueMediaCarousel venue={venue} />
              </div>

              <div className="venue__card">
                <h3 className="venue__name">{venue.name}</h3>
                {venue.subname ? (
                  <p className="venue__subname">{venue.subname}</p>
                ) : null}
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
