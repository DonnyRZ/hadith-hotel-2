"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RoomType } from "@/lib/rooms";

const roomPhotos: Record<string, string[]> = {
  suite: [
    "/images/rooms/suite/suite-main.jpeg",
    "/images/rooms/suite/suite-2.png",
    "/images/rooms/suite/suite-3.png",
    "/images/rooms/suite/suite-4.png",
  ],
  balcony: ["/images/overview-rooms/balcony.webp"],
  standard: [
    "/images/rooms/standard/standard-main.jpeg",
    "/images/rooms/standard/standard-2.png",
    "/images/rooms/standard/standard-3.png",
    "/images/rooms/standard/standard-4.png",
  ],
  junior: [
    "/images/rooms/junior/junior-1.png",
    "/images/rooms/junior/junior-2.png",
    "/images/rooms/junior/junior-3.png",
    "/images/rooms/junior/junior-4.png",
    "/images/rooms/junior/junior-5.png",
  ],
};

const completeGalleries = new Set(["junior", "suite", "standard"]);
const EMPTY_PHOTOS: string[] = [];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type RoomDetailModalProps = {
  room: RoomType | null;
  onClose: () => void;
};

export function RoomDetailModal({ room, onClose }: RoomDetailModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [photo, setPhoto] = useState(0);

  const open = room !== null;
  const photos = room ? (roomPhotos[room.id] ?? EMPTY_PHOTOS) : EMPTY_PHOTOS;
  const hasComingSoonSlide = room ? !completeGalleries.has(room.id) : false;
  const slideCount = Math.max(photos.length + Number(hasComingSoonSlide), 1);

  const move = useCallback(
    (direction: number) => {
      setPhoto((current) => (current + direction + slideCount) % slideCount);
    },
    [slideCount],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("has-room-lightbox");
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("has-room-lightbox");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, move]);

  const currentSrc = useMemo(
    () => (photo < photos.length ? photos[photo] : null),
    [photo, photos],
  );

  if (!room || !room.specs) return null;

  return createPortal(
    <div className="room-detail" role="presentation">
      <button
        type="button"
        className="room-detail__backdrop"
        aria-label="Close room details"
        onClick={onClose}
      />

      <div
        className="room-detail__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="room-detail__header">
          <h2 id={titleId} className="room-detail__title">
            {room.name}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="room-detail__close"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>

        <div className="room-detail__scroll">
          <div className="room-detail__gallery" aria-roledescription="carousel">
            {currentSrc ? (
              <div
                className="room-detail__photo"
                role="img"
                aria-label={`${room.name} photo ${photo + 1}`}
              >
                <Image
                  className="room-detail__image"
                  src={currentSrc}
                  alt=""
                  fill
                  sizes="(max-width: 880px) 100vw, 880px"
                  priority
                  aria-hidden="true"
                />
              </div>
            ) : (
              <div
                className="room-detail__photo room-detail__photo--soon"
                role="img"
                aria-label="More photos — soonest"
              >
                <span>More Photos — Soonest</span>
              </div>
            )}

            <div className="room-detail__gallery-controls">
              <div className="room-detail__gallery-nav">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous photo"
                >
                  <span aria-hidden="true">‹</span> Prev
                </button>

                <div className="room-detail__progress" aria-hidden="true">
                  <span
                    style={{ width: `${((photo + 1) / slideCount) * 100}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next photo"
                >
                  Next <span aria-hidden="true">›</span>
                </button>
              </div>

              <p className="room-detail__counter">
                {String(photo + 1).padStart(2, "0")} /{" "}
                {String(slideCount).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="room-detail__body">
            <div className="room-detail__summary">
              <h3 className="room-detail__summary-title">
                {room.name}
                {room.size ? `, ${room.size}` : ""}
              </h3>
              <p className="room-detail__summary-body">
                {room.units} units, air-conditioned, non-smoking, wireless
                internet
              </p>
            </div>

            <dl className="room-detail__specs">
              {room.specs.map((group) => (
                <div key={group.title} className="room-detail__spec">
                  <dt className="room-detail__spec-title">{group.title}</dt>
                  {group.items.map((item) => (
                    <dd key={item} className="room-detail__spec-item">
                      {item}
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
