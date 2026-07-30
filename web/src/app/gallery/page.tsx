"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
};

const galleryImages: GalleryImage[] = [
  {
    id: "hotel-exterior",
    src: "/images/overview-hero/hotel-exterior.webp",
    alt: "HADITH Hotel exterior at sunset",
  },
  {
    id: "junior-suite",
    src: "/images/overview-rooms/junior-1.png",
    alt: "Junior Suite interior at HADITH Hotel",
  },
  {
    id: "restaurant",
    src: "/images/overview-hero/resto.webp",
    alt: "Restaurant dining room at HADITH Hotel",
  },
  {
    id: "buffet",
    src: "/images/cafe-dining/buffet.webp",
    alt: "Buffet dining experience at HADITH Hotel",
  },
  {
    id: "cafe",
    src: "/images/cafe-dining/cafe-1.webp",
    alt: "The Cafe at HADITH Hotel",
  },
  {
    id: "events-hall",
    src: "/images/meetings-weddings/hall.webp",
    alt: "Events hall at HADITH Hotel",
  },
  {
    id: "indoor-pool",
    src: "/images/experience/pool.webp",
    alt: "Indoor pool at HADITH Hotel",
  },
  {
    id: "turkish-hammam",
    src: "/images/experience/hamam.webp",
    alt: "Turkish hammam at HADITH Hotel",
  },
  {
    id: "massage-suite",
    src: "/images/experience/massage.webp",
    alt: "Massage treatment room at HADITH Hotel",
  },
  {
    id: "sauna",
    src: "/images/experience/sauna.webp",
    alt: "Sauna at HADITH Hotel",
  },
  {
    id: "fitness-centre",
    src: "/images/experience/gym.webp",
    alt: "Fitness centre at HADITH Hotel",
  },
  {
    id: "tennis-court",
    src: "/images/experience/tennis.webp",
    alt: "Tennis court at HADITH Hotel",
  },
  {
    id: "padel-court",
    src: "/images/experience/padel.webp",
    alt: "Padel court at HADITH Hotel",
  },
  {
    id: "playground",
    src: "/images/experience/playground.webp",
    alt: "Children's playground at HADITH Hotel",
  },
  {
    id: "cafe-lounge",
    src: "/images/cafe-dining/cafe-3.webp",
    alt: "Cafe lounge with grand piano at HADITH Hotel",
  },
];

function GalleryLightbox({
  image,
  onClose,
}: {
  image: GalleryImage;
  onClose: () => void;
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
    <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image">
      <button
        type="button"
        className="gallery-lightbox__backdrop"
        aria-label="Close image"
        onClick={onClose}
      />
      <div className="gallery-lightbox__content">
        <button
          type="button"
          className="gallery-lightbox__close"
          aria-label="Close image"
          onClick={onClose}
        >
          ×
        </button>
        <div className="gallery-lightbox__media">
          <Image src={image.src} alt={image.alt} fill sizes="100vw" priority />
        </div>
        <p className="gallery-lightbox__caption">{image.alt}</p>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <main className="gallery-page">
      <header className="gallery-page__intro">
        <p className="gallery-page__eyebrow">Inside HADITH Hotel</p>
        <h1 className="gallery-page__title">Gallery</h1>
        <p className="gallery-page__body">
          A visual journey through the hotel, its spaces, and the heritage that
          surrounds it.
        </p>
      </header>

      <section className="gallery-grid" aria-label="HADITH Hotel photo gallery">
        {galleryImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className="gallery-grid__item"
            onClick={() => setSelectedImage(image)}
            aria-label={`View ${image.alt}`}
          >
            <Image
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
        <GalleryLightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      ) : null}
    </main>
  );
}
