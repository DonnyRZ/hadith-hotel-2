import type { Metadata } from "next";
import { ExperienceGroups } from "@/components/ExperienceGroups";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export const metadata: Metadata = {
  title: "Experience",
};

const heroSlides = [
  { id: "experience-hero-1", label: "Experience hero image 1" },
  { id: "experience-hero-2", label: "Experience hero image 2" },
] as const;

export default function ExperiencePage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Experience" slides={heroSlides} />
      <ExperienceGroups />
    </main>
  );
}
