// The opening slide: where the August 2026 sign-ups went, before walking the journey.
// Everyone who signed up between 1 and 31 August 2026, followed to 21 September, from
// production. Channel figures are the same sign-ups as read on 10 September.
import React, { useLayoutEffect, useRef, useState } from "react";

/** The slide is laid out on a fixed canvas and scaled to fit the frame, like a deck. */
const CANVAS_W = 920;
const CANVAS_H = 610;

function SlideCanvas({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) setScale(Math.min(width / CANVAS_W, height / CANVAS_H));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={outer} className="proto-viewport-outer proto-slide-outer">
      {scale > 0 && (
        <div
          className="proto-slide"
          style={{ width: CANVAS_W, height: CANVAS_H, transform: `translate(-50%, -50%) scale(${scale})` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

const SIGNUPS = 14398;

/** How many of every 100 sign-ups reached each point. */
const FUNNEL: { label: string; people: number }[] = [
  { label: "Signed up", people: 14398 },
  { label: "Agreed to the terms and started", people: 12026 },
  { label: "Entered a business PAN", people: 9160 },
  { label: "Finished business details", people: 6074 },
  { label: "Verified Aadhaar", people: 5287 },
  { label: "Added a bank account", people: 5105 },
  { label: "Submitted for checks", people: 3957 },
  { label: "Accounts ready", people: 3393 },
  { label: "Received a first payment", people: 2059 },
];

/** August sign-ups by where they came from, and how many reached accounts ready. */
const CHANNELS: { name: string; signups: number; ready: number }[] = [
  { name: "Google", signups: 7677, ready: 1644 },
  { name: "Untagged (direct, word of mouth)", signups: 2221, ready: 644 },
  { name: "Facebook and Instagram", signups: 2497, ready: 174 },
  { name: "Referral", signups: 692, ready: 417 },
  { name: "Other tagged sources", signups: 662, ready: 382 },
  { name: "Blogs", signups: 649, ready: 73 },
];

const r10 = (n: number) => (Math.round(n / 10) * 10).toLocaleString("en-IN");
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)}%`;
const per100 = (n: number) => Math.round((n / SIGNUPS) * 100);

export function FunnelSlide() {
  return (
    <SlideCanvas>
      <div className="proto-slide-inner">
        <p className="proto-slide-eyebrow">The funnel · August 2026</p>
        <h1 className="proto-slide-title">Where August's sign-ups went</h1>

        <div className="proto-slide-stats">
          <div className="proto-slide-stat">
            <strong>{r10(SIGNUPS)}</strong>
            <span>people signed up in August</span>
          </div>
          <div className="proto-slide-stat">
            <strong>{r10(3393)}</strong>
            <span>got accounts: {per100(3393)} of every 100 who signed up</span>
          </div>
          <div className="proto-slide-stat">
            <strong>{r10(2059)}</strong>
            <span>received a first payment: {pct(2059, 3393)} of those with accounts</span>
          </div>
          <div className="proto-slide-stat">
            <strong>{pct(1275 + 1280, 3393)}</strong>
            <span>of new accounts are freelancers and sole proprietors</span>
          </div>
        </div>

        <div className="proto-slide-cols">
          <section className="proto-slide-card">
            <h2>Out of every 100 sign-ups</h2>
            <ol className="proto-slide-funnel">
              {FUNNEL.map((s) => {
                const n = per100(s.people);
                return (
                  <li key={s.label}>
                    <span className="proto-slide-funnel-label">{s.label}</span>
                    <span className="proto-slide-funnel-bar">
                      <span style={{ width: `${n}%` }} />
                    </span>
                    <span className="proto-slide-funnel-num">{n}</span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="proto-slide-card">
            <h2>Where they came from</h2>
            <table className="proto-slide-table">
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Sign-ups</th>
                  <th>Got accounts</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map((c) => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td>{r10(c.signups)}</td>
                    <td>{r10(c.ready)}</td>
                    <td>{pct(c.ready, c.signups)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="proto-slide-callout">Google brings half the new accounts; referrals convert 8x Facebook.</p>
          </section>
        </div>

        <p className="proto-slide-foot">
          Who signs up: 41% freelancers, 14% sole proprietors, and 37% leave before entering a PAN. Everyone who signed
          up 1 to 31 August 2026, followed to 21 September (channels read 10 September), rounded to the nearest 10.
        </p>
      </div>
    </SlideCanvas>
  );
}
