"use client";

import { useState } from "react";
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
  label: string;
  value?: string;
  detail?: string;
};

type AmenityGroup = {
  id: string;
  title: string;
  icon: LucideIcon;
  rows: AmenityRow[];
};

/* Mirrors the hotel fact sheet, with room names kept consistent site-wide */
const leftGroups: AmenityGroup[] = [
  {
    id: "accommodation",
    title: "Accommodation",
    icon: BedDouble,
    rows: [
      { label: "Rooms & Suites", value: "114" },
      { label: "Standard Room", value: "62" },
      { label: "Balcony Room", value: "23" },
      { label: "Suite", value: "18" },
      { label: "Junior Suite", value: "9" },
      { label: "President Suite", value: "2" },
    ],
  },
  {
    id: "dining",
    title: "Dining",
    icon: UtensilsCrossed,
    rows: [
      { label: "Saji Nusantara Restaurant", detail: "Uzbek Cuisine" },
      { label: "Bar & Lounge" },
      { label: "7OZ Espresso Cafe" },
    ],
  },
];

const rightGroups: AmenityGroup[] = [
  {
    id: "wellness",
    title: "Wellness & Sport",
    icon: Flower2,
    rows: [
      { label: "Indoor Pool" },
      { label: "Spa Center" },
      { label: "Sauna" },
      { label: "Turkish Hammam" },
      { label: "Fitness Centre" },
      { label: "Beauty Salon" },
      { label: "Tennis Court" },
      { label: "Kids’ Playground" },
      { label: "Padel Court" },
    ],
  },
  {
    id: "events",
    title: "Events & Culture",
    icon: CalendarDays,
    rows: [
      { label: "Occupancy", value: "250 persons" },
    ],
  },
];

function AmenityGroupBlock({ title, icon: Icon, rows }: AmenityGroup) {
  return (
    <div className="overview-amenities__group">
      <p className="overview-amenities__group-title">
        <Icon
          className="overview-amenities__group-icon"
          strokeWidth={1.25}
          aria-hidden
        />
        {title}
      </p>

      <ul className="overview-amenities__rows">
        {rows.map((row) => (
          <li key={row.label} className="overview-amenities__row">
            <span className="overview-amenities__row-main">
              <span className="overview-amenities__row-label">{row.label}</span>
              {row.detail ? (
                <span className="overview-amenities__row-detail">{row.detail}</span>
              ) : null}
            </span>
            {row.value ? (
              <span className="overview-amenities__row-value">{row.value}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OverviewReserveAmenities() {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <>
      <section
        className="overview-amenities"
        aria-labelledby="overview-amenities-heading"
      >
        <div className="overview-amenities__inner">
          <div className="overview-amenities__reserve">
            <p className="overview-amenities__lede">Begin your stay</p>
            <h2
              id="overview-amenities-heading"
              className="overview-amenities__title"
            >
              Reserve at HADITH Hotel
            </h2>
            <button
              type="button"
              className="overview-amenities__reserve-btn"
              data-reserve-anchor
              onClick={() => setComingSoonOpen(true)}
            >
              <span>Reserve</span>
            </button>
          </div>

          <div className="overview-amenities__list-wrap">
            <p className="overview-amenities__label">Amenities &amp; Hotel Information</p>

            <div className="overview-amenities__groups">
              <div className="overview-amenities__col">
                {leftGroups.map((group) => (
                  <AmenityGroupBlock key={group.id} {...group} />
                ))}
              </div>
              <div className="overview-amenities__col">
                {rightGroups.map((group) => (
                  <AmenityGroupBlock key={group.id} {...group} />
                ))}
              </div>
            </div>

            <p className="overview-amenities__note">
              <Ban
                className="overview-amenities__note-icon"
                strokeWidth={1.25}
                aria-hidden
              />
              No Pets
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
