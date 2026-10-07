import { getTranslations } from "next-intl/server";
import SiteImage from "@/components/SiteImage";
import { StoryArticleNav } from "@/components/StoryArticleNav";
import { StoryRelated } from "@/components/StoryRelated";

const PHOTOS = [
  "/images/news/swan-x-2026-cover.webp",
  "/images/news/swan-x-2026-2.webp",
  "/images/news/swan-x-2026-3.webp",
] as const;

export async function SwanX2026Article() {
  const t = await getTranslations("stories.swanX2026");

  return (
    <article className="story-article">
      <StoryArticleNav kicker={t("kicker")} date={t("date")} />

      <header className="story-article__header">
        <h1 className="story-article__title">{t("title")}</h1>
      </header>

      <figure className="story-article__figure">
        <div className="story-article__frame story-article__frame--uncropped">
          <SiteImage
            className="story-article__photo"
            src={PHOTOS[0]}
            alt={t("imageAlt")}
            width={1448}
            height={1086}
            sizes="(max-width: 900px) 100vw, 1120px"
            priority
          />
        </div>
        <figcaption className="story-article__caption">{t("imageAlt")}</figcaption>
      </figure>

      <section className="story-article__section" aria-labelledby="swan-x-2026-article-heading">
        <h2 id="swan-x-2026-article-heading" className="story-article__heading">
          {t("article.heading")}
        </h2>
        <p>{t("article.p1")}</p>
        <p>{t("article.p2")}</p>
        <p>{t("article.p3")}</p>
      </section>

      <div className="swan-x-gallery">
        {[1, 2].map((index) => (
          <figure key={PHOTOS[index]} className="swan-x-gallery__item">
            <SiteImage
              className="story-article__photo"
              src={PHOTOS[index]}
              alt={t(index === 1 ? "imageAltSecond" : "imageAltThird")}
              width={1448}
              height={1086}
              sizes="(max-width: 720px) 100vw, 540px"
            />
            <figcaption className="story-article__caption">
              {t(index === 1 ? "imageAltSecond" : "imageAltThird")}
            </figcaption>
          </figure>
        ))}
      </div>

      <StoryRelated currentId="swan-x-2026" />
    </article>
  );
}
