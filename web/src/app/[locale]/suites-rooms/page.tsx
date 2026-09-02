import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";
import { RoomsCollection } from "@/components/RoomsCollection";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("suitesRooms");
  return pageMetadata({
    locale,
    path: "/suites-rooms",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function SuitesRoomsPage() {
  const locale = await getLocale();
  const t = await getTranslations("suitesRooms");

  const heroSlides = [
    {
      id: "rooms-hero-suite",
      label: t("hero.suite"),
      src: "/images/overview-rooms/suite.webp",
      position: "50% 50%",
      mobilePosition: "50% 50%",
    },
    {
      id: "rooms-hero-junior",
      label: t("hero.junior"),
      src: "/images/overview-hero/junior-suite.webp",
      position: "48% 52%",
      mobilePosition: "28% 52%",
    },
  ] as const;

  return (
    <main className="content-page">
      <JsonLd
        data={pageJsonLd({
          locale,
          path: "/suites-rooms",
          name: t("metaTitle"),
          description: t("metaDescription"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: t("metaTitle"), path: "/suites-rooms" },
          ],
        })}
      />
      <PageHeroCarousel title={t("metaTitle")} slides={heroSlides} />
      <section className="rooms-page-intro" aria-labelledby="rooms-page-intro-title">
        <p className="rooms-page-intro__count" aria-hidden="true">
          114
        </p>
        <h2 id="rooms-page-intro-title" className="rooms-page-intro__title">
          {t("intro.title")}
        </h2>
        <p className="rooms-page-intro__body">{t("intro.body")}</p>
      </section>
      <RoomsCollection />
    </main>
  );
}
