import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeroCarousel } from "@/components/PageHeroCarousel";

const pages = {
  "salon-spa": "Salon & Spa",
  experience: "Experience",
  "meetings-weddings": "Meetings & Weddings",
  reviews: "Reviews & Testimonies",
  gallery: "Gallery",
} as const;

type PageSlug = keyof typeof pages;

const heroPages = {
  "salon-spa": ["Salon & Spa hero image 1", "Salon & Spa hero image 2"],
  experience: ["Experience hero image 1", "Experience hero image 2"],
  "meetings-weddings": [
    "Meetings & Weddings hero image 1",
    "Meetings & Weddings hero image 2",
  ],
} as const;

type HeroPageSlug = keyof typeof heroPages;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = pages[slug as PageSlug];

  return title ? { title } : {};
}

export default async function PlaceholderPage({ params }: PageProps) {
  const { slug } = await params;
  const title = pages[slug as PageSlug];

  if (!title) notFound();

  if (slug in heroPages) {
    return (
      <main className="content-page">
        <PageHeroCarousel
          title={title}
          slides={heroPages[slug as HeroPageSlug]}
        />
      </main>
    );
  }

  return (
    <main className="placeholder-page">
      <section className="placeholder-page__hero">
        <p className="placeholder-page__eyebrow">HADITH Hotel</p>
        <h1 className="placeholder-page__title">{title}</h1>
        <p className="placeholder-page__body">
          This page is being prepared and will be available soon.
        </p>
      </section>
    </main>
  );
}
