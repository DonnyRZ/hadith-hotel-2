import Image from "next/image";
import type { CSSProperties } from "react";

export type HeroMediaSlide = {
  id: string;
  label: string;
  src?: string;
  mobileSrc?: string;
  position?: string;
  mobilePosition?: string;
};

type HeroMediaProps = {
  slide: HeroMediaSlide;
  priority?: boolean;
  eager?: boolean;
  placeholderClassName?: string;
  placeholderTone?: 1 | 2 | 3;
};

export function HeroMedia({
  slide,
  priority = false,
  eager = true,
  placeholderClassName = "",
  placeholderTone = 1,
}: HeroMediaProps) {
  const positionStyle = {
    "--hero-position": slide.position ?? "50% 50%",
    "--hero-position-mobile":
      slide.mobilePosition ?? slide.position ?? "50% 50%",
  } as CSSProperties;

  if (!slide.src) {
    return (
      <div
        className={`hero-media media-placeholder media-placeholder--tone-${placeholderTone} ${placeholderClassName}`.trim()}
        role="img"
        aria-label={slide.label}
      >
        <span>{slide.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`hero-media${slide.mobileSrc ? " hero-media--has-mobile" : ""}`}
      role="img"
      aria-label={slide.label}
      style={positionStyle}
    >
      <Image
        className="hero-media__image hero-media__image--desktop"
        src={slide.src}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        loading={priority ? undefined : eager ? "eager" : "lazy"}
        aria-hidden="true"
      />

      {slide.mobileSrc ? (
        <Image
          className="hero-media__image hero-media__image--mobile"
          src={slide.mobileSrc}
          alt=""
          fill
          sizes="(max-width: 720px) 100vw, 1px"
          loading={eager ? "eager" : "lazy"}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
