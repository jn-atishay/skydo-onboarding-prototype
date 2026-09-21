import log from "./logger";
import { create, zustandDevtools } from "./index";
import { GroupingOptionType, MonthlySummaryType } from "../components/BusinessAnalytics/constants";
import { convertDateToString } from "../util/customFilterUtil";
import { getEndDateFromSummaryType, getStartDateFromSummaryType } from "../util/analyticsUtil";

interface AnalyticsDetails {
  analyticsOption: MonthlySummaryType;
  importerId: string;
  setAnalyticsDetails: (values: AnalyticsDetailsState) => void;
  setImporterId: (importerId: string) => void;
  setAnalyticsOption: (analyticsOption: MonthlySummaryType) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  startDate: string;
  endDate: string;
  groupingOption: GroupingOptionType;
  analyticsCurrency: string;
  setAnalyticsCurrency: (currency: string) => void;
  setGroupingOption: (groupingOption: GroupingOptionType) => void;
  disabledGroupingOption: GroupingOptionType[];
  setDisabledGroupingOption: (disabledGroupingOption: GroupingOptionType[]) => void;
}

export type AnalyticsDetailsState = {
  analyticsOption?: MonthlySummaryType;
  importerId?: string;
};

const useAnalyticsDetailsStore = create<AnalyticsDetails>()(
  zustandDevtools(
    log((set: any) => ({
      analyticsOption: MonthlySummaryType.LAST_6_MONTHS,
      importerId: "",
      startDate: getStartDateFromSummaryType(MonthlySummaryType.LAST_6_MONTHS),
      endDate: convertDateToString(new Date()),
      groupingOption: GroupingOptionType.MONTHLY,
      analyticsCurrency: "INR",
      disabledGroupingOption: [],
      setImporterId: (importerId: string) => {
        set((store: AnalyticsDetails) => ({ ...store, importerId }));
      },

      setAnalyticsOption: (analyticsOption: MonthlySummaryType) => {
        set((store: AnalyticsDetails) => ({
          ...store,
          analyticsOption,
        }));
        if (analyticsOption != MonthlySummaryType.CUSTOM) {
          // Start date and end date is set by custom calendar and not derived from monthly summary type
          set((store: AnalyticsDetails) => ({
            ...store,
            startDate: getStartDateFromSummaryType(analyticsOption),
            endDate: getEndDateFromSummaryType(analyticsOption),
          }));
        }
      },

      setAnalyticsDetails: (values: AnalyticsDetailsState) => {
        set((store: AnalyticsDetails) => ({ ...store, ...values }));
      },

      setStartDate: (startDate: string) => {
        set((store: AnalyticsDetails) => ({ ...store, startDate }));
      },

      setEndDate: (endDate: string) => {
        set((store: AnalyticsDetails) => ({ ...store, endDate }));
      },

      setGroupingOption: (groupingOption: GroupingOptionType) => {
        set((store: AnalyticsDetails) => ({ ...store, groupingOption }));
      },

      setAnalyticsCurrency: (analyticsCurrency: string) => {
        set((store: AnalyticsDetails) => ({ ...store, analyticsCurrency }));
      },

      setDisabledGroupingOption: (disabledGroupingOption: GroupingOptionType[]) => {
        set((store: AnalyticsDetails) => ({ ...store, disabledGroupingOption }));
      },
    }))
  )
);
export default useAnalyticsDetailsStore;
