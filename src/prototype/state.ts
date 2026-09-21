// The prototype's single source of truth. Everything the demo shows is derived from
// this: which screen is open, which business type is selected, and how far the
// simulated customer has got. It is deliberately separate from the product's own
// stores, which it seeds.
import { create } from "zustand";

export const BUSINESS_TYPES = {
  FREELANCER: "FREELANCER",
  PROPRIETORSHIP: "SOLE_PROPRIETORSHIP",
  PRIVATE_LIMITED_COMPANY: "COMPANY",
  LLP: "LIMITED_LIABILITY_PARTNERSHIP",
  PARTNERSHIP: "PARTNERSHIP",
  HUF: "HINDU_UNDIVIDED_FAMILY",
} as const;

export type BusinessTypeId = (typeof BUSINESS_TYPES)[keyof typeof BUSINESS_TYPES];

export const BUSINESS_TYPE_LIST: { id: BusinessTypeId; label: string; short: string }[] = [
  { id: BUSINESS_TYPES.FREELANCER, label: "Freelancer", short: "Freelancer" },
  { id: BUSINESS_TYPES.PROPRIETORSHIP, label: "Sole Proprietor", short: "Sole Prop" },
  { id: BUSINESS_TYPES.PRIVATE_LIMITED_COMPANY, label: "Private Limited", short: "Pvt Ltd" },
  { id: BUSINESS_TYPES.LLP, label: "LLP", short: "LLP" },
  { id: BUSINESS_TYPES.PARTNERSHIP, label: "Partnership", short: "Partnership" },
  { id: BUSINESS_TYPES.HUF, label: "HUF", short: "HUF" },
];

export const INDIVIDUAL_TYPES: string[] = [BUSINESS_TYPES.FREELANCER, BUSINESS_TYPES.PROPRIETORSHIP];
export const COMPANY_TYPES: string[] = [
  BUSINESS_TYPES.PRIVATE_LIMITED_COMPANY,
  BUSINESS_TYPES.LLP,
  BUSINESS_TYPES.PARTNERSHIP,
  BUSINESS_TYPES.HUF,
];

/** The fourth letter of a PAN decides the business type. */
export function businessTypeFromPan(pan: string, hasGst = false): BusinessTypeId | null {
  const letter = (pan || "").toUpperCase()[3];
  if (!letter) return null;
  if (letter === "P") return hasGst ? BUSINESS_TYPES.PROPRIETORSHIP : BUSINESS_TYPES.FREELANCER;
  if (letter === "C") return BUSINESS_TYPES.PRIVATE_LIMITED_COMPANY;
  if (letter === "H") return BUSINESS_TYPES.HUF;
  if (letter === "F") return BUSINESS_TYPES.PARTNERSHIP; // we ask Partnership vs LLP
  return null; // not a type Skydo supports
}

export type StepId =
  | "login"
  | "email-otp"
  | "mobile"
  | "kyc-intro"
  | "pan"
  | "business-details"
  | "aadhaar"
  | "mobile-otp"
  | "management"
  | "bank"
  | "documents"
  | "verification"
  | "home";

export interface PrototypeState {
  step: StepId;
  businessType: BusinessTypeId;
  /** Per-screen variant, e.g. referral on the login screen. Carried in the URL. */
  variant: string;

  // simulated answers the customer has given
  panValue: string;
  panVerified: boolean;
  hasGst: boolean;
  receivedIntlPayments: boolean | null;
  aadhaarStage: "prompt" | "entry" | "otp" | "consent" | "verified";
  docPath: "recommended" | "other";
  homeStage: "intent" | "next-payment" | "receive" | "test-start" | "test-success" | "tracking";
  verificationStage: "submitted" | "created";

  presenter: boolean;
  railOpen: boolean;

  /**
   * Counts moves made with the prototype's own controls (rail, top bar, Back/Next,
   * browser back and forward). Each one opens the product page afresh, because some
   * product cards read the customer's details only when they first open. Moves made
   * by the product's own buttons leave it alone, so their transitions play as live.
   */
  jump: number;

  set: (patch: Partial<PrototypeState>) => void;
  /** A move made with the prototype's controls: applies it and opens the page afresh. */
  jumpTo: (patch: Partial<PrototypeState>) => void;
  reset: () => void;
}

const initial = {
  step: "login" as StepId,
  businessType: BUSINESS_TYPES.FREELANCER as BusinessTypeId,
  variant: "",
  panValue: "",
  panVerified: false,
  hasGst: false,
  receivedIntlPayments: null,
  aadhaarStage: "prompt" as const,
  docPath: "recommended" as const,
  homeStage: "intent" as const,
  verificationStage: "submitted" as const,
  presenter: false,
  railOpen: true,
};

export const usePrototype = create<PrototypeState>()((set) => ({
  ...initial,
  jump: 0,
  set: (patch) => set(patch),
  // A PAN verified earlier is forgotten, so jumping back to the PAN step shows the
  // empty PAN box again. The steps after it count the PAN as verified regardless.
  // A new business type also drops the PAN entered for the old one, so the screens
  // show a sample PAN that suits the new type.
  jumpTo: (patch) =>
    set((s) => ({
      panVerified: false,
      ...(patch.businessType && patch.businessType !== s.businessType ? { panValue: "" } : {}),
      ...patch,
      jump: s.jump + 1,
    })),
  reset: () => set((s) => ({ ...initial, jump: s.jump + 1 })),
}));

/** Read current state outside React (fixtures need this). */
export const getProto = () => usePrototype.getState();
