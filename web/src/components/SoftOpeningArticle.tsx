import { getTranslations } from "next-intl/server";
import SiteImage from "@/components/SiteImage";

const IMAGE = "/images/news/soft-opening-samarkand.webp";

export async function SoftOpeningArticle() {
  const t = await getTranslations("stories.softOpening");

  return (
    <article className="story-article">
      <header className="story-article__header">
        <h1 className="story-article__title">{t("title")}</h1>
      </header>

      <section className="story-article__lede">
        <p className="story-article__lede-text">{t("body")}</p>
      </section>

      <figure className="story-article__figure">
        <div className="story-article__frame">
          <SiteImage
            className="story-article__image story-article__image--soft-opening"
            src={IMAGE}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 900px) 100vw, 1120px"
            priority
          />
        </div>
      </figure>

      <section className="story-article__section" aria-labelledby="soft-opening-article-heading">
        <h2 id="soft-opening-article-heading" className="story-article__heading">
          {t("article.heading")}
        </h2>
        <p>{t("article.p1")}</p>
        <p>{t("article.p2")}</p>
        <p>{t("article.p3")}</p>
      </section>
    </article>
  );
}
