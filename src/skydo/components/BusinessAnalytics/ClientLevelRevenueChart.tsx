import Locale from "../../util/locale/en";
import { numberAbbreviate } from "../../util/numberAbbreviate";
import React from "react";
import { ImporterSummaryChartDto, ImporterSummaryResponse } from "../../types";
import { roundTo } from "../../util/functions";
import Table from "../AtomicComponents/Table";
import { TableColumn } from "../../types/atomicComponentTypes";
import Typography from "../AtomicComponents/Typography";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Tooltip from "../AtomicComponents/Tooltip";
import FE_ROUTES from "../../util/feRoutes";
import { useRouter } from "next/router";
import useAnalyticsDetailsStore from "../../store/useAnalyticesStore";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  containerClass?: string;
  clientLevelSummary: ImporterSummaryResponse;
  currency: string;
}

const ClientLevelRevenueChart = (props: Props) => {
  const { clientLevelSummary, currency } = props;
  const router = useRouter();
  const analytics = useAnalytics();

  const { top5ImporterList, otherImporterSummary } = clientLevelSummary;
  top5ImporterList.length <= 5 &&
    otherImporterSummary.paidAmount > 0 &&
    top5ImporterList.push({
      paidAmount: otherImporterSummary.paidAmount,
      invoicedAmount: otherImporterSummary.invoicedAmount,
      pending: otherImporterSummary.pending,
      importerName: Locale.others,
      importerId: 0,
    });

  const maxTotalInvoiceAmount = Math.max(...top5ImporterList.map((item) => item.invoicedAmount));
  const getPercentageValue = (value: number) => {
    return roundTo(roundTo((value / maxTotalInvoiceAmount) * 100));
  };

  const getTooltipText = (rowData: ImporterSummaryChartDto) => {
    return (
      <div className={"flex flex-1 flex-col items-start"}>
        <Typography
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          text={rowData.importerName}
          fontWeight={"bold"}
        />
        <div className={"flex flex-row space-x-1"}>
          <Typography type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} text={Locale.totalAmountToolTip} />
          <Typography
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            text={currency + " " + numberAbbreviate({ number: rowData.invoicedAmount, currency })}
            fontWeight={"bold"}
          />
        </div>
        <div className={"flex flex-row space-x-1"}>
          <Typography
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            text={Locale.outstandingAmountToolTip}
          />
          <Typography
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            text={currency + " " + numberAbbreviate({ number: rowData.pending, currency })}
            fontWeight={"bold"}
          />
        </div>
      </div>
    );
  };

  const tableColumns: TableColumn[] = [
    {
      headerTitle: Locale.clientName,
      dataKey: "importerName",
      widthClass: "flex-[5_10_0%] overflow-hidden",
      formattedCellData: (rowData: ImporterSummaryChartDto) => {
        return (
          <Typography
            text={rowData?.importerName}
            textClasses={rowData ? "underline cursor-pointer truncate" : "truncate"}
            type={rowData ? TYPOGRAPHY_TYPES.PARA : TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
        );
      },
    },
    {
      headerTitle: Locale.totalInvoiced,
      dataKey: "totalInvoicedAmount",
      widthClass: "flex-[20_20_0%]",
      formattedCellData: (rowData: ImporterSummaryChartDto) => {
        const charges = rowData?.invoicedAmount;
        return (
          <div className={"flex flex-1 items-left"}>
            <Tooltip
              className={"w-fit"}
              tooltipText={getTooltipText(rowData)}
              position={TOOLTIP_POSITION.BOTTOM}
              arrow={true}
              style={{ width: `${getPercentageValue(charges)}%` }}
            >
              <div className={"bg-navyblue-500 h-6 flex-1 mr-2"}></div>
            </Tooltip>

            <div className={"flex flex-start h-6 basis-[80px]"}>
              {numberAbbreviate({
                number: charges,
                isShorterAbbreviation: true,
                currency,
              })}
            </div>
          </div>
        );
      },
    },
    {
      headerTitle: Locale.outstandingInr,
      dataKey: "outstandingAmount",
      widthClass: "flex-[5_5_0%] justify-end",
      formattedCellData: (rowData: ImporterSummaryChartDto) => {
        const charges = rowData?.pending;
        const formattedValue = charges
          ? numberAbbreviate({
              number: charges,
              isShorterAbbreviation: true,
              currency,
            })
          : "-";
        return (
          <Typography
            text={formattedValue}
            type={rowData ? TYPOGRAPHY_TYPES.PARA : TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={rowData ? "cursor-pointer" : ""}
          />
        );
      },
    },
  ];
  const { setImporterId } = useAnalyticsDetailsStore();
  const onRowClick = (rowData: ImporterSummaryChartDto) => {
    analytics?.trackAsync(Events.ANALYTICS.CLIENT_GRAPH_CLICK);
    rowData.importerId !== 0 && setImporterId(String(rowData.importerId));
    router.push(FE_ROUTES.CLIENT_LEVEL_ANALYTICS);
  };
  const createHrefForRow = () => {
    return FE_ROUTES.CLIENT_LEVEL_ANALYTICS;
  };

  return (
    <div className={"flex item-center flex-1"}>
      <Table
        wrapperClass={"flex-1"}
        columns={tableColumns}
        data={top5ImporterList}
        customTableRowClass={"!hover:shadow-none !border-dashed !pl-2"}
        tableHeaderClass={"!bg-white !pl-2"}
        onRowClick={onRowClick}
        isInteractive={() => false}
        getHrefForRow={createHrefForRow}
      />
    </div>
  );
};

export default ClientLevelRevenueChart;
