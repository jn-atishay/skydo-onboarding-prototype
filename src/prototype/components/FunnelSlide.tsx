// The opening slide: where the August 2026 leads went, before walking the journey.
// Everyone who signed up between 1 and 31 August 2026 (a lead and a sign-up are the same
// thing here), followed to 21 September, from production.
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

const LEADS = 14398;
const ONBOARDED = 3395;
const ACTIVATED = 978;

/** How many of every 100 leads reached each step. */
const FUNNEL: { label: string; people: number }[] = [
  { label: "Signup", people: LEADS },
  { label: "PAN submitted", people: 9160 },
  { label: "Business details submitted", people: 6074 },
  { label: "Aadhaar verified", people: 5288 },
  { label: "Bank account linked", people: 5106 },
  { label: "Docs uploaded", people: 3958 },
  { label: "Onboarding completed", people: ONBOARDED },
  { label: "Activated", people: ACTIVATED },
];

/** August onboardings by the channel the lead came from. */
const CHANNELS: { name: string; onboardings: number }[] = [
  { name: "Google", onboardings: 1691 },
  { name: "Organic (SEO, blogs, word of mouth)", onboardings: 703 },
  { name: "Referrals", onboardings: 426 },
  { name: "Others", onboardings: 398 },
  { name: "Meta (Facebook, Instagram)", onboardings: 177 },
];

const r10 = (n: number) => (Math.round(n / 10) * 10).toLocaleString("en-IN");
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)}%`;
const per100 = (n: number) => Math.round((n / LEADS) * 100);

/** Whole-number shares that add up to exactly 100 (largest remainder). */
function shares(values: number[]): number[] {
  const total = values.reduce((a, b) => a + b, 0);
  const raw = values.map((v) => (v / total) * 100);
  const out = raw.map(Math.floor);
  const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]);
  const missing = 100 - out.reduce((a, b) => a + b, 0);
  for (let k = 0; k < missing; k++) out[order[k][1]] += 1;
  return out;
}

export function FunnelSlide() {
  const channelShares = shares(CHANNELS.map((c) => c.onboardings));
  const top = Math.max(...channelShares);
  return (
    <SlideCanvas>
      <div className="proto-slide-inner">
        <p className="proto-slide-eyebrow">The funnel · August 2026</p>
        <h1 className="proto-slide-title">Where August's leads went</h1>

        <div className="proto-slide-stats">
          <div className="proto-slide-stat">
            <strong>{r10(LEADS)}</strong>
            <span>leads signed up in August</span>
          </div>
          <div className="proto-slide-stat">
            <strong>{r10(ONBOARDED)}</strong>
            <span>onboardings: {per100(ONBOARDED)} of every 100 leads</span>
          </div>
          <div className="proto-slide-stat">
            <strong>{r10(ACTIVATED)}</strong>
            <span>activated: {pct(ACTIVATED, ONBOARDED)} of onboardings received a first client payment</span>
          </div>
          <div className="proto-slide-stat">
            <strong>{pct(1275 + 1280, 3393)}</strong>
            <span>of onboardings are freelancers and sole proprietors</span>
          </div>
        </div>

        <div className="proto-slide-cols">
          <section className="proto-slide-card">
            <h2>Out of every 100 leads</h2>
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
            <h2>Onboardings by channel</h2>
            <ol className="proto-slide-funnel proto-slide-channels">
              {CHANNELS.map((c, i) => (
                <li key={c.name}>
                  <span className="proto-slide-funnel-label">{c.name}</span>
                  <span className="proto-slide-funnel-bar">
                    <span style={{ width: `${(channelShares[i] / top) * 100}%` }} />
                  </span>
                  <span className="proto-slide-channel-num">
                    <strong>{channelShares[i]}%</strong> {r10(c.onboardings)}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <p className="proto-slide-foot">
          Everyone who signed up 1 to 31 August 2026, followed to 21 September, rounded to the nearest 10. Docs uploaded
          counts everyone who went on to the checks (companies and LLPs have no documents step). Activated means a first
          payment from a client, not the free test payment.
        </p>
      </div>
    </SlideCanvas>
  );
}
