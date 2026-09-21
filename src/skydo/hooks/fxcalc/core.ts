import {
  BANK_FIRA_FEE_USD,
  BANK_FX_MARGIN,
  BANK_TRANSACTION_FEE_USD,
  BANK_WIRE_FEE_USD,
  PAYONEER_FX_MARGIN,
  PAYONEER_TRANSACTION_FEE,
  PAYPAL_FX_MARGIN,
  PAYPAL_TRANSACTION_FEE,
  STRIPE_FX_MARGIN,
  STRIPE_TRANSACTION_FEE,
  USD_ASSUMED_TICKET_SIZE,
  USD_LOWER_PRICE,
  USD_LOWER_SLAB,
  USD_UPPER_PRICE,
  WISE_FIRA_FEE,
  WISE_TRANSACTION_FEES,
  WISE_WIRE_FEE,
} from "./constants";
import { PAYMENT_METHOD } from "./types";
import { GST_PERCENT } from "../../constants/hardCodedValues";

type BankCharges = {
  fxMargin: number;
  wireFee: number;
  firaFee: number;
  transactionFee: number;
};

enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  INR = "INR",
  CAD = "CAD",
  SGD = "SGD",
  AED = "AED",
  AUD = "AUD",
}

const RUPEE_SYMBOL = "₹";
const USD_SYMBOL = "$";
const EURO_SYMBOL = "€";
const GBP_SYMBOL = "£";
const CAD_SYMBOL = "CAD ";
const SGD_SYMBOL = "SGD ";
const AUD_SYMBOL = "AUD ";
const AED_SYMBOL = "AED ";

export const CURRENCY_SYMBOL_MAP: {
  [k: string]: string;
} = {
  [Currency.USD]: USD_SYMBOL,
  [Currency.EUR]: EURO_SYMBOL,
  [Currency.GBP]: GBP_SYMBOL,
  [Currency.INR]: RUPEE_SYMBOL,
  [Currency.CAD]: CAD_SYMBOL,
  [Currency.SGD]: SGD_SYMBOL,
  [Currency.AUD]: AUD_SYMBOL,
  [Currency.AED]: AED_SYMBOL,
};

type calculateCostForPaymentMethodProps = {
  paymentMethod: PAYMENT_METHOD;
  currency: string;
  baseToInr: number; // fx rate
  baseToUsd: number; // fx rate
  amount: number;
  noOfTransactions: number;
  bankCharges?: BankCharges;
};

type Cell = {
  value?: number | string;
  label: string;
};

export type CalculateCostForPaymentMethodReturn = {
  fxMargin: Cell;
  wireFee: Cell;
  firaFee: Cell;
  transactionFee: Cell;
  pureConversion?: number;
  conversionPostFees?: number;
  effectiveCost?: number;
  finalInrAmountPostGst?: number;
};

const getInputOrDefault = (input: any, defaultValue: number) => {
  if (input === undefined || input === null) return defaultValue;
  if (input === "" || isNaN(input)) {
    return 0;
  }
  return Number(input);
};

const convertCurrency = (base: string, target: string, fx: number, amountInBaseCurrency: number): number => {
  if (base === target) return amountInBaseCurrency;
  return amountInBaseCurrency / fx;
};

export const calculateCostForOtherPaymentMethod = (
  props: calculateCostForPaymentMethodProps
): CalculateCostForPaymentMethodReturn => {
  let { paymentMethod, currency, baseToInr, baseToUsd, amount, noOfTransactions } = props;
  const selectedCurrencySymbol = CURRENCY_SYMBOL_MAP[currency as Currency];
  const targetCurrencySymbol = CURRENCY_SYMBOL_MAP[Currency.INR];

  let selectedBankFx = getInputOrDefault(props.bankCharges?.fxMargin, BANK_FX_MARGIN);
  let selectedBankWireFee = getInputOrDefault(props.bankCharges?.wireFee, BANK_WIRE_FEE_USD);
  let selectedBankFiraFee = getInputOrDefault(props.bankCharges?.firaFee, BANK_FIRA_FEE_USD);
  let selectedBankTransactionFee = getInputOrDefault(props.bankCharges?.transactionFee, BANK_TRANSACTION_FEE_USD);

  let finalInrAmount = amount * baseToInr;
  const fxCost = amount * selectedBankFx;
  const wireFee = noOfTransactions * selectedBankWireFee * baseToInr;

  const firaFee = noOfTransactions * selectedBankFiraFee * baseToInr;
  const txnFees = noOfTransactions * selectedBankTransactionFee * baseToInr;
  finalInrAmount = finalInrAmount - fxCost - wireFee - firaFee - txnFees;
  finalInrAmount = Math.max(finalInrAmount, 0);
  const effectiveCost = 100 - (finalInrAmount / (amount * baseToInr)) * 100;

  let gst = GST_PERCENT * (wireFee + firaFee + txnFees);
  let finalInrAmountPostGst = Math.max(finalInrAmount - gst, 0);

  const fallbackResponse = {
    fxMargin: {
      label: `${targetCurrencySymbol}${selectedBankFx.toFixed(2)} / USD`,
      value: selectedBankFx,
    },
    wireFee: {
      label: `${selectedCurrencySymbol}${(noOfTransactions * selectedBankWireFee).toFixed(2)}`,
      value: (noOfTransactions * selectedBankWireFee).toFixed(2),
    },
    firaFee: {
      label: `${selectedCurrencySymbol}${(noOfTransactions * selectedBankFiraFee).toFixed(2)}`,
      value: (noOfTransactions * selectedBankFiraFee).toFixed(2),
    },
    transactionFee: {
      label: `${selectedCurrencySymbol}${(noOfTransactions * selectedBankTransactionFee).toFixed(2)}`,
      value: (noOfTransactions * selectedBankTransactionFee).toFixed(2),
    },
    pureConversion: amount * baseToInr,
    conversionPostFees: finalInrAmount,
    effectiveCost,
    finalInrAmountPostGst,
  };

  switch (paymentMethod) {
    case PAYMENT_METHOD.BANK:
      if (currency === Currency.USD) {
        return fallbackResponse;
      }
      const paisaPerSourceCurrency = selectedBankFx;
      const wireFeeSourceCurrency = selectedBankWireFee;
      const firaFeeSourceCurrency = selectedBankFiraFee;
      const transactionFeeSourceCurrency = selectedBankTransactionFee;

      let finalInrAmount2 = amount * baseToInr;
      const fxCost = amount * BANK_FX_MARGIN;
      const wireFee = noOfTransactions * wireFeeSourceCurrency * baseToInr;
      const firaFee = noOfTransactions * firaFeeSourceCurrency * baseToInr;
      const txnFees = noOfTransactions * transactionFeeSourceCurrency * baseToInr;
      finalInrAmount2 = finalInrAmount2 - fxCost - wireFee - firaFee - txnFees;
      const effectiveCost = 100 - (finalInrAmount2 / (amount * baseToInr)) * 100;
      gst = GST_PERCENT * (wireFee + firaFee + txnFees);
      finalInrAmountPostGst = Math.max(finalInrAmount2 - gst, 0);

      return {
        fxMargin: {
          label: `${targetCurrencySymbol}${paisaPerSourceCurrency.toFixed(2)} / ${currency}`,
          value: paisaPerSourceCurrency,
        },
        wireFee: {
          label: `${selectedCurrencySymbol}${(noOfTransactions * wireFeeSourceCurrency).toFixed(2)}`,
          value: (noOfTransactions * wireFeeSourceCurrency).toFixed(2),
        },
        firaFee: {
          label: `${selectedCurrencySymbol}${(noOfTransactions * firaFeeSourceCurrency).toFixed(2)}`,
          value: (noOfTransactions * firaFeeSourceCurrency).toFixed(2),
        },
        transactionFee: {
          label: `${selectedCurrencySymbol}${(noOfTransactions * transactionFeeSourceCurrency).toFixed(2)}`,
          value: (noOfTransactions * transactionFeeSourceCurrency).toFixed(2),
        },
        pureConversion: amount * baseToInr,
        conversionPostFees: finalInrAmount2,
        effectiveCost,
        finalInrAmountPostGst,
      };

    case PAYMENT_METHOD.OTHER_PLATFORMS:
      console.error("not supported now");
      return fallbackResponse;

    case PAYMENT_METHOD.PAYPAL:
      let finalAmountPaypal = amount * baseToInr;
      let totalPercentagePaypal = PAYPAL_FX_MARGIN + PAYPAL_TRANSACTION_FEE;
      finalAmountPaypal = finalAmountPaypal - (finalAmountPaypal * totalPercentagePaypal) / 100;
      let gstPaypal = GST_PERCENT * ((amount * PAYPAL_TRANSACTION_FEE * baseToInr) / 100);
      finalInrAmountPostGst = finalAmountPaypal - gstPaypal;

      return {
        effectiveCost: totalPercentagePaypal,
        pureConversion: amount * baseToInr,
        conversionPostFees: finalAmountPaypal * baseToInr,
        fxMargin: {
          label: `${PAYPAL_FX_MARGIN}%`,
          value: PAYPAL_FX_MARGIN,
        },
        wireFee: {
          label: `${selectedCurrencySymbol}0`,
        },
        firaFee: {
          label: `${selectedCurrencySymbol}0`,
        },
        transactionFee: {
          label: `${PAYPAL_TRANSACTION_FEE}%`,
          value: PAYPAL_TRANSACTION_FEE,
        },
        finalInrAmountPostGst,
      };

    case PAYMENT_METHOD.STRIPE:
      let finalAmountStripe = amount * baseToInr;
      let totalPercentageStripe = STRIPE_FX_MARGIN + STRIPE_TRANSACTION_FEE;
      finalAmountStripe = finalAmountStripe - (finalAmountStripe * totalPercentageStripe) / 100;
      gst = GST_PERCENT * ((amount * STRIPE_TRANSACTION_FEE * baseToInr) / 100);
      finalInrAmountPostGst = Math.max(finalAmountStripe - gst, 0);

      return {
        effectiveCost: totalPercentageStripe,
        pureConversion: finalAmountStripe,
        conversionPostFees: finalAmountStripe * baseToInr,
        fxMargin: {
          label: `${STRIPE_FX_MARGIN}%`,
          value: STRIPE_FX_MARGIN,
        },
        wireFee: {
          label: `${selectedCurrencySymbol}0`,
        },
        firaFee: {
          label: `${selectedCurrencySymbol}0`,
        },
        transactionFee: {
          label: `${STRIPE_TRANSACTION_FEE}%`,
          value: STRIPE_TRANSACTION_FEE,
        },
        finalInrAmountPostGst,
      };

    case PAYMENT_METHOD.PAYONEER:
      let finalAmountPayoneer = amount * baseToInr;
      let totalPercentagePayoneer = PAYONEER_FX_MARGIN + PAYONEER_TRANSACTION_FEE;
      finalAmountPayoneer = finalAmountPayoneer - (finalAmountPayoneer * totalPercentagePayoneer) / 100;
      gst = GST_PERCENT * ((amount * PAYONEER_TRANSACTION_FEE * baseToInr) / 100);
      finalInrAmountPostGst = Math.max(finalAmountPayoneer - gst, 0);

      return {
        effectiveCost: totalPercentagePayoneer,
        pureConversion: amount * baseToInr,
        conversionPostFees: finalAmountPayoneer,
        fxMargin: {
          label: `${PAYONEER_FX_MARGIN}%`,
          value: PAYONEER_FX_MARGIN,
        },
        wireFee: {
          label: `${selectedCurrencySymbol}0`,
        },
        firaFee: {
          label: `${selectedCurrencySymbol}0`,
        },
        transactionFee: {
          label: `${PAYONEER_TRANSACTION_FEE}%`,
          value: PAYONEER_TRANSACTION_FEE,
        },
        finalInrAmountPostGst,
      };

    case PAYMENT_METHOD.WISE:
      if (currency === Currency.USD) {
        const percentageCost = (amount * WISE_TRANSACTION_FEES) / 100;
        const finalAmountWise = Math.max((amount - noOfTransactions * WISE_FIRA_FEE - percentageCost) * baseToInr, 0);
        gst = GST_PERCENT * (noOfTransactions * WISE_FIRA_FEE + percentageCost) * baseToInr;
        finalInrAmountPostGst = Math.max(finalAmountWise - gst, 0);
        return {
          pureConversion: amount * baseToInr,
          conversionPostFees: finalAmountWise,
          effectiveCost: 100 - (finalAmountWise / (amount * baseToInr)) * 100,
          fxMargin: {
            label: `${CURRENCY_SYMBOL_MAP[Currency.INR]}0.00 / ${currency.toString()}`,
            value: 0,
          },
          wireFee: {
            label: `${selectedCurrencySymbol}${(noOfTransactions * WISE_WIRE_FEE).toFixed(2)}`,
            value: noOfTransactions * WISE_WIRE_FEE,
          },
          firaFee: {
            label: `${selectedCurrencySymbol}${(noOfTransactions * WISE_FIRA_FEE).toFixed(2)}`,
            value: WISE_FIRA_FEE,
          },
          transactionFee: {
            label: `${WISE_TRANSACTION_FEES}%`,
            value: WISE_TRANSACTION_FEES,
          },
          finalInrAmountPostGst,
        };
      }

      const nonUsdWiseFixedFees = convertCurrency(currency, Currency.USD, baseToUsd, noOfTransactions * WISE_FIRA_FEE);
      const percentageCost = (amount * WISE_TRANSACTION_FEES) / 100;
      const finalAmountWise = Math.max((amount - nonUsdWiseFixedFees - percentageCost) * baseToInr, 0);
      gst = GST_PERCENT * (nonUsdWiseFixedFees + percentageCost) * baseToInr;
      finalInrAmountPostGst = Math.max(finalAmountWise - gst, 0);

      return {
        pureConversion: amount * baseToInr,
        conversionPostFees: finalAmountWise,
        effectiveCost: 100 - (finalAmountWise / (amount * baseToInr)) * 100,
        fxMargin: {
          label: `${CURRENCY_SYMBOL_MAP[Currency.INR]}0.00/${currency.toString()}`,
          value: 0,
        },
        wireFee: {
          label: `${selectedCurrencySymbol}0`,
          value: 0,
        },
        firaFee: {
          label: `${selectedCurrencySymbol}${nonUsdWiseFixedFees.toFixed(2)}`,
          value: nonUsdWiseFixedFees,
        },
        transactionFee: {
          label: `${WISE_TRANSACTION_FEES}%`,
          value: WISE_TRANSACTION_FEES,
        },
        finalInrAmountPostGst,
      };
  }

  return fallbackResponse;
};

export type SkydoFeesResponse = {
  usdFees: number;
  sourceCurrencyFees: number;
  effectiveCost: number;
  finalInrAmountPostGst: number;
};

export const calculateCostForSkydo = ({
  amount,
  currency,
  baseToUsd,
  baseToInr,
}: {
  amount: number;
  currency: string;
  baseToUsd: number; // fx rate
  baseToInr: number; // fx rate
}): SkydoFeesResponse => {
  let usdAmount = amount;
  if (currency !== Currency.USD) {
    usdAmount = convertCurrency(currency, Currency.USD, 1 / baseToUsd, amount);
  }

  let finalSkydoFeesAmountInUsd = 0;
  if (usdAmount <= USD_LOWER_SLAB) {
    finalSkydoFeesAmountInUsd = USD_LOWER_PRICE;
  } else if (usdAmount > USD_LOWER_SLAB && usdAmount <= USD_ASSUMED_TICKET_SIZE) {
    finalSkydoFeesAmountInUsd = USD_UPPER_PRICE;
  } else {
    finalSkydoFeesAmountInUsd = usdAmount * 0.003;
  }

  if (currency !== Currency.USD) {
    let finalSkydoFeesAmountInSourceCurrency = convertCurrency(
      Currency.USD,
      currency,
      baseToUsd,
      finalSkydoFeesAmountInUsd
    );
    const finalInrAmountPostGst = Math.max(0, baseToInr * (amount - 1.18 * finalSkydoFeesAmountInSourceCurrency));
    return {
      usdFees: finalSkydoFeesAmountInUsd,
      sourceCurrencyFees: finalSkydoFeesAmountInSourceCurrency,
      effectiveCost: (finalSkydoFeesAmountInSourceCurrency / amount) * 100,
      finalInrAmountPostGst,
    };
  }

  const finalInrAmountPostGst = Math.max(0, baseToInr * (amount - 1.18 * finalSkydoFeesAmountInUsd));

  return {
    usdFees: finalSkydoFeesAmountInUsd,
    sourceCurrencyFees: finalSkydoFeesAmountInUsd,
    effectiveCost: (finalSkydoFeesAmountInUsd / amount) * 100,
    finalInrAmountPostGst,
  };
};
