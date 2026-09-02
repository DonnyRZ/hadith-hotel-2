import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL = "https://hadith-hotel.com";
export const SITE_NAME = "HADITH Hotel";
export const SITE_ALTERNATE_NAMES = ["Hadith Hotel", "hadith-hotel.com"] as const;

export const BRAND_ICON_PATH = "/brand/icon-512.png";
export const BRAND_APPLE_ICON_PATH = "/brand/apple-icon.png";
export const BRAND_LOGO_PATH = "/brand/logo-org.png";
export const OG_IMAGE_PATH = "/brand/og-default.jpg";
export const FAVICON_PATH = "/favicon.ico";

export const HOTEL_EMAIL = "info@hadith-hotel.com";
export const INSTAGRAM_URL = "https://www.instagram.com/hadith.hotel/";
export const YOUTUBE_URL =
  "https://www.youtube.com/channel/UC9x645ycCx46N5zrO2749Fg";

export const HOTEL_GEO = {
  latitude: 39.808167,
  longitude: 66.949639,
} as const;

export const HOTEL_ADDRESS = {
  streetAddress: "Imam Al-Bukhari Complex",
  addressLocality: "Samarkand",
  addressCountry: "UZ",
} as const;

export const INDEXABLE_PATHS = [
  "/",
  "/suites-rooms",
  "/cafe-dining",
  "/experience",
  "/events",
  "/reviews",
  "/gallery",
  "/stories/chess-journey",
] as const;

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  id: "id_ID",
  ru: "ru_RU",
  uz: "uz_UZ",
};

export function openGraphLocale(locale: string): string {
  return OG_LOCALE[(locale as Locale)] ?? OG_LOCALE.en;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localizedPathname(locale: string, path: string): string {
  const normalized = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) return normalized;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function canonicalUrl(locale: string, path: string): string {
  return absoluteUrl(localizedPathname(locale, path));
}

export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = canonicalUrl(locale, path);
  }
  languages["x-default"] = canonicalUrl(routing.defaultLocale, path);
  return languages;
}

export function brandedTitle(pageTitle?: string): string {
  if (!pageTitle) return SITE_NAME;
  return `${pageTitle} | ${SITE_NAME}`;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  robots,
}: {
  locale: string;
  path: string;
  title?: string;
  description: string;
  robots?: Metadata["robots"];
}): Metadata {
  const url = canonicalUrl(locale, path);
  const resolvedTitle = brandedTitle(title);
  const ogLocale = openGraphLocale(locale);
  const alternateLocale = routing.locales
    .filter((item) => item !== locale)
    .map((item) => OG_LOCALE[item]);

  return {
    title: title
      ? {
          absolute: brandedTitle(title),
        }
      : undefined,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      locale: ogLocale,
      alternateLocale,
      title: resolvedTitle,
      description,
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: "HADITH Hotel exterior at sunset",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [OG_IMAGE_PATH],
    },
    robots,
  };
}

export type JsonLdNode = Record<string, unknown>;

export function homeJsonLd(locale: string): JsonLdNode {
  const home = canonicalUrl(locale, "/");
  const logoUrl = absoluteUrl(BRAND_LOGO_PATH);
  const iconUrl = absoluteUrl(BRAND_ICON_PATH);
  const photoUrl = absoluteUrl(OG_IMAGE_PATH);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: [...SITE_ALTERNATE_NAMES],
        url: `${SITE_URL}/`,
        inLanguage: [...routing.locales],
        publisher: { "@id": `${SITE_URL}/#hotel` },
      },
      {
        "@type": "Hotel",
        "@id": `${SITE_URL}/#hotel`,
        name: SITE_NAME,
        alternateName: "Hadith Hotel",
        url: `${SITE_URL}/`,
        description:
          "HADITH Hotel is a five-star sanctuary within the Complex of Imam Al Bukhari in Samarkand.",
        email: HOTEL_EMAIL,
        petsAllowed: false,
        numberOfRooms: 114,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
          contentUrl: logoUrl,
          width: 512,
          height: 512,
        },
        image: [photoUrl, logoUrl, iconUrl],
        address: {
          "@type": "PostalAddress",
          ...HOTEL_ADDRESS,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: HOTEL_GEO.latitude,
          longitude: HOTEL_GEO.longitude,
        },
        hasMap: "https://maps.app.goo.gl/71EH9gqP3kGgsMAB6",
        sameAs: [INSTAGRAM_URL, YOUTUBE_URL],
        starRating: {
          "@type": "Rating",
          ratingValue: 5,
          bestRating: 5,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${home}#webpage`,
        url: home,
        name: SITE_NAME,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#hotel` },
        inLanguage: locale,
        primaryImageOfPage: photoUrl,
      },
    ],
  };
}

export function pageJsonLd({
  locale,
  path,
  name,
  description,
  crumbs,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
  crumbs: { name: string; path: string }[];
}): JsonLdNode {
  const url = canonicalUrl(locale, path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#hotel` },
        inLanguage: locale,
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: canonicalUrl(locale, crumb.path),
        })),
      },
    ],
  };
}
