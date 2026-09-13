import { getTranslations } from "next-intl/server";
import SiteImage from "@/components/SiteImage";
import { Link } from "@/i18n/navigation";
import { NEWS_STORIES } from "@/lib/news";

export async function NewsIndex() {
  const tNews = await getTranslations("news");
  const [featured, ...rest] = NEWS_STORIES;
  const tFeatured = await getTranslations(featured.namespace);
  const supporting = await Promise.all(
    rest.map(async (story) => {
      const t = await getTranslations(story.namespace);
      return {
        ...story,
        title: t("title"),
        body: t("body"),
        cta: t("cta"),
        imageAlt: t("imageAlt"),
        kicker: t("kicker"),
        date: t("date"),
      };
    }),
  );

  return (
    <div className="news-journal">
      <header className="news-masthead">
        <div className="news-masthead__ornament" aria-hidden="true">
          <span className="news-masthead__rule" />
          <span className="news-masthead__diamond" />
          <span className="news-masthead__rule" />
        </div>
        <p className="news-masthead__eyebrow">{tNews("eyebrow")}</p>
        <h1 className="news-masthead__title">{tNews("title")}</h1>
        <p className="news-masthead__lede">{tNews("lede")}</p>
        <div className="news-masthead__ornament" aria-hidden="true">
          <span className="news-masthead__rule" />
          <span className="news-masthead__diamond" />
          <span className="news-masthead__rule" />
        </div>
      </header>

      <article className="news-feature">
        <Link
          href={featured.href}
          className="news-feature__media"
          aria-label={tFeatured("title")}
        >
          <SiteImage
            className="news-feature__photo"
            src={featured.image}
            alt={tFeatured("imageAlt")}
            width={featured.width}
            height={featured.height}
            sizes="(max-width: 900px) 100vw, 1200px"
            priority
          />
        </Link>
        <div className="news-feature__copy">
          <p className="news-meta">
            <span>{tFeatured("kicker")}</span>
            <span aria-hidden="true">·</span>
            <time dateTime="2026-09-05">{tFeatured("date")}</time>
          </p>
          <h2 className="news-feature__title">
            <Link href={featured.href}>{tFeatured("title")}</Link>
          </h2>
          <p className="news-feature__body">{tFeatured("body")}</p>
          <Link className="news-cta" href={featured.href}>
            <span>{tFeatured("cta")}</span>
            <span className="news-cta__arrow" aria-hidden="true" />
          </Link>
        </div>
      </article>

      <div className="news-grid">
        {supporting.map((story) => (
          <article key={story.id} className="news-card">
            <Link
              href={story.href}
              className={`news-card__media${story.uncropped ? " news-card__media--uncropped" : ""}`}
              aria-label={story.title}
            >
              {story.uncropped ? (
                <SiteImage
                  className="news-card__photo"
                  src={story.image}
                  alt={story.imageAlt}
                  width={story.width}
                  height={story.height}
                  sizes="(max-width: 900px) 100vw, 560px"
                />
              ) : (
                <SiteImage
                  className="news-card__image"
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 560px"
                />
              )}
            </Link>
            <div className="news-card__copy">
              <p className="news-meta">
                <span>{story.kicker}</span>
                <span aria-hidden="true">·</span>
                <time>{story.date}</time>
              </p>
              <h2 className="news-card__title">
                <Link href={story.href}>{story.title}</Link>
              </h2>
              <p className="news-card__body">{story.body}</p>
              <Link className="news-cta news-cta--compact" href={story.href}>
                <span>{story.cta}</span>
                <span className="news-cta__arrow" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
