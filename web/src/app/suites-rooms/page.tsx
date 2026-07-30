import type { Metadata } from "next";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";
import { RoomsCollection } from "@/components/RoomsCollection";

export const metadata: Metadata = {
  title: "Suites & Rooms",
};

const heroSlides = [
  {
    id: "rooms-hero-suite",
    label: "HADITH Hotel Suite",
    src: "/images/overview-rooms/suite.webp",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  {
    id: "rooms-hero-junior",
    label: "Junior Suite living and dining area",
    src: "/images/overview-hero/junior-suite.webp",
    position: "48% 52%",
    mobilePosition: "28% 52%",
  },
] as const;

export default function SuitesRoomsPage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Suites & Rooms" slides={heroSlides} />
      <section className="rooms-page-intro" aria-labelledby="rooms-page-intro-title">
        <p className="rooms-page-intro__count" aria-hidden="true">
          114
        </p>
        <h2 id="rooms-page-intro-title" className="rooms-page-intro__title">
          Rooms & Suites
        </h2>
        <p className="rooms-page-intro__body">
          114 thoughtfully designed rooms and suites — matching the number of
          Surahs in the Quran — for restful stays within the Imam Al Bukhari
          Complex.
        </p>
      </section>
      <RoomsCollection />
    </main>
  );
}
