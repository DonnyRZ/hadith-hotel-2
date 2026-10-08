import SiteImage from "@/components/SiteImage";
import { RoomImagePlaceholder } from "@/components/RoomImagePlaceholder";
import type { CSSProperties } from "react";

export type HeroMediaSlide = {
  id: string;
  label: string;
  src: string | null;
  placeholderLabel?: string;
  mobileSrc?: string;
  position?: string;
  mobilePosition?: string;
};

type HeroMediaProps = {
  slide: HeroMediaSlide;
  priority?: boolean;
  eager?: boolean;
};

export function HeroMedia({
  slide,
  priority = false,
  eager = true,
}: HeroMediaProps) {
  const positionStyle = {
    "--hero-position": slide.position ?? "50% 50%",
    "--hero-position-mobile":
      slide.mobilePosition ?? slide.position ?? "50% 50%",
  } as CSSProperties;

  return (
    <div
      className={`hero-media${slide.mobileSrc ? " hero-media--has-mobile" : ""}${slide.placeholderLabel ? " hero-media--soon" : ""}`}
      role={slide.src || slide.placeholderLabel ? "img" : undefined}
      aria-label={slide.src || slide.placeholderLabel ? slide.label : undefined}
      aria-hidden={!slide.src && !slide.placeholderLabel ? true : undefined}
      style={positionStyle}
    >
      {slide.placeholderLabel ? (
        <span className="hero-media__placeholder-label">
          {slide.placeholderLabel}
        </span>
      ) : slide.src ? (
        <>
          <SiteImage
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
            <SiteImage
              className="hero-media__image hero-media__image--mobile"
              src={slide.mobileSrc}
              alt=""
              fill
              sizes="(max-width: 720px) 100vw, 1px"
              loading={eager ? "eager" : "lazy"}
              aria-hidden="true"
            />
          ) : null}
        </>
      ) : <RoomImagePlaceholder />}
    </div>
  );
}
