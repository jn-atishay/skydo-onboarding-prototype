import { LOCATION_CODE } from "./dashboardConstants";
import Locale from "../util/locale/en";

export const LocationCodeToPublicBankAccountCardFields = {
  [LOCATION_CODE.USA]: [
    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.routingNumb,
      valueKey: "routingNumber",
    },
    {
      title: Locale.fedwireRoutingNumber,
      valueKey: "fedWireRoutingNumberUS",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddressClientSide,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.UK]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
      isClickable: true,
    },
    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.sortCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddressClientSide,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.UAE]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
      isClickable: true,
    },
    {
      title: Locale.ibanAccountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.bicCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddressClientSide,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.EUROPE]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
      isClickable: true,
    },
    {
      title: Locale.ibanAccountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.bicCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddressClientSide,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.CA]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
      isClickable: true,
    },
    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.routingCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.institutionNumber,
      valueKey: "institutionNumber",
    },
    {
      title: Locale.transitNumber,
      valueKey: "transitNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddressClientSide,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.ROW]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
      isClickable: true,
    },
    {
      title: Locale.ibanAccountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.bicCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddressClientSide,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.AUS]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
    },
    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.bsbNumber,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddress,
      valueKey: "bankAddress",
    },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },
  ],
  [LOCATION_CODE.SG]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
    },
    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bicCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddress,
      valueKey: "bankAddress",
    },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },
  ],
};

export const SHARE_DETAILS_STATE = {
  DEFAULT_PREVIEW_PAGE: "DEFAULT_PAGE",
  UPLOAD_PAGE: "UPLOAD_PAGE",
  CONFIRM_LOGO_PAGE: "CONFIRM_LOGO_PAGE",
};
export const CountryToPreviewImageMap = {
  [LOCATION_CODE.USA]: "/country_preview/usa.png",
  [LOCATION_CODE.UK]: "/country_preview/uk.png",
  [LOCATION_CODE.ROW]: "/country_preview/restofTheWorld.png",
  [LOCATION_CODE.EUROPE]: "/country_preview/europe.png",
  [LOCATION_CODE.CA]: "/country_preview/canada.png",
  [LOCATION_CODE.AUS]: "/country_preview/aus.png",
  [LOCATION_CODE.SG]: "/country_preview/sg.png",
  [LOCATION_CODE.UAE]: "/country_preview/uae.png"
};
