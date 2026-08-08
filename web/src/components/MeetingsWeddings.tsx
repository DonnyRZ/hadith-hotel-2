"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ComingSoonModal } from "@/components/ComingSoonModal";

const eventUseKeys = ["meetings", "weddings"] as const;
const venueFactKeys = ["capacity", "setups", "facilities"] as const;

export function MeetingsWeddings() {
  const t = useTranslations("meetingsWeddings");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <>
      <section className="event-uses" aria-labelledby="event-uses-heading">
        <div className="event-uses__inner">
          <header className="event-uses__intro">
            <p className="event-uses__eyebrow">{t("eventUses.eyebrow")}</p>
            <h2 id="event-uses-heading" className="event-uses__heading">
              {t("eventUses.heading")}
            </h2>
            <p className="event-uses__lead">{t("eventUses.lead")}</p>
          </header>

          <div className="event-uses__grid">
            {eventUseKeys.map((key) => {
              const base = `eventUses.${key}`;
              const highlights = t.raw(`${base}.highlights`) as string[];
              return (
                <article key={key} className="event-use">
                  <p className="event-use__eyebrow">{t(`${base}.eyebrow`)}</p>
                  <h3 className="event-use__title">{t(`${base}.title`)}</h3>
                  <p className="event-use__body">{t(`${base}.description`)}</p>

                  <ul className="event-use__highlights">
                    {highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="event-facts" aria-labelledby="event-facts-heading">
        <div className="event-facts__inner">
          <h2 id="event-facts-heading" className="event-facts__heading">
            {t("facts.heading")}
          </h2>

          <dl className="event-facts__grid">
            {venueFactKeys.map((key) => (
              <div key={key} className="event-facts__item">
                <dd className="event-facts__value">{t(`facts.${key}.value`)}</dd>
                <dt className="event-facts__label">{t(`facts.${key}.label`)}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="event-enquiry" aria-labelledby="event-enquiry-heading">
        <h2 id="event-enquiry-heading" className="event-enquiry__title">
          {t("enquiry.title")}
        </h2>
        <p className="event-enquiry__body">{t("enquiry.body")}</p>
        <button
          type="button"
          className="event-enquiry__button"
          onClick={() => setComingSoonOpen(true)}
        >
          {t("enquiry.button")}
        </button>
      </section>

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        eyebrow={t("enquiry.comingSoonEyebrow")}
        body={t("enquiry.comingSoonBody")}
      />
    </>
  );
}
