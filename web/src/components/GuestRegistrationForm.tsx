"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  COMPANIONS_DROPDOWN_MAX,
  GUEST_REGISTRATION_SUCCESS_FLAG,
  type GuestRegistrationErrors,
} from "@/lib/guestRegistration";
import { CustomSelect } from "@/components/CustomSelect";
import { useRouter } from "@/i18n/navigation";

type CompanionsOption = "" | `${number}` | "other";

type FormState = {
  name: string;
  surname: string;
  position: string;
  phone: string;
  email: string;
  arrivalDate: string;
  hasCompanions: boolean;
  companionsOption: CompanionsOption;
  companionsOther: string;
  honeypot: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  surname: "",
  position: "",
  phone: "",
  email: "",
  arrivalDate: "",
  hasCompanions: false,
  companionsOption: "",
  companionsOther: "",
  honeypot: "",
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function resolveCompanionsCount(state: FormState): number | null {
  if (!state.hasCompanions) return 0;
  if (state.companionsOption === "other") {
    const parsed = Number(state.companionsOther);
    if (!Number.isInteger(parsed) || parsed < COMPANIONS_DROPDOWN_MAX + 1) {
      return null;
    }
    return parsed;
  }
  const parsed = Number(state.companionsOption);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return parsed;
}

export function GuestRegistrationForm() {
  const t = useTranslations("guestRegistration");
  const locale = useLocale();
  const router = useRouter();
  const renderedAtRef = useRef<number | null>(null);

  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<GuestRegistrationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(false);

  const companionsSelectOptions = useMemo(
    () => [
      ...Array.from({ length: COMPANIONS_DROPDOWN_MAX }, (_, index) => {
        const count = String(index + 1);
        return { value: count, label: count };
      }),
      { value: "other", label: t("companions.otherOption") },
    ],
    [t],
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  function validateClient(): GuestRegistrationErrors {
    const nextErrors: GuestRegistrationErrors = {};
    if (!form.name.trim()) nextErrors.name = "required";
    if (!form.surname.trim()) nextErrors.surname = "required";
    if (!form.position.trim()) nextErrors.position = "required";
    // Optional: blank is allowed, but a provided value must still be well-formed.
    const phoneValue = form.phone.trim();
    if (phoneValue && !/^[+\d][\d\s\-().]{5,24}$/.test(phoneValue)) {
      nextErrors.phone = "invalid";
    }
    const emailValue = form.email.trim();
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = "invalid";
    }
    if (!form.arrivalDate) nextErrors.arrivalDate = "invalid";
    if (form.hasCompanions && resolveCompanionsCount(form) === null) {
      nextErrors.companionsCount = "invalid";
    }
    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    const companionsCount = resolveCompanionsCount(form) ?? 0;
    setSubmitting(true);
    setServerError(false);

    try {
      const response = await fetch("/api/guest-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          surname: form.surname.trim(),
          position: form.position.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          arrivalDate: form.arrivalDate,
          hasCompanions: form.hasCompanions,
          companionsCount,
          locale,
          honeypot: form.honeypot,
          renderedAt: renderedAtRef.current ?? Date.now(),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          errors?: GuestRegistrationErrors;
        } | null;
        if (payload?.errors) {
          setErrors(payload.errors);
        } else {
          setServerError(true);
        }
        setSubmitting(false);
        return;
      }

      // Keep the button in its loading state until navigation actually
      // happens — the confirmation now lives in an overlay on the homepage.
      sessionStorage.setItem(GUEST_REGISTRATION_SUCCESS_FLAG, "1");
      router.push("/");
    } catch {
      setServerError(true);
      setSubmitting(false);
    }
  }

  return (
    <div className="guest-registration">
      <form
        className="guest-registration__form"
        onSubmit={handleSubmit}
        noValidate
      >
        <p className="guest-registration__eyebrow">{t("eyebrow")}</p>
        <h1 className="guest-registration__title">{t("title")}</h1>
        <p className="guest-registration__subtitle">{t("subtitle")}</p>

        <div
          className="guest-registration__honeypot"
          aria-hidden="true"
        >
          <label htmlFor="company-website">Company website</label>
          <input
            id="company-website"
            name="company-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.honeypot}
            onChange={(event) => updateField("honeypot", event.target.value)}
          />
        </div>

        <div className="guest-registration__row guest-registration__row--split">
          <Field
            id="name"
            label={t("fields.name.label")}
            error={errors.name}
            errorText={t("errors.required")}
          >
            <input
              id="name"
              type="text"
              autoComplete="given-name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </Field>
          <Field
            id="surname"
            label={t("fields.surname.label")}
            error={errors.surname}
            errorText={t("errors.required")}
          >
            <input
              id="surname"
              type="text"
              autoComplete="family-name"
              value={form.surname}
              onChange={(event) => updateField("surname", event.target.value)}
            />
          </Field>
        </div>

        <Field
          id="position"
          label={t("fields.position.label")}
          error={errors.position}
          errorText={t("errors.required")}
        >
          <input
            id="position"
            type="text"
            autoComplete="organization-title"
            value={form.position}
            onChange={(event) => updateField("position", event.target.value)}
          />
        </Field>

        <Field
          id="phone"
          label={t("fields.phone.label")}
          error={errors.phone}
          errorText={t("errors.invalidPhone")}
        >
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </Field>

        <Field
          id="email"
          label={t("fields.email.label")}
          error={errors.email}
          errorText={t("errors.invalidEmail")}
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </Field>

        <Field
          id="arrivalDate"
          label={t("fields.arrivalDate.label")}
          error={errors.arrivalDate}
          errorText={t("errors.invalidDate")}
        >
          <input
            id="arrivalDate"
            type="date"
            min={todayIso()}
            value={form.arrivalDate}
            onChange={(event) => updateField("arrivalDate", event.target.value)}
          />
        </Field>

        <fieldset className="guest-registration__companions">
          <legend className="guest-registration__label">
            {t("companions.question")}
          </legend>
          <div
            className="guest-registration__toggle"
            role="radiogroup"
            aria-label={t("companions.question")}
          >
            <button
              type="button"
              className={
                !form.hasCompanions
                  ? "guest-registration__toggle-btn guest-registration__toggle-btn--active"
                  : "guest-registration__toggle-btn"
              }
              aria-pressed={!form.hasCompanions}
              onClick={() =>
                setForm((previous) => ({ ...previous, hasCompanions: false }))
              }
            >
              {t("companions.no")}
            </button>
            <button
              type="button"
              className={
                form.hasCompanions
                  ? "guest-registration__toggle-btn guest-registration__toggle-btn--active"
                  : "guest-registration__toggle-btn"
              }
              aria-pressed={form.hasCompanions}
              onClick={() =>
                setForm((previous) => ({ ...previous, hasCompanions: true }))
              }
            >
              {t("companions.yes")}
            </button>
          </div>

          <div
            className={
              form.hasCompanions
                ? "guest-registration__companions-detail guest-registration__companions-detail--open"
                : "guest-registration__companions-detail"
            }
          >
            <Field
              id="companionsCount"
              label={t("companions.countLabel")}
              error={errors.companionsCount}
              errorText={t("errors.invalidCompanions")}
            >
              <CustomSelect
                id="companionsCount"
                value={form.companionsOption}
                onChange={(nextValue) =>
                  updateField(
                    "companionsOption",
                    nextValue as CompanionsOption,
                  )
                }
                options={companionsSelectOptions}
                placeholder={t("companions.selectPlaceholder")}
                invalid={Boolean(errors.companionsCount)}
              />
            </Field>

            {form.companionsOption === "other" && (
              <Field
                id="companionsOther"
                label={t("companions.otherLabel")}
                error={
                  form.companionsOption === "other"
                    ? errors.companionsCount
                    : undefined
                }
                errorText={t("errors.invalidCompanions")}
              >
                <input
                  id="companionsOther"
                  type="number"
                  min={COMPANIONS_DROPDOWN_MAX + 1}
                  value={form.companionsOther}
                  onChange={(event) =>
                    updateField("companionsOther", event.target.value)
                  }
                />
              </Field>
            )}
          </div>
        </fieldset>

        {serverError && (
          <p className="guest-registration__server-error" role="alert">
            {t("errors.generic")}
          </p>
        )}

        <button
          type="submit"
          className={
            submitting
              ? "guest-registration__submit is-loading"
              : "guest-registration__submit"
          }
          disabled={submitting}
        >
          <span className="guest-registration__submit-label">
            {t("submit")}
          </span>
          <span className="guest-registration__submit-spinner" aria-hidden="true" />
          {submitting && <span className="sr-only">{t("submitting")}</span>}
        </button>
      </form>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  errorText: string;
  children: React.ReactNode;
};

function Field({ id, label, error, errorText, children }: FieldProps) {
  return (
    <div className="guest-registration__field">
      <label htmlFor={id} className="guest-registration__label">
        {label}
      </label>
      {children}
      {error && (
        <p className="guest-registration__field-error" role="alert">
          {errorText}
        </p>
      )}
    </div>
  );
}
