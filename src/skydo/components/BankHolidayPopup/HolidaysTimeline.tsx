/**
 * @author Raj Sheth
 * created: 01/09/23
 */

import React, { FC, ReactNode, useEffect } from "react";
import { Holiday } from "../../types";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import DateCellRow from "./DateCell";
import { getMonthDisplayLabel, getMonthValue } from "./bankHolidayUtil";

interface HolidaysTimelineProps {
  holidays: Array<Holiday>;
  selectedMonth: string;
}

/**
 * Assumption holidays are always sorted by date in ascending order
 * This is very important in order to MonthBreakerLabel to work
 */
const HolidaysTimeline: FC<HolidaysTimelineProps> = (props) => {
  const { holidays, selectedMonth } = props;
  const dateCells: ReactNode[] = [];
  let currentMonth = "";

  holidays?.map((holiday: Holiday, index) => {
    const month = getMonthValue(holiday.date);
    const monthLabel = getMonthDisplayLabel(holiday.date);
    if (currentMonth !== month) {
      dateCells.push(
        <div
          className={"mb-6 ml-1"}
          key={Math.random()}
          // @ts-ignore
          scrollid={month}
        >
          <Typography
            text={monthLabel}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight={"700"}
          />
        </div>
      );
    }
    currentMonth = month;

    dateCells.push(<DateCellRow holiday={holiday} key={Math.random()} />);
  });

  // auto scroll on every month change
  useEffect(() => {
    const element = document.querySelector(`[scrollid="${selectedMonth}"]`);
    if (element) {
      element.scrollIntoView({
        block: "start",
        inline: "nearest",
      });
    }
  }, [selectedMonth, holidays]);

  return <div>{dateCells}</div>;
};

export default HolidaysTimeline;
