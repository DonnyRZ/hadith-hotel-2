import type { Metadata } from "next";
import { FACILITY_IMAGES } from "@/lib/facilityImages";
import { getLocale, getTranslations } from "next-intl/server";
import { GuestRegistrationThankYouOverlay } from "@/components/GuestRegistrationThankYouOverlay";
import { HeroCarousel } from "@/components/HeroCarousel";
import { JsonLd } from "@/components/JsonLd";
import { OverviewReserveAmenities } from "@/components/OverviewReserveAmenities";
import { OverviewDestinations } from "@/components/OverviewDestinations";
import { OverviewFarewell } from "@/components/OverviewFarewell";
import { OverviewHotelExperiences } from "@/components/OverviewHotelExperiences";
import { OverviewLocation } from "@/components/OverviewLocation";
import { OverviewRoomsSuites } from "@/components/OverviewRoomsSuites";
import { HOTEL_ROOM_COUNT } from "@/lib/rooms";
import { PRESIDENT_SUITE_IMAGES } from "@/lib/roomGallery";
import { homeJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("overview");
  return pageMetadata({
    locale,
    path: "/",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function OverviewPage() {
  const locale = await getLocale();
  const t = await getTranslations("overview");
  const roomT = await getTranslations("suitesRooms");

  const heroSlides = [
    {
      id: "hotel-exterior",
      label: t("hero.hotelExterior"),
      src: "/images/overview-hero/hotel-exterior.webp",
      position: "50% 52%",
      mobilePosition: "50% 52%",
    },
    {
      id: "president-suite",
      label: roomT("rooms.president-suite"),
      src: PRESIDENT_SUITE_IMAGES[1],
      position: "50% 50%",
      mobilePosition: "50% 50%",
    },
    {
      id: "pool",
      label: t("hero.pool"),
      src: FACILITY_IMAGES.pool,
      position: "50% 50%",
      mobilePosition: "35% 50%",
    },
    {
      id: "massage",
      label: t("hero.massage"),
      src: FACILITY_IMAGES.massage,
      position: "50% 50%",
      mobilePosition: "65% 50%",
    },
    {
      id: "sauna",
      label: t("hero.sauna"),
      src: FACILITY_IMAGES.sauna,
      position: "50% 50%",
      mobilePosition: "50% 50%",
    },
    {
      id: "hamam",
      label: t("hero.hamam"),
      src: FACILITY_IMAGES.hammam,
      position: "50% 50%",
      mobilePosition: "50% 50%",
    },
    {
      id: "hall",
      label: t("hero.hall"),
      src: FACILITY_IMAGES.hall,
      position: "50% 50%",
      mobilePosition: "50% 50%",
    },
  ];

  return (
    <main className="overview">
      <JsonLd data={homeJsonLd(locale)} />
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
          <div className="overview-leadership-note">
            <h2 className="overview-leadership-note__eyebrow">
              {t("leadership.eyebrow")}
            </h2>
            <blockquote className="overview-leadership-note__quote">
              <p>{t("leadership.quote")}</p>
              <footer>
                <cite>{t("leadership.attribution")}</cite>
              </footer>
            </blockquote>
          </div>
        </section>

        <OverviewReserveAmenities />

        <section className="overview-stats" aria-label="Hotel highlights">
          <div className="overview-stats__inner">
            <div className="overview-stats__item">
              <p className="overview-stats__value">{HOTEL_ROOM_COUNT}</p>
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
