/**
 * @author Raj Sheth
 * created: 02/09/23
 */

import React, { FC } from "react";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Tooltip from "../AtomicComponents/Tooltip";
import { Holiday } from "../../types";
import Calendar from "../AtomicComponents/Calendar";
import Typography from "../AtomicComponents/Typography";
import { getDateInYYYYMMDD, getHolidayType, isToday } from "./bankHolidayUtil";
import Locale from "../../util/locale/en";
import classNames from "classnames";
import { OnArgs } from "react-calendar/src/shared/types";

interface HolidayCalendarProps {
  holidays: Array<Holiday>;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

const HolidayCalendar: FC<HolidayCalendarProps> = (props) => {
  const { holidays, selectedMonth, setSelectedMonth } = props;

  // Month in `Jan_2023` format
  // pick first date for that month

  const renderTooltipContent = (tooltipText: string) => {
    return (
      <div className={"relative"}>
        <Tooltip tooltipText={tooltipText} position={TOOLTIP_POSITION.BOTTOM} className={"cursor-pointer mt-[100px]"}>
          <div className={"z-1 -ml-1 absolute w-12 -top-8 h-12 cursor-pointer"} />
        </Tooltip>
      </div>
    );
  };

  return (
    <Calendar
      next2Label={null}
      prev2Label={null}
      showNeighboringMonth={false}
      // Helps in changing the month
      activeStartDate={new Date(selectedMonth)}
      className={"mt-2 overflow-hidden !border-0 rounded-10px !w-[100%] !max-h-[600px]"}
      view={"month"}
      onActiveStartDateChange={({ action, activeStartDate, value, view }: OnArgs) => {
        if (activeStartDate) {
          let dateStr = getDateInYYYYMMDD(activeStartDate);
          setSelectedMonth(dateStr);
        }
      }}
      navigationLabel={({ date, label, locale, view }) => {
        if (view === "month") {
          return (
            <Typography
              text={label.split(" ")[0]}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!text-blue-400"}
            />
          );
        }
        return label;
      }}
      tileClassName={(args) => {
        if (args.view !== "month") {
          return "!h-[70px] hover:!bg-blue-400 hover:!text-white !text-[14px]";
        }
        const dayType = getHolidayType(args.date, holidays || []).type;
        return classNames("!h-[70px] hover:!bg-blue-400 hover:!text-white rounded-sm !text-[14px]", {
          "!bg-red-50 !text-red-400": dayType === "BANK_HOLIDAY",
          "opacity-30 hover:!opacity-100": dayType === "WEEKEND",
          "!text-white !bg-green-50": isToday(args.date),
        });
      }}
      tileContent={(args) => {
        const specialDayType = getHolidayType(args.date, holidays || []);
        if (specialDayType.type === "BANK_HOLIDAY") {
          return renderTooltipContent(specialDayType.holiday?.description || "Fx holiday");
        }
        if (specialDayType.type === "WEEKEND") {
          return renderTooltipContent(Locale.standardFxHoliday);
        }
        if (specialDayType.type === "TODAY") {
          return renderTooltipContent("Today");
        }
      }}
    />
  );
};

export default HolidayCalendar;
