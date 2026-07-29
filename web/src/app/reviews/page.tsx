import type { Metadata } from "next";
import { ReviewsTestimonies } from "@/components/ReviewsTestimonies";

export const metadata: Metadata = {
  title: "Stories & Highlights",
};

export default function ReviewsPage() {
  return (
    <main className="content-page">
      <ReviewsTestimonies />
    </main>
  );
}
