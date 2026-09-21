import SkydoBarChart from "./SkydoBarChart";
import {Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React, {useContext, useState} from "react";
import AppContext from "../../context/AppContext";
import {numberAbbreviate} from "../../util/numberAbbreviate";
import {RevenueSummaryChartDto} from "../../types";
import BarChartTooltip from "./BarChartTooltip";
import NoChartDataAvailableCard from "./NoChartDataAvailableCard";
import ExcalmationIcon from "../Icons/ExcalmationIcon";
import Typography from "../AtomicComponents/Typography";
import {TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES} from "../../constants/atomicConstants";
import Triangle from "../Triangle";
import useDashboardVersionStore from "../../store/useDashboardVersionStore";
import {DashboardVersionType} from "../../types/DashboardVersionTypes";

interface Props {
  revenueSummary: RevenueSummaryChartDto[];
  dateFormattingOptions?: { [key: string]: string };
  showNoDataComponent?: boolean;
  chartHeight?: number;
  onBarClick?: (chartData: any) => void;
  currency: string;
  showXLabel?: boolean;
}

const MonthlyRevenueChart = (props: Props) => {
  const { revenueSummary = [], dateFormattingOptions, showNoDataComponent = false, chartHeight, currency, onBarClick } = props;
  const {dashboardVersion} = useDashboardVersionStore();
  const isInvoiceLessUser = dashboardVersion !== DashboardVersionType.INVOICE_FULL;
  // Currently we have disabled on click functionality for invoice less enabled users
  const onBarClickModifiedByDashVersion = isInvoiceLessUser ? undefined : onBarClick;
  const { theme } = useContext(AppContext);
  const [isBarFocused, setIsBarFocused] = useState<boolean>(false);
  const [isLabelFocused, setIsLabelFocused] = useState(false);
  const [focusedLabelMonth, setFocusedLabelMonth] = useState(null);
  const [focusedLabelPosition, setFocusedLabelPosition] = useState({});
  const formatXAxisValue = (value: string) => {
    return value;
  };

  const renderBarDetails = (cursor: any) => {
    const cursorPayload = cursor?.payload;
    const payload = cursorPayload ? cursorPayload[0]?.payload : null;
    if (!payload || !isBarFocused) return null;
    const { month, paidAmount, invoicedAmount } = payload;
    return (
      <BarChartTooltip title={month} invoicedAmount={invoicedAmount} paidAmount={paidAmount} currency={currency} hideInvoicedAmount={isInvoiceLessUser}/>
    );
  };

  const CustomizedYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-50} y={0} dy={4} fill={theme.hexColors.black[500]} textAnchor={"start"} fontWeight={600} fontSize={12}>
          {numberAbbreviate({
            number: payload.value,
            isShorterAbbreviation: true,
            currency,
          })}
        </text>
      </g>
    );
  };

  const onMouseEnter = () => setIsBarFocused(true);

  const onMouseLeave = () => setIsBarFocused(false);

  const CustomizedXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const month = payload.value;
    const element = revenueSummary.find((el) => el.month == month);
    const isDataIncomplete = element?.isDataIncomplete;

    const onMouseEnter = (params: any) => {
      setFocusedLabelPosition({ left: x - 25, top: y - 27 });
      setIsLabelFocused(true);
      setFocusedLabelMonth(payload.value);
    };

    const onMouseLeave = () => {
      setIsLabelFocused(false);
      setFocusedLabelMonth(null);
      setFocusedLabelPosition({});
    };

    const tVal = ((payload?.value?.length || 8) / 8) * 26;
    return (
      <g transform={`translate(${x},${y})`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <text x={0} y={0} dy={16} fill={theme.hexColors.black[700]} textAnchor={"middle"} fontWeight={600} fontSize={12}>
          {payload.value}
        </text>
        {isDataIncomplete ? (
          <g transform={`translate(${tVal}, 3)`}>
            <ExcalmationIcon stroke={"#8898AA"} fill={"white"} />
          </g>
        ) : null}
      </g>
    );
  };

  if (showNoDataComponent) return <NoChartDataAvailableCard />;

  const renderXAxisToolTip = () => {
    const isDataIncom = revenueSummary.find((el) => el.month == focusedLabelMonth)?.isDataIncomplete;
    if (isDataIncom && isLabelFocused) {
      return (
        <div
          className={"flex flex-row items-center justify-center absolute z-100 bg-black-700 rounded p-1 min-w-[120px]"}
          style={focusedLabelPosition}
        >
          <Typography
            text={"Incomplete date range"}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_X_SMALL}
            textClasses={"!text-white relative"}
          >
            <Triangle containerClass={"absolute left-1/3 -rotate-180"} isSmall={true} isBlack={true} />
          </Typography>
        </div>
      );
    }
    return null;
  };

  const chartComponent = () => {
    return (
      <ResponsiveContainer height={chartHeight}>
        <SkydoBarChart data={revenueSummary}>
          {(focusedBar: number | null) => {
            return (
              <>
                <CartesianGrid vertical={false} strokeDasharray={"3 3"} fillRule={"nonzero"} />

                <YAxis
                  tickLine={false}
                  tickCount={5}
                  width={60}
                  tick={CustomizedYAxisTick}
                  orientation={"left"}
                  // axisLine={{ stroke: theme.hexColors.black[400] }}
                />
                <Tooltip content={renderBarDetails} cursor={{ opacity: 0 }} wrapperStyle={{ outline: "none" }} />
                <Bar
                  barSize={40}
                  dataKey="paidAmount"
                  stackId={"1"}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  isAnimationActive={false}
                  onClick={onBarClickModifiedByDashVersion}
                  className={onBarClickModifiedByDashVersion ? "cursor-pointer" : ""}
                >
                  {revenueSummary.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={focusedBar === index && isBarFocused ? theme.hexColors.green[300] : theme.hexColors.green[400]}
                    />
                  ))}
                </Bar>
                <Bar
                  barSize={40}
                  dataKey="pending"
                  stackId={"1"}
                  fill={theme.hexColors.black[400]}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  isAnimationActive={false}
                  onClick={onBarClickModifiedByDashVersion}
                  className={onBarClickModifiedByDashVersion ? "cursor-pointer" : ""}
                >
                  {revenueSummary.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={focusedBar === index && isBarFocused ? theme.hexColors.black[300] : theme.hexColors.black[400]}
                    />
                  ))}
                </Bar>
                <XAxis tickLine={false} tickFormatter={formatXAxisValue} tick={CustomizedXAxisTick} dataKey="month" />
              </>
            );
          }}
        </SkydoBarChart>
      </ResponsiveContainer>
    );
  };

  if (props.showXLabel) {
    return (
      <div className={"relative overflow-visible"}>
        {chartComponent()}
        {renderXAxisToolTip()}
      </div>
    );
  } else return <>{chartComponent()}</>;
};

export default MonthlyRevenueChart;
