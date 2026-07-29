"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const utilityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = utilityRef.current;
    if (!el) return;

    const primaryH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-primary-h",
        ),
      ) || 92;

    // Treat utility as "gone" once it scrolls under the sticky primary nav
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatReserve(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `-${primaryH}px 0px 0px 0px`,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
                <Image
                  src="/images/logo-hadith.png"
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
          </div>
        </div>
      </header>

      <div className="site-header__utility" ref={utilityRef}>
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
