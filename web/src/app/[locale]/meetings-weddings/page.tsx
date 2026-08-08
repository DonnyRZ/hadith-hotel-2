import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MeetingsWeddings } from "@/components/MeetingsWeddings";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meetingsWeddings");
  return { title: t("metaTitle") };
}

export default async function MeetingsWeddingsPage() {
  const t = await getTranslations("meetingsWeddings");

  const heroSlides = [
    {
      id: "events-hall",
      label: t("hero.hall"),
      src: "/images/meetings-weddings/hall.webp",
      position: "50% 52%",
      mobilePosition: "50% 48%",
    },
  ] as const;

  return (
    <main className="content-page">
      <PageHeroCarousel
        title={t("metaTitle")}
        slides={heroSlides}
        intro={{
          eyebrow: t("intro.eyebrow"),
          heading: t("intro.heading"),
          body: t("intro.body"),
        }}
      />
      <MeetingsWeddings />
    </main>
  );
}
