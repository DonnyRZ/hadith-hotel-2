import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ExperienceGroups } from "@/components/ExperienceGroups";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("experience");
  return { title: t("metaTitle") };
}

export default async function ExperiencePage() {
  const t = await getTranslations("experience");

  const heroSlides = [
    {
      id: "experience-hero-hamam",
      label: t("hero.hamam"),
      src: "/images/experience/hamam.webp",
      position: "50% 50%",
      mobilePosition: "54% 50%",
    },
    {
      id: "experience-hero-pool",
      label: t("hero.pool"),
      src: "/images/experience/pool.webp",
      position: "50% 50%",
      mobilePosition: "52% 50%",
    },
  ] as const;

  return (
    <main className="content-page">
      <PageHeroCarousel title={t("metaTitle")} slides={heroSlides} />
      <ExperienceGroups />
    </main>
  );
}
