import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EventsHub } from "@/components/EventsHub";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("events");
  return { title: t("metaTitle") };
}

export default async function EventsPage() {
  const t = await getTranslations("events");

  const heroSlides = [
    {
      id: "events-hero-hall",
      label: t("hallAlt"),
      src: "/images/events/hall.png",
      position: "50% 50%",
      mobilePosition: "50% 48%",
    },
  ] as const;

  return (
    <main className="content-page">
      <PageHeroCarousel title={t("metaTitle")} slides={heroSlides} />
      <EventsHub />
    </main>
  );
}
