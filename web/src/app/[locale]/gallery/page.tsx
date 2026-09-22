import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Gallery } from "@/components/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("gallery");
  return pageMetadata({
    locale,
    path: "/gallery",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function GalleryPage() {
  const locale = await getLocale();
  const t = await getTranslations("gallery");

  return (
    <>
      <JsonLd
        data={pageJsonLd({
          locale,
          path: "/gallery",
          name: t("metaTitle"),
          description: t("metaDescription"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: t("metaTitle"), path: "/gallery" },
          ],
        })}
      />
      <Gallery />
    </>
  );
}
