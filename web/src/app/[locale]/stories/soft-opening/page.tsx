import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { SoftOpeningArticle } from "@/components/SoftOpeningArticle";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

const PATH = "/stories/soft-opening";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("stories.softOpening");
  return pageMetadata({
    locale,
    path: PATH,
    title: t("title"),
    description: t("body"),
  });
}

export default async function SoftOpeningPage() {
  const locale = await getLocale();
  const t = await getTranslations("stories.softOpening");

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
            { name: t("title"), path: PATH },
          ],
        })}
      />
      <SoftOpeningArticle />
    </main>
  );
}
