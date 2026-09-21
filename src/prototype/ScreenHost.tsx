// Mounts the product's own components for the screen on show. Where a screen is not
// wired up yet, it says so plainly rather than faking it.
import React, { useEffect } from "react";
import { StepId, usePrototype } from "./state";
import DesktopLoginPage from "../skydo/components/LoginComponents/DesktopLoginPage";
import Header from "../skydo/components/Header";
import Onboarding from "../skydo/pages/onboarding";
import { notifyRouter, setProductPath } from "../shims/next-router";
import { SAMPLE } from "../mocks/fixtures";
import { PanRuleButton } from "./components/PanRuleButton";
import { ScaledViewport, viewportScale } from "./components/ScaledViewport";
import { DigiLockerAadhaar, DigiLockerConsent, DigiLockerPin } from "./components/DigiLockerReplica";

/** Fills a React-controlled input and fires the events React listens for. */
function setReactValue(el: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * The email screen and the code screen are one component in the product: the code
 * appears only after an email is submitted. To let the rail jump straight to the code
 * screen, fill the email and submit it once on mount.
 */
function useAutoSubmitEmail(active: boolean) {
  useEffect(() => {
    if (!active) return;
    // Typing an email swaps the card to "Continue using email" with a Send OTP
    // button, so fill the field, wait for that button, then press it.
    let tries = 0;
    let clicked = 0;
    const tick = window.setInterval(() => {
      tries += 1;
      const root = document.querySelector(".proto-screen-wrap");
      if ((root?.textContent ?? "").includes("Enter the OTP sent")) {
        window.clearInterval(tick);
        return;
      }
      const input = root?.querySelector("form input") as HTMLInputElement | null;
      if (input && input.value !== SAMPLE.email) setReactValue(input, SAMPLE.email);
      const send = (Array.from(root?.querySelectorAll("button") ?? []) as HTMLButtonElement[]).find(
        (b) => b.textContent?.trim() === "Send OTP" && b.offsetParent !== null
      );
      if (send && !send.disabled && Date.now() - clicked > 2000) {
        clicked = Date.now();
        send.click();
      }
      if (tries > 80) window.clearInterval(tick);
    }, 150);
    return () => window.clearInterval(tick);
  }, [active]);
}

/**
 * The mobile-code popup only exists once Verify is pressed on the identity screen.
 * The rail lists it as its own step, so open it on arrival.
 */
function useAutoOpenMobileOtp(active: boolean) {
  useEffect(() => {
    if (!active) return;
    // The identity card can re-mount while its data loads, which would drop a popup
    // opened too early. So keep pressing Verify (at most every 2.5 seconds) until
    // the popup is actually on screen.
    let tries = 0;
    let lastClick = 0;
    const tick = window.setInterval(() => {
      tries += 1;
      const root = document.querySelector(".proto-screen-wrap");
      if ((root?.textContent ?? "").includes("Enter the OTP")) {
        window.clearInterval(tick);
        return;
      }
      const buttons = Array.from(root?.querySelectorAll("button") ?? []) as HTMLButtonElement[];
      // The page carries a hidden phone-layout copy of the button; press the one on screen.
      const verify = buttons.find(
        (b) => b.textContent?.trim().toLowerCase() === "verify" && b.getClientRects().length > 0 && b.offsetParent !== null
      );
      if (verify && !verify.disabled && Date.now() - lastClick > 2500) {
        lastClick = Date.now();
        verify.click();
      }
      if (tries > 200) window.clearInterval(tick);
    }, 100);
    return () => window.clearInterval(tick);
  }, [active]);
}

/**
 * The live page brings the open step card into view. Do the same inside the frame:
 * find the card whose step icon is in its "current" state and scroll it just under
 * the header and tracker.
 */
function useScrollToCurrentCard(key: string, active: boolean) {
  useEffect(() => {
    if (!active) return;
    let tries = 0;
    const tick = window.setInterval(() => {
      tries += 1;
      const scroller = document.querySelector(".proto-app-scroll") as HTMLElement | null;
      const icon = scroller?.querySelector(".top-10.bg-black-700") as HTMLElement | null;
      const card = icon?.parentElement as HTMLElement | null;
      if (scroller && card) {
        const k = viewportScale(scroller);
        const top = (card.getBoundingClientRect().top - scroller.getBoundingClientRect().top) / k + scroller.scrollTop;
        // 48px header + 80px tracker, less a little breathing room
        scroller.scrollTo({ top: Math.max(0, top - 128 - 16) });
        window.clearInterval(tick);
      }
      if (tries > 40) window.clearInterval(tick);
    }, 100);
    return () => window.clearInterval(tick);
  }, [key, active]);
}

function NotWired({ label }: { label: string }) {
  return (
    <div className="proto-notwired">
      <h2>{label}</h2>
      <p>This screen is not wired up yet. It arrives in a later build.</p>
    </div>
  );
}

export function ScreenHost({ step }: { step: StepId }) {
  const { variant, aadhaarStage, set } = usePrototype();
  const isOtp = step === "email-otp";
  useAutoSubmitEmail(isOtp);
  useAutoOpenMobileOtp(step === "mobile-otp");
  useScrollToCurrentCard(`${step}-${aadhaarStage}`, !["login", "email-otp", "mobile", "kyc-intro", "home"].includes(step));

  /**
   * The real button sends the customer off to DigiLocker. In the prototype it opens
   * the replica of that journey instead of leaving the page.
   */
  const interceptDigiLocker = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement)?.closest("button, a, div[role='button']");
    const text = (el?.textContent ?? "").toLowerCase();
    if (text.includes("digilocker")) {
      e.preventDefault();
      e.stopPropagation();
      set({ aadhaarStage: "entry" });
    }
  };

  // Tell the product which of its pages is on show, so its header and layout
  // follow the same rules as the live app.
  const productPath = step === "login" || step === "email-otp" ? "/login" : step === "home" ? "/home" : "/onboarding";
  // Set before the page renders, so it mounts on the right path, then let any
  // router already on screen catch up.
  setProductPath(productPath, true);
  useEffect(() => notifyRouter(), [productPath]);

  if (step === "login" || step === "email-otp") {
    // The real login page, including its background, logo, footer and the
    // referral panel, not just the card.
    return (
      <ScaledViewport className="proto-product-page">
        <DesktopLoginPage key={`${step}-${variant}`} authenticated={false} isReferred={variant === "referral"} />
      </ScaledViewport>
    );
  }

  if (step === "aadhaar") {
    // The customer leaves Skydo for DigiLocker in the middle of this step, so the
    // screen swaps between the product and the DigiLocker replicas.
    if (aadhaarStage === "entry") {
      return <DigiLockerAadhaar onNext={() => set({ aadhaarStage: "otp" })} />;
    }
    if (aadhaarStage === "otp") {
      return <DigiLockerPin onNext={() => set({ aadhaarStage: "consent" })} />;
    }
    if (aadhaarStage === "consent") {
      return (
        <DigiLockerConsent
          onAllow={() => set({ aadhaarStage: "verified" })}
          onDeny={() => set({ aadhaarStage: "prompt" })}
        />
      );
    }
  }

  if (step === "home") {
    return <NotWired label={step} />;
  }

  // Every step from the mobile number to the checks is one page in the product: the
  // header, the progress tracker and a column of step cards, where the current step
  // is open and the others are ticked or locked. It is mounted whole here, exactly
  // as the live app mounts it, and the step on show decides which card is open.
  return (
    <ScaledViewport className="proto-product-page proto-app-page">
      <div className="proto-app-scroll" onClickCapture={step === "aadhaar" ? interceptDigiLocker : undefined}>
        <Header />
        {step === "pan" && <PanRuleButton />}
        {step === "aadhaar" && aadhaarStage === "prompt" && (
          <button className="proto-skip-btn" onClick={() => set({ aadhaarStage: "verified" })}>
            Skip verification (prototype)
          </button>
        )}
        <Onboarding />
      </div>
    </ScaledViewport>
  );
}
