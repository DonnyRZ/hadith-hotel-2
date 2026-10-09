"use client";

import SiteImage from "@/components/SiteImage";
import { FACILITY_IMAGES } from "@/lib/facilityImages";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PRESIDENT_SUITE_IMAGES } from "@/lib/roomGallery";
import { RoomImagePlaceholder } from "@/components/RoomImagePlaceholder";

type GalleryImageConfig = {
  id: string;
  src: string | null;
  key?: string;
  roomTypeId?: string;
};

type GalleryImage = { id: string; src: string | null; alt: string };

const galleryImageConfigs: GalleryImageConfig[] = [
  { id: "hotel-exterior", key: "hotelExterior", src: "/images/overview-hero/hotel-exterior.webp" },
  ...PRESIDENT_SUITE_IMAGES.map((src, index) => ({
    id: `president-suite-${index + 1}`,
    src,
    roomTypeId: "president-suite",
  })),
  { id: "restaurant", key: "restaurant", src: FACILITY_IMAGES.restaurant },
  { id: "cafe", key: "cafe", src: FACILITY_IMAGES.cafe },
  { id: "cafe-counter", key: "cafeCounter", src: FACILITY_IMAGES.cafeCounter },
  { id: "lounge", key: "lounge", src: FACILITY_IMAGES.lounge },
  { id: "events-hall", key: "eventsHall", src: FACILITY_IMAGES.hall },
  { id: "outdoor-wedding", key: "outdoorWedding", src: FACILITY_IMAGES.wedding },
  { id: "indoor-pool", key: "indoorPool", src: FACILITY_IMAGES.pool },
  { id: "turkish-hammam", key: "turkishHammam", src: FACILITY_IMAGES.hammam },
  { id: "massage-suite", key: "massageSuite", src: FACILITY_IMAGES.massage },
  { id: "sauna", key: "sauna", src: FACILITY_IMAGES.sauna },
  { id: "sauna-2", key: "sauna", src: FACILITY_IMAGES.sauna2 },
  { id: "fitness-centre", key: "fitnessCentre", src: "/images/experience/gym.webp" },
  { id: "tennis-court", key: "tennisCourt", src: "/images/experience/tennis.webp" },
  { id: "padel-court", key: "padelCourt", src: "/images/experience/padel.webp" },
  { id: "playground", key: "playground", src: "/images/experience/playground.webp" },
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
    if (!image.src) return;
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
  }, [image.src, onClose]);

  if (!image.src) return null;

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
  const roomT = useTranslations("suitesRooms.rooms");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const galleryImages: GalleryImage[] = galleryImageConfigs.map((config) => ({
    id: config.id,
    src: config.src,
    alt: config.roomTypeId
      ? roomT(config.roomTypeId)
      : t(`images.${config.key ?? ""}`),
  }));

  return (
    <main className="gallery-page">
      <header className="gallery-page__intro">
        <p className="gallery-page__eyebrow">{t("eyebrow")}</p>
        <h1 className="gallery-page__title">{t("title")}</h1>
        <p className="gallery-page__body">{t("body")}</p>
      </header>

      <section className="gallery-grid" aria-label={t("gridAriaLabel")}>
        {galleryImages.map((image, index) => image.src ? (
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
        ) : (
          <div key={image.id} className="gallery-grid__item" aria-hidden="true">
            <RoomImagePlaceholder />
          </div>
        ))}
      </section>

      {selectedImage ? (
        <GalleryLightbox image={selectedImage} onClose={() => setSelectedImage(null)} t={t} />
      ) : null}
    </main>
  );
}
