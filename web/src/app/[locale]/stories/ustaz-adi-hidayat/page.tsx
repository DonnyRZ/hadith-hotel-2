import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { UstazAdiHidayatArticle } from "@/components/UstazAdiHidayatArticle";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

const PATH = "/stories/ustaz-adi-hidayat";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("stories.ustazAdiHidayat");
  return pageMetadata({
    locale,
    path: PATH,
    title: t("title"),
    description: t("body"),
  });
}

export default async function UstazAdiHidayatPage() {
  const locale = await getLocale();
  const t = await getTranslations("stories.ustazAdiHidayat");
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
      <UstazAdiHidayatArticle />
    </main>
  );
}
