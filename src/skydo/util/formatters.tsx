import { CURRENCY_CODE, LOCATION_CODE, LOCATION_CURRENCY_MAP } from "../constants/dashboardConstants";
import { CURRENCY_HTML_CODE, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../constants/atomicConstants";
import React from "react";
import Typography from "../components/AtomicComponents/Typography";

const defaultDateFormatOptions: any = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const formatUTCDate = (date: string | number, options: any = defaultDateFormatOptions): string => {
  if (!date) return "";
  /*
  converting date to utc time, since new date converts date to local time
  here adding the local time zone offset to the local time given by new Date
  */
  try {
    const _date = new Date();
    const offset = _date.getTimezoneOffset() * 60 * 1000;
    const utcTime = new Date(new Date(date).getTime() + offset);
    /* ----- */
    return new Intl.DateTimeFormat("en-IN", options).format(utcTime)?.replace("am", "AM")?.replace("pm", "PM");
  } catch (e) {
    return new Intl.DateTimeFormat("en-IN", options).format(new Date())?.replace("am", "AM")?.replace("pm", "PM");
  }
};

export const formatCurrencyWithSmallerDecimals = ({
  value,
  currency,
  maxFractionDigits = 2,
  minFractionDigits = 2,
}: {
  value: number;
  currency?: string;
  maxFractionDigits?: number;
  minFractionDigits?: number;
}) => {
  // Format the number with commas and specified decimal places
  const formattedNumber = Intl.NumberFormat("en", {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: minFractionDigits,
  }).format(value);

  // Split the formatted number into whole and decimal parts
  const parts = formattedNumber.split(".");
  const wholePart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

  // Return an object with separate whole and decimal parts
  return {
    wholePart: `${currency ? `${currency} ` : ""}${wholePart}`,
    decimalPart: decimalPart,
  };
};

/**
 * A regional payment carries a base fee in USD plus the 1% regional fee in the collection
 * currency. They are two separate charges, so both are shown ("CHF 50.00 + USD 29.00") rather
 * than one replacing the other. Returns "" when neither is present so callers can show a dash.
 */
export const formatSkydoCharges = (
  localCurrency?: string,
  localCharges?: number | null,
  usdCharges?: number | null
): string => {
  const format = (value: number) => formatINDNumber({ value, formatOptions: { minimumFractionDigits: 2 } });
  const parts: string[] = [];
  // A local charge already denominated in USD is the same money as usdCharges, not an addition.
  if (localCharges && localCurrency && localCurrency !== "USD") {
    parts.push(`${localCurrency} ${format(localCharges)}`);
  }
  if (usdCharges) parts.push(`USD ${format(usdCharges)}`);
  if (!parts.length && localCharges && localCurrency) parts.push(`${localCurrency} ${format(localCharges)}`);
  return parts.join(" + ");
};

export const formatDate = (date: string | number, options: any = defaultDateFormatOptions): string => {
  if (!date) return "";
  if (typeof date === "number") return formatUTCDate(date);
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(date))?.replace("am", "AM")?.replace("pm", "PM");
};

// "25 Jul, 2025" — Intl never inserts the comma, so the parts are joined by
// hand. Formatted in UTC so a YYYY-MM-DD date shows the same day in every zone.
export const formatDateShortComma = (date: string): string => {
  const parsed = new Date(date);
  if (!date || Number.isNaN(parsed.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(parsed);
  const value = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${value("day")} ${value("month")}, ${value("year")}`;
};

export const formatIncomingCurrency = (value: any, currency?: string): string => {
  let formattedVal = Intl.NumberFormat("en").format(value);
  if (formattedVal === "NaN") formattedVal = "0";
  return currency ? `${currency} ${formattedVal}` : formattedVal;
};

export const formatIncomingCurrencyWithNumber = ({
  value,
  maxFractionDigits,
  minFractionDigits,
  currency,
  options = {},
}: {
  value: any;
  maxFractionDigits?: number;
  minFractionDigits?: number;
  currency?: string;
  options?: { [key: string]: any };
}): string => {
  let formattedVal = Intl.NumberFormat("en", {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: minFractionDigits,
    ...options,
  }).format(value);
  if (formattedVal === "NaN") formattedVal = "0";
  return currency ? `${currency} ${formattedVal}` : formattedVal;
};

export const formatINDNumber = ({
  value,
  maximumFractionDigits,
  formatOptions = {},
}: {
  value: any;
  maximumFractionDigits?: number;
  formatOptions?: { [key: string]: any };
}) => {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits, ...formatOptions }).format(value);
};

export const roundTo = (number: number, places: number = 2) => {
  return +(Math.round(Number(number + "e+" + places)) + "e-" + places);
};

export const CURRENCY_SYMBOL_MAP: { [k: string]: string } = {
  INR: "₹",
};

export const formatIncomingCurrencyWithSymbol = ({
  value,
  currency,
  formatOptions = {},
}: {
  value: any;
  currency: string;
  formatOptions?: { [key: string]: any };
}): string => {
  const num =
    currency === "INR"
      ? Intl.NumberFormat("en-IN", formatOptions).format(value)
      : Intl.NumberFormat("en", formatOptions).format(value);

  return currency
    ? CURRENCY_SYMBOL_MAP[currency]
      ? `${CURRENCY_SYMBOL_MAP[currency]}${num}`
      : `${currency} ${num}`
    : num;
};

export const formatINDNumberWrap = ({
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = 0,
  formatOptions = {},
  displayAsCrore = false,
}: {
  value: number;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  formatOptions?: { [key: string]: any };
  displayAsCrore?: boolean;
}) => {
  if (isNaN(value)) return "Invalid input";

  if (displayAsCrore) {
    if (value < 10000000) {
      // For values less than 1 Crore, return the whole number
      return (
        CURRENCY_SYMBOL_MAP[CURRENCY_CODE.INR] +
        new Intl.NumberFormat("en-IN", {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
          ...formatOptions,
        }).format(value)
      );
    }

    const crores = value / 10000000; // Convert value to Crores

    // Format values in Crores with up to 2 decimal places
    return `${CURRENCY_SYMBOL_MAP[CURRENCY_CODE.INR]} ${crores.toFixed(2)} Cr`;
  }
};

export const formatIncomingNumber = ({
  value,
  formatOptions = {},
}: {
  value: any;
  formatOptions?: { [key: string]: any };
}): string => {
  return new Intl.NumberFormat("en", { ...formatOptions }).format(value);
};

export const formatINRNumber = ({
  value,
  isTrail,
  maximumFractionDigits,
  minimumFractionDigits,
  customFormatter,
  formatOptions = {},
}: {
  value: any;
  isTrail?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  customFormatter?: (val: any) => string;
  formatOptions?: { [key: string]: any };
}) => {
  let formattedVal = customFormatter
    ? customFormatter(value)
    : Intl.NumberFormat("en-IN", { maximumFractionDigits, minimumFractionDigits, ...formatOptions }).format(value);
  if (formattedVal === "NaN") formattedVal = "0";
  if (isTrail) return `${formattedVal} ${LOCATION_CURRENCY_MAP[LOCATION_CODE.IND]}`;
  return `${LOCATION_CURRENCY_MAP[LOCATION_CODE.IND]} ${formattedVal}`;
};

export const getRupeeIconFormattedNumber = (
  value: number,
  maxFractionDigit: number,
  minimumFractionDigits?: number
) => {
  return (
    <span>
      {CURRENCY_HTML_CODE.INR}
      {formatINDNumber({
        value: value,
        maximumFractionDigits: maxFractionDigit,
        formatOptions: { minimumFractionDigits: minimumFractionDigits },
      })}
    </span>
  );
};

export function capitalizeWords(str: string | null): string {
  return (
    str?.toLowerCase().replace(/\b\w/g, function (match: string) {
      return match.toUpperCase();
    }) || ""
  );
}

export function toPascalCase(str: string) {
  return str
    .toLowerCase()
    .split(/([^\w]+)/) // Split by non-word characters but keep the delimiters
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(""); // Join all parts back together, preserving symbols
}

export const ordinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export function numberToWords(number: number) {
  if (number === 1) return "";
  const singleDigits = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  const placeValue = ["", "thousand", "million", "billion", "trillion"];

  if (number === 0) {
    return singleDigits[0];
  }

  const chunkify = (num: number) => {
    const chunks = [];
    while (num > 0) {
      chunks.push(num % 1000);
      num = Math.floor(num / 1000);
    }
    return chunks;
  };

  const threeDigitsToWords = (num: number) => {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    let result = "";

    if (hundred > 0) {
      result += `${singleDigits[hundred]} hundred `;
    }

    if (remainder > 0) {
      if (remainder < 10) {
        result += singleDigits[remainder];
      } else if (remainder < 20) {
        result += teens[remainder - 10];
      } else {
        const ten = Math.floor(remainder / 10);
        const unit = remainder % 10;
        result += `${tens[ten]} ${singleDigits[unit]}`;
      }
    }

    return result.trim();
  };

  const chunks = chunkify(Math.abs(number));
  let result = "";

  chunks.forEach((chunk, index) => {
    if (chunk > 0) {
      const chunkWords = threeDigitsToWords(chunk);
      const place = placeValue[index];
      result = `${chunkWords} ${place} ${result}`;
    }
  });

  return result.trim();
}
