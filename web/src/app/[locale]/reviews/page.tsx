import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { ReviewsTestimonies } from "@/components/ReviewsTestimonies";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("reviews");
  return pageMetadata({
    locale,
    path: "/reviews",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ReviewsPage() {
  const locale = await getLocale();
  const t = await getTranslations("reviews");

  return (
    <main className="content-page">
      <JsonLd
        data={pageJsonLd({
          locale,
          path: "/reviews",
          name: t("metaTitle"),
          description: t("metaDescription"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: t("metaTitle"), path: "/reviews" },
          ],
        })}
      />
      <ReviewsTestimonies />
    </main>
  );
}
