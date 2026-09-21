import { ZOHO_BOOKS_CONSTANT, ZohoSyncState } from "../types/ZohoSync";

export const getCTATextFromZohoPopUpState = (popUpState: ZohoSyncState): string => {
  switch (popUpState) {
    case ZohoSyncState.READY_TO_CONNECT:
      return "Connect securely";
    case ZohoSyncState.CONNECTED_ORG_PENDING:
      return "Connect";
    case ZohoSyncState.CONNECTED:
      return "Done";
    case ZohoSyncState.ERROR:
      return "Retry connection";
    case ZohoSyncState.LOADING:
      return "";
  }
};

export const isZohoSuccessRedirect = (keys: string[]): Boolean => {
  return keys.includes(ZOHO_BOOKS_CONSTANT.CODE) && keys.includes(ZOHO_BOOKS_CONSTANT.ACCOUNT_SERVER);
};

export const isZohoErrorRedirect = (keys: string[]): Boolean => {
  return keys.includes(ZOHO_BOOKS_CONSTANT.ERROR);
};

export const getZohoSyncTimeFromDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options);
};
