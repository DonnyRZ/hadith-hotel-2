import type { Metadata } from "next";
import { notFound } from "next/navigation";

const pages = {
  gallery: "Gallery",
} as const;

type PageSlug = keyof typeof pages;

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
