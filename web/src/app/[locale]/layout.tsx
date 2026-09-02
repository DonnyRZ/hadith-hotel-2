import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VisitorTracker } from "@/components/VisitorTracker";
import { asset } from "@/lib/asset";
import { routing } from "@/i18n/routing";
import {
  BRAND_APPLE_ICON_PATH,
  BRAND_ICON_PATH,
  FAVICON_PATH,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
  openGraphLocale,
} from "@/lib/seo";
import "../globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Montserrat({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "common.metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    icons: {
      icon: [
        { url: FAVICON_PATH, sizes: "48x48", type: "image/x-icon" },
        { url: BRAND_ICON_PATH, sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: BRAND_APPLE_ICON_PATH, sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: openGraphLocale(locale),
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
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const decorArches = `url("${asset("/images/decor/architectural-arches.svg")}")`;

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} h-full`}
    >
      <body
        className="min-h-full antialiased"
        style={{ ["--decor-arches" as never]: decorArches }}
      >
        <NextIntlClientProvider>
          <VisitorTracker />
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
