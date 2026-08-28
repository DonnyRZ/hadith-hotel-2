"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import SiteImage from "@/components/SiteImage";
import { Link } from "@/i18n/navigation";

type GallerySlide = {
  id: string;
  src: string;
  altKey: string;
};

const roomTypes = [
  { key: "standardRoom", id: "standard", units: 62 },
  { key: "balconyRoom", id: "balcony", units: 23 },
  { key: "suite", id: "suite", units: 18 },
  { key: "juniorSuite", id: "junior", units: 9 },
  { key: "presidentSuite", id: "president", units: 2 },
];

const gallerySlides: GallerySlide[] = [
  {
    id: "guest-room-1",
    src: "/images/overview-rooms/junior-1.png",
    altKey: "guestRoom1",
  },
  {
    id: "guest-room-2",
    src: "/images/overview-rooms/junior-3.png",
    altKey: "guestRoom2",
  },
  {
    id: "guest-room-3",
    src: "/images/overview-rooms/suite-3.png",
    altKey: "guestRoom3",
  },
  {
    id: "guest-room-4",
    src: "/images/overview-rooms/suite-4.png",
    altKey: "guestRoom4",
  },
  {
    id: "guest-room-5",
    src: "/images/overview-rooms/suite-main.jpeg",
    altKey: "guestRoom5",
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
  alt,
  featured = false,
  fullscreen = false,
  priority = false,
}: {
  slide: GallerySlide;
  alt: string;
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
      <SiteImage
        className="overview-rooms__image"
        src={slide.src}
        alt={alt}
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
  alt,
  open,
  onClose,
  t,
}: {
  slide: GallerySlide;
  alt: string;
  open: boolean;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
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
        aria-label={t("gallery.closeFullscreen")}
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
            {t("gallery.lightboxTitle")}
          </p>
          <button
            ref={closeRef}
            type="button"
            className="room-lightbox__close"
            aria-label={t("gallery.close")}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="room-lightbox__media">
          <GalleryMedia slide={slide} alt={alt} fullscreen />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function OverviewRoomsSuites() {
  const t = useTranslations("overview.rooms");
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
          <p className="overview-rooms__lede">{t("lede")}</p>
          <h2 id="overview-rooms-heading" className="overview-rooms__title">
            {t("title")}
          </h2>
          <p className="overview-rooms__blurb">{t("blurb")}</p>

          <ul className="overview-rooms__types" aria-label={t("typesAriaLabel")}>
            {roomTypes.map((roomType, roomIndex) => (
              <li key={roomType.key} className="overview-rooms__type">
                <Link
                  href={`/suites-rooms#room-${roomType.id}`}
                  className="overview-rooms__type-link"
                >
                  <span className="overview-rooms__type-number" aria-hidden="true">
                    {String(roomIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="overview-rooms__type-name">
                    {t(`types.${roomType.key}`)}
                  </span>
                  <span className="overview-rooms__type-units">
                    {t("unitsCount", { units: roomType.units })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/suites-rooms" className="overview-rooms__learn-more">
            {t("learnMore")}
          </Link>
        </div>

        <div
          className="overview-rooms__carousel"
          aria-roledescription="carousel"
          aria-label={t("gallery.ariaLabel")}
        >
          <div className="overview-rooms__stage">
            <button
              type="button"
              className="overview-rooms__slide overview-rooms__slide--side"
              onClick={goPrev}
              aria-label={t("gallery.prevImageAria")}
            >
              <GalleryMedia slide={prev} alt={t(`gallery.${prev.altKey}`)} />
            </button>

            <div
              className="overview-rooms__slide overview-rooms__slide--center"
              aria-current="true"
            >
              <GalleryMedia
                slide={current}
                alt={t(`gallery.${current.altKey}`)}
                featured
                priority
              />
              <button
                type="button"
                className="overview-rooms__expand"
                aria-label={t("gallery.expandAria")}
                onClick={() => setLightboxOpen(true)}
              >
                <ExpandIcon />
              </button>
            </div>

            <button
              type="button"
              className="overview-rooms__slide overview-rooms__slide--side"
              onClick={goNext}
              aria-label={t("gallery.nextImageAria")}
            >
              <GalleryMedia slide={next} alt={t(`gallery.${next.altKey}`)} />
            </button>
          </div>

          <div className="overview-rooms__controls">
            <button
              type="button"
              className="overview-rooms__nav overview-rooms__nav--prev"
              onClick={goPrev}
              aria-label={t("gallery.prevImageLabel")}
            >
              <span aria-hidden="true">‹</span> {t("gallery.previous")}
            </button>

            <div
              className="overview-rooms__progress"
              role="progressbar"
              aria-valuenow={index + 1}
              aria-valuemin={1}
              aria-valuemax={count}
              aria-label={t("gallery.progressAria")}
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
              aria-label={t("gallery.nextImageLabel")}
            >
              {t("gallery.next")} <span aria-hidden="true">›</span>
            </button>

            <p className="overview-rooms__counter">{counter}</p>
          </div>
        </div>
      </section>

      <RoomLightbox
        slide={current}
        alt={t(`gallery.${current.altKey}`)}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        t={t}
      />
    </>
  );
}
