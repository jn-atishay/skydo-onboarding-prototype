import { CurrencyWisePaymentSummary, Invoice } from "../index";

export const SORT_FIELDS = {
  clientName: "client_name",
  status: "status",
  invoiceDate: "invoice_date",
  dueDate: "due_date",
  invoiceAmount: "invoice_amount",
  invoiceNumber: "invoice_number",
  outstandingAmount: "outstanding_amount",
};

/**
 * If this is changed `SupportedSortFields` in BE also needs to be changed.
 */
export const SORT_FIELD_VAL_TO_BACKEND_MAPPING: Record<string, string> = {
  client_name: "importerName",
  status: "status",
  invoice_date: "raisedDate",
  due_date: "dueDate",
  invoice_amount: "amount",
  invoice_number: "exporterSystemInvoiceId",
  outstanding_amount: "outstandingAmount",
};

export const SORT_QUERY = "sort";
export const ORDER_QUERY = "order";
export const MULTI_SELECT_ALL = "all";
export const ORDER_VALUES = {
  ASCENDING: "asc",
  DESCENDING: "desc",
};
export const DEFAULT_SORT_BY = SORT_FIELDS.dueDate;
export const DEFAULT_SORT_ORDER = ORDER_VALUES.DESCENDING;

export const FILTER_IDS: Record<string, string> = {
  client: `client`,
  status: `status`,
  invoiceDate: `invoice_date`,
};

export const PAGE_QUERY = "page";
/**
 * not configurable for now
 */
export const PAGE_SIZE_QUERY = "size";
export const DEFAULT_PAGE_SIZE = 10;

export interface FilteredInvoicesSummary {
  outstandingSummary?: CurrencyWisePaymentSummary[];
  paidSummary?: CurrencyWisePaymentSummary[];
  totalNoOfInvoices?: number;
}

export interface FilterPageInfo {
  totalElements: number;
  totalPages: number;
}

export interface FilterApiResponse {
  summary: FilteredInvoicesSummary;
  filterPageInfo: FilterPageInfo;
  invoices: Invoice[];
}
