import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CafeDiningVenues } from "@/components/CafeDiningVenues";
import { JsonLd } from "@/components/JsonLd";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";
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
