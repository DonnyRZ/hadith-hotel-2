import type { RoomType } from "@/lib/rooms";

export const PRESIDENT_SUITE_IMAGES = [
  "/images/rooms/president-suite-1.webp",
  "/images/rooms/president-suite-2.webp",
  "/images/rooms/president-suite-3.webp",
] as const;

export const ALL_ROOMS_GALLERY_IMAGES: Partial<
  Record<RoomType["id"], readonly string[]>
> = {
  "president-suite": PRESIDENT_SUITE_IMAGES,
  "junior-suite": [
    "/images/rooms/junior-suite-1.webp",
    "/images/rooms/junior-suite-2.webp",
  ],
  suite: ["/images/rooms/suite-1.webp", "/images/rooms/suite-2.webp"],
  "deluxe-double": [
    "/images/rooms/deluxe-double-1.webp",
    "/images/rooms/deluxe-double-2.webp",
  ],
  "deluxe-double-balcony": [
    "/images/rooms/deluxe-double-balcony-1.webp",
    "/images/rooms/deluxe-double-balcony-2.webp",
    "/images/rooms/deluxe-balcony-panorama.webp",
  ],
  "deluxe-king": [
    "/images/rooms/deluxe-king-1.webp",
    "/images/rooms/deluxe-king-2.webp",
  ],
  "deluxe-king-balcony": [
    "/images/rooms/deluxe-king-balcony-1.webp",
    "/images/rooms/deluxe-king-balcony-2.webp",
    "/images/rooms/deluxe-balcony-panorama.webp",
  ],
};
