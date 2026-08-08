"use client";

import { useTranslations } from "next-intl";

type ScrollCueProps = {
  /** Anchor target for overview-style pages. If omitted, scrolls the page down. */
  href?: string;
};

export function ScrollCue({ href }: ScrollCueProps) {
  const t = useTranslations("common");

  const scrollDown = () => {
    window.scrollBy({
      top: Math.min(window.innerHeight * 0.75, 640),
      behavior: "smooth",
    });
  };

  const content = (
    <>
      <span className="scroll-cue__label">{t("scrollCue")}</span>
      <span className="scroll-cue__arrows" aria-hidden="true">
        <svg width="28" height="16" viewBox="0 0 14 8" fill="none">
          <path
            d="M1 1.5L7 6.5L13 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="scroll-cue__chevron scroll-cue__chevron--back"
          />
        </svg>
        <svg width="28" height="16" viewBox="0 0 14 8" fill="none">
          <path
            d="M1 1.5L7 6.5L13 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="scroll-cue__chevron scroll-cue__chevron--front"
          />
        </svg>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="scroll-cue" aria-label={t("scrollCue")}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className="scroll-cue"
      aria-label={t("scrollCue")}
      onClick={scrollDown}
    >
      {content}
    </button>
  );
}
