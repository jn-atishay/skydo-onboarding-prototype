import Locale from "../../util/locale/en";

export enum MonthlySummaryType {
  LAST_MONTH = "LAST_MONTH",
  LAST_3_MONTHS = "LAST_3_MONTHS",
  LAST_6_MONTHS = "LAST_6_MONTHS",
  LAST_12_MONTHS = "LAST_12_MONTHS",
  CURRENT_FINANCIAL_YEAR = "CURRENT_FINANCIAL_YEAR",
  LAST_FINANCIAL_YEAR = "LAST_FINANCIAL_YEAR",
  LIFETIME = "LIFETIME",
  CUSTOM = "CUSTOM",
}

export const analyticsOptionList = [
  { value: MonthlySummaryType.LAST_MONTH, label: Locale.lastMonth },
  { value: MonthlySummaryType.LAST_6_MONTHS, label: Locale.last6Months },
  { value: MonthlySummaryType.LAST_12_MONTHS, label: Locale.last12Months },
  { value: MonthlySummaryType.CURRENT_FINANCIAL_YEAR, label: Locale.currFinYear },
  { value: MonthlySummaryType.LAST_FINANCIAL_YEAR, label: Locale.lastFinYear },
  { value: MonthlySummaryType.LIFETIME, label: Locale.lifetime },
  { value: MonthlySummaryType.CUSTOM, label: Locale.custom },
];
export default MonthlySummaryType;

export const SUGGESTION_POPUP_TYPES = {
  NAV_BAR_ANALYTICS: "NAV_BAR_ANALYTICS",
  METRICS: "METRICS",
  CLIENT_METRICS: "CLIENT_METRICS",
  NAV_BAR_INTERNATIONAL_ACCOUNTS: "NAV_BAR_INTERNATIONAL_ACCOUNTS",
  NAV_BAR_INT_ACC_PLATFORM: "NAV_BAR_INT_ACC_PLATFORM",
  NEED_HELP_OTHER_PLATFORMS: "NEED_HELP_OTHER_PLATFORMS",
  CLIENTS_DETAIL_PAGE: "CLIENTS_DETAIL_PAGE",
  HAVE_MORE_QUESTIONS: "HAVE_MORE_QUESTIONS",
};

export enum GroupingOptionType {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}

export const groupingOptionList = [
  { value: GroupingOptionType.MONTHLY, label: Locale.monthly },
  { value: GroupingOptionType.QUARTERLY, label: Locale.quarterly },
  { value: GroupingOptionType.YEARLY, label: Locale.yearly },
];
