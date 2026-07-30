"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type VideoReview = {
  id: string;
  name?: string;
  role?: string;
  src?: string;
  poster?: string;
};

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

const videoReviews: VideoReview[] = [
  {
    id: "mohamed-shaheem-ali-saeed",
    name: "Mohamed Shaheem Ali Saeed",
    role: "Minister of Islamic Affairs, Republic of Maldives",
    src: "/videos/mohamed-shaheem-ali-saeed.mp4",
    poster: "/videos/mohamed-shaheem-ali-saeed-poster.jpg",
  },
  {
    id: "shady-al-suleiman",
    name: "Shady Al Suleiman",
    role: "President of United Muslims of Australia",
    src: "/videos/shady-al-suleiman.mp4",
    poster: "/videos/shady-al-suleiman-poster.jpg",
  },
  {
    id: "syekh-mohamed-el-duwaini",
    name: "Syekh Mohamed El Duwaini",
    role: "Undersecretary of Al-Azhar Al-Sharif",
    src: "/videos/syekh-mohamed-el-duwaini.mp4",
    poster: "/videos/syekh-mohamed-el-duwaini-poster.jpg",
  },
  { id: "review-4" },
  { id: "review-5" },
];

const landscapeReview = {
  id: "review-landscape",
  name: "Imad Abdullah Hamdan",
  role: "Minister of Culture of the State of Palestine",
  src: "/videos/imad-abdullah-hamdan.mp4",
  poster: "/videos/imad-abdullah-hamdan-poster.jpg",
};

const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud...",
    name: "Guest Name",
    role: "Guest Title",
  },
  {
    id: "testimonial-2",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud...",
    name: "Guest Name",
    role: "Guest Title",
  },
  {
    id: "testimonial-3",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud...",
    name: "Guest Name",
    role: "Guest Title",
  },
  {
    id: "testimonial-4",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud...",
    name: "Guest Name",
    role: "Guest Title",
  },
  {
    id: "testimonial-5",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud...",
    name: "Guest Name",
    role: "Guest Title",
  },
];

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M14.5 5.5 8 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M9.5 5.5 16 12l-6.5 6.5"
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

function PlayIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

function VideoPlaceholder({
  label,
  tone,
  orientation = "portrait",
}: {
  label: string;
  tone: number;
  orientation?: "portrait" | "landscape";
}) {
  return (
    <div
      className={`media-placeholder video-frame video-frame--${orientation} media-placeholder--tone-${tone}`}
      role="img"
      aria-label={`${label} video placeholder`}
    >
      <span className="video-frame__play" aria-hidden="true">
        <PlayIcon />
      </span>
    </div>
  );
}

const VIDEO_REVIEW_SPEED = 28; // px per second, continuous marquee
const DRAG_THRESHOLD = 8; // px before a pointer gesture counts as a drag

function ReviewLightbox({
  review,
  onClose,
}: {
  review: VideoReview;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("has-room-lightbox");
    closeRef.current?.focus();

    // Keep a single soundtrack playing while the review is open.
    document.querySelectorAll("video").forEach((video) => {
      if (video !== videoRef.current) video.pause();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("has-room-lightbox");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="review-lightbox" role="presentation">
      <button
        type="button"
        className="review-lightbox__backdrop"
        aria-label="Close review"
        onClick={onClose}
      />

      <div
        className="review-lightbox__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Review by ${review.name}`}
      >
        <div className="review-lightbox__toolbar">
          <div>
            <p className="review-lightbox__name">{review.name}</p>
            <p className="review-lightbox__role">{review.role}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="review-lightbox__close"
            aria-label="Close review"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <video
          ref={videoRef}
          className="review-lightbox__player"
          src={review.src}
          poster={review.poster}
          controls
          autoPlay
          playsInline
          preload="auto"
        />
      </div>
    </div>,
    document.body,
  );
}

function ShowcaseVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blockedByBrowser, setBlockedByBrowser] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let unmuteOnGesture: (() => void) | null = null;

    const startWithSound = async () => {
      video.muted = false;
      video.volume = 1;

      try {
        await video.play();
        setBlockedByBrowser(false);
        return;
      } catch {
        // Browsers reject unmuted autoplay until the visitor interacts.
      }

      video.muted = true;
      try {
        await video.play();
      } catch {
        return;
      }
      setBlockedByBrowser(true);

      unmuteOnGesture = () => {
        video.muted = false;
        video.volume = 1;
        void video.play();
        setBlockedByBrowser(false);
      };

      const events = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
      const handler = () => {
        unmuteOnGesture?.();
        events.forEach((name) => window.removeEventListener(name, handler));
      };
      events.forEach((name) =>
        window.addEventListener(name, handler, { once: true, passive: true }),
      );
      unmuteOnGesture = handler;
    };

    void startWithSound();

    return () => {
      if (unmuteOnGesture) {
        ["pointerdown", "keydown", "touchstart", "wheel"].forEach((name) =>
          window.removeEventListener(name, unmuteOnGesture as () => void),
        );
      }
    };
  }, []);

  const enableSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    void video.play();
    setBlockedByBrowser(false);
  };

  return (
    <div className="video-showcase__frame">
      <video
        ref={videoRef}
        className="video-showcase__player"
        src="/videos/conference-hadith.mp4"
        poster="/videos/conference-hadith-poster.jpg"
        controls
        autoPlay
        loop
        playsInline
        preload="auto"
      />

      {blockedByBrowser ? (
        <button
          type="button"
          className="video-showcase__unmute"
          onClick={enableSound}
        >
          Tap for sound
        </button>
      ) : null}
    </div>
  );
}

function VideoReviewsCarousel() {
  const count = videoReviews.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const [activeReview, setActiveReview] = useState<VideoReview | null>(null);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startOffset: number;
    moved: boolean;
  } | null>(null);
  const loopWidthRef = useRef(0);

  const measureLoopWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || count === 0) return 0;
    const first = track.children[0] as HTMLElement | undefined;
    const midpoint = track.children[count] as HTMLElement | undefined;
    if (!first || !midpoint) return 0;
    // Distance from first slide to its duplicate = exact seamless loop length.
    return midpoint.offsetLeft - first.offsetLeft;
  }, [count]);

  const wrapOffset = useCallback((value: number) => {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return value;
    let next = value % loopWidth;
    if (next < 0) next += loopWidth;
    return next;
  }, []);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Negative translate advances 1 → 2 → 3 while keeping both sides filled.
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, []);

  const nudge = useCallback(
    (direction: 1 | -1) => {
      const loopWidth = loopWidthRef.current || measureLoopWidth();
      if (loopWidth <= 0) return;
      loopWidthRef.current = loopWidth;
      const step = loopWidth / count;
      offsetRef.current = wrapOffset(offsetRef.current + direction * step);
      applyTransform();
    },
    [applyTransform, count, measureLoopWidth, wrapOffset],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      reduceMotionRef.current = media.matches;
    };
    syncMotion();
    media.addEventListener("change", syncMotion);

    const updateLoop = () => {
      loopWidthRef.current = measureLoopWidth();
      offsetRef.current = wrapOffset(offsetRef.current);
      applyTransform();
    };

    updateLoop();
    window.addEventListener("resize", updateLoop);

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(now - last, 64);
      last = now;

      if (
        !pausedRef.current &&
        !reduceMotionRef.current &&
        !dragState.current &&
        loopWidthRef.current > 0
      ) {
        offsetRef.current = wrapOffset(
          offsetRef.current + (VIDEO_REVIEW_SPEED * delta) / 1000,
        );
        applyTransform();
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      media.removeEventListener("change", syncMotion);
      window.removeEventListener("resize", updateLoop);
      window.cancelAnimationFrame(frame);
    };
  }, [applyTransform, measureLoopWidth, wrapOffset]);

  const setPaused = (value: boolean) => {
    pausedRef.current = value;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
      moved: false,
    };
    setPaused(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (drag?.pointerId !== event.pointerId) return;

    const travel = event.clientX - drag.startX;
    if (!drag.moved) {
      // Below the threshold the gesture stays a tap so play buttons keep working.
      if (Math.abs(travel) < DRAG_THRESHOLD) return;
      drag.moved = true;
      viewportRef.current?.setPointerCapture(event.pointerId);
    }

    // Dragging right decreases offset (rewind); dragging left advances.
    offsetRef.current = wrapOffset(drag.startOffset - travel);
    applyTransform();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    if (!activeReview) setPaused(false);
  };

  const openReview = (review: VideoReview) => {
    setPaused(true);
    setActiveReview(review);
  };

  const closeReview = () => {
    setActiveReview(null);
    setPaused(false);
  };

  const loopedReviews = [...videoReviews, ...videoReviews];

  return (
    <div
      ref={carouselRef}
      className="video-reviews__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Guest video reviews"
    >
      <div
        ref={viewportRef}
        className="video-reviews__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="video-reviews__track">
          {loopedReviews.map((review, i) => (
            <article
              key={`${review.id}-${i}`}
              className="video-reviews__slide"
            >
              {review.src && review.poster ? (
                <button
                  type="button"
                  className="video-reviews__slide-media"
                  aria-label={`Play review by ${review.name}`}
                  onClick={() => openReview(review)}
                >
                  <Image
                    className="video-reviews__poster"
                    src={review.poster}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 60vw, 22vw"
                    draggable={false}
                  />
                  <span className="video-reviews__play" aria-hidden="true">
                    <PlayIcon size={20} />
                  </span>
                </button>
              ) : (
                <VideoPlaceholder
                  label="Guest review"
                  tone={(i % 3) + 1}
                />
              )}

              {review.name ? (
                <p className="video-reviews__slide-name">{review.name}</p>
              ) : null}
              {review.role ? (
                <p className="video-reviews__slide-role">{review.role}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <div className="video-reviews__controls">
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Previous story"
          onClick={() => nudge(-1)}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Next story"
          onClick={() => nudge(1)}
        >
          <ChevronRight />
        </button>
      </div>

      {activeReview ? (
        <ReviewLightbox review={activeReview} onClose={closeReview} />
      ) : null}
    </div>
  );
}

function TestimonialsCarousel() {
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(2);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setPerView(query.matches ? 1 : 2);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const maxIndex = Math.max(0, count - perView);
  const visibleIndex = Math.min(index, maxIndex);

  const goPrevious = () =>
    setIndex((current) => {
      const safeIndex = Math.min(current, maxIndex);
      return safeIndex <= 0 ? maxIndex : safeIndex - 1;
    });
  const goNext = () =>
    setIndex((current) => {
      const safeIndex = Math.min(current, maxIndex);
      return safeIndex >= maxIndex ? 0 : safeIndex + 1;
    });

  return (
    <div
      className="testimonials__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Guest testimonials"
    >
      <div className="testimonials__viewport">
        <div
          className="testimonials__track"
          style={{ "--i": visibleIndex } as React.CSSProperties}
        >
          {testimonials.map((testimonial, i) => (
            <figure
              key={testimonial.id}
              className="testimonial-card"
              aria-hidden={i < visibleIndex || i >= visibleIndex + perView}
            >
              <div className="testimonial-card__content">
                <span className="testimonial-card__mark" aria-hidden="true">
                  “
                </span>
                <blockquote className="testimonial-card__quote">
                  {testimonial.quote}
                </blockquote>
              </div>
              <figcaption className="testimonial-card__person">
                <div
                  className={`media-placeholder testimonial-card__photo media-placeholder--tone-${(i % 3) + 1}`}
                  role="img"
                  aria-label={`${testimonial.name} portrait placeholder`}
                >
                  <span>Photo</span>
                </div>
                <p className="testimonial-card__name">{testimonial.name}</p>
                <p className="testimonial-card__role">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="testimonials__controls">
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Previous testimonial"
          onClick={goPrevious}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Next testimonial"
          onClick={goNext}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export function ReviewsTestimonies() {
  return (
    <>
      <section className="video-reviews" aria-labelledby="video-reviews-heading">
        <div className="video-reviews__intro">
          <p className="video-reviews__eyebrow">HADITH Stories</p>
          <h1 id="video-reviews-heading" className="video-reviews__heading">
            Reviews
          </h1>
        </div>
        <VideoReviewsCarousel />

        <article className="video-reviews__landscape">
          <video
            className="video-reviews__landscape-player"
            src={landscapeReview.src}
            poster={landscapeReview.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={`Review by ${landscapeReview.name}`}
          />
          <p className="video-reviews__slide-name">{landscapeReview.name}</p>
          <p className="video-reviews__slide-role">{landscapeReview.role}</p>
        </article>
      </section>

      <section
        className="video-showcase"
        aria-labelledby="video-showcase-heading"
      >
        <div className="video-showcase__inner">
          <div className="video-showcase__card">
            <p className="video-showcase__eyebrow">Featured Event</p>
            <h2 id="video-showcase-heading" className="video-showcase__title">
              The First International Conference
            </h2>
            <p className="video-showcase__body">
              <cite>Al-Jami&rsquo; al-Musnad al-Sahih: The Book of an Ummah</cite>,
              held at HADITH Hotel, Imam al-Bukhari Memorial Complex,
              Samarkand, Uzbekistan, on 9–10 July 2026.
            </p>
          </div>
          <div className="video-showcase__media">
            <ShowcaseVideo />
          </div>
        </div>
      </section>

      <section className="testimonials" aria-labelledby="testimonials-heading">
        <div className="testimonials__inner">
          <div className="testimonials__intro">
            <p className="testimonials__eyebrow">In Their Words</p>
            <h2 id="testimonials-heading" className="testimonials__heading">
              Guest Perspectives
            </h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>
    </>
  );
}
