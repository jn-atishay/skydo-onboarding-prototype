import JSHelpers from "../components/AtomicComponents/JSHelpers";
import { Exporter, Leads } from "../types/Exporter/ExporterUser";
import { Events } from "../analytics/EventConstants";
import { Analytics } from "../analytics/useAnalytics";
import {
  AVG_TRANSACTION_OPTIONS,
  AVG_TRANSACTION_VALUE,
  BUSSINESS_TYPES,
  INDIVIDUAL_BUSINESSES
} from "../constants/onboarding";
import { Option } from "../types/atomicComponentTypes";
import { WEBSITE_CONSTANTS } from "../constants/websiteConstants";
import { includeATSForConversionEvent } from "./onboardingUtil";

export const fireCommonCompanyPanDetailsSubmitEvent = (
  exporterData: Exporter,
  values: { industryId: number; averageTransaction?: string; primaryGstId?: string },
  analytics: Analytics,
  loggedInUserEmail: string,
  phoneNumber: string,
  industryOptions: Option[]
) => {
  const { businessLegalName, businessType } = exporterData || {};
  analytics?.identifyTraitsAsync({ businessLegalName: businessLegalName, businessType: businessType });
  
  let industryList: {
    [key: number]: string;
  } = {};
  industryOptions.forEach((industry) => {
    industryList[industry.value] = industry.label;
  });
  JSHelpers.callSafely(() => {
    const correctUseCaseCompanies = [
      "Technology Services/ Technology Consulting/ SaaS",
      "Marketing and Advertising",
      "Design / Graphic Design / Animation",
    ];
    if (
      exporterData?.leads?.some?.(
        (v: Leads) =>
          (v?.responseDump?.WHY_USE_SKYDO?.includes?.("Receive international business payments - Via bank transfer") ||
            v?.responseDump?.WHY_USE_SKYDO?.includes?.(
              "Receive international business payments through bank transfers"
            ) ||
            v?.responseDump?.WHY_USE_SKYDO?.includes?.("Receive international business payments")) &&
          !v?.responseDump?.WHY_USE_SKYDO?.includes?.("Crypto payments")
      ) &&
      correctUseCaseCompanies.includes(industryList[values?.industryId])
    ) {
      analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.CORRECT_USE_CASE_COMPANY_PAN_DETAILS_SUBMIT, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
  });

  if (
    industryList[values?.industryId] === "Technology Services/ Technology Consulting/ SaaS" &&
    !(
      values?.averageTransaction &&
      (values?.averageTransaction === AVG_TRANSACTION_OPTIONS[1].value ||
        values?.averageTransaction === AVG_TRANSACTION_OPTIONS[2].value)
    )
  ) {
    analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.TECHNOLOGY_COMPANY_PAN_DETAILS_SUBMIT, {
      email_address: loggedInUserEmail,
      phone_number: phoneNumber,
      country: "IN",
    });
  }

  const incorrectUseCaseCompanies = [
    "Ecommerce Seller",
    "Education/ E-learning / Professional Training / Coaching",
    "Leisure, Travel & Tourism",
    "Manufacturing",
    "Health, Wellness and Fitness",
  ];

  JSHelpers.callSafely(() => {
    let correctAnswerForUseCase = true;
    exporterData?.leads?.forEach((v) => {
      if (
        v?.responseDump?.WHY_USE_SKYDO &&
        v?.responseDump?.WHY_USE_SKYDO.length &&
        (!(
          v?.responseDump?.WHY_USE_SKYDO?.includes?.("Receive international business payments - Via bank transfer") ||
          v?.responseDump?.WHY_USE_SKYDO?.includes?.(
            "Receive international business payments through bank transfers"
          ) ||
          v?.responseDump?.WHY_USE_SKYDO?.includes?.("Receive international business payments")
        ) ||
          v?.responseDump?.WHY_USE_SKYDO?.includes?.("Crypto payments"))
      ) {
        correctAnswerForUseCase = false;
      }
    });
    if (
      correctAnswerForUseCase &&
      !incorrectUseCaseCompanies.includes(industryList[values?.industryId]) &&
      !(
        values?.averageTransaction &&
        (values?.averageTransaction === AVG_TRANSACTION_OPTIONS[1].value ||
          values?.averageTransaction === AVG_TRANSACTION_OPTIONS[2].value)
      )
    ) {
      analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.IDEAL_CUSTOMER_COMPANY_PAN_DETAILS_SUBMIT, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
  });

  JSHelpers.callSafely(() => {
    const irrelevantUseCaseCompanies = [
      "Ecommerce Seller",
      "Education/ E-learning / Professional Training / Coaching",
      "Leisure, Travel & Tourism",
      "Manufacturing",
      "Health, Wellness and Fitness",
    ];
    if (
      values.averageTransaction !== AVG_TRANSACTION_OPTIONS[1].value &&
      !irrelevantUseCaseCompanies.includes(industryList[values?.industryId])
    ) {
      analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.COMPANY_PAN_DETAILS_SUBMIT, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
    const companySatisfied =
      !INDIVIDUAL_BUSINESSES.includes(exporterData.businessType) ||
      (values?.primaryGstId !== null && values?.primaryGstId !== undefined);
    const excludedIndustriesForSolePropWithGstPanTriggerEvent = [
      "Ecommerce Seller",
      "Education/ E-learning / Professional Training / Coaching",
      "Leisure, Travel & Tourism",
      "Health, Wellness and Fitness",
      "Financial Services",
      "Gaming",
    ];

    const isManufacturingWithFreelancer =
      industryList[values?.industryId] === "Manufacturing" && exporterData.businessType === BUSSINESS_TYPES.FREELANCER;

    if (
      values?.averageTransaction &&
      !(
        values?.averageTransaction === AVG_TRANSACTION_OPTIONS[1].value ||
        values?.averageTransaction === AVG_TRANSACTION_OPTIONS[2].value
      ) &&
      !excludedIndustriesForSolePropWithGstPanTriggerEvent.includes(industryList[values?.industryId]) &&
      !isManufacturingWithFreelancer
    ) {
      analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.SOLE_PROP_WITH_GST_PAN_TRIGGER, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
    if (
      companySatisfied &&
      !(
        values?.averageTransaction &&
        (values?.averageTransaction === AVG_TRANSACTION_OPTIONS[1].value ||
          values?.averageTransaction === AVG_TRANSACTION_OPTIONS[2].value)
      ) &&
      !irrelevantUseCaseCompanies.includes(industryList[values?.industryId])
    ) {
      analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.ENTER_COMPANY_PAN_WITH_COMPANY_TYPE, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
  });

  JSHelpers.callSafely(() => {
    const correctUseCaseCompanies = [
      "Technology Services/ Technology Consulting/ SaaS",
      "Management/Business Consulting",
      "Marketing and Advertising",
      "Design / Graphic Design / Animation",
      "Staffing & Recruiting",
    ];
    const avgTransactionPossibleVals = [
      AVG_TRANSACTION_OPTIONS[3].value,
      AVG_TRANSACTION_OPTIONS[4].value,
      AVG_TRANSACTION_OPTIONS[5].value,
    ];
    if (
      correctUseCaseCompanies.includes(industryList[values?.industryId]) &&
      avgTransactionPossibleVals.includes(values?.averageTransaction)
    ) {
      analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.IDEAL_CUSTOMER_COMPANY_PAN_DETAILS_SUBMIT_V2, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
  });
  JSHelpers.callSafely(() => {
    const industryIdsToExclude = [4, 9, 13, 19, 20];
    const fireConversionEvent =
      !industryIdsToExclude.includes(values?.industryId) && includeATSForConversionEvent(values?.averageTransaction);
    if (fireConversionEvent) {
      analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.VIRTUAL_ACCOUNT_CREATE, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
  });

  JSHelpers.callSafely(() => {
    // Valid transaction sizes: "5K_1K_USD" (5K-10K) and ">10K_USD" (>10K)
    const validTransactionSizes = [AVG_TRANSACTION_VALUE[3], AVG_TRANSACTION_VALUE[4]]; // "5K_1K_USD", ">10K_USD"
    const validIndustries = [
      "Technology Services/ Technology Consulting/ SaaS",
      "Goods Export",
      "Manufacturing / Goods Exports",
      "Manufacturing", 
      "Staffing & Recruiting"
    ];
    
    const currentIndustry = industryList[values?.industryId];
    const currentTransactionSize = values?.averageTransaction? values?.averageTransaction: "";


    // Check if user selected crypto payments - if so, don't fire the event
    const hasCryptoPayments = exporterData?.leads?.some?.(
      (v: Leads) => v?.responseDump?.WHY_USE_SKYDO?.includes?.("Crypto payments")
    );

    const isException = currentIndustry === "Technology Services/ Technology Consulting/ SaaS" && 
                       currentTransactionSize === AVG_TRANSACTION_VALUE[3]; // "5K_1K_USD"


    if (validTransactionSizes.includes(currentTransactionSize) &&
        validIndustries.includes(currentIndustry) &&
        !isException &&
        !hasCryptoPayments) {
      analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.MCG_LEAD, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
  });


  JSHelpers.callSafely(() => {
    let suitableATS = false;
    let isSuitableATSFoundOnWebsite = false;
    exporterData?.leads?.some((v: Leads) => {
      if (v?.responseDump?.AVERAGE_TRANSACTION_VALUE !== undefined) {
        isSuitableATSFoundOnWebsite = true;
        if (
          !(
            v?.responseDump?.AVERAGE_TRANSACTION_VALUE?.includes?.(
              WEBSITE_CONSTANTS.AVERAGE_TRANSACTION_VALUES_ANSWERS.USD_0_TO_499
            ) ||
            v?.responseDump?.AVERAGE_TRANSACTION_VALUE?.includes?.(
              WEBSITE_CONSTANTS.AVERAGE_TRANSACTION_VALUES_ANSWERS.USD_500_TO_999
            )
          )
        ) {
          suitableATS = true;
        }
      }
    });
    if (
      !isSuitableATSFoundOnWebsite &&
      values?.averageTransaction &&
      !(
        values?.averageTransaction === AVG_TRANSACTION_VALUE[0] ||
        values?.averageTransaction === AVG_TRANSACTION_VALUE[1]
      )
    ) {
      suitableATS = true;
    }
    const isIncorrectUseCaseCompany = incorrectUseCaseCompanies.includes(industryList[values?.industryId]);
    if (suitableATS && !isIncorrectUseCaseCompany) {
      analytics.fireMarketingEvent(Events.TAG_MANAGER_EVENT.LEAD_COMPANY_PAN_DETAILS_SUBMIT_V3, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
  });
};


export const firePANSubmitEvent = (
  exporterData: Exporter,
  loggedInUserEmail: string,
  phoneNumber: string,
  analytics: Analytics,
  fireMarketingEvents?: boolean
) => {
  const { businessLegalName, businessType, gstList } = exporterData || {};
  analytics?.identifyTraitsAsync({ businessLegalName: businessLegalName, businessType: businessType });
  analytics?.trackAsync(Events.ENTITY_COMPANY_DETAILS_LOAD, { businessLegalName: businessLegalName });

  if (fireMarketingEvents) {
    JSHelpers.callSafely(() => {
      const hasQualifiedUseCase = exporterData?.leads?.some((lead: Leads) => {
        const whyUseSkydo = lead?.responseDump?.WHY_USE_SKYDO;

        return (
          whyUseSkydo?.includes("Receive international business payments") &&
          !whyUseSkydo.includes("Crypto payments")
        );
      });
      const hasCompanyPan = !INDIVIDUAL_BUSINESSES.includes(businessType);

      if (hasQualifiedUseCase && hasCompanyPan) {
        analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.LEAD_COMPANY, {
          email_address: loggedInUserEmail,
          phone_number: phoneNumber,
          country: "IN",
        });
      }
    });

    JSHelpers.callSafely(() => {
      let suitableATS = false;
      exporterData?.leads?.some((v: Leads) => {
        if (
          !(
            v?.responseDump?.AVERAGE_TRANSACTION_VALUE?.includes?.(
              WEBSITE_CONSTANTS.AVERAGE_TRANSACTION_VALUES_ANSWERS.USD_0_TO_499
            ) ||
            v?.responseDump?.AVERAGE_TRANSACTION_VALUE?.includes?.(
              WEBSITE_CONSTANTS.AVERAGE_TRANSACTION_VALUES_ANSWERS.USD_500_TO_999
            )
          )
        ) {
          suitableATS = true;
        }
      });
      if (suitableATS && (!INDIVIDUAL_BUSINESSES.includes(businessType) || gstList?.length > 0)) {
        analytics.fireMarketingEvent(Events.TAG_MANAGER_EVENT.LEAD_NBA, {
          email_address: loggedInUserEmail,
          phone_number: phoneNumber,
          country: "IN",
        });
      }
    });
    JSHelpers.callSafely(() => {
      let suitableATS = false;
      let suitableIndustry = false;
      exporterData?.leads?.some((v: Leads) => {
        if (
          !(
            v?.responseDump?.AVERAGE_TRANSACTION_VALUE?.includes?.(
              WEBSITE_CONSTANTS.AVERAGE_TRANSACTION_VALUES_ANSWERS.USD_0_TO_499
            ) ||
            v?.responseDump?.AVERAGE_TRANSACTION_VALUE?.includes?.(
              WEBSITE_CONSTANTS.AVERAGE_TRANSACTION_VALUES_ANSWERS.USD_500_TO_999
            ) ||
            v?.responseDump?.AVERAGE_TRANSACTION_VALUE?.includes?.(
              WEBSITE_CONSTANTS.AVERAGE_TRANSACTION_VALUES_ANSWERS.USD_10000_ABOVE
            )
          )
        ) {
          suitableATS = true;
        }
        if (
          v?.responseDump?.PRIMARY_BUSINESS_ACTIVITY &&
          !(
            v?.responseDump?.PRIMARY_BUSINESS_ACTIVITY?.includes("Leisure, Travel & Tourism") ||
            v?.responseDump?.PRIMARY_BUSINESS_ACTIVITY?.includes(
              "Education / E-learning / Professional Training / Coaching"
            ) ||
            v?.responseDump?.PRIMARY_BUSINESS_ACTIVITY?.includes("Manufacturing") ||
            v?.responseDump?.PRIMARY_BUSINESS_ACTIVITY?.includes("Health, Wellness and Fitness") ||
            v?.responseDump?.PRIMARY_BUSINESS_ACTIVITY?.includes("Forex Trading/Stocks")
          )
        ) {
          suitableIndustry = true;
        }
      });
      if (suitableATS && suitableIndustry) {
        analytics.fireMarketingEvent(Events.TAG_MANAGER_EVENT.LEAD_ICP_SUBMIT_V2, {
          email_address: loggedInUserEmail,
          phone_number: phoneNumber,
          country: "IN",
        });
      }
    });


    JSHelpers.callSafely(() => {

      const hasQualifiedLead = exporterData?.leads?.some?.((v: Leads) => {
        const why = v?.responseDump?.WHY_USE_SKYDO;
        const ats = v?.responseDump?.AVERAGE_TRANSACTION_VALUE;
        const hasATS =
          Array.isArray(ats) &&
          ats.length > 0 &&
          !ats?.includes?.(WEBSITE_CONSTANTS.AVERAGE_TRANSACTION_VALUES_ANSWERS_FOR_LEAD_CARD.USD_0_TO_249);
             return (why?.includes?.("Receive international payments via credit cards") ||
                 why?.includes?.("Receive international business payments (export payments)")) &&
               !why?.includes?.("Crypto payments") && hasATS;
           });
      if (hasQualifiedLead) {
        analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.LEADCARD, {
          email_address: loggedInUserEmail,
          phone_number: phoneNumber,
          country: "IN",
        });
      }
    });


    JSHelpers.callSafely(() => {
      let hasValidUseCase = false;
      let hasValidATS = false;

      exporterData?.leads?.some?.((v: Leads) => {
        if (
          v?.responseDump?.WHY_USE_SKYDO?.includes?.("Receive international business payments") &&
          !v?.responseDump?.WHY_USE_SKYDO?.includes?.("Crypto payments")
        ) {
          hasValidUseCase = true;
        }

        const atsValue = parseInt(v?.responseDump?.AVERAGE_TRANSACTION_VALUE?.[0] || "0");
        if (atsValue > 2000 && atsValue < 50000) {
          hasValidATS = true;
        }
      });

      if (hasValidUseCase && hasValidATS) {
        analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.LEAD_ATS_MANUAL, {
          email_address: loggedInUserEmail,
          phone_number: phoneNumber,
          country: "IN",
        });
      }
    });
    JSHelpers.callSafely(() => {
      let isGlobalAmazonSeller = false;

      exporterData?.leads?.some?.((v: Leads) => {
        if (
          v?.responseDump?.AMAZON_SELLER?.[0] === "Amazon US, UK, Europe, etc" &&
          v?.responseDump?.AMAZON_GLOBAL_SELLER_MARKETPLACE_GPT_RELEVANCE?.[0] === "RELEVANT"
        ) {
          isGlobalAmazonSeller = true;
        }
      });

      if (isGlobalAmazonSeller) {
        analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.AMAZON_SELLER_COMPANY_OR_GST_PAN_SUBMIT, {
          email_address: loggedInUserEmail,
          phone_number: phoneNumber,
          country: "IN",
        });
      }
    });
    JSHelpers.callSafely(() => {
      if (
        exporterData?.leads?.some?.(
          (v: Leads) =>
            v?.sourceUrl?.toLowerCase()?.startsWith("/amazon-global-sellers") &&
            [
              "Amazon US",
              "Amazon UK",
              "Amazon Europe",
              "Amazon Canada",
              "Amazon Mexico",
              "Amazon UAE",
              "Amazon Australia",
            ].some((it) => v?.responseDump?.AMAZON_SELLER?.includes(it)) &&
            !v?.responseDump?.AMAZON_GLOBAL_SELLER_EXPERIENCE?.includes("Not started yet")
        )
      ) {
        analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.LEAD_AMAZON_GLOBAL_SELLER, {
          email_address: loggedInUserEmail,
          phone_number: phoneNumber,
          country: "IN",
        });
      }
    });
    JSHelpers.callSafely(() => {
      if (
        exporterData?.leads?.some?.(
          (v: Leads) =>
            v?.sourceUrl?.toLowerCase()?.startsWith("/features/receive-international-payments") &&
            !!v?.responseDump?.WHY_USE_SKYDO &&
            !v?.responseDump?.WHY_USE_SKYDO?.includes("Crypto payments") &&
            v?.responseDump?.WHY_USE_SKYDO?.includes("Receive international business payments (export payments)") &&
            !!v?.responseDump?.AVERAGE_TRANSACTION_VALUE &&
            !v?.responseDump?.AVERAGE_TRANSACTION_VALUE.includes("0 - 499 USD") &&
            !v?.responseDump?.AVERAGE_TRANSACTION_VALUE.includes("500 - 999 USD")
        )
      ) {
        analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.ICP_LEAD_V2, {
          email_address: loggedInUserEmail,
          phone_number: phoneNumber,
          country: "IN",
        });
      }
    });
  }
};
