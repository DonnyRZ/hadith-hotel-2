import type { Metadata } from "next";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OverviewReserveAmenities } from "@/components/OverviewReserveAmenities";
import { OverviewDestinations } from "@/components/OverviewDestinations";
import { OverviewFarewell } from "@/components/OverviewFarewell";
import { OverviewHotelExperiences } from "@/components/OverviewHotelExperiences";
import { OverviewLocation } from "@/components/OverviewLocation";
import { OverviewRoomsSuites } from "@/components/OverviewRoomsSuites";

export const metadata: Metadata = {
  title: "Overview",
};

const heroSlides = [
  {
    id: "hotel-exterior",
    label: "HADITH Hotel exterior at sunset",
    src: "/images/overview-hero/hotel-exterior.webp",
    position: "50% 52%",
    mobilePosition: "50% 52%",
  },
  {
    id: "resto",
    label: "Saji Nusantara restaurant dining room",
    src: "/images/overview-hero/resto.webp",
    position: "50% 52%",
    mobilePosition: "50% 52%",
  },
  {
    id: "buffet",
    label: "Breakfast buffet at HADITH Hotel",
    src: "/images/overview-hero/buffet.webp",
    position: "58% 54%",
    mobilePosition: "60% 54%",
  },
  {
    id: "junior-suite",
    label: "Junior Suite living and dining area",
    src: "/images/overview-hero/junior-suite.webp",
    position: "48% 52%",
    mobilePosition: "28% 52%",
  },
  {
    id: "suite",
    label: "HADITH Hotel Suite",
    src: "/images/overview-hero/suite.webp",
    position: "52% 52%",
    mobilePosition: "68% 52%",
  },
  {
    id: "pool",
    label: "HADITH Hotel swimming pool",
    src: "/images/overview-hero/pool.webp",
    position: "50% 52%",
    mobilePosition: "50% 52%",
  },
  {
    id: "massage",
    label: "Massage treatment room",
    src: "/images/overview-hero/massage.webp",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  {
    id: "sauna",
    label: "Hotel sauna",
    src: "/images/overview-hero/sauna.webp",
    position: "50% 52%",
    mobilePosition: "50% 52%",
  },
];

export default function OverviewPage() {
  return (
    <main className="overview">
      <section className="overview-hero" aria-label="Overview hero">
        <HeroCarousel slides={heroSlides} />
      </section>

      <div className="overview-sheets" id="overview-content">
        <section
          className="overview-welcome"
          aria-labelledby="overview-welcome-heading"
        >
          <p className="overview-welcome__lede">Welcome to HADITH Hotel</p>
          <h1 id="overview-welcome-heading" className="overview-welcome__title">
            Discover a sanctuary at the heart of Samarkand
          </h1>
          <p className="overview-welcome__body">
            Born within the prestigious Imam Al Bukhari Complex — a cultural and
            spiritual landmark blending Silk Road heritage with refined modern
            development — HADITH Hotel is a contemporary sanctuary honouring the
            great hadith scholar, where Uzbek grandeur meets the warmth of
            Indonesian hospitality.
          </p>
        </section>

        <OverviewReserveAmenities />

        <section className="overview-stats" aria-label="Hotel highlights">
          <div className="overview-stats__inner">
            <div className="overview-stats__item">
              <p className="overview-stats__value">114</p>
              <p className="overview-stats__label">Rooms &amp; Suites</p>
            </div>
            <div className="overview-stats__item">
              <p className="overview-stats__value overview-stats__value--stars" aria-label="Five star">
                <span aria-hidden="true">★★★★★</span>
              </p>
              <p className="overview-stats__label">Class Rating</p>
            </div>
          </div>
        </section>

        <OverviewRoomsSuites />

        <OverviewDestinations />

        <OverviewHotelExperiences />

        <OverviewFarewell />

        <OverviewLocation />
      </div>
    </main>
  );
}
