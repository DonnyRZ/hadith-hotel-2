import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { BeBookingForm } from "@/components/be-forms/BeBookingForm";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, pageJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("booking");
  return pageMetadata({
    locale,
    path: "/booking",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function BookingPage() {
  const locale = await getLocale();
  const t = await getTranslations("booking");

  return (
    <>
      <JsonLd
        data={pageJsonLd({
          locale,
          path: "/booking",
          name: t("metaTitle"),
          description: t("metaDescription"),
          crumbs: [
            { name: SITE_NAME, path: "/" },
            { name: t("metaTitle"), path: "/booking" },
          ],
        })}
      />
      <main className="booking-page">
        <header className="booking-page__intro">
          <p className="booking-page__eyebrow">{t("eyebrow")}</p>
          <h1 className="booking-page__title">{t("title")}</h1>
        </header>

        <BeBookingForm beLocale={locale}/>
      </main>
    </>
  );
}
