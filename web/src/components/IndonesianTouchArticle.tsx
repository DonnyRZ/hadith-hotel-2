import { getTranslations } from "next-intl/server";
import SiteImage from "@/components/SiteImage";

const IMAGE = "/images/news/indonesian-touch-samarkand.webp";

export async function IndonesianTouchArticle() {
  const t = await getTranslations("stories.indonesianTouch");

  return (
    <article className="story-article">
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
      </figure>

      <section className="story-article__section" aria-labelledby="indonesian-touch-article-heading">
        <h2 id="indonesian-touch-article-heading" className="story-article__heading">
          {t("article.heading")}
        </h2>
        <p>{t("article.p1")}</p>
        <p>{t("article.p2")}</p>
        <p>{t("article.p3")}</p>
      </section>
    </article>
  );
}
