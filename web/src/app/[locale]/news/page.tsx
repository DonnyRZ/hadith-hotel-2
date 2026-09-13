import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { BeSearchForm } from "@/components/be-forms/BeSearchForm";
import { JsonLd } from "@/components/JsonLd";
import { NewsIndex } from "@/components/NewsIndex";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("news");
  return pageMetadata({
    locale,
    path: "/news",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function NewsPage() {
  const locale = await getLocale();
  const t = await getTranslations("news");

  return (
    <main className="news-page">
      <JsonLd
        data={pageJsonLd({
          locale,
          path: "/news",
          name: t("metaTitle"),
          description: t("metaDescription"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: t("metaTitle"), path: "/news" },
          ],
        })}
      />
      <BeSearchForm beLocale={locale} />
      <NewsIndex />
    </main>
  );
}
