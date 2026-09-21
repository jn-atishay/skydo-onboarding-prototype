export const fetchActiveDocuments = `query FetchActiveDocuments {
  exporterUser {
    exporter {
      activeKycDocuments {
        docUrl
        isDocVerified
        docType
        complianceComments
        isDocRequested
        isDocumentFetched
        preSignedUrl
        lastUploadedTime
        docName
      }
      case{
        caseStatus
        caseType
        onboardingAlert{
          alertType
          status
        }
      }
      exporterKyc {
      iecDetails {
        ieCode
        verifiedBy
      }
    }
    }
  }
}
`

