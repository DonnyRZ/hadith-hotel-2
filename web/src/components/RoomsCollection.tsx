"use client";

import SiteImage from "@/components/SiteImage";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { RoomDetailModal } from "@/components/RoomDetailModal";
import { getRoomName, getRoomSpecs } from "@/lib/roomSpecs";
import { presidentSuite, roomTypes, type RoomType } from "@/lib/rooms";

type Tab = "all" | "accessible";

const BALCONY_SRC = "/images/overview-rooms/balcony.webp";

const roomImages: Record<string, string> = {
  president: BALCONY_SRC,
  junior: "/images/rooms/junior/junior-1.png",
  suite: "/images/rooms/suite/suite-main.jpeg",
  balcony: BALCONY_SRC,
  standard: "/images/rooms/standard/standard-main.jpeg",
};

function RoomCard({
  room,
  name,
  t,
  comingSoon = false,
  onViewDetails,
}: {
  room: RoomType;
  name: string;
  t: ReturnType<typeof useTranslations>;
  comingSoon?: boolean;
  onViewDetails: () => void;
}) {
  return (
    <article className="room-card">
      <button
        type="button"
        className={`room-card__media${comingSoon ? " room-card__media--coming-soon" : ""}`}
        aria-label={
          comingSoon
            ? t("card.comingSoonAria", { name })
            : t("card.viewDetailsAria", { name })
        }
        onClick={onViewDetails}
      >
        <SiteImage
          className="room-card__image"
          src={roomImages[room.id] ?? BALCONY_SRC}
          alt=""
          fill
          sizes="(max-width: 680px) 100vw, 50vw"
          aria-hidden="true"
        />
        {comingSoon ? (
          <span className="room-card__soon">{t("card.comingSoonBadge")}</span>
        ) : null}
      </button>

      <h3 className="room-card__name">{name}</h3>
      <p className="room-card__detail">
        {room.size ? t("card.unitsAndSize", { units: room.units, size: room.size }) : t("card.unitsOnly", { units: room.units })}
      </p>

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
  const [comingSoonRoom, setComingSoonRoom] = useState<RoomType | null>(null);
  const [detailRoom, setDetailRoom] = useState<RoomType | null>(null);

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
                comingSoon
                onViewDetails={() => setComingSoonRoom(presidentSuite)}
              />
            </div>

            <div className="rooms-collection__grid">
              {roomTypes.map((room) => (
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
        onClose={() => setDetailRoom(null)}
      />

      <ComingSoonModal
        open={comingSoonRoom !== null}
        onClose={() => setComingSoonRoom(null)}
        eyebrow={comingSoonRoom ? getRoomName(t, comingSoonRoom.id) : undefined}
        body={
          comingSoonRoom
            ? t("comingSoonBody", { name: getRoomName(t, comingSoonRoom.id) })
            : undefined
        }
      />
    </>
  );
}
