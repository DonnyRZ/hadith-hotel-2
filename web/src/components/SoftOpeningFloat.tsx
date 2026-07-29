"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hadith-soft-opening-dismissed";

type SoftOpeningFloatProps = {
  className?: string;
};

export function SoftOpeningFloat({ className = "" }: SoftOpeningFloatProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    setVisible(true);
  }, []);

  const dismiss = () => {
    setLeaving(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setVisible(false), 320);
  };

  if (!visible) return null;

  return (
    <div
      className={`soft-float${leaving ? " is-leaving" : ""} ${className}`.trim()}
      role="status"
      aria-label="Soft Opening September 5th 2026"
    >
      <div className="soft-float__mover">
        <div className="soft-float__card">
          <span className="soft-float__pulse" aria-hidden="true" />
          <div className="soft-float__copy">
            <p className="soft-float__eyebrow">Announcement</p>
            <p className="soft-float__title">Soft Opening September 5th 2026</p>
          </div>
          <button
            type="button"
            className="soft-float__close"
            aria-label="Dismiss soft opening announcement"
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
