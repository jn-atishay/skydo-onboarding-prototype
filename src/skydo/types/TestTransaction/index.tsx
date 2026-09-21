import { BankAccount } from "../index";

export type TestTransaction = {
  exporterId: number;
  amount: number;
  createdAt: string;
  expectedSettlementDate: string;
  state: string;
  interbankRate: number;
  interbankRateTimeStamp: string;
  amountSettled: number;
  settlementDate: string;
  localUTR: string;
  testTransactionTrackers: TestTransactionTracker[];
  testTransactionDocs: TestTransactionDocs;
  bankAccount: BankAccount;
  readyToTransact: boolean;
};

export type TestTransactionTracker = {
  transactionId: number;
  actionTimestamp: string;
  state: string;
};

export type TestTransactionConstants = {
  amount: number;
  importerName: string;
  country: string;
  exporterSystemInvoiceId: string;
  srn: string;
  currency: string;
  purposeCode: string;
  purposeCodeDescription: string;
  totalFees: number;
  inrFees: number;
  gstFees: number;
  usdCharges: number;
};

export type TestTransactionDocs = {
  firaName: string;
  firaUrl: string;
  skydoReceiptName: string;
  skydoReceiptUrl: string;
  invoiceName: string;
  invoiceUrl: string;
};
