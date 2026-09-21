// The (i) button that sits on every screen, and the panel it opens.
import React, { useEffect } from "react";
import { PERIOD, SCREEN_INFO } from "../content";

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

        <section className="proto-modal-section">
          <h3>What the numbers say</h3>
          {info.numbers ? (
            <>
              <ul>
                {info.numbers.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
              <p className="proto-modal-source">{info.numbersNote ? `${info.numbersNote} ${PERIOD}` : PERIOD}</p>
            </>
          ) : (
            <p className="proto-modal-nodata">No data for this step yet.</p>
          )}
        </section>
      </div>
    </div>
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
