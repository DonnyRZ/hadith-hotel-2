"use client";

import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import {
  Ban,
  BedDouble,
  CalendarDays,
  Flower2,
  UtensilsCrossed,
} from "lucide-react";
import { ComingSoonModal } from "@/components/ComingSoonModal";

type AmenityRow = {
  key: string;
  value?: string;
  valueKey?: string;
  detailKey?: string;
  href?: string;
};

type AmenityGroup = {
  id: string;
  titleKey: string;
  icon: LucideIcon;
  rows: AmenityRow[];
};

/* Mirrors the hotel fact sheet, with room names kept consistent site-wide */
const leftGroups: AmenityGroup[] = [
  {
    id: "accommodation",
    titleKey: "groups.accommodation.title",
    icon: BedDouble,
    rows: [
      { key: "groups.accommodation.roomsSuites", value: "114", href: "/suites-rooms" },
      { key: "groups.accommodation.standardRoom", value: "62", href: "/suites-rooms" },
      { key: "groups.accommodation.balconyRoom", value: "23", href: "/suites-rooms" },
      { key: "groups.accommodation.suite", value: "18", href: "/suites-rooms" },
      { key: "groups.accommodation.juniorSuite", value: "9", href: "/suites-rooms" },
      { key: "groups.accommodation.presidentSuite", value: "2", href: "/suites-rooms" },
    ],
  },
  {
    id: "dining",
    titleKey: "groups.dining.title",
    icon: UtensilsCrossed,
    rows: [
      {
        key: "groups.dining.sajiNusantara",
        detailKey: "groups.dining.sajiNusantaraDetail",
        href: "/cafe-dining",
      },
      { key: "groups.dining.barLounge", href: "/cafe-dining" },
      { key: "groups.dining.espressoCafe", href: "/cafe-dining" },
    ],
  },
];

const rightGroups: AmenityGroup[] = [
  {
    id: "wellness",
    titleKey: "groups.wellness.title",
    icon: Flower2,
    rows: [
      { key: "groups.wellness.indoorPool", href: "/experience" },
      { key: "groups.wellness.spaCenter", href: "/experience" },
      { key: "groups.wellness.sauna", href: "/experience" },
      { key: "groups.wellness.turkishHammam", href: "/experience" },
      { key: "groups.wellness.fitnessCentre", href: "/experience" },
      { key: "groups.wellness.beautySalon", href: "/experience" },
      { key: "groups.wellness.tennisCourt", href: "/experience#active" },
      { key: "groups.wellness.kidsPlayground", href: "/experience#active" },
      { key: "groups.wellness.padelCourt", href: "/experience#active" },
    ],
  },
  {
    id: "events",
    titleKey: "groups.events.title",
    icon: CalendarDays,
    rows: [
      {
        key: "groups.events.occupancy",
        valueKey: "groups.events.occupancyValue",
        href: "/meetings-weddings",
      },
    ],
  },
];

function AmenityGroupBlock({
  titleKey,
  icon: Icon,
  rows,
  t,
}: AmenityGroup & { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="overview-amenities__group">
      <p className="overview-amenities__group-title">
        <Icon
          className="overview-amenities__group-icon"
          strokeWidth={1.25}
          aria-hidden
        />
        {t(titleKey)}
      </p>

      <ul className="overview-amenities__rows">
        {rows.map((row) => {
          const value = row.value ?? (row.valueKey ? t(row.valueKey) : undefined);
          const label = t(row.key);
          const detail = row.detailKey ? t(row.detailKey) : undefined;

          return (
            <li key={row.key} className="overview-amenities__row">
              <span className="overview-amenities__row-main">
                {row.href ? (
                  <Link href={row.href} className="overview-amenities__row-link">
                    <span className="overview-amenities__row-label">{label}</span>
                    {detail ? (
                      <span className="overview-amenities__row-detail">
                        {detail}
                      </span>
                    ) : null}
                  </Link>
                ) : (
                  <>
                    <span className="overview-amenities__row-label">{label}</span>
                    {detail ? (
                      <span className="overview-amenities__row-detail">
                        {detail}
                      </span>
                    ) : null}
                  </>
                )}
              </span>
              {value ? (
                <span className="overview-amenities__row-value">{value}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function OverviewReserveAmenities() {
  const t = useTranslations("overview.amenities");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <>
      <section
        className="overview-amenities"
        aria-labelledby="overview-amenities-heading"
      >
        <div className="overview-amenities__inner">
          <div className="overview-amenities__reserve">
            <p className="overview-amenities__lede">{t("lede")}</p>
            <h2
              id="overview-amenities-heading"
              className="overview-amenities__title"
            >
              {t("title")}
            </h2>
            <button
              type="button"
              className="overview-amenities__reserve-btn"
              data-reserve-anchor
              onClick={() => setComingSoonOpen(true)}
            >
              <span>{t("reserve")}</span>
            </button>
          </div>

          <div className="overview-amenities__list-wrap">
            <p className="overview-amenities__label">{t("label")}</p>

            <div className="overview-amenities__groups">
              <div className="overview-amenities__col">
                {leftGroups.map((group) => (
                  <AmenityGroupBlock key={group.id} {...group} t={t} />
                ))}
              </div>
              <div className="overview-amenities__col">
                {rightGroups.map((group) => (
                  <AmenityGroupBlock key={group.id} {...group} t={t} />
                ))}
              </div>
            </div>

            <p className="overview-amenities__note">
              <Ban
                className="overview-amenities__note-icon"
                strokeWidth={1.25}
                aria-hidden
              />
              {t("noPets")}
            </p>
          </div>
        </div>
      </section>

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
      />
    </>
  );
}
