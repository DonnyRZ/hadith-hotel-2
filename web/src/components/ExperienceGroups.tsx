"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type WellnessSlide = {
  id: string;
  title: string;
  src?: string;
};

const wellnessSlides: WellnessSlide[] = [
  {
    id: "spa",
    title: "Spa / Massage Suite",
    src: "/images/experience/massage.webp",
  },
  {
    id: "sauna",
    title: "Sauna",
    src: "/images/experience/sauna.webp",
  },
  {
    id: "hammam",
    title: "Turkish Hammam",
    src: "/images/experience/hamam.webp",
  },
  {
    id: "pool",
    title: "Indoor Pool",
    src: "/images/experience/pool.webp",
  },
  { id: "salon", title: "Beauty Salon" },
  {
    id: "fitness",
    title: "Fitness Centre",
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

type DestinationSlide = {
  id: string;
  src: string;
  alt: string;
  position?: string;
};

type DestinationJourney = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  destinations: Array<{ name: string; distance: string }>;
  highlights: string[];
  slides: DestinationSlide[];
};

const destinationJourneys: DestinationJourney[] = [
  {
    id: "imam-al-bukhari-legacy",
    eyebrow: "A short visit · approximately 0.9 km",
    title: "The Legacy of Imam Al-Bukhari",
    description:
      "Visit the resting place of Imam Muhammad Al-Bukhari, then continue into a centre dedicated to scholarship, manuscripts, research, and international exchange.",
    destinations: [
      { name: "Imam Al-Bukhari Mausoleum", distance: "0.9 km" },
      { name: "Imam Bukhari International Centre", distance: "0.9 km" },
    ],
    highlights: [
      "Spiritual pilgrimage",
      "Islamic scholarship",
      "Monumental architecture",
    ],
    slides: [
      {
        id: "imam-bukhari-1",
        src: "/images/experience/destinations/imam-bukhari-1.png",
        alt: "Imam Al-Bukhari Mausoleum and its blue dome",
      },
      {
        id: "imam-bukhari-2",
        src: "/images/experience/destinations/imam-bukhari-2.png",
        alt: "Interior hall at the Imam Al-Bukhari complex",
      },
      {
        id: "imam-bukhari-3",
        src: "/images/experience/destinations/imam-bukhari-3.png",
        alt: "Exhibition at the Imam Bukhari International Centre",
      },
      {
        id: "imam-bukhari-4",
        src: "/images/experience/destinations/imam-bukhari-4.png",
        alt: "Islamic manuscripts displayed at the Imam Bukhari International Centre",
      },
      {
        id: "imam-bukhari-5",
        src: "/images/experience/destinations/imam-bukhari-5.png",
        alt: "Mosque and gardens within the Imam Al-Bukhari complex",
      },
    ],
  },
  {
    id: "timurid-samarkand",
    eyebrow: "A half-day journey · approximately 16.5–16.6 km",
    title: "Timurid Samarkand",
    description:
      "Walk through Shah-i-Zinda's avenue of mausoleums and discover the monumental scale of Bibi-Khanym Mosque—two landmarks shaped by Samarkand's Timurid heritage.",
    destinations: [
      { name: "Shah-i-Zinda", distance: "16.5 km" },
      { name: "Bibi-Khanym Mosque", distance: "16.6 km" },
    ],
    highlights: ["Timurid architecture", "Blue tilework", "Historic Samarkand"],
    slides: [
      {
        id: "samarkand-1",
        src: "/images/experience/destinations/samarkand-1.jpg",
        alt: "Monumental Islamic architecture in historic Samarkand",
      },
      {
        id: "samarkand-2",
        src: "/images/experience/destinations/samarkand-2.jpg",
        alt: "Illuminated historic monument in Samarkand",
      },
      {
        id: "samarkand-3",
        src: "/images/experience/destinations/samarkand-3.jpg",
        alt: "Detailed blue tilework along the Shah-i-Zinda ensemble",
        position: "50% 58%",
      },
      {
        id: "samarkand-4",
        src: "/images/experience/destinations/samarkand-4.jpg",
        alt: "Historic domes and monumental architecture in Samarkand",
      },
      {
        id: "samarkand-5",
        src: "/images/experience/destinations/samarkand-5.jpg",
        alt: "Panoramic view of a historic landmark in Samarkand",
      },
    ],
  },
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
          aria-label={`${slide.title} — soonest`}
        >
          <span>Photo — Soonest</span>
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
      <span className="experience-active__badge">Soonest</span>
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
          <div className="overview-features__card overview-features__card--compact">
            <p className="overview-features__card-eyebrow">
              Wellness &amp; Relaxation
            </p>
            <h3 className="overview-features__card-title">{current.title}</h3>
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

function DestinationCarousel({
  slides,
  title,
}: {
  slides: DestinationSlide[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const progress = ((index + 1) / count) * 100;

  const goPrevious = () =>
    setIndex((currentIndex) => (currentIndex - 1 + count) % count);
  const goNext = () =>
    setIndex((currentIndex) => (currentIndex + 1) % count);

  return (
    <div
      className="destination-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} gallery`}
    >
      <div className="destination-carousel__viewport">
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            className={`destination-carousel__slide${slideIndex === index ? " is-active" : ""}`}
            aria-hidden={slideIndex !== index}
          >
            <Image
              className="destination-carousel__image"
              src={slide.src}
              alt={slideIndex === index ? slide.alt : ""}
              fill
              sizes="(max-width: 920px) 100vw, 58vw"
              style={{ objectPosition: slide.position ?? "50% 50%" }}
            />
          </div>
        ))}
      </div>

      <div className="destination-carousel__controls">
        <button
          type="button"
          className="destination-carousel__nav"
          onClick={goPrevious}
          aria-label={`Previous image in ${title} gallery`}
        >
          <span aria-hidden="true">‹</span> Previous
        </button>

        <div
          className="destination-carousel__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={count}
          aria-valuenow={index + 1}
          aria-label={`${title} gallery progress`}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <button
          type="button"
          className="destination-carousel__nav"
          onClick={goNext}
          aria-label={`Next image in ${title} gallery`}
        >
          Next <span aria-hidden="true">›</span>
        </button>

        <p className="destination-carousel__counter" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

function DestinationsSection() {
  return (
    <section
      id="destinations"
      className="experience-destinations"
      aria-labelledby="experience-destinations-heading"
    >
      <div className="experience-destinations__intro">
        <p className="experience-destinations__eyebrow">Beyond the Hotel</p>
        <h2
          id="experience-destinations-heading"
          className="experience-group__title"
        >
          Explore Samarkand
        </h2>
        <p className="experience-group__lede">
          From the spiritual heart of the Imam Al-Bukhari complex to the
          monumental architecture of historic Samarkand, discover two journeys
          shaped around the hotel&apos;s setting.
        </p>
      </div>

      <div className="experience-destinations__journeys">
        {destinationJourneys.map((journey, journeyIndex) => (
          <article
            key={journey.id}
            className={`destination-journey${journeyIndex % 2 === 1 ? " is-reversed" : ""}`}
          >
            <DestinationCarousel slides={journey.slides} title={journey.title} />

            <div className="destination-journey__copy">
              <p className="destination-journey__eyebrow">{journey.eyebrow}</p>
              <h3 className="destination-journey__title">{journey.title}</h3>
              <p className="destination-journey__description">
                {journey.description}
              </p>

              <dl className="destination-journey__places">
                {journey.destinations.map((destination) => (
                  <div key={destination.name} className="destination-journey__place">
                    <dt>{destination.name}</dt>
                    <dd>{destination.distance} from the hotel</dd>
                  </div>
                ))}
              </dl>

              <ul className="destination-journey__highlights" aria-label="Highlights">
                {journey.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
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

      <DestinationsSection />

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
