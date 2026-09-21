// Seeds the product's own stores from the prototype state, so the real components
// render the right screen for the chosen business type without any backend.
//
// Seeding happens synchronously whenever the prototype state changes, outside React.
// That matters: in the live app a customer's details are loaded before a step card
// mounts, and some cards read them once, on mount (the bank card decides then whether
// documents will be needed). Seeding in a React effect would run after those cards
// had already mounted with empty details.
import { useEffect } from "react";
import useUserData from "../skydo/store/useUserData";
import useReferralStore from "../skydo/store/useReferralStore";
import { getProto, usePrototype } from "./state";
import { SAMPLE, onboardingStateForStep } from "../mocks/fixtures";
import { SAMPLE_REFERRER } from "../mocks/beCall";
import { BankAccountStep } from "../skydo/types/Onboarding";
import { DOC_REQUIRED_BUSINESSES } from "../skydo/constants/onboarding";
import useBankStatementAnalyseStore from "../skydo/store/useBankStatementAnalyseStore";
import useCompanyPanDetailsStore from "../skydo/store/useCompanyPanDetailsStore";

const AFTER_PAN = ["business-details", "aadhaar", "mobile-otp", "management", "bank", "documents", "verification", "home"];

function seedProductStores() {
  const { step, businessType, panVerified, variant } = getProto();
  const panDone = panVerified || AFTER_PAN.includes(step);

  // The referral variant shows who invited the customer and the reward waiting.
  useReferralStore.setState({
    referrerDetails: variant === "referral" ? (SAMPLE_REFERRER as any) : undefined,
    referrerDetailsViaCode: variant === "referral" ? (SAMPLE_REFERRER as any) : undefined,
  } as any);

  // The PAN card remembers a verified PAN and never forgets it by itself, so going
  // back to the PAN step would still show the business form: clear it there. It is
  // never set here, because the card sets it itself once the business details have
  // loaded; setting it early shows the form before it knows the business type, and
  // the form then falls back to the company layout.
  if (!panDone) {
    useCompanyPanDetailsStore.setState({ isPanVerified: false, isForcePanInput: false, companyPanDetailsData: {} } as any);
  }

  // The documents card opens on the document that matches the bank-card answer:
  // Yes offers the bank statement, No offers a signed contract.
  if (step === "documents") {
    useBankStatementAnalyseStore.setState({
      isContractRecommended: variant === "no" || variant === "other",
      selectedOption: variant === "other" ? "other" : "recommended",
    } as any);
    // Remember the path taken, since it decides the checks screen that follows.
    const docPath = variant === "other" ? "other" : "recommended";
    if (getProto().docPath !== docPath) queueMicrotask(() => usePrototype.getState().set({ docPath }));
  }

  useUserData.setState({
    userState: onboardingStateForStep(),
    userName: SAMPLE.name.split(" ")[0], // the product greets people by first name
    exporterId: "1",
    loggedInUserEmail: SAMPLE.email,
    businessType: panDone ? businessType : "",
    phoneNumber: ["login", "email-otp", "mobile"].includes(step) ? "" : SAMPLE.phone,
    isTransacting: false,
    offboardingType: "",
    // The bank card shows the filled, verified account; the documents card opens
    // once the bank step is complete, as it does after "Submit and continue".
    bankAccountStep:
      step === "documents" || step === "verification" || step === "home"
        ? BankAccountStep.STEP_COMPLETED
        : step === "bank"
        ? BankAccountStep.DETAILS_FILLED
        : BankAccountStep.NOT_STARTED,
    docUploadProps: {
      isSectionVisible: DOC_REQUIRED_BUSINESSES.includes(businessType),
      isDone: step === "verification" || step === "home",
    },
  } as any);
}

// Re-seed only when something the product reads has changed.
const seedKey = () => {
  const p = getProto();
  return [p.step, p.businessType, p.panVerified, p.aadhaarStage, p.variant, p.docPath].join("|");
};
let lastKey = "";
function seedIfChanged() {
  const key = seedKey();
  if (key === lastKey) return;
  lastKey = key;
  seedProductStores();
}
seedIfChanged();
usePrototype.subscribe(seedIfChanged);

// For types that must share documents, "Submit and continue" on the bank card
// completes the bank step locally and opens the documents card. Follow it.
useUserData.subscribe((state: any, prev: any) => {
  if (
    getProto().step === "bank" &&
    state.bankAccountStep === BankAccountStep.STEP_COMPLETED &&
    prev.bankAccountStep !== BankAccountStep.STEP_COMPLETED
  ) {
    const { isContractRecommended } = useBankStatementAnalyseStore.getState() as any;
    usePrototype.getState().set({ step: "documents", variant: isContractRecommended ? "no" : "", docPath: "recommended" });
  }
});

// Picking a card on the documents step is reflected in the URL and top bar, and
// decides which checks screen follows.
useBankStatementAnalyseStore.subscribe((state: any, prev: any) => {
  const p = getProto();
  if (p.step !== "documents") return;
  if (state.selectedOption === prev.selectedOption && state.isContractRecommended === prev.isContractRecommended) return;
  const variant = state.selectedOption === "other" ? "other" : state.isContractRecommended ? "no" : "";
  if (variant !== p.variant) {
    usePrototype.getState().set({ variant, docPath: state.selectedOption === "other" ? "other" : "recommended" });
  }
});

/** Kept for App: seeding is already wired up when this module loads. */
export function useSeedProductStores() {
  useEffect(() => {
    seedIfChanged();
  }, []);
}
