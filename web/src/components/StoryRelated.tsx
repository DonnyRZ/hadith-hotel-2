import { getTranslations } from "next-intl/server";
import SiteImage from "@/components/SiteImage";
import { Link } from "@/i18n/navigation";
import { NEWS_STORIES, type NewsStoryId } from "@/lib/news";

export async function StoryRelated({ currentId }: { currentId: NewsStoryId }) {
  const tNews = await getTranslations("news");
  const others = await Promise.all(
    NEWS_STORIES.filter((story) => story.id !== currentId).map(async (story) => {
      const t = await getTranslations(story.namespace);
      return {
        ...story,
        title: t("title"),
        kicker: t("kicker"),
        imageAlt: t("imageAlt"),
      };
    }),
  );

  return (
    <aside className="story-related" aria-labelledby="story-related-heading">
      <div className="news-masthead__ornament story-related__ornament" aria-hidden="true">
        <span className="news-masthead__rule" />
        <span className="news-masthead__diamond" />
        <span className="news-masthead__rule" />
      </div>
      <h2 id="story-related-heading" className="story-related__heading">
        {tNews("related")}
      </h2>
      <div className="story-related__grid">
        {others.map((story) => (
          <Link key={story.id} href={story.href} className="story-related__card">
            <span
              className={`story-related__media${story.uncropped ? " story-related__media--uncropped" : ""}`}
            >
              {story.uncropped ? (
                <SiteImage
                  className="story-related__photo"
                  src={story.image}
                  alt={story.imageAlt}
                  width={story.width}
                  height={story.height}
                  sizes="(max-width: 720px) 100vw, 360px"
                />
              ) : (
                <SiteImage
                  className="story-related__image"
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(max-width: 720px) 100vw, 360px"
                />
              )}
            </span>
            <span className="news-meta">{story.kicker}</span>
            <span className="story-related__title">{story.title}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
