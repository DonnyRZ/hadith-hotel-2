export type HomepageNewsItem = {
  id: string;
  publishedAt: string;
  image: string;
  imagePosition?: string;
};

/** Homepage news features, newest first. Later items stack below. */
export const homepageNews: HomepageNewsItem[] = [
  {
    id: "softOpening",
    publishedAt: "2026-09-05",
    image: "/images/news/soft-opening-samarkand.webp",
    imagePosition: "50% 46%",
  },
];
