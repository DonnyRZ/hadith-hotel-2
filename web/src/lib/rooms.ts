export const HOTEL_ROOM_COUNT = 114;

export type RoomType = {
  id: string;
  size: string | null;
  images: readonly string[];
  hasSpecs: boolean;
  beRoomType: string | null;
  specProfile: "base" | "suite";
  additionalFeatures: ("junior" | "suite" | "balcony")[];
};

// Page-specific room galleries are wired into the Suites & Rooms All Rooms collection.
// Keep this shared data image-free so other site sections retain their placeholders.
export const roomTypes: RoomType[] = [
  {
    id: "president-suite",
    size: "138 m²",
    images: [],
    hasSpecs: true,
    beRoomType: "5080594",
    specProfile: "suite",
    additionalFeatures: ["suite"],
  },
  {
    id: "junior-suite",
    size: "107 m²",
    images: [],
    hasSpecs: true,
    beRoomType: "5080595",
    specProfile: "suite",
    additionalFeatures: ["suite", "balcony"],
  },
  {
    id: "suite",
    size: "68 m²",
    images: [],
    hasSpecs: true,
    beRoomType: null,
    specProfile: "suite",
    additionalFeatures: ["suite"],
  },
  {
    id: "deluxe-double",
    size: "35 m²",
    images: [],
    hasSpecs: true,
    beRoomType: "5080591",
    specProfile: "base",
    additionalFeatures: [],
  },
  {
    id: "deluxe-double-balcony",
    size: "53 m²",
    images: [],
    hasSpecs: true,
    beRoomType: "5080591",
    specProfile: "base",
    additionalFeatures: ["balcony"],
  },
  {
    id: "deluxe-king",
    size: "35 m²",
    images: [],
    hasSpecs: true,
    beRoomType: "5080591",
    specProfile: "base",
    additionalFeatures: [],
  },
  {
    id: "deluxe-king-balcony",
    size: "53 m²",
    images: [],
    hasSpecs: true,
    beRoomType: "5080591",
    specProfile: "base",
    additionalFeatures: ["balcony"],
  },
];
