export type NewsStoryId =
  | "soft-opening"
  | "indonesian-touch"
  | "chess-olympiad"
  | "chess-journey";

export type NewsStory = {
  id: NewsStoryId;
  href:
    | "/stories/soft-opening"
    | "/stories/indonesian-touch"
    | "/stories/chess-olympiad"
    | "/stories/chess-journey";
  image: string;
  width: number;
  height: number;
  uncropped: boolean;
  dateISO?: string;
  namespace:
    | "stories.softOpening"
    | "stories.indonesianTouch"
    | "stories.chessOlympiad"
    | "reviews.chessStory";
};

export const NEWS_STORIES: readonly NewsStory[] = [
  {
    id: "chess-olympiad",
    href: "/stories/chess-olympiad",
    image: "/images/news/turkish-chess-teams-hd.png",
    width: 2564,
    height: 2564,
    uncropped: true,
    dateISO: "2026-09-27",
    namespace: "stories.chessOlympiad",
  },
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
