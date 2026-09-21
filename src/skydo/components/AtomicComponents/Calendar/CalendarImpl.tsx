//Dec 2024

import React, { FC } from "react";
import Typography from "../Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import classNames from "classnames";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CalendarProps } from "./propTypes";

const CalendarImpl: FC<CalendarProps> = (props) => {
  const {
    activeStartDate = undefined,
    onActiveStartDateChange = undefined,
    value = undefined,
    next2Label = null,
    prev2Label = null,
    showNeighboringMonth = false,
    className = "",
    view = "month",
    onChange = () => {},
    navigationLabel = ({ date, label, locale, view }) => {
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
    },
    tileClassName,
    tileContent,
    tileDisabled,
  } = props;

  return (
    <Calendar
      next2Label={next2Label}
      prev2Label={prev2Label}
      value={value}
      showNeighboringMonth={showNeighboringMonth}
      className={classNames("mt-2 overflow-hidden !border-0 rounded-10px !w-[100%] !max-h-[600px]", className)}
      view={view}
      onChange={onChange}
      navigationLabel={navigationLabel}
      // only pass following if not undefined
      {...(activeStartDate && { activeStartDate })}
      {...(onActiveStartDateChange && { onActiveStartDateChange })}
      {...(tileClassName && { tileClassName })}
      {...(tileContent && { tileContent })}
      {...(tileDisabled && { tileDisabled })}
    />
  );
};

export default CalendarImpl;
