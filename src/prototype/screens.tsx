// The journey, in order. Each entry says which business types reach that screen and
// which sub-stages it steps through.
import { BUSINESS_TYPES, COMPANY_TYPES, StepId } from "./state";

export interface ScreenDef {
  id: StepId;
  label: string;
  /** Business types that see this screen. Empty means everyone. */
  only?: string[];
  /** True when the screen looks different per business type (drives the top bar). */
  typeAware?: boolean;
  /** Named variants offered in the top bar for this screen. */
  variants?: { id: string; label: string }[];
}

export const SCREENS: ScreenDef[] = [
  {
    id: "login",
    label: "Sign up",
    variants: [
      { id: "", label: "Normal" },
      { id: "referral", label: "Referral" },
    ],
  },
  { id: "email-otp", label: "Email code" },
  { id: "mobile", label: "Mobile number" },
  { id: "kyc-intro", label: "Terms and how you found us" },
  { id: "pan", label: "Business PAN", typeAware: true },
  { id: "business-details", label: "Business details", typeAware: true },
  { id: "aadhaar", label: "Aadhaar via DigiLocker", typeAware: true },
  { id: "mobile-otp", label: "Confirm mobile" },
  {
    id: "management",
    label: "Directors, partners and owners",
    only: COMPANY_TYPES,
    typeAware: true,
  },
  { id: "bank", label: "Bank account", typeAware: true },
  { id: "documents", label: "Documents", typeAware: true },
  { id: "verification", label: "Checks and accounts ready", typeAware: true },
  { id: "home", label: "First home and test payment" },
];

/** The screens a given business type actually walks through. */
export function screensFor(businessType: string): ScreenDef[] {
  return SCREENS.filter((s) => !s.only || s.only.includes(businessType));
}

export function indexOfStep(step: StepId, businessType: string): number {
  return screensFor(businessType).findIndex((s) => s.id === step);
}
