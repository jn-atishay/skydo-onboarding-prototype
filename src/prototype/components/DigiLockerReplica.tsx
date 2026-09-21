// DigiLocker is a government service, so its screens are not part of the Skydo
// codebase and cannot be imported. These are static replicas, built from screenshots,
// so staff can see what the customer meets after they leave Skydo.
//
// They are deliberately marked as replicas, they accept no real input, and they send
// nothing anywhere: the Aadhaar and PIN boxes hold fixed sample digits and are
// read-only. Nothing here should ever be mistaken for the real DigiLocker.
import React from "react";

function ReplicaMark() {
  return (
    <div className="dl-replica-mark">
      Replica for training. Not the real DigiLocker, and it accepts no real details.
    </div>
  );
}

function DigiLockerWordmark({ small }: { small?: boolean }) {
  return (
    <div className={`dl-wordmark ${small ? "is-small" : ""}`}>
      {!small && <span className="dl-emblem" aria-hidden="true" />}
      {!small && <span className="dl-divider" aria-hidden="true" />}
      <span className="dl-logo-box" aria-hidden="true">
        <span className="dl-logo-lock" />
      </span>
      <span className="dl-wordmark-text">
        <strong>DigiLocker</strong>
        <em>Document Wallet to Empower Citizens</em>
      </span>
    </div>
  );
}

/** Step one: the Aadhaar number screen. */
export function DigiLockerAadhaar({ onNext }: { onNext: () => void }) {
  return (
    <div className="dl-page">
      <ReplicaMark />
      <DigiLockerWordmark />
      <div className="dl-card">
        <h2 className="dl-h2">Sign up</h2>
        <p className="dl-sub">It takes just a minute</p>

        <div className="dl-label-row">
          <span className="dl-label">Enter your Aadhaar Number</span>
          <span className="dl-aadhaar-mark" aria-hidden="true" />
        </div>

        <div className="dl-aadhaar-boxes">
          {["1234", "5678", "1891"].map((group, i) => (
            <input key={i} className="dl-aadhaar-input" value={group} readOnly tabIndex={-1} aria-label={`Sample Aadhaar group ${i + 1}`} />
          ))}
        </div>

        <p className="dl-note">DigiLocker uses Aadhaar to enable authentic document access</p>
        <button className="dl-btn-green" onClick={onNext}>
          Next
        </button>
      </div>
      <div className="dl-card-foot" aria-hidden="true" />
      <p className="dl-link">Try another way</p>
    </div>
  );
}

/** Step two: the security PIN screen. */
export function DigiLockerPin({ onNext }: { onNext: () => void }) {
  return (
    <div className="dl-page">
      <ReplicaMark />
      <DigiLockerWordmark />
      <div className="dl-card">
        <h2 className="dl-h2 dl-h2-tight">You are already registered with DigiLocker</h2>
        <p className="dl-sub">
          6 digit PIN provides extra security to your account with two factor authentication. Don&apos;t disclose your
          Security PIN to anyone.
        </p>
        <p className="dl-strong">Please enter your 6 digit Security PIN to Signin</p>

        <div className="dl-pin-row">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input key={i} className="dl-pin-box" value="•" readOnly tabIndex={-1} aria-label={`Sample PIN digit ${i + 1}`} />
          ))}
          <span className="dl-eye" aria-hidden="true" />
        </div>

        <p className="dl-link-inline">Forgot my PIN</p>
        <button className="dl-btn-green" onClick={onNext}>
          Done
        </button>
      </div>
      <div className="dl-card-foot" aria-hidden="true" />
    </div>
  );
}

/** Step three: the consent screen, which is where the customer picks Aadhaar Card. */
export function DigiLockerConsent({ onAllow, onDeny }: { onAllow: () => void; onDeny: () => void }) {
  const validity = new Date();
  validity.setDate(validity.getDate() + 30);
  const validityText = validity.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");

  return (
    <div className="dl-page dl-page-consent">
      <ReplicaMark />

      <div className="dl-consent-head">
        <DigiLockerWordmark small />
        <span className="dl-shield" aria-hidden="true">
          ✓
        </span>
        <span className="dl-skydo-chevron" aria-hidden="true" />
      </div>

      <div className="dl-card dl-card-wide">
        <p className="dl-consent-title">
          Please provide your consent to share the following with <strong>Skydo:</strong>
        </p>

        <div className="dl-docs-head">
          <span className="dl-caret" aria-hidden="true">
            ⌄
          </span>
          <span className="dl-docs-title">Issued Documents (3)</span>
          <span className="dl-selectall">
            Select all <span className="dl-cb dl-cb-dash" aria-hidden="true" />
          </span>
        </div>

        <ul className="dl-doc-list">
          <li>
            <span>Aadhaar Card ( XX1891 )</span>
            <span className="dl-cb dl-cb-on" aria-hidden="true">
              ✓
            </span>
          </li>
          <li>
            <span>Driving License ( XX075676 )</span>
            <span className="dl-cb" aria-hidden="true" />
          </li>
          <li>
            <span>PAN Verification Record ( XXJ0869A )</span>
            <span className="dl-cb" aria-hidden="true" />
          </li>
        </ul>

        <div className="dl-row">
          <span className="dl-row-icon" aria-hidden="true">
            👤
          </span>
          <div>
            <p className="dl-row-title">Profile information</p>
            <p className="dl-row-sub">Name, Date of Birth, Gender</p>
          </div>
        </div>

        <div className="dl-row">
          <span className="dl-row-icon" aria-hidden="true">
            🗓
          </span>
          <div className="dl-row-grow">
            <p className="dl-row-title">
              Consent validity date <span className="dl-row-muted">(Today + 30 days)</span>
            </p>
            <p className="dl-row-sub">{validityText}</p>
          </div>
          <span className="dl-row-edit">Edit ✎</span>
        </div>

        <div className="dl-row">
          <span className="dl-row-icon" aria-hidden="true">
            ?
          </span>
          <div className="dl-row-grow">
            <p className="dl-row-title">Purpose</p>
            <p className="dl-row-sub">Know Your Customer</p>
          </div>
          <span className="dl-caret" aria-hidden="true">
            ⌄
          </span>
        </div>

        <p className="dl-consent-note">Consent validity is subject to applicable laws.</p>
        <p className="dl-consent-note">
          By clicking &apos;Allow&apos;, you are giving consent to share with <strong>Skydo</strong> .
        </p>

        <div className="dl-actions">
          <button className="dl-btn-outline" onClick={onDeny}>
            Deny
          </button>
          <button className="dl-btn-blue" onClick={onAllow}>
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
