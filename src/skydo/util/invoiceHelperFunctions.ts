import { Invoice, Transaction } from "../types";
import { INVOICE_STATUS, INVOICE_STATUS_OVERVIEW_MAP } from "../constants/dashboardConstants";

export const filterOutstandingInvoices = (invoices: Invoice[]) => {
  return invoices.filter((invoice) => {
    if (
      [...INVOICE_STATUS_OVERVIEW_MAP.outstanding, ...INVOICE_STATUS_OVERVIEW_MAP.partially_paid].includes(
        invoice.status
      )
    ) {
      return true;
    } else if (invoice.status === INVOICE_STATUS.IN_PROGRESS && invoice.amountMapped < invoice.expectedAmount) {
      return true;
    }
    return false;
  });
};

export const isTransactionEligibleForReceipt = (transaction: Transaction): boolean => {
  return !(transaction?.collectionType === "PAYOUT" || transaction?.pricingRecord?.usdCharges == 0);
};
