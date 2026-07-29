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
  { id: "hero-1", label: "Hero image placeholder 1" },
  { id: "hero-2", label: "Hero image placeholder 2" },
  { id: "hero-3", label: "Hero image placeholder 3" },
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
