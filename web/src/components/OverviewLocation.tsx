import { useTranslations } from "next-intl";

const mapUrl =
  "https://www.google.com/maps?q=39.808167,66.949639&z=14&output=embed";
const directionsUrl = "https://maps.app.goo.gl/71EH9gqP3kGgsMAB6";

export function OverviewLocation() {
  const t = useTranslations("overview.location");

  return (
    <section
      className="overview-location"
      aria-labelledby="overview-location-heading"
    >
      <div className="overview-location__inner">
        <div className="overview-location__content">
          <p className="overview-location__eyebrow">{t("eyebrow")}</p>
          <h2 id="overview-location-heading" className="overview-location__title">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h2>

          <address className="overview-location__address">
            <strong>HADITH Hotel</strong>
            <span>RW5X+9P, Xo&lsquo;ja Ismoil,</span>
            <span>Samarqand viloyati, Uzbekistan</span>
          </address>
        </div>

        <div className="overview-location__map">
          <iframe
            src={mapUrl}
            title={t("mapTitle")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            className="overview-location__map-overlay"
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t("mapOverlayAria")}
          >
            <span className="overview-location__map-link">
              {t("viewOnMaps")}
              <span aria-hidden="true">↗</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
