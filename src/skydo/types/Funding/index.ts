import { Importer } from "../index";
import { MAPPING_TYPE } from "../../constants/fundingMappingConstants";

export type PaymentConfirmationData = {
  fundingId: number;
  invoiceId: number;
  sentAt: string;
  sendMethod: string;
};

export enum VeemMethodEnum {
  ACH_DEBIT = 'ACH_DEBIT',
  VEEM_CARDS = 'VEEM_CARDS'
}

export enum VeemStatusEnum {
  CLOSED = 'CLOSED',
  COMPLETED = 'COMPLETED',
  PENDING_AUTH = 'PENDING_AUTH',
  CREATED = 'CREATED',
  AUTHORIZED = 'AUTHORIZED',
  FAILED = 'FAILED',
  REFUND_INITIATED = 'REFUND_INITIATED'
}

export type VeemMethod = 'ACH_DEBIT' | 'VEEM_CARDS';

export type VeemStatus = 'CLOSED' | 'COMPLETED' | 'PENDING_AUTH' | 'CREATED' | 'AUTHORIZED' | 'FAILED' | 'REFUND_INITIATED';

export type VeemOrderData = {
  id: string,
  status: VeemStatus,
  method?: VeemMethod,
  debitInitiatedTime?: string, // data with time
  amountReceivedTime?: string, // data with time
  frozenTill?: string, // local date
  expectedArrivalTime?: string
}

export type FundingData = {
  id: number;
  amount: number;
  amountMapped: number;
  currency: string;
  senderDetails?: string;
  creditedAt: string;
  senderName: string;
  payerLabel?: string;
  vendor?: string;
  paymentConfirmation?: PaymentConfirmationData;
  fixedInr?: number;
  fundingMethod?: string;
  veemOrder?: VeemOrderData;
};

/** Raw master funding from GraphQL (uses amountUtilised) */
export type MasterFundingDetailResponse = {
  id: string;
  exporterId?: number;
  amount: number;
  amountUtilised: number;
  currency: string;
  senderName?: string;
  payerLabel?: string;
  senderDetails?: string;
  senderDetailsId?: string;
  bankAddress?: string;
  fundingMethod?: string;
  creditedAt: string;
  state?: string;
  vendor?: string;
  extraInfo?: string;
  collectionType?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** Normalized master funding for UI (amountMapped = amountUtilised) */
export type MasterFundingData = {
  id: string;
  amount: number;
  amountMapped: number;
  currency: string;
  senderDetails?: string;
  creditedAt: string;
  senderName: string;
  payerLabel?: string;
  vendor?: string;
  fixedInr?: number;
  fundingMethod?: string;
};

/** Union for unmapped list: funding (id number) or master funding (id string) */
export type UnmappedPaymentData = FundingData | MasterFundingData;

/** Detail shown in header / mapping page */
export type FundingDetailData = FundingData | MasterFundingData;

/** Type guard: item is master funding (id is string) */
export const isMasterFunding = (item: UnmappedPaymentData): item is MasterFundingData =>
  typeof item.id === "string";

/** Check if a raw id string from URL/query is a master funding id (non-numeric). Use when you don't have the full item. */
export const isMasterFundingId = (id: string): boolean => Number.isNaN(Number(id));

export type OutstandingInvoiceForMapping = {
  id: number;
  expectedAmount: number;
  amountMapped: number;
  expectedCurrency: string;
  dueDate: string;
  exporterSystemInvoiceId: string;
  fileLink?: string;
  importer: Importer;
  mappingDate: string;
  invoiceMetadata?: {
    source?: string;
  };
};

export type FundingMappingResponse = {
  fundingDetails: FundingDetailData;
  outstandingInvoices: TransformedInvoiceDataForMappingTable;
  invoicesMappedToThisFunding: TransformedInvoiceDataForMappingTable;
  unmappedFundings: UnmappedPaymentData[];
  thresholdMappingValue: number;
};

export type CurrencyWiseClientSummary = {
  totalInvoices: number;
  totalAmount: number;
  totalMappedAmount: number;
  currency: string;
};

export type ImporterGroupedData = {
  type: string;
  importerName: string;
  currencyWiseInvoiceSummary: CurrencyWiseClientSummary[];
  isLastInGroup: boolean;
};
export type OpenInvoiceData = {
  invoiceId: number;
  type: string;
  unmappedAmount: string;
  dueDate: string;
  exporterSystemInvoiceId: string;
  importerName: string;
  fileLink: string;
  amountMapped: number;
  currency: string;
  isLastInGroup: boolean;
  mappingDate: string;
  source?: string;
};

export type TransactionInvoiceSummaryDto = {
  id: number;
  importerId: number;
  currency: string;
  expectedAmount: number;
  expectedCurrency: string;
  raisedDate: string;
  status: string;
  paymentProcessor: string;
  amountMapped: number;
  amountSettled: number;
  amount: number;
  businessName: string;
  exporterSystemInvoiceId: string;
  dueDate: string;
  mappingDate: string;
};

export type InvoiceTableDataInFunding = ImporterGroupedData | OpenInvoiceData;

export type TransformedInvoiceDataForMappingTable = {
  listData: InvoiceTableDataInFunding[];
  importersList?: string[];
  currency?: string;
  totalMappedAmount?: number;
};

export type MappingType = MAPPING_TYPE;
