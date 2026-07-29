import type { Metadata } from "next";
import { CafeDiningVenues } from "@/components/CafeDiningVenues";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export const metadata: Metadata = {
  title: "Cafe & Dining",
};

const heroSlides = [
  "Cafe & Dining hero image 1",
  "Cafe & Dining hero image 2",
] as const;

export default function CafeDiningPage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Cafe & Dining" slides={heroSlides} />
      <CafeDiningVenues />
    </main>
  );
}
