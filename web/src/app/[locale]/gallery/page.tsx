import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Gallery } from "@/components/Gallery";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("gallery");
  return { title: t("metaTitle") };
}

export default function GalleryPage() {
  return <Gallery />;
}
