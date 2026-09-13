import { getTranslations } from "next-intl/server";
import SiteImage from "@/components/SiteImage";
import { StoryArticleNav } from "@/components/StoryArticleNav";
import { StoryRelated } from "@/components/StoryRelated";

const IMAGE = "/images/news/soft-opening-samarkand.webp";

export async function SoftOpeningArticle() {
  const t = await getTranslations("stories.softOpening");

  return (
    <article className="story-article">
      <StoryArticleNav kicker={t("kicker")} date={t("date")} />

      <header className="story-article__header">
        <h1 className="story-article__title">{t("title")}</h1>
      </header>

      <section className="story-article__lede">
        <p className="story-article__lede-text">{t("body")}</p>
      </section>

      <figure className="story-article__figure">
        <div className="story-article__frame story-article__frame--uncropped">
          <SiteImage
            className="story-article__photo"
            src={IMAGE}
            alt={t("imageAlt")}
            width={1024}
            height={576}
            sizes="(max-width: 900px) 100vw, 1120px"
            priority
          />
        </div>
        <figcaption className="story-article__caption">{t("imageAlt")}</figcaption>
      </figure>

      <section className="story-article__section" aria-labelledby="soft-opening-article-heading">
        <h2 id="soft-opening-article-heading" className="story-article__heading">
          {t("article.heading")}
        </h2>
        <p>{t("article.p1")}</p>
        <p>{t("article.p2")}</p>
        <p>{t("article.p3")}</p>
      </section>

      <StoryRelated currentId="soft-opening" />
    </article>
  );
}
