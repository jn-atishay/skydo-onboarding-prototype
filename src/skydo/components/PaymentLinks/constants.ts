import { ROUTING_CODE_TYPES } from "../../util/functions";

export const US_ACCOUNT_OPTIONS = {
  ACH: "ACH",
  FEDWIRE: "Fedwire",
  SWIFT: "SWIFT",
};

export const US_ACCOUNT_OPTIONS_LIST = ["ACH", "Fedwire", "SWIFT"];

export const EUR_ACCOUNT_OPTIONS = {
  SEPA: "SEPA",
  SWIFT: "SWIFT",
};

export const EUR_ACCOUNT_OPTIONS_LIST = ["SEPA", "SWIFT"];

export const GBP_ACCOUNT_OPTIONS = {
  FPS: "FPS",
  SWIFT: "SWIFT",
};

export const GBP_ACCOUNT_OPTIONS_LIST = ["FPS", "SWIFT"];

export const CAD_ACCOUNT_OPTIONS = {
  EFT: "EFT",
  SWIFT: "SWIFT",
};

export const CAD_ACCOUNT_OPTIONS_LIST = ["EFT", "SWIFT"];

export const SWIFT_ACCOUNT_OPTIONS = {
  SWIFT: "SWIFT",
};

export const SWIFT_ACCOUNT_OPTIONS_LIST = ["SWIFT"];

export const ACCOUNT_OPTIONS_TO_ROUTING_CODE_MAP = {
  [US_ACCOUNT_OPTIONS.ACH]: ROUTING_CODE_TYPES.ACH_ROUTING_NUMBER,
  [US_ACCOUNT_OPTIONS.FEDWIRE]: ROUTING_CODE_TYPES.WIRE_ROUTING_NUMBER,
  [EUR_ACCOUNT_OPTIONS.SEPA]: ROUTING_CODE_TYPES.BIC_SWIFT,
  [GBP_ACCOUNT_OPTIONS.FPS]: ROUTING_CODE_TYPES.SORT_CODE,
  [CAD_ACCOUNT_OPTIONS.EFT]: ROUTING_CODE_TYPES.ROUTING_CODE,
  [SWIFT_ACCOUNT_OPTIONS.SWIFT]: ROUTING_CODE_TYPES.BIC_SWIFT,
};

export enum CURRENCY_ENUM {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  CAD = "CAD",
  AED = "AED",
  AUD = "AUD",
  SGD = "SGD",
}

export const PAYMENT_METHODS_MAP_CURRENCY_WISE = {
  [CURRENCY_ENUM.USD]: US_ACCOUNT_OPTIONS_LIST,
  [CURRENCY_ENUM.EUR]: EUR_ACCOUNT_OPTIONS_LIST,
  [CURRENCY_ENUM.GBP]: GBP_ACCOUNT_OPTIONS_LIST,
  [CURRENCY_ENUM.CAD]: CAD_ACCOUNT_OPTIONS_LIST,
  [CURRENCY_ENUM.AED]: SWIFT_ACCOUNT_OPTIONS_LIST,
  [CURRENCY_ENUM.AUD]: SWIFT_ACCOUNT_OPTIONS_LIST,
  [CURRENCY_ENUM.SGD]: SWIFT_ACCOUNT_OPTIONS_LIST,
};

export const PAYPAL_STANDARD_PRICING_URL = "https://www.paypal.com/in/webapps/mpp/merchant-fees#curr-conversions";

export const PAYMENT_LINK_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CREATED: "CREATED",
  ERROR: "ERROR",
  PAYMENT_ATTEMPTED: "PAYMENT_ATTEMPTED",
  EXPIRED: "EXPIRED",
  FAILED: "FAILED"
};

export const RADIO_BUTTON_TYPES = {
  LOCAL_BANK_TRANSFER: "LOCAL_BANK_TRANSFER",
  PAYPAL_WALLET: "PAYPAL_WALLET",
  DEBIT_CREDIT_CARD: "DEBIT_CREDIT_CARD",
};

export const FUNDING_VENDOR = {
  PPRO: "PPRO",
  VEEM: "VEEM",
};

// Payment Link supported countries list
export const PAYMENT_LINK_COUNTRIES = [
  "United States",
  "Philippines",
  "Canada",
  "India",
  "United Kingdom",
  "Albania",
  "Algeria",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belgium",
  "Bermuda",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Cayman Islands",
  "Chile",
  "China",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "Estonia",
  "Eswatini",
  "Fiji",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Guatemala",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Korea, South",
  "Kuwait",
  "Latvia",
  "Lebanon",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Malawi",
  "Malaysia",
  "Malta",
  "Mauritius",
  "Mexico",
  "Monaco",
  "Morocco",
  "Mozambique",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Norway",
  "Oman",
  "Pakistan",
  "Peru",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Saudi Arabia",
  "Serbia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Taiwan, Province of China",
  "Thailand",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "Uruguay",
  "Vietnam",
  "Zambia",
];
