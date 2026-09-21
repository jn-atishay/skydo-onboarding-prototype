import Locale from "../../util/locale/en";
import React, { useMemo, useState } from "react";
import Popup from "../AtomicComponents/Popup";
import SuggestionPopupContent from "./SuggestionPopupContent";
import PageHeader from "../Common/PageHeader";
import ClientLevelRevenueChart from "./ClientLevelRevenueChart";
import ChartWrapper from "../Common/ChartWrapper";
import MonthlyRevenueChart from "../Common/MonthlyRevenueChart";
import GraphEmptyState from "../Icons/GraphEmptyState";
import Typography from "../AtomicComponents/Typography";
import {
  BUTTON_SIZES,
  DropdownSizes,
  INPUT_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import { ImporterSummaryResponse, RevenueSummaryChartDto } from "../../types";
import ChartLoader from "./ChartLoader";
import MonthlySummaryType, { analyticsOptionList, SUGGESTION_POPUP_TYPES } from "./constants";
import AnalyticsSelector from "../ClientAnalyticsComp/AnalyticsSelector";
import useAnalyticsDetailsStore from "../../store/useAnalyticesStore";
import NoChartDataAvailableCard from "../Common/NoChartDataAvailableCard";
import { getUrlQueryParamsFromStartAndEndDate } from "../../util/customFilterUtil";
import { useRouter } from "next/router";
import FE_ROUTES from "../../util/feRoutes";
import { DEFAULT_PAGE_SIZE, PAGE_QUERY, PAGE_SIZE_QUERY } from "../../types/Filters";
import { getRevChartTitle, transformImporterSummary, transformMonthlyRevenueData } from "../../util/analyticsUtil";
import useAnalyticsCacheStore from "../../store/useAnalyticsCacheStore";
import AnalyticsGroupSelector from "../Common/AnalyticsGroupSelector";
import SelectDropdown from "../AtomicComponents/Dropdown/SelectDropdown";
import AnalyticsCustomDateOption from "../Common/AnalyticsCustomDateOption";
import CurrencyInput from "../Common/CurrencyInput";
import { analyticsCurrencyList } from "../../constants/dashboardConstants";
import MessageBox from "../InvoiceDetails/MessageBox";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  monthlyRevenueSummary?: RevenueSummaryChartDto[];
  importerRevenueSummary?: ImporterSummaryResponse;
  isLoadingMonthlySummary: boolean;
  isLoadingImporterSummary: boolean;
}

const BusinessAnalytics = (props: Props) => {
  const {
    monthlyRevenueSummary = [],
    isLoadingMonthlySummary,
    isLoadingImporterSummary,
    importerRevenueSummary = {
      top5ImporterList: [],
      totalImporterCount: 0,
      totalInvoicedAmount: 0,
      otherImporterSummary: {
        paidAmount: 0,
        invoicedAmount: 0,
        pending: 0,
      },
    },
  } = props;

  const {
    analyticsOption,
    setAnalyticsOption,
    groupingOption,
    startDate,
    endDate,
    analyticsCurrency,
    setAnalyticsCurrency,
  } = useAnalyticsDetailsStore();
  const router = useRouter();
  const analytics = useAnalytics();

  const { fxRateMap } = useAnalyticsCacheStore();

  const [suggestionPopupType, setSuggestionPopupType] = useState("");
  const isNoData = useMemo(() => {
    return (
      monthlyRevenueSummary.reduce((totalInvoicedAmount, monthRevenue: RevenueSummaryChartDto) => {
        totalInvoicedAmount += monthRevenue.invoicedAmount;
        return totalInvoicedAmount;
      }, 0) === 0
    );
  }, [monthlyRevenueSummary]);

  const onBarClick = (barData: any) => {
    const customQuery = getUrlQueryParamsFromStartAndEndDate(barData?.startDate, barData?.endDate);
    analytics?.trackAsync(Events.ANALYTICS.REVENUE_GRAPH_CLICK);
    router.push({
      pathname: FE_ROUTES.INVOICES,
      query: {
        invoice_date: customQuery,
        [PAGE_QUERY]: 0,
        [PAGE_SIZE_QUERY]: DEFAULT_PAGE_SIZE,
      },
    });
  };

  const selectedOptionLabel = analyticsOptionList.find((el) => el.value == analyticsOption)?.label;
  const onCloseSuggestionPopup = () => setSuggestionPopupType("");

  // Data Transformation
  const currencyMultiplier = 1 / (fxRateMap[analyticsCurrency] || 1);
  const monthlyRevenueChartData = transformMonthlyRevenueData(
    monthlyRevenueSummary,
    currencyMultiplier,
    startDate,
    endDate,
    groupingOption
  );
  const importerRevenueChartData = transformImporterSummary(importerRevenueSummary, currencyMultiplier);

  return (
    <div className={"flex flex-row h-full"}>
      <AnalyticsSelector />
      <div className={"flex flex-row justify-center bg-white flex-1 p-6 min-w-0"}>
        <div className={"flex-1 flex flex-col max-w-subNavBarMaxContentWidth min-w-0"}>
          <div className={"flex flex-row justify-between"}>
            <PageHeader title={Locale.businessOverview} />
            <div className={"flex flex-row space-x-4 items-start"}>
              <div className={"min-w-[130px]"}>
                <CurrencyInput
                  hideLabel={true}
                  selectedCurrency={analyticsCurrency}
                  className={"!w-full !max-w-full"}
                  onCurrencySelect={setAnalyticsCurrency}
                  textInputSize={INPUT_TYPES.MEDIUM}
                  currencyList={analyticsCurrencyList}
                />
              </div>
              <SelectDropdown
                optionsContainerClass={"!overflow-visible !max-h-[400px]"}
                placeholder={Locale.selectOne}
                onSelect={(value: any, option: any) => {
                  analytics?.trackAsync(Events.ANALYTICS.DURATION_DROP_DOWN_CLICK, { duration: value });
                  setAnalyticsOption(value);
                }}
                selectedValue={analyticsOption}
                size={DropdownSizes.Medium}
                options={analyticsOptionList.map((el) => {
                  return {
                    ...el,
                    customRow:
                      el.value == MonthlySummaryType.CUSTOM
                        ? (
                            el,
                            idx,
                            onOptionClick?: (val: string, isDisabled?: boolean, event?: any) => void,
                            selectedValue?: unknown
                          ) => (
                            <AnalyticsCustomDateOption
                              option={el}
                              index={idx}
                              changeLabel={onOptionClick}
                              selectedValue={selectedValue}
                            />
                          )
                        : undefined,
                  };
                })}
                isError={false}
              />
            </div>
          </div>
          {analyticsCurrency != "INR" ? (
            <MessageBox
              message={`Revenue converted at live mid-market rate 1${analyticsCurrency} = ${fxRateMap[analyticsCurrency]} INR `}
              className={"!mt-2 !p-2 !border-blue-200"}
            />
          ) : null}
          <ChartWrapper
            title={getRevChartTitle(groupingOption, analyticsCurrency)}
            containerClass={"border border-black-400 mt-4 !overflow-visible"}
            subtitle={`(${selectedOptionLabel})`}
            hideSubtitle={!selectedOptionLabel}
          >
            {isLoadingMonthlySummary ? (
              <ChartLoader />
            ) : (
              <>
                <div className={"flex flex-row justify-end mb-6 mt-4"}>
                  <AnalyticsGroupSelector />
                </div>
                <MonthlyRevenueChart
                  showNoDataComponent={isNoData}
                  revenueSummary={monthlyRevenueChartData}
                  dateFormattingOptions={{ month: "short", year: "numeric" }}
                  chartHeight={214}
                  onBarClick={onBarClick}
                  currency={analyticsCurrency}
                  showXLabel={true}
                />
              </>
            )}
          </ChartWrapper>
          <ChartWrapper
            title={isLoadingImporterSummary ? undefined : Locale.clientLevelRevenue + ` in ${analyticsCurrency}`}
            containerClass={"border border-black-400 mt-6"}
            hideColorIndicator={true}
            subtitle={
              importerRevenueChartData.top5ImporterList.length
                ? Locale.clientLevelRevenueWithTop5
                    .replace(
                      ":top",
                      (importerRevenueChartData?.top5ImporterList?.length <= 5
                        ? importerRevenueChartData?.top5ImporterList?.length
                        : 5
                      ).toString()
                    )
                    .replace(":total", importerRevenueChartData?.totalImporterCount.toString())
                : undefined
            }
          >
            <div className={"flex flex-row justify-between mt-4"}>
              {isLoadingImporterSummary ? (
                <ChartLoader containerClass={"border border-black-400 mt-6 bg-white rounded-10px p-4"} />
              ) : importerRevenueChartData.top5ImporterList.length ? (
                <ClientLevelRevenueChart clientLevelSummary={importerRevenueChartData} currency={analyticsCurrency} />
              ) : (
                <NoChartDataAvailableCard />
              )}
            </div>
          </ChartWrapper>
          <div className={"flex_row_item_center justify-between py-2 px-4 border border-black-400 rounded-10px mt-4"}>
            <div className={"flex_row_item_center"}>
              <GraphEmptyState />
              <Typography
                text={Locale.describeBusinessFeedback}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses={"ml-4"}
              />
            </div>
            <Button
              title={Locale.shareFeedbackButton}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={() => setSuggestionPopupType(SUGGESTION_POPUP_TYPES.METRICS)}
            />
          </div>
        </div>
      </div>
      <Popup
        renderContent={() => (
          <SuggestionPopupContent closePopup={onCloseSuggestionPopup} popupType={suggestionPopupType} />
        )}
        open={!!suggestionPopupType}
        closeIconClick={onCloseSuggestionPopup}
        isCommonHeader={true}
        title={Locale.shareFeedback}
        isDashboardPopup={true}
        outsideClick={onCloseSuggestionPopup}
      />
    </div>
  );
};

export default BusinessAnalytics;
