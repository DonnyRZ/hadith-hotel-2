import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { EventsHub } from "@/components/EventsHub";
import { JsonLd } from "@/components/JsonLd";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("events");
  return pageMetadata({
    locale,
    path: "/events",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function EventsPage() {
  const locale = await getLocale();
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
      <JsonLd
        data={pageJsonLd({
          locale,
          path: "/events",
          name: t("metaTitle"),
          description: t("metaDescription"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: t("metaTitle"), path: "/events" },
          ],
        })}
      />
      <PageHeroCarousel title={t("metaTitle")} slides={heroSlides} />
      <EventsHub />
    </main>
  );
}
