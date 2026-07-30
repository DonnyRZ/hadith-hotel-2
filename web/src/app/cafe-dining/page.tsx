import type { Metadata } from "next";
import { CafeDiningVenues } from "@/components/CafeDiningVenues";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export const metadata: Metadata = {
  title: "Cafe & Dining",
};

const heroSlides = [
  {
    id: "dining-hero-cafe",
    label: "7OZ cafe lounge with grand piano",
    src: "/images/cafe-dining/cafe-3.webp",
    position: "50% 50%",
    mobilePosition: "38% 50%",
  },
  {
    id: "dining-hero-buffet",
    label: "Saji Nusantara buffet counter",
    src: "/images/cafe-dining/buffet.webp",
    position: "50% 50%",
    mobilePosition: "55% 50%",
  },
] as const;

export default function CafeDiningPage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Cafe & Dining" slides={heroSlides} />
      <CafeDiningVenues />
    </main>
  );
}
