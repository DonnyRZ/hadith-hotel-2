"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "hadith-soft-opening-dismissed";

const subscribeToDismissal = () => () => {};

function wasDismissed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

type SoftOpeningFloatProps = {
  className?: string;
};

export function SoftOpeningFloat({ className = "" }: SoftOpeningFloatProps) {
  const t = useTranslations("common.softOpening");
  const dismissedBefore = useSyncExternalStore(
    subscribeToDismissal,
    wasDismissed,
    () => true,
  );
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const dismiss = () => {
    setLeaving(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setVisible(false), 320);
  };

  if (dismissedBefore || !visible) return null;

  return (
    <div
      className={`soft-float${leaving ? " is-leaving" : ""} ${className}`.trim()}
      role="status"
      aria-label={t("title")}
    >
      <div className="soft-float__mover">
        <div className="soft-float__card">
          <span className="soft-float__pulse" aria-hidden="true" />
          <div className="soft-float__copy">
            <p className="soft-float__eyebrow">{t("announcement")}</p>
            <p className="soft-float__title">{t("title")}</p>
          </div>
          <button
            type="button"
            className="soft-float__close"
            aria-label={t("dismiss")}
            onClick={dismiss}
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
