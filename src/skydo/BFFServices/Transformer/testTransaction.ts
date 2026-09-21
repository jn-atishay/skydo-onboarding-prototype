import { TestTransaction, TestTransactionConstants } from "../../types/TestTransaction";
import { TRANSACTION_STATES } from "../../constants/dashboardConstants";

export const transformTestTransactionData = (
  testTransactionData: TestTransaction,
  testTransactionConstants: TestTransactionConstants
) => {
  const state = testTransactionData.state;
  const readyToTransact = testTransactionData.readyToTransact;
  const invoicePaid = state == "EXPORTER_SUCCESS";
  const status = invoicePaid ? "PAID" : readyToTransact ? "IN_PROGRESS" : "OUTSTANDING";
  const transactionTracker = testTransactionData.testTransactionTrackers.map((it) => {
    return {
      transactionId: -1,
      actionTimestamp: it.actionTimestamp,
      transactionState: it.state,
    };
  });
  const paymentReceipt = invoicePaid
    ? {
        fileName: testTransactionData.testTransactionDocs.skydoReceiptName,
        fileUrl: testTransactionData.testTransactionDocs.skydoReceiptUrl,
        receiptDate: transactionTracker.find((x) => x.transactionState == TRANSACTION_STATES.EXPORTER_SUCCESS)
          ?.actionTimestamp,
      }
    : null;
  const fira = invoicePaid
    ? {
        fileName: testTransactionData.testTransactionDocs.firaName,
        fileUrl: testTransactionData.testTransactionDocs.firaUrl,
        createdAt: transactionTracker.find((x) => x.transactionState == TRANSACTION_STATES.EXPORTER_SUCCESS)
          ?.actionTimestamp,
      }
    : null;
  return {
    invoiceType: "INVOICE",
    invoiceId: "test",
    amount: testTransactionData.amount,
    submittedDate: testTransactionData.createdAt,
    currency: testTransactionConstants.currency,
    exporterSystemInvoiceId: testTransactionConstants.exporterSystemInvoiceId,
    fileLink: testTransactionData.testTransactionDocs.invoiceUrl,
    id: "test",
    importer: {
      businessName: testTransactionConstants.importerName,
    },
    status: status,
    readyToTransact: testTransactionData.readyToTransact,
    transaction: [
      {
        id: -1,
        createdAt: testTransactionData.createdAt,
        amountSettled: testTransactionData.amountSettled,
        amount: testTransactionData.amount,
        srn: testTransactionConstants.srn,
        dbsSettlement: {
          localUTR: testTransactionData.localUTR,
        },
        transactionMetadata: {
          expectedSettlementDate: testTransactionData.expectedSettlementDate,
        },
        pricingRecord: {
          totalCharges: 0,
          usdCharges: 0,
          inrCharges: 0,
          tax: 0,
        },
        payment: {
          id: 0,
          fxDeal: {
            bookingRate: testTransactionData.interbankRate,
            interbankRate: testTransactionData.interbankRate,
            currency: testTransactionConstants.currency,
            bookingTimeStamp: testTransactionData.interbankRateTimeStamp,
          },
          paymentReceipt: paymentReceipt,
        },
        currency: testTransactionConstants.currency,
        transactionAudit: transactionTracker,
        fira: fira,
        settlementDate: testTransactionData.settlementDate,
        transactionState: testTransactionData.state,
      },
    ],
    isRefundable: false,
    purposeCode: {
      code: testTransactionConstants.purposeCode,
      description: testTransactionConstants.purposeCodeDescription,
    },
    raisedDate: testTransactionData.createdAt,
    dueDate: testTransactionData.createdAt,
    amountMapped: testTransactionData.amount,
    expectedAmount: testTransactionData.amount,
    expectedCurrency: testTransactionConstants.currency,
    isTest: true,
    bankAccount: testTransactionData.bankAccount,
  };
};
