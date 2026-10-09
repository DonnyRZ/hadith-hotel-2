import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CafeDiningVenues } from "@/components/CafeDiningVenues";
import { JsonLd } from "@/components/JsonLd";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";
import { FACILITY_IMAGES } from "@/lib/facilityImages";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("cafeDining");
  return pageMetadata({
    locale,
    path: "/cafe-dining",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function CafeDiningPage() {
  const locale = await getLocale();
  const t = await getTranslations("cafeDining");

  const heroSlides = [
    {
      id: "dining-hero-restaurant",
      label: t("hero.restaurant"),
      src: FACILITY_IMAGES.restaurant,
      position: "50% 50%",
      mobilePosition: "50% 50%",
    },
    {
      id: "dining-hero-cafe-exterior",
      label: t("hero.cafe"),
      src: FACILITY_IMAGES.cafeExterior,
      position: "50% 50%",
      mobilePosition: "50% 50%",
    },
    {
      id: "dining-hero-cafe",
      label: t("hero.cafe"),
      src: FACILITY_IMAGES.cafe,
      position: "50% 50%",
      mobilePosition: "50% 50%",
    },
    {
      id: "dining-hero-lounge",
      label: t("hero.lounge"),
      src: FACILITY_IMAGES.lounge,
      position: "50% 75%",
      mobilePosition: "35% 60%",
    },
  ] as const;

  return (
    <main className="content-page">
      <JsonLd
        data={pageJsonLd({
          locale,
          path: "/cafe-dining",
          name: t("metaTitle"),
          description: t("metaDescription"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: t("metaTitle"), path: "/cafe-dining" },
          ],
        })}
      />
      <PageHeroCarousel title={t("metaTitle")} slides={heroSlides} />
      <CafeDiningVenues />
    </main>
  );
}
