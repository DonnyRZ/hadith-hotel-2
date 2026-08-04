import Link from "next/link";
import { navItems } from "@/lib/navigation";

const addressLines = [
  "RW5X+9P, Xo\u2018ja Ismoil,",
  "Samarqand viloyati, Uzbekistan",
];

const INSTAGRAM_URL = "https://www.instagram.com/hadithhotel/";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-labelledby="site-footer-heading">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__eyebrow">HADITH Hotel</p>
          <h2 id="site-footer-heading" className="site-footer__title">
            Complex of Imam Al Bukhari
          </h2>

          <address className="site-footer__address">
            {addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>

          <div className="site-footer__contacts">
            <a className="site-footer__email" href="mailto:info@hadith-hotel.com">
              info@hadith-hotel.com
            </a>
            <a
              className="site-footer__instagram"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="site-footer__instagram-icon" />
              Instagram
            </a>
          </div>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copy">
          © {year} HADITH Hotel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
