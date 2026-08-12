"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { GUEST_REGISTRATION_SUCCESS_FLAG } from "@/lib/guestRegistration";

const subscribeNever = () => () => {};

function hasSuccessFlag() {
  try {
    return sessionStorage.getItem(GUEST_REGISTRATION_SUCCESS_FLAG) === "1";
  } catch {
    return false;
  }
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="guest-confirm__icon-svg"
      viewBox="0 0 64 64"
      width="52"
      height="52"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="guest-confirm__icon-ring"
        cx="32"
        cy="32"
        r="29"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        className="guest-confirm__icon-check"
        d="M20 33.5 28 41.5 44 23.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * On-brand confirmation shown on the homepage right after a guest submits
 * the (unlinked, hidden) registration form. Renders nothing until the
 * sessionStorage flag set by GuestRegistrationForm is found, then consumes
 * it so a page refresh doesn't bring the overlay back.
 */
export function GuestRegistrationThankYouOverlay() {
  const t = useTranslations("guestRegistration.thankYou");
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  // Server (and initial client hydration) always renders closed to avoid a
  // hydration mismatch; the real flag is only readable once mounted.
  const flagPresent = useSyncExternalStore(
    subscribeNever,
    hasSuccessFlag,
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);
  const open = flagPresent && !dismissed;

  useEffect(() => {
    if (!flagPresent) return;
    try {
      sessionStorage.removeItem(GUEST_REGISTRATION_SUCCESS_FLAG);
    } catch {
      /* ignore */
    }
  }, [flagPresent]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDismissed(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="guest-confirm" role="presentation">
      <button
        type="button"
        className="guest-confirm__backdrop"
        aria-label={t("close")}
        onClick={() => setDismissed(true)}
      />

      <div
        className="guest-confirm__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeRef}
          type="button"
          className="guest-confirm__close"
          aria-label={t("close")}
          onClick={() => setDismissed(true)}
        >
          <CloseIcon />
        </button>

        <span className="guest-confirm__icon" aria-hidden="true">
          <CheckIcon />
        </span>

        <p className="guest-confirm__eyebrow">{t("eyebrow")}</p>
        <h2 id={titleId} className="guest-confirm__title">
          {t("title")}
        </h2>
        <p className="guest-confirm__body">{t("body")}</p>
      </div>
    </div>
  );
}
