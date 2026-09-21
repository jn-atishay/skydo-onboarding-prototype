import {
  InvoiceInstantSettlementEligibilityState,
  InstantSettlementAmount,
  InstantSettlementMoney,
  InstantSettlementPreviewBreakdown,
  InstantSettlementInrBreakdown,
  InstantSettlementGstSplitType,
} from "../types";
import { FXRateResponse } from "../types/ApiResponses";
import { CURRENCY_CODE } from "../constants/dashboardConstants";
import { roundTo } from "./functions";

export const isInvoiceEligibleForInstantSettlementEvent = (invoice: any) => {
  return (
    invoice?.invoiceInstantSettlementDetails?.eligibilityState &&
    invoice?.invoiceInstantSettlementDetails?.eligibilityState != InvoiceInstantSettlementEligibilityState.NOT_ELIGIBLE
  );
};

export const toAmount = (value: InstantSettlementAmount | null | undefined): number => {
  const parsed = typeof value === "number" ? value : parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
};

const fxKey = (base: string, target: string): string => `${base}_${target}`;

export const buildFxRateLookup = (fxRates: FXRateResponse[]): Map<string, FXRateResponse> => {
  const lookup = new Map<string, FXRateResponse>();
  fxRates.forEach((rate) => lookup.set(fxKey(rate.base, rate.target), rate));
  return lookup;
};

export const buildFxCurrencyPairList = (
  breakdown: InstantSettlementPreviewBreakdown | null | undefined
): { base: string; target: string }[] => {
  if (!breakdown) return [];
  const currencies = new Set<string>();
  const collect = (money: InstantSettlementMoney | null | undefined) => {
    if (money?.currency && money.currency !== CURRENCY_CODE.INR) currencies.add(money.currency);
  };
  collect(breakdown.grossAmount);
  collect(breakdown.platformFee);
  collect(breakdown.regionalPremium);
  collect(breakdown.instantSettlementFee);
  return Array.from(currencies).map((base) => ({ base, target: CURRENCY_CODE.INR }));
};

export const convertMoneyToInr = (
  money: InstantSettlementMoney | null | undefined,
  lookup: Map<string, FXRateResponse>
): number => {
  if (!money) return 0;
  const amount = toAmount(money.amount);
  if (money.currency === CURRENCY_CODE.INR) return amount;
  const rate = lookup.get(fxKey(money.currency, CURRENCY_CODE.INR))?.fx_rate ?? 0;
  return amount * rate;
};

export const computeInstantSettlementInrBreakdown = (
  breakdown: InstantSettlementPreviewBreakdown | null | undefined,
  fxRates: FXRateResponse[]
): InstantSettlementInrBreakdown | null => {
  if (!breakdown) return null;
  const lookup = buildFxRateLookup(fxRates);

 const missingRate = buildFxCurrencyPairList(breakdown).some(
    ({ base }) => !lookup.get(fxKey(base, CURRENCY_CODE.INR))?.fx_rate
  );
  if (missingRate) return null;

  const grossInr = convertMoneyToInr(breakdown.grossAmount, lookup);
  const platformFeeInr = convertMoneyToInr(breakdown.platformFee, lookup);
  const regionalPremiumInr = convertMoneyToInr(breakdown.regionalPremium, lookup);
  const instantSettlementFeeInr = convertMoneyToInr(breakdown.instantSettlementFee, lookup);

  const netFeesInr = platformFeeInr + regionalPremiumInr + instantSettlementFeeInr;
  const taxPercent = toAmount(breakdown.gst?.taxPercent);
  const gstInr = breakdown.gst?.splitType === InstantSettlementGstSplitType.NONE ? 0 : (netFeesInr * taxPercent) / 100;
  const settledInr = grossInr - netFeesInr - gstInr;

  const grossCurrency = breakdown.grossAmount?.currency;
  const isGrossInr = grossCurrency === CURRENCY_CODE.INR;
  const grossRate = isGrossInr ? undefined : lookup.get(fxKey(grossCurrency, CURRENCY_CODE.INR));

  return {
    grossInr: roundTo(grossInr, 2),
    platformFeeInr: roundTo(platformFeeInr, 2),
    regionalPremiumInr: roundTo(regionalPremiumInr, 2),
    instantSettlementFeeInr: roundTo(instantSettlementFeeInr, 2),
    netFeesInr: roundTo(netFeesInr, 2),
    gstInr: roundTo(gstInr, 2),
    gstSplitType: breakdown.gst?.splitType ?? InstantSettlementGstSplitType.NONE,
    settledInr: roundTo(settledInr, 2),
    fxRateUsed: isGrossInr ? 1 : roundTo(grossRate?.fx_rate ?? 0, 4),
    fxRateTimestamp: grossRate?.api_timestamp ?? "",
  };
};