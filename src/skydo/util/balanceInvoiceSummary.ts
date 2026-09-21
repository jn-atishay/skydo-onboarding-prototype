import type {
  BalanceInvoiceSummaryResponse,
  BalanceInvoiceSummaryResult,
  BalanceInvoiceSenderAlertRow,
  Currency,
} from "../types/SkydoBalance";
import type { SenderAlertDetails } from "../types";

/* ----------------------------- Helpers ----------------------------- */

function parseAmount(value?: string | number | null): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function sumBy<T>(items: T[] | null | undefined, selector: (item: T) => number): number {
  if (!items?.length) return 0;
  return items.reduce((sum, item) => sum + selector(item), 0);
}

function sumChargeAmounts(charges?: { amount: string }[] | { amount: string } | null): number {
  if (!charges) return 0;
  const chargeArray = Array.isArray(charges) ? charges : [charges];
  return sumBy(chargeArray, (c) => parseAmount(c.amount));
}

function resolveSummaryCurrency(data: BalanceInvoiceSummaryResponse): Currency {
  const mfvs = data.invoiceMasterFundingVerifications ?? [];
  const firstMfv = mfvs[0];
  if (firstMfv?.currency) return firstMfv.currency as Currency;

  const outpays = data.invoiceBalanceOutpayTopupMappings ?? [];
  const firstOutpay = outpays[0];
  if (firstOutpay?.currency) return firstOutpay.currency as Currency;

  const withdrawals = data.invoiceWithdrawals ?? [];
  const firstWd = withdrawals[0];
  if (firstWd?.currency) return firstWd.currency as Currency;

  return "USD";
}

/* ---------------------------- Main Logic ---------------------------- */

export function summariseBalanceInvoiceSummary(
  data?: BalanceInvoiceSummaryResponse | null
): BalanceInvoiceSummaryResult {
  if (!data) {
    return {
      mappedAmount: 0,
      skydoFees: 0,
      outwardPayments: 0,
      withdrawalAmount: 0,
      mappedAmountUnderVerification: 0,
      currency: "USD",
      senderAlertRows: [],
    };
  }

  const approvedVerifications = (data.invoiceMasterFundingVerifications ?? []).filter((v) => v.state === "APPROVED");
  const pendingVerifications = (data.invoiceMasterFundingVerifications ?? []).filter((v) => v.state !== "APPROVED");

  const outpays = data.invoiceBalanceOutpayTopupMappings ?? [];
  const withdrawals = data.invoiceWithdrawals ?? [];

  const mappedAmount = sumBy(approvedVerifications, (v) => parseAmount(v.amount));
  const mappedAmountUnderVerification = sumBy(pendingVerifications, (v) => parseAmount(v.amount));

  const topupFees = sumBy(approvedVerifications, (v) => sumChargeAmounts(v.balanceTopup?.balanceTopupCharges));

  // An outpay is funded from one or more topups, so `balanceOutpayVerification.amount` is the whole
  // outpay and says nothing about this invoice's part in it. Only `fromAmount` — and the payout /
  // charges split the backend derives from it — belong to this invoice.
  const outwardPayments = sumBy(outpays, (o) => parseAmount(o.payoutAmount ?? o.fromAmount));

  const outwardFees = sumBy(outpays, (o) => parseAmount(o.chargesAmount));

  const withdrawalAmount = sumBy(withdrawals, (w) => parseAmount(w.amount));

  const senderAlertRows: BalanceInvoiceSenderAlertRow[] = [];
  for (const v of data.invoiceMasterFundingVerifications ?? []) {
    const raw = v.senderAlertDetails;
    const alerts: SenderAlertDetails[] = !raw ? [] : Array.isArray(raw) ? raw : [raw];
    for (const detail of alerts) {
      if (detail == null) continue;
      senderAlertRows.push({
        masterFundingVerificationId: v.id,
        senderAlertDetails: detail,
        amount: parseAmount(v.amount),
        currency: (v.currency ?? "USD") as Currency,
        creationTimestamp: v.creationTimestamp ?? "",
      });
    }
  }

  return {
    mappedAmount: mappedAmount,
    mappedAmountUnderVerification,
    skydoFees: topupFees + outwardFees,
    outwardPayments,
    withdrawalAmount,
    currency: resolveSummaryCurrency(data),
    senderAlertRows,
  };
}

/** Prefer explicit `summary` from the hook; otherwise derive from raw API `data`. */
export function resolveBalanceSummaryResult(
  data: BalanceInvoiceSummaryResponse | null | undefined,
  summary?: BalanceInvoiceSummaryResult | null
): BalanceInvoiceSummaryResult {
  return summary ?? summariseBalanceInvoiceSummary(data ?? null);
}

/** True when balance invoice summary UI (e.g. BalanceInvoiceSummaryCard) is shown for this invoice. */
export function hasBalanceInvoiceMasterFunding(data: BalanceInvoiceSummaryResponse | null | undefined): boolean {
  return (data?.invoiceMasterFundingVerifications?.length ?? 0) > 0;
}

/**
 * Portion of invoice progress "Paid" from balance: Skydo fees + payout amounts already allocated.
 * Withdrawals are excluded. Only counted when MFVs exist and summary currency matches invoice expected currency.
 */
export function getBalanceFeesAndPayoutForPaidBar(
  data: BalanceInvoiceSummaryResponse | null | undefined,
  summary: BalanceInvoiceSummaryResult,
  invoiceExpectedCurrency: string
): number {
  if (!hasBalanceInvoiceMasterFunding(data)) return 0;
  if (summary.currency !== invoiceExpectedCurrency) return 0;
  return Math.max(0, summary.skydoFees + summary.outwardPayments);
}

/** Same as {@link getBalanceFeesAndPayoutForPaidBar} after resolving summary from optional hook props. */
export function getBalanceFeesAndPayoutForPaidBarFromProps(
  data: BalanceInvoiceSummaryResponse | null | undefined,
  summary: BalanceInvoiceSummaryResult | undefined | null,
  invoiceExpectedCurrency: string
): number {
  return getBalanceFeesAndPayoutForPaidBar(
    data ?? null,
    resolveBalanceSummaryResult(data, summary),
    invoiceExpectedCurrency
  );
}
