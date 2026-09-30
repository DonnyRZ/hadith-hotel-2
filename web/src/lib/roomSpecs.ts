import type { useTranslations } from "next-intl";
import type { RoomType } from "@/lib/rooms";

export type SpecGroup = {
  title: string;
  items: string[];
};

type Translator = ReturnType<typeof useTranslations>;

export function getRoomName(t: Translator, id: string): string {
  return t(`rooms.${id}`);
}

export function getRoomSpecs(t: Translator, room: RoomType): SpecGroup[] | null {
  if (!room.hasSpecs) return null;

  const roomFeatures = t.raw(
    room.specProfile === "suite" ? "specs.suiteRoomFeatures" : "specs.baseRoomFeatures",
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

  if (room.additionalFeatures.length > 0) {
    groups.push({
      title: t("specs.groupTitles.additionalFeatures"),
      items: room.additionalFeatures.flatMap(
        (feature) => t.raw(`specs.additional.${feature}`) as string[],
      ),
    });
  }

  return groups;
}
