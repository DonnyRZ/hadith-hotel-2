"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ComingSoonModal } from "@/components/ComingSoonModal";

type RoomSlide = {
  id: string;
  name: string;
  units: number;
};

const rooms: RoomSlide[] = [
  { id: "standard", name: "Standard Room", units: 62 },
  { id: "balcony", name: "Balcony Room", units: 23 },
  { id: "junior", name: "Junior Suite", units: 9 },
  { id: "president", name: "President Suite", units: 2 },
  { id: "suite", name: "Suite", units: 18 },
];

const PRESIDENT_INDEX = rooms.findIndex((r) => r.id === "president");

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

function RoomPlaceholder({
  room,
  tone,
  featured = false,
  fullscreen = false,
}: {
  room: RoomSlide;
  tone: number;
  featured?: boolean;
  fullscreen?: boolean;
}) {
  return (
    <div
      className={[
        "media-placeholder",
        "media-placeholder--room",
        `media-placeholder--tone-${tone}`,
        featured ? "media-placeholder--room-featured" : "",
        fullscreen ? "media-placeholder--room-fullscreen" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="img"
      aria-label={`${room.name} placeholder — ${room.units} units`}
    >
      <span>
        {room.name}
        <br />
        {room.units} units
      </span>
    </div>
  );
}

function RoomLightbox({
  room,
  tone,
  open,
  onClose,
}: {
  room: RoomSlide;
  tone: number;
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
            {room.name}
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
          <RoomPlaceholder room={room} tone={tone} fullscreen />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function OverviewRoomsSuites() {
  const [index, setIndex] = useState(
    PRESIDENT_INDEX >= 0 ? PRESIDENT_INDEX : 0,
  );
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const count = rooms.length;

  const wrap = useCallback(
    (i: number) => ((i % count) + count) % count,
    [count],
  );

  const goPrev = () => setIndex((i) => wrap(i - 1));
  const goNext = () => setIndex((i) => wrap(i + 1));

  const current = rooms[index]!;
  const prev = rooms[wrap(index - 1)]!;
  const next = rooms[wrap(index + 1)]!;
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
  const progress = ((index + 1) / count) * 100;
  const currentTone = (index % 3) + 1;

  return (
    <>
      <section
        className="overview-rooms"
        aria-labelledby="overview-rooms-heading"
      >
        <div className="overview-rooms__intro">
          <div className="overview-rooms__intro-copy">
            <p className="overview-rooms__lede">Escape to a sanctuary of luxury</p>
            <h2 id="overview-rooms-heading" className="overview-rooms__title">
              Rooms and Suites
            </h2>
          </div>
          <div className="overview-rooms__intro-aside">
            <p className="overview-rooms__blurb">
              From refined Standard rooms to the President Suite — 114 rooms and
              suites designed for rest after a day within the Imam Al Bukhari
              Complex.
            </p>
            <Link href="/suites-rooms" className="overview-rooms__learn-more">
              Learn More
            </Link>
          </div>
        </div>

        <div className="overview-rooms__carousel" aria-roledescription="carousel">
          <div className="overview-rooms__stage">
            <button
              type="button"
              className="overview-rooms__slide overview-rooms__slide--side"
              onClick={goPrev}
              aria-label={`Previous: ${prev.name}`}
            >
              <RoomPlaceholder room={prev} tone={(wrap(index - 1) % 3) + 1} />
            </button>

            <div
              className="overview-rooms__slide overview-rooms__slide--center"
              aria-current="true"
            >
              <RoomPlaceholder room={current} tone={currentTone} featured />
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
              aria-label={`Next: ${next.name}`}
            >
              <RoomPlaceholder room={next} tone={(wrap(index + 1) % 3) + 1} />
            </button>
          </div>

          <div className="overview-rooms__meta-row">
            <div className="overview-rooms__meta-spacer" aria-hidden="true" />
            <div className="overview-rooms__meta">
              <p className="overview-rooms__room-name">{current.name}</p>
              <button
                type="button"
                className="overview-rooms__rates"
                onClick={() => setComingSoonOpen(true)}
              >
                View Rates
                <span aria-hidden="true"> →</span>
              </button>
            </div>
            <div className="overview-rooms__meta-spacer" aria-hidden="true" />
          </div>

          <div className="overview-rooms__controls">
            <button
              type="button"
              className="overview-rooms__nav overview-rooms__nav--prev"
              onClick={goPrev}
              aria-label="Previous room"
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
              aria-label="Next room"
            >
              Next <span aria-hidden="true">›</span>
            </button>

            <p className="overview-rooms__counter">{counter}</p>
          </div>
        </div>
      </section>

      <RoomLightbox
        room={current}
        tone={currentTone}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        eyebrow="Room Rates"
        body="Rates for our rooms and suites will be published shortly. Thank you for your interest in HADITH Hotel."
      />
    </>
  );
}
