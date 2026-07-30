"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ComingSoonModal } from "@/components/ComingSoonModal";

type RoomSlide = {
  id: string;
  name: string;
  units: number;
  src: string;
  comingSoon?: boolean;
};

const BALCONY_SRC = "/images/overview-rooms/balcony.webp";

const rooms: RoomSlide[] = [
  {
    id: "standard",
    name: "Standard Room",
    units: 62,
    src: "/images/overview-rooms/standard.webp",
  },
  {
    id: "suite",
    name: "Suite",
    units: 18,
    src: "/images/overview-rooms/suite.webp",
  },
  {
    id: "balcony",
    name: "Balcony Room",
    units: 23,
    src: BALCONY_SRC,
  },
  {
    id: "junior",
    name: "Junior Suite",
    units: 9,
    src: BALCONY_SRC,
    comingSoon: true,
  },
  {
    id: "president",
    name: "President Suite",
    units: 2,
    src: BALCONY_SRC,
    comingSoon: true,
  },
];

const DEFAULT_INDEX = rooms.findIndex((r) => r.id === "suite");

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

function RoomMedia({
  room,
  featured = false,
  fullscreen = false,
  priority = false,
}: {
  room: RoomSlide;
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
        room.comingSoon ? "overview-rooms__media--coming-soon" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="img"
      aria-label={
        room.comingSoon
          ? `${room.name} — coming soon`
          : `${room.name} — ${room.units} units`
      }
    >
      <Image
        className="overview-rooms__image"
        src={room.src}
        alt=""
        fill
        sizes={
          fullscreen
            ? "100vw"
            : featured
              ? "(max-width: 720px) 100vw, 58vw"
              : "(max-width: 720px) 0px, 22vw"
        }
        priority={priority}
        aria-hidden="true"
      />

      {room.comingSoon ? (
        <div className="overview-rooms__soon" aria-hidden="true">
          <span className="overview-rooms__soon-label">Coming Soon</span>
        </div>
      ) : null}
    </div>
  );
}

function RoomLightbox({
  room,
  open,
  onClose,
}: {
  room: RoomSlide;
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
          <RoomMedia room={room} fullscreen />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function OverviewRoomsSuites() {
  const [index, setIndex] = useState(
    DEFAULT_INDEX >= 0 ? DEFAULT_INDEX : 0,
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
              <RoomMedia room={prev} />
            </button>

            <div
              className="overview-rooms__slide overview-rooms__slide--center"
              aria-current="true"
            >
              <RoomMedia room={current} featured priority />
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
              <RoomMedia room={next} />
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
