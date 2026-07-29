"use client";

import { useState } from "react";
import { ComingSoonModal } from "@/components/ComingSoonModal";

type Destination = {
  id: string;
  name: string;
  distance: string;
  description: string;
};

const destinations: Destination[] = [
  {
    id: "imam-al-bukhari",
    name: "Imam al-Bukhari Memorial Complex",
    distance: "0.9 km",
    description:
      "A major Islamic pilgrimage complex featuring the mausoleum of Imam al-Bukhari, a mosque, museum, library, and research centre.",
  },
  {
    id: "shah-i-zinda",
    name: "Shah-i-Zinda",
    distance: "16.5 km",
    description:
      "A remarkable avenue of historic mausoleums renowned for its intricate blue tilework and Timurid architecture.",
  },
  {
    id: "registan",
    name: "Registan Square",
    distance: "17.2 km",
    description:
      "Samarkand’s most iconic landmark, surrounded by three monumental madrasas decorated with elaborate mosaics and turquoise tiles.",
  },
];

export function OverviewDestinations() {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <>
      <section
        className="overview-destinations"
        aria-labelledby="overview-destinations-heading"
      >
        <div className="overview-destinations__intro">
          <p className="overview-destinations__eyebrow">
            Samarkand
          </p>
          <h2
            id="overview-destinations-heading"
            className="overview-destinations__heading"
          >
            Nearby Destinations
          </h2>
        </div>

        <div className="overview-destinations__list">
          {destinations.map((place, index) => {
            const reversed = index % 2 === 1;
            const tone = (index % 3) + 1;

            return (
              <article
                key={place.id}
                className={`overview-destinations__row${reversed ? " is-reversed" : ""}`}
              >
                <div className="overview-destinations__copy">
                  <p className="overview-destinations__distance">
                    {place.distance} from the hotel
                  </p>
                  <h3 className="overview-destinations__title">{place.name}</h3>
                  <p className="overview-destinations__body">
                    {place.description}
                  </p>
                  <button
                    type="button"
                    className="overview-destinations__explore"
                    onClick={() => setComingSoonOpen(true)}
                  >
                    Explore
                    <span aria-hidden="true"> →</span>
                  </button>
                </div>

                <div className="overview-destinations__media">
                  <div
                    className={`media-placeholder media-placeholder--destination media-placeholder--tone-${tone}`}
                    role="img"
                    aria-label={`${place.name} image placeholder`}
                  >
                    <span>{place.name}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        eyebrow="Destinations"
        body="Guides to the destinations around HADITH Hotel are being prepared and will be available shortly."
      />
    </>
  );
}
