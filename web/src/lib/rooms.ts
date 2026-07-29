export type SpecGroup = {
  title: string;
  items: string[];
};

export type RoomType = {
  id: string;
  name: string;
  units: number;
  /** Null while the room specification is still being confirmed */
  size: string | null;
  specs: SpecGroup[] | null;
};

const bedding = [
  "Two 100 cm single beds, convertible into one bed",
  "Maximum occupancy: 2",
];

const bathroom = [
  "Shower",
  "Bidet",
  "Lighted makeup mirror",
  "Hair dryer",
  "Robe",
  "Slippers",
];

const foodAndBeverages = ["Electric kettle", "Refrigerator"];

const baseRoomFeatures = [
  "Air-conditioned",
  "Safe deposit box",
  "Wardrobe",
  "Hangers",
  "Desk and chair",
  "Television",
  "Telephone",
];

function overview(size: string, extra: string[] = []) {
  return [
    "Maximum occupancy: 2",
    size,
    "This room is non-smoking",
    "Wireless internet",
    ...extra,
  ];
}

function specs({
  size,
  roomFeatures = baseRoomFeatures,
  additional,
}: {
  size: string;
  roomFeatures?: string[];
  additional?: string[];
}): SpecGroup[] {
  const groups: SpecGroup[] = [
    { title: "Room Overview", items: overview(size) },
    { title: "Beds and Bedding", items: bedding },
    { title: "Room Features", items: roomFeatures },
    { title: "Bath and Bathroom Features", items: bathroom },
    { title: "Food & Beverages", items: foodAndBeverages },
  ];

  if (additional?.length) {
    groups.push({ title: "Additional Features", items: additional });
  }

  return groups;
}

const suiteRoomFeatures = [
  ...baseRoomFeatures.slice(0, -2),
  "TV cabinet with drawers",
  "Television",
  "Telephone",
];

export const presidentSuite: RoomType = {
  id: "president",
  name: "President Suite",
  units: 2,
  size: null,
  specs: null,
};

export const roomTypes: RoomType[] = [
  {
    id: "junior",
    name: "Junior Suite",
    units: 9,
    size: "71 sqm",
    specs: specs({
      size: "71 sqm",
      roomFeatures: suiteRoomFeatures,
      additional: ["Dining table and chairs", "Sofa and coffee table"],
    }),
  },
  {
    id: "suite",
    name: "Suite",
    units: 18,
    size: "68.25 sqm",
    specs: specs({
      size: "68.25 sqm",
      roomFeatures: suiteRoomFeatures,
      additional: ["Dining table and chairs", "Lounge chair and coffee table"],
    }),
  },
  {
    id: "balcony",
    name: "Balcony Room",
    units: 23,
    size: "53 sqm",
    specs: specs({
      size: "53 sqm",
      additional: ["Private balcony"],
    }),
  },
  {
    id: "standard",
    name: "Standard Room",
    units: 62,
    size: "35 sqm",
    specs: specs({ size: "35 sqm" }),
  },
];
