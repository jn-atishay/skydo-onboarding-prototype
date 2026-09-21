import { Holiday, HolidayType } from "../../types";
import { formatDate } from "../../util/formatters";

/**
 * @param date format: YYYY-MM-DD
 */
export const getMonthValue = (date: string) => {
  // returns 1st of the month
  return `${date.split("-")[0]}-${date.split("-")[1]}-01`;
};

/**
 * @param date format: YYYY-MM-DD
 */
export const getMonthDisplayLabel = (date: string) => {
  // convert 03, 04 month to March, April
  return `${formatDate(date, { month: "short" })} ${date.split("-")[0]}`;
};

interface HolidayReturn {
  holiday?: Holiday;
  type: HolidayType;
}

interface DateRange {
  from: string;
  to: string;
}

export const getDateRangeForHolidayApi = (): DateRange => {
  const fromDate = new Date();
  // from: today's date - 6 months first date in `dd-MM-yyyy` format
  fromDate.setMonth(fromDate.getMonth() - 6);
  let monthFrom: number | string = fromDate.getMonth() + 1;
  if (monthFrom < 10) monthFrom = `0${monthFrom}`;
  const from = `01-${monthFrom}-${fromDate.getFullYear()}`;

  const toDate = new Date();
  // to: today's date + 1 year last date in `dd-MM-yyyy` format
  toDate.setFullYear(toDate.getFullYear() + 1);
  let monthTo: number | string = toDate.getMonth() + 1;
  if (monthTo < 10) monthTo = `0${monthTo}`;
  const to = `01-${monthTo}-${toDate.getFullYear()}`;

  return {
    from,
    to,
  };
};

export const getDateInYYYYMMDD = (date: Date) => {
  let dateStr =
    formatDate(date.toString(), { year: "numeric" }) +
    "-" +
    formatDate(date.toString(), { month: "2-digit" }) +
    "-" +
    formatDate(date.toString(), { day: "2-digit" });
  return dateStr;
};

export const getHolidayType = (date: Date, holidays: Array<Holiday>): HolidayReturn => {
  /**
   * Preference order
   * 1. Bank holiday
   * 2. Weekend
   * 3. Today
   * 4. Non-holiday
   */

  let holidayFound;
  holidays.forEach((holiday) => {
    // YYYY-MM-DD
    let dateStr = getDateInYYYYMMDD(date);
    if (holiday.date === dateStr) {
      holidayFound = holiday;
      return;
    }
  });
  if (holidayFound) return { type: "BANK_HOLIDAY", holiday: holidayFound };

  const dayOfWeek = date.getDay();
  // 6 = Saturday, 0 = Sunday
  if (dayOfWeek === 6 || dayOfWeek === 0) return { type: "WEEKEND" };
  // if today
  if (isToday(date)) return { type: "TODAY" };
  return { type: "NON_HOLIDAY" };
};

export const isToday = (date: Date) => {
  const todaysDate = new Date();

  // compare day, month and year
  return (
    todaysDate.getDate() === date.getDate() &&
    todaysDate.getMonth() === date.getMonth() &&
    todaysDate.getFullYear() === date.getFullYear()
  );
};
