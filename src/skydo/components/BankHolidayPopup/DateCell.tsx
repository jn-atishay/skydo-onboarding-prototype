/**
 * @author Raj Sheth
 * created: 01/09/23
 */

import React, { FC } from "react";
import { formatDate } from "../../util/formatters";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { Holiday } from "../../types";

interface DateCellProps {
  date: string;
}

const DateCell: FC<DateCellProps> = (props) => {
  const { date } = props;

  const month = formatDate(date, { month: "short" });
  const day = formatDate(date, { day: "2-digit" });
  return (
    <div className={"h-13 w-13 flex flex-col items-center justify-evenly bg-black-100 z-1 rounded-10px"}>
      <Typography
        text={day}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"!text-black-700"}
      />
      <Typography
        text={month}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"!text-black-700"}
      />
    </div>
  );
};

const DateCellRow = (props: { holiday: Holiday }) => {
  const { holiday } = props;
  const fullDay = formatDate(holiday.date, { weekday: "long" });

  return (
    <div className={"flex flex-row items-center mb-4"} key={holiday.date}>
      <div>
        <DateCell date={holiday.date} />
      </div>

      <div className={"flex flex-col justify-between ml-4"}>
        {holiday.description && (
          <Typography
            text={holiday.description}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-700"}
          />
        )}
        <Typography
          text={fullDay}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500"}
        />
      </div>
    </div>
  );
};
export default DateCellRow;
