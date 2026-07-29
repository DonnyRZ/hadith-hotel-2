type Venue = {
  id: string;
  heading: string;
  eyebrow: string;
  name: string;
  description: string;
  highlights: string[];
  variant: "blue" | "paper";
  reversed?: boolean;
};

const venues: Venue[] = [
  {
    id: "restaurant",
    heading: "Savour the Silk Road",
    eyebrow: "Food & Beverage · The Restaurant",
    name: "The Restaurant",
    description:
      "A 120-seat dining room framed by a slender white marble mihrab. The menu travels the Silk Road from Samarkand plov and Bukhara somsa to Indonesian-inspired creations prepared by our culinary team.",
    highlights: [
      "120 seats",
      "Breakfast, lunch and dinner",
      "Private dining room",
      "Halal certified",
    ],
    variant: "blue",
  },
  {
    id: "cafe",
    heading: "A Taste of Indonesia",
    eyebrow: "Food & Beverage · The Cafe",
    name: "The Cafe",
    description:
      "Discover curated Indonesian pastries and specialty coffees from across the archipelago, including classics such as Kopi Luwak. The cafe offers a warm social setting celebrating Indonesia’s rich coffee culture.",
    highlights: [
      "Indonesian specialty coffee",
      "Curated Indonesian pastries",
      "Relaxed social setting",
    ],
    variant: "paper",
    reversed: true,
  },
];

export function CafeDiningVenues() {
  return (
    <>
      {venues.map((venue, index) => (
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
    </>
  );
}
