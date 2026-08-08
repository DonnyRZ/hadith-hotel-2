"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { asset } from "@/lib/asset";
import { useVideoFirstFrame } from "@/lib/useVideoFirstFrame";

type OverviewDestinationSlide = {
  id: string;
  key: string;
  video: string;
  factKeys: string[];
  tagKeys: string[];
  mapsUrls: Record<string, string>;
};

const slides: OverviewDestinationSlide[] = [
  {
    id: "imam-al-bukhari",
    key: "imamAlBukhari",
    video: "/videos/imam-al-bukhari-complex.mp4",
    factKeys: ["mausoleum", "centre"],
    tagKeys: ["pilgrimage", "scholarship", "architecture"],
    mapsUrls: {
      mausoleum:
        "https://www.google.com/maps/search/?api=1&query=39.814999,66.944485",
      centre:
        "https://www.google.com/maps/search/?api=1&query=Imam+Bukhari+International+Scientific+Research+Center+Samarkand",
    },
  },
  {
    id: "registan-square",
    key: "registanSquare",
    video: "/videos/registan-square.mp4",
    factKeys: ["square", "madrasas"],
    tagKeys: ["architecture", "tilework", "heritage"],
    mapsUrls: {
      square: "https://www.google.com/maps/search/?api=1&query=39.6545,66.9758",
      madrasas:
        "https://www.google.com/maps/search/?api=1&query=Ulugh+Beg+Madrasa+Registan+Samarkand",
    },
  },
];

export function OverviewDestinations() {
  const t = useTranslations("overview.destinations");
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const count = slides.length;
  const slide = slides[index]!;
  const progress = ((index + 1) / count) * 100;
  const base = `slides.${slide.key}`;

  const goPrevious = () =>
    setIndex((current) => (current - 1 + count) % count);
  const goNext = () => setIndex((current) => (current + 1) % count);

  useVideoFirstFrame(videoRef, slide.id);

  return (
    <section
      className="overview-destinations"
      aria-labelledby="overview-destinations-heading"
    >
      <div className="overview-destinations__inner">
        <div className="overview-destinations__media-col">
          <div className="overview-destinations__media">
            <video
              key={slide.id}
              ref={videoRef}
              className="overview-destinations__video"
              src={asset(slide.video)}
              controls
              playsInline
              preload="metadata"
              aria-label={t(`${base}.videoLabel`)}
            />
          </div>

          <div className="overview-destinations__controls">
            <button
              type="button"
              className="overview-destinations__nav"
              onClick={goPrevious}
              aria-label={t("prevAria")}
            >
              <span aria-hidden="true">‹</span> {t("previous")}
            </button>

            <div
              className="overview-destinations__progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={count}
              aria-valuenow={index + 1}
              aria-label={t("progressAria")}
            >
              <span style={{ width: `${progress}%` }} />
            </div>

            <button
              type="button"
              className="overview-destinations__nav"
              onClick={goNext}
              aria-label={t("nextAria")}
            >
              {t("next")} <span aria-hidden="true">›</span>
            </button>

            <p className="overview-destinations__counter" aria-live="polite">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="overview-destinations__copy">
          <p className="overview-destinations__eyebrow">{t("eyebrow")}</p>
          <p className="overview-destinations__journey">
            {t(`${base}.journeyEyebrow`)}
          </p>
          <h2
            id="overview-destinations-heading"
            className="overview-destinations__heading"
          >
            {t(`${base}.title`)}
          </h2>
          <p className="overview-destinations__body">
            {t(`${base}.description`)}
          </p>

          <dl className="destination-journey__places">
            {slide.factKeys.map((factKey) => {
              const label = t(`${base}.facts.${factKey}.label`);
              return (
                <div key={factKey} className="destination-journey__place">
                  <dt>{label}</dt>
                  <dd>{t(`${base}.facts.${factKey}.detail`)}</dd>
                  <a
                    className="destination-journey__maps"
                    href={slide.mapsUrls[factKey]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("openInMaps", { label })}
                  >
                    <span className="destination-journey__maps-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                        <path
                          d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 12 4.3a6.5 6.5 0 0 0-6.5 6.5C5.5 15.8 12 21 12 21Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <circle
                          cx="12"
                          cy="10.8"
                          r="2.2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                    </span>
                    <span>{t("maps")}</span>
                  </a>
                </div>
              );
            })}
          </dl>

          <ul
            className="destination-journey__highlights"
            aria-label={t("highlightsAria")}
          >
            {slide.tagKeys.map((tagKey) => (
              <li key={tagKey}>{t(`${base}.tags.${tagKey}`)}</li>
            ))}
          </ul>

          <Link
            href="/experience#destinations"
            className="overview-destinations__explore"
          >
            {t("explore")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
