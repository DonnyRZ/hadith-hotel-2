"use client";

import { useState } from "react";
import { ComingSoonModal } from "@/components/ComingSoonModal";

type EventVenue = {
  id: string;
  heading: string;
  eyebrow: string;
  name: string;
  description: string;
  highlights: string[];
  variant: "blue" | "paper";
  reversed?: boolean;
};

const eventVenues: EventVenue[] = [
  {
    id: "meetings",
    heading: "Meetings & Conferences",
    eyebrow: "Events · Business",
    name: "Meetings & Conferences",
    description:
      "Flexible spaces for corporate meetings, conferences, and business events, supported by adaptable room arrangements and modern facilities.",
    highlights: [
      "Flexible event setups",
      "Modern facilities",
      "Dedicated events team",
    ],
    variant: "blue",
  },
  {
    id: "weddings",
    heading: "Weddings & Celebrations",
    eyebrow: "Events · Celebrations",
    name: "Weddings & Celebrations",
    description:
      "An elegant ballroom for weddings and social celebrations, offering a refined setting for up to 250 guests.",
    highlights: [
      "Elegant ballroom",
      "Up to 250 guests",
      "Weddings and social events",
    ],
    variant: "paper",
    reversed: true,
  },
];

const venueFacts = [
  { id: "area", value: "350 m²", label: "Ballroom Area" },
  { id: "capacity", value: "250 Guests", label: "Maximum Capacity" },
  { id: "setups", value: "Flexible", label: "Event Setups" },
  { id: "facilities", value: "Modern", label: "Facilities" },
];

export function MeetingsWeddings() {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <>
      {eventVenues.map((venue, index) => (
        <section
          key={venue.id}
          className={`venue venue--${venue.variant}`}
          aria-labelledby={`venue-heading-${venue.id}`}
        >
          <div className="venue__inner">
            <h2 id={`venue-heading-${venue.id}`} className="venue__heading">
              {venue.heading}
            </h2>

            <div className={`venue__layout${venue.reversed ? " is-reversed" : ""}`}>
              <div className="venue__media">
                <div
                  className={`media-placeholder venue__placeholder media-placeholder--tone-${(index % 3) + 1}`}
                  role="img"
                  aria-label={`${venue.name} image placeholder`}
                >
                  <span>{venue.name}</span>
                </div>
              </div>

              <div className="venue__card">
                <p className="venue__eyebrow">{venue.eyebrow}</p>
                <h3 className="venue__name">{venue.name}</h3>
                <p className="venue__body">{venue.description}</p>

                <ul className="venue__highlights">
                  {venue.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="event-facts" aria-labelledby="event-facts-heading">
        <div className="event-facts__inner">
          <h2 id="event-facts-heading" className="event-facts__heading">
            Venue Details
          </h2>

          <dl className="event-facts__grid">
            {venueFacts.map((fact) => (
              <div key={fact.id} className="event-facts__item">
                <dd className="event-facts__value">{fact.value}</dd>
                <dt className="event-facts__label">{fact.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="event-enquiry" aria-labelledby="event-enquiry-heading">
        <h2 id="event-enquiry-heading" className="event-enquiry__title">
          Plan Your Event
        </h2>
        <p className="event-enquiry__body">
          Tell us about your upcoming meeting, wedding, or celebration. Our
          team will help you plan an event tailored to your requirements.
        </p>
        <button
          type="button"
          className="event-enquiry__button"
          onClick={() => setComingSoonOpen(true)}
        >
          Request a Proposal
        </button>
      </section>

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        eyebrow="Event Enquiry"
        body="Event enquiries will open shortly. Thank you for considering HADITH Hotel for your occasion."
      />
    </>
  );
}
