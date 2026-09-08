import { getLocale, getTranslations } from "next-intl/server";
import SiteImage from "@/components/SiteImage";
import { JsonLd } from "@/components/JsonLd";
import { homepageNews } from "@/lib/news";
import { SITE_NAME, SITE_URL, absoluteUrl, canonicalUrl } from "@/lib/seo";

export async function HomepageNews() {
  const locale = await getLocale();
  const t = await getTranslations("overview.news");
  const pageUrl = canonicalUrl(locale, "/");

  return (
    <section className="news-slot" id="news" aria-labelledby="homepage-news-heading">
      <div className="news-slot__inner">
        <header className="news-slot__header">
          <h2 id="homepage-news-heading" className="news-slot__eyebrow">
            {t("eyebrow")}
          </h2>
        </header>

        {homepageNews.map((item) => {
          const title = t(`items.${item.id}.title`);
          const paragraphs = [t(`items.${item.id}.p1`), t(`items.${item.id}.p2`), t(`items.${item.id}.p3`)];

          return (
            <article
              key={item.id}
              className="news-slot__article"
              id={`news-${item.id}`}
              aria-labelledby={`news-${item.id}-title`}
            >
              <JsonLd
                data={{
                  "@context": "https://schema.org",
                  "@type": "NewsArticle",
                  headline: title,
                  datePublished: item.publishedAt,
                  image: absoluteUrl(item.image),
                  inLanguage: locale,
                  articleBody: paragraphs.join("\n\n"),
                  mainEntityOfPage: `${pageUrl}#news-${item.id}`,
                  publisher: {
                    "@type": "Organization",
                    name: SITE_NAME,
                    url: SITE_URL,
                  },
                }}
              />

              <figure className="news-slot__figure">
                <div className="news-slot__frame">
                  <SiteImage
                    className="news-slot__image"
                    src={item.image}
                    alt={t(`items.${item.id}.imageAlt`)}
                    fill
                    sizes="(max-width: 900px) 100vw, 1120px"
                    style={{ objectPosition: item.imagePosition ?? "50% 50%" }}
                  />
                </div>
                <figcaption className="news-slot__caption">
                  {t(`items.${item.id}.caption`)}
                </figcaption>
              </figure>

              <div className="news-slot__copy">
                <time className="news-slot__date" dateTime={item.publishedAt}>
                  {t(`items.${item.id}.date`)}
                </time>
                <h3 id={`news-${item.id}-title`} className="news-slot__title">
                  {title}
                </h3>
                <p className="news-slot__lede">{paragraphs[0]}</p>
                <div className="news-slot__body">
                  {paragraphs.slice(1).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
