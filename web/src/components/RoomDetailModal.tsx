"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RoomType } from "@/lib/rooms";

const PHOTO_COUNT = 4;

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

  const move = useCallback((direction: number) => {
    setPhoto((current) => (current + direction + PHOTO_COUNT) % PHOTO_COUNT);
  }, []);

  useEffect(() => {
    setPhoto(0);
  }, [room?.id]);

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
            <div
              className={`media-placeholder room-detail__photo media-placeholder--tone-${(photo % 3) + 1}`}
              role="img"
              aria-label={`${room.name} photo ${photo + 1} placeholder`}
            >
              <span>
                {room.name} photo {photo + 1}
              </span>
            </div>

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
                    style={{ width: `${((photo + 1) / PHOTO_COUNT) * 100}%` }}
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
                {String(PHOTO_COUNT).padStart(2, "0")}
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
