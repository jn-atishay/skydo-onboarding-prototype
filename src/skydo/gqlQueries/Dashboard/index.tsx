export const FetchDashboardContainerExporterDetails = `
  query FetchDashboardContainerDetails {
    exporterUser {
      fullName
      registeredName
      emailAddress
      lastDashboardVisit
      isSkydoInvoiceDisabled
      exporter {
        skydoBalanceVendor
        exporterKyc {
          iecDetails {
            ieCode
            verifiedBy
          }
          shippingMethod{
            shippingMethod
          }
        }
        isEbrcFeatureActivated
        isAmazonUser
        selectedExporterIndustry {
          industryId
          industryType
        }
        settlementProductType
        onBoardingState
        businessType
        businessLegalName
        virtualAccountName
        correspondentName
        tag
        bankAccount {
          accountNumber
          isHdfcBankAccount
        }
        gstList{
          id
          gstin
          entryType
          authStatus
          address
        }
        defaultPurposeCode {
          defaultCode
        }
        einvoiceCredentialsList {
          id
          username
        }
        showEnableEInvoicePopUp
        virtualAccount {
          accountNumber
        }
        userPreference {
          skipEInvoice
          skipTestTransactionTutorial
          skipZohoSync
          skipPaypal
          preferences {
            mobileMappingBanner {
              isSkipped
            }
          }
        }
        isTransacting
        offboardingType
        mcaDocStatus
        totalUnsettledFunds
        isUaeActivationAllowed
      }
    }
    userDetailsPreKyc {
      businessName
    }
  }`;

export const FetchDashboardContainerFundingDetails = `query FetchDashboardContainerFundingDetails {
  unmappedFundings {
    id,
    amount,
    amountMapped,
    currency,
    senderName,
    creditedAt,
    vendor,
    fixedInr
  }
}`;

export const PHONE_NO_ONB_STATE = `query FetchUserState {
	exporterUser {
		phoneNumber
		exporter {
			onBoardingState
			businessType
		}
	}
}`;

export const FETCH_HAS_SUBMITTED_INSTANT_SETTLEMENT_FEEDBACK_QUERY = `query FetchExporterFeedbackStatus {
  exporter {
    hasSubmittedInstantSettlementFeedback
  }
}`;
