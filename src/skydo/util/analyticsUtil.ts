import MonthlySummaryType, { groupingOptionList, GroupingOptionType } from "../components/BusinessAnalytics/constants";
import { ImporterSummaryResponse, RevenueSummaryChartDto } from "../types";

export const groupingMonthlyRevenueDate = (
  monthlyRevenueSummary: RevenueSummaryChartDto[],
  startDate: string,
  endDate: string,
  groupOption: GroupingOptionType
): RevenueSummaryChartDto[] => {
  const months = monthlyRevenueSummary.map((el) => new Date(el.month)).sort((a, b) => a.getTime() - b.getTime());
  const adjustedStart = startDate == "" ? months[0] : new Date(startDate);
  const adjustedEnd = endDate == "" ? months[months.length - 1] : new Date(endDate);

  let pointer = adjustedStart;
  const result: RevenueSummaryChartDto[] = [];
  const sortedData = monthlyRevenueSummary.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  let dataPointer = 0;
  while (pointer < adjustedEnd) {
    const pointerGroupLabel = getGroupLabelFromDate(pointer, groupOption);
    let pointerGroupEnd = getGroupEndDate(pointer, groupOption);
    pointerGroupEnd = pointerGroupEnd > adjustedEnd ? adjustedEnd : pointerGroupEnd;
    const isDataIncomplete =
      !areDatesEqual(getGroupStartDate(pointer, groupOption), pointer) ||
      !areDatesEqual(getGroupEndDate(pointer, groupOption), pointerGroupEnd);
    const groupEl: RevenueSummaryChartDto = {
      month: pointerGroupLabel,
      paidAmount: 0,
      invoicedAmount: 0,
      pending: 0,
      startDate: formatDateToYYYYMMDD(pointer),
      endDate: formatDateToYYYYMMDD(pointerGroupEnd),
      isDataIncomplete: isDataIncomplete,
    };

    while (dataPointer < sortedData.length && new Date(sortedData[dataPointer].month) <= pointerGroupEnd) {
      groupEl.paidAmount += sortedData[dataPointer].paidAmount;
      groupEl.invoicedAmount += sortedData[dataPointer].invoicedAmount;
      groupEl.pending += sortedData[dataPointer].pending;
      dataPointer++;
    }

    result.push(groupEl);

    pointer = new Date(pointerGroupEnd.getFullYear(), pointerGroupEnd.getMonth(), pointerGroupEnd.getDate() + 1);
  }
  return result;
};

const areDatesEqual = (date1: Date, date2: Date) => {
  return (
    date1.getDate() == date2.getDate() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getFullYear() == date2.getFullYear()
  );
};

export const getGroupStartDate = (date: Date, groupOption: GroupingOptionType): Date => {
  const currMonth = date.getMonth();
  const currYear = date.getFullYear();
  switch (groupOption) {
    case GroupingOptionType.MONTHLY:
      return new Date(currYear, date.getMonth(), 1);
    case GroupingOptionType.QUARTERLY:
      if (currMonth < 3) return new Date(currYear, 0, 1);
      if (currMonth < 6) return new Date(currYear, 3, 1);
      if (currMonth < 9) return new Date(currYear, 6, 1);
      return new Date(currYear, 9, 1);
    case GroupingOptionType.YEARLY:
      if (currMonth < 3) return new Date(currYear - 1, 3, 1);
      return new Date(currYear, 3, 1);
    default:
      return new Date();
  }
};

const getGroupEndDate = (date: Date, groupOption: GroupingOptionType): Date => {
  const currMonth = date.getMonth();
  const currYear = date.getFullYear();
  switch (groupOption) {
    case GroupingOptionType.MONTHLY:
      return new Date(currYear, date.getMonth() + 1, 0);
    case GroupingOptionType.QUARTERLY:
      if (currMonth < 3) return new Date(currYear, 3, 0);
      if (currMonth < 6) return new Date(currYear, 6, 0);
      if (currMonth < 9) return new Date(currYear, 9, 0);
      return new Date(currYear + 1, 0, 0);
    case GroupingOptionType.YEARLY:
      if (currMonth < 3) return new Date(currYear, 3, 0);
      return new Date(currYear + 1, 3, 0);
    default:
      return new Date();
  }
};

const getGroupLabelFromDate = (date: Date, groupOption: GroupingOptionType): string => {
  const currMonth = date.getMonth();
  const currYear = date.getFullYear();
  const monthName = date.toLocaleDateString("en-US", { month: "long" }).slice(0, 3);
  const fiscalYear = currMonth < 3 ? currYear.toString().slice(-2) : (currYear + 1).toString().slice(-2);
  switch (groupOption) {
    case GroupingOptionType.MONTHLY:
      return `${monthName} ${currYear}`;
    case GroupingOptionType.QUARTERLY:
      if (currMonth < 3) return `Q4 FY${fiscalYear}`;
      if (currMonth < 6) return `Q1 FY${fiscalYear}`;
      if (currMonth < 9) return `Q2 FY${fiscalYear}`;
      return `Q3 FY${fiscalYear}`;
    case GroupingOptionType.YEARLY:
      return `FY${fiscalYear}`;
    default:
      return "";
  }
};

export const getStartDateFromSummaryType = (summaryType: MonthlySummaryType): string => {
  const currDate = new Date();
  const currMonth = currDate.getMonth();
  const currYear = currDate.getFullYear();
  switch (summaryType) {
    case MonthlySummaryType.LAST_MONTH:
      return formatDateToYYYYMMDD(new Date(currYear, currMonth - 1, 1));
    case MonthlySummaryType.LAST_3_MONTHS:
      return formatDateToYYYYMMDD(new Date(currYear, currMonth - 3, 1));
    case MonthlySummaryType.LAST_6_MONTHS:
      return formatDateToYYYYMMDD(new Date(currYear, currMonth - 6, 1));
    case MonthlySummaryType.LAST_12_MONTHS:
      return formatDateToYYYYMMDD(new Date(currYear, currMonth - 12, 1));
    case MonthlySummaryType.CURRENT_FINANCIAL_YEAR:
      return formatDateToYYYYMMDD(new Date(currMonth < 3 ? currYear - 1 : currYear, 3, 1));
    case MonthlySummaryType.LAST_FINANCIAL_YEAR:
      return formatDateToYYYYMMDD(new Date(currMonth < 3 ? currYear - 2 : currYear - 1, 3, 1));
    case MonthlySummaryType.LIFETIME:
      return "";
    default:
      return "";
  }
};

export const getEndDateFromSummaryType = (summaryType: MonthlySummaryType): string => {
  const currDate = new Date();
  const currMonth = currDate.getMonth();
  const currYear = currDate.getFullYear();
  switch (summaryType) {
    case MonthlySummaryType.LAST_MONTH:
      return formatDateToYYYYMMDD(new Date());
    case MonthlySummaryType.LAST_3_MONTHS:
      return formatDateToYYYYMMDD(new Date());
    case MonthlySummaryType.LAST_6_MONTHS:
      return formatDateToYYYYMMDD(new Date());
    case MonthlySummaryType.LAST_12_MONTHS:
      return formatDateToYYYYMMDD(new Date());
    case MonthlySummaryType.CURRENT_FINANCIAL_YEAR:
      return formatDateToYYYYMMDD(new Date());
    case MonthlySummaryType.LAST_FINANCIAL_YEAR:
      return formatDateToYYYYMMDD(new Date(currMonth >= 3 ? currYear : currYear - 1, 3, 0));
    case MonthlySummaryType.LIFETIME:
      return formatDateToYYYYMMDD(new Date());
    default:
      return "";
  }
};

export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns 0-based index
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const transformMonthlyRevenueData = (
  monthlyRevenueSummary: RevenueSummaryChartDto[],
  currencyMultiplier: number,
  startDate: string,
  endDate: string,
  groupingOption: GroupingOptionType
): RevenueSummaryChartDto[] => {
  // Data Transformation
  // monthlyRevenueSummary -> monthlyRevenueSummaryInCurrency -> monthlyRevenueChartData
  if (!monthlyRevenueSummary) return [];
  const monthlyRevenueSummaryInCurrency: RevenueSummaryChartDto[] = monthlyRevenueSummary.map((el) => {
    return {
      month: el.month,
      paidAmount: roundOffToNDecimals(el.paidAmount * currencyMultiplier, 2),
      invoicedAmount: roundOffToNDecimals(el.invoicedAmount * currencyMultiplier, 2),
      pending: roundOffToNDecimals(el.pending * currencyMultiplier, 2),
    };
  });
  return groupingMonthlyRevenueDate(monthlyRevenueSummaryInCurrency, startDate, endDate, groupingOption);
};

export const transformImporterSummary = (
  importerRevenueSummary: ImporterSummaryResponse,
  currencyMultiplier: number
): ImporterSummaryResponse => {
  return {
    top5ImporterList: importerRevenueSummary.top5ImporterList.map((el) => {
      return {
        paidAmount: roundOffToNDecimals(el.paidAmount * currencyMultiplier, 2),
        invoicedAmount: roundOffToNDecimals(el.invoicedAmount * currencyMultiplier, 2),
        pending: roundOffToNDecimals(el.pending * currencyMultiplier, 2),
        importerName: el.importerName,
        importerId: el.importerId,
      };
    }),
    totalImporterCount: importerRevenueSummary.totalImporterCount,
    totalInvoicedAmount: roundOffToNDecimals(importerRevenueSummary.totalInvoicedAmount * currencyMultiplier, 2),
    otherImporterSummary: {
      paidAmount: roundOffToNDecimals(importerRevenueSummary.otherImporterSummary.paidAmount * currencyMultiplier, 2),
      invoicedAmount: roundOffToNDecimals(
        importerRevenueSummary.otherImporterSummary.invoicedAmount * currencyMultiplier,
        2
      ),
      pending: roundOffToNDecimals(importerRevenueSummary.otherImporterSummary.pending * currencyMultiplier, 2),
      nextImporterName: importerRevenueSummary.otherImporterSummary.nextImporterName,
    },
  };
};

const roundOffToNDecimals = (x: number, decimals: number): number => {
  return parseFloat(x.toFixed(decimals));
};

export const getDisabledGroupingOption = (
  monthlyRevenueSummary: RevenueSummaryChartDto[],
  startDate: string,
  endDate: string
): GroupingOptionType[] => {
  const gpList = groupingOptionList.map((el) => el.value);
  const disabledGp = [];
  for (const gp of gpList) {
    const transformedData = groupingMonthlyRevenueDate(monthlyRevenueSummary, startDate, endDate, gp);
    if (transformedData.length > 13) disabledGp.push(gp);
  }
  return disabledGp;
};

export const getRevChartTitle = (groupingOption: GroupingOptionType, analyticsCurrency: string) => {
  const gLabel = groupingOptionList.find((el) => el.value == groupingOption)?.label;
  if (!gLabel) return `Revenue in ${analyticsCurrency}`;
  return gLabel + ` revenue in ${analyticsCurrency}`;
};
