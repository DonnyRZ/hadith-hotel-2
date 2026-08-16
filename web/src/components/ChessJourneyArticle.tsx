import { getTranslations } from "next-intl/server";
import SiteImage from "@/components/SiteImage";

const IMAGES = [
  {
    src: "/images/stories/chess-journey-1.png",
    altKey: "article.image1Alt",
  },
  {
    src: "/images/stories/chess-journey-2.png",
    altKey: "article.image2Alt",
  },
  {
    src: "/images/stories/chess-journey-3.png",
    altKey: "article.image3Alt",
  },
] as const;

export async function ChessJourneyArticle() {
  const t = await getTranslations("reviews.chessStory");

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
            className="story-article__image"
            src={IMAGES[0].src}
            alt={t(IMAGES[0].altKey)}
            fill
            sizes="(max-width: 900px) 100vw, 1120px"
            priority
          />
        </div>
      </figure>

      <section className="story-article__section" aria-labelledby="story-article-heading">
        <h2 id="story-article-heading" className="story-article__heading">
          {t("article.heading")}
        </h2>
        <p>{t("article.p1")}</p>
        <p>{t("article.p2")}</p>
        <p>{t("article.p3")}</p>
        <p>{t("article.p4")}</p>
      </section>

      <figure className="story-article__figure">
        <div className="story-article__frame">
          <SiteImage
            className="story-article__image"
            src={IMAGES[1].src}
            alt={t(IMAGES[1].altKey)}
            fill
            sizes="(max-width: 900px) 100vw, 1120px"
          />
        </div>
      </figure>

      <figure className="story-article__figure story-article__figure--follow">
        <div className="story-article__frame">
          <SiteImage
            className="story-article__image"
            src={IMAGES[2].src}
            alt={t(IMAGES[2].altKey)}
            fill
            sizes="(max-width: 900px) 100vw, 1120px"
          />
        </div>
      </figure>
    </article>
  );
}
