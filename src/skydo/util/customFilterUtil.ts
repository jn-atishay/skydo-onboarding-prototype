import { FilterOption } from "../types/Filters";
import { RESOLVABLE_PERIOD_VALUES } from "../constants/dateFilterConstants";
import Locale from "./locale/en";

export const isCustomInvoiceDateFilter = (val: string): boolean => !RESOLVABLE_PERIOD_VALUES.includes(val);

const CUSTOM_RANGE_PATTERN = /^CUSTOM(\d{4}-\d{2}-\d{2})TO(\d{4}-\d{2}-\d{2})$/;

export const isValidCustomInvoiceDateFilter = (val: string): boolean => CUSTOM_RANGE_PATTERN.test(val);

export const getStartAndEndDateFromAValidCustomInvoiceDateFilter = (val: string): string[] => {
  return [val.split("CUSTOM")[1].split("TO")[0], val.split("CUSTOM")[1].split("TO")[1]];
};

export const getURLQueryParamFromDateString = (dateString: string): string => {
  const date = new Date(dateString);
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `CUSTOM_${month}_${year}`;
};

export const getUrlQueryParamsFromStartAndEndDate = (startDate: string, endDate: string): string => {
  return `CUSTOM${startDate}TO${endDate}`;
};

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const getCustomRangeLabel = (startDate: string, endDate: string): string => {
  const toDisplay = (value: string): string => value.split("-").reverse().join("/");
  return `${toDisplay(startDate)} ${Locale.dateRangeSeparator} ${toDisplay(endDate)}`;
};

export const getCustomFilterOptionOfValidFilterValue = (val: string): FilterOption => {
  const [startDate, endDate] = getStartAndEndDateFromAValidCustomInvoiceDateFilter(val);
  return {
    value: val,
    label: getCustomRangeLabel(startDate, endDate),
  };
};

export const convertDateToString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
