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
  /** A presenter slide rather than a product screen: not numbered as a journey step. */
  slide?: boolean;
}

export const SCREENS: ScreenDef[] = [
  // The opening slide: the August funnel, before walking the journey.
  { id: "intro", label: "August 2026 funnel", slide: true },
  // Sign-up on skydo.com, where most new accounts start: the Get Started form takes a
  // name and mobile number, then the same popup asks for an email and its code.
  { id: "login", label: "Sign up on skydo.com" },
  { id: "email-otp", label: "Email and code" },
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
  {
    id: "documents",
    label: "Documents",
    // Private limited companies and LLPs are checked from company records, so the
    // product shows them no documents step.
    only: [BUSINESS_TYPES.FREELANCER, BUSINESS_TYPES.PROPRIETORSHIP, BUSINESS_TYPES.PARTNERSHIP, BUSINESS_TYPES.HUF],
    typeAware: true,
    // What the customer answered on the bank card decides which document is offered
    // first; "Other documents" is the fallback list, checked by hand.
    variants: [
      { id: "", label: "Answered Yes" },
      { id: "no", label: "Answered No" },
      { id: "other", label: "Other documents" },
    ],
  },
  { id: "verification", label: "Checks and accounts ready", typeAware: true },
  {
    id: "home",
    label: "Focused home and test payment",
    // The home screen moves through several stages without a new URL in the product;
    // each is offered here so it can be shown directly.
    variants: [
      { id: "", label: "Accounts created" },
      { id: "next-payment", label: "Next payment question" },
      { id: "receive", label: "Receive steps" },
      { id: "test", label: "Test payment" },
      { id: "method", label: "Choose method" },
      { id: "share", label: "Share account" },
      { id: "tracking", label: "Tracking" },
    ],
  },
];

/** The screens a given business type actually walks through. */
export function screensFor(businessType: string): ScreenDef[] {
  return SCREENS.filter((s) => !s.only || s.only.includes(businessType));
}

export function indexOfStep(step: StepId, businessType: string): number {
  return screensFor(businessType).findIndex((s) => s.id === step);
}

/** A screen's number in the journey, counting product screens only (slides have none). */
export function journeyNumber(step: StepId, businessType: string): number | null {
  const list = screensFor(businessType).filter((s) => !s.slide);
  const i = list.findIndex((s) => s.id === step);
  return i === -1 ? null : i + 1;
}

/** How many product screens a business type walks through. */
export function journeyLength(businessType: string): number {
  return screensFor(businessType).filter((s) => !s.slide).length;
}
