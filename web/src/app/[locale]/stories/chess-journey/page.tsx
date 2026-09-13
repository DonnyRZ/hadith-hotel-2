import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ChessJourneyArticle } from "@/components/ChessJourneyArticle";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("reviews.chessStory");
  return pageMetadata({
    locale,
    path: "/stories/chess-journey",
    title: t("title"),
    description: t("body"),
  });
}

export default async function ChessJourneyPage() {
  const locale = await getLocale();
  const t = await getTranslations("reviews.chessStory");
  const tNews = await getTranslations("news");

  return (
    <main className="content-page">
      <JsonLd
        data={pageJsonLd({
          locale,
          path: "/stories/chess-journey",
          name: t("title"),
          description: t("body"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: tNews("metaTitle"), path: "/news" },
            { name: t("title"), path: "/stories/chess-journey" },
          ],
        })}
      />
      <ChessJourneyArticle />
    </main>
  );
}
