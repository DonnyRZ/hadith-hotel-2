"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  ru: "Русский",
  uz: "O‘zbekcha",
};

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z" />
    </svg>
  );
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common.languageSwitcher");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      ref={rootRef}
      className={`language-switcher${className ? ` ${className}` : ""}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className="language-switcher__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        disabled={isPending}
        onClick={() => setOpen((value) => !value)}
      >
        <GlobeIcon />
        <span>{locale.toUpperCase()}</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t("ariaLabel")}
          className="language-switcher__panel"
        >
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              role="menuitem"
              aria-current={loc === locale ? "true" : undefined}
              className={`language-switcher__option${
                loc === locale ? " is-active" : ""
              }`}
              onClick={() => switchTo(loc)}
            >
              {NATIVE_NAMES[loc]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
