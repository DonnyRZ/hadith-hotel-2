import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/navigation";

const INSTAGRAM_URL = "https://www.instagram.com/hadith.hotel/";
const YOUTUBE_URL = "https://www.youtube.com/channel/UC9x645ycCx46N5zrO2749Fg";

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

function YouTubeIcon({ className }: { className?: string }) {
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
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 9.5v5l5-2.5-5-2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteFooter() {
  const t = useTranslations("common.footer");
  const tNav = useTranslations("common.nav");
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-labelledby="site-footer-heading">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__eyebrow">{t("eyebrow")}</p>
          <h2 id="site-footer-heading" className="site-footer__title">
            {t("title")}
          </h2>

          <address className="site-footer__address">
            <strong>{t("addressLabel")}</strong>
            <span>{t("addressName")}</span>
            <span>{t("addressComplex")}</span>
            <span>{t("addressPlace")}</span>
          </address>

          <div className="site-footer__contacts">
            <a className="site-footer__email" href="mailto:info@hadith-hotel.com">
              info@hadith-hotel.com
            </a>
            <a
              className="site-footer__social"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="site-footer__social-icon" />
              {t("instagram")}
            </a>
            <a
              className="site-footer__social"
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTubeIcon className="site-footer__social-icon" />
              {t("youtube")}
            </a>
          </div>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {tNav(item.key)}
            </Link>
          ))}
        </nav>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copy">{t("copyright", { year })}</p>
      </div>
    </footer>
  );
}
