export const HOTEL_ROOM_COUNT = 114;

export type RoomType = {
  id: string;
  /** Null while the room specification is still being confirmed */
  size: string | null;
  images: readonly string[];
  hasSpecs: boolean;
  beRoomType: string;
  specProfile: "base" | "suite";
  additionalFeatures: ("junior" | "suite" | "balcony")[];
};

export const FEATURED_ROOM_IMAGE =
  "/images/rooms/president-suite-balcony/01.jpg";

// Legacy imagery stays in use throughout the site outside the All Rooms cards
// and their detail modal. Keep this separate from roomTypes[].images, which
// intentionally points to the newly supplied room photography.
export const LEGACY_ROOM_COVERS: Record<RoomType["id"], string> = {
  "deluxe-double": "/images/overview-rooms/standard.webp",
  "deluxe-double-balcony": "/images/overview-rooms/balcony.webp",
  "deluxe-king": "/images/rooms/standard/standard-main.jpeg",
  "deluxe-king-balcony": "/images/overview-rooms/balcony.webp",
  "junior-suite": "/images/overview-rooms/junior-1.png",
  "president-suite-balcony": "/images/overview-hero/suite.webp",
};

export const roomTypes: RoomType[] = [
  {
    id: "deluxe-double",
    size: "35 sqm",
    images: [
      "/images/rooms/deluxe-double/01.jpg",
      "/images/rooms/deluxe-double/02.jpg",
    ],
    hasSpecs: true,
    beRoomType: "5080591",
    specProfile: "base",
    additionalFeatures: [],
  },
  {
    id: "deluxe-double-balcony",
    size: "35 sqm",
    images: [
      "/images/rooms/deluxe-double-balcony/01.jpg",
      "/images/rooms/deluxe-double-balcony/02.jpg",
    ],
    hasSpecs: true,
    beRoomType: "5080591",
    specProfile: "base",
    additionalFeatures: ["balcony"],
  },
  {
    id: "deluxe-king",
    size: "35 sqm",
    images: [
      "/images/rooms/deluxe-king/01.jpg",
      "/images/rooms/deluxe-king/02.jpg",
    ],
    hasSpecs: true,
    beRoomType: "5080591",
    specProfile: "base",
    additionalFeatures: [],
  },
  {
    id: "deluxe-king-balcony",
    size: "35 sqm",
    images: [
      "/images/rooms/deluxe-king-balcony/01.jpg",
      "/images/rooms/deluxe-king-balcony/02.jpg",
    ],
    hasSpecs: true,
    beRoomType: "5080591",
    specProfile: "base",
    additionalFeatures: ["balcony"],
  },
  {
    id: "junior-suite",
    size: "68.25 sqm",
    images: [
      "/images/rooms/junior-suite/01.jpg",
      "/images/rooms/junior-suite/02.jpg",
      "/images/rooms/junior-suite/03.jpg",
      "/images/rooms/junior-suite/04.jpg",
    ],
    hasSpecs: true,
    beRoomType: "5080595",
    specProfile: "suite",
    additionalFeatures: ["suite"],
  },
  {
    id: "president-suite-balcony",
    size: "71 sqm",
    images: [
      FEATURED_ROOM_IMAGE,
      "/images/rooms/president-suite-balcony/02.jpg",
      "/images/rooms/president-suite-balcony/03.jpg",
      "/images/rooms/president-suite-balcony/04.jpg",
      "/images/rooms/president-suite-balcony/05.jpg",
    ],
    hasSpecs: true,
    beRoomType: "5080594",
    specProfile: "suite",
    additionalFeatures: ["junior", "balcony"],
  },
];
