import {
  ACCOUNT_CREATED_STATES,
  BUSSINESS_TYPES,
  INDUSTRY_TYPES,
  INT_ACCOUNT_CREATED_STATE,
  USER_STATES,
} from "../constants/onboarding";
import Locale from "./locale/en";
import {
  AccountRole,
  ALLOWED_IMPORTER_LOCATION,
  BankUsageType,
  CURRENCY_CODE,
  CURRENCY_VS_LOCATION_MAP,
  EntityTypes,
  INVOICE_STATUS,
  INVOICE_STATUS_OVERVIEW_MAP,
  LOCATION_CODE,
  LOCATION_CURRENCY_MAP,
  NICHE_IMPORTER_CURRENCY,
  NICHE_IMPORTER_LOCATION,
  REGIONAL_CURRENCY_FEE_CURRENCIES,
  PAYMENT_PROCESSORS,
  TRANSACTION_STATES,
  VIRTUAL_ACCOUNT_VENDOR,
} from "../constants/dashboardConstants";
import { ThemeInterface } from "../context/AppContext";
import {
  AccountDetails,
  CashbackReasonType,
  CompleteVirtualAccountDetail,
  CountryVsAccountDetails,
  ExtendedCompleteVirtualAccountDetail,
  Invoice,
  MobileDashDirectionData,
  VirtualAccountDetail,
} from "../types";
import BE_ROUTES from "./beRoutes";
import MonthlySummaryType from "../components/BusinessAnalytics/constants";
import { formatDate } from "./formatters";
import * as R from "remeda";

import { isDashboardRoutesPublic } from "../authentication/PreKycDashboardManagement";
import FE_ROUTES from "./feRoutes";
import Router from "next/router";
import { AadhaarNumberType } from "../types/atomicComponentTypes";
import { previewableExtensions } from "../constants/atomicConstants";

import { DashboardVersionType } from "../types/DashboardVersionTypes";

export const isDashboardAccessible = (state: string) => {
  return (
    state !== USER_STATES.ARCHIVED &&
    state !== USER_STATES.BLACK_LISTED &&
    (ACCOUNT_CREATED_STATES.includes(state) || isDashboardRoutesPublic(null))
  );
};

export const isIntAccountCreatedState = (state: string) => {
  return INT_ACCOUNT_CREATED_STATE.includes(state);
};

export const isUserKYCed = (state: string) => {
  return ACCOUNT_CREATED_STATES.includes(state);
};

export const isManualCheckPending = (state: string) => {
  return USER_STATES.MANUAL_VERIFICATION === state;
};

export const isAedActivationSuspendedForUser = (
  isAedAccountOperationsSuspended: boolean,
  location: string,
  isUaeActivationAllowed?: boolean
) => isAedAccountOperationsSuspended && location === LOCATION_CODE.UAE && !isUaeActivationAllowed;

// Niche currencies share the SWIFT/ROW account and behave like ROW for account
// details, timeline and how-it-works content.
export const isNicheLocation = (location: string) => NICHE_IMPORTER_LOCATION.includes(location);

// Niche only — excludes AED, whose regional fee applies to its local account rather than SWIFT.
export const isNicheCurrency = (currency: string) => NICHE_IMPORTER_CURRENCY.includes(currency);

// UAE + niche currencies are charged the 1% Regional Currency Fee on top of the base fee.
export const isRegionalFeeCurrency = (currency: string) => REGIONAL_CURRENCY_FEE_CURRENCIES.includes(currency);

/**
 * Whether an account-details surface should disclose the 1% Regional Currency Fee.
 * The fee follows the currency, not the client's country — a US client paying in JPY still pays it.
 * AED is the exception: its regional fee belongs to the local UAE account, and a mismatched pair
 * settles over SWIFT, where AED carries no regional fee. The FX calculator deliberately does NOT
 * use this: it quotes the local (Glomo) rail, where AED always carries the fee.
 */
export const showsRegionalFee = (currency: string, location?: string) =>
  isNicheCurrency(currency) || (currency === CURRENCY_CODE.AED && location === LOCATION_CODE.UAE);

export const isRefundAvailable = (reward: Number) => {
  return reward > 0.0;
};

export const isTransactionRefundableV3 = (reward: Number, cashbackReason?: string) => {};

export const getRefundReason = (cashbackReason?: string) => {
  if (cashbackReason === CashbackReasonType.OFFLINE_CASHBACK) {
    return Locale.payment;
  } else if (cashbackReason === CashbackReasonType.ACTIVATION_REWARD) {
    return Locale.payment;
  } else return Locale.firstPayment;
};

export const isFunction = (variable: any): boolean => typeof variable === "function";

export const parseErrorMessage = (error: any) => {
  if (!error) return Locale.wentWrongMessage;
  if (error.message) return error.message;
  if (error.data?.message) return error.data.message;
  return Locale.wentWrongMessage;
};

export const getCompanyName = ({
  businessLegalName,
  correspondentName,
  defaultVal,
}: {
  businessLegalName?: string;
  correspondentName?: string;
  defaultVal?: string;
}) => {
  return correspondentName || businessLegalName || defaultVal || "";
};

export const getExporterUserName = ({ registeredName, fullName }: { registeredName?: string; fullName?: string }) => {
  return registeredName || fullName || "";
};

export const getSplittedAadhaar = (value: string) => {
  const capsXValue = value.replaceAll("x", "X");
  const splittedAadhaar = (capsXValue?.replace(/ /g, "")?.match(/.{1,4}/g) ||
    new Array(3).fill("")) as AadhaarNumberType;
  if (splittedAadhaar.length > 3) {
    splittedAadhaar.splice(3);
  }
  return splittedAadhaar;
};

export const isFileTypeNotPdf = (url: string) => {
  const extension = url?.split(".").pop() || "";
  const trimmedExtension = extension.indexOf("?") >= 0 ? extension.substring(0, extension.indexOf("?")) : extension;
  return trimmedExtension !== "pdf";
};

export const isFileTypePreviewable = (url: string) => {
  const extension = url?.split(".").pop() || "";
  const trimmedExtension = extension.indexOf("?") >= 0 ? extension.substring(0, extension.indexOf("?")) : extension;
  const lowercaseExtension = trimmedExtension.toLowerCase();
  return previewableExtensions.includes(lowercaseExtension);
};

export const getFirstCharUpperCase = (name: string = "") => {
  const trimmedName = name.trim();
  const firstChar = trimmedName.charAt(0);
  return firstChar.toUpperCase();
};

export const roundTo = (number: number, places: number = 2) => {
  return +(Math.round(Number(number + "e+" + places)) + "e-" + places);
};

export const getInvoiceStatusColorMap = (theme: ThemeInterface) => {
  return {
    [INVOICE_STATUS.ARCHIVED]: {
      textColor: theme.hexColors.red[400],
      bgColor: theme.hexColors.red[50],
    },
    [INVOICE_STATUS.UNPARSED]: {
      textColor: theme.hexColors.orange[400],
      bgColor: theme.hexColors.orange[50],
    },
    [INVOICE_STATUS.UNPAID]: {
      textColor: theme.hexColors.orange[400],
      bgColor: theme.hexColors.orange[50],
    },
    [INVOICE_STATUS.IN_PROGRESS]: {
      textColor: theme.hexColors.limegreen[400],
      bgColor: theme.hexColors.limegreen[50],
    },
    [INVOICE_STATUS.PARTIALLY_PAID]: {
      textColor: theme.hexColors.limegreen[400],
      bgColor: theme.hexColors.limegreen[50],
    },
    [INVOICE_STATUS.PAID]: {
      textColor: theme.hexColors.green[400],
      bgColor: theme.hexColors.green[50],
    },
    [INVOICE_STATUS.FAILED]: {
      textColor: theme.hexColors.red[400],
      bgColor: theme.hexColors.red[50],
    },
  };
};

export const getInvoiceStatusWiseColorTextMapping = (invoiceData: Invoice, theme: ThemeInterface) => {
  const { amountMapped, expectedAmount } = invoiceData;
  const map = getInvoiceStatusColorMap(theme);
  //@info - purpose code handling
  const isInprogress =
    invoiceData.status === INVOICE_STATUS.IN_PROGRESS ||
    (invoiceData.amountMapped > 0 && invoiceData.status === INVOICE_STATUS.INFO_AWAITED);
  const isTestAndOutstanding = invoiceData.isTest && invoiceData.readyToTransact === false;
  if (!isTestAndOutstanding && (amountMapped === expectedAmount || invoiceData.status === INVOICE_STATUS.PAID)) {
    return {
      ...map[INVOICE_STATUS.PAID],
      text: Locale.paidLabel,
      isInprogress,
    };
  }
  if (amountMapped !== 0 && (amountMapped < expectedAmount || invoiceData.status === INVOICE_STATUS.PARTIALLY_PAID)) {
    return {
      ...map[INVOICE_STATUS.PARTIALLY_PAID],
      text: Locale.partiallyPaidLabel,
      isInprogress,
    };
  }
  return {
    ...map[INVOICE_STATUS.UNPAID],
    text: Locale.paymentAwaited,
    isInprogress: false,
  };
};

export const getTransactionStatusWiseColorTextMapping = (
  status: string,
  theme: ThemeInterface,
  isSkydoInvoice: boolean
) => {
  const map = getInvoiceStatusColorMap(theme);
  if (!isSkydoInvoice) {
    return {
      ...map[INVOICE_STATUS.PAID],
      text: Locale.paymentComplete,
      fullText: Locale.completedByOthers,
    };
  }
  if (status === TRANSACTION_STATES.EXPORTER_SUCCESS) {
    return {
      ...map[INVOICE_STATUS.PAID],
      text: Locale.paymentComplete,
      fullText: Locale.completedViaSkydo,
    };
  } else if (status === TRANSACTION_STATES.REJECTED) {
    return {
      ...map[INVOICE_STATUS.FAILED],
      text: Locale.failed,
      fullText: Locale.failed,
    };
  } else if (status) {
    return {
      ...map[INVOICE_STATUS.IN_PROGRESS],
      text: Locale.paymentInProgress,
      fullText: Locale.paymentInProgress,
    };
  }
  return {
    ...map[INVOICE_STATUS.UNPAID],
    text: Locale.paymentAwaited,
    fullText: Locale.paymentAwaited,
  };
};

export const isArchived = (status?: string) => status === INVOICE_STATUS.ARCHIVED;
export const isRejected = (status?: string) => status === TRANSACTION_STATES.REJECTED;
export const isUnparsed = (status?: string) =>
  status === INVOICE_STATUS.UNPARSED ||
  status === INVOICE_STATUS.PARTIAL_PARSED ||
  status === INVOICE_STATUS.FULL_PARSED ||
  status === INVOICE_STATUS.NOT_PARSABLE;
export const isCompleted = (status: string) => status === INVOICE_STATUS.PAID;

export const isCompletedTransaction = (status?: string) => status === TRANSACTION_STATES.EXPORTER_SUCCESS;

export const getGstDetails = (gstList: { [key: string]: any }[] = []) => {
  const PRIMARY_GST = "PRIMARY";
  for (let i = 0; i < gstList.length; ++i) {
    const gst = gstList[i];
    if (gst.entryType === PRIMARY_GST) {
      return {
        isPrimaryExist: true,
        primaryGstId: gst.id,
        primaryGstAddress: gst.address,
        priamryGstNumber: gst.gstin,
      };
    }
  }
  return { isPrimaryExist: false, primaryGstAddress: "" };
};

export function getFirstWord(str: string): string {
  str = str?.trim();

  // Find the first space character
  const spaceIndex = str?.indexOf(" ");

  let firstWord = "";
  if (spaceIndex === -1) {
    // No space found, the entire string is the first word
    firstWord = str;
  } else {
    // Extract the first word
    firstWord = str?.substring(0, spaceIndex);
  }
  firstWord = firstWord?.replace(/[.,]$/, "");
  return capitalizeFirstLetter(firstWord);
}

export function capitalizeFirstLetter(word: string): string {
  if (!word) {
    return "";
  }
  return word?.charAt(0).toUpperCase() + word?.slice(1).toLowerCase();
}

export const onCopyAccountDetailsClick = (accountDetails: AccountDetails): Promise<void> => {
  return navigator?.clipboard?.writeText(
    `${Locale.paymentMethod}: ${accountDetails.paymentMethod}\n` +
      `${Locale.accountName}: ${accountDetails.accountHolderName}\n` +
      `${Locale.accountNumber}: ${accountDetails.accountNumber}\n` +
      `${Locale.routingNumb}: ${accountDetails.routingNumber}\n` +
      `${Locale.accountType}: ${accountDetails.accountType}\n` +
      `${Locale.bankName}: ${accountDetails.bankName}\n` +
      `${Locale.beneAddress}: ${accountDetails.beneAddress}`
  );
};

export const findIfSkydoInvoiceFromPaymentProcessor = (paymentProcessor?: string) => {
  return !paymentProcessor || paymentProcessor == PAYMENT_PROCESSORS.SKYDO;
};

export const getLockedStateTitles = (state: string, businessType: string) => {
  if (state === USER_STATES.COMPANY_MANAGEMENT_DETAILS) {
    return businessType === BUSSINESS_TYPES.PARTNERSHIP
      ? {
          preTitle: Locale.partnerList,
          postTitle: Locale.partnerDetailsCaptured,
        }
      : businessType == BUSSINESS_TYPES.HUF
      ? {
          preTitle: Locale.hufCompanyMgmtDetailsStep,
          postTitle: Locale.hufCompanyMgmtDetailsStepDone,
        }
      : {
          preTitle: Locale.ownersList,
          postTitle: Locale.managementCaptured,
        };
  } else if (state === USER_STATES.UBO_PAN_DETAILS) {
    return { preTitle: Locale.uboPanHeaderVkycPre, postTitle: Locale.uboPanHeaderVkycPost };
  } else if (state === USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS) {
    return businessType === BUSSINESS_TYPES.PARTNERSHIP
      ? {
          preTitle: Locale.partnerShipBankDetails,
          postTitle: Locale.partnerBankAccountDetailsSuccess,
        }
      : businessType === BUSSINESS_TYPES.PROPRIETORSHIP
      ? {
          preTitle: Locale.businessBankDetails,
          postTitle: Locale.businessBankAccountDetailsSuccess,
        }
      : businessType === BUSSINESS_TYPES.FREELANCER
      ? {
          preTitle: Locale.freelancerBankDetails,
          postTitle: Locale.businessBankAccountDetailsSuccess,
        }
      : businessType == BUSSINESS_TYPES.HUF
      ? {
          preTitle: Locale.companyBankDetails,
          postTitle: Locale.hufBankDetailsSuccess,
        }
      : {
          preTitle: Locale.companyBankDetails,
          postTitle: Locale.companyBankAccountDetailsSuccess,
        };
  } else if (state === USER_STATES.COMPANY_PAN_DETAILS) {
    return businessType == BUSSINESS_TYPES.FREELANCER
      ? {
          preTitle: Locale.enterCompanyPan,
          postTitle: Locale.freelancerPanSubmitted,
        }
      : businessType == BUSSINESS_TYPES.PROPRIETORSHIP ||
        businessType == BUSSINESS_TYPES.PARTNERSHIP ||
        businessType == BUSSINESS_TYPES.HUF
      ? {
          preTitle: Locale.enterCompanyPan,
          postTitle: Locale.businessPanSubmitted,
        }
      : {
          preTitle: Locale.enterCompanyPan,
          postTitle: Locale.companyPanSubmitted,
        };
  }
  return {
    preTitle: "",
    postTitle: "",
  };
};

export const flattenArray = (arr: any[]): any[] => {
  return arr.reduce((acc, curr: any) => {
    if (Array.isArray(curr)) {
      return acc.concat(flattenArray(curr));
    } else {
      return acc.concat(curr);
    }
  }, []);
};

export const INVOICE_STATUSES_WITH_MONEY = [
  INVOICE_STATUS.PARTIALLY_PAID,
  INVOICE_STATUS.IN_PROGRESS,
  INVOICE_STATUS.PAID,
];

export const canShowMarkAsPaid = (invoiceData: Invoice): boolean => {
  return !(
    isUnparsed(invoiceData.status) ||
    isArchived(invoiceData.status) ||
    INVOICE_STATUSES_WITH_MONEY.includes(invoiceData.status) ||
    invoiceData.amountMapped > 0
  );
};

export const PARTIAL_STATUSES = [INVOICE_STATUS.PARTIALLY_PAID, INVOICE_STATUS.IN_PROGRESS];

export const canShowMarkAsPaidPartial = (invoiceData: Invoice): boolean => {
  return (
    PARTIAL_STATUSES.includes(invoiceData.status) &&
    invoiceData.amountMapped > 0 &&
    invoiceData.expectedAmount > invoiceData.amountMapped
  );
}

const REMINDER_ELIGIBLE_INVOICE_STATUSES = [
  INVOICE_STATUS.FULL_PARSED,
  INVOICE_STATUS.INFO_AWAITED,
  INVOICE_STATUS.READY_TO_TRANSACT,
  INVOICE_STATUS.PARTIALLY_PAID,
];

export const getOutstandingAmountForInvoice = (invoice: Invoice): number => {
  return Math.max(Number(invoice.expectedAmount) - Number(invoice.amountMapped), 0);
};

/**
 * Happy cases:
 *    1. INVOICE_STATUS.FULL_PARSED,
 *    2. INVOICE_STATUS.INFO_AWAITED,
 *    3. INVOICE_STATUS.READY_TO_TRANSACT,
 *    4. INVOICE_STATUS.PARTIALLY_PAID,
 *
 * Edge cases:
 *    1. `IN_PROGRESS` and (invoiceData.expectedAmount - invoiceData.amountMapped) > 0
 *
 */
export const canShowPaymentReminder = (invoiceData: Invoice, companyName: string): boolean => {
  if (!companyName) return false;
  if (REMINDER_ELIGIBLE_INVOICE_STATUSES.includes(invoiceData.status)) {
    return true;
  }
  if (invoiceData.status === INVOICE_STATUS.IN_PROGRESS) {
    return invoiceData.expectedAmount - invoiceData.amountMapped > 0;
  }
  return false;
};

export const canShowDuplicateInvoice = (invoiceData: Invoice): boolean => {
  return !(isUnparsed(invoiceData.status) || isArchived(invoiceData.status));
};

export const canShowSendReminder = (invoiceData: Invoice): boolean => {
  return !(
    isUnparsed(invoiceData.status) ||
    isArchived(invoiceData.status) ||
    INVOICE_STATUSES_WITH_MONEY.includes(invoiceData.status)
  );
};

export const canShowMarkArchived = (invoiceData: Invoice): boolean => {
  return INVOICE_STATUS_OVERVIEW_MAP.outstanding.includes(invoiceData.status) && invoiceData.amountMapped <= 0;
};

export const getMobileDetect = (userAgent: NavigatorID["userAgent"]) => {
  const isAndroid = () => Boolean(userAgent.match(/Android/i));
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = () => Boolean(userAgent.match(/SSR/i));
  const isMobile = () => Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = () => Boolean(!isMobile() && !isSSR());
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  };
};

export const ROUTING_CODE_TYPES = {
  BIC_SWIFT: "bic_swift",
  ACH_ROUTING_NUMBER: "ach_routing_number",
  SORT_CODE: "sort_code",
  ROUTING_CODE: "routing_code", // cad
  WIRE_ROUTING_NUMBER: "wire_routing_number", //to get US Fed Wire Number
  BSB: "bsb", // to get Australian BSB
  DBS_SG: "DBS_SG", // to get Singapore DBS
};

const EMPTY_PAYMENT_DETAILS_VS_LOCATION_CODE = {
  [LOCATION_CODE.USA]: {
    paymentMethod: Locale.achTransfer,
  },
  [LOCATION_CODE.UK]: {
    paymentMethod: Locale.fpsTransfer,
  },
  [LOCATION_CODE.CA]: {
    paymentMethod: Locale.eftTransfer,
  },
  [LOCATION_CODE.EUROPE]: {
    paymentMethod: Locale.sepaTransfer,
  },
  [LOCATION_CODE.AUS]: {
    paymentMethod: Locale.becsOrDirectEntry,
  },
  [LOCATION_CODE.SG]: {
    paymentMethod: Locale.sgPaymentMethods,
  },
  [LOCATION_CODE.ROW]: {
    paymentMethod: Locale.swiftInternational,
    beneficiaryBankCountry: Locale.unitedKingdom,
    currency: CURRENCY_VS_LOCATION_MAP[LOCATION_CODE.USA],
  },
};

/** Lower = processed first in getLocationWiseAccountDetails. Caliza last so CC/ACH base rows exist first. */
const VIRTUAL_ACCOUNT_PROVIDER_PROCESSING_ORDER: Record<string, number> = {
  [VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD]: 0,
  [VIRTUAL_ACCOUNT_VENDOR.BANKING_CIRCLE]: 1,
  [VIRTUAL_ACCOUNT_VENDOR.DBS_SG]: 2,
  [VIRTUAL_ACCOUNT_VENDOR.GLOMO_PAY]: 3,
  [VIRTUAL_ACCOUNT_VENDOR.NOVATTI]: 4,
  [VIRTUAL_ACCOUNT_VENDOR.CALIZA]: 100,
};

const getVirtualAccountProviderSortIndex = (accountProvider?: string): number => {
  if (accountProvider == null) return 50;
  const order = VIRTUAL_ACCOUNT_PROVIDER_PROCESSING_ORDER[accountProvider];
  return order !== undefined ? order : 50;
};

export const getLocationWiseAccountDetails = (
  virtualAccounts: VirtualAccountDetail[],
  businessLegalName: string,
  isBankingCircle: Boolean = false,
  isAmazon: Boolean = false,
  skydoBalanceVendor?: string | null
) => {
  if (virtualAccounts === undefined || virtualAccounts === null || virtualAccounts.length === 0) {
    return ALLOWED_IMPORTER_LOCATION.reduce((acc, location) => {
      acc[location] = {
        accountHolderName: businessLegalName,
        accountType: Locale.checkingAccount,
        ...EMPTY_PAYMENT_DETAILS_VS_LOCATION_CODE[location],
      };
      return acc;
    }, {} as { [key: string]: any });
  }
  const sortedVirtualAccounts = [...virtualAccounts].sort(
    (a, b) =>
      getVirtualAccountProviderSortIndex(a.accountProvider) -
      getVirtualAccountProviderSortIndex(b.accountProvider)
  );
  // If backend tags any USD account as PRIMARY, only that account fills the USD
  // display slot; other USD accounts are skipped. Without a PRIMARY tag, the
  // legacy CC/Caliza provider-based routing applies (pre-MCG behaviour).
  const hasUsdPrimaryAccount = sortedVirtualAccounts.some(
    (va) =>
      va.accountRole === AccountRole.PRIMARY &&
      (va.routingCodeType === ROUTING_CODE_TYPES.ACH_ROUTING_NUMBER ||
        va.routingCodeType === ROUTING_CODE_TYPES.WIRE_ROUTING_NUMBER)
  );
  const locationWiseDetails = sortedVirtualAccounts.reduce(
    (currencyVsDetailsMap: CountryVsAccountDetails, virtualAccount: VirtualAccountDetail) => {
      switch (virtualAccount.routingCodeType) {
        case ROUTING_CODE_TYPES.ACH_ROUTING_NUMBER:
          if (
            skydoBalanceVendor === VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD &&
            virtualAccount.accountProvider === VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD
          ) {
            const existingUSA =
              currencyVsDetailsMap[LOCATION_CODE.USA] ??
              ({} as ExtendedCompleteVirtualAccountDetail);
            const existingBalance =
              existingUSA.accountsByUsageType?.[BankUsageType.BALANCE] ??
              ({} as CompleteVirtualAccountDetail);
            currencyVsDetailsMap[LOCATION_CODE.USA] = {
              ...existingUSA,
              accountsByUsageType: {
                ...existingUSA.accountsByUsageType,
                [BankUsageType.BALANCE]: {
                  ...existingBalance,
                  ...virtualAccount,
                  accountHolderName: businessLegalName,
                  accountType: Locale.checkingAccount,
                  paymentMethod: Locale.achTransfer,
                  accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
                },
              },
            };
          }
          if (hasUsdPrimaryAccount && virtualAccount.accountRole !== AccountRole.PRIMARY) {
            break;
          }
          currencyVsDetailsMap[LOCATION_CODE.USA] = {
            ...virtualAccount,
            paymentMethod: Locale.achTransfer,
            accountHolderName: businessLegalName,
            accountType: Locale.checkingAccount,
            accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
            ...(currencyVsDetailsMap[LOCATION_CODE.USA] ? currencyVsDetailsMap[LOCATION_CODE.USA] : {}),
          };
          break;
        case ROUTING_CODE_TYPES.WIRE_ROUTING_NUMBER: {
          // Main USD slot: when any USD account is tagged PRIMARY, only that row
          // populates the slot; otherwise legacy CC fedWire patch applies.
          if (hasUsdPrimaryAccount) {
            if (virtualAccount.accountRole === AccountRole.PRIMARY) {
              const existingUSA = currencyVsDetailsMap[LOCATION_CODE.USA];

              if (existingUSA?.accountNumber) {
                currencyVsDetailsMap[LOCATION_CODE.USA] = {
                  ...existingUSA,
                  fedWireRoutingNumberUS: virtualAccount.routingNumber,
                };
              } else {
                currencyVsDetailsMap[LOCATION_CODE.USA] = {
                  ...virtualAccount,
                  accountHolderName: businessLegalName,
                  accountType: Locale.checkingAccount,
                  paymentMethod: Locale.achTransfer,
                  accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
                  fedWireRoutingNumberUS: virtualAccount.routingNumber,
                  ...(existingUSA?.accountsByUsageType && {
                    accountsByUsageType: existingUSA.accountsByUsageType,
                  }),
                };
              }
            }
          } else if (virtualAccount.accountProvider === VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD) {
            currencyVsDetailsMap[LOCATION_CODE.USA] = {
              ...(currencyVsDetailsMap[LOCATION_CODE.USA]
                ? currencyVsDetailsMap[LOCATION_CODE.USA]
                : ({} as CompleteVirtualAccountDetail)),
              fedWireRoutingNumberUS: virtualAccount.routingNumber,
            };
          }
          // BALANCE slot — Caliza legacy path; skip when vendor is CC (CC ACH/WIRE
          // sections above own the BALANCE slot for CC exporters).
          if (
            virtualAccount.accountProvider === VIRTUAL_ACCOUNT_VENDOR.CALIZA &&
            skydoBalanceVendor === VIRTUAL_ACCOUNT_VENDOR.CALIZA
          ) {
            const existingUSA =
              currencyVsDetailsMap[LOCATION_CODE.USA] ??
              ({} as ExtendedCompleteVirtualAccountDetail);
            currencyVsDetailsMap[LOCATION_CODE.USA] = {
              ...existingUSA,
              accountsByUsageType: {
                ...existingUSA.accountsByUsageType,
                [BankUsageType.BALANCE]: {
                  ...virtualAccount,
                  accountHolderName: businessLegalName,
                  accountType: Locale.checkingAccount,
                  paymentMethod: Locale.achTransfer,
                  fedWireRoutingNumberUS: virtualAccount.routingNumber,
                  accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
                },
              },
            };
          }
          if (
            skydoBalanceVendor === VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD &&
            virtualAccount.accountProvider === VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD
          ) {
            const existingUSA =
              currencyVsDetailsMap[LOCATION_CODE.USA] ??
              ({} as ExtendedCompleteVirtualAccountDetail);
            const existingBalance =
              existingUSA.accountsByUsageType?.[BankUsageType.BALANCE] ??
              ({} as CompleteVirtualAccountDetail);
            currencyVsDetailsMap[LOCATION_CODE.USA] = {
              ...existingUSA,
              accountsByUsageType: {
                ...existingUSA.accountsByUsageType,
                [BankUsageType.BALANCE]: {
                  ...existingBalance,
                  fedWireRoutingNumberUS: virtualAccount.routingNumber,
                },
              },
            };
          }

          break;
        }
        case ROUTING_CODE_TYPES.SORT_CODE:
          if (isBankingCircle && virtualAccount.accountProvider === "BANKING_CIRCLE") {
            currencyVsDetailsMap[LOCATION_CODE.UK] = {
              ...virtualAccount,
              paymentMethod: Locale.fPSBacsCHAPS,
              accountHolderName: businessLegalName,
              accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.UK],
              accountType: Locale.checkingAccount,
            };
          } else if (!isBankingCircle && virtualAccount.accountProvider === "CURRENCY_CLOUD") {
            currencyVsDetailsMap[LOCATION_CODE.UK] = {
              ...virtualAccount,
              paymentMethod: Locale.fpsTransfer,
              accountHolderName: businessLegalName,
              accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.UK],
              accountType: Locale.checkingAccount,
            };
          }
          break;
        case ROUTING_CODE_TYPES.ROUTING_CODE:
          currencyVsDetailsMap[LOCATION_CODE.CA] = {
            ...virtualAccount,
            accountNumber: virtualAccount.accountNumber,
            paymentMethod: Locale.eftTransfer,
            accountHolderName: businessLegalName,
            accountType: Locale.checkingAccount,
            institutionNumber: isAmazon
              ? "0" + virtualAccount.routingNumber?.substring(1, 4)
              : virtualAccount.routingNumber?.substring(1, 4),
            transitNumber: virtualAccount.routingNumber?.substring(4),
            accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.CA],
          };
          break;
        case ROUTING_CODE_TYPES.BIC_SWIFT:
          if (virtualAccount.paymentType === "regular") {
            if (isBankingCircle && virtualAccount.accountProvider === "BANKING_CIRCLE") {
              currencyVsDetailsMap[LOCATION_CODE.EUROPE] = {
                ...virtualAccount,
                paymentMethod: Locale.sepaAndInstant,
                accountHolderName: businessLegalName,
                accountType: Locale.checkingAccount,
                accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.EUROPE],
              };
            } else if (!isBankingCircle && virtualAccount.accountProvider === "CURRENCY_CLOUD") {
              currencyVsDetailsMap[LOCATION_CODE.EUROPE] = {
                ...virtualAccount,
                paymentMethod: Locale.sepaTransfer,
                accountHolderName: businessLegalName,
                accountType: Locale.checkingAccount,
                accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.EUROPE],
              };
            } else if (virtualAccount.accountProvider === "GLOMO_PAY") {
              currencyVsDetailsMap[LOCATION_CODE.UAE] = {
                ...virtualAccount,
                paymentMethod: Locale.ippFtsTransfer,
                accountHolderName: businessLegalName,
                accountType: Locale.checkingAccount,
                accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.UAE],
              };
            }
          } else if (virtualAccount.currency === LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]) {
            currencyVsDetailsMap[LOCATION_CODE.ROW] = {
              ...virtualAccount,
              currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
              paymentMethod: Locale.swiftInternational,
              accountHolderName: businessLegalName,
              accountType: Locale.checkingAccount,
              beneficiaryBankCountry: Locale.unitedKingdom,
            };
          }
          break;
        case ROUTING_CODE_TYPES.BSB:
          currencyVsDetailsMap[LOCATION_CODE.AUS] = {
            ...virtualAccount,
            paymentMethod: Locale.becsOrDirectEntry,
            accountHolderName: businessLegalName,
            accountType: Locale.checkingAccount,
            accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.AUS],
          };
          break;
        case ROUTING_CODE_TYPES.DBS_SG:
          currencyVsDetailsMap[LOCATION_CODE.SG] = {
            ...virtualAccount,
            paymentMethod: Locale.sgPaymentMethods,
            accountHolderName: businessLegalName,
            accountType: Locale.checkingAccount,
            accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.SG],
            ...(isAmazon && virtualAccount.bankCode && { bankCode: virtualAccount.bankCode }),
          };
          break;
      }
      return currencyVsDetailsMap;
    },
    {}
  );
  if (!locationWiseDetails[LOCATION_CODE.AUS]) {
    locationWiseDetails[LOCATION_CODE.AUS] = {
      accountHolderName: businessLegalName,
      accountType: Locale.checkingAccount,
      accountNumber: "",
      routingCodeType: "",
      paymentType: "",
      routingNumber: "",
      bankName: "",
      currency: "",
      bankAddress: "",
      accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.AUS],
      ...EMPTY_PAYMENT_DETAILS_VS_LOCATION_CODE[LOCATION_CODE.AUS],
    };
  }
  if (!locationWiseDetails[LOCATION_CODE.SG]) {
    locationWiseDetails[LOCATION_CODE.SG] = {
      accountHolderName: businessLegalName,
      accountType: Locale.checkingAccount,
      accountNumber: "",
      routingCodeType: "",
      paymentType: "",
      routingNumber: "",
      bankName: "",
      currency: "",
      bankAddress: "",
      accountCurrency: LOCATION_CURRENCY_MAP[LOCATION_CODE.SG],
      ...EMPTY_PAYMENT_DETAILS_VS_LOCATION_CODE[LOCATION_CODE.SG],
    };
  }
  return locationWiseDetails;
};

export const debounce = (func: Function, wait: number, options: { immediate?: boolean; isLeading?: boolean } = {}) => {
  let timeout: NodeJS.Timeout | null;
  return function (...params: any[]) {
    // @ts-ignore
    const context = this;
    const args = arguments;
    if (options.isLeading && !timeout && !options.immediate) func.apply(context, args);
    const later = function () {
      timeout = null;
      if (!options.immediate && !options.isLeading) func.apply(context, args);
    };
    const callNow = options.immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const debouncePromise = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { immediate?: boolean; isLeading?: boolean } = {}
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let timeout: NodeJS.Timeout | null = null;
  let pendingPromise: {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  } | null = null;

  return function (...params: Parameters<T>): Promise<ReturnType<T>> {
    // @ts-ignore
    const context = this;

    return new Promise((resolve, reject) => {
      const shouldExecuteLeading = options.isLeading && !timeout && !options.immediate;

      if (shouldExecuteLeading) {
        try {
          const result = func.apply(context, params);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      } else {
        // Store the promise handlers
        pendingPromise = { resolve, reject };
      }

      const later = function () {
        timeout = null;
        if (!options.immediate && !options.isLeading && pendingPromise) {
          try {
            const result = func.apply(context, params);
            pendingPromise.resolve(result);
          } catch (error) {
            pendingPromise.reject(error);
          }
          pendingPromise = null;
        }
      };

      const callNow = options.immediate && !timeout;

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        if (pendingPromise) {
          try {
            const result = func.apply(context, params);
            pendingPromise.resolve(result);
          } catch (error) {
            pendingPromise.reject(error);
          }
          pendingPromise = null;
        }
      }
    });
  };
};

export const getFileDownloadUrl = (props: { docType: string; entityType: string; entityId?: number }) => {
  return BE_ROUTES.FILE_DOWNLOAD_PIPE_API.replace(
    ":path",
    props.entityType == EntityTypes.TEST_INVOICE
      ? getFileDownloadUrlForTestInvoice(props.docType)
      : BE_ROUTES.GENERIC_FILE_DOWNLOAD.replace(":downloadDocType", props.docType)
          .replace(":entityType", props.entityType)
          .replace(":entityId", String(props.entityId || 0))
  );
};

const getFileDownloadUrlForTestInvoice = (docType: string) => {
  return `/test/transaction/download/${docType}`;
};

export function getMonthInterval(date: string | number, analyticsOption: MonthlySummaryType) {
  if (date === "" || date === null || date === undefined) {
    return undefined;
  }
  const addMonths =
    analyticsOption === MonthlySummaryType.LAST_6_MONTHS
      ? 6
      : analyticsOption === MonthlySummaryType.LAST_3_MONTHS
      ? 3
      : 1;
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setMonth(endDate.getMonth() + addMonths);

  const endMonth = formatDate(endDate.toDateString(), { month: "short" });
  const startMonth = formatDate(startDate.toDateString(), { month: "short" });
  return startMonth + " - " + endMonth;
}

export const shouldRedirectToMobileInput = (userState: string, phoneNumber: string | undefined | null) => {
  return userState === USER_STATES.SIGN_UP_SUCCESS && !phoneNumber;
};

export const isOutstanding = (item: Invoice) => {
  if (item?.paymentProcessor === "OTHERS" && item?.status === "PAID") {
    return false;
  }
  return item.amountMapped < item.expectedAmount;
};

export const isPartiallyPaid = (invoice: Invoice) => {
  const { amountMapped, expectedAmount, status } = invoice;
  return amountMapped !== 0 && (amountMapped < expectedAmount || status === INVOICE_STATUS.PARTIALLY_PAID);
};

export const isPaid = (invoice: Invoice) => {
  return (
    invoice?.amountMapped > 0 &&
    invoice?.status !== INVOICE_STATUS.ARCHIVED &&
    !INVOICE_STATUS_OVERVIEW_MAP.parse_stage.includes(invoice?.status)
  );
};

export function isDiffLessThan24Hours(date1?: string | Date, date2?: string | Date) {
  if (!date1 || !R.isDate(new Date(date1))) return false;
  if (!date2 || !R.isDate(new Date(date2))) return false;
  const diffInMilliseconds = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

  return diffInHours < 24;
}

export function getPostalCode(address: string): string | null {
  const postalCodeRegex = /\d{6}/;
  const postalCodeMatch = address.match(postalCodeRegex);
  return postalCodeMatch ? postalCodeMatch[0] : null;
}

export function formatNumberWithTwoDecimals(number: number) {
  const formattedNumber = number.toFixed(2);
  const parts = formattedNumber.split(".");

  if (parts.length === 1) {
    // Number has no decimal part, add two zeros
    return `${parts[0]}.00`;
  } else {
    // Number has a decimal part, pad with zeros
    const decimalPart = parts[1].padEnd(2, "0");
    return `${parts[0]}.${decimalPart}`;
  }
}

/** Restricts a string (e.g. input value) to at most 2 decimal places by truncating. */
export function restrictTo2Decimals(val: string): string {
  if (val === "" || !val.includes(".")) return val;
  const [int, dec] = val.split(".");
  if (dec === undefined || dec.length <= 2) return val;
  return `${int || "0"}.${dec.slice(0, 2)}`;
}

export enum Social {
  FB,
  TWITTER,
  LINKEDIN,
  WHATSAPP,
}

export function openSocialShare(social: Social, url: string, text: string = "", openInNewWindow: boolean = false) {
  var winWidth = 520;
  var winHeight = 350;
  var winTop = window.screen.height / 2 - winHeight / 2;
  var winLeft = screen.width / 2 - winWidth / 2;

  let socialUrl = "https://www.facebook.com/sharer.php?u=#url#";
  if (social == Social.TWITTER) {
    socialUrl = "https://twitter.com/intent/tweet?url=#url#&text=#text#";
  } else if (social == Social.LINKEDIN) {
    socialUrl = "https://www.linkedin.com/sharing/share-offsite/?text=#text#&url=#url#";
  } else if (social == Social.WHATSAPP) {
    socialUrl = "https://api.whatsapp.com/send?text=#text#%20#url#";
  }
  const socialUrlToOpen = socialUrl
    .replace("#url#", encodeURIComponent(url))
    .replace("#text#", encodeURIComponent(text));
  if (openInNewWindow) {
    window.open(socialUrlToOpen);
  } else {
    window.open(
      socialUrlToOpen,
      "sharer",
      "top=" + winTop + ",left=" + winLeft + ",toolbar=0,status=0,width=" + winWidth + ",height=" + winHeight
    );
  }
}

export function openExternalUrl(url: string, target: "_blank" | "_self" = "_blank") {
  window.open(url, target, "noopener noreferrer");
}

export function openUrlWithoutSharingSession(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Opens a PDF/file URL in a new tab in the browser's native viewer (blob-like view).
 * For blob URLs, opens directly. For remote URLs, fetches and opens as object URL.
 */
export function openFileInNewTab(url: string) {
  if (!url) return;
  if (url.startsWith("blob:")) {
    window.open(url, "_blank", "noopener noreferrer");
    return;
  }
  fetch(url, { credentials: "omit" })
    .then((res) => res.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener noreferrer");
    })
    .catch(() => {
      window.open(url, "_blank", "noopener noreferrer");
    });
}

export const getRedirectionUrl = (
  userState: string,
  phoneNumber: string,
  isMobile: boolean,
  mobileDashDirectionData?: MobileDashDirectionData,
  redirect?: string
): string => {
  // p0 preference -- if user state is SIGN_UP_SUCCESS and there is no mobile number send him to onboarding screen collect phone number and then redirect to other places
  // 1st preference redirection url in the query param
  // 2nd preference url generation from the onboarding state
  if (redirect && redirect.startsWith("/") && redirect.includes(FE_ROUTES.PAYOUT_BENEFICIARY_LINKING)) {
    return redirect;
  }
  if (userState === USER_STATES.SIGN_UP_SUCCESS && !phoneNumber) {
    return FE_ROUTES.INSTANT_ONBOARDING + (Router.query.redirect ? `?redirect=${encodeURIComponent(String(Router.query.redirect))}` : "");
  }

  if (Router.query.redirect) {
    return decodeURI(Router.query.redirect as string);
  }
  if (isDashboardAccessible(userState as string)) {
    // payment and mobile -> recent payment
    // unmapped payment and movile -> unmapped

    if (isMobile && isIntAccountCreatedState(userState as string)) {
      const unmappedPaymentExist = mobileDashDirectionData?.unmappedFundingExists || false;
      if (unmappedPaymentExist) return FE_ROUTES.FUNDING;

      const showInvoicesPage =
        mobileDashDirectionData?.fundingExists || mobileDashDirectionData?.recentPaymentsExist || false;
      const dashVersion = mobileDashDirectionData?.dashVersion;
      if (showInvoicesPage && dashVersion) {
        const isInvoiceFull = dashVersion == DashboardVersionType.INVOICE_FULL;
        if (isInvoiceFull) return FE_ROUTES.INVOICES;
        return FE_ROUTES.PAYMENTS;
      }
    }

    return FE_ROUTES.DASHBOARD;
  } else if (userState && userState !== USER_STATES.NO_STATE) {
    return FE_ROUTES.INSTANT_ONBOARDING;
  }
  return FE_ROUTES.HOME;
};

export const isUserFullyOnboarded = (userState: string) => {
  return userState === USER_STATES.BENEFICIARY_ACCOUNT_PENDING || userState === USER_STATES.ONBOARDING_COMPLETE;
};

export const isClientSide = () => {
  try {
    return window !== undefined;
  } catch (error) {
    return false;
  }
};

export const truncateFileName = (fileName: string, maxLength: number): string => {
  if (fileName.length <= maxLength) return fileName;
  const ext = fileName.substring(fileName.lastIndexOf('.'));
  return `${fileName.substring(0, maxLength - 1)}...${ext}`;
};

export const truncateString = (str: string, n: number): string => {
  let string_copy = (" " + str).slice(1);
  if (string_copy.length > n) {
    string_copy = string_copy.substring(0, n) + "...";
  }
  return string_copy;
};

/**
 * Checks if a user has selected "yes" to an Amazon question
 * in the industry form questions
 */
export const checkHasAmazonStore = (values: any, selectedIndustryOption: any) => {
  return values.industryInfoResponses?.some((item: any, index: number) => {
    const question = selectedIndustryOption.metadata?.[index]?.question || "";
    return question.includes("Do you sell your products on Amazon Global") && item.response === "yes";
  });
};

/**
 * Checks if the pharmaceutical question is answered with "yes"
 * This is used to make website field compulsory and hide the "no website" checkbox
 */
export const checkHasPharmaceuticalExport = (values: any, selectedIndustryOption: any) => {
  return (
    values.industryInfoResponses?.some((item: any, index: number) => {
      const question = selectedIndustryOption.metadata?.[index]?.question || "";
      return (
        question.includes(
          "Is your business currently involved in exporting Pharmaceutical related products of any of the following types?"
        ) && item.response === "yes"
      );
    }) || selectedIndustryOption?.industryType === INDUSTRY_TYPES.PHARMA
  );
};

export const getFileTypeForAnalytics = (file?: File | null): string | undefined => {
  if (!file) return undefined;
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/jpeg" || file.type === "image/jpg") return "jpg";
  return file.type;
};
