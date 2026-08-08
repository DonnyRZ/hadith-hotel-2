"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import SiteImage from "@/components/SiteImage";
import { asset } from "@/lib/asset";

type VideoReviewConfig = {
  id: string;
  personKey: string;
  src: string;
  poster: string;
};

type TestimonialConfig = {
  id: string;
  personKey: string;
  quoteKey?: string;
  photo?: string;
  /** Keeps the face in frame once the 3:4 portrait crop kicks in. */
  photoPosition?: string;
};

type Person = { name: string; role: string };
type VideoReview = { id: string; name: string; role: string; src: string; poster: string };
type Testimonial = {
  id: string;
  quote?: string;
  name: string;
  role: string;
  photo?: string;
  photoPosition?: string;
};

const videoReviewConfigs: VideoReviewConfig[] = [
  {
    id: "mohamed-shaheem-ali-saeed",
    personKey: "mohamedShaheemAliSaeed",
    src: "/videos/mohamed-shaheem-ali-saeed.mp4",
    poster: "/videos/mohamed-shaheem-ali-saeed-poster.jpg",
  },
  {
    id: "shady-al-suleiman",
    personKey: "shadyAlSuleiman",
    src: "/videos/shady-al-suleiman.mp4",
    poster: "/videos/shady-al-suleiman-poster.jpg",
  },
  {
    id: "syekh-mohamed-el-duwaini",
    personKey: "syekhMohamedElDuwaini",
    src: "/videos/syekh-mohamed-el-duwaini.mp4",
    poster: "/videos/syekh-mohamed-el-duwaini-poster.jpg",
  },
  {
    id: "dr-zulkifli-hasan",
    personKey: "drZulkifliHasan",
    src: "/videos/dr-zulkifli-hasan.mp4",
    poster: "/videos/dr-zulkifli-hasan-poster.jpg",
  },
  {
    id: "talgat-safich-tadzetdinov",
    personKey: "talgatSafichTadzetdinov",
    src: "/videos/talgat-safich-tadzetdinov.mp4",
    poster: "/videos/talgat-safich-tadzetdinov-poster.jpg",
  },
];

const landscapeReviewConfig: VideoReviewConfig = {
  id: "review-landscape",
  personKey: "reviewLandscape",
  src: "/videos/imad-abdullah-hamdan.mp4",
  poster: "/videos/imad-abdullah-hamdan-poster.jpg",
};

const testimonialConfigs: TestimonialConfig[] = [
  {
    id: "syekh-mohamed-el-duwaini",
    personKey: "syekhMohamedElDuwaini",
    quoteKey: "syekhMohamedElDuwaini",
    photo: "/images/testimonials/syekh-mohamed-el-duwaini.webp",
    photoPosition: "50% 20%",
  },
  {
    id: "mohamed-shaheem-ali-saeed",
    personKey: "mohamedShaheemAliSaeed",
    quoteKey: "mohamedShaheemAliSaeed",
    photo: "/images/testimonials/mohamed-shaheem-ali-saeed.webp",
  },
  {
    id: "shady-al-suleiman",
    personKey: "shadyAlSuleiman",
    quoteKey: "shadyAlSuleiman",
    photo: "/images/testimonials/shady-al-suleiman.webp",
    photoPosition: "50% 15%",
  },
  {
    id: "emad-al-din-hamdan",
    personKey: "emadAlDinHamdan",
    quoteKey: "emadAlDinHamdan",
    photo: "/images/testimonials/emad-al-din-hamdan.webp",
    photoPosition: "62% 50%",
  },
  {
    id: "dr-zulkifli-hasan",
    personKey: "drZulkifliHasan",
    quoteKey: "drZulkifliHasan",
    photo: "/images/testimonials/dr-zulkifli-hasan.webp",
    photoPosition: "50% 28%",
  },
  {
    id: "talgat-safich-tadzetdinov",
    personKey: "talgatSafichTadzetdinov",
    quoteKey: "talgatSafichTadzetdinov",
    photo: "/images/testimonials/talgat-safich-tadzetdinov.webp",
    photoPosition: "50% 18%",
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

const VIDEO_REVIEW_SPEED = 28; // px per second, continuous marquee
const DRAG_THRESHOLD = 8; // px before a pointer gesture counts as a drag

function ReviewLightbox({
  review,
  onClose,
  t,
}: {
  review: VideoReview;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
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
        aria-label={t("videoReviews.closeReviewAria")}
        onClick={onClose}
      />

      <div
        className="review-lightbox__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={t("videoReviews.reviewByAria", { name: review.name })}
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
            aria-label={t("videoReviews.closeReviewAria")}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <video
          ref={videoRef}
          className="review-lightbox__player"
          src={asset(review.src)}
          poster={asset(review.poster)}
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
  return (
    <div className="video-showcase__frame">
      <video
        className="video-showcase__player"
        src={asset("/videos/conference-hadith.mp4")}
        poster={asset("/videos/conference-hadith-poster.jpg")}
        controls
        playsInline
        preload="metadata"
      />
    </div>
  );
}

function VideoReviewsCarousel({
  videoReviews,
  t,
}: {
  videoReviews: VideoReview[];
  t: ReturnType<typeof useTranslations>;
}) {
  const count = videoReviews.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const [activeReview, setActiveReview] = useState<VideoReview | null>(null);
  // One copy only covers `loopWidth`; wide screens need more to stay filled.
  const [repeats, setRepeats] = useState(2);
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
      const loopWidth = measureLoopWidth();
      loopWidthRef.current = loopWidth;
      offsetRef.current = wrapOffset(offsetRef.current);
      applyTransform();

      const viewport = viewportRef.current;
      if (loopWidth > 0 && viewport) {
        const needed = Math.ceil(viewport.clientWidth / loopWidth) + 1;
        setRepeats((current) => Math.max(current, needed, 2));
      }
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

  const loopedReviews = useMemo(
    () => Array.from({ length: repeats }, () => videoReviews).flat(),
    [repeats, videoReviews],
  );

  return (
    <div
      ref={carouselRef}
      className="video-reviews__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("videoReviews.ariaLabel")}
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
          {loopedReviews.map((review, reviewIndex) => (
            <article
              key={`${review.id}-${reviewIndex}`}
              className="video-reviews__slide"
            >
              <button
                type="button"
                className="video-reviews__slide-media"
                aria-label={t("videoReviews.playAria", { name: review.name })}
                onClick={() => openReview(review)}
              >
                <SiteImage
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
          aria-label={t("videoReviews.prevAria")}
          onClick={() => nudge(-1)}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className="carousel-arrow"
          aria-label={t("videoReviews.nextAria")}
          onClick={() => nudge(1)}
        >
          <ChevronRight />
        </button>
      </div>

      {activeReview ? (
        <ReviewLightbox review={activeReview} onClose={closeReview} t={t} />
      ) : null}
    </div>
  );
}

function TestimonialsCarousel({
  testimonials,
  t,
}: {
  testimonials: Testimonial[];
  t: ReturnType<typeof useTranslations>;
}) {
  const count = testimonials.length;
  const [perView, setPerView] = useState(2);
  const [index, setIndex] = useState(count);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => {
      const nextPerView = query.matches ? 1 : 2;
      setPerView(nextPerView);
      setAnimate(false);
      setIndex(count);
    };

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [count]);

  useEffect(() => {
    if (animate) return;
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setAnimate(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [animate, index]);

  // Triple buffer so (5,1) is a real adjacent pair and Next keeps moving forward.
  const loopSlides = useMemo(
    () =>
      Array.from({ length: 3 }, (_, copy) =>
        testimonials.map((item) => ({
          item,
          key: `${copy}-${item.id}`,
        })),
      ).flat(),
    [testimonials],
  );

  const goPrevious = () => {
    setAnimate(true);
    setIndex((current) => current - 1);
  };

  const goNext = () => {
    setAnimate(true);
    setIndex((current) => current + 1);
  };

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;

    if (index >= 2 * count) {
      setAnimate(false);
      setIndex(index - count);
      return;
    }

    if (index < count) {
      setAnimate(false);
      setIndex(index + count);
    }
  };

  return (
    <div
      className="testimonials__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("testimonials.ariaLabel")}
    >
      <div className="testimonials__viewport">
        <div
          className={`testimonials__track${animate ? "" : " is-instant"}`}
          style={{ "--i": index } as React.CSSProperties}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopSlides.map(({ item, key }, i) => {
            const isVisible = i >= index && i < index + perView;

            return (
              <figure
                key={key}
                className="testimonial-card"
                aria-hidden={!isVisible}
              >
                <div className="testimonial-card__content">
                  <span className="testimonial-card__mark" aria-hidden="true">
                    “
                  </span>
                  <blockquote
                    className={`testimonial-card__quote${item.quote ? "" : " is-placeholder"}`}
                  >
                    {item.quote ?? t("testimonials.quotePlaceholder")}
                  </blockquote>
                </div>
                <figcaption className="testimonial-card__person">
                  <div className="testimonial-card__photo">
                    {item.photo ? (
                      <SiteImage
                        className="testimonial-card__portrait"
                        src={item.photo}
                        alt={item.name}
                        fill
                        sizes="(max-width: 760px) 42vw, 180px"
                        style={{ objectPosition: item.photoPosition }}
                      />
                    ) : (
                      <div
                        className="media-placeholder testimonial-card__photo-placeholder"
                        aria-hidden="true"
                      >
                        {t("testimonials.photoPlaceholder")}
                      </div>
                    )}
                  </div>
                  <p className="testimonial-card__name">{item.name}</p>
                  <p className="testimonial-card__role">{item.role}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="testimonials__controls">
        <button
          type="button"
          className="carousel-arrow"
          aria-label={t("testimonials.prevAria")}
          onClick={goPrevious}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className="carousel-arrow"
          aria-label={t("testimonials.nextAria")}
          onClick={goNext}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export function ReviewsTestimonies() {
  const t = useTranslations("reviews");

  const getPerson = (key: string): Person => ({
    name: t(`people.${key}.name`),
    role: t(`people.${key}.role`),
  });

  const videoReviews: VideoReview[] = videoReviewConfigs.map((config) => ({
    id: config.id,
    src: config.src,
    poster: config.poster,
    ...getPerson(config.personKey),
  }));

  const landscapeReview: VideoReview = {
    id: landscapeReviewConfig.id,
    src: landscapeReviewConfig.src,
    poster: landscapeReviewConfig.poster,
    ...getPerson(landscapeReviewConfig.personKey),
  };

  const testimonials: Testimonial[] = testimonialConfigs.map((config) => ({
    id: config.id,
    photo: config.photo,
    photoPosition: config.photoPosition,
    quote: config.quoteKey ? t(`testimonialQuotes.${config.quoteKey}`) : undefined,
    ...getPerson(config.personKey),
  }));

  return (
    <>
      <section className="video-reviews" aria-labelledby="video-reviews-heading">
        <div className="video-reviews__intro">
          <p className="video-reviews__eyebrow">{t("intro.eyebrow")}</p>
          <h1 id="video-reviews-heading" className="video-reviews__heading">
            {t("intro.heading")}
          </h1>
        </div>
        <VideoReviewsCarousel videoReviews={videoReviews} t={t} />

        <article className="video-reviews__landscape">
          <video
            className="video-reviews__landscape-player"
            src={asset(landscapeReview.src)}
            poster={asset(landscapeReview.poster)}
            controls
            playsInline
            preload="metadata"
            aria-label={t("videoReviews.reviewByAria", { name: landscapeReview.name })}
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
            <p className="video-showcase__eyebrow">{t("videoShowcase.eyebrow")}</p>
            <h2 id="video-showcase-heading" className="video-showcase__title">
              {t("videoShowcase.title")}
            </h2>
            <p className="video-showcase__body">
              <cite>{t("videoShowcase.citeTitle")}</cite>
              {t("videoShowcase.bodyRest")}
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
            <p className="testimonials__eyebrow">{t("testimonials.eyebrow")}</p>
            <h2 id="testimonials-heading" className="testimonials__heading">
              {t("testimonials.heading")}
            </h2>
          </div>
          <TestimonialsCarousel testimonials={testimonials} t={t} />
        </div>
      </section>
    </>
  );
}
