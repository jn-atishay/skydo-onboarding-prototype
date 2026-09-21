// The large fixture behind the business-details screen: the customer's own details,
// the 24-industry catalogue with its follow-up questions and search tags, and the
// per-business-type document menu.
import {
  BUSINESS_TYPES,
  COMPANY_TYPES,
  getProto,
} from "../prototype/state";
import {
  DIRECTORS,
  PARTNERS,
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
        exporterKyc: { kycDocList: [], iecDetails: null },
        // The documents card names the account ("bank statement for account number
        // XX6789"), so it needs the account entered on the bank step.
        bankAccount: ["bank", "documents", "verification", "home"].includes(p.step)
          ? {
              ifscCode: SAMPLE.ifsc,
              accountNumber: SAMPLE.bankAccount,
              accountHolderName: displayName(),
              isValid: true,
              retry: false,
              bankBranch: SAMPLE.branch,
            }
          : null,
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

/**
 * The people behind a company-like business. For a private limited company or LLP
 * the directors arrive pre-filled from company records (MCA); partners of a
 * partnership and the karta of an HUF are typed in by the customer.
 */
export function managementFixture() {
  const p = getProto();
  const fromRecords = p.businessType === BUSINESS_TYPES.PRIVATE_LIMITED_COMPANY || p.businessType === BUSINESS_TYPES.LLP;
  const ubo = fromRecords
    ? DIRECTORS.map((d, i) => ({
        id: `dir-${i}`,
        fullName: d.name,
        isPrimary: i === 0,
        nationality: d.nationality,
        ownershipPercentage: null,
        uboSource: "MCA",
        pan: null,
        nameMatched: true,
      }))
    : p.businessType === BUSINESS_TYPES.HUF
    ? [
        {
          id: "karta-0",
          fullName: PARTNERS[0].name,
          isPrimary: true,
          nationality: "Indian",
          ownershipPercentage: null,
          uboSource: "USER_ENTERED",
          pan: PARTNERS[0].pan,
          nameMatched: true,
        },
      ]
    : PARTNERS.map((d, i) => ({
        id: `partner-${i}`,
        fullName: d.name,
        isPrimary: i === 0,
        nationality: "Indian",
        ownershipPercentage: d.share,
        uboSource: "USER_ENTERED",
        pan: d.pan,
        nameMatched: true,
      }));
  return {
    exporterUser: {
      exporter: {
        businessType: p.businessType,
        verificationStatus: [{ verificationStep: "UBO_DETAILS_ACCEPTED", isVerified: false }],
        ubo,
        sanctionCategories: [],
      },
    },
    country: ["Indian", "American", "British", "Canadian", "Singaporean", "Emirati"].map((nationality) => ({ nationality })),
  };
}
