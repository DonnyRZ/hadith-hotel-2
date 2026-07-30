"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";

type GallerySlide = {
  id: string;
  src: string;
  alt: string;
};

const roomTypes = [
  { name: "Standard Room", units: 62 },
  { name: "Balcony Room", units: 23 },
  { name: "Suite", units: 18 },
  { name: "Junior Suite", units: 9 },
  { name: "President Suite", units: 2 },
];

const gallerySlides: GallerySlide[] = [
  {
    id: "guest-room-1",
    src: "/images/overview-rooms/junior-1.png",
    alt: "Guest room with an illuminated arched headboard",
  },
  {
    id: "guest-room-2",
    src: "/images/overview-rooms/junior-3.png",
    alt: "Spacious guest room interior at HADITH Hotel",
  },
  {
    id: "guest-room-3",
    src: "/images/overview-rooms/suite-3.png",
    alt: "Guest room bathroom at HADITH Hotel",
  },
  {
    id: "guest-room-4",
    src: "/images/overview-rooms/suite-4.png",
    alt: "Contemporary guest room interior at HADITH Hotel",
  },
  {
    id: "guest-room-5",
    src: "/images/overview-rooms/suite-main.jpeg",
    alt: "Refined guest room interior at HADITH Hotel",
  },
];

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M9 4.5H4.5V9M15 4.5h4.5V9M9 19.5H4.5V15M15 19.5h4.5V15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GalleryMedia({
  slide,
  featured = false,
  fullscreen = false,
  priority = false,
}: {
  slide: GallerySlide;
  featured?: boolean;
  fullscreen?: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className={[
        "overview-rooms__media",
        featured ? "overview-rooms__media--featured" : "",
        fullscreen ? "overview-rooms__media--fullscreen" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        className="overview-rooms__image"
        src={slide.src}
        alt={slide.alt}
        fill
        sizes={
          fullscreen
            ? "100vw"
            : featured
              ? "(max-width: 720px) 100vw, 58vw"
              : "(max-width: 720px) 0px, 22vw"
        }
        priority={priority}
      />
    </div>
  );
}

function RoomLightbox({
  slide,
  open,
  onClose,
}: {
  slide: GallerySlide;
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("has-room-lightbox");
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("has-room-lightbox");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="room-lightbox" role="presentation">
      <button
        type="button"
        className="room-lightbox__backdrop"
        aria-label="Close fullscreen image"
        onClick={onClose}
      />
      <div
        className="room-lightbox__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="room-lightbox__toolbar">
          <p id={titleId} className="room-lightbox__title">
            Rooms &amp; Suites Gallery
          </p>
          <button
            ref={closeRef}
            type="button"
            className="room-lightbox__close"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="room-lightbox__media">
          <GalleryMedia slide={slide} fullscreen />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function OverviewRoomsSuites() {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const count = gallerySlides.length;

  const wrap = useCallback(
    (i: number) => ((i % count) + count) % count,
    [count],
  );

  const goPrev = () => setIndex((i) => wrap(i - 1));
  const goNext = () => setIndex((i) => wrap(i + 1));

  const current = gallerySlides[index]!;
  const prev = gallerySlides[wrap(index - 1)]!;
  const next = gallerySlides[wrap(index + 1)]!;
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
  const progress = ((index + 1) / count) * 100;

  return (
    <>
      <section
        className="overview-rooms"
        aria-labelledby="overview-rooms-heading"
      >
        <div className="overview-rooms__intro">
          <p className="overview-rooms__lede">Escape to a sanctuary of luxury</p>
          <h2 id="overview-rooms-heading" className="overview-rooms__title">
            Rooms and Suites
          </h2>
          <p className="overview-rooms__blurb">
            From refined Standard rooms to the President Suite — 114 rooms and
            suites designed for rest after a day within the Imam Al Bukhari
            Complex.
          </p>

          <ul className="overview-rooms__types" aria-label="Room types">
            {roomTypes.map((roomType, roomIndex) => (
              <li key={roomType.name} className="overview-rooms__type">
                <span className="overview-rooms__type-number" aria-hidden="true">
                  {String(roomIndex + 1).padStart(2, "0")}
                </span>
                <span className="overview-rooms__type-name">{roomType.name}</span>
                <span className="overview-rooms__type-units">
                  {roomType.units} units
                </span>
              </li>
            ))}
          </ul>

          <Link href="/suites-rooms" className="overview-rooms__learn-more">
            Learn More
          </Link>
        </div>

        <div
          className="overview-rooms__carousel"
          aria-roledescription="carousel"
          aria-label="Rooms and suites gallery"
        >
          <div className="overview-rooms__stage">
            <button
              type="button"
              className="overview-rooms__slide overview-rooms__slide--side"
              onClick={goPrev}
              aria-label="Show previous gallery image"
            >
              <GalleryMedia slide={prev} />
            </button>

            <div
              className="overview-rooms__slide overview-rooms__slide--center"
              aria-current="true"
            >
              <GalleryMedia slide={current} featured priority />
              <button
                type="button"
                className="overview-rooms__expand"
                aria-label="View fullscreen image"
                onClick={() => setLightboxOpen(true)}
              >
                <ExpandIcon />
              </button>
            </div>

            <button
              type="button"
              className="overview-rooms__slide overview-rooms__slide--side"
              onClick={goNext}
              aria-label="Show next gallery image"
            >
              <GalleryMedia slide={next} />
            </button>
          </div>

          <div className="overview-rooms__controls">
            <button
              type="button"
              className="overview-rooms__nav overview-rooms__nav--prev"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <span aria-hidden="true">‹</span> Previous
            </button>

            <div
              className="overview-rooms__progress"
              role="progressbar"
              aria-valuenow={index + 1}
              aria-valuemin={1}
              aria-valuemax={count}
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
              aria-label="Next image"
            >
              Next <span aria-hidden="true">›</span>
            </button>

            <p className="overview-rooms__counter">{counter}</p>
          </div>
        </div>
      </section>

      <RoomLightbox
        slide={current}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
