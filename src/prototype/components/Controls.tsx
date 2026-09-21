// The prototype's own chrome: the step rail, the business-type bar and the
// back/next bar. None of this is part of the product.
import React from "react";
import { BUSINESS_TYPE_LIST, StepId, usePrototype } from "../state";
import { screensFor, indexOfStep, journeyLength, journeyNumber } from "../screens";

export function LeftRail({ onJump }: { onJump: (s: StepId) => void }) {
  const { step, businessType, railOpen, set } = usePrototype();
  const list = screensFor(businessType);

  return (
    <nav className={`proto-rail ${railOpen ? "" : "proto-rail-closed"}`} aria-label="Journey steps">
      <button
        className="proto-rail-toggle"
        onClick={() => set({ railOpen: !railOpen })}
        aria-label={railOpen ? "Collapse step list" : "Expand step list"}
        title={railOpen ? "Collapse" : "Expand"}
      >
        {railOpen ? "‹" : "›"}
      </button>

      {railOpen && (
        <>
          <p className="proto-rail-title">The journey</p>
          <ol className="proto-rail-list">
            {list.map((s) => (
              <li key={s.id}>
                <button
                  className={`proto-rail-item ${s.id === step ? "is-current" : ""} ${s.slide ? "is-slide" : ""}`}
                  onClick={() => onJump(s.id)}
                  aria-current={s.id === step ? "step" : undefined}
                >
                  <span className="proto-rail-num">{s.slide ? "★" : journeyNumber(s.id, businessType)}</span>
                  <span className="proto-rail-label">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="proto-rail-foot">
            A prototype for training. Sample data only, nothing here is a real account.
          </p>
        </>
      )}
    </nav>
  );
}

export function TopBar({
  variants,
  typeAware,
}: {
  variants?: { id: string; label: string }[];
  typeAware?: boolean;
}) {
  const { businessType, variant, jumpTo } = usePrototype();

  if (!typeAware && !variants) return null;

  return (
    <div className="proto-topbar">
      {typeAware && (
        <div className="proto-topbar-group">
          <span className="proto-topbar-label">Business type</span>
          <div className="proto-seg">
            {BUSINESS_TYPE_LIST.map((b) => (
              <button
                key={b.id}
                className={`proto-seg-btn ${businessType === b.id ? "is-on" : ""}`}
                onClick={() => jumpTo({ businessType: b.id })}
              >
                {b.short}
              </button>
            ))}
          </div>
        </div>
      )}

      {variants && (
        <div className="proto-topbar-group">
          <span className="proto-topbar-label">Variant</span>
          <div className="proto-seg">
            {variants.map((v) => (
              <button
                key={v.id || "default"}
                className={`proto-seg-btn ${variant === v.id ? "is-on" : ""}`}
                onClick={() => jumpTo({ variant: v.id })}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function BottomBar({
  onBack,
  onNext,
  onReset,
  hint,
}: {
  onBack: () => void;
  onNext: () => void;
  onReset: () => void;
  hint?: string;
}) {
  const { step, businessType } = usePrototype();
  const list = screensFor(businessType);
  const i = indexOfStep(step, businessType);

  return (
    <div className="proto-bottombar">
      <button className="proto-btn" onClick={onBack} disabled={i <= 0}>
        ← Back
      </button>

      <div className="proto-bottom-mid">
        <span className="proto-step-count">
          {journeyNumber(step, businessType) === null
            ? "Overview"
            : `Step ${journeyNumber(step, businessType)} of ${journeyLength(businessType)}`}
        </span>
        {hint && <span className="proto-hint">{hint}</span>}
      </div>

      <div className="proto-bottom-right">
        <button className="proto-btn proto-btn-ghost" onClick={onReset} title="Clear all prototype state">
          Reset
        </button>
        <button className="proto-btn proto-btn-primary" onClick={onNext} disabled={i >= list.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
