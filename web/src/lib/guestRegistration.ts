/** Shared shape, constants, and validation for the guest registration form. Pure — safe for client + server. */

export const COMPANIONS_DROPDOWN_MAX = 10;
export const COMPANIONS_COUNT_HARD_CAP = 500;
/** Minimum time (ms) a real visitor needs before submitting; filters instant bot posts. */
export const MIN_SUBMIT_DELAY_MS = 1500;

export type GuestRegistrationPayload = {
  name: string;
  surname: string;
  position: string;
  phone: string;
  email: string;
  arrivalDate: string;
  hasCompanions: boolean;
  companionsCount: number;
  locale: string;
  honeypot: string;
  renderedAt: number;
};

export type GuestRegistrationErrors = Partial<
  Record<keyof GuestRegistrationPayload, string>
>;

export type GuestRegistrationValidationResult =
  | {
      valid: true;
      data: {
        name: string;
        surname: string;
        position: string;
        phone: string;
        email: string;
        arrivalDate: Date;
        hasCompanions: boolean;
        companionsCount: number;
        totalGuests: number;
        locale: string;
      };
    }
  | { valid: false; errors: GuestRegistrationErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s\-().]{5,24}$/;
const SUPPORTED_LOCALES = ["en", "id", "ru", "uz"];

function trimmed(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isPlausibleArrivalDate(date: Date): boolean {
  if (Number.isNaN(date.getTime())) return false;
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const threeYearsMs = 3 * 365 * oneDayMs;
  return date.getTime() >= now - oneDayMs && date.getTime() <= now + threeYearsMs;
}

export function validateGuestRegistration(
  raw: Partial<GuestRegistrationPayload>,
): GuestRegistrationValidationResult {
  const errors: GuestRegistrationErrors = {};

  const name = trimmed(raw.name, 80);
  if (!name) errors.name = "required";

  const surname = trimmed(raw.surname, 80);
  if (!surname) errors.surname = "required";

  const position = trimmed(raw.position, 120);
  if (!position) errors.position = "required";

  const phone = trimmed(raw.phone, 32);
  if (!phone || !PHONE_PATTERN.test(phone)) errors.phone = "invalid";

  const email = trimmed(raw.email, 160).toLowerCase();
  if (!email || !EMAIL_PATTERN.test(email)) errors.email = "invalid";

  const arrivalDate = new Date(trimmed(raw.arrivalDate, 32));
  if (!isPlausibleArrivalDate(arrivalDate)) errors.arrivalDate = "invalid";

  const hasCompanions = Boolean(raw.hasCompanions);
  let companionsCount = 0;
  if (hasCompanions) {
    const parsed = Number(raw.companionsCount);
    if (
      !Number.isFinite(parsed) ||
      !Number.isInteger(parsed) ||
      parsed < 1 ||
      parsed > COMPANIONS_COUNT_HARD_CAP
    ) {
      errors.companionsCount = "invalid";
    } else {
      companionsCount = parsed;
    }
  }

  const locale = SUPPORTED_LOCALES.includes(String(raw.locale))
    ? String(raw.locale)
    : "en";

  if (typeof raw.honeypot === "string" && raw.honeypot.length > 0) {
    errors.honeypot = "bot";
  }

  const renderedAt = Number(raw.renderedAt);
  if (
    !Number.isFinite(renderedAt) ||
    Date.now() - renderedAt < MIN_SUBMIT_DELAY_MS
  ) {
    errors.renderedAt = "too_fast";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name,
      surname,
      position,
      phone,
      email,
      arrivalDate,
      hasCompanions,
      companionsCount,
      totalGuests: companionsCount + 1,
      locale,
    },
  };
}
