"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SiteImage from "@/components/SiteImage";
import { ComingSoonModal } from "@/components/ComingSoonModal";

const HALL_IMAGE = "/images/events/hall.png";

const FEATURES = [
  { id: "weddings", reversed: false, soon: true },
  { id: "meetings", reversed: true, soon: true },
  { id: "catering", reversed: false, soon: true },
  { id: "social", reversed: true, soon: true },
] as const;

function VenuesIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true">
      <path d="M4 26V12l6-6 6 6v14H4Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 26V12l6-6 6 6v14H16Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true">
      <rect x="6" y="8" width="20" height="16" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 8l5-4h20v16l-5 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CapacityIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true">
      <circle cx="11" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="21" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 24c.8-3.2 3-5 5-5s4.2 1.8 5 5M16 24c.8-3.2 3-5 5-5s4.2 1.8 5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function VirtualTourIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true">
      <path d="M8 10l8-4 8 4v12l-8 4-8-4V10Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 6v20M8 10l8 4 8-4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function EventsHub() {
  const t = useTranslations("events");
  const tSoon = useTranslations("common.comingSoon");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const openSoon = () => setComingSoonOpen(true);

  return (
    <>
      <section className="events-hub__plan" aria-labelledby="events-plan-heading">
        <h2 id="events-plan-heading" className="events-hub__title">
          {t("plan.title")}
        </h2>
        <p className="events-hub__lead">{t("plan.lead")}</p>
        <p className="events-hub__help">{t("plan.help")}</p>

        <ul className="events-hub__metrics">
          <li>
            <VenuesIcon />
            <span>
              <strong>{t("metrics.pending")}</strong>
              {t("metrics.venues.label")}
            </span>
          </li>
          <li>
            <AreaIcon />
            <span>
              <strong>{t("metrics.pending")}</strong>
              {t("metrics.space.label")}
            </span>
          </li>
          <li>
            <CapacityIcon />
            <span>
              <strong>{t("metrics.pending")}</strong>
              {t("metrics.capacity.label")}
            </span>
          </li>
          <li>
            <button type="button" className="events-hub__metric-btn" onClick={openSoon}>
              <VirtualTourIcon />
              <span>{t("metrics.virtualTour")}</span>
            </button>
          </li>
        </ul>

        <button type="button" className="events-hub__cta" onClick={openSoon}>
          {t("enquiry")}
        </button>
      </section>

      {FEATURES.map((feature) => (
        <section
          key={feature.id}
          className={`events-hub__feature${feature.reversed ? " is-reversed" : ""}`}
          aria-labelledby={`events-feature-${feature.id}`}
        >
          <div className="events-hub__media">
            <SiteImage
              className="events-hub__media-image"
              src={HALL_IMAGE}
              alt={feature.soon ? "" : t("hallAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
            />
            {feature.soon ? (
              <span className="events-hub__soon">{tSoon("title")}</span>
            ) : null}
          </div>
          <div className="events-hub__feature-copy">
            <h2 id={`events-feature-${feature.id}`} className="events-hub__feature-title">
              {t(`features.${feature.id}.title`)}
            </h2>
            <p>{t(`features.${feature.id}.body`)}</p>
            <button type="button" className="events-hub__cta" onClick={openSoon}>
              {t("learnMore")}
            </button>
          </div>
        </section>
      ))}

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        eyebrow={t("comingSoon.eyebrow")}
        body={t("comingSoon.body")}
      />
    </>
  );
}
