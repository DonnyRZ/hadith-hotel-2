"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { RoomDetailModal } from "@/components/RoomDetailModal";
import SiteImage from "@/components/SiteImage";
import { RoomImagePlaceholder } from "@/components/RoomImagePlaceholder";
import { getRoomName, getRoomSpecs } from "@/lib/roomSpecs";
import { ALL_ROOMS_GALLERY_IMAGES } from "@/lib/roomGallery";
import { roomTypes, type RoomType } from "@/lib/rooms";

type Tab = "all" | "accessible";

const allRoomsTypes = roomTypes.map((room) => ({
  ...room,
  images: ALL_ROOMS_GALLERY_IMAGES[room.id] ?? room.images,
}));
const presidentSuite = allRoomsTypes.find((room) => room.id === "president-suite")!;
const collectionRoomTypes = allRoomsTypes.filter((room) => room.id !== "president-suite");

function RoomCard({
  room,
  name,
  t,
  onViewDetails,
}: {
  room: RoomType;
  name: string;
  t: ReturnType<typeof useTranslations>;
  onViewDetails: () => void;
}) {
  return (
    <article className="room-card" id={`room-${room.id}`}>
      <button
        type="button"
        className="room-card__media"
        aria-label={t("card.viewDetailsAria", { name })}
        onClick={onViewDetails}
      >
        {room.images[0] ? <SiteImage
          className="room-card__image"
          src={room.images[0]}
          alt={name}
          fill
          sizes="(max-width: 680px) 100vw, 50vw"
        /> : <RoomImagePlaceholder />}
      </button>

      <h3 className="room-card__name">{name}</h3>
      {room.size ? <p className="room-card__detail">{room.size}</p> : null}

      <button
        type="button"
        className="room-card__details"
        onClick={onViewDetails}
      >
        {t("card.viewDetails")}
      </button>
    </article>
  );
}

export function RoomsCollection() {
  const t = useTranslations("suitesRooms");
  const [tab, setTab] = useState<Tab>("all");
  const [detailRoom, setDetailRoom] = useState<RoomType | null>(null);
  const closeDetail = useCallback(() => setDetailRoom(null), []);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const id = hash === "room-president-suite-balcony" ? "room-president-suite" : hash;
      if (!id.startsWith("room-")) return;
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    const frame = window.requestAnimationFrame(scrollToHash);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <>
      <section className="rooms-collection" aria-label="Rooms and suites">
        <div className="rooms-collection__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            id="rooms-tab-all"
            aria-selected={tab === "all"}
            aria-controls="rooms-panel-all"
            className={`rooms-collection__tab${tab === "all" ? " is-active" : ""}`}
            onClick={() => setTab("all")}
          >
            {t("tabs.all")}
          </button>
          <button
            type="button"
            role="tab"
            id="rooms-tab-accessible"
            aria-selected={tab === "accessible"}
            aria-controls="rooms-panel-accessible"
            className={`rooms-collection__tab${tab === "accessible" ? " is-active" : ""}`}
            onClick={() => setTab("accessible")}
          >
            {t("tabs.accessible")}
          </button>
        </div>

        {tab === "all" ? (
          <div
            role="tabpanel"
            id="rooms-panel-all"
            aria-labelledby="rooms-tab-all"
            className="rooms-collection__panel"
          >
            <div className="rooms-collection__featured">
              <RoomCard
                room={presidentSuite}
                name={getRoomName(t, presidentSuite.id)}
                t={t}
                onViewDetails={() => setDetailRoom(presidentSuite)}
              />
            </div>
            <div className="rooms-collection__grid">
              {collectionRoomTypes.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  name={getRoomName(t, room.id)}
                  t={t}
                  onViewDetails={() => setDetailRoom(room)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            role="tabpanel"
            id="rooms-panel-accessible"
            aria-labelledby="rooms-tab-accessible"
            className="rooms-collection__panel"
          >
            <div className="rooms-collection__notice">
              <p className="rooms-collection__notice-eyebrow">
                {t("accessibleNotice.eyebrow")}
              </p>
              <p className="rooms-collection__notice-title">
                {t("accessibleNotice.title")}
              </p>
              <p className="rooms-collection__notice-body">
                {t("accessibleNotice.body")}
              </p>
            </div>
          </div>
        )}
      </section>

      <RoomDetailModal
        key={detailRoom?.id ?? "closed"}
        room={detailRoom}
        name={detailRoom ? getRoomName(t, detailRoom.id) : ""}
        specs={detailRoom ? getRoomSpecs(t, detailRoom) : null}
        onClose={closeDetail}
      />
    </>
  );
}
