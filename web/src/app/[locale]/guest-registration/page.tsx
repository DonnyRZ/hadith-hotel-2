import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GuestRegistrationForm } from "@/components/GuestRegistrationForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guestRegistration");
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default function GuestRegistrationPage() {
  return (
    <main className="content-page guest-registration-page">
      <GuestRegistrationForm />
    </main>
  );
}
