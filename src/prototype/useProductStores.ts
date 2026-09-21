// Seeds the product's own stores from the prototype state, so the real components
// render the right screen for the chosen business type without any backend.
import { useEffect } from "react";
import useUserData from "../skydo/store/useUserData";
import useReferralStore from "../skydo/store/useReferralStore";
import { getProto, usePrototype } from "./state";
import { SAMPLE, displayName, onboardingStateForStep } from "../mocks/fixtures";
import { SAMPLE_REFERRER } from "../mocks/beCall";

export function useSeedProductStores() {
  const { step, businessType, panVerified, aadhaarStage, variant } = usePrototype();

  // The referral variant shows who invited the customer and the reward waiting.
  useEffect(() => {
    useReferralStore.setState({
      referrerDetails: variant === "referral" ? (SAMPLE_REFERRER as any) : undefined,
      referrerDetailsViaCode: variant === "referral" ? (SAMPLE_REFERRER as any) : undefined,
    } as any);
  }, [variant, step]);

  useEffect(() => {
    const p = getProto();
    const panDone =
      panVerified ||
      ["business-details", "aadhaar", "mobile-otp", "management", "bank", "documents", "verification", "home"].includes(step);

    useUserData.setState({
      userState: onboardingStateForStep(),
      userName: SAMPLE.name,
      exporterId: "1",
      loggedInUserEmail: SAMPLE.email,
      businessType: panDone ? businessType : "",
      phoneNumber: ["login", "email-otp", "mobile"].includes(step) ? "" : SAMPLE.phone,
      isTransacting: false,
      offboardingType: "",
    } as any);
  }, [step, businessType, panVerified, aadhaarStage]);
}
