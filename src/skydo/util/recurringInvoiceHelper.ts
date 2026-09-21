import { RepeatInterval } from "../types/NewInvoiceTypes";
import * as R from "remeda";

/*
@param starDate: string (format: YYYY-MM-DD), frequency: RepeatInterval
@return next recurring invoice (format: iso8601 format string) date based on start date and frequency
*/

export const calculateNextDateForRecurringConfig = (
  startDate: string,
  frequency: RepeatInterval | "TODAY",
  minDate: Date = new Date(0)
): string => {
  const clonedDate = !startDate || !R.isDate(new Date(startDate)) ? new Date() : new Date(startDate);
  clonedDate.setHours(9, 0, 0, 0);

  let result = clonedDate;

  // basic - add n days
  if (frequency == RepeatInterval.EVERY_TWO_WEEKS) {
    clonedDate.setDate(clonedDate.getDate() + 14);
    result = clonedDate;
  } else {
    // recurring type is monthly +1/+2/+3
    // if the date is the last date of the month. For 30th june, next date will be 31 july.
    // Although this could be erroneous in edge cases. Since the context is missing
    const isLastDate = isLastDateOfTheMonth(clonedDate);

    if (isLastDate) {
      if (frequency == RepeatInterval.EVERY_MONTH) result = getLastDateOfNextNMonth(clonedDate, 1);
      if (frequency == RepeatInterval.EVERY_TWO_MONTHS) result = getLastDateOfNextNMonth(clonedDate, 2);
      if (frequency == RepeatInterval.QUARTERLY) result = getLastDateOfNextNMonth(clonedDate, 3);
    } else {
      // get the same date of the next month. in case the same date doesn't exist get the last date of the next month
      if (frequency == RepeatInterval.EVERY_MONTH) result = getSameDateOfNextNMonth(clonedDate, 1);
      if (frequency == RepeatInterval.EVERY_TWO_MONTHS) result = getSameDateOfNextNMonth(clonedDate, 2);
      if (frequency == RepeatInterval.QUARTERLY) result = getSameDateOfNextNMonth(clonedDate, 3);
    }
  }

  result = new Date(Math.max(result.getTime(), minDate.getTime()));

  return result.toISOString();
};

const getLastDateOfNextNMonth = (date: Date, n: number): Date => {
  const clonedDate = new Date(date);
  clonedDate.setMonth(clonedDate.getMonth() + n + 1);
  clonedDate.setDate(0);
  return clonedDate;
};

const getSameDateOfNextNMonth = (date: Date, n: number): Date => {
  const clonedDate = new Date(date);
  const originalDate = clonedDate.getDate();
  clonedDate.setMonth(clonedDate.getMonth() + n);
  if (originalDate != clonedDate.getDate()) {
    // Handling of February
    clonedDate.setDate(0);
  }
  return clonedDate;
};

export const isLastDateOfTheMonth = (date: Date): boolean => {
  const clonedDate = new Date(date);
  clonedDate.setDate(clonedDate.getDate() + 1);
  return clonedDate.getDate() == 1;
};

export const getTomorrowDate = (): Date => {
  const currDate = new Date();
  currDate.setDate(currDate.getDate() + 1);
  return currDate;
};
