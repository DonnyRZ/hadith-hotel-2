import type { Metadata } from "next";
import { MeetingsWeddings } from "@/components/MeetingsWeddings";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export const metadata: Metadata = {
  title: "Meetings & Weddings",
};

const heroSlides = [
  "Meetings & Weddings hero image 1",
  "Meetings & Weddings hero image 2",
] as const;

export default function MeetingsWeddingsPage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Meetings & Weddings" slides={heroSlides} />
      <MeetingsWeddings />
    </main>
  );
}
