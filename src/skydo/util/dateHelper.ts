// days_remaining for analytics, kept identical to the backend's daysToExpiry:
// "today" in IST (not the viewer's zone), expiry parsed literally (new Date()
// would read a date-only string as UTC and drift a day for viewers behind UTC),
// and inclusive of the expiry day (+1). Malformed input → 0, never NaN.
export const daysUntil = (expiryDateStr: string): number => {
  const [ey, em, ed] = (expiryDateStr ?? "").split("-").map(Number);
  if (!ey || !em || !ed) return 0;
  const istToday = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const [ty, tm, td] = istToday.split("-").map(Number);
  const utcExpiry = Date.UTC(ey, em - 1, ed);
  const utcToday = Date.UTC(ty, tm - 1, td);
  const diff = Math.round((utcExpiry - utcToday) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff + 1);
};

export function formatDateElapsed(inputDate: Date, prefix: string = "Last updated"): string {
  const currentDate = new Date();
  const elapsedMilliseconds = currentDate.getTime() - inputDate.getTime();
  const elapsedDays = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24));

  if (elapsedDays === 0) {
    return `${prefix} today`;
  } else if (elapsedDays === 1) {
    return `${prefix} yesterday`;
  } else {
    return `${prefix} ${elapsedDays} days ago`;
  }
}

/**
 * Return string format: "22 Aug 2022, 11:44 AM (EST)"
 * Takes care of daylight saving time
 */
export function formatDateAsPerCurrencyTimeZone(dateInput: string, currency: string): string {
  let targetTimeZone: string;
  let timeZoneAbbreviation: string;
  switch (currency) {
    case "USD":
      targetTimeZone = "America/New_York";
      timeZoneAbbreviation = "EST";
      break;
    case "GBP":
      targetTimeZone = "Europe/London";
      timeZoneAbbreviation = "GMT";
      break;
    case "EUR":
      targetTimeZone = "Europe/Berlin";
      timeZoneAbbreviation = "CET";
      break;
    case "CAD":
      targetTimeZone = "America/Winnipeg";
      timeZoneAbbreviation = "CST";
      break;
    default:
      targetTimeZone = "Europe/London";
      timeZoneAbbreviation = "GMT";
      break;
  }

  const utcDate = new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: targetTimeZone,
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter
    .formatToParts(utcDate)
    .map((part) => (part.type === "literal" ? part.value : part.value.toString().padStart(2, "0")))
    .join("");

  return `${formattedDate} (${timeZoneAbbreviation})`;
}
