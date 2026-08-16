import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChessJourneyArticle } from "@/components/ChessJourneyArticle";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reviews.chessStory");
  return {
    title: t("title"),
    description: t("body"),
  };
}

export default function ChessJourneyPage() {
  return (
    <main className="content-page">
      <ChessJourneyArticle />
    </main>
  );
}
