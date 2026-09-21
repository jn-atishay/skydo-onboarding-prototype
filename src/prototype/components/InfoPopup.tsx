// The (i) button that sits on every screen, and the panel it opens.
import React, { useEffect } from "react";
import { Funnel, PERIOD, SCREEN_INFO } from "../content";

export function InfoButton({ onClick, label = "Why this screen exists" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className="proto-info-btn" onClick={onClick} aria-label={label} title={label}>
      i
    </button>
  );
}

export function InfoPanel({
  screenId,
  onClose,
}: {
  screenId: string;
  onClose: () => void;
}) {
  const info = SCREEN_INFO[screenId];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!info) return null;

  return (
    <div className="proto-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="proto-modal"
        role="dialog"
        aria-modal="true"
        aria-label={info.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="proto-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="proto-modal-title">{info.title}</h2>

        <section className="proto-modal-section">
          <h3>Why this screen exists</h3>
          {info.why.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </section>

        <FunnelNumbers funnel={info.funnel} />
      </div>
    </div>
  );
}

const round10 = (n: number) => Math.round(n / 10) * 10;
const fmt = (n: number) => round10(n).toLocaleString("en-IN");

/** August on this screen: how many arrived, went on and left, and why they leave. */
function FunnelNumbers({ funnel }: { funnel: Funnel }) {
  const { landed, moved, movedMeans, scope, reasons, hideNote } = funnel;
  const forward = Math.round((moved / landed) * 100);
  const rows: [string, string][] = [
    ["Landed on this screen", fmt(landed)],
    ["Moved ahead", fmt(moved)],
    ["Dropped off", fmt(landed - moved)],
    ["Moved forward", `${forward}%`],
    ["Dropped off", `${100 - forward}%`],
  ];
  return (
    <section className="proto-modal-section">
      <h3>August 2026, per month</h3>
      <dl className="proto-funnel">
        {rows.map(([k, v], i) => (
          <div key={i} className={`proto-funnel-row ${i === 2 || i === 4 ? "is-drop" : ""}`}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <h3 className="proto-funnel-why">Why people drop off here</h3>
      <ul>
        {reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      {!hideNote && (
        <p className="proto-modal-source">
          Moved ahead means {movedMeans}. {scope ? `${scope} ` : ""}
          {PERIOD}
        </p>
      )}
    </section>
  );
}

/** A second, smaller popup used for the PAN fourth-letter rule. */
export function RulePanel({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="proto-modal-backdrop" onClick={onClose} role="presentation">
      <div className="proto-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="proto-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="proto-modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
