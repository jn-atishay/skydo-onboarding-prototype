// The prototype shell: routing, chrome, and the screen currently on show.
import React, { useCallback, useEffect, useState } from "react";
import { BUSINESS_TYPE_LIST, BusinessTypeId, StepId, usePrototype } from "./state";
import { SCREENS, screensFor, indexOfStep } from "./screens";
import { BottomBar, LeftRail, TopBar } from "./components/Controls";
import { InfoButton, InfoPanel } from "./components/InfoPopup";
import { useSeedProductStores } from "./useProductStores";
import { installTapToFill } from "./tapToFill";

// No field in the product screens takes typing: tap to fill a sample, tap to clear.
installTapToFill();
import { ScreenHost } from "./ScreenHost";
import { ScreenErrorBoundary } from "./components/ErrorBoundary";
import { notifyRouter } from "../shims/next-router";
import AppContext from "../skydo/context/AppContext";
// The product's components read colours from the resolved Tailwind theme, exactly as
// the real app does. theme.json is generated from the product's own tailwind config
// by scripts/gen-theme.cjs, which runs as part of the build.
import resolvedTheme from "./theme.json";

/** Hash shape: #/step/business-type/variant */
function parseHash(): { step?: StepId; businessType?: BusinessTypeId; variant?: string } {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [step, bt, variant] = raw.split("/");
  const known = SCREENS.some((s) => s.id === step);
  const knownBt = BUSINESS_TYPE_LIST.some((b) => b.id === bt);
  return {
    step: known ? (step as StepId) : undefined,
    businessType: knownBt ? (bt as BusinessTypeId) : undefined,
    variant: variant ? decodeURIComponent(variant) : "",
  };
}

export default function App() {
  const proto = usePrototype();
  const { step, businessType, variant, presenter, set, reset } = proto;
  const [infoOpen, setInfoOpen] = useState(false);
  const [booted, setBooted] = useState(false);

  useSeedProductStores();

  // --- URL <-> state ------------------------------------------------------
  useEffect(() => {
    const apply = () => {
      const h = parseHash();
      set({
        ...(h.step ? { step: h.step } : {}),
        ...(h.businessType ? { businessType: h.businessType } : {}),
        variant: h.variant ?? "",
      });
      notifyRouter();
    };
    apply();
    setBooted(true);
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!booted) return;
    const want = `#/${step}/${businessType}${variant ? "/" + encodeURIComponent(variant) : ""}`;
    if (window.location.hash !== want) {
      // pushState keeps browser back and forward working across steps.
      history.pushState(null, "", want);
      notifyRouter();
    }
  }, [step, businessType, variant, booted]);

  // --- keyboard -----------------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        set({ presenter: !usePrototype.getState().presenter });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [set]);

  const list = screensFor(businessType);
  const idx = indexOfStep(step, businessType);
  const def = SCREENS.find((s) => s.id === step) ?? SCREENS[0];

  // If a business type does not reach the current screen, fall back to the nearest one.
  useEffect(() => {
    if (idx === -1 && list.length) {
      set({ step: list[Math.min(list.length - 1, 0)].id });
    }
  }, [idx, list, set]);

  const go = useCallback(
    (delta: number) => {
      const l = screensFor(usePrototype.getState().businessType);
      const i = indexOfStep(usePrototype.getState().step, usePrototype.getState().businessType);
      const next = l[Math.max(0, Math.min(l.length - 1, i + delta))];
      if (next) set({ step: next.id, variant: "" });
    },
    [set]
  );

  const onReset = useCallback(() => {
    reset();
    history.pushState(null, "", "#/login/FREELANCER");
    notifyRouter();
  }, [reset]);

  return (
    <AppContext.Provider value={{ theme: resolvedTheme }}>
    <div className={`proto-root ${presenter ? "is-presenter" : ""}`}>
      {!presenter && <LeftRail onJump={(s) => set({ step: s, variant: "" })} />}

      <main className="proto-main">
        {!presenter && <TopBar variants={def.variants} typeAware={def.typeAware} />}

        <div className="proto-stage">
          <div className="proto-screen-wrap">
            <InfoButton onClick={() => setInfoOpen(true)} />
            <ScreenErrorBoundary screen={`${step}-${businessType}-${variant}`}>
              {/* wait until the URL has been read, so a deep link mounts its own
                  screen first rather than flashing the sign-up page */}
              {booted && <ScreenHost step={step} />}
            </ScreenErrorBoundary>
          </div>
        </div>

        {!presenter && (
          <BottomBar
            onBack={() => go(-1)}
            onNext={() => go(1)}
            onReset={onReset}
            hint={presenter ? "" : "P for presenter mode"}
          />
        )}
      </main>

      {infoOpen && <InfoPanel screenId={step} onClose={() => setInfoOpen(false)} />}
    </div>
    </AppContext.Provider>
  );
}
