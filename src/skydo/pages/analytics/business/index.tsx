import BusinessAnalytics from "../../../components/BusinessAnalytics";
import { useEffect, useState } from "react";
import beCall from "../../../util/beCall";
import BE_ROUTES from "../../../util/beRoutes";
import MonthlySummaryType, { GroupingOptionType } from "../../../components/BusinessAnalytics/constants";
import { ALLOWED_METHODS } from "../../../constants/apiConstants";
import { ResponseWrapper } from "../../../authentication/api/AuthApiDto";
import { BusinessAnalyticsResponse, ImporterSummaryResponse } from "../../../types";
import useAnalyticsDetailsStore from "../../../store/useAnalyticesStore";
import useAnalyticsCacheStore from "../../../store/useAnalyticsCacheStore";
import withAuth from "../../../authentication/WithAuth";
import { getDisabledGroupingOption } from "../../../util/analyticsUtil";

const BusinessAnalyticsPage = () => {
  const [isLoadingMonthlySummary, setIsLoadingMonthlySummary] = useState<boolean>(true);
  const [isLoadingImporterSummary, setIsLoadingImporterSummary] = useState<boolean>(true);

  const {
    businessRevenueSummaryCache,
    setBusinessRevenueSummaryCache,
    setImporterRevenueSummaryCache,
    importerRevenueSummaryCache,
    setFxRateMap,
  } = useAnalyticsCacheStore();

  const { analyticsOption, startDate, endDate, setDisabledGroupingOption, setGroupingOption, groupingOption } =
    useAnalyticsDetailsStore();

  const onMonthlyRevenueSummarySuccess = (response: ResponseWrapper<BusinessAnalyticsResponse>, key: string) => {
    if (response.success) {
      setIsLoadingMonthlySummary(false);
      setBusinessRevenueSummaryCache(key, response.data?.businessAnalyticsData || []);
      setFxRateMap(response.data?.fxRateMap || {});
      const disabledGps = getDisabledGroupingOption(response.data?.businessAnalyticsData || [], startDate, endDate);
      setDisabledGroupingOption(disabledGps);
      if (disabledGps.includes(groupingOption)) setGroupingOption(GroupingOptionType.YEARLY);
    } else onMonthlyRevenueSummaryError(response);
  };

  const onMonthlyRevenueSummaryError = (error: any) => {
    setIsLoadingMonthlySummary(false);
  };

  const fetchMonthlyRevenueSummary = (monthlySummary: MonthlySummaryType) => {
    setIsLoadingMonthlySummary(true);
    beCall({
      path: BE_ROUTES.FETCH_MONTHLY_SUMMARY.replace(":startDate", startDate).replace(":endDate", endDate),
      method: ALLOWED_METHODS.GET,
      onSuccess: (data) => onMonthlyRevenueSummarySuccess(data, monthlySummary),
      onError: onMonthlyRevenueSummaryError,
    });
  };

  const onImporterRevenueSummarySuccess = (response: ResponseWrapper<ImporterSummaryResponse>, key: string) => {
    if (response.success) {
      setIsLoadingImporterSummary(false);
      setImporterRevenueSummaryCache(key, response.data);
    } else onImporterRevenueSummaryError(response);
  };

  const onImporterRevenueSummaryError = (error: any) => {
    setIsLoadingImporterSummary(false);
  };

  const fetchImporterLevelSummary = (monthlySummary: MonthlySummaryType) => {
    setIsLoadingImporterSummary(true);
    beCall({
      path: BE_ROUTES.FETCH_IMPORTER_SUMMARY.replace(":startDate", startDate).replace(":endDate", endDate),
      method: ALLOWED_METHODS.GET,
      onSuccess: (data) => onImporterRevenueSummarySuccess(data, monthlySummary),
      onError: onImporterRevenueSummaryError,
    });
  };

  useEffect(() => {
    fetchMonthlyRevenueSummary(analyticsOption);
    fetchImporterLevelSummary(analyticsOption);
  }, [analyticsOption, startDate, endDate]);

  return (
    <BusinessAnalytics
      monthlyRevenueSummary={businessRevenueSummaryCache[analyticsOption]}
      importerRevenueSummary={importerRevenueSummaryCache[analyticsOption]}
      isLoadingMonthlySummary={businessRevenueSummaryCache[analyticsOption] ? false : isLoadingMonthlySummary}
      isLoadingImporterSummary={importerRevenueSummaryCache[analyticsOption] ? false : isLoadingImporterSummary}
    />
  );
};

export default withAuth(BusinessAnalyticsPage);
