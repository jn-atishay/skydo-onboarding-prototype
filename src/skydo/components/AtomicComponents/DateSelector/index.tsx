import classNames from "classnames";
import React, { useContext, useRef, useState } from "react";
import TextInput from "../TextInput";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { OnArgs, Value, View } from "react-calendar/src/shared/types";
import SmallRightArrow from "../../Icons/SmallRightArrow";
import Typography from "../Typography";
import { CalendarPosition, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import { MONTH_LABELS_SHORT } from "../../../constants/dateConstants";
import useOutsideClickFinder from "../../../hooks/useOutsideClickFinder";
import * as R from "remeda";
import CalendarIcon from "../../Icons/CalendarIcon";
import DownArrowIcon from "../../Icons/DownArrowIcon";
import AppContext from "../../../context/AppContext";
import { sleep } from "@segment/analytics-core";

interface Props {
  containerClass?: string;
  selectedDate?: string; // DD/MM/YYYY
  label?: string;
  calendarContainerClass?: string;
  onDateSelect: (date: string | null) => void;
  isError?: boolean;
  footerText?: string;
  placeholder?: string;
  enableDisabledStyle?: boolean;
  size?: string;
  calendarPosition?: CalendarPosition;
  maxDate?: Date;
  minDate?: Date;
  delayCloseCalendarOnSelectDate?: boolean;
  onInputClickParent?: () => void;
  isDisabled?: boolean;
  /** Optional: restrict allowed navigation levels */
  views?: Array<"month" | "year" | "decade">;
  showYearAndMonthSelectors?: boolean;
}

export function formatDate(date: Date | string) {
  if (!date || !R.isDate(new Date(date))) return null;
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function formatDateReadable(d: Date) {
  let month = d.getMonth();
  let day = d.getDate();
  let year = d.getFullYear();
  return `${day < 10 ? "0" + day : day} ${MONTH_LABELS_SHORT[month]} ${year}`;
}

export function getMMDDYYYY(date: string) {
  // DD/MM/YYYY → MM/DD/YYYY
  let dateParts = String(date).split("/");
  return Number(dateParts[1]) + "/" + dateParts[0] + "/" + dateParts[2];
}

const DateSelector = (props: Props) => {
  const {
    enableDisabledStyle,
    containerClass,
    selectedDate,
    onDateSelect,
    calendarPosition = CalendarPosition.BOTTOM,
    onInputClickParent,
    isDisabled = true,
    views = ["month"],
    showYearAndMonthSelectors = false,
  } = props;
  const orderedViews = ["month", "year", "decade"];
  views.sort((a: string, b: string) => orderedViews.indexOf(a) - orderedViews.indexOf(b));

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useContext(AppContext);

  const onOutsideClick = () => {
    setIsCalendarVisible(false);
  };
  const onInputClick = () => {
    if (!enableDisabledStyle) {
      if (onInputClickParent) {
        onInputClickParent();
      }
      setIsCalendarVisible(!isCalendarVisible);
    }
  };

  useOutsideClickFinder(calendarRef, onOutsideClick);

  const selecteDateInstance = selectedDate ? new Date(getMMDDYYYY(selectedDate)) : new Date();

  /**
   * State to manage current calendar view (month/year/decade)
   * and activeStartDate for navigation
   */
  const [currentView, setCurrentView] = useState<View>("month");
  const [activeStartDate, setActiveStartDate] = useState<Date>(selecteDateInstance);
  const dateValue = selectedDate ? formatDateReadable(activeStartDate) : undefined;

  /** Handle user date selection */
  const onSelect = async (date: Value) => {
    if (!R.isDate(date)) return null;
    setActiveStartDate(date);
    const isMinView = currentView === orderedViews[0];

    if (isMinView) {
      onDateSelect(formatDate(date));
      if (props.delayCloseCalendarOnSelectDate) {
        await sleep(1);
      }
      setIsCalendarVisible(false);
    } else {
      // Drill down from decade → year → month
      const nextIndex = orderedViews.indexOf(currentView) - 1;
      const nextView = orderedViews[nextIndex];
      setCurrentView(nextView as View);
      return;
    }
  };

  /** Handle view changes (month/year/decade) */
  const onViewChange = ({ view: currentView, activeStartDate: newStartDate }: OnArgs) => {
    if (!R.isDate(newStartDate) === null || newStartDate === null) return;
    setCurrentView(currentView);
    setActiveStartDate(newStartDate);
  };

  /** Track navigation (when moving between months/years/decades) */
  const onActiveStartDateChange = ({ activeStartDate: newStartDate }: OnArgs) => {
    if (!R.isDate(newStartDate) === null || newStartDate === null) return;
    setActiveStartDate(newStartDate);
  };

  /** Custom navigation arrows */
  const renderNextLabel = () => (
    <div className={classNames("cursor-pointer", { "ml-2": !showYearAndMonthSelectors })}>
      <SmallRightArrow />
    </div>
  );

  const renderPrevLabel = () => (
    <div
      className={classNames("cursor-pointer flex justify-start rotate-180", {
        "mr-2": !showYearAndMonthSelectors,
      })}
    >
      <SmallRightArrow />
    </div>
  );

  const renderCalendarIcon = () => (
    <CalendarIcon stroke={enableDisabledStyle ? theme.hexColors.black[500] : undefined} />
  );

  const renderYearBand = () => (
    <div
      className={
        "bg-blue-50 flex flex-row items-center justify-center gap-1 h-[38px] cursor-pointer"
      }
      onClick={() => setCurrentView("decade")}
    >
      <Typography
        text={String(activeStartDate.getFullYear())}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"!text-blue-400"}
      />
      <DownArrowIcon stroke={theme.hexColors.blue[400]} width={16} height={16} />
    </div>
  );

  const renderNavigationLabel = ({ label, view }: { label: string; view: string }) => {
    if (!["month", "year", "decade"].includes(view)) {
      return label;
    }
    const isDrillable = view !== views[views.length - 1];
    const text = showYearAndMonthSelectors && view === "month" ? label.split(" ")[0] : label;
    const renderText = () => (
      <Typography
        text={text}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        textClasses={`!text-blue-400 ${isDrillable ? "cursor-pointer" : ""}`}
      />
    );
    if (!showYearAndMonthSelectors) {
      return renderText();
    }
    return (
      <div className={"flex flex-row items-center justify-center gap-2"}>
        {renderText()}
        {isDrillable ? <DownArrowIcon stroke={theme.hexColors.blue[400]} width={20} height={20} /> : null}
      </div>
    );
  };

  return (
    <div id={"dateSelector"} className={classNames("relative w-full", containerClass)} ref={calendarRef}>
      <TextInput
        label={props.label}
        onInputClick={onInputClick}
        value={dateValue}
        isDisabled={isDisabled}
        customClass={"bg-white w-0"}
        dropdownDisabled={!enableDisabledStyle}
        inputWrapperClass={props.isError ? "!border-red-500" : isCalendarVisible ? "!border-navyblue-500" : ""}
        rightElement={renderCalendarIcon}
        isError={props.isError}
        footerText={props.footerText}
        placeholder={props.placeholder}
        size={props.size}
        showOverlay={true}
      />
      {isCalendarVisible && (
        <div
          className={classNames("absolute", props.calendarContainerClass, {
            "top-0 left-0 -translate-y-full": calendarPosition == CalendarPosition.TOP,
            "bg-white rounded-10px shadow-headerShadow overflow-hidden w-fit": showYearAndMonthSelectors,
          })}
          onClick={
            // To avoid any clicks in the calendar to propagate to the Text input above.
            (e) => e.stopPropagation()
          }
        >
          {showYearAndMonthSelectors ? renderYearBand() : null}
          <Calendar
            className={classNames("overflow-hidden !border-0", {
              "shadow-headerShadow rounded-10px !w-[300px]": !showYearAndMonthSelectors,
              "compact-calendar rounded-b-10px !w-[235px]": showYearAndMonthSelectors,
            })}
            onChange={onSelect}
            value={selecteDateInstance}
            view={currentView}
            onViewChange={onViewChange}
            onActiveStartDateChange={onActiveStartDateChange}
            activeStartDate={activeStartDate}
            minDetail={views[views.length - 1]} // lowest allowed detail (e.g. decade)
            maxDetail={views[0]} // highest allowed detail (e.g. month)
            next2Label={null}
            prev2Label={null}
            maxDate={props.maxDate}
            minDate={props.minDate}
            nextLabel={renderNextLabel()}
            prevLabel={renderPrevLabel()}
            navigationLabel={({ label, view }) => renderNavigationLabel({ label, view })}
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
