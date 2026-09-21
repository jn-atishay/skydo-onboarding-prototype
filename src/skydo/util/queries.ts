export const VirtualAccountDetailsQuery = `query FetchVirtualAccountDetails($currencyList: [Currency]!){
  virtualAccountDetails(currencyList: $currencyList) {
    virtualAccounts {
      accountNumber,
      routingCodeType,
      paymentType,
      routingNumber,
      bankName,
      currency,
      bankAddress,
      accountProvider,
      bankCode,
      accountRole
    }
  }
}`;

export const PaginatedInvoicesQuery = `query FetchPaginatedInvoices($currencyList: [Currency]!) {
  invoicesWithPagination(currencyList : $currencyList) {
    id,
    amount,
    currency,
    amountMapped,
    expectedAmount,
    expectedCurrency,
    submittedDate,
    raisedDate,
    isRefundable,
    dueDate,
    fileLink,
    fileName,
    status,
    invoiceId,
    invoiceType,
    exporterSystemInvoiceId,
    purposeOfInvoice,
    eInvoice {
      irn,
      irnTimestamp
      },
    importer {
     businessName,
     emailAddress
    },
    transaction {
     srn,
     transactionMetadata {
      creationSource
     },
     settlementDate
     senderAlertDetails {
      alertStatus
     },
     createdAt,
     fira {
			 fileUrl,
			 fileName
     },
     amountSettled,
     pricingRecord {
        totalCharges
        instantSettlementChargesInr
        instantSettlementChargesCurrency
        instantSettlementCharges
        usdCharges
        inrCharges
        localCharges
        creditUsedUSD
        creditUsedINR
        inrChargesBeforeCredits
        tax
     },
     payment {
      cashBackRecord{
        id,
        cashbackProcessState,
        commercialCreditNoteUrl,
        ccnFilename,
      },
      paymentReceipt {
        fileUrl,
        fileName,
        receiptDate
       }
     }
    },
    invoiceMetadata {
      source
    },
    paymentProcessor,
    didSendInvoiceOrReminderEmail,
    paymentLink
    veemDebitSuccessful
    invoiceInstantSettlementDetails {
      eligibilityState
      settlementMethodInCaseOfInitiatedInstantSettlement
      bufferRequired
      data {
        numberOfInvoices
        numberOfTransactions
        transactionDetails {
          importerName
          invoiceNumber
          amount
          currency
        }
        totalAmount
        totalAmountCurrency
        extraCharges
        extraChargesCurrency
        instantSettlementPricingPercentage
        normalSettlementDate
        expectedInstantSettlementTime
        settlementMethod
      }
    }
  }
}`;

export const INSTANT_SETTLEMENT_PREVIEW_QUERY = `query InstantSettlementPreview($invoiceId: Long!) {
  instantSettlementPreview(invoiceId: $invoiceId) {
    status
    disabledReason
    breakdown {
      settlementMethod
      normalSettlementDate
      bufferRequired
      instantSettlementFeePercentage
      platformFeePercentage
      scope {
        numberOfInvoices
        numberOfTransactions
        totalAmount
        totalAmountCurrency
        transactions {
          importerName
          invoiceNumber
          amount
          currency
        }
      }
      grossAmount { amount currency }
      platformFee { amount currency }
      regionalPremium { amount currency }
      instantSettlementFee { amount currency }
      gst { taxPercent splitType }
    }
  }
}`;

export const AddCustomerFeedbackMutation = `mutation addCustomerFeedback($questionType: QuestionType, $answer: String){
    addCustomerFeedback(questionType: $questionType, answer: $answer)
}`;

export const exporterLogoAndDescriptionQuery = `query fetchExporterLogoAndDescription { 
    exporterUser{
        exporter {
            virtualAccountName
            businessDescription{
                logoUrl
            }
        }
    }
}`;

export const INVOICE_DETAILS_UNPARSED_QUERY = `query FetchInvoiceDetails($invoiceId: Long!){
  unparsedInvoice(invoiceId: $invoiceId) {
    invoiceId,
    invoiceType,
    id,
    amount,
    currency,
    submittedDate,
    fileLink,
    fileName,
    status,
    exporterSystemInvoiceId,
    purposeOfInvoice,
    dueDate,
    reasonToArchive,
    importer {
     id,
     businessName,
     emailAddress
    },
    bankAccount {
      accountNumber,
      bankMetadata {
        bankName,
        logoURL,
      }
    }
  }
}`;

export const INVOICE_DETAILS_QUERY = `query FetchInvoiceDetails($invoiceId: Long!, $currencyList: [Currency]!) {
  parsedInvoice(invoiceId: $invoiceId, currencyList : $currencyList) {
    invoiceId,
    invoiceInstantSettlementDetails {
      eligibilityState
      settlementMethodInCaseOfInitiatedInstantSettlement
      bufferRequired
      data {
        numberOfInvoices
        numberOfTransactions
        transactionDetails {
          importerName
          invoiceNumber
          amount
          currency
        }
        totalAmount
        totalAmountCurrency
        extraCharges
        extraChargesCurrency
        instantSettlementPricingPercentage
        normalSettlementDate
        expectedInstantSettlementTime
        settlementMethod
      }
    }
    invoiceType,
    id,
    amount,
    currency,
    submittedDate,
    amountMapped,
    expectedAmount,
    expectedCurrency,
    fileLink,
    fileName,
    status,
    exporterSystemInvoiceId,
    purposeOfInvoice,
    isRefundable,
    paymentLink,
    activationRewardOnInvoice {
      campaignName,
      applicable,
      expiryDate
    },
    eInvoice {
      irn,
      irnTimestamp,
      signedQrCode
    },
    purposeCode{
      code,
      description
    },
    dueDate,
    raisedDate,
    reasonToArchive,
    importer {
     id,
     businessName,
     emailAddress
    },
    transaction {
      collectionType,
      fixedInr
      funding {
        id,
        amount,
        amountMapped,
        currency,
        creditedAt,
        vendor,
        veemOrder {
          id,
          status,
          method,
          debitInitiatedTime,
          amountReceivedTime,
          frozenTill,
          expectedArrivalTime
        },
        fundingMethod,
        paymentConfirmation {
          fundingId,
          invoiceId,
          sentAt,
        }
     }
     senderAlertDetails {
      caseId
      alertStatus
      alertDocUrls
      senderName
      proofType
      proofContent
      proofSampleUrl
      proofTutorialUrl
     },
     failureReasonDto {
      text,
      title
     },
     id,
     amount,
     currency,
     createdAt,
     transactionState,
     amountSettled, #amount in INR
     srn,
     settlementDate,
     dbsSettlement{
       localUTR
     },
     hdfcSettlement{
      localUTR
     },
     transactionIncident {
         incidentType,
         incidentDate,
         incidentDescription
     }
     transactionMetadata {
      expectedSettlementDate,
      creationSource,
      bankAccount {
        accountNumber,
        bankMetadata {
          bankName,
          logoURL,
        }
      }
    },
      transactionAudit {
        transactionId,
        actionTimestamp,
        transactionState
      },
      fira {
        fileUrl,
        fileName,
        createdAt
      },
      instantSettlement {
        id,
        transactionId,
        type
      },
      transactionSettlement {
        id,
        transactionId,
        state,
        initiatedAt,
        settledAt
      },
      pricingRecord {
       totalCharges,
       instantSettlementChargesInr,
       instantSettlementChargesCurrency,
       instantSettlementCharges,
       usdCharges,
       inrCharges,
       localCharges,
       creditUsedUSD
       creditUsedINR
       inrChargesBeforeCredits
       tax
      },
      payment {
       id
       pricingBucket
       executedPricingCondition
       creditUsedUSD
       creditUsedINR
       inrChargesBeforeCredits
       sezType
       fxDeal {
         interbankRate,
         currency,
         bookingTimeStamp,
         sourceCurrencyToUsdRate,
         usdToInrRate,
         ibrTimestamp
       },
       paymentReceipt {
          fileUrl,
          fileName,
          receiptDate
       }
       transaction {
         id
       },
       cashBackRecord{
       id,
       cashbackProcessState,
       commercialCreditNoteUrl,
       ccnFilename,
       cashbackReasonType
       dbsCashBackSettlement{
         localUTR,
         updatedAt
       }
       }
     }
    },
    paymentProcessor,
    invoiceMetadata {
      paymentProcessorDetails,
      paymentDate,
      paymentAmountInr,
      source,
      remainderAmount,
      remainderCurrency,
      markFullyPaidReason
    },
    bankAccount {
      accountNumber,
      bankMetadata {
        bankName,
        logoURL,
      }
    },
    didSendInvoiceOrReminderEmail,
  }
}`;

export const INVOICE_DETAILS_TEST_QUERY = `query FetchInvoiceDetails {
  testTransaction {
    exporterId
    amount
    createdAt
    expectedSettlementDate
    state
    interbankRate
    interbankRateTimeStamp
    amountSettled
    settlementDate
    localUTR
    readyToTransact
    testTransactionTrackers {
      actionTimestamp,
      state
    },
    testTransactionDocs {
      firaName
      firaUrl
      skydoReceiptName
      skydoReceiptUrl
      invoiceName
      invoiceUrl
    }
    bankAccount {
      accountNumber,
      bankMetadata {
        bankName,
        logoURL,
      }
    }
  }
}`;

export const INVOICE_DETAILS_TEST_CONSTANTS_QUERY = `query FetchInvoiceDetails {
  testTransactionConstants {
    amount
    importerName
    country
    exporterSystemInvoiceId
    srn
    currency
    purposeCode
    purposeCodeDescription
    totalFees
    inrFees
    gstFees
    usdCharges
  },
}`;

export const EXPORTER_QUERY = `query FetchExporter {
  exporter {
    id
  }
}`;

export const EXPORTER_ONBOARDING_STATE_QUERY = `query FetchExporter {
  exporter {
    onBoardingState
  }
}`;

export const EXPORTER_MILESTONES_QUERY = `query FetchExporterMilestones {
  exporterUser {
    exporter {
      exporterMilestone {
        id
        milestoneType
        currency
        createdAt
        milestoneShowCount
        milestoneYear
      }
      correspondentName
      businessDescription {
        logoUrl
      }
    }
  }
}`;

export const FETCH_EXPORTER_LEVEL_NOTIFICATIONS = `query FetchExporterLevelNotifications {
  exporterUser {
    exporter {
      exporterNotification {
        tag
        bodyLink
        notificationType
        title
        description
        date
      }
    }
  }
}`;

export const RecentPaymentsMobileConfig = `query RecentPaymentsMobileConfig {
  recentPaymentsMobileConfig 
}`;

export const RecentInvoicesMobile = `query RecentInvoicesMobile {
  recentInvoicesMobile {
    id,
    amount,
    currency,
    amountMapped,
    expectedAmount,
    expectedCurrency,
    submittedDate,
    raisedDate,
    isRefundable,
    dueDate,
    fileLink,
    fileName,
    status,
    invoiceId,
    invoiceType,
    exporterSystemInvoiceId,
    purposeOfInvoice,
    eInvoice {
      irn,
      irnTimestamp
      },
    importer {
     businessName,
     emailAddress
    },
    invoiceMetadata {
      source
    },
    paymentProcessor,
    didSendInvoiceOrReminderEmail,
  }
}`;

export const RecentPaymentsMobile = `query RecentPaymentsMobile {
  recentPaymentsMobile {
    id,
    amount,
    currency,
    amountMapped,
    expectedAmount,
    expectedCurrency,
    submittedDate,
    raisedDate,
    isRefundable,
    dueDate,
    fileLink,
    fileName,
    status,
    invoiceId,
    invoiceType,
    exporterSystemInvoiceId,
    purposeOfInvoice,
    eInvoice {
      irn,
      irnTimestamp
      },
    importer {
     businessName,
     emailAddress
    },
    transaction {
     srn,
     transactionMetadata {
      creationSource
     },
     settlementDate
     senderAlertDetails {
      alertStatus
     },
     createdAt,
     fira {
			 fileUrl,
			 fileName
     },
     amountSettled,
     pricingRecord {
        totalCharges
        usdCharges
        inrCharges
        localCharges
        creditUsedUSD
        creditUsedINR
        inrChargesBeforeCredits
        tax
        instantSettlementChargesInr
        instantSettlementChargesCurrency
        instantSettlementCharges
     },
     payment {
      cashBackRecord{
        id,
        cashbackProcessState,
        commercialCreditNoteUrl,
        ccnFilename,
      },
      paymentReceipt {
        fileUrl,
        fileName,
        receiptDate
       }
     }
    },
    invoiceMetadata {
      source
    },
    paymentProcessor,
    didSendInvoiceOrReminderEmail,
    veemDebitSuccessful
    invoiceInstantSettlementDetails {
      eligibilityState
      settlementMethodInCaseOfInitiatedInstantSettlement
      bufferRequired
      data {
        numberOfInvoices
        numberOfTransactions
        transactionDetails {
          importerName
          invoiceNumber
          amount
          currency
        }
        totalAmount
        totalAmountCurrency
        extraCharges
        extraChargesCurrency
        instantSettlementPricingPercentage
        normalSettlementDate
        expectedInstantSettlementTime
        settlementMethod
      }
    }
  }
}`;
