"use client";

import { useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";

type ComingSoonModalProps = {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  body?: string;
};

export function ComingSoonModal({
  open,
  onClose,
  eyebrow,
  body,
}: ComingSoonModalProps) {
  const t = useTranslations("common.comingSoon");
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="coming-soon" role="presentation">
      <button
        type="button"
        className="coming-soon__backdrop"
        aria-label={t("close")}
        onClick={onClose}
      />
      <div
        className="coming-soon__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <p className="coming-soon__eyebrow">{eyebrow ?? t("eyebrow")}</p>
        <h2 id={titleId} className="coming-soon__title">
          {t("title")}
        </h2>
        <p className="coming-soon__body">{body ?? t("body")}</p>
        <button
          ref={closeRef}
          type="button"
          className="coming-soon__close"
          onClick={onClose}
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
