import { FundingData } from "../Funding";
import { Importer, Invoice } from "../index";
import { ExporterDetails } from "../DashboardContainer";

export interface CurrencyWiseInvoices {
  totalInvoiceAmount: number;
  noOfInvoices: number;
  currency: string;
}

export interface EmailSettings {
  savedEmails: string[];
  paymentConfirmationActive: boolean;
}

export interface ClientLedgerSummary {
  importerName: string;
  currencyWiseTotalInvoices: CurrencyWiseInvoices[];
  currencyWiseOutstandingInvoices: CurrencyWiseInvoices[];
  oldestUnpaidDate: string;
  oldestUnpaidAmount: number | string;
  oldestUnpaidCurrency: string;
  importerId: number;
  totalInvoiced: number;
  emailSettings?: EmailSettings;
  totalInvoicedAmount?: number;
  totalOutstandingAmount?: number;
  country?: string;
}

export interface ClientDetails {
  importerName: string;
  importerEmail: string;
  importerContactName: string;
  importerContactNumber: string;
  importerWebsite: string;
  currencyWiseTotalInvoices: CurrencyWiseInvoices[];
  currencyWiseOutstandingInvoices: CurrencyWiseInvoices[];
  importerId: number;
  emailSettings?: EmailSettings;
  otherDetails: ImporterOtherDetails[];
}

export interface ImporterOtherDetails {
  type: "CONTRACT" | "NOTES";
  fileName: string;
  details?: string | null;
  updatedAt: string;
}

export interface CurrencyWiseTotal {
  currency: string;
  total: number;
  count: number; // count of invoices / payments
}

export interface FinancialItem {
  /**
   * invoice --> exporterSystemInvoiceId, funding --> id
   */
  id: string;

  /**
   * only for invoice
   */
  status?: string;

  /**
   * invoice --> expectedCurrency, funding --> currency
   */
  currency: string;
  amount: number;

  /**
   * invoice --> raisedDate
   * funding --> creditedDate
   */
  date: string;

  /**
   * only for invoice
   * attachmentLink (invoice file)
   */
  link?: string;

  /**
   * only for invoice
   */
  expectedAmount?: number;

  type: "invoice" | "payment";

  extra?: Invoice | FundingData;
}

export interface ClientLedgerTimelineData {
  invoiceFundingCommonList: Array<FinancialItem>;
  totalInvoiced: Array<CurrencyWiseTotal>;
  totalReceived: Array<CurrencyWiseTotal>;
  totalPaidOutsideSkydo: Array<CurrencyWiseTotal>;
  summary?: any;
  exporter?: ExporterDetails;
  importer?: Importer;
  accountsPageLink?: string;
  logoUrl?: string;
}
