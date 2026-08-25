"use client";

import SiteImage from "@/components/SiteImage";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import {
  GeographicBreakdownModal,
  type GeographicMetricKind,
} from "@/components/GeographicBreakdownModal";
import { ProfileDownloadLink } from "@/components/ProfileDownloadLink";
import {
  fetchDownloadMetrics,
  fetchVisitorMetrics,
  registerVisitor,
  type GeographicBreakdown,
} from "@/lib/siteMetrics";

export function OverviewFarewell() {
  const t = useTranslations("overview.farewell");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [downloadCount, setDownloadCount] = useState<number | null>(null);
  const [geographicMetric, setGeographicMetric] =
    useState<GeographicMetricKind | null>(null);

  useEffect(() => {
    let active = true;

    const showVisitorCount = (viewEvents: number | null) => {
      if (active) setVisitorCount(viewEvents);
    };
    const showDownloadCount = (downloadEvents: number | null) => {
      if (active) setDownloadCount(downloadEvents);
    };

    const refreshTotals = () => {
      void fetchVisitorMetrics().then((metrics) => {
        showVisitorCount(metrics?.viewEvents ?? null);
      });
      void fetchDownloadMetrics().then((metrics) => {
        showDownloadCount(metrics?.downloadEvents ?? null);
      });
    };

    void Promise.all([registerVisitor(), fetchDownloadMetrics()]).then(
      ([, downloadMetrics]) => {
        if (!active) return;
        showDownloadCount(downloadMetrics?.downloadEvents ?? null);
        void fetchVisitorMetrics().then((metrics) => {
          showVisitorCount(metrics?.viewEvents ?? null);
        });
      },
    );

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) refreshTotals();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      active = false;
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  const stats = [
    {
      id: "downloads",
      value: downloadCount?.toLocaleString("en") ?? "—",
      label: t("downloadsLabel"),
    },
    {
      id: "visitors",
      value: visitorCount?.toLocaleString("en") ?? "—",
      label: t("visitorsLabel"),
    },
  ];
  const closeGeography = useCallback(() => setGeographicMetric(null), []);
  const handleGeographyLoaded = useCallback(
    (breakdown: GeographicBreakdown) => {
      if (geographicMetric === "visitors") {
        setVisitorCount(breakdown.totalRecorded);
      } else if (geographicMetric === "downloads") {
        setDownloadCount(breakdown.totalRecorded);
      }
    },
    [geographicMetric],
  );

  return (
    <>
      <section
        className="overview-farewell"
        aria-labelledby="overview-farewell-heading"
      >
        <div className="overview-farewell__visual">
          <div className="overview-farewell__photo">
            <SiteImage
              className="overview-farewell__image"
              src="/images/overview-features/starry-night.webp"
              alt="HADITH Hotel beneath a starry night sky"
              fill
              sizes="100vw"
            />
          </div>
        </div>

        <div className="overview-farewell__copy">
          <p className="overview-farewell__eyebrow">{t("eyebrow")}</p>
          <h2
            id="overview-farewell-heading"
            className="overview-farewell__title"
          >
            {t("title")}
          </h2>
        </div>

        <div className="overview-farewell__footer">
          <div className="overview-farewell__stats" aria-label={t("statsAriaLabel")}>
            {stats.map((stat) => (
              <button
                key={stat.id}
                type="button"
                className="overview-farewell__stat"
                aria-haspopup="dialog"
                onClick={() =>
                  setGeographicMetric(stat.id as GeographicMetricKind)
                }
              >
                <span className="overview-farewell__stat-value">{stat.value}</span>
                <span className="overview-farewell__stat-label">{stat.label}</span>
                <span className="overview-farewell__stat-action">
                  {t("viewLocations")} <span aria-hidden="true">↗</span>
                </span>
              </button>
            ))}
          </div>

          <div className="overview-farewell__actions">
            <ProfileDownloadLink
              className="overview-farewell__download"
              onTracked={(metrics) =>
                setDownloadCount(metrics.downloadEvents)
              }
            >
              {t("downloadProfile")}
            </ProfileDownloadLink>
            <button
              type="button"
              className="overview-farewell__reserve"
              data-reserve-anchor
              onClick={() => setComingSoonOpen(true)}
            >
              <span>{t("reserve")}</span>
            </button>
          </div>
        </div>
      </section>

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        eyebrow={t("comingSoon.eyebrow")}
        body={t("comingSoon.body")}
      />
      <GeographicBreakdownModal
        metric={geographicMetric}
        onClose={closeGeography}
        onLoaded={handleGeographyLoaded}
      />
    </>
  );
}
