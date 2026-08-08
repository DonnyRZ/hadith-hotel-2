"use client";

import SiteImage from "@/components/SiteImage";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type GalleryImageConfig = {
  id: string;
  key: string;
  src: string;
};

type GalleryImage = { id: string; src: string; alt: string };

const galleryImageConfigs: GalleryImageConfig[] = [
  { id: "hotel-exterior", key: "hotelExterior", src: "/images/overview-hero/hotel-exterior.webp" },
  { id: "junior-suite", key: "juniorSuite", src: "/images/overview-rooms/junior-1.png" },
  { id: "restaurant", key: "restaurant", src: "/images/overview-hero/resto.webp" },
  { id: "buffet", key: "buffet", src: "/images/cafe-dining/buffet.webp" },
  { id: "cafe", key: "cafe", src: "/images/cafe-dining/cafe-1.webp" },
  { id: "events-hall", key: "eventsHall", src: "/images/meetings-weddings/hall.webp" },
  { id: "indoor-pool", key: "indoorPool", src: "/images/experience/pool.webp" },
  { id: "turkish-hammam", key: "turkishHammam", src: "/images/experience/hamam.webp" },
  { id: "massage-suite", key: "massageSuite", src: "/images/experience/massage.webp" },
  { id: "sauna", key: "sauna", src: "/images/experience/sauna.webp" },
  { id: "fitness-centre", key: "fitnessCentre", src: "/images/experience/gym.webp" },
  { id: "tennis-court", key: "tennisCourt", src: "/images/experience/tennis.webp" },
  { id: "padel-court", key: "padelCourt", src: "/images/experience/padel.webp" },
  { id: "playground", key: "playground", src: "/images/experience/playground.webp" },
  { id: "cafe-bar", key: "cafeBar", src: "/images/cafe-dining/cafe-2.webp" },
];

function GalleryLightbox({
  image,
  onClose,
  t,
}: {
  image: GalleryImage;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={t("lightbox.ariaLabel")}
    >
      <button
        type="button"
        className="gallery-lightbox__backdrop"
        aria-label={t("lightbox.closeAria")}
        onClick={onClose}
      />
      <div className="gallery-lightbox__content">
        <button
          type="button"
          className="gallery-lightbox__close"
          aria-label={t("lightbox.closeAria")}
          onClick={onClose}
        >
          ×
        </button>
        <div className="gallery-lightbox__media">
          <SiteImage src={image.src} alt={image.alt} fill sizes="100vw" priority />
        </div>
        <p className="gallery-lightbox__caption">{image.alt}</p>
      </div>
    </div>
  );
}

export function Gallery() {
  const t = useTranslations("gallery");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const galleryImages: GalleryImage[] = galleryImageConfigs.map((config) => ({
    id: config.id,
    src: config.src,
    alt: t(`images.${config.key}`),
  }));

  return (
    <main className="gallery-page">
      <header className="gallery-page__intro">
        <p className="gallery-page__eyebrow">{t("eyebrow")}</p>
        <h1 className="gallery-page__title">{t("title")}</h1>
        <p className="gallery-page__body">{t("body")}</p>
      </header>

      <section className="gallery-grid" aria-label={t("gridAriaLabel")}>
        {galleryImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className="gallery-grid__item"
            onClick={() => setSelectedImage(image)}
            aria-label={t("viewAria", { alt: image.alt })}
          >
            <SiteImage
              className="gallery-grid__image"
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 560px) 50vw, (max-width: 1000px) 33vw, 25vw"
              priority={index < 4}
            />
          </button>
        ))}
      </section>

      {selectedImage ? (
        <GalleryLightbox image={selectedImage} onClose={() => setSelectedImage(null)} t={t} />
      ) : null}
    </main>
  );
}
