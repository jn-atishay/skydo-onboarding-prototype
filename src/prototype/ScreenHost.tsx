// Mounts the product's own components for the screen on show. Where a screen is not
// wired up yet, it says so plainly rather than faking it.
import React, { useEffect, useRef } from "react";
import { StepId, usePrototype } from "./state";
import EmailLoginFlow from "../skydo/components/Common/EmailLoginFlow";
import MobileInputComp from "../skydo/components/LoginComponents/MobileInputComp";
import KYCIntro from "../skydo/components/KYCIntro";
import CompanyPanDetails from "../skydo/components/CompanyPanDetails";
import { SAMPLE } from "../mocks/fixtures";
import { PanRuleButton } from "./components/PanRuleButton";

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

function NotWired({ label }: { label: string }) {
  return (
    <div className="proto-notwired">
      <h2>{label}</h2>
      <p>This screen is not wired up yet. It arrives in a later build.</p>
    </div>
  );
}

export function ScreenHost({ step }: { step: StepId }) {
  const { variant, set } = usePrototype();
  const isOtp = step === "email-otp";
  useAutoSubmitEmail(isOtp);

  switch (step) {
    case "login":
    case "email-otp":
      return (
        <div className="proto-product proto-product-login">
          <EmailLoginFlow
            key={step}
            isReferred={variant === "referral"}
            register={async () => {
              set({ step: "mobile" });
            }}
          />
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

    default:
      return <NotWired label={step} />;
  }
}
