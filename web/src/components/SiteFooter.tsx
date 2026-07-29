import Link from "next/link";
import { navItems } from "@/lib/navigation";

const addressLines = [
  "RW5X+9P, Xo\u2018ja Ismoil,",
  "Samarqand viloyati, Uzbekistan",
];

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

          <a className="site-footer__email" href="mailto:info@hadith-hotel.com">
            info@hadith-hotel.com
          </a>
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
