export type RoomType = {
  id: string;
  units: number;
  /** Null while the room specification is still being confirmed */
  size: string | null;
  hasSpecs: boolean;
  beRoomType: string;
};

export const presidentSuite: RoomType = {
  id: "president",
  units: 2,
  size: null,
  hasSpecs: false,
  beRoomType: "5080596"
};

export const roomTypes: RoomType[] = [
  { id: "junior", units: 9, size: "71 sqm", hasSpecs: true, beRoomType: "5080594" },
  { id: "suite", units: 18, size: "68.25 sqm", hasSpecs: true, beRoomType: "5080595" },
  { id: "balcony", units: 23, size: "53 sqm", hasSpecs: true, beRoomType: "5080593" },
  { id: "standard", units: 62, size: "35 sqm", hasSpecs: true, beRoomType: "5080591" },
];
