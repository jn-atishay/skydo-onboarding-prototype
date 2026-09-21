import useAnalyticsDetailsStore from "../../store/useAnalyticesStore";
import React, { useState } from "react";
import { Option } from "../../types/atomicComponentTypes";
import { DropdownOption } from "../AtomicComponents/Dropdown/DropdownOptions";
import { DropdownSizes, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import DateSelector from "../AtomicComponents/DateSelector";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import MonthlySummaryType from "../BusinessAnalytics/constants";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  option: Option;
  index: number;
  changeLabel?: (label: string) => void;
  selectedValue?: unknown;
}

const AnalyticsCustomDateOption = (props: Props) => {
  const { startDate, endDate, setStartDate, setEndDate, setAnalyticsOption, analyticsOption } =
    useAnalyticsDetailsStore();

  const [showDateRange, setShowDateRange] = useState(false);

  const [calendarStartDate, setCalendarStartDate] = useState(startDate);
  const [calendarEndDate, setCalendarEndDate] = useState(endDate);
  const analytics = useAnalytics();

  const onApplyClick = () => {
    setStartDate(calendarStartDate);
    setEndDate(calendarEndDate);
    setAnalyticsOption(MonthlySummaryType.CUSTOM);
    props.changeLabel && props.changeLabel(MonthlySummaryType.CUSTOM);
    setShowDateRange(false);
    analytics?.trackAsync(Events.ANALYTICS.DURATION_DROP_DOWN_CLICK, { duration: MonthlySummaryType.CUSTOM });
  };

  return (
    <div>
      <div>
        <DropdownOption
          onOptionClick={() => {
            setShowDateRange(!showDateRange);
          }}
          size={DropdownSizes.Medium}
          option={props.option}
          index={props.index}
          selectedValue={props.selectedValue}
        />
      </div>
      {showDateRange ? (
        <div
          className={"absolute left-0 bottom-0 -translate-x-full shadow-dropdown rounded-10px bg-white p-4 w-[250px]"}
        >
          <div className={"flex flex-col space-y-4"}>
            <div className={"flex flex-row space-x-4 justify-between items-center w-full"}>
              <Typography
                textClasses={"w-10"}
                text={"From"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
              />
              <DateSelector
                selectedDate={calendarStartDate?.split("-").reverse().join("/")}
                onDateSelect={(date: string | null) => {
                  setCalendarStartDate(date || "");
                }}
                placeholder={"dd/mm/yyyy"}
                containerClass={"!z-50"}
                delayCloseCalendarOnSelectDate={true}
                maxDate={new Date()}
              />
            </div>
            <div className={"flex flex-row space-x-4 justify-between items-center w-full"}>
              <Typography textClasses={"w-10"} text={"To"} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
              <DateSelector
                selectedDate={calendarEndDate?.split("-").reverse().join("/")}
                onDateSelect={(date: string | null) => {
                  setCalendarEndDate(date || "");
                }}
                placeholder={"dd/mm/yyyy"}
                containerClass={"!z-40"}
                delayCloseCalendarOnSelectDate={true}
                maxDate={new Date()}
              />
            </div>
            <div className={"w-full border border-black-200"}></div>
            <div className={"flex flex-row justify-end"}>
              <Typography
                text={Locale.apply}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-blue-400 cursor-pointer"}
                onTextClick={onApplyClick}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AnalyticsCustomDateOption;
