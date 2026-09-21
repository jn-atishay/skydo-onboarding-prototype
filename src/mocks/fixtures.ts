// Stand-in data for every backend call the onboarding screens make.
// Values are invented sample data for a fictional customer; nothing here comes from a
// real account. The shapes match what the product's own code expects.
import { BUSINESS_TYPES, COMPANY_TYPES, getProto } from "../prototype/state";

export const SAMPLE = {
  name: "Atishay Jain",
  email: "atishay@example.com",
  phone: "9876543210",
  companyName: "Meridian Design Studio",
  legalName: "ATISHAY JAIN",
  companyLegalName: "MERIDIAN DESIGN STUDIO PRIVATE LIMITED",
  pan: "ABCPJ1234K",
  cin: "U74999KA2021PTC000000",
  bankAccount: "50100123456789",
  ifsc: "HDFC0000123",
  bankName: "HDFC Bank",
  branch: "Indiranagar, Bengaluru",
  address: "42 Residency Road, Bengaluru, Karnataka 560025",
  usdAccount: "8332583263",
};

/** The onboarding state the product expects for the screen currently being shown. */
export function onboardingStateForStep(): string {
  const { step, businessType } = getProto();
  switch (step) {
    case "login":
    case "email-otp":
    case "mobile":
    case "kyc-intro":
      return "SIGN_UP_SUCCESS";
    case "pan":
    case "business-details":
      return "COMPANY_PAN_DETAILS";
    case "aadhaar":
    case "mobile-otp":
      return "UBO_PAN_DETAILS";
    case "management":
      return "COMPANY_MANAGEMENT_DETAILS";
    case "bank":
    case "documents":
      return "COMPANY_BANK_ACCOUNT_DETAILS";
    case "verification":
      // Documents picked from the "other documents" list are checked by hand, so
      // those customers wait on the manual review screen instead of the loader.
      return getProto().docPath === "other" ? "MANUAL_VERIFICATION" : "BACKGROUND_VERIFICATION";
    case "home":
      return "BENEFICIARY_ACCOUNT_PENDING";
    default:
      return businessType ? "COMPANY_PAN_DETAILS" : "SIGN_UP_SUCCESS";
  }
}

export function isCompanyLike() {
  return COMPANY_TYPES.includes(getProto().businessType);
}

export function displayName() {
  return isCompanyLike() ? SAMPLE.companyLegalName : SAMPLE.legalName;
}

/** Response for the main onboarding GraphQL query. */
export function exporterUserFixture() {
  const p = getProto();
  const panDone = p.panVerified || ["business-details", "aadhaar", "mobile-otp", "management", "bank", "documents", "verification", "home"].includes(p.step);
  // From the bank step on, the account has been entered and matched: the bank card
  // shows it filled, with the green name match, waiting for the Yes/No answer.
  const bankDone = ["bank", "documents", "verification", "home"].includes(p.step);
  return {
    exporterUser: {
      fullName: SAMPLE.name,
      emailAddress: SAMPLE.email,
      phoneNumber: ["login", "email-otp", "mobile"].includes(p.step) ? null : SAMPLE.phone,
      exporter: {
        onBoardingState: onboardingStateForStep(),
        offboardingType: null,
        businessType: panDone ? p.businessType : null,
        businessLegalName: panDone ? displayName() : "",
        selectedExporterIndustry: { industryType: "LOW" },
        exporterIndustry: null,
        isAmazonUser: false,
        exporterKyc: { iecDetails: null },
        verificationStatus: [
          { verificationStep: "EXPORTER_PAN_FETCHED", isVerified: panDone },
          { verificationStep: "EXPORTER_GST", isVerified: p.hasGst },
          { verificationStep: "EXPORTER_BANK_ACCOUNT", isVerified: bankDone },
        ],
        bankAccount: bankDone
          ? {
              ifscCode: SAMPLE.ifsc,
              accountNumber: SAMPLE.bankAccount,
              accountHolderName: displayName(),
              isValid: true,
              isVerified: true,
              retry: false,
              bankBranch: SAMPLE.branch,
            }
          : null,
        businessDescription: { averageTransaction: null },
      },
    },
  };
}

/** The live industry catalogue: 24 options, four high risk, eight medium, eleven low. */
export const INDUSTRIES = [
  { id: 1, label: "IT and Software Services", risk: "LOW", tags: ["software", "development", "saas", "it"] },
  { id: 2, label: "Design and Creative Services", risk: "LOW", tags: ["design", "graphic", "ux", "branding"] },
  { id: 3, label: "Writing and Content", risk: "LOW", tags: ["content", "copywriting", "blog"] },
  { id: 4, label: "Marketing and Advertising", risk: "MEDIUM", tags: ["marketing", "ads", "seo"] },
  { id: 5, label: "Consulting and Advisory", risk: "MEDIUM", tags: ["consulting", "strategy"] },
  { id: 6, label: "Education and Training", risk: "LOW", tags: ["teaching", "tutoring", "courses"] },
  { id: 7, label: "Engineering Services", risk: "LOW", tags: ["engineering", "cad", "mechanical"] },
  { id: 8, label: "Accounting and Bookkeeping", risk: "MEDIUM", tags: ["accounting", "tax", "bookkeeping"] },
  { id: 9, label: "Legal Services", risk: "MEDIUM", tags: ["legal", "law", "paralegal"] },
  { id: 10, label: "Architecture and Interior", risk: "LOW", tags: ["architecture", "interior"] },
  { id: 11, label: "Media, Video and Animation", risk: "LOW", tags: ["video", "animation", "editing"] },
  { id: 12, label: "Online Seller: Marketplaces", risk: "MEDIUM", tags: ["amazon", "etsy", "ebay", "marketplace", "seller"] },
  { id: 13, label: "Online Seller: Own Website", risk: "MEDIUM", tags: ["shopify", "woocommerce", "d2c"] },
  { id: 14, label: "Handicrafts and Home Decor", risk: "LOW", tags: ["handicraft", "decor", "artisan"] },
  { id: 15, label: "Textiles and Apparel", risk: "LOW", tags: ["textile", "garment", "clothing"] },
  { id: 16, label: "Jewellery and Gems", risk: "MEDIUM", tags: ["jewellery", "gems", "diamond"] },
  { id: 17, label: "Agriculture and Food Products", risk: "LOW", tags: ["agriculture", "food", "spices"] },
  { id: 18, label: "Industrial Goods and Machinery", risk: "LOW", tags: ["machinery", "industrial", "parts"] },
  { id: 19, label: "Healthcare Services", risk: "MEDIUM", tags: ["healthcare", "medical", "telemedicine"] },
  { id: 20, label: "Travel and Tourism", risk: "MEDIUM", tags: ["travel", "tourism", "tours"] },
  { id: 21, label: "Others", risk: "HIGH", tags: ["other"] },
  { id: 22, label: "Pharma, Nutraceuticals and Supplements", risk: "HIGH", tags: ["pharma", "supplements", "drugs"] },
  { id: 23, label: "Games and Gaming Services", risk: "HIGH", tags: ["gaming", "games", "esports"] },
  { id: 24, label: "Real Estate and Property Services", risk: "HIGH", tags: ["real estate", "property"] },
];

/** Yes/no follow-ups shown for medium-risk industries. */
export const INDUSTRY_QUESTIONS: Record<number, string[]> = {
  4: ["Do you run advertising campaigns on behalf of overseas clients?", "Do you handle client ad budgets in your own account?"],
  5: ["Do you advise clients on investments or fundraising?"],
  8: ["Do you file tax returns on behalf of overseas clients?"],
  9: ["Do you hold client money in escrow?"],
  12: ["Do you sell on Amazon Global Selling?", "Do you ship goods directly to overseas buyers?"],
  13: ["Do you ship goods directly to overseas buyers?"],
  16: ["Do you export precious stones or metals?"],
  19: ["Do you provide direct patient care to overseas clients?"],
  20: ["Do you collect payments on behalf of hotels or airlines?"],
};

export const FREELANCER_DOCS = [
  { id: "BANK_STATEMENT", label: "Bank statement", help: "Last 3 months bank statement, it should include payments received from overseas clients" },
  { id: "CONTRACT", label: "Contract Agreement", help: "Signed and executed Contractual Agreement with the overseas buyer" },
  { id: "INVOICE", label: "Invoice billed to overseas buyer", help: "Invoice should be of last 3 months and should contain buyer name and address" },
  { id: "PLATFORM", label: "Platform screenshot", help: "Screenshot of Profile Page/Account Details on freelancing platforms like Toptal, Upwork, Fiverr etc" },
  { id: "ITR", label: "Full ITR-3 / ITR-4 form", help: "ITR Intimation under section 143 (1) issued by the income tax department" },
  { id: "COP", label: "Certificate of Practice", help: "Document issued to professionals like Doctors, Lawyers, CAs" },
  { id: "IEC", label: "Import Export Code", help: "Issued by the office of DGFT" },
];

/** Also offered to freelancers. Picking one of these converts them to a sole proprietor. */
export const SOLE_PROP_INDICATOR_DOCS = [
  { id: "UDYAM", label: "Udyam Registration Certificate", upgrades: true },
  { id: "SHOPS", label: "Shops and Establishment Act certificate", upgrades: true },
  { id: "TRADE", label: "Trade Licence", upgrades: true },
  { id: "UTILITY", label: "Utility bills", upgrades: true },
  { id: "RENTAL", label: "Rental Agreement", upgrades: true },
  { id: "INCORP", label: "Incorporation Certificate", upgrades: false },
];

export const DOCS_BY_TYPE: Record<string, { mandatory: string[]; optional: string[] }> = {
  [BUSINESS_TYPES.PRIVATE_LIMITED_COMPANY]: {
    mandatory: ["Memorandum of Association", "Articles of Association", "Certificate of Incorporation"],
    optional: ["Import Export Code"],
  },
  [BUSINESS_TYPES.LLP]: {
    mandatory: ["Certificate of Incorporation", "LLP Deed"],
    optional: ["Import Export Code"],
  },
  [BUSINESS_TYPES.PARTNERSHIP]: {
    mandatory: ["Partnership deed"],
    optional: ["FSSAI licence", "Gumasta registration", "Import Export Code", "Pharma/Drug licence", "Trade licence"],
  },
  [BUSINESS_TYPES.HUF]: {
    mandatory: ["HUF deed"],
    optional: ["FSSAI licence", "Gumasta registration", "Import Export Code", "Pharma licence", "Shops and Establishment", "Trade licence", "Udyam"],
  },
  [BUSINESS_TYPES.PROPRIETORSHIP]: {
    mandatory: [],
    optional: ["Udyam Registration Certificate", "Shops and Establishment Act certificate", "Full ITR-3 / ITR-4 form", "Import Export Code", "Certificate of Practice", "Utility bills", "Trade Licence", "Rental Agreement", "Incorporation Certificate"],
  },
  [BUSINESS_TYPES.FREELANCER]: {
    mandatory: [],
    optional: FREELANCER_DOCS.map((d) => d.label),
  },
};

export const DIRECTORS = [
  { name: "ATISHAY JAIN", din: "09123456", nationality: "Indian" },
  { name: "ARJUN MEHTA", din: "09234567", nationality: "Indian" },
];

export const PARTNERS = [
  { name: "ATISHAY JAIN", pan: "ABCPJ1234K", share: 60 },
  { name: "ARJUN MEHTA", pan: "ABCPM5678L", share: 40 },
];

export const INTERNATIONAL_ACCOUNTS = [
  { country: "United States of America", currency: "USD", flag: "🇺🇸", bank: "Community Federal Savings Bank", fields: [["Account number", SAMPLE.usdAccount], ["Routing number (ACH)", "026073150"], ["Fedwire routing number", "026073008"]] },
  { country: "United Kingdom", currency: "GBP", flag: "🇬🇧", bank: "Banking Circle", fields: [["Account number", "41827365"], ["Sort code", "608382"]] },
  { country: "Europe", currency: "EUR", flag: "🇪🇺", bank: "Banking Circle S.A.", fields: [["IBAN", "DE84 5051 0200 0001 2345 67"], ["BIC", "SXPYDEHH"]] },
  { country: "Canada", currency: "CAD", flag: "🇨🇦", bank: "Currency Cloud", fields: [["Account number", "20000012345"], ["Institution number", "621"], ["Transit number", "16001"]] },
  { country: "Australia", currency: "AUD", flag: "🇦🇺", bank: "BC Payments", fields: [["Account number", "412345678"], ["BSB number", "252000"]] },
  { country: "Singapore", currency: "SGD", flag: "🇸🇬", bank: "DBS Bank", fields: [["Account number", "0721234567"], ["BIC", "DBSSSGSG"]] },
];

export const TEST_TXN_STAGES = [
  { label: "USD 0.10 received in your Skydo account", done: true },
  { label: "Transfer initiated to Skydo India partner bank", done: true },
  { label: "Reached Skydo India partner bank", done: true },
  { label: "Converted to INR", done: true },
  { label: "INR settlement initiated to your HDFC Bank account", done: true, utr: "HDFCN52026092100123456" },
];
