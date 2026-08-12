import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GuestRegistrationThankYouOverlay } from "@/components/GuestRegistrationThankYouOverlay";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OverviewReserveAmenities } from "@/components/OverviewReserveAmenities";
import { OverviewDestinations } from "@/components/OverviewDestinations";
import { OverviewFarewell } from "@/components/OverviewFarewell";
import { OverviewHotelExperiences } from "@/components/OverviewHotelExperiences";
import { OverviewLocation } from "@/components/OverviewLocation";
import { OverviewRoomsSuites } from "@/components/OverviewRoomsSuites";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("overview");
  return { title: t("metaTitle") };
}

export default async function OverviewPage() {
  const t = await getTranslations("overview");

  const heroSlides = [
    {
      id: "hotel-exterior",
      label: t("hero.hotelExterior"),
      src: "/images/overview-hero/hotel-exterior.webp",
      position: "50% 52%",
      mobilePosition: "50% 52%",
    },
    {
      id: "resto",
      label: t("hero.resto"),
      src: "/images/overview-hero/resto.webp",
      position: "50% 52%",
      mobilePosition: "50% 52%",
    },
    {
      id: "junior-suite",
      label: t("hero.juniorSuite"),
      src: "/images/overview-hero/junior-suite.webp",
      position: "48% 52%",
      mobilePosition: "28% 52%",
    },
    {
      id: "suite",
      label: t("hero.suite"),
      src: "/images/overview-hero/suite.webp",
      position: "52% 52%",
      mobilePosition: "68% 52%",
    },
    {
      id: "pool",
      label: t("hero.pool"),
      src: "/images/overview-hero/pool.webp",
      position: "50% 52%",
      mobilePosition: "50% 52%",
    },
    {
      id: "massage",
      label: t("hero.massage"),
      src: "/images/overview-hero/massage.webp",
      position: "50% 100%",
      mobilePosition: "50% 100%",
    },
    {
      id: "sauna",
      label: t("hero.sauna"),
      src: "/images/overview-hero/sauna.webp",
      position: "50% 52%",
      mobilePosition: "50% 52%",
    },
    {
      id: "hamam",
      label: t("hero.hamam"),
      src: "/images/experience/hamam.webp",
      position: "50% 52%",
      mobilePosition: "50% 52%",
    },
    {
      id: "suite-living",
      label: t("hero.suiteLiving"),
      src: "/images/rooms/suite/suite-2.png",
      position: "50% 52%",
      mobilePosition: "50% 52%",
    },
    {
      id: "hall",
      label: t("hero.hall"),
      src: "/images/meetings-weddings/hall.webp",
      position: "50% 52%",
      mobilePosition: "50% 52%",
    },
    {
      id: "salon",
      label: t("hero.salon"),
      src: "/images/overview-hero/salon.jpeg",
      position: "50% 52%",
      mobilePosition: "50% 52%",
    },
  ];

  return (
    <main className="overview">
      <GuestRegistrationThankYouOverlay />

      <section className="overview-hero" aria-label="Overview hero">
        <HeroCarousel slides={heroSlides} />
      </section>

      <div className="overview-sheets" id="overview-content">
        <section
          className="overview-welcome"
          aria-labelledby="overview-welcome-heading"
        >
          <p className="overview-welcome__lede">{t("welcome.lede")}</p>
          <h1 id="overview-welcome-heading" className="overview-welcome__title">
            {t("welcome.title")}
          </h1>
          <p className="overview-welcome__body">{t("welcome.body")}</p>
        </section>

        <OverviewReserveAmenities />

        <section className="overview-stats" aria-label="Hotel highlights">
          <div className="overview-stats__inner">
            <div className="overview-stats__item">
              <p className="overview-stats__value">114</p>
              <p className="overview-stats__label">{t("stats.roomsSuites")}</p>
            </div>
            <div className="overview-stats__item">
              <p className="overview-stats__value overview-stats__value--stars" aria-label="Five star">
                <span aria-hidden="true">★★★★★</span>
              </p>
              <p className="overview-stats__label">{t("stats.classRating")}</p>
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
