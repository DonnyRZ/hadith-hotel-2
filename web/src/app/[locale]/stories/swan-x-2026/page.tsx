import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { SwanX2026Article } from "@/components/SwanX2026Article";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

const PATH = "/stories/swan-x-2026";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("stories.swanX2026");
  return pageMetadata({
    locale,
    path: PATH,
    title: t("title"),
    description: t("body"),
  });
}

export default async function SwanX2026Page() {
  const locale = await getLocale();
  const t = await getTranslations("stories.swanX2026");
  const tNews = await getTranslations("news");

  return (
    <main className="content-page">
      <JsonLd
        data={pageJsonLd({
          locale,
          path: PATH,
          name: t("title"),
          description: t("body"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: tNews("metaTitle"), path: "/news" },
            { name: t("title"), path: PATH },
          ],
        })}
      />
      <SwanX2026Article />
    </main>
  );
}
