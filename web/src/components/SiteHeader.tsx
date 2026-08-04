"use client";

import SiteImage from "@/components/SiteImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { navItems } from "@/lib/navigation";

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
  const pathname = usePathname();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [showFloatReserve, setShowFloatReserve] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const primaryH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-primary-h",
        ),
      ) || 92;

    let observer: IntersectionObserver | null = null;
    const frame = window.requestAnimationFrame(() => {
      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reserve-anchor]"),
      );
      if (anchors.length === 0) return;

      const visibility = new Map<Element, boolean>();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibility.set(entry.target, entry.isIntersecting);
          });

          if (visibility.size === anchors.length) {
            setShowFloatReserve(
              !Array.from(visibility.values()).some(Boolean),
            );
          }
        },
        {
          root: null,
          threshold: 0,
          rootMargin: `-${primaryH}px 0px 0px 0px`,
        },
      );

      anchors.forEach((anchor) => observer?.observe(anchor));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openComingSoon = () => setComingSoonOpen(true);

  return (
    <>
      <header className="site-header">
        <div className="site-header__primary">
          <div className="site-header__primary-inner">
            <div className="site-header__brand-row">
              <Link href="/" className="site-logo" aria-label="HADITH Hotel home">
                <SiteImage
                  src="/images/logo-hadith-2.png"
                  alt="Hadits Hotel — Complex of Imam Al Bukhari"
                  width={280}
                  height={112}
                  className="site-logo__image"
                  priority
                />
              </Link>
            </div>

            <nav className="site-header__desktop-nav" aria-label="Primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "is-active" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="site-header__mobile-actions">
              <button
                type="button"
                className="site-header__mobile-reserve"
                data-reserve-anchor
                onClick={openComingSoon}
              >
                Reserve
              </button>
              <button
                type="button"
                className={`site-header__menu-toggle${mobileMenuOpen ? " is-open" : ""}`}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="mobile-menu" id="mobile-navigation">
          <button
            type="button"
            className="mobile-menu__backdrop"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="mobile-menu__panel">
            <p className="mobile-menu__eyebrow">Explore HADITH Hotel</p>
            <nav className="mobile-menu__nav" aria-label="Mobile primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "is-active" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
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
              View Map
            </a>
          </div>
        </div>
      ) : null}

      <div className="site-header__utility">
        <div className="site-header__utility-inner site-header__utility-inner--actions-only">
          <div className="site-header__actions">
            <a
              className="site-header__map"
              href="https://maps.app.goo.gl/71EH9gqP3kGgsMAB6"
              target="_blank"
              rel="noreferrer"
            >
              <PinIcon />
              <span>View Map</span>
            </a>
            <button
              type="button"
              className="site-header__reserve"
              data-reserve-anchor
              onClick={openComingSoon}
            >
              <span>Reserve</span>
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`reserve-float${showFloatReserve ? " is-visible" : ""}`}
        onClick={openComingSoon}
        aria-hidden={!showFloatReserve}
        tabIndex={showFloatReserve ? 0 : -1}
      >
        <span>Reserve</span>
      </button>

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
      />
    </>
  );
}
