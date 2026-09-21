// The large fixture behind the business-details screen: the customer's own details,
// the 24-industry catalogue with its follow-up questions and search tags, and the
// per-business-type document menu.
import {
  BUSINESS_TYPES,
  COMPANY_TYPES,
  getProto,
} from "../prototype/state";
import {
  DOCS_BY_TYPE,
  INDUSTRIES,
  INDUSTRY_QUESTIONS,
  SAMPLE,
  displayName,
  onboardingStateForStep,
} from "./fixtures";

const AFTER_PAN = [
  "business-details",
  "aadhaar",
  "mobile-otp",
  "management",
  "bank",
  "documents",
  "verification",
  "home",
];

function panIsDone() {
  const p = getProto();
  return p.panVerified || AFTER_PAN.includes(p.step);
}

/** Industries, shaped the way the dropdown expects, with weighted search tags. */
export function industryList() {
  return INDUSTRIES.map((i) => ({
    id: String(i.id),
    name: i.label,
    riskCategory: i.risk,
    industryType: i.risk,
    metadata: (INDUSTRY_QUESTIONS[i.id] ?? []).map((q) => ({
      type: "BOOLEAN",
      question: q,
      subQuestion: null,
      questionSubLabel: null,
      scqOptions: null,
      options: { yes: "Yes", no: "No" },
    })),
    config: {
      searchTags: i.tags.map((t) => ({ term: t, weight: 2 })),
      fixedOption: i.label === "Others",
    },
  }));
}

/** The document menu, per business type, as operations configure it. */
export function docTypeDescriptions() {
  const rows: any[] = [];
  Object.entries(DOCS_BY_TYPE).forEach(([businessType, cfg]) => {
    cfg.mandatory.forEach((docName) =>
      rows.push({
        docType: docName.toUpperCase().replace(/[^A-Z]+/g, "_"),
        description: "",
        docName,
        businessType,
        isMandatory: true,
      })
    );
    cfg.optional.forEach((docName) =>
      rows.push({
        docType: docName.toUpperCase().replace(/[^A-Z]+/g, "_"),
        description: "",
        docName,
        businessType,
        isMandatory: false,
      })
    );
  });
  return rows;
}

/** Answer for the FetchCompanyPanDetails query. */
export function companyPanDetailsFixture() {
  const p = getProto();
  const done = panIsDone();
  const isCompany = COMPANY_TYPES.includes(p.businessType);
  const filled = ["aadhaar", "mobile-otp", "management", "bank", "documents", "verification", "home"].includes(p.step);

  return {
    exporterUser: {
      fullName: SAMPLE.name,
      exporter: {
        businessLegalName: done ? displayName() : "",
        verificationStatus: [
          { verificationStep: "EXPORTER_PAN_FETCHED", isVerified: done },
          { verificationStep: "EXPORTER_GST", isVerified: p.hasGst },
          {
            verificationStep: "EXPORTER_BANK_ACCOUNT",
            isVerified: ["documents", "verification", "home"].includes(p.step),
          },
        ],
        businessType: done ? p.businessType : null,
        correspondentName: SAMPLE.name,
        communicationAddress: SAMPLE.address,
        dateOfIncorporation: isCompany ? "2021-04-12" : null,
        cin: isCompany ? SAMPLE.cin : null,
        onBoardingState: onboardingStateForStep(),
        offboardingType: null,
        businessPAN: done ? p.panValue || SAMPLE.pan : null,
        isAmazonUser: false,
        exporterKyc: { kycDocList: [] },
        businessDescription: filled
          ? {
              website: "https://meridiandesign.example.com",
              businessDescription:
                "Brand and web design for clients in the United States and the United Kingdom, found mainly through LinkedIn and referrals.",
              websiteExist: true,
              marketingActivity:
                "Brand and web design for clients in the United States and the United Kingdom, found mainly through LinkedIn and referrals.",
              monthlyRevenue: p.businessType === BUSINESS_TYPES.FREELANCER ? "UNDER_10L_INR" : null,
            }
          : {
              website: null,
              businessDescription: null,
              websiteExist: null,
              marketingActivity: null,
              monthlyRevenue: null,
            },
        exporterIndustry: filled
          ? [{ industryId: 2, industryDescription: "Design and Creative Services", industryInfoResponse: null }]
          : [],
        gstList: p.hasGst
          ? [{ id: "1", gstin: "29ABCPS1234K1Z5", entryType: "PAN_FETCH", address: SAMPLE.address, nba: null }]
          : [],
        leads: [],
      },
    },
    industry: industryList(),
    docTypeDescription: docTypeDescriptions(),
  };
}

/** The identity step's verification flags, driven by how far the demo has got. */
export function identityVerificationStatus() {
  const p = getProto();
  const aadhaarDone = p.aadhaarStage === "verified" || ["mobile-otp", "management", "bank", "documents", "verification", "home"].includes(p.step);
  const phoneDone = ["management", "bank", "documents", "verification", "home"].includes(p.step);
  return [
    { verificationStep: "EXPORTER_PAN_FETCHED", isVerified: panIsDone() },
    { verificationStep: "AADHAAR_NAME_MATCH", isVerified: aadhaarDone },
    { verificationStep: "UBO_PHONE_OTP", isVerified: phoneDone },
  ];
}

/** Answer for the identity step's FETCH_DIRECTOR_DETAILS query. */
export function directorDetailsFixture() {
  const p = getProto();
  const aadhaarDone = p.aadhaarStage === "verified" || ["mobile-otp", "management", "bank", "documents", "verification", "home"].includes(p.step);
  return {
    exporterUser: {
      fullName: SAMPLE.name,
      registeredName: SAMPLE.name,
      phoneNumber: SAMPLE.phone,
      panNumber: p.panValue || SAMPLE.pan,
      isDirector: COMPANY_TYPES.includes(p.businessType),
      maskedAadhaar: aadhaarDone ? "XXXX XXXX 1891" : null,
      exporter: {
        businessLegalName: displayName(),
        correspondentName: SAMPLE.name,
        verificationStatus: identityVerificationStatus(),
        ubo: COMPANY_TYPES.includes(p.businessType)
          ? [{ fullName: "PRIYA SHARMA" }, { fullName: "ARJUN MEHTA" }]
          : [{ fullName: SAMPLE.legalName }],
      },
      exporterUserKyc: { kycDocList: [] },
    },
    defaultAadhaarVendor: "DIGILOCKER",
    sanctionCategories: [],
  };
}
