import { Invoice, Transaction } from "../types";
import { TRANSACTION_STATES, TRANSACTION_STATES_SERIES } from "../constants/dashboardConstants";

export interface GetPaidAmountFromTransactionOptions {
  /**
   * When true (default), an empty transaction list uses `invoice.amountMapped` (e.g. Zoho importer).
   * Set false when master funding / Skydo balance applies but transactions are not created yet — mapped
   * amount must not be treated as paid alongside balance fees & payout on the progress bar.
   */
  useAmountMappedWhenNoTransactions?: boolean;
}

export const getPaidAmountFromTransactionList = (
  invoiceData: Invoice,
  transactionList?: Transaction[],
  options?: GetPaidAmountFromTransactionOptions
): number => {
  const useAmountMappedFallback = options?.useAmountMappedWhenNoTransactions !== false;
  if (!transactionList || transactionList.length === 0) {
    return useAmountMappedFallback ? invoiceData?.amountMapped : 0;
  }

  const paidAmount = transactionList
    ? transactionList.reduce((acc: number, transaction: Transaction) => {
        if (transaction.transactionState === TRANSACTION_STATES.EXPORTER_SUCCESS) {
          return acc + transaction.amount;
        }
        return acc;
      }, 0)
    : 0;
  return paidAmount;
};

export const getInprogressAmountFromTransactionList = (transactionList?: Transaction[]): number => {
  const inprogressAmount = transactionList
    ? transactionList.reduce((acc: number, transaction: Transaction) => {
        if (
          transaction.transactionState !== TRANSACTION_STATES.EXPORTER_SUCCESS &&
          transaction.transactionState !== TRANSACTION_STATES.REJECTED
        ) {
          return acc + transaction.amount;
        }
        return acc;
      }, 0)
    : 0;
  return inprogressAmount;
};

export const isReceiptAvailableInTransactionList = (transactionList?: Transaction[]): boolean => {
  const isReceiptAvailable = transactionList
    ? transactionList.some((transaction: Transaction) => !!transaction?.payment?.paymentReceipt)
    : false;
  return isReceiptAvailable;
};

export const isAnyTransactionPastNostroReceiverSuccess = (transactionList?: Transaction[]): boolean => {
  return !!transactionList?.some(
    (transaction: Transaction) =>
      TRANSACTION_STATES_SERIES.indexOf(transaction?.transactionState || "") >=
      TRANSACTION_STATES_SERIES.indexOf(TRANSACTION_STATES.NOSTRO_RECEIVER_SUCCESS)
  );
};

export const getSettledAmountFromTransactionList = (transactionList?: Transaction[]): number => {
  const settledAmount = transactionList
    ? transactionList.reduce((acc: number, transaction: Transaction) => {
        if (transaction.amountSettled) {
          return acc + transaction.amountSettled;
        }
        return acc;
      }, 0)
    : 0;
  return settledAmount;
};

export const getFirstRefundedTransactionAndRefundReason = (transactionList?: Transaction[]) => {
  // console.log("transactionList", transactionList);
  const transaction = transactionList?.find(
    (transaction) =>
      transaction?.payment?.cashBackRecord?.cashbackProcessState === "SUCCESS" ||
      (transaction?.pricingRecord?.creditUsedINR ? transaction.pricingRecord.creditUsedINR > 0.0 : false)
  );
  return transaction != undefined;
};

export const isInvoiceSettled = (transactionList?: Transaction[]) => {
  return (
    transactionList?.some(
      (transaction) =>
        transaction.pricingRecord?.inrCharges ||
        transaction?.settlementDate != null ||
        transaction.pricingRecord?.creditUsedUSD
    ) ?? false
  );
};

export const isInvoiceCreditAppliedPartially = (transactionList?: Transaction[]) => {
  return transactionList?.some((transaction) => transaction.pricingRecord?.inrCharges || 0.0 > 0.0) ?? false;
};

export const isAnyTransactionContainsCashbackRecordUrl = (transactionList?: Transaction[]): boolean => {
  return !!transactionList?.some((transaction) => !!transaction?.payment?.cashBackRecord?.commercialCreditNoteUrl);
};

export const isCreditNoteAvailableInTransactionList = (transactionList?: Transaction[]): boolean => {
  return !!transactionList?.some((transaction) => !!transaction?.payment?.cashBackRecord?.commercialCreditNoteUrl);
};

/**
 * Display id for a payment in the invoiceless (Amazon payments) flow: the settlement SRN for
 * collection transactions, otherwise `SBRN-<invoice id>`. A master funding mapped to an invoice
 * (Skydo Balance) has no transaction until the exporter withdraws, and the withdrawal transaction's
 * SRN must NOT replace the reference the exporter has already seen — WITHDRAWAL-created
 * transactions never define the payment id.
 */
export const getInvoiceLessPaymentDisplayId = (invoiceData?: Invoice | null): string => {
  const balanceReferenceDisplayId = invoiceData?.id ? `SBRN-${invoiceData.id}` : "";
  const firstTransaction = invoiceData?.transaction?.[0];
  if (!firstTransaction || firstTransaction.transactionMetadata?.creationSource === "WITHDRAWAL") {
    return balanceReferenceDisplayId;
  }
  return firstTransaction.srn || balanceReferenceDisplayId;
};
