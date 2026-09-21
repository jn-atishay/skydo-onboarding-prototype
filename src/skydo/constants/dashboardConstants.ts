import Locale from "../util/locale/en";

export const INVOICE_STATUS = {
  UNPARSED: "UNPARSED",
  NOT_PARSABLE: "NOT_PARSABLE",
  FULL_PARSED: "FULL_PARSED",
  PARTIAL_PARSED: "PARTIAL_PARSED",
  UNPAID: "UNPAID",
  INFO_AWAITED: "INFO_AWAITED",
  READY_TO_TRANSACT: "READY_TO_TRANSACT",
  IN_PROGRESS: "IN_PROGRESS",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  PAID: "PAID",
  ARCHIVED: "ARCHIVED",
  FAILED: "FAILED",
};

export const BankUsageType = {
  BALANCE: "BALANCE",
  COLLECTION: "COLLECTION",
};

export const AccountRole = {
  PRIMARY: "PRIMARY",
  BALANCE: "BALANCE",
};

// INTERNATIONAL_ACCOUNTS_FEEDBACK,
//     ANALYTICS_CATEGORY_FEEDBACK,
//     ANALYTICS_PAGE_DETAILS_FEEDBACK
export const CUSTOMER_FEEDBACK_QUESTION_TYPE = {
  INTERNATIONAL_ACCOUNTS_FEEDBACK: "INTERNATIONAL_ACCOUNTS_FEEDBACK",
  ANALYTICS_CATEGORY_FEEDBACK: "ANALYTICS_CATEGORY_FEEDBACK",
  ANALYTICS_REPORTS_FEEDBACK: "ANALYTICS_REPORTS_FEEDBACK",
  ANALYTICS_CLIENT_FEEDBACK: "ANALYTICS_CLIENT_FEEDBACK",
  ANALYTICS_PAGE_DETAILS_FEEDBACK: "ANALYTICS_PAGE_DETAILS_FEEDBACK",
  PLATFORM_INTEGRATION_FEEDBACK: "PLATFORM_INTEGRATION_FEEDBACK",
  PLATFORM_INTEGRATION_HELP: "PLATFORM_INTEGRATION_HELP",
  ACTIVATION_CALLBACK_REQUEST: "ACTIVATION_CALLBACK_REQUEST",
  CLIENT_DETAILS_FEEDBACK: "CLIENT_DETAILS_FEEDBACK",
  HAVE_MORE_QUESTIONS: "HAVE_MORE_QUESTIONS",
  INSTANT_SETTLEMENT_OPTOUT_FEEDBACK: "INSTANT_SETTLEMENT_OPTOUT_FEEDBACK",
  SKYDO_BALANCE_OUTPAY_INVOICE_UNAVAILABLE: "SKYDO_BALANCE_OUTPAY_INVOICE_UNAVAILABLE",
};

/** POST /user/action/mark + hasUserAction (GraphQL: gqlQueries/UserAction) — balance page intro */
export const USER_ACTION_TYPE = {
  SKYDO_BALANCE_INFO_READ: "SKYDO_BALANCE_INFO_READ",
  SKYDO_BALANCE_OUTSIDE_US_BANNER_DISMISSED: "SKYDO_BALANCE_OUTSIDE_US_BANNER_DISMISSED",
};

export const INVOICE_STATUS_OVERVIEW_MAP = {
  outstanding: [INVOICE_STATUS.UNPAID, INVOICE_STATUS.READY_TO_TRANSACT, INVOICE_STATUS.INFO_AWAITED],
  parse_stage: [INVOICE_STATUS.UNPARSED, INVOICE_STATUS.FULL_PARSED, INVOICE_STATUS.PARTIAL_PARSED],
  in_progress: [INVOICE_STATUS.IN_PROGRESS],
  partially_paid: [INVOICE_STATUS.PARTIALLY_PAID],
  paid: [INVOICE_STATUS.PAID],
};

/*
outstanding - UNPARSED, UNPAID, READY_TO_TRANSACT, INFO_AWAITED (transaction didn't start)
in progress - IN_PROGRESS, (INFO_AWAITED - money received)
 */

export const PAYMENTS_PAGE_SIZE = 10;

export const TRANSACTION_STATES = {
  VIRTUAL_ACCOUNT_SUCCESS: "VIRTUAL_ACCOUNT_SUCCESS", //1
  SKYDO_US_HUB_PENDING: "SKYDO_US_HUB_PENDING",
  SKYDO_US_HUB_SUCCESS: "SKYDO_US_HUB_SUCCESS", //2
  NOSTRO_PENDING: "NOSTRO_PENDING",
  NOSTRO_SENDER_SUCCESS: "NOSTRO_SENDER_SUCCESS",
  NOSTRO_RECEIVER_SUCCESS: "NOSTRO_RECEIVER_SUCCESS", //3
  EXPORT_COLLECTION_ACCOUNT_PENDING: "EXPORT_COLLECTION_ACCOUNT_PENDING",
  EXPORT_COLLECTION_ACCOUNT_SUCCESS: "EXPORT_COLLECTION_ACCOUNT_SUCCESS", //4
  EXPORTER_PENDING: "EXPORTER_PENDING",
  EXPORTER_FAIL: "EXPORTER_FAIL",
  EXPORTER_SUCCESS: "EXPORTER_SUCCESS",
  REJECTED: "REJECTED",
};

export const TRANSACTION_STATES_SERIES = [
  TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS, //1
  TRANSACTION_STATES.SKYDO_US_HUB_PENDING, //1
  TRANSACTION_STATES.SKYDO_US_HUB_SUCCESS, //2
  TRANSACTION_STATES.NOSTRO_PENDING, //2
  TRANSACTION_STATES.NOSTRO_SENDER_SUCCESS, //2
  TRANSACTION_STATES.NOSTRO_RECEIVER_SUCCESS, //3
  TRANSACTION_STATES.EXPORT_COLLECTION_ACCOUNT_PENDING, //3
  TRANSACTION_STATES.EXPORT_COLLECTION_ACCOUNT_SUCCESS, //4
  TRANSACTION_STATES.EXPORTER_PENDING, //4
  TRANSACTION_STATES.EXPORTER_FAIL, //4
  TRANSACTION_STATES.EXPORTER_SUCCESS, //5
  TRANSACTION_STATES.REJECTED, //5
];

export const EXPECTED_SETTLEMENT_DAYS = 2;

export const INVOICE_TYPES = {
  INVOICE: "INVOICE",
  UNPARSED_INVOICE: "UNPARSED_INVOICE",
};

export const PAYMENT_PROCESSORS = {
  SKYDO: "SKYDO",
  OTHERS: "OTHERS",
};

export const LOCATION_CODE = {
  USA: "USA",
  UK: "UK",
  ROW: "ROW",
  EUROPE: "EUROPE",
  IND: "IND",
  CA: "CA",
  UAE: "UAE",
  AUS: "AUS",
  SG: "SG",
  KENYA: "KENYA",
  KUWAIT: "KUWAIT",
  MEXICO: "MEXICO",
  UGANDA: "UGANDA",
  NZ: "NEW ZEALAND",
  NORWAY: "NORWAY",
  OMAN: "OMAN",
  POLAND: "POLAND",
  QATAR: "QATAR",
  ROMANIA: "ROMANIA",
  SAUDI: "SAUDI ARABIA",
  SOUTH_AFRICA: "SOUTH AFRICA",
  SWEDEN: "SWEDEN",
  SWITZERLAND: "SWITZERLAND",
  THAILAND: "THAILAND",
  TURKEY: "TURKEY",
  BAHRAIN: "BAHRAIN",
  BULGARIA: "BULGARIA",
  CHINA: "CHINA",
  CZECH: "CZECH_REPUBLIC",
  DENMARK: "DENMARK",
  ISRAEL: "ISRAEL",
  JAPAN: "JAPAN",
  HK: "HONG KONG",
  HUNGARY: "HUNGARY",
  GERMANY: "GERMANY",
  FRANCE: "FRANCE",
  ITALY: "ITALY",
  SPAIN: "SPAIN",
  NETHERLANDS: "NETHERLANDS",
};

export const PAYMENT_METHOD = {
  ACH: "ACH",
  FEDWIRE: "FEDWIRE",
};

export const paymentMethodDetails = {
  [PAYMENT_METHOD.ACH]: {
    header: Locale.ach,
    label: Locale.intAccountPage.achLabel,
    subtext: Locale.intAccountPage.achSubtext,
  },
  [PAYMENT_METHOD.FEDWIRE]: {
    header: Locale.fedWire,
    label: Locale.fedWire,
    subtext: Locale.intAccountPage.fedwireSubtext,
  },
};

export const USD_PAYMENT_METHODS = [PAYMENT_METHOD.ACH, PAYMENT_METHOD.FEDWIRE];

export const LOCATION_CODE_LABEL = {
  [LOCATION_CODE.USA]: "USA",
  [LOCATION_CODE.UK]: "UK",
  [LOCATION_CODE.ROW]: "Rest of the World",
  [LOCATION_CODE.EUROPE]: "Europe",
  [LOCATION_CODE.IND]: "India",
  [LOCATION_CODE.CA]: "Canada",
  [LOCATION_CODE.UAE]: "UAE",
  [LOCATION_CODE.AUS]: "Australia",
  [LOCATION_CODE.SG]: "Singapore",
  [LOCATION_CODE.KENYA]: "Kenya",
  [LOCATION_CODE.KUWAIT]: "Kuwait",
  [LOCATION_CODE.MEXICO]: "Mexico",
  [LOCATION_CODE.UGANDA]: "Uganda",
  [LOCATION_CODE.NZ]: "New Zealand",
  [LOCATION_CODE.NORWAY]: "Norway",
  [LOCATION_CODE.OMAN]: "Oman",
  [LOCATION_CODE.POLAND]: "Poland",
  [LOCATION_CODE.QATAR]: "Qatar",
  [LOCATION_CODE.ROMANIA]: "Romania",
  [LOCATION_CODE.SAUDI]: "Saudi Arabia",
  [LOCATION_CODE.SOUTH_AFRICA]: "South Africa",
  [LOCATION_CODE.SWEDEN]: "Sweden",
  [LOCATION_CODE.SWITZERLAND]: "Switzerland",
  [LOCATION_CODE.THAILAND]: "Thailand",
  [LOCATION_CODE.TURKEY]: "Turkey",
  [LOCATION_CODE.BAHRAIN]: "Bahrain",
  [LOCATION_CODE.BULGARIA]: "Bulgaria",
  [LOCATION_CODE.CHINA]: "China",
  [LOCATION_CODE.CZECH]: "Czech Republic",
  [LOCATION_CODE.DENMARK]: "Denmark",
  [LOCATION_CODE.ISRAEL]: "Israel",
  [LOCATION_CODE.JAPAN]: "Japan",
  [LOCATION_CODE.HK]: "Hong Kong",
  [LOCATION_CODE.HUNGARY]: "Hungary",
};

export const VIRTUAL_ACCOUNT_VENDOR = {
  CURRENCY_CLOUD: "CURRENCY_CLOUD",
  NOVATTI: "Novatti",
  DBS_SG: "DBS_SG",
  BANKING_CIRCLE: "BANKING_CIRCLE",
  GLOMO_PAY: "GLOMO_PAY",
  CALIZA: "CALIZA",
};

export const ALLOWED_IMPORTER_LOCATION = [
  LOCATION_CODE.USA,
  LOCATION_CODE.UK,
  LOCATION_CODE.UAE,
  LOCATION_CODE.EUROPE,
  LOCATION_CODE.CA,
  LOCATION_CODE.AUS,
  LOCATION_CODE.SG,
  LOCATION_CODE.ROW,
];

export const NICHE_IMPORTER_LOCATION = [
  LOCATION_CODE.SWEDEN,
  LOCATION_CODE.JAPAN,
  LOCATION_CODE.SWITZERLAND,
  LOCATION_CODE.SOUTH_AFRICA,
  LOCATION_CODE.NORWAY,
  LOCATION_CODE.DENMARK,
  LOCATION_CODE.TURKEY,
  LOCATION_CODE.SAUDI,
  LOCATION_CODE.BAHRAIN,
  LOCATION_CODE.KUWAIT,
  LOCATION_CODE.OMAN,
  LOCATION_CODE.QATAR,
  LOCATION_CODE.HK,
  LOCATION_CODE.THAILAND,
  LOCATION_CODE.NZ,
];

// Niche currencies share the SWIFT/ROW account and are charged the 1% Regional
// Currency Fee on the SWIFT rail, alongside UAE/AED.
export const REGIONAL_CURRENCY_FEE_LOCATIONS = [LOCATION_CODE.UAE, ...NICHE_IMPORTER_LOCATION];

export const LOCATION_CODE_2_LETTER = {
  [LOCATION_CODE.USA]: "US",
  [LOCATION_CODE.UK]: "GB",
  [LOCATION_CODE.UAE]: "AE",
  [LOCATION_CODE.EUROPE]: "EU",
  [LOCATION_CODE.CA]: "CA",
  [LOCATION_CODE.AUS]: "AU",
  [LOCATION_CODE.SG]: "SG",
  [LOCATION_CODE.ROW]: "ROW",
  [LOCATION_CODE.IND]: "IN",
  [LOCATION_CODE.SWEDEN]: "SE",
  [LOCATION_CODE.JAPAN]: "JP",
  [LOCATION_CODE.SWITZERLAND]: "CH",
  [LOCATION_CODE.SOUTH_AFRICA]: "ZA",
  [LOCATION_CODE.NORWAY]: "NO",
  [LOCATION_CODE.DENMARK]: "DK",
  [LOCATION_CODE.TURKEY]: "TR",
  [LOCATION_CODE.SAUDI]: "SA",
  [LOCATION_CODE.BAHRAIN]: "BH",
  [LOCATION_CODE.KUWAIT]: "KW",
  [LOCATION_CODE.OMAN]: "OM",
  [LOCATION_CODE.QATAR]: "QA",
  [LOCATION_CODE.HK]: "HK",
  [LOCATION_CODE.THAILAND]: "TH",
  [LOCATION_CODE.NZ]: "NZ",
};

export const LOCATION_CODE_2_LETTER_INVERSE = Object.keys(LOCATION_CODE_2_LETTER).reduce(
  (
    acc: {
      [k: string]: string;
    },
    key
  ) => {
    acc[LOCATION_CODE_2_LETTER[key]] = key;
    return acc;
  },
  {}
);

export const AMAZON_IMPORTER_LOCATIONS = [
  LOCATION_CODE.USA,
  LOCATION_CODE.UK,
  LOCATION_CODE.CA,
  LOCATION_CODE.AUS,
  LOCATION_CODE.SG,
  LOCATION_CODE.GERMANY,
  LOCATION_CODE.FRANCE,
  LOCATION_CODE.ITALY,
  LOCATION_CODE.SPAIN,
  LOCATION_CODE.UAE,
  LOCATION_CODE.NETHERLANDS,
];

export const AMAZON_EUROPE_LOCATIONS = [
  LOCATION_CODE.GERMANY,
  LOCATION_CODE.FRANCE,
  LOCATION_CODE.ITALY,
  LOCATION_CODE.SPAIN,
  LOCATION_CODE.NETHERLANDS,
];

export const AMAZON_LOCATION_URL_MAP = {
  [LOCATION_CODE.USA]: "amazon.com",
  [LOCATION_CODE.UK]: "amazon.co.uk",
  [LOCATION_CODE.CA]: "amazon.ca",
  [LOCATION_CODE.AUS]: "amazon.com.au",
  [LOCATION_CODE.SG]: "amazon.sg",
  [LOCATION_CODE.GERMANY]: "amazon.de",
  [LOCATION_CODE.FRANCE]: "amazon.fr",
  [LOCATION_CODE.ITALY]: "amazon.it",
  [LOCATION_CODE.SPAIN]: "amazon.es",
  [LOCATION_CODE.NETHERLANDS]: "amazon.nl",
  [LOCATION_CODE.UAE]: "amazon.ae",
};

export const FREELANCER_PLATFORM_CODE = {
  TOPTAL: "TOPTAL",
  FREELANCER: "FREELANCER",
  UPWORK: "UPWORK",
  // REMOTE: "REMOTE",
  DEEL: "DEEL",
  AMAZON: "AMAZON",
  OTHERS: "OTHERS",
};

export const PLATFORM_REQUEST_CODE = "PLATFORM_REQUEST_CODE";

export const CURRENCY_ENABLED_FREELANCER_PLATFORMS = [
  FREELANCER_PLATFORM_CODE.DEEL,
  FREELANCER_PLATFORM_CODE.OTHERS,
  FREELANCER_PLATFORM_CODE.AMAZON,
];

export const ALLOWED_FREELANCER_PLATFORMS = [
  FREELANCER_PLATFORM_CODE.TOPTAL,
  FREELANCER_PLATFORM_CODE.FREELANCER,
  FREELANCER_PLATFORM_CODE.UPWORK,
  // FREELANCER_PLATFORM_CODE.REMOTE,
  FREELANCER_PLATFORM_CODE.DEEL,
  FREELANCER_PLATFORM_CODE.AMAZON,
  FREELANCER_PLATFORM_CODE.OTHERS,
];

export const PLATFORM_WITH_USD = [
  FREELANCER_PLATFORM_CODE.TOPTAL,
  FREELANCER_PLATFORM_CODE.FREELANCER,
  FREELANCER_PLATFORM_CODE.UPWORK,
];

export const CURRENCY_CODE = {
  USD: "USD",
  GBP: "GBP",
  ROW: "ROW",
  EUR: "EUR",
  INR: "INR",
  CAD: "CAD",
  AED: "AED",
  AUD: "AUD",
  SGD: "SGD",
  KES: "KES",
  KWD: "KWD",
  MXN: "MXN",
  UGX: "UGX",
  NZD: "NZD",
  NOK: "NOK",
  OMR: "OMR",
  PLN: "PLN",
  QAR: "QAR",
  RON: "RON",
  SAR: "SAR",
  ZAR: "ZAR",
  SEK: "SEK",
  CHF: "CHF",
  THB: "THB",
  TRY: "TRY",
  BHD: "BHD",
  BGN: "BGN",
  CNH: "CNH",
  CZK: "CZK",
  DKK: "DKK",
  ILS: "ILS",
  JPY: "JPY",
  HKD: "HKD",
  HUF: "HUF",
};

export const LOCATION_CURRENCY_MAP = {
  [LOCATION_CODE.USA]: CURRENCY_CODE.USD,
  [LOCATION_CODE.UK]: CURRENCY_CODE.GBP,
  [LOCATION_CODE.ROW]: CURRENCY_CODE.ROW, // TODO - Ask Nikhil Why Kept USD for ROW
  [LOCATION_CODE.EUROPE]: CURRENCY_CODE.EUR,
  [LOCATION_CODE.IND]: CURRENCY_CODE.INR,
  [LOCATION_CODE.CA]: CURRENCY_CODE.CAD,
  [LOCATION_CODE.UAE]: CURRENCY_CODE.AED,
  [LOCATION_CODE.AUS]: CURRENCY_CODE.AUD,
  [LOCATION_CODE.SG]: CURRENCY_CODE.SGD,
  [LOCATION_CODE.KENYA]: CURRENCY_CODE.KES,
  [LOCATION_CODE.KUWAIT]: CURRENCY_CODE.KWD,
  [LOCATION_CODE.MEXICO]: CURRENCY_CODE.MXN,
  [LOCATION_CODE.UGANDA]: CURRENCY_CODE.UGX,
  [LOCATION_CODE.NZ]: CURRENCY_CODE.NZD,
  [LOCATION_CODE.NORWAY]: CURRENCY_CODE.NOK,
  [LOCATION_CODE.OMAN]: CURRENCY_CODE.OMR,
  [LOCATION_CODE.POLAND]: CURRENCY_CODE.PLN,
  [LOCATION_CODE.QATAR]: CURRENCY_CODE.QAR,
  [LOCATION_CODE.ROMANIA]: CURRENCY_CODE.RON,
  [LOCATION_CODE.SAUDI]: CURRENCY_CODE.SAR,
  [LOCATION_CODE.SOUTH_AFRICA]: CURRENCY_CODE.ZAR,
  [LOCATION_CODE.SWEDEN]: CURRENCY_CODE.SEK,
  [LOCATION_CODE.SWITZERLAND]: CURRENCY_CODE.CHF,
  [LOCATION_CODE.THAILAND]: CURRENCY_CODE.THB,
  [LOCATION_CODE.TURKEY]: CURRENCY_CODE.TRY,
  [LOCATION_CODE.BAHRAIN]: CURRENCY_CODE.BHD,
  [LOCATION_CODE.BULGARIA]: CURRENCY_CODE.BGN,
  [LOCATION_CODE.CHINA]: CURRENCY_CODE.CNH,
  [LOCATION_CODE.CZECH]: CURRENCY_CODE.CZK,
  [LOCATION_CODE.DENMARK]: CURRENCY_CODE.DKK,
  [LOCATION_CODE.ISRAEL]: CURRENCY_CODE.ILS,
  [LOCATION_CODE.JAPAN]: CURRENCY_CODE.JPY,
  [LOCATION_CODE.HK]: CURRENCY_CODE.HKD,
  [LOCATION_CODE.HUNGARY]: CURRENCY_CODE.HUF,
  [LOCATION_CODE.GERMANY]: CURRENCY_CODE.EUR,
  [LOCATION_CODE.FRANCE]: CURRENCY_CODE.EUR,
  [LOCATION_CODE.ITALY]: CURRENCY_CODE.EUR,
  [LOCATION_CODE.SPAIN]: CURRENCY_CODE.EUR,
  [LOCATION_CODE.NETHERLANDS]: CURRENCY_CODE.EUR,
};

export const ALLOWED_IMPORTER_CURRENCY = ALLOWED_IMPORTER_LOCATION.map((location) => LOCATION_CURRENCY_MAP[location]);

export const SELECTABLE_IMPORTER_LOCATION = [...ALLOWED_IMPORTER_LOCATION, ...NICHE_IMPORTER_LOCATION];

// Dropdown groupings: "Popular" excludes the ROW catch-all, which sits at the end of "Other".
export const POPULAR_IMPORTER_LOCATION = ALLOWED_IMPORTER_LOCATION.filter(
  (location) => location !== LOCATION_CODE.ROW
);

export const OTHER_IMPORTER_LOCATION = [...NICHE_IMPORTER_LOCATION, LOCATION_CODE.ROW];

export const NICHE_IMPORTER_CURRENCY = NICHE_IMPORTER_LOCATION.map((location) => LOCATION_CURRENCY_MAP[location]);

// Splits the currency list popup into "Top currencies" + "Niche currencies" (everything the CMS has
// not flagged as top). Set to false to restore the single "All currencies" section.
export const SHOW_NICHE_CURRENCY_SECTION = true;

export const NICHE_IMPORTER_CODE_2_ALPHA = NICHE_IMPORTER_LOCATION.map((location) => LOCATION_CODE_2_LETTER[location]);

// Hidden from the "request more accounts" picker: countries we already issue a local account for,
// plus India, since the exporter's own country is never a client location.
export const LOCAL_ACCOUNT_CODE_2_ALPHA = [...POPULAR_IMPORTER_LOCATION, LOCATION_CODE.IND].map(
  (location) => LOCATION_CODE_2_LETTER[location]
);

export const REGIONAL_CURRENCY_FEE_CURRENCIES = REGIONAL_CURRENCY_FEE_LOCATIONS.map(
  (location) => LOCATION_CURRENCY_MAP[location]
);

export const SELECTABLE_IMPORTER_CURRENCY = SELECTABLE_IMPORTER_LOCATION.map(
  (location) => LOCATION_CURRENCY_MAP[location]
);

export const analyticsCurrencyList = [
  CURRENCY_CODE.INR,
  CURRENCY_CODE.USD,
  CURRENCY_CODE.GBP,
  CURRENCY_CODE.EUR,
  CURRENCY_CODE.CAD,
  CURRENCY_CODE.AED,
  CURRENCY_CODE.AUD,
  CURRENCY_CODE.SGD,
];

export const CURRENCY_VS_LOCATION_MAP: { [key: string]: string } = {
  USD: LOCATION_CODE.USA,
  GBP: LOCATION_CODE.UK,
  EUR: LOCATION_CODE.EUROPE,
  INR: LOCATION_CODE.IND,
  CAD: LOCATION_CODE.CA,
  AED: LOCATION_CODE.UAE,
  SGD: LOCATION_CODE.SG,
  AUD: LOCATION_CODE.AUS,
  ROW: LOCATION_CODE.ROW,
  KES: LOCATION_CODE.KENYA,
  KWD: LOCATION_CODE.KUWAIT,
  MXN: LOCATION_CODE.MEXICO,
  UGX: LOCATION_CODE.UGANDA,
  NZD: LOCATION_CODE.NZ,
  NOK: LOCATION_CODE.NORWAY,
  OMR: LOCATION_CODE.OMAN,
  PLN: LOCATION_CODE.POLAND,
  QAR: LOCATION_CODE.QATAR,
  RON: LOCATION_CODE.ROMANIA,
  SAR: LOCATION_CODE.SAUDI,
  ZAR: LOCATION_CODE.SOUTH_AFRICA,
  SEK: LOCATION_CODE.SWEDEN,
  CHF: LOCATION_CODE.SWITZERLAND,
  THB: LOCATION_CODE.THAILAND,
  TRY: LOCATION_CODE.TURKEY,
  BHD: LOCATION_CODE.BAHRAIN,
  BGN: LOCATION_CODE.BULGARIA,
  CNH: LOCATION_CODE.CHINA,
  CZK: LOCATION_CODE.CZECH,
  DKK: LOCATION_CODE.DENMARK,
  ILS: LOCATION_CODE.ISRAEL,
  JPY: LOCATION_CODE.JAPAN,
  HKD: LOCATION_CODE.HK,
  HUF: LOCATION_CODE.HUNGARY,
};

// Using this map as source for all currency related details
//defaultValue field is used in calculator to show default value of the selected currency
// defaultValue seeds the FX calculator input, so each is a round amount in the local currency.
const NICHE_LOCATION_DISPLAY = [
  { location: LOCATION_CODE.SWITZERLAND, header: Locale.intAccountPage.countrySwitzerland, defaultValue: "5000" },
  { location: LOCATION_CODE.SWEDEN, header: Locale.intAccountPage.countrySweden, defaultValue: "30000" },
  { location: LOCATION_CODE.NORWAY, header: Locale.intAccountPage.countryNorway, defaultValue: "30000" },
  { location: LOCATION_CODE.DENMARK, header: Locale.intAccountPage.countryDenmark, defaultValue: "20000" },
  { location: LOCATION_CODE.TURKEY, header: Locale.intAccountPage.countryTurkey, defaultValue: "100000" },
  { location: LOCATION_CODE.SAUDI, header: Locale.intAccountPage.countrySaudiArabia, defaultValue: "20000" },
  { location: LOCATION_CODE.BAHRAIN, header: Locale.intAccountPage.countryBahrain, defaultValue: "2000" },
  { location: LOCATION_CODE.KUWAIT, header: Locale.intAccountPage.countryKuwait, defaultValue: "1500" },
  { location: LOCATION_CODE.OMAN, header: Locale.intAccountPage.countryOman, defaultValue: "2000" },
  { location: LOCATION_CODE.QATAR, header: Locale.intAccountPage.countryQatar, defaultValue: "20000" },
  { location: LOCATION_CODE.JAPAN, header: Locale.intAccountPage.countryJapan, defaultValue: "500000" },
  { location: LOCATION_CODE.HK, header: Locale.intAccountPage.countryHongKong, defaultValue: "40000" },
  { location: LOCATION_CODE.THAILAND, header: Locale.intAccountPage.countryThailand, defaultValue: "150000" },
  { location: LOCATION_CODE.SOUTH_AFRICA, header: Locale.intAccountPage.countrySouthAfrica, defaultValue: "60000" },
  { location: LOCATION_CODE.NZ, header: Locale.intAccountPage.countryNewZealand, defaultValue: "8000" },
];

export const LOCATION_CURRENCY_DETAILS_MAP = {
  [LOCATION_CODE.USA]: {
    currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
    displayHeader: Locale.locationUSAHeader,
    displayInline: Locale.locationUSAHeader,
    defaultValue: "7000",
  },
  [LOCATION_CODE.UK]: {
    currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.UK],
    displayHeader: Locale.locationUKHeader,
    displayInline: Locale.locationUKHeader,
    defaultValue: "5000",
  },
  [LOCATION_CODE.EUROPE]: {
    currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.EUROPE],
    displayHeader: Locale.locationEuropeHeader,
    displayInline: Locale.locationEuropeHeader,
    defaultValue: "6000",
  },
  [LOCATION_CODE.CA]: {
    currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.CA],
    displayHeader: Locale.locationCanadaHeader,
    displayInline: Locale.locationCanadaHeader,
    defaultValue: "9000",
  },
  [LOCATION_CODE.UAE]: {
    currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.UAE],
    displayHeader: Locale.locationUAEHeader,
    displayInline: Locale.locationUAEHeader,
    defaultValue: "25000",
  },
  [LOCATION_CODE.AUS]: {
    currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.AUS],
    displayHeader: Locale.locationAustraliaHeader,
    displayInline: Locale.locationAustraliaHeader,
    defaultValue: "12000",
  },
  [LOCATION_CODE.SG]: {
    currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.SG],
    displayHeader: Locale.locationSingaporeHeader,
    displayInline: Locale.locationSingaporeHeader,
    defaultValue: "10000",
  },
  [LOCATION_CODE.ROW]: {
    currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.ROW],
    displayHeader: Locale.locationROWHeader,
    displayInline: Locale.locationROWInline,
    defaultValue: "7000",
  },
  ...NICHE_LOCATION_DISPLAY.reduce(
    (acc, { location, header, defaultValue }) => {
      acc[location] = {
        currency: LOCATION_CURRENCY_MAP[location],
        displayHeader: header,
        displayInline: header,
        defaultValue,
      };
      return acc;
    },
    {} as Record<string, { currency: string; displayHeader: string; displayInline: string; defaultValue: string }>
  ),
};

export const FREELANCER_PLATFORMS_DETAILS_MAP = {
  [FREELANCER_PLATFORM_CODE.TOPTAL]: {
    displayHeader: Locale.platformToptalHeader,
    displayInline: Locale.platformToptalHeader,
    displayFirstLineName: Locale.platformToptalHeader,
    url: Locale.intAccountPage.toptalLoginUrl,
  },
  [FREELANCER_PLATFORM_CODE.FREELANCER]: {
    displayHeader: Locale.platformFreelancerHeader,
    displayInline: Locale.platformFreelancerInline,
    displayFirstLineName: Locale.platformFreelancerInline,
    url: Locale.intAccountPage.freelancerLoginUrl,
  },
  [FREELANCER_PLATFORM_CODE.UPWORK]: {
    displayHeader: Locale.platformUpworkHeader,
    displayInline: Locale.platformUpworkHeader,
    displayFirstLineName: Locale.platformUpworkHeader,
    url: Locale.intAccountPage.upworkLoginUrl,
  },
  // [FREELANCER_PLATFORM_CODE.REMOTE]: {
  //   displayHeader: Locale.platformRemoteIndianHeader,
  //   displayInline: Locale.platformRemoteIndianHeader,
  //   displayFirstLineName: Locale.platformRemoteIndianHeader,
  // },
  [FREELANCER_PLATFORM_CODE.DEEL]: {
    displayHeader: Locale.platformDeelHeader,
    displayInline: Locale.platformDeelHeader,
    displayFirstLineName: Locale.platformDeelHeader,
    url: Locale.intAccountPage.deelLoginUrl,
  },
  [FREELANCER_PLATFORM_CODE.AMAZON]: {
    displayHeader: Locale.intAccountPage.amazon,
    displayInline: Locale.intAccountPage.amazon,
    displayFirstLineName: Locale.intAccountPage.amazon,
    url: Locale.intAccountPage.deelLoginUrl,
  },
  [FREELANCER_PLATFORM_CODE.OTHERS]: {
    displayHeader: Locale.platformOtherHeaderCaps,
    displayInline: Locale.platformOtherHeader,
    displayFirstLineName: Locale.platformCAPS,
    url: "",
  },
};

export enum ACCOUNTS_TYPE {
  LOCATION,
  PLATFORM,
}

export const ALLOWED_CURRENCIES = ALLOWED_IMPORTER_LOCATION.filter((location) => location != LOCATION_CODE.ROW).map(
  (location) => LOCATION_CURRENCY_MAP[location]
);

export const INVOICE_CURRENCIES = ALLOWED_IMPORTER_LOCATION.filter((location) => location != LOCATION_CODE.ROW).map(
  (location) => LOCATION_CURRENCY_MAP[location]
);
// UAE is already included in ALLOWED_IMPORTER_LOCATION, no need to push again
INVOICE_CURRENCIES.push(LOCATION_CURRENCY_MAP[LOCATION_CODE.IND]);
export const INVOICE_CURRENCIES_NOT_TO_BE_MAPPED = [
  CURRENCY_CODE.SEK,
  CURRENCY_CODE.JPY,
  CURRENCY_CODE.ZAR,
  CURRENCY_CODE.CHF,
  CURRENCY_CODE.KES,
  CURRENCY_CODE.PLN,
  CURRENCY_CODE.SAR,
  CURRENCY_CODE.KWD,
  CURRENCY_CODE.NOK,
  CURRENCY_CODE.QAR,
  CURRENCY_CODE.THB,
  CURRENCY_CODE.MXN,
  CURRENCY_CODE.OMR,
  CURRENCY_CODE.RON,
  CURRENCY_CODE.TRY,
  CURRENCY_CODE.UGX,
  CURRENCY_CODE.BGN,
  CURRENCY_CODE.ILS,
  CURRENCY_CODE.CNH,
  CURRENCY_CODE.CZK,
  CURRENCY_CODE.HKD,
  CURRENCY_CODE.DKK,
  CURRENCY_CODE.HUF,
  CURRENCY_CODE.NZD,
  CURRENCY_CODE.BHD,
];

export const ALL_CURRENCIES = [...INVOICE_CURRENCIES, ...INVOICE_CURRENCIES_NOT_TO_BE_MAPPED];

// UAE is already included in ALLOWED_IMPORTER_LOCATION, no need to push again
ALLOWED_CURRENCIES.push(LOCATION_CURRENCY_MAP[LOCATION_CODE.IND]);

export const defaultDateFormattingOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  timeZoneName: "short",
};

export const locationVsSampleTrackerMap = {
  [LOCATION_CODE.USA]: "/tracker/usd.png",
  [LOCATION_CODE.UK]: "/tracker/gbp.png",
  [LOCATION_CODE.EUROPE]: "/tracker/eur.png",
  [LOCATION_CODE.CA]: "/tracker/cad.png",
  [LOCATION_CODE.ROW]: "/tracker/usd.png",
};

export const LocationCodeToPublicAccountPaymentMethod = {
  [LOCATION_CODE.USA]: Locale.achTransfer,
  [LOCATION_CODE.UK]: Locale.fpsTransfer,
  [LOCATION_CODE.EUROPE]: Locale.sepaTransfer,
  [LOCATION_CODE.CA]: Locale.eftTransfer,
  [LOCATION_CODE.ROW]: Locale.swiftInternational,
  [LOCATION_CODE.AUS]: Locale.becsOrDirectEntry,
  [LOCATION_CODE.SG]: Locale.fastGiroMepsTransfer,
  [LOCATION_CODE.UAE]: Locale.ippFtsTransfer,
};

export const AccountProviderAndCurrencyToPaymentMethod = {
  [VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD]: {
    [CURRENCY_CODE.USD]: Locale.achTransfer,
    [CURRENCY_CODE.GBP]: Locale.fpsTransfer,
    [CURRENCY_CODE.EUR]: Locale.sepaTransfer,
    [CURRENCY_CODE.CAD]: Locale.eftTransfer,
    [CURRENCY_CODE.AED]: Locale.ippFtsTransfer,
  },
  [VIRTUAL_ACCOUNT_VENDOR.DBS_SG]: {
    [CURRENCY_CODE.SGD]: Locale.fastGiroMepsTransfer,
  },
  [VIRTUAL_ACCOUNT_VENDOR.BANKING_CIRCLE]: {
    [CURRENCY_CODE.GBP]: Locale.fPSBacsCHAPS,
    [CURRENCY_CODE.EUR]: Locale.sepaAndInstant,
    [CURRENCY_CODE.AUD]: Locale.becsOrDirectEntry,
  },
  [VIRTUAL_ACCOUNT_VENDOR.GLOMO_PAY]: {
    [CURRENCY_CODE.AED]: Locale.ippFtsTransfer,
  },
  [VIRTUAL_ACCOUNT_VENDOR.CALIZA]: {
    [CURRENCY_CODE.USD]: Locale.achTransfer,
  },
};

export const LocationCodeToBank = {
  [LOCATION_CODE.USA]: "Community Federal Savings Bank",
  [LOCATION_CODE.UK]: "The Currency Cloud Limited",
  [LOCATION_CODE.EUROPE]: "The Currency Cloud Limited",
  [LOCATION_CODE.CA]: "Digital Commerce Bank",
  [LOCATION_CODE.SG]: "DBS Bank Limited",
  [LOCATION_CODE.UAE]: "Zand Bank PJSC",
  [LOCATION_CODE.ROW]: "The Currency Cloud Limited",
};

export const AccountProviderToBank = {
  [VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD]: "The Currency Cloud Limited",
  [VIRTUAL_ACCOUNT_VENDOR.DBS_SG]: "DBS Bank Limited",
  [VIRTUAL_ACCOUNT_VENDOR.BANKING_CIRCLE]: "BC Payments",
  [VIRTUAL_ACCOUNT_VENDOR.GLOMO_PAY]: "Zand Bank PJSC",
  [VIRTUAL_ACCOUNT_VENDOR.CALIZA]: "Cross River Bank",
};

export const LocationCodeToPublicAccountCurrency = {
  [LOCATION_CODE.USA]: "USD Only",
  [LOCATION_CODE.UK]: "GBP Only",
  [LOCATION_CODE.EUROPE]: "EUR Only",
  [LOCATION_CODE.CA]: "CAD Only",
  [LOCATION_CODE.ROW]: "USD, GBP, EUR, +29 more",
  [LOCATION_CODE.AUS]: "AUD Only",
  [LOCATION_CODE.SG]: "SGD Only",
  [LOCATION_CODE.UAE]: "AED Only",
};

export const CurrencyTypes = {
  NATIVE: "NATIVE",
  OTHERS: "OTHERS",
};

export const EntityTypes = {
  INVOICE: "INVOICE",
  PAYMENT: "PAYMENT",
  TRANSACTION: "TRANSACTION",
  TEST_INVOICE: "TEST_INVOICE",
  EXPORTER: "EXPORTER",
  AMAZON_EXPORTER: "AMAZON_EXPORTER",
};

export const FILE_DOWNLOAD_NO_DOCUMENT_CODE = 100;

export const DocTypes = {
  FIRA: "FIRA",
  INVOICE: "INVOICE",
  FRESH_FIRAS: "FRESH_FIRAS",
  VIRTUAL_ACCOUNT_LETTER: "VIRTUAL_ACCOUNT_LETTER",
  CASHBACK_RECORD: "CASHBACK_RECORD",
  PAYMENT_RECEIPT: "PAYMENT_RECEIPT",
  SB_MAPPING: "SB_MAPPING",
  FIRA_SB_MAPPING: "FIRA_SB_MAPPING",
  FRESH_IRMS: "FRESH_IRMS",
  UTILISED_IRMS: "UTILISED_IRMS",
  EBRC: "EBRC",
  PENDING_IRM_FIRA: "PENDING_IRM_FIRA",
  VENDOR_BANK_STATEMENT: "VENDOR_BANK_STATEMENT",
};

// Kept separate from ALLOWED_CURRENCIES, which is sent as the virtual-account query's currency list.
export const CALCULATOR_ALLOWED_CURRENCIES = [
  ...ALLOWED_CURRENCIES.filter((currency) => currency !== LOCATION_CURRENCY_MAP[LOCATION_CODE.IND]),
  ...NICHE_IMPORTER_CURRENCY,
];

export const LOCATIONS_DETAILS_MAP = {
  [LOCATION_CODE.USA]: {
    header: Locale.locationUSAHeader,
  },
  [LOCATION_CODE.UK]: {
    header: Locale.unitedKingdom,
  },
  [LOCATION_CODE.CA]: {
    header: Locale.locationCanadaHeader,
  },
  [LOCATION_CODE.AUS]: {
    header: Locale.locationAustraliaHeader,
  },
  [LOCATION_CODE.SG]: {
    header: Locale.locationSingaporeHeader,
  },
  [LOCATION_CODE.EUROPE]: {
    header: Locale.locationEuropeHeader,
  },
  [LOCATION_CODE.UAE]: {
    header: Locale.locationUAEHeader,
  },
  [LOCATION_CODE.ROW]: {
    header: Locale.intAccountPage.otherCountry,
  },
  [LOCATION_CODE.SWITZERLAND]: { header: Locale.intAccountPage.countrySwitzerland },
  [LOCATION_CODE.SWEDEN]: { header: Locale.intAccountPage.countrySweden },
  [LOCATION_CODE.NORWAY]: { header: Locale.intAccountPage.countryNorway },
  [LOCATION_CODE.DENMARK]: { header: Locale.intAccountPage.countryDenmark },
  [LOCATION_CODE.TURKEY]: { header: Locale.intAccountPage.countryTurkey },
  [LOCATION_CODE.SAUDI]: { header: Locale.intAccountPage.countrySaudiArabia },
  [LOCATION_CODE.BAHRAIN]: { header: Locale.intAccountPage.countryBahrain },
  [LOCATION_CODE.KUWAIT]: { header: Locale.intAccountPage.countryKuwait },
  [LOCATION_CODE.OMAN]: { header: Locale.intAccountPage.countryOman },
  [LOCATION_CODE.QATAR]: { header: Locale.intAccountPage.countryQatar },
  [LOCATION_CODE.JAPAN]: { header: Locale.intAccountPage.countryJapan },
  [LOCATION_CODE.HK]: { header: Locale.intAccountPage.countryHongKong },
  [LOCATION_CODE.THAILAND]: { header: Locale.intAccountPage.countryThailand },
  [LOCATION_CODE.SOUTH_AFRICA]: { header: Locale.intAccountPage.countrySouthAfrica },
  [LOCATION_CODE.NZ]: { header: Locale.intAccountPage.countryNewZealand },
  [LOCATION_CODE.KENYA]: { header: Locale.intAccountPage.countryKenya },
  [LOCATION_CODE.MEXICO]: { header: Locale.intAccountPage.countryMexico },
  [LOCATION_CODE.UGANDA]: { header: Locale.intAccountPage.countryUganda },
  [LOCATION_CODE.POLAND]: { header: Locale.intAccountPage.countryPoland },
  [LOCATION_CODE.ROMANIA]: { header: Locale.intAccountPage.countryRomania },
  [LOCATION_CODE.BULGARIA]: { header: Locale.intAccountPage.countryBulgaria },
  [LOCATION_CODE.CHINA]: { header: Locale.intAccountPage.countryChina },
  [LOCATION_CODE.CZECH]: { header: Locale.intAccountPage.countryCzechRepublic },
  [LOCATION_CODE.ISRAEL]: { header: Locale.intAccountPage.countryIsrael },
  [LOCATION_CODE.HUNGARY]: { header: Locale.intAccountPage.countryHungary },
};

export const CURRENCY_DETAILS_MAP = {
  [CURRENCY_CODE.USD]: {
    header: Locale.intAccountPage.usDollars,
  },
  [CURRENCY_CODE.GBP]: { header: Locale.intAccountPage.greatBritainPounds },
  [CURRENCY_CODE.CAD]: {
    header: Locale.intAccountPage.canadianDollars,
  },
  [CURRENCY_CODE.AUD]: {
    header: Locale.intAccountPage.australianDollars,
  },
  [CURRENCY_CODE.SGD]: {
    header: Locale.intAccountPage.singaporeDollars,
  },
  [CURRENCY_CODE.EUR]: {
    header: Locale.intAccountPage.euro,
  },
  [CURRENCY_CODE.AED]: {
    header: Locale.intAccountPage.uaeDirhams,
  },
  [CURRENCY_CODE.ROW]: {
    header: Locale.intAccountPage.otherCurrencies,
  },
  [CURRENCY_CODE.CHF]: { header: Locale.intAccountPage.swissFranc },
  [CURRENCY_CODE.SEK]: { header: Locale.intAccountPage.swedishKrona },
  [CURRENCY_CODE.NOK]: { header: Locale.intAccountPage.norwegianKrone },
  [CURRENCY_CODE.DKK]: { header: Locale.intAccountPage.danishKrone },
  [CURRENCY_CODE.TRY]: { header: Locale.intAccountPage.turkishLira },
  [CURRENCY_CODE.SAR]: { header: Locale.intAccountPage.saudiRiyal },
  [CURRENCY_CODE.BHD]: { header: Locale.intAccountPage.bahrainiDinar },
  [CURRENCY_CODE.KWD]: { header: Locale.intAccountPage.kuwaitiDinar },
  [CURRENCY_CODE.OMR]: { header: Locale.intAccountPage.omaniRial },
  [CURRENCY_CODE.QAR]: { header: Locale.intAccountPage.qatariRiyal },
  [CURRENCY_CODE.JPY]: { header: Locale.intAccountPage.japaneseYen },
  [CURRENCY_CODE.HKD]: { header: Locale.intAccountPage.hongKongDollar },
  [CURRENCY_CODE.THB]: { header: Locale.intAccountPage.thaiBaht },
  [CURRENCY_CODE.ZAR]: { header: Locale.intAccountPage.southAfricanRand },
  [CURRENCY_CODE.NZD]: { header: Locale.intAccountPage.newZealandDollar },
};

export const CURRENCY_META_DATA = {
  [CURRENCY_CODE.KES]: "Kenyan Shilling | Kenya",
  [CURRENCY_CODE.KWD]: "Kuwait Dinar | Kuwait",
  [CURRENCY_CODE.MXN]: "Mexican Peso | Mexico",
  [CURRENCY_CODE.UGX]: "Ugandan Shilling | Uganda",
  [CURRENCY_CODE.NZD]: "New Zealand Dollar | New Zealand",
  [CURRENCY_CODE.NOK]: "Norwegian Krone | Norway",
  [CURRENCY_CODE.OMR]: "Omani Rial | Oman",
  [CURRENCY_CODE.EUR]: "Euro | Europe",
  [CURRENCY_CODE.PLN]: "Polish Zloty | Poland",
  [CURRENCY_CODE.QAR]: "Qatari Rial | Qatar",
  [CURRENCY_CODE.RON]: "Romanian Leu | Romania",
  [CURRENCY_CODE.CAD]: "Canadian Dollar | Canada",
  [CURRENCY_CODE.SAR]: "Saudi Riyal | Saudi Arabia",
  [CURRENCY_CODE.ZAR]: "South African Rand | South Africa",
  [CURRENCY_CODE.SEK]: "Swedish Krona | Sweden",
  [CURRENCY_CODE.USD]: "US Dollar | United States | USA",
  [CURRENCY_CODE.CHF]: "Swiss Franc | Switzerland",
  [CURRENCY_CODE.THB]: "Thai Baht | Thailand",
  [CURRENCY_CODE.TRY]: "Turkish Lira | Turkey",
  [CURRENCY_CODE.SGD]: "Singapore Dollar | Singapore",
  [CURRENCY_CODE.AED]: "UAE Dirham | United Arab Emirates",
  [CURRENCY_CODE.GBP]: "British Pound Sterling | United Kingdom | UK",
  [CURRENCY_CODE.AUD]: "Australian Dollar | Australia",
  [CURRENCY_CODE.BHD]: "Bahraini Dinar | Bahrain",
  [CURRENCY_CODE.BGN]: "Bulgarian Lev | Bulgaria",
  [CURRENCY_CODE.CNH]: "Chinese Yuan | China",
  [CURRENCY_CODE.CZK]: "Czech Koruna | Czech Republic",
  [CURRENCY_CODE.DKK]: "Danish Krone | Denmark",
  [CURRENCY_CODE.ILS]: "Israeli Shekel | Israel",
  [CURRENCY_CODE.JPY]: "Japanese Yen | Japan",
  [CURRENCY_CODE.HKD]: "Hong Kong Dollar | Hong Kong",
  [CURRENCY_CODE.HUF]: "Hungarian Forint | Hungary",
  [CURRENCY_CODE.INR]: "Indian Rupee | India",
};

export const UserSkipIdentifier = {
  PAYMENT_LINK: "PAYMENT_LINK",
  CC_BANK_ADDRESS_CHANGE_POPUP: "CC_BANK_ADDRESS_CHANGE_POPUP",
};

export const NotificationType = {
  CC_BANK_ADDRESS_CHANGE: "CC_BANK_ADDRESS_CHANGE",
};
