import Image from "next/image";
import Link from "next/link";

export function OverviewDestinations() {
  return (
    <section
      className="overview-destinations"
      aria-labelledby="overview-destinations-heading"
    >
      <div className="overview-destinations__inner">
        <div className="overview-destinations__media">
          <Image
            className="overview-destinations__image"
            src="/images/experience/destinations/imam-bukhari-1.png"
            alt="Imam Al-Bukhari Mausoleum complex near HADITH Hotel"
            fill
            sizes="(max-width: 820px) 100vw, 58vw"
          />
        </div>

        <div className="overview-destinations__copy">
          <p className="overview-destinations__eyebrow">Beyond the Hotel</p>
          <h2
            id="overview-destinations-heading"
            className="overview-destinations__heading"
          >
            Discover Samarkand&apos;s living heritage
          </h2>
          <p className="overview-destinations__body">
            From the Imam Al-Bukhari Mausoleum and International Centre just
            0.9 km away to Shah-i-Zinda and Bibi-Khanym Mosque in historic
            Samarkand, meaningful journeys begin close to HADITH Hotel.
          </p>
          <Link
            href="/experience#destinations"
            className="overview-destinations__explore"
          >
            Explore Destinations <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
