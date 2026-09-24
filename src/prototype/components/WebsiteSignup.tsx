// Sign-up as most new customers meet it: on skydo.com, not on the Skydo login page.
// The website is not part of the product codebase, so this is a replica built from
// screenshots of the live site: the home page, the Get Started form (name and mobile),
// then the email box and the email code that follow it in the same popup.
//
// Nothing here is sent anywhere. Fields follow the prototype's tap-to-fill rule.
import React, { useEffect, useRef, useState } from "react";
import SkydoLogoBig from "../../skydo/components/Icons/SkydoLogoBig";
import { SAMPLE } from "../../mocks/fixtures";
import { usePrototype } from "../state";

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

/** Which popup is open over the page. */
type Popup = "none" | "form" | "email" | "otp";

function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Close({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="ws-close" onClick={onClick} aria-label="Close">
      <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function Header({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <header className="ws-header">
      <SkydoLogoBig height={34} width={118} />
      <nav className="ws-nav">
        <span className="is-active">Receive from Client</span>
        <span>Receive from Platforms</span>
        <span>Receive from Amazon</span>
      </nav>
      <div className="ws-header-right">
        <span className="ws-login">Login</span>
        <button type="button" className="ws-btn-outline" onClick={onGetStarted}>
          Get Started <Arrow />
        </button>
      </div>
    </header>
  );
}

/** The FX calculator on the right of the home page, at the values in the capture. */
function Calculator() {
  return (
    <div className="ws-calc">
      <div className="ws-calc-top">
        Accept payment from 150+ countries
        <img src={asset("website/flags-top.png")} alt="" style={{ width: 97, height: 18 }} />
      </div>
      <div className="ws-calc-body">
        <div className="ws-calc-row">
          <div className="ws-box ws-currency">
            <img src={asset("website/flag-us.png")} alt="" style={{ width: 30, height: 22 }} />
            <strong>USD</strong>
            <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div className="ws-box ws-grow">
            <span className="ws-box-label">Client pays</span>
            <span className="ws-box-value">7000</span>
          </div>
        </div>
        <div className="ws-box ws-method">
          <span className="ws-box-label">Your payment method</span>
          <span className="ws-method-value">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2.5 12h19M12 2.5c2.8 3 2.8 16 0 19M12 2.5c-2.8 3-2.8 16 0 19" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Global Bank Account
            <svg className="ws-chev" width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <div className="ws-slider">
          <div className="ws-slider-track">
            <span className="ws-slider-fill" />
            <span className="ws-slider-knob" />
          </div>
          <div className="ws-slider-marks">
            <span>500</span>
            <span>10K</span>
            <span>100K</span>
            <span>1M</span>
          </div>
        </div>
        <div className="ws-rate">
          <span className="ws-rate-line" />
          <span className="ws-rate-pill">
            <strong>1 USD = 95.975 INR</strong>
            <em>Live FX rate · 18:00</em>
          </span>
          <span className="ws-rate-line" />
        </div>
        <div className="ws-receive">
          <div className="ws-receive-head">
            <span>You'll receive</span>
            <span className="ws-inr">
              <img src={asset("website/flag-in.png")} alt="" style={{ width: 30, height: 22 }} /> INR
            </span>
          </div>
          <div className="ws-receive-cols">
            <div>
              <SkydoLogoBig height={20} width={69} />
              <strong className="ws-receive-big">₹ 6,68,541</strong>
            </div>
            <div className="ws-receive-other">
              <span>Indian Banks</span>
              <span>₹ 6,57,218</span>
              <span>
                You lose: <b>1.7% ↓</b>
              </span>
            </div>
            <div className="ws-receive-other">
              <span>Paypal</span>
              <span>₹ 6,10,071</span>
              <span>
                You lose: <b>8.7% ↓</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({ onSignUp }: { onSignUp: () => void }) {
  return (
    <div className="ws-hero">
      <div className="ws-hero-left">
        <h1>
          Receive international business payments.
          <br />
          Save <span className="ws-green">₹1,35,888</span> annually
        </h1>
        <p className="ws-sub">
          Get your Skydo account in 5 mins with <b>Zero FX margin, Flat fee, Instant FIRA</b>
        </p>
        <button type="button" className="ws-btn-primary ws-signup" onClick={onSignUp}>
          Sign up <Arrow />
        </button>
        <div className="ws-badges">
          <span>
            <img src={asset("rbi-colored.svg")} alt="" style={{ height: 28, width: "auto" }} /> RBI PA-CB authorized
          </span>
          <img src={asset("hdfc.svg")} alt="HDFC Bank" style={{ height: 24, width: "auto" }} />
          <span>
            <img src={asset("iso-colored.svg")} alt="" style={{ height: 28, width: "auto" }} /> ISO 27001 certified
          </span>
          <img src={asset("visa.svg")} alt="Visa" style={{ height: 20, width: "auto" }} />
        </div>
      </div>
      <Calculator />
    </div>
  );
}

/** Step one: the Get Started form, name and mobile number. */
function GetStartedForm({ onSubmit, onClose }: { onSubmit: () => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsApp, setWhatsApp] = useState(true);
  const ready = name.trim() !== "" && mobile.replace(/\D/g, "").length === 10;
  return (
    <div className="ws-modal ws-modal-form" role="dialog" aria-label="Get Started">
      <Close onClick={onClose} />
      <h2 className="ws-modal-title">Get Started</h2>
      <div className="ws-form-cols">
        <ul className="ws-benefits">
          <li>
            <img src={asset("website/icon-savings.png")} alt="" style={{ width: 64, height: 64 }} />
            <p>
              Save as much as ₹10 lakh annually with <b>Zero FX Margin</b>
            </p>
          </li>
          <li>
            <img src={asset("website/icon-accounts.png")} alt="" style={{ width: 61, height: 64 }} />
            <div>
              <p>
                Get <b>international bank accounts in 5 mins</b>
              </p>
              <img src={asset("website/flags-row.png")} alt="" style={{ width: 137, height: 21 }} />
            </div>
          </li>
          <li>
            <img src={asset("website/icon-tracking.png")} alt="" style={{ width: 64, height: 51 }} />
            <p>
              Real time <b>payment tracking</b> and <b>instant FIRA</b>
            </p>
          </li>
        </ul>
        <form
          className="ws-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) onSubmit();
          }}
        >
          <input className="ws-input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input
            className="ws-input"
            type="tel"
            placeholder="Mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <label className="ws-check">
            <input type="checkbox" checked={whatsApp} onChange={(e) => setWhatsApp(e.target.checked)} />
            Receive account updates on WhatsApp
          </label>
          <button type="submit" className="ws-btn-primary ws-btn-block" disabled={!ready}>
            Get Global Accounts
          </button>
          <p className="ws-demo">
            Want to learn more? <span>Book a demo</span>
          </p>
        </form>
      </div>
    </div>
  );
}

function Testimonial() {
  return (
    <div className="ws-testimonial-col">
      <div className="ws-testimonial">
        <p>“With Skydo, I am saving INR 10,000 per transaction!”</p>
        <div className="ws-person">
          <img src={asset("website/avatar.png")} alt="" style={{ width: 48, height: 48 }} />
          <div>
            <span>Tanay Shah</span>
            <span>Founder &amp; CEO at Pardy Panda Studios</span>
            <img src={asset("website/pardy-panda.png")} alt="" style={{ width: 76, height: 29 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Step two, first half: the email box that replaces the form in the same popup. */
function EmailBox({
  email,
  setEmail,
  onSend,
  onGoogle,
  onClose,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSend: () => void;
  onGoogle: () => void;
  onClose: () => void;
}) {
  const ready = /\S+@\S+\.\S+/.test(email);
  return (
    <div className="ws-modal ws-modal-split" role="dialog" aria-label="Get global accounts">
      <Testimonial />
      <form
        className="ws-login-col"
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) onSend();
        }}
      >
        <Close onClick={onClose} />
        <h2 className="ws-modal-title">Get global accounts</h2>
        {/* A stand-in: signing in with Google skips the email code and opens the terms screen. */}
        <button type="button" className="ws-btn-google" onClick={onGoogle}>
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          Log in with Google
        </button>
        <div className="ws-or">
          <span />
          OR
          <span />
        </div>
        <label className="ws-field-label" htmlFor="ws-email">
          Enter email
        </label>
        <input id="ws-email" className="ws-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" className="ws-btn-primary ws-btn-block" disabled={!ready}>
          Send OTP
        </button>
      </form>
    </div>
  );
}

/** Step two, second half: the six-digit email code. */
function CodeBox({ email, onEdit, onVerify, onClose }: { email: string; onEdit: () => void; onVerify: () => void; onClose: () => void }) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(59);
  const [busy, setBusy] = useState(false);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    boxes.current[0]?.focus();
    const t = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, []);

  // A whole code arriving in one box (as phone autofill does) is spread across the row.
  const onChange = (i: number, value: string) => {
    const typed = value.replace(/\D/g, "");
    if (!typed) return;
    setDigits((d) => {
      const next = [...d];
      typed.split("").forEach((ch, k) => {
        if (i + k < 6) next[i + k] = ch;
      });
      return next;
    });
    const last = Math.min(5, i + typed.length);
    boxes.current[last]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") return;
    setDigits((d) => {
      const next = [...d];
      if (next[i]) next[i] = "";
      else if (i > 0) next[i - 1] = "";
      return next;
    });
    if (!digits[i] && i > 0) boxes.current[i - 1]?.focus();
  };

  const ready = digits.every(Boolean);
  const verify = () => {
    if (!ready || busy) return;
    setBusy(true);
    window.setTimeout(onVerify, 600);
  };

  return (
    <div className="ws-modal ws-modal-split" role="dialog" aria-label="Enter the email code">
      <Testimonial />
      <div className="ws-login-col">
        <Close onClick={onClose} />
        <h2 className="ws-modal-title">
          Enter the OTP sent to
          <br />
          {email}
        </h2>
        <div className="ws-otp">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (boxes.current[i] = el)}
              className="ws-otp-box"
              inputMode="numeric"
              aria-label={`Enter OTP character ${i + 1}`}
              value={d}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
            />
          ))}
        </div>
        <p className="ws-otp-meta">
          {seconds > 0 ? `Resend OTP in 00:${String(seconds).padStart(2, "0")}` : <span className="ws-link">Resend OTP</span>}
        </p>
        <p className="ws-otp-meta">
          Wrong email?{" "}
          <button type="button" className="ws-link" onClick={onEdit}>
            edit here
          </button>
        </p>
        <button type="button" className="ws-btn-primary ws-btn-block" disabled={!ready || busy} onClick={verify}>
          {busy ? "Verifying…" : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}

/**
 * The skydo.com sign-up. "login" is the home page and the Get Started form;
 * "email-otp" is the email box and the code, in the same popup.
 */
export function WebsiteSignup({ step }: { step: "login" | "email-otp" }) {
  const set = usePrototype((s) => s.set);
  const [popup, setPopup] = useState<Popup>(step === "email-otp" ? "email" : "none");
  const [email, setEmail] = useState("");

  // Following the steps with the prototype's own controls lands on the right popup.
  useEffect(() => {
    if (step === "email-otp" && (popup === "none" || popup === "form")) setPopup("email");
    if (step === "login" && (popup === "email" || popup === "otp")) setPopup("form");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const close = () => {
    setPopup("none");
    if (step !== "login") set({ step: "login" });
  };

  return (
    <div className="ws-page">
      <Header onGetStarted={() => setPopup("form")} />
      <HomePage onSignUp={() => setPopup("form")} />
      {popup !== "none" && (
        <div className="ws-backdrop">
          {popup === "form" && (
            <GetStartedForm
              onClose={close}
              onSubmit={() => {
                setPopup("email");
                set({ step: "email-otp" });
              }}
            />
          )}
          {popup === "email" && <EmailBox
              email={email}
              setEmail={setEmail}
              onSend={() => setPopup("otp")}
              onGoogle={() => set({ step: "kyc-intro", variant: "" })}
              onClose={close}
            />}
          {popup === "otp" && (
            <CodeBox
              email={email || SAMPLE.email}
              onEdit={() => setPopup("email")}
              onVerify={() => set({ step: "kyc-intro", variant: "" })}
              onClose={close}
            />
          )}
        </div>
      )}
    </div>
  );
}
