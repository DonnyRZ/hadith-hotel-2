import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { BeSearchForm } from "@/components/be-forms/BeSearchForm";
import { GuestRegistrationForm } from "@/components/GuestRegistrationForm";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("guestRegistration");
  return pageMetadata({
    locale,
    path: "/guest-registration",
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  });
}

export default async function GuestRegistrationPage() {
  const locale = await getLocale();

  return (
    <>
      <BeSearchForm beLocale={locale} />
      <main className="content-page guest-registration-page">
        <GuestRegistrationForm />
      </main>
    </>
  );
}
