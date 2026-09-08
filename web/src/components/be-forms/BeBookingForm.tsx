"use client"

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import "./be-style.css";

interface BeBookingFormProps {
    beLocale: string
}

export function BeBookingForm({ beLocale }: BeBookingFormProps) {
  const pathname = usePathname();

  const loadBookingForm = ( w: Window ) => {
    /* eslint-disable */
    // @ts-ignore
    !function(e,n){
      // @ts-ignore
      var t="bookingengine",o="integration",i=e[t]=e[t]||{},a=i[o]=i[o]||{},r="__cq",c="__loader",d="getElementsByTagName";
      // @ts-ignore
      if(n=n||[],a[r]=a[r]?a[r].concat(n):n,!a[c]){a[c]=!0;var l=e.document,g=l[d]("head")[0]||l[d]("body")[0];
        // @ts-ignore
        !function n(i){if(0!==i.length){var a=l.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://"+i[0]+"/integration/loader.js",
          // @ts-ignore
          a.onerror=a.onload=function(n,i){return function(){e[t]&&e[t][o]&&e[t][o].loaded||(g.removeChild(n),i())}}(a,(function(){n(i.slice(1,i.length))})),g.appendChild(a)}}(
          ["uz-ibe.hopenapi.com", "ibe.hopenapi.com", "ibe.behopenapi.com"])}
    }(w, [
      ["setContext", "BE-INT-hadith-hotel-com_2026-09-07", beLocale],
      ["embed", "booking-form", {
        container: "be-booking-form"
      }]
    ]);
    /* eslint-enable */
  }

  useEffect(() => {
    loadBookingForm(window);
  }, [pathname, beLocale]);

  return (
    <div id="be-booking-form" />
  );
}
