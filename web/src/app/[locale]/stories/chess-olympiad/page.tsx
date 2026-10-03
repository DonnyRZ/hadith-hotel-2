import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ChessOlympiadArticle } from "@/components/ChessOlympiadArticle";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

const PATH = "/stories/chess-olympiad";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("stories.chessOlympiad");
  return pageMetadata({
    locale,
    path: PATH,
    title: t("title"),
    description: t("body"),
  });
}

export default async function ChessOlympiadPage() {
  const locale = await getLocale();
  const t = await getTranslations("stories.chessOlympiad");
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
      <ChessOlympiadArticle />
    </main>
  );
}
