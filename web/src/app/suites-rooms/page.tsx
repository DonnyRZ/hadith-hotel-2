import type { Metadata } from "next";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";
import { RoomsCollection } from "@/components/RoomsCollection";

export const metadata: Metadata = {
  title: "Suites & Rooms",
};

const heroSlides = [
  "Suites & Rooms hero image 1",
  "Suites & Rooms hero image 2",
] as const;

export default function SuitesRoomsPage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Suites & Rooms" slides={heroSlides} />
      <RoomsCollection />
    </main>
  );
}
