// Mounts the product's own components for the screen on show. Where a screen is not
// wired up yet, it says so plainly rather than faking it.
import React, { useEffect, useRef } from "react";
import { StepId, usePrototype } from "./state";
import DesktopLoginPage from "../skydo/components/LoginComponents/DesktopLoginPage";
import MobileInputComp from "../skydo/components/LoginComponents/MobileInputComp";
import KYCIntro from "../skydo/components/KYCIntro";
import CompanyPanDetails from "../skydo/components/CompanyPanDetails";
import UBOPanDetails from "../skydo/components/UBOPanDetails";
import { SAMPLE } from "../mocks/fixtures";
import { PanRuleButton } from "./components/PanRuleButton";
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
  const done = useRef(false);
  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;
    let tries = 0;
    const tick = window.setInterval(() => {
      tries += 1;
      const root = document.querySelector(".proto-screen-wrap");
      const input = root?.querySelector('input[type="email"], input[name="email"], input') as HTMLInputElement | null;
      if (input) {
        setReactValue(input, SAMPLE.email);
        const form = input.closest("form");
        window.setTimeout(() => {
          if (form) {
            form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
          }
        }, 60);
        window.clearInterval(tick);
      }
      if (tries > 40) window.clearInterval(tick);
    }, 50);
    return () => window.clearInterval(tick);
  }, [active]);
}

/**
 * The mobile-code popup only exists once Verify is pressed on the identity screen.
 * The rail lists it as its own step, so open it on arrival.
 */
function useAutoOpenMobileOtp(active: boolean) {
  const done = useRef(false);
  useEffect(() => {
    if (!active) {
      done.current = false;
      return;
    }
    if (done.current) return;
    done.current = true;
    let tries = 0;
    const tick = window.setInterval(() => {
      tries += 1;
      const root = document.querySelector(".proto-screen-wrap");
      const buttons = Array.from(root?.querySelectorAll("button") ?? []) as HTMLButtonElement[];
      const verify = buttons.find((b) => b.textContent?.trim().toLowerCase() === "verify");
      const alreadyOpen = (root?.textContent ?? "").includes("Resend OTP");
      if (alreadyOpen) {
        window.clearInterval(tick);
        return;
      }
      if (verify && !verify.disabled) {
        verify.click();
        window.clearInterval(tick);
      }
      if (tries > 50) window.clearInterval(tick);
    }, 90);
    return () => window.clearInterval(tick);
  }, [active]);
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

  switch (step) {
    case "login":
    case "email-otp":
      // The real login page, including its background, logo, footer and the
      // referral panel, not just the card.
      return (
        <div className="proto-product-page">
          <DesktopLoginPage key={`${step}-${variant}`} authenticated={false} isReferred={variant === "referral"} />
        </div>
      );

    case "mobile":
      return (
        <div className="proto-product proto-product-login">
          <MobileInputComp goToNextStep={() => set({ step: "kyc-intro" })} />
        </div>
      );

    case "kyc-intro":
      return (
        <div className="proto-product">
          <KYCIntro />
        </div>
      );

    case "pan":
    case "business-details":
      return (
        <div className="proto-product">
          {step === "pan" && <PanRuleButton />}
          <CompanyPanDetails />
        </div>
      );

    case "aadhaar":
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
      return (
        <div className="proto-product" onClickCapture={interceptDigiLocker}>
          {aadhaarStage === "prompt" && (
            <button className="proto-skip-btn" onClick={() => set({ aadhaarStage: "verified" })}>
              Skip verification (prototype)
            </button>
          )}
          <UBOPanDetails />
        </div>
      );

    case "mobile-otp":
      return (
        <div className="proto-product">
          <UBOPanDetails />
        </div>
      );


    default:
      return <NotWired label={step} />;
  }
}
