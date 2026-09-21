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

// Internal accounts and payees are left out throughout.
const LEADS = 13844;

/**
 * The headline: exporters whose first CC account was created in August (IST), and how
 * many of those have at least one successful transaction (dated by settlement date) as
 * of 21 September.
 */
const AUG_ONBOARDINGS = 3185;
const AUG_ACTIVATED = 825;

/**
 * How many of every 100 of August's leads reached each step, followed to 21 September.
 * Onboarding completed and Activated use the same rules as the headline.
 */
const FUNNEL: { label: string; people: number }[] = [
  { label: "Signup", people: LEADS },
  { label: "PAN submitted", people: 8633 },
  { label: "Business details submitted", people: 5550 },
  { label: "Aadhaar verified", people: 4772 },
  { label: "Bank account linked", people: 4592 },
  { label: "Docs uploaded", people: 3448 },
  { label: "Onboarding completed", people: 2897 },
  { label: "Activated", people: 711 },
];

/**
 * August onboardings by channel, from Zoho ("Onboardings previous month, by closing
 * date", utm source). The chart's shares imply about 3,105 in all; the sources it does
 * not label (about 308) are counted under Others.
 */
const CHANNELS: { name: string; onboardings: number }[] = [
  { name: "Google (paid)", onboardings: 758 },
  { name: "Meta (Facebook, Instagram)", onboardings: 574 },
  { name: "Referrals", onboardings: 447 },
  // google_search, chatgpt_ai_tools, blogs, word_of_mouth (an SEO source, if Zoho has
  // one, sits among the unlabelled sources under Others until its count is known)
  { name: "Organic (search, AI tools, blogs, word of mouth)", onboardings: 221 + 147 + 71 + 171 },
  { name: "Others (untagged, cold calls, rest)", onboardings: 266 + 142 + 308 },
];

const r10 = (n: number) => (Math.round(n / 10) * 10).toLocaleString("en-IN");
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
            <strong>{LEADS.toLocaleString("en-IN")}</strong>
            <span>leads signed up in August</span>
          </div>
          <div className="proto-slide-stat">
            <strong>{AUG_ONBOARDINGS.toLocaleString("en-IN")}</strong>
            <span>onboardings completed in August</span>
          </div>
          <div className="proto-slide-stat">
            <strong>{AUG_ACTIVATED.toLocaleString("en-IN")}</strong>
            <span>activated: {((AUG_ACTIVATED / AUG_ONBOARDINGS) * 100).toFixed(1)}% of August's onboardings have a successful transaction</span>
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
          Onboarding: first CC account created. Activated: at least one successful transaction. Headline: August's
          onboardings, activations among them to 21 September. Funnel: August's leads followed to 21 September; docs
          uploaded counts everyone who reached the checks. Internal accounts and payees excluded. Channels: Zoho, about
          3,100 onboardings closed in August, rounded to the nearest 10.
        </p>
      </div>
    </SlideCanvas>
  );
}
