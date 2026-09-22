"use client";

import SiteImage from "@/components/SiteImage";
import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { navItems } from "@/lib/navigation";
import { BeSearchForm } from "@/components/be-forms/BeSearchForm";

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

export function SiteHeader() {
  const t = useTranslations("common.header");
  const tNav = useTranslations("common.nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [primaryHeaderHidden, setPrimaryHeaderHidden] = useState(false);
  const primaryHeaderHiddenRef = useRef(false);
  const isBookingPage = pathname === "/booking";

  useEffect(() => {
    if (!mobileMenuOpen) return;

    document.body.classList.add("has-mobile-menu");
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("has-mobile-menu");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let accumulatedDistance = 0;
    let ignoreUntil = 0;
    let frameId: number | null = null;

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      const now = performance.now();

      if (currentScrollY <= 12) {
        accumulatedDistance = 0;
        if (primaryHeaderHiddenRef.current) {
          primaryHeaderHiddenRef.current = false;
          setPrimaryHeaderHidden(false);
        }
      } else if (Math.abs(delta) > 0.01) {
        if (now < ignoreUntil) {
          accumulatedDistance = 0;
          lastScrollY = currentScrollY;
          frameId = null;
          return;
        }

        if (primaryHeaderHiddenRef.current) {
          accumulatedDistance = Math.min(0, accumulatedDistance + delta);

          if (accumulatedDistance <= -12) {
            primaryHeaderHiddenRef.current = false;
            setPrimaryHeaderHidden(false);
            accumulatedDistance = 0;
            ignoreUntil = now + 260;
          }
        } else {
          accumulatedDistance = Math.max(0, accumulatedDistance + delta);

          if (accumulatedDistance >= 18) {
            primaryHeaderHiddenRef.current = true;
            setPrimaryHeaderHidden(true);
            accumulatedDistance = 0;
            ignoreUntil = now + 260;
          }
        }
      }

      lastScrollY = currentScrollY;
      frameId = null;
    };

    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateHeaderVisibility);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`site-header${primaryHeaderHidden && !mobileMenuOpen ? " site-header--primary-hidden" : ""}`}
      >
        <div className="site-header__primary">
          <div className="site-header__primary-inner">
            <div className="site-header__brand-row">
              <Link href="/" className="site-logo" aria-label={t("homeAriaLabel")}>
                <SiteImage
                  src="/images/logo-hadith-2.png"
                  alt={t("logoAlt")}
                  width={280}
                  height={112}
                  className="site-logo__image"
                  priority
                />
              </Link>
            </div>

            <div className="site-header__actions site-header__primary-actions">
              <a
                className="site-header__map"
                href="https://maps.app.goo.gl/71EH9gqP3kGgsMAB6"
                target="_blank"
                rel="noreferrer"
              >
                <PinIcon />
                <span>{t("viewMap")}</span>
              </a>
              <LanguageSwitcher />
            </div>

            <nav className="site-header__desktop-nav" aria-label="Primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "is-active" : undefined}
                >
                  {tNav(item.key)}
                </Link>
              ))}
            </nav>

            <div className="site-header__mobile-actions">
              <button
                type="button"
                className={`site-header__menu-toggle${mobileMenuOpen ? " is-open" : ""}`}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>

        {!isBookingPage ? (
          <div className="site-header__utility">
            <div className="site-header__utility-inner">
              <div className="site-header__booking">
                <BeSearchForm
                  beLocale={locale}
                  reserveLabel={t("reserve")}
                  mobileFindRoomLabel="Find room"
                />
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {mobileMenuOpen ? (
        <div className="mobile-menu" id="mobile-navigation">
          <button
            type="button"
            className="mobile-menu__backdrop"
            aria-label={t("closeMenu")}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="mobile-menu__panel">
            <p className="mobile-menu__eyebrow">{t("mobileEyebrow")}</p>
            <div className="mobile-menu__language">
              <LanguageSwitcher />
            </div>
            <nav className="mobile-menu__nav" aria-label="Mobile primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "is-active" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tNav(item.key)}
                </Link>
              ))}
            </nav>
            <a
              className="mobile-menu__map"
              href="https://maps.app.goo.gl/71EH9gqP3kGgsMAB6"
              target="_blank"
              rel="noreferrer"
            >
              <PinIcon />
              {t("viewMap")}
            </a>
          </div>
        </div>
      ) : null}

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
      />
    </>
  );
}
