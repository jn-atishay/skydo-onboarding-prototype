import log from "./logger";
import {
  CurrencyWiseImporterPaymentSummaryResponse,
  ImportersListResponse,
  ImporterSummaryResponse,
  RevenueSummaryChartDto,
} from "../types";
import { create, zustandDevtools } from "./index";

interface AnalyticsCache extends AnalyticsCacheState {
  setAnalyticsCache: (values: AnalyticsCacheState) => void;
  setRevenueSummaryCache: (key: string, value: RevenueSummaryChartDto[]) => void;
  setBusinessRevenueSummaryCache: (key: string, value: RevenueSummaryChartDto[]) => void;
  setImporterCurrencyLevelSummaryCache: (key: string, value?: CurrencyWiseImporterPaymentSummaryResponse) => void;
  setImporterRevenueSummaryCache: (key: string, value?: ImporterSummaryResponse) => void;
  setImportersListResponseCache: (value: ImportersListResponse[]) => void;
  setFxRateMap: (value: { [key: string]: number }) => void;
}

export type AnalyticsCacheState = {
  monthlyRevenueSummaryCache: { [key: string]: RevenueSummaryChartDto[] };
  importerCurrencyLevelSummaryCache: { [key: string]: CurrencyWiseImporterPaymentSummaryResponse };
  businessRevenueSummaryCache: { [key: string]: RevenueSummaryChartDto[] };
  importerRevenueSummaryCache: { [key: string]: ImporterSummaryResponse };
  importersListResponseCache: ImportersListResponse[];
  fxRateMap: { [key: string]: number };
};

const useAnalyticsCacheStore = create<AnalyticsCache>()(
  zustandDevtools(
    log((set: any) => ({
      monthlyRevenueSummaryCache: {},
      importerCurrencyLevelSummaryCache: {},
      businessRevenueSummaryCache: {},
      importerRevenueSummaryCache: {},
      importersListResponseCache: [],
      fxRateMap: {},
      setAnalyticsCache: (values: AnalyticsCache) => {
        set((store: AnalyticsCache) => ({ ...store, ...values }));
      },
      setImportersListResponseCache: (value: ImportersListResponse[]) => {
        set((store: AnalyticsCache) => {
          return {
            ...store,
            importersListResponseCache: value,
          };
        });
      },
      setRevenueSummaryCache: (key: string, value: RevenueSummaryChartDto[]) => {
        set((store: AnalyticsCache) => {
          return {
            ...store,
            monthlyRevenueSummaryCache: {
              ...store.monthlyRevenueSummaryCache,
              [key]: value,
            },
          };
        });
      },
      setBusinessRevenueSummaryCache: (key: string, value: RevenueSummaryChartDto[]) => {
        set((store: AnalyticsCache) => {
          return {
            ...store,
            businessRevenueSummaryCache: {
              ...store.businessRevenueSummaryCache,
              [key]: value,
            },
          };
        });
      },
      setImporterCurrencyLevelSummaryCache: (key: string, value?: CurrencyWiseImporterPaymentSummaryResponse) => {
        if (value) {
          set((store: AnalyticsCache) => {
            return {
              ...store,
              importerCurrencyLevelSummaryCache: {
                ...store.importerCurrencyLevelSummaryCache,
                [key]: value,
              },
            };
          });
        }
      },
      setImporterRevenueSummaryCache: (key: string, value?: ImporterSummaryResponse) => {
        if (value) {
          set((store: AnalyticsCache) => {
            return {
              ...store,
              importerRevenueSummaryCache: {
                ...store.importerRevenueSummaryCache,
                [key]: value,
              },
            };
          });
        }
      },
      setFxRateMap: (fxRateMap: { [key: string]: number }) => {
        set((store: AnalyticsCache) => {
          return {
            ...store,
            fxRateMap: fxRateMap,
          };
        });
      },
    }))
  )
);
export default useAnalyticsCacheStore;
