import type { Metadata } from "next";
import { FACILITY_IMAGES } from "@/lib/facilityImages";
import { getLocale, getTranslations } from "next-intl/server";
import { ExperienceGroups } from "@/components/ExperienceGroups";
import { JsonLd } from "@/components/JsonLd";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("experience");
  return pageMetadata({
    locale,
    path: "/experience",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ExperiencePage() {
  const locale = await getLocale();
  const t = await getTranslations("experience");

  const heroSlides = [
    {
      id: "experience-hero-hamam",
      label: t("hero.hamam"),
      src: FACILITY_IMAGES.hammam,
      position: "50% 50%",
      mobilePosition: "54% 50%",
    },
    {
      id: "experience-hero-pool",
      label: t("hero.pool"),
      src: FACILITY_IMAGES.pool,
      position: "50% 50%",
      mobilePosition: "35% 50%",
    },
  ] as const;

  return (
    <main className="content-page">
      <JsonLd
        data={pageJsonLd({
          locale,
          path: "/experience",
          name: t("metaTitle"),
          description: t("metaDescription"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: t("metaTitle"), path: "/experience" },
          ],
        })}
      />
      <PageHeroCarousel title={t("metaTitle")} slides={heroSlides} />
      <ExperienceGroups />
    </main>
  );
}
