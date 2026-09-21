import { ExporterRewardEligibility } from "../types/BannerTypes";

export enum FocusedHomeCompState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum FocusedHomeComponent {
  VKYC = "VKYC",
  TEST_TRANSACTION = "TEST_TRANSACTION",
  INT_ACCOUNTS = "INT_ACCOUNTS",
  INVOICE = "INVOICE",

  // new states
  PAYMENT_METHOD = "PAYMENT_METHOD",
  PAYMENT_DETAIL = "PAYMENT_DETAIL",
}

export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  INSTALINKS = "INSTALINKS",
}

export interface FocusedHomeState {
  component: FocusedHomeComponent;
  componentState: FocusedHomeCompState;
}

export const FocusedHomeCurrencyList = ["USD", "GBP", "EUR", "CAD", "SGD", "AUD", "ROW"];

export interface FocusedHomeApiResponse {
  focusedHomeStates: [FocusedHomeState];
  exporterReward?: ExporterRewardEligibility;
  exporterUseCase?: ExporterUseCase;
  isInvoiceUploaded: boolean;
  isTestTransactionSettled: boolean;
  testAmount: number;
  averageTransaction: string;
  monthlyRevenue: string;
  paymentMethod?: PaymentMethod;
  isPaymentTimelineExpired: boolean;
  isVkycInitiated: boolean;
  isConfettiShown: boolean;
  isReceivePaymentContinueExpired: boolean;
}

export enum ExporterUseCase {
  SALARIED_EMPLOYEE = "SALARIED_EMPLOYEE",
  FREELANCE_PLATFORMS = "FREELANCE_PLATFORMS",
  DIRECTLY_WITH_CLIENTS = "DIRECTLY_WITH_CLIENTS",
}
