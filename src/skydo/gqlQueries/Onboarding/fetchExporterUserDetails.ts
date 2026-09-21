const FetchExporterUserDetails = `
    query FetchUserState {
        exporterUser {
            fullName
            emailAddress
            phoneNumber
            exporter {
                onBoardingState
                offboardingType
                businessType
                businessLegalName
                selectedExporterIndustry {
                  industryType
                }
                exporterIndustry {
                    industryId
                    industryDescription
                    industryInfoResponse
                    entryType
                }
                isAmazonUser
                exporterKyc {
                  iecDetails {
                    ieCode
                    verifiedBy
                  }
                }
                verificationStatus {
                    verificationStep
                    isVerified
                }
                bankAccount {
                    ifscCode
                    accountNumber
                    accountHolderName
                    isValid
                    isVerified
                    retry
                    bankBranch
                }
                businessDescription {
                    averageTransaction
                }
            }
        }
    }
`;

export default FetchExporterUserDetails;
