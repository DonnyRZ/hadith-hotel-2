"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import "./be-style.css";

interface BeSearchFormProps {
  beLocale: string;
  reserveLabel: string;
  mobileFindRoomLabel: string;
}

function loadSearchForm(windowObject: Window, beLocale: string) {
  /* eslint-disable */
  // @ts-ignore
  !function(e,n){
    // @ts-ignore
    var t="bookingengine",o="integration",i=e[t]=e[t]||{},a=i[o]=i[o]||{},r="__cq",c="__loader",d="getElementsByTagName";
    // @ts-ignore
    if(n=n||[],a[r]=a[r]?a[r].concat(n):n,!a[c]){a[c]=!0;var l=e.document,g=l[d]("head")[0]||l[d]("body")[0];
      // @ts-ignore
      !function n(i){if(0!==i.length){var a=l.createElement("script");a.type="text/javascript";a.async=!0;a.src="https://"+i[0]+"/integration/loader.js",
        // @ts-ignore
        a.onerror=a.onload=function(n,i){return function(){e[t]&&e[t][o]&&e[t][o].loaded||(g.removeChild(n),i())}}(a,(function(){n(i.slice(1,i.length))})),g.appendChild(a)}}(
        ["uz-ibe.hopenapi.com", "ibe.hopenapi.com", "ibe.behopenapi.com"])}
  }(windowObject, [
    ["setContext", "BE-INT-hadith-hotel-com_2026-09-07", beLocale],
    ["embed", "search-form", {
      container: "be-search-form"
    }]
  ]);
  /* eslint-enable */
}

export function BeSearchForm({
  beLocale,
  reserveLabel,
  mobileFindRoomLabel,
}: BeSearchFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    setShowFallback(false);
    container.replaceChildren();

    const hasWidget = () => {
      return Boolean(
        container.querySelector("iframe, button, a, input, select"),
      );
    };

    const observer = new MutationObserver(() => {
      if (disposed) return;
      if (hasWidget()) setShowFallback(false);
    });
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    loadSearchForm(window, beLocale);

    const fallbackTimer = window.setTimeout(() => {
      if (!disposed && !hasWidget()) {
        setShowFallback(true);
      }
    }, 7000);

    return () => {
      disposed = true;
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
      container.replaceChildren();
    };
  }, [beLocale, reserveLabel]);

  return (
    <div className="block-search block-search--header">
      <div className="be-container">
        <div id="be-search-form" ref={containerRef} />
        {showFallback ? (
          <Link className="be-search-form__fallback" href="/booking">
            {reserveLabel}
          </Link>
        ) : null}
        <Link className="be-search-form__mobile-cta" href="/booking">
          {mobileFindRoomLabel}
        </Link>
      </div>
    </div>
  );
}
