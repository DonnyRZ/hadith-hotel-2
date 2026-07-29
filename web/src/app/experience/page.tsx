import type { Metadata } from "next";
import { ExperienceGroups } from "@/components/ExperienceGroups";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export const metadata: Metadata = {
  title: "Experience",
};

const heroSlides = [
  "Experience hero image 1",
  "Experience hero image 2",
] as const;

export default function ExperiencePage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Experience" slides={heroSlides} />
      <ExperienceGroups />
    </main>
  );
}
