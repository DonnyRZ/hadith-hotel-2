export type NewsStoryId =
  | "soft-opening"
  | "indonesian-touch"
  | "chess-journey";

export type NewsStory = {
  id: NewsStoryId;
  href: "/stories/soft-opening" | "/stories/indonesian-touch" | "/stories/chess-journey";
  image: string;
  width: number;
  height: number;
  uncropped: boolean;
  namespace: "stories.softOpening" | "stories.indonesianTouch" | "reviews.chessStory";
};

export const NEWS_STORIES: readonly NewsStory[] = [
  {
    id: "soft-opening",
    href: "/stories/soft-opening",
    image: "/images/news/soft-opening-samarkand.webp",
    width: 1024,
    height: 576,
    uncropped: true,
    namespace: "stories.softOpening",
  },
  {
    id: "indonesian-touch",
    href: "/stories/indonesian-touch",
    image: "/images/news/indonesian-touch-samarkand.webp",
    width: 1024,
    height: 576,
    uncropped: true,
    namespace: "stories.indonesianTouch",
  },
  {
    id: "chess-journey",
    href: "/stories/chess-journey",
    image: "/images/reviews/chess-journey-samarkand.png",
    width: 1600,
    height: 900,
    uncropped: false,
    namespace: "reviews.chessStory",
  },
];
