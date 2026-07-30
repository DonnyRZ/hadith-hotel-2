import type { Metadata } from "next";
import { CafeDiningVenues } from "@/components/CafeDiningVenues";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export const metadata: Metadata = {
  title: "Cafe & Dining",
};

const heroSlides = [
  { id: "dining-hero-1", label: "Cafe & Dining hero image 1" },
  { id: "dining-hero-2", label: "Cafe & Dining hero image 2" },
] as const;

export default function CafeDiningPage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Cafe & Dining" slides={heroSlides} />
      <CafeDiningVenues />
    </main>
  );
}
