import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReviewsTestimonies } from "@/components/ReviewsTestimonies";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reviews");
  return { title: t("metaTitle") };
}

export default function ReviewsPage() {
  return (
    <main className="content-page">
      <ReviewsTestimonies />
    </main>
  );
}
