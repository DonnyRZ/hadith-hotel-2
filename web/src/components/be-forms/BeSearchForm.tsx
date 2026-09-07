"use client"

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import "./be-style.css";

interface BeSearchFormProps {
  beLocale: string
  formType?: string | null
}

export function BeSearchForm({ beLocale, formType }: BeSearchFormProps) {
  const pathname = usePathname();

  const loadSearchForm = ( w: Window ) => {
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
      ["embed", "search-form", {
        container: "be-search-form"
      }]
    ]);
    /* eslint-enable */
  };

  useEffect(() => {
    loadSearchForm(window);
  }, [pathname, beLocale]);

  return (
    <div className={`block-search ${formType ? 'block-search--' + formType : ''}`}>
      <div id="be-search-form" className="be-container">
        <a href="https://exely.com/" rel="nofollow" target="_blank">Hotel management software</a>
      </div>
    </div>
  );
}
