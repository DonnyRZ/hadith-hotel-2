"use client";

import { useState } from "react";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { RoomDetailModal } from "@/components/RoomDetailModal";
import { presidentSuite, roomTypes, type RoomType } from "@/lib/rooms";

type Tab = "all" | "accessible";

function RoomCard({
  room,
  tone,
  onViewDetails,
}: {
  room: RoomType;
  tone: number;
  onViewDetails: () => void;
}) {
  return (
    <article className="room-card">
      <div
        className={`media-placeholder room-card__media media-placeholder--tone-${tone}`}
        role="img"
        aria-label={`${room.name} image placeholder`}
      >
        <span>{room.name}</span>
      </div>

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
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
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
                tone={1}
                onViewDetails={() => setComingSoonOpen(true)}
              />
            </div>

            <div className="rooms-collection__grid">
              {roomTypes.map((room, index) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  tone={(index % 3) + 1}
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

      <RoomDetailModal room={detailRoom} onClose={() => setDetailRoom(null)} />

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        eyebrow="President Suite"
        body="Details for the President Suite are being prepared and will be available shortly."
      />
    </>
  );
}
