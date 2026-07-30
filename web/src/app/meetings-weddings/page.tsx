import type { Metadata } from "next";
import { MeetingsWeddings } from "@/components/MeetingsWeddings";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export const metadata: Metadata = {
  title: "Meetings & Weddings",
};

const heroSlides = [
  {
    id: "events-hall",
    label: "Meetings and weddings hall at HADITH Hotel",
    src: "/images/meetings-weddings/hall.webp",
    position: "50% 52%",
    mobilePosition: "50% 48%",
  },
] as const;

export default function MeetingsWeddingsPage() {
  return (
    <main className="content-page">
      <PageHeroCarousel
        title="Meetings & Weddings"
        slides={heroSlides}
        intro={{
          eyebrow: "Meetings & Weddings",
          heading: "A space for every occasion",
          body:
            "A refined setting for focused meetings, formal gatherings, and wedding celebrations.",
        }}
      />
      <MeetingsWeddings />
    </main>
  );
}
