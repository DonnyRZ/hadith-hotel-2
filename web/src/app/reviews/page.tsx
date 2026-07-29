import type { Metadata } from "next";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";
import { ReviewsTestimonies } from "@/components/ReviewsTestimonies";

export const metadata: Metadata = {
  title: "Reviews & Testimonies",
};

const heroSlides = [
  "Reviews & Testimonies hero image 1",
  "Reviews & Testimonies hero image 2",
] as const;

export default function ReviewsPage() {
  return (
    <main className="content-page">
      <PageHeroCarousel title="Reviews & Testimonies" slides={heroSlides} />
      <ReviewsTestimonies />
    </main>
  );
}
