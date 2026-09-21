import { VirtualAccountDetail } from "../../../types";

export interface BankHolidayNote {
  date: string; // YYYY-MM-DD
  description: string | null;
}

export const normalizeVendor = (provider?: string): string => {
  const p = (provider ?? "").toUpperCase().replace(/[\s-]+/g, "_");
  if (p.includes("GLOMO")) return "GLOMO";
  if (p.includes("CALIZA")) return "CALIZA";
  if (p.includes("BANKING") && p.includes("CIRCLE")) return "BANKING_CIRCLE";
  if (p.includes("CURRENCY") && p.includes("CLOUD")) return "CURRENCY_CLOUD";
  if (p.includes("DBS")) return "DBS_SG";
  if (p.includes("NOVATTI")) return "NOVATTI";
  if (p.includes("VERTO")) return "VERTO";
  if (p.includes("VEEM")) return "VEEM";
  return p;
};

const PAYMENT_VENDORS = new Set([
  "CURRENCY_CLOUD",
  "DBS_SG",
  "NOVATTI",
  "BANKING_CIRCLE",
  "BANKING_CIRCLE_MARKETPLACE",
  "PPRO",
  "VERTO",
  "VEEM",
  "CALIZA",
  "GLOMO_PAY",
]);

export const toPaymentVendor = (provider?: string): string | null => {
  const v = normalizeVendor(provider);
  const mapped = v === "GLOMO" ? "GLOMO_PAY" : v;
  return PAYMENT_VENDORS.has(mapped) ? mapped : null;
};

export const isSwiftAccount = (account?: VirtualAccountDetail): boolean => {
  const routing = (account?.routingCodeType ?? "").toLowerCase();
  const paymentType = (account as { paymentType?: string } | undefined)?.paymentType;
  return routing === "bic_swift" && paymentType !== "regular";
};
