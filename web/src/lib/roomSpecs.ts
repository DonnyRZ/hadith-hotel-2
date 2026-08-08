import type { useTranslations } from "next-intl";
import type { RoomType } from "@/lib/rooms";

export type SpecGroup = {
  title: string;
  items: string[];
};

type Translator = ReturnType<typeof useTranslations>;

const SUITE_LIKE = new Set(["junior", "suite"]);
const ADDITIONAL_KEYS: Record<string, string> = {
  junior: "junior",
  suite: "suite",
  balcony: "balcony",
};

export function getRoomName(t: Translator, id: string): string {
  return t(`rooms.${id}`);
}

export function getRoomSpecs(t: Translator, room: RoomType): SpecGroup[] | null {
  if (!room.hasSpecs) return null;

  const roomFeatures = t.raw(
    SUITE_LIKE.has(room.id) ? "specs.suiteRoomFeatures" : "specs.baseRoomFeatures",
  ) as string[];

  const groups: SpecGroup[] = [
    {
      title: t("specs.groupTitles.roomOverview"),
      items: [
        t("specs.overview.maxOccupancy"),
        room.size ?? undefined,
        t("specs.overview.nonSmoking"),
        t("specs.overview.wirelessInternet"),
      ].filter((item): item is string => Boolean(item)),
    },
    {
      title: t("specs.groupTitles.bedsAndBedding"),
      items: t.raw("specs.bedding") as string[],
    },
    { title: t("specs.groupTitles.roomFeatures"), items: roomFeatures },
    {
      title: t("specs.groupTitles.bathroom"),
      items: t.raw("specs.bathroom") as string[],
    },
    {
      title: t("specs.groupTitles.foodBeverages"),
      items: t.raw("specs.foodBeverages") as string[],
    },
  ];

  const additionalKey = ADDITIONAL_KEYS[room.id];
  if (additionalKey) {
    groups.push({
      title: t("specs.groupTitles.additionalFeatures"),
      items: t.raw(`specs.additional.${additionalKey}`) as string[],
    });
  }

  return groups;
}
