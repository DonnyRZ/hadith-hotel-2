"use client";

import Image from "next/image";
import { useState } from "react";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { RoomDetailModal } from "@/components/RoomDetailModal";
import { presidentSuite, roomTypes, type RoomType } from "@/lib/rooms";

type Tab = "all" | "accessible";

const BALCONY_SRC = "/images/overview-rooms/balcony.webp";

const roomImages: Record<string, string> = {
  president: BALCONY_SRC,
  junior: BALCONY_SRC,
  suite: "/images/overview-rooms/suite.webp",
  balcony: BALCONY_SRC,
  standard: "/images/overview-rooms/standard.webp",
};

function RoomCard({
  room,
  comingSoon = false,
  onViewDetails,
}: {
  room: RoomType;
  comingSoon?: boolean;
  onViewDetails: () => void;
}) {
  return (
    <article className="room-card">
      <button
        type="button"
        className={`room-card__media${comingSoon ? " room-card__media--coming-soon" : ""}`}
        aria-label={comingSoon ? `${room.name} — coming soon` : `View ${room.name} details`}
        onClick={onViewDetails}
      >
        <Image
          className="room-card__image"
          src={roomImages[room.id] ?? BALCONY_SRC}
          alt=""
          fill
          sizes="(max-width: 680px) 100vw, 50vw"
          aria-hidden="true"
        />
        {comingSoon ? (
          <span className="room-card__soon">Coming Soon</span>
        ) : null}
      </button>

      <h3 className="room-card__name">{room.name}</h3>
      <p className="room-card__detail">
        {room.units} units{room.size ? ` · ${room.size}` : ""}
      </p>

      <button
        type="button"
        className="room-card__details"
        onClick={onViewDetails}
      >
        View Details
      </button>
    </article>
  );
}

export function RoomsCollection() {
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
            All Rooms
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
            Accessible Rooms
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
                comingSoon
                onViewDetails={() => setComingSoonRoom(presidentSuite)}
              />
            </div>

            <div className="rooms-collection__grid">
              {roomTypes.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  comingSoon={room.id === "junior"}
                  onViewDetails={() =>
                    room.id === "junior"
                      ? setComingSoonRoom(room)
                      : setDetailRoom(room)
                  }
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
                Accessible Rooms
              </p>
              <p className="rooms-collection__notice-title">Coming Soon</p>
              <p className="rooms-collection__notice-body">
                We are preparing detailed information about our accessible
                rooms. Please check back soon.
              </p>
            </div>
          </div>
        )}
      </section>

      <RoomDetailModal
        key={detailRoom?.id ?? "closed"}
        room={detailRoom}
        onClose={() => setDetailRoom(null)}
      />

      <ComingSoonModal
        open={comingSoonRoom !== null}
        onClose={() => setComingSoonRoom(null)}
        eyebrow={comingSoonRoom?.name ?? "Room"}
        body={`Details for the ${comingSoonRoom?.name ?? "room"} are being prepared and will be available shortly.`}
      />
    </>
  );
}
