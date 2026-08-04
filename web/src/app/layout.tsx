import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VisitorTracker } from "@/components/VisitorTracker";
import { asset } from "@/lib/asset";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "HADITH Hotel",
    template: "%s | HADITH Hotel",
  },
  description:
    "HADITH Hotel — a five-star sanctuary within the Complex of Imam Al Bukhari in Samarkand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const decorArches = `url("${asset("/images/decor/architectural-arches.svg")}")`;

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body
        className="min-h-full antialiased"
        style={{ ["--decor-arches" as never]: decorArches }}
      >
        <VisitorTracker />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
