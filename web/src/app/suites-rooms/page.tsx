import type { Metadata } from "next";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";
import { RoomsCollection } from "@/components/RoomsCollection";

export const metadata: Metadata = {
  title: "Suites & Rooms",
};

const heroSlides = [
  { id: "rooms-hero-1", label: "Suites & Rooms hero image 1" },
  { id: "rooms-hero-2", label: "Suites & Rooms hero image 2" },
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
          Thoughtfully designed spaces for restful stays within the Imam Al
          Bukhari Complex.
        </p>
      </section>
      <RoomsCollection />
    </main>
  );
}
