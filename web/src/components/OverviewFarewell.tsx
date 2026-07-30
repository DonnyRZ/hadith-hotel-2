"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { ProfileDownloadLink } from "@/components/ProfileDownloadLink";
import {
  fetchDownloadMetrics,
  fetchVisitorMetrics,
} from "@/lib/siteMetrics";

const comingSoonCopy = {
  reserve: {
    eyebrow: "Reservations",
    body: "Online booking will be available shortly. Thank you for your interest in HADITH Hotel.",
  },
} as const;

export function OverviewFarewell() {
  const [comingSoon, setComingSoon] = useState<
    keyof typeof comingSoonCopy | null
  >(null);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([fetchVisitorMetrics(), fetchDownloadMetrics()]).then(
      ([visitorMetrics, downloadMetrics]) => {
        if (!active) return;
        setVisitorCount(visitorMetrics?.count ?? null);
        setDownloadCount(downloadMetrics?.totalDownloads ?? null);
      },
    );

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      id: "downloads",
      value: downloadCount?.toLocaleString("en") ?? "—",
      label: "Profile Downloads",
    },
    {
      id: "visitors",
      value: visitorCount?.toLocaleString("en") ?? "—",
      label: "Profile Visitors",
    },
  ];

  return (
    <>
      <section
        className="overview-farewell"
        aria-labelledby="overview-farewell-heading"
      >
        <div className="overview-farewell__visual">
          <div className="overview-farewell__photo">
            <Image
              className="overview-farewell__image"
              src="/images/overview-features/starry-night.webp"
              alt="HADITH Hotel beneath a starry night sky"
              fill
              sizes="100vw"
            />
          </div>
        </div>

        <div className="overview-farewell__copy">
          <p className="overview-farewell__eyebrow">Until we welcome you</p>
          <h2
            id="overview-farewell-heading"
            className="overview-farewell__title"
          >
            Some hotels give you somewhere to stay. HADITH Hotel gives you
            peace worth remembering at the Complex of Imam Al Bukhari.
          </h2>
        </div>

        <div className="overview-farewell__footer">
          <dl className="overview-farewell__stats">
            {stats.map((stat) => (
              <div key={stat.id} className="overview-farewell__stat">
                <dd className="overview-farewell__stat-value">{stat.value}</dd>
                <dt className="overview-farewell__stat-label">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <div className="overview-farewell__actions">
            <ProfileDownloadLink
              className="overview-farewell__download"
              onTracked={(metrics) =>
                setDownloadCount(metrics.totalDownloads)
              }
            >
              Download Profile
            </ProfileDownloadLink>
            <button
              type="button"
              className="overview-farewell__reserve"
              data-reserve-anchor
              onClick={() => setComingSoon("reserve")}
            >
              <span>Reserve</span>
            </button>
          </div>
        </div>
      </section>

      <ComingSoonModal
        open={comingSoon !== null}
        onClose={() => setComingSoon(null)}
        eyebrow={comingSoon ? comingSoonCopy[comingSoon].eyebrow : undefined}
        body={comingSoon ? comingSoonCopy[comingSoon].body : undefined}
      />
    </>
  );
}
