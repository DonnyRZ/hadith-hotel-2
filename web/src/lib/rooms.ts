export type RoomType = {
  id: string;
  units: number;
  /** Null while the room specification is still being confirmed */
  size: string | null;
  hasSpecs: boolean;
};

export const presidentSuite: RoomType = {
  id: "president",
  units: 2,
  size: null,
  hasSpecs: false,
};

export const roomTypes: RoomType[] = [
  { id: "junior", units: 9, size: "71 sqm", hasSpecs: true },
  { id: "suite", units: 18, size: "68.25 sqm", hasSpecs: true },
  { id: "balcony", units: 23, size: "53 sqm", hasSpecs: true },
  { id: "standard", units: 62, size: "35 sqm", hasSpecs: true },
];
