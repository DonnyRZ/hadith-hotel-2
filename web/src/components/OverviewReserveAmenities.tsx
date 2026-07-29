"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Ban,
  CalendarDays,
  ConciergeBell,
  Dumbbell,
  Flower2,
  KeyRound,
  Plane,
  SquareParking,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";
import { ComingSoonModal } from "@/components/ComingSoonModal";

type Amenity = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const amenities: Amenity[] = [
  { id: "pool", label: "Indoor Swimming Pool", icon: Waves },
  { id: "spa", label: "Spa, Sauna & Hammam", icon: Flower2 },
  { id: "fitness", label: "Fitness Centre", icon: Dumbbell },
  { id: "dining", label: "Restaurant & Cafe", icon: UtensilsCrossed },
  { id: "wifi", label: "Complimentary Wi-Fi", icon: Wifi },
  { id: "room-service", label: "24-Hour Room Service", icon: ConciergeBell },
  { id: "concierge", label: "Concierge Service", icon: KeyRound },
  { id: "events", label: "Event Spaces", icon: CalendarDays },
  { id: "parking", label: "On-Site Parking", icon: SquareParking },
  { id: "transfer", label: "Airport Transfer", icon: Plane },
  { id: "no-pets", label: "No Pets", icon: Ban },
];

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
              onClick={() => setComingSoonOpen(true)}
            >
              <span>Reserve</span>
            </button>
          </div>

          <div className="overview-amenities__list-wrap">
            <p className="overview-amenities__label">Amenities</p>
            <ul className="overview-amenities__list">
              {amenities.map(({ id, label, icon: Icon }) => (
                <li key={id} className="overview-amenities__item">
                  <span className="overview-amenities__icon">
                    <Icon
                      className="overview-amenities__icon-svg"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                  </span>
                  <span className="overview-amenities__text">{label}</span>
                </li>
              ))}
            </ul>
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
