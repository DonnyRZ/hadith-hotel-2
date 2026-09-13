import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function StoryArticleNav({
  kicker,
  date,
}: {
  kicker: string;
  date: string;
}) {
  const t = await getTranslations("news");

  return (
    <div className="story-article__nav">
      <Link href="/news" className="story-article__back">
        <span className="story-article__back-arrow" aria-hidden="true" />
        <span>{t("back")}</span>
      </Link>
      <p className="news-meta">
        <span>{kicker}</span>
        <span aria-hidden="true">·</span>
        <time>{date}</time>
      </p>
    </div>
  );
}
