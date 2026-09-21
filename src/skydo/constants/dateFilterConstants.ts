import Locale from "../util/locale/en";
import MonthlySummaryType from "../components/BusinessAnalytics/constants";

export interface DatePeriodOption {
  value: string;
  label: string;
  showResolvedRange?: boolean;
}

export const DATE_PERIOD_OPTIONS: DatePeriodOption[] = [
  { value: MonthlySummaryType.LAST_MONTH, label: Locale.lastMonth, showResolvedRange: true },
  { value: MonthlySummaryType.LAST_6_MONTHS, label: Locale.last6Months, showResolvedRange: true },
  { value: MonthlySummaryType.LAST_12_MONTHS, label: Locale.last12Months, showResolvedRange: true },
  { value: MonthlySummaryType.CURRENT_FINANCIAL_YEAR, label: Locale.currFinYear, showResolvedRange: true },
  { value: MonthlySummaryType.LAST_FINANCIAL_YEAR, label: Locale.lastFinYear, showResolvedRange: true },
];

export const RESOLVABLE_PERIOD_VALUES: string[] = DATE_PERIOD_OPTIONS.map((option) => option.value);

export const DEFAULT_DATE_PERIOD = MonthlySummaryType.LAST_MONTH;

export const CUSTOM_DATE_PERIOD_OPTION: DatePeriodOption = {
  value: MonthlySummaryType.CUSTOM,
  label: Locale.custom,
};

export const DATE_PERIOD_OPTIONS_WITH_CUSTOM: DatePeriodOption[] = [...DATE_PERIOD_OPTIONS, CUSTOM_DATE_PERIOD_OPTION];
