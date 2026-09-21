import { TRANSACTION_STATES, TRANSACTION_STATES_SERIES } from "../../constants/dashboardConstants";

interface InstantSettlementMockData {
  transactionId: number;
  amount: number;
  currency: string;
  createdAt: string;
  transactionState: string;
  amountSettled?: number;
  expectedSettlementDate?: string;
  interbankRate?: number;
  interbankRateTimestamp?: string;
  sourceCurrencyToUsdRate?: number;
  usdToInrRate?: number;
  bankAccount?: {
    accountNumber: string;
    bankMetadata: {
      bankName: string;
      logoURL?: string;
    };
  };
}

interface TransactionAuditEntry {
  transactionId: number;
  actionTimestamp: string;
  transactionState: string;
}

/**
 * Transform instant settlement data to match invoice structure
 * Only manipulates: transactionState, transactionAudit, settlementDate, and payment.fxDeal
 * Uses instantSettlement and transactionSettlement nodes from GraphQL
 * Rest of the data remains unchanged
 */
export const transformInstantSettlementData = (
  invoiceData: any,
  transaction: any,
  instantSettlement?: any,
  transactionSettlement?: any
): any => {
  // Determine the starting state for animation
  // Always start from VIRTUAL_ACCOUNT_SUCCESS for instant settlement animation
  const startState = TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS;
  const startStateIndex = TRANSACTION_STATES_SERIES.indexOf(startState);
  
  // Determine target state based on settledAt
  // If settledAt exists, target is EXPORTER_SUCCESS, otherwise one step before
  const exporterSuccessIndex = TRANSACTION_STATES_SERIES.indexOf(TRANSACTION_STATES.EXPORTER_SUCCESS);
  const targetStateIndex = transactionSettlement?.state === "SETTLEMENT_SUCCESS" 
    ? exporterSuccessIndex  // If settled, animate to EXPORTER_SUCCESS
    : Math.max(0, exporterSuccessIndex - 1);  // Otherwise, one step before (EXPORTER_PENDING)
  
  const targetState = TRANSACTION_STATES_SERIES[targetStateIndex];
  
  // Build transaction audit trail for animation
  const transactionTracker: TransactionAuditEntry[] = [];
  const now = new Date();
  
  // Add existing audit entries first (if any)
  const existingAudit: TransactionAuditEntry[] = transaction?.transactionAudit || [];
  
  // Get timestamps from transactionSettlement
  const initiatedAt = transactionSettlement?.initiatedAt 
    ? new Date(transactionSettlement.initiatedAt).toISOString()
    : new Date().toISOString();
  const settledAt = transactionSettlement?.settledAt 
    ? new Date(transactionSettlement.settledAt).toISOString()
    : null;
  
  // Create audit trail for all states from VIRTUAL_ACCOUNT_SUCCESS to target state
  if (startStateIndex >= 0 && targetStateIndex >= 0) {
    for (let i = startStateIndex; i <= targetStateIndex; i++) {
      const state = TRANSACTION_STATES_SERIES[i];
      const isLastState = i === targetStateIndex;
      const isExporterSuccess = state === TRANSACTION_STATES.EXPORTER_SUCCESS;
      
      // Use existing audit entry if available, otherwise create new one
      const existingEntry = existingAudit.find((audit: any) => audit.transactionState === state);
      if (existingEntry) {
        transactionTracker.push(existingEntry);
      } else {
        // Use settledAt for EXPORTER_SUCCESS (last state), initiatedAt for all others
        const actionTimestamp = (isLastState && isExporterSuccess && settledAt) 
          ? settledAt 
          : initiatedAt;
        
        transactionTracker.push({
          transactionId: transaction?.id || -1,
          actionTimestamp: actionTimestamp,
          transactionState: state,
        });
      }
    }
  }
  
  return {
    ...invoiceData,
    transaction: invoiceData.transaction?.map((txn: any) => {
      // Only transform the transaction that matches the instant settlement
      if (txn.id === transaction?.id) {
        // Calculate adjusted inrChargesBeforeCredits by subtracting instantSettlementChargesInr
        const instantSettlementChargesInr = txn.pricingRecord?.instantSettlementChargesInr || 0;
        const currentInrChargesBeforeCredits = txn.pricingRecord?.inrChargesBeforeCredits || 0;
        const adjustedInrChargesBeforeCredits = currentInrChargesBeforeCredits - instantSettlementChargesInr;
        
        return {
          ...txn,
          // 1. Update transactionState for animation
          transactionState: targetState,
          // 2. Update transactionAudit with full audit trail
          transactionAudit: transactionTracker,
          // 3. Update settlementDate from transactionSettlement.initiatedAt
          settlementDate: transactionSettlement?.initiatedAt || txn.settlementDate,
          // 4. Update payment.fxDeal with rates from transactionSettlement node
          payment: {
            ...txn.payment,
            fxDeal: {
              ...txn.payment?.fxDeal,
              // Use rates from transactionSettlement node (priority: transactionSettlement > existing fxDeal)
              interbankRate: transactionSettlement?.interbankRate || 
                txn.payment?.fxDeal?.interbankRate,
              sourceCurrencyToUsdRate: transactionSettlement?.sourceCurrencyToUsdRate || 
                txn.payment?.fxDeal?.sourceCurrencyToUsdRate,
              usdToInrRate: transactionSettlement?.usdToInrRate || 
                txn.payment?.fxDeal?.usdToInrRate,
              bookingTimeStamp: transactionSettlement?.interbankRateTimestamp || 
                txn.payment?.fxDeal?.bookingTimeStamp,
            },
          },
          // 5. Update pricingRecord to subtract instantSettlementChargesInr from inrChargesBeforeCredits
          pricingRecord: {
            ...txn.pricingRecord,
            inrChargesBeforeCredits: adjustedInrChargesBeforeCredits,
          },
        };
      }
      // Return transaction unchanged if it doesn't match
      return txn;
    }) || [],
    // Mark as instant settlement
    isInstantSettlement: true,
    instantSettlementState: transactionSettlement?.state || "SETTLEMENT_INITIATED",
  };
};

