"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type VideoReview = {
  id: string;
  title: string;
  name: string;
  role: string;
};

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

const videoReviews: VideoReview[] = [
  {
    id: "review-1",
    title: "A Stay to Remember",
    name: "Guest Name",
    role: "Guest from Germany",
  },
  {
    id: "review-2",
    title: "Comfort in Every Detail",
    name: "Guest Name",
    role: "Guest from Uzbekistan",
  },
  {
    id: "review-3",
    title: "Hospitality at Its Finest",
    name: "Guest Name",
    role: "Guest from Indonesia",
  },
  {
    id: "review-4",
    title: "The Heart of Samarkand",
    name: "Guest Name",
    role: "Guest from Turkey",
  },
  {
    id: "review-5",
    title: "An Unforgettable Experience",
    name: "Guest Name",
    role: "Guest from Malaysia",
  },
];

const testimonials: Testimonial[] = [
  {
    id: "steinmeier",
    quote:
      "We are now standing in front of the Islamic Civilization Center. Please pay attention to its name — it is not about religion itself, but about Islamic civilization. This is a major scientific...",
    name: "Frank-Walter Steinmeier",
    role: "President of the Federal Republic of Germany",
  },
  {
    id: "pena",
    quote:
      "The history of Uzbekistan is truly unparalleled. It is a great civilization encompassing five thousand years of development. To understand a nation, one must know its history, and here th...",
    name: "Santiago Peña",
    role: "President of the Republic of Paraguay",
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

function VideoPlaceholder({ label, tone }: { label: string; tone: number }) {
  return (
    <div
      className={`media-placeholder video-frame media-placeholder--tone-${tone}`}
      role="img"
      aria-label={`${label} video placeholder`}
    >
      <span className="video-frame__play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      </span>
      <span className="video-frame__label">{label}</span>
    </div>
  );
}

const VIDEO_REVIEW_SPEED = 28; // px per second, continuous marquee

function VideoReviewsCarousel() {
  const count = videoReviews.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startOffset: number;
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
    };
    setPaused(true);
    viewportRef.current?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    // Dragging right decreases offset (rewind); dragging left advances.
    offsetRef.current = wrapOffset(
      dragState.current.startOffset -
        (event.clientX - dragState.current.startX),
    );
    applyTransform();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    if (!carouselRef.current?.matches(":hover")) {
      setPaused(false);
    }
  };

  const loopedReviews = [...videoReviews, ...videoReviews];

  return (
    <div
      ref={carouselRef}
      className="video-reviews__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Guest video reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!dragState.current) setPaused(false);
      }}
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
              <h3 className="video-reviews__slide-title">{review.title}</h3>
              <VideoPlaceholder
                label={`${review.title} video`}
                tone={(i % 3) + 1}
              />
              <p className="video-reviews__slide-name">{review.name}</p>
              <p className="video-reviews__slide-role">{review.role}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="video-reviews__controls">
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Previous video review"
          onClick={() => nudge(-1)}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Next video review"
          onClick={() => nudge(1)}
        >
          <ChevronRight />
        </button>
      </div>
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

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, count - perView)));
  }, [count, perView]);

  const goPrevious = () =>
    setIndex((current) => (current <= 0 ? maxIndex : current - 1));
  const goNext = () =>
    setIndex((current) => (current >= maxIndex ? 0 : current + 1));

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
          style={{ "--i": index } as React.CSSProperties}
        >
          {testimonials.map((testimonial, i) => (
            <figure
              key={testimonial.id}
              className="testimonial-card"
              aria-hidden={i < index || i >= index + perView}
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
      <section
        className="video-showcase"
        aria-labelledby="video-showcase-heading"
      >
        <div className="video-showcase__inner">
          <div className="video-showcase__card">
            <p className="video-showcase__eyebrow">Inside HADITH Hotel</p>
            <h2 id="video-showcase-heading" className="video-showcase__title">
              A Glimpse of the Hotel
            </h2>
            <p className="video-showcase__body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="video-showcase__media">
            <VideoPlaceholder label="Hotel showcase video" tone={1} />
          </div>
        </div>
      </section>

      <section className="video-reviews" aria-labelledby="video-reviews-heading">
        <div className="video-reviews__intro">
          <p className="video-reviews__eyebrow">Guest Stories</p>
          <h2 id="video-reviews-heading" className="video-reviews__heading">
            Video Reviews
          </h2>
        </div>
        <VideoReviewsCarousel />
      </section>

      <section className="testimonials" aria-labelledby="testimonials-heading">
        <div className="testimonials__inner">
          <div className="testimonials__intro">
            <p className="testimonials__eyebrow">In Their Words</p>
            <h2 id="testimonials-heading" className="testimonials__heading">
              Testimonials
            </h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>
    </>
  );
}
