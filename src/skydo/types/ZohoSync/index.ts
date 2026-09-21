import Locale from "../../util/locale/en";

export enum ZohoSyncState {
  CONNECTED = "CONNECTED",
  CONNECTED_ORG_PENDING = "CONNECTED_ORG_PENDING",
  ERROR = "ERROR",
  LOADING = "LOADING",
  READY_TO_CONNECT = "READY_TO_CONNECT",
}

export interface ZohoOrganization {
  id: string;
  name: string;
  country: string;
}

export interface ZohoAuthenticateResponse {
  isConnected: boolean;
  isOrgSelected: boolean;
  organizations: ZohoOrganization[];
}

export interface ZohoAuthenticateRequest {
  grantToken: string;
  authDomain: string;
}

export interface ZohoSetOrgRequest {
  zohoOrganizationId: string;
}

export enum ZOHO_BOOKS_CONSTANT {
  CODE = "code",
  ACCOUNT_SERVER = "accounts-server",
  ERROR = "error",
  OPEN_ZOHO_SYNC = "open_zoho_sync",
}

export const SKIP_ZOHO_SYNC_OPTIONS = [
  Locale.zohoSync.skipPopUp.optionOne,
  Locale.zohoSync.skipPopUp.optionTwo,
  Locale.zohoSync.skipPopUp.optionThree,
];

export const KNOW_MORE_POINTS = [
  { head: ":frequency minute sync: ", para: "Invoices created on Zoho appear on Skydo within :frequency mins" },
  {
    head: "Ready to sync: ",
    para: "Changes on Zoho now sync instantly with Skydo! Past data sync - stay tuned for that.",
  },
];

export enum ZohoSyncIconState {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  IDLE = "IDLE",
}

export const ZOHO_SYNC_FREQUENCY_PLACEHOLDER = ":frequency";
