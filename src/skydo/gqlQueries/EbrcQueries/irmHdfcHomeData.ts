export const IrmHdfcHomeDataQuery = `query IrmHdfcHomeQuery {
  fetchIrms {
    id
    irmNumber
    remitterName
    remittanceFccAmount
    remittanceFcc
    irmAvailableAmount
    irmApprovedAmount
    irmIssueDate
    purposeOfRemittance
    ebrcEligibleTransaction {
      amount
      currency
    }
  }
  pendingEligibleTransactions {
    id
    importerName
    settledAmount
    amount
    currency
    srn
    purposeCode
    settlementDate
    hdfcSettlement {
      localUTR
    }
  }
  unmappedShippingBills {
    id
    sbNumber
    originalFileName
    invoiceNumber
    url
    ebrcConsumedAmount
    sbFobValueInr
  }
  approvalPendingEbrcBatchDetails {
    batchStatus
    mappedShippingBills
  }
  dgftConfigDetails {
    lastIrmSyncDate
  }
}`;

export const EbrcListQuery = `query EbrcListQuery {
  allAvailableEbrc {
    id
    exporterId
    ebrcNumber
    ebrcDate
    ebrcStatus
    billNo
    sbCumInvoiceNumber
    sbCumInvoiceDate
    realizedAmount
    currency
    realizationDate
    brcUtilStatus
    shippingBill {
      consigneeName
    }
  }
}`;
