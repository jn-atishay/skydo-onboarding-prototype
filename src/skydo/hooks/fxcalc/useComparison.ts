import { FXRateResponse } from "../../types";
import { calculateCostForOtherPaymentMethod, calculateCostForSkydo } from "./core";
import { PAYMENT_METHOD } from "./types";

const useComparison = ({
  amount,
  currency,
  fxRates,
}: {
  amount: number;
  currency: string;
  fxRates: FXRateResponse[];
}) => {
  const baseToUsd = fxRates.filter((fx) => {
    return fx.target === "USD" && fx.base === currency;
  })?.[0]?.fx_rate;
  const baseToInr = fxRates.filter((fx) => {
    return fx.target === "INR" && fx.base === currency;
  })?.[0]?.fx_rate;

  const competitorCost = calculateCostForOtherPaymentMethod({
    paymentMethod: PAYMENT_METHOD.BANK,
    amount: amount,
    currency: currency,
    baseToInr: baseToInr,
    baseToUsd: baseToUsd,
    noOfTransactions: 1,
  });

  const skydoCost = calculateCostForSkydo({
    amount: amount,
    currency: currency,
    baseToUsd: baseToUsd,
    baseToInr: baseToInr,
  });

  const savings = Math.max(skydoCost.finalInrAmountPostGst - (competitorCost.finalInrAmountPostGst ?? 0), 0);

  return {
    competitorCost,
    skydoCost,
    savings,
  }
};

export default useComparison;