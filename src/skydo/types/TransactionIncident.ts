export const TransactionIncidentType = {
  FX_BANK_HOLIDAY: "FX_BANK_HOLIDAY",
  BANK_DELAY: "BANK_DELAY",
  WEEKDAY_CUT_OFF: "WEEKDAY_CUT_OFF",
  FRIDAY_CUT_OFF: "FRIDAY_CUT_OFF",
  WEEKEND: "WEEKEND",
};

export type TransactionIncident = {
  incidentType: string;
  incidentDate: string;
  incidentDescription?: string;
};

export interface TxnDelayDisplayInfo {
  isBankDelayPresent: boolean;
  isFxHolidayPresent: boolean;
  delayDays: number;
  displayableIncidents: TransactionIncident[];
}

export const DELAYABLE_TRANSACTION_INCIDENTS = [
  TransactionIncidentType.BANK_DELAY,
  TransactionIncidentType.FX_BANK_HOLIDAY,
  TransactionIncidentType.FRIDAY_CUT_OFF,
];

export const DISPLAYABLE_TRANSACTION_INCIDENTS = [TransactionIncidentType.FX_BANK_HOLIDAY];
