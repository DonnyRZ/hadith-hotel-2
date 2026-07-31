"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  fetchGeographicBreakdown,
  type GeographicBreakdown,
  type GeographicMetric,
} from "@/lib/siteMetrics";

export type GeographicMetricKind = "downloads" | "visitors";

type GeographicBreakdownModalProps = {
  metric: GeographicMetricKind | null;
  onClose: () => void;
};

type GeographicDialogProps = {
  metric: GeographicMetricKind;
  onClose: () => void;
};

const copy = {
  downloads: {
    title: "Profile Downloads",
    description: "Approximate locations of anonymous profile downloaders",
  },
  visitors: {
    title: "Profile Visitors",
    description: "Approximate locations of anonymous website visitors",
  },
} as const;

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-5.35 6-11a6 6 0 1 0-12 0c0 5.65 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetricRows({ items }: { items: GeographicMetric[] }) {
  const maximum = Math.max(...items.map((item) => item.count), 1);

  if (items.length === 0) {
    return <p className="geography-modal__empty">No classified location data yet.</p>;
  }

  return (
    <ol className="geography-modal__rows">
      {items.map((item, index) => (
        <li key={`${item.name}-${item.context ?? ""}`} className="geography-modal__row">
          <span className="geography-modal__rank">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="geography-modal__place">
            <span>{item.name}</span>
            {item.context && item.context !== item.name ? (
              <small>{item.context}</small>
            ) : null}
          </span>
          <span className="geography-modal__bar" aria-hidden="true">
            <span style={{ width: `${(item.count / maximum) * 100}%` }} />
          </span>
          <span className="geography-modal__count">{item.count}</span>
        </li>
      ))}
    </ol>
  );
}

function MetricSection({
  title,
  items,
}: {
  title: string;
  items: GeographicMetric[];
}) {
  return (
    <section className="geography-modal__section">
      <h3 className="geography-modal__section-title">
        <LocationIcon />
        <span>{title}</span>
      </h3>
      <MetricRows items={items} />
    </section>
  );
}

function GeographicDialog({
  metric,
  onClose,
}: GeographicDialogProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [data, setData] = useState<GeographicBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    void fetchGeographicBreakdown(metric).then((result) => {
      if (!active) return;
      setData(result);
      setLoading(false);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      active = false;
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [metric, onClose]);

  const labels = copy[metric];

  return createPortal(
    <div className="geography-modal" role="presentation">
      <button
        type="button"
        className="geography-modal__backdrop"
        aria-label="Close geographic breakdown"
        onClick={onClose}
      />
      <div
        className="geography-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeRef}
          type="button"
          className="geography-modal__close"
          aria-label="Close geographic breakdown"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <header className="geography-modal__header">
          <p className="geography-modal__eyebrow">Geographic Breakdown</p>
          <h2 id={titleId} className="geography-modal__title">
            {labels.title}
          </h2>
          <p className="geography-modal__description">{labels.description}</p>
          <p className="geography-modal__total">
            Total recorded: <strong>{data?.totalRecorded ?? "—"}</strong>
          </p>
        </header>

        {loading ? (
          <p className="geography-modal__loading">Loading geographic data…</p>
        ) : data ? (
          <div className="geography-modal__content">
            <MetricSection title="Top Cities" items={data.topCities} />
            <MetricSection title="Top Provinces / Regions" items={data.topRegions} />
            <MetricSection title="Top Countries" items={data.topCountries} />
            {data.unclassified > 0 ? (
              <p className="geography-modal__unclassified">
                {data.unclassified} unique IP {data.unclassified === 1 ? "location is" : "locations are"} not yet classified.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="geography-modal__loading">
            Geographic data is temporarily unavailable.
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function GeographicBreakdownModal({
  metric,
  onClose,
}: GeographicBreakdownModalProps) {
  return metric ? (
    <GeographicDialog key={metric} metric={metric} onClose={onClose} />
  ) : null;
}
