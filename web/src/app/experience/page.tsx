import type { Metadata } from "next";
import { ExperienceGroups } from "@/components/ExperienceGroups";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export const metadata: Metadata = {
  title: "Experience",
};

const heroSlides = [
  {
    id: "experience-hero-hamam",
    label: "HADITH Hotel Turkish hammam",
    src: "/images/experience/hamam.webp",
    position: "50% 50%",
    mobilePosition: "54% 50%",
  },
  {
    id: "experience-hero-pool",
    label: "HADITH Hotel indoor pool",
    src: "/images/experience/pool.webp",
    position: "50% 50%",
    mobilePosition: "52% 50%",
  },
] as const;

export default function ExperiencePage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Experience" slides={heroSlides} />
      <ExperienceGroups />
    </main>
  );
}
