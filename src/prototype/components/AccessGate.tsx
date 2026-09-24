// The first screen anyone sees: a work email check before the deck opens.
//
// This is a courtesy gate, not security. The site is public and everything it shows
// ships in the page itself, so anyone determined can get past it. It keeps casual
// visitors out and makes clear the deck is internal.
//
// Only a yes/no flag is remembered in this browser; the email itself is never stored
// or sent anywhere.
import React, { useState } from "react";
import SkydoLogoBig from "../../skydo/components/Icons/SkydoLogoBig";

const KEY = "skydo-proto-access";

function hasAccess(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function rememberAccess() {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    // Private windows can refuse storage; the gate simply asks again next time.
  }
}

/** A Skydo work address: something before the @, and exactly the skydo.com domain. */
function isSkydoEmail(value: string) {
  return /^[^\s@]+@skydo\.com$/i.test(value.trim());
}

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(hasAccess);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  if (open) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSkydoEmail(email)) {
      rememberAccess();
      setOpen(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={submit} noValidate>
        <SkydoLogoBig height={36} width={125} />
        <h1>Onboarding walkthrough</h1>
        <p className="gate-sub">Enter your work email to continue.</p>
        <label className="gate-label" htmlFor="gate-email">
          Work email
        </label>
        <input
          id="gate-email"
          className={`gate-input ${error ? "has-error" : ""}`}
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="name@skydo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          aria-invalid={error}
          aria-describedby={error ? "gate-error" : undefined}
        />
        {error && (
          <p id="gate-error" className="gate-error" role="alert">
            Only for Skydo employees
          </p>
        )}
        <button type="submit" className="gate-btn" disabled={!email.trim()}>
          Continue
        </button>
      </form>
    </div>
  );
}
