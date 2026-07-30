import type { Metadata } from "next";
import { MeetingsWeddings } from "@/components/MeetingsWeddings";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export const metadata: Metadata = {
  title: "Meetings & Weddings",
};

const heroSlides = [
  { id: "events-hero-1", label: "Meetings & Weddings hero image 1" },
  { id: "events-hero-2", label: "Meetings & Weddings hero image 2" },
] as const;

export default function MeetingsWeddingsPage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Meetings & Weddings" slides={heroSlides} />
      <MeetingsWeddings />
    </main>
  );
}
