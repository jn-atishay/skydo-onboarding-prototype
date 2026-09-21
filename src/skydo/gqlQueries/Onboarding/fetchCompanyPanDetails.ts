const FetchCompanyPanDetails = `
    query FetchCompanyPanDetails {
    exporterUser {
      fullName
      exporter {
        businessLegalName
        verificationStatus {
          verificationStep
          isVerified
        }
        businessType
        correspondentName
        communicationAddress
        dateOfIncorporation
        cin
        onBoardingState
        offboardingType
        businessPAN
        isAmazonUser
        exporterKyc {
          kycDocList {
            docType
            preSignedUrl
          }
        }
        businessDescription {
          website
          businessDescription
          websiteExist
          marketingActivity
          monthlyRevenue
        }
        exporterIndustry {
          industryId
          industryDescription
          industryInfoResponse
        }
        gstList {
          id
          gstin
          entryType
          address
          nba
        }
        leads{
          sourceUrl
          responseDump{
            WHY_USE_SKYDO
            AVERAGE_TRANSACTION_VALUE
            AMAZON_SELLER
            PRIMARY_BUSINESS_ACTIVITY
            AMAZON_GLOBAL_SELLER_MARKETPLACE_GPT_RELEVANCE
            AMAZON_GLOBAL_SELLER_EXPERIENCE
          }
        }
      }
    }
    industry {
      id
      name
      riskCategory
      industryType
      metadata {
        type
        question
        subQuestion
        questionSubLabel
        scqOptions {
          label
          value
        }
        options {
          yes
          no
        }
      }
      config {
        searchTags {
          term
          weight
        }
        fixedOption
      }
    }
    docTypeDescription {
      docType
      description
      docName
      businessType
      isMandatory
    }
  }
`;

export default FetchCompanyPanDetails;
