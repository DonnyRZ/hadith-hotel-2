"use client";

import { useState } from "react";
import { ComingSoonModal } from "@/components/ComingSoonModal";

type EventUse = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
};

const eventUses: EventUse[] = [
  {
    id: "meetings",
    eyebrow: "Business Events",
    title: "Meetings & Conferences",
    description:
      "Configure the hall for focused meetings, conferences, and corporate gatherings, with adaptable arrangements supported by modern facilities.",
    highlights: [
      "Flexible event setups",
      "Modern facilities",
      "Dedicated events team",
    ],
  },
  {
    id: "weddings",
    eyebrow: "Social Events",
    title: "Weddings & Celebrations",
    description:
      "Transform the same hall into an elegant setting for weddings and social celebrations, welcoming up to 250 guests.",
    highlights: [
      "Elegant ballroom",
      "Up to 250 guests",
      "Weddings and social events",
    ],
  },
];

const venueFacts = [
  { id: "capacity", value: "250 Guests", label: "Maximum Capacity" },
  { id: "setups", value: "Flexible", label: "Event Setups" },
  { id: "facilities", value: "Modern", label: "Facilities" },
];

export function MeetingsWeddings() {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <>
      <section className="event-uses" aria-labelledby="event-uses-heading">
        <div className="event-uses__inner">
          <header className="event-uses__intro">
            <p className="event-uses__eyebrow">Meetings &amp; Weddings</p>
            <h2 id="event-uses-heading" className="event-uses__heading">
              One Hall, Many Possibilities
            </h2>
            <p className="event-uses__lead">
              One adaptable venue, thoughtfully arranged around the character
              and scale of each occasion.
            </p>
          </header>

          <div className="event-uses__grid">
            {eventUses.map((eventUse) => (
              <article key={eventUse.id} className="event-use">
                <p className="event-use__eyebrow">{eventUse.eyebrow}</p>
                <h3 className="event-use__title">{eventUse.title}</h3>
                <p className="event-use__body">{eventUse.description}</p>

                <ul className="event-use__highlights">
                  {eventUse.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

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
