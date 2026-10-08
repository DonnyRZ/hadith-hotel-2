"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import SiteImage from "@/components/SiteImage";
import { RoomImagePlaceholder } from "@/components/RoomImagePlaceholder";
import type { RoomType } from "@/lib/rooms";
import type { SpecGroup } from "@/lib/roomSpecs";

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
  name: string;
  specs: SpecGroup[] | null;
  onClose: () => void;
};

export function RoomDetailModal({ room, name, specs, onClose }: RoomDetailModalProps) {
  const t = useTranslations("suitesRooms.detail");
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const open = room !== null;
  const imageCount = room?.images.length ?? 0;
  const moveImage = useCallback(
    (direction: number) => {
      if (imageCount < 2) return;
      setImageIndex((current) => (current + direction + imageCount) % imageCount);
    },
    [imageCount],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("has-room-lightbox");
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveImage(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveImage(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("has-room-lightbox");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, moveImage]);

  if (!room || !specs) return null;

  return createPortal(
    <div className="room-detail" role="presentation">
      <button
        type="button"
        className="room-detail__backdrop"
        aria-label={t("closeDetails")}
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
            {name}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="room-detail__close"
            aria-label={t("close")}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>

        <div className="room-detail__scroll">
          <div
            className="room-detail__gallery"
            aria-roledescription={imageCount > 1 ? "carousel" : undefined}
            aria-label={imageCount > 0 ? t("galleryAria", { name }) : undefined}
          >
            <div className="room-detail__photo">
              {imageCount > 0 ? <SiteImage
                className="room-detail__image"
                src={room.images[imageIndex] ?? room.images[0]!}
                alt={name}
                fill
                sizes="100vw"
              /> : <RoomImagePlaceholder />}
            </div>
            {imageCount > 1 ? (
              <div className="room-detail__gallery-controls">
                <div className="room-detail__gallery-nav">
                  <button
                    type="button"
                    onClick={() => moveImage(-1)}
                    aria-label={t("previousImage")}
                  >
                    ‹
                  </button>
                  <div
                    className="room-detail__progress"
                    role="progressbar"
                    aria-valuemin={1}
                    aria-valuemax={imageCount}
                    aria-valuenow={imageIndex + 1}
                    aria-label={t("imageCounterAria", {
                      current: imageIndex + 1,
                      total: imageCount,
                    })}
                  >
                    <span
                      style={{ width: `${((imageIndex + 1) / imageCount) * 100}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => moveImage(1)}
                    aria-label={t("nextImage")}
                  >
                    ›
                  </button>
                </div>
                <p className="room-detail__counter">
                  <span aria-live="polite" aria-atomic="true">
                  {String(imageIndex + 1).padStart(2, "0")} /{" "}
                  {String(imageCount).padStart(2, "0")}
                  </span>
                </p>
              </div>
            ) : null}
          </div>

          <div className="room-detail__body">
            <div className="room-detail__summary">
              <h3 className="room-detail__summary-title">
                {name}
                {room.size ? `, ${room.size}` : ""}
              </h3>
              <p className="room-detail__summary-body">
                {t("summaryBody")}
              </p>
            </div>

            <dl className="room-detail__specs">
              {specs.map((group) => (
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
