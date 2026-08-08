import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CafeDiningVenues } from "@/components/CafeDiningVenues";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cafeDining");
  return { title: t("metaTitle") };
}

export default async function CafeDiningPage() {
  const t = await getTranslations("cafeDining");

  const heroSlides = [
    {
      id: "dining-hero-cafe",
      label: t("hero.cafe"),
      src: "/images/cafe-dining/cafe-1.webp",
      position: "50% 50%",
      mobilePosition: "42% 50%",
    },
    {
      id: "dining-hero-buffet",
      label: t("hero.buffet"),
      src: "/images/cafe-dining/buffet.webp",
      position: "50% 50%",
      mobilePosition: "55% 50%",
    },
  ] as const;

  return (
    <main className="content-page">
      <PageHeroCarousel title={t("metaTitle")} slides={heroSlides} />
      <CafeDiningVenues />
    </main>
  );
}
