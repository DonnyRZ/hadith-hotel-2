import { defineRouting } from "next-intl/routing";

/**
 * Locale routing config — single source of truth for supported locales.
 * EN is the default (unprefixed, "as-needed"); ID, RU, UZ are additional and
 * prefixed (e.g. /id/..., /ru/..., /uz/...). Arabic (RTL) is a later phase.
 */
export const routing = defineRouting({
  locales: ["en", "id", "ru", "uz"],
  defaultLocale: "en",
  // "as-needed": default locale (en) stays unprefixed at "/", others are
  // prefixed ("/id/...", "/ru/...", "/uz/...").
  localePrefix: "as-needed",
  // Keep English as the hard default. Locale changes only via the language
  // switcher — do not redirect based on Accept-Language / browser prefs.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
