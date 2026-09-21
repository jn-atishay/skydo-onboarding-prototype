import log from "./logger";
import { create, zustandDevtools } from "./index";
import { Currency } from "../components/InternationalAccountsComp/CurrencyListPopup";
import beCall, { fetchData } from "../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { ApiFuncParams, SgAccountAckStatus, SgAccountStatus, VirtualAccountDetail } from "../types";
import { AddCustomerFeedbackMutation, exporterLogoAndDescriptionQuery } from "../util/queries";
import { capitalizeWords } from "../util/formatters";
import {
  AccountRole,
  BankUsageType,
  LOCATION_CODE,
  VIRTUAL_ACCOUNT_VENDOR,
} from "../constants/dashboardConstants";
import { TOAST_TYPES } from "../constants/atomicConstants";
import Locale from "../util/locale/en";
import useToastMessages from "./toastMessages";
import { SHARE_DETAILS_STATE } from "../constants/publicBankAccountCardConstants";
import JSHelpers from "../components/AtomicComponents/JSHelpers";
import useExporterAndExporterUserStore from "./useExporterAndExporterUserStore";
import { isNicheLocation } from "../util/functions";

// Niche currencies are received on the shared ROW/SWIFT account. Normalising here keeps the preview, copy,
// link and email share paths on the one. location whose field layouts and bank details actually exist.
const toShareableLocation = (location?: string) =>
  !location ? LOCATION_CODE.USA : isNicheLocation(location) ? LOCATION_CODE.ROW : location;

const latestAccountProviderForCurrency: Record<string, string> = {
  USD: VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD,
  CAD: VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD,
  ROW: VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD,
  GBP: VIRTUAL_ACCOUNT_VENDOR.BANKING_CIRCLE,
  EUR: VIRTUAL_ACCOUNT_VENDOR.BANKING_CIRCLE,
  AUD: VIRTUAL_ACCOUNT_VENDOR.BANKING_CIRCLE,
  SGD: VIRTUAL_ACCOUNT_VENDOR.DBS_SG,
  AED: VIRTUAL_ACCOUNT_VENDOR.GLOMO_PAY,
};

const latestAccountProviderForBalanceAccount: Record<string, string> = {
  USD: VIRTUAL_ACCOUNT_VENDOR.CALIZA,
};

const oldAccountProviderForCurrency: Record<string, string> = {
  GBP: VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD,
  EUR: VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD,
};

/** When a virtual account is tagged PRIMARY by backend, that account's provider
 *  overrides the legacy default for its currency (e.g., USD → CALIZA for MCG). */
const getPrimaryProviderOverrides = (
  virtualAccounts: VirtualAccountDetail[]
): Record<string, string> => {
  const overrides: Record<string, string> = {};
  virtualAccounts.forEach((va) => {
    if (va.accountRole === AccountRole.PRIMARY && va.currency && va.accountProvider) {
      overrides[va.currency] = va.accountProvider;
    }
  });
  return overrides;
};

interface SendFeedbackReq extends ApiFuncParams {
  questionType: string;
  answer: string;
}

type sendFeedbackFunc = (req: SendFeedbackReq) => void;

export enum ACCOUNTS_SHARE_TYPE {
  LINK,
  EMAIL,
  COPY,
}

/** Analytics: where the balance "view account" flow was opened from */
export type BalanceAccountViewSource = "balance_header" | "empty_state_history";

export interface UaeAccountStatus {
  isInProgress?: boolean;
  isActive?: boolean;
}

interface InternationalAccountsStoreState {
  shareDetailsState: string;
  shareAccountLocation: string;
  shareBankAccountUsageType: string;
  shareType: number;
  publicLink: string;
  shareAccountClientName: string;

  currencies: {
    currencies: Currency[];
    topCurrencies: Currency[];
  };
  virtualAccounts: VirtualAccountDetail[];
  globalImageUrl: string;
  logoImageUrl: string;
  setImageUrl: any;
  businessName: string;
  isLoading: boolean;
  isAudLoading: boolean;
  suggestionPopupType: string;
  sgAccountStatus?: SgAccountStatus;
  sgAccountOperationalTime?: string;
  sgAccountAckStatus?: SgAccountAckStatus;
  isDownloadVirtualDocLoading: boolean;
  location: string;
  callRequested: boolean;
  showNewUI: boolean;
  lastViewedCurrency: string;
  lastViewedCountry: string;
  pollCount: number;
  pollingForACK2?: boolean;
  isBCVariantEnabled: boolean;
  ccGBPFundingExists: boolean;
  ccEURFundingExists: boolean;
  seenUpdatedGBPAccount: boolean;
  seenUpdatedEURAccount: boolean;
  accountProviderForCurrency: Record<string, string>;
  showAccountDetailsOnSharePopup: boolean;
  isDownloadVendorBankStatementLoading: boolean;
  uaeAccountStatus?: UaeAccountStatus;
  excludeShareType?: ACCOUNTS_SHARE_TYPE[];
  shouldPollUaeAccountStatus: boolean;
  /** Set when opening share popup from Skydo Balance; cleared after analytics */
  balanceAccountViewSource: BalanceAccountViewSource | null;
  /** Temporary flag to suspend AED account operations. Set to false to re-enable. */
  isAedAccountOperationsSuspended: boolean;
}

interface InternationalAccountsType extends InternationalAccountsStoreState {
  setShareDetailsState: (state: string) => void;
  setShareAccountLocation: (location: string) => void;
  setShareBankAccountUsageType: (accountType: string) => void;
  setShareType: (type: number) => void;
  onShareButtonClick: (
    location?: string,
    shareType?: number,
    showAccountDetailsOnSharePopup?: boolean,
    excludeShareType?: ACCOUNTS_SHARE_TYPE[],
    balanceAccountViewSource?: BalanceAccountViewSource | null
  ) => void;
  setShareAccountClientName: (clientName: string) => void;

  fetchData: (silentLoading?: boolean) => void;
  fetchExporterDataForLogo: () => void;
  fetchAudAccount: () => void;
  shareButtonClick: any;
  setSuggestionPopupType: (type: string) => void;
  sendFeedback: sendFeedbackFunc;
  setIsDownloadVirtualDocLoading: (isLoading: boolean) => void;
  setIsDownloadVendorBankStatementLoading: (isLoading: boolean) => void;

  setIsAudLoading: (isAudLoading: boolean) => void;
  setLocation: (location: string) => void;
  setLastViewedAccount: (country: string, currency: string) => void;
  setCallRequested: (callRequested: boolean) => void;
  fetchSgAccountStatus: (withoutPolling?: boolean) => void;
  setInternationalAccountPreference: (val: {
    seenUpdatedGBPAccount?: boolean;
    seenUpdatedEURAccount?: boolean;
  }) => void;
  toggleAccountProvider: (currency: string, showOldProvider: boolean) => void;
  resetAccountProviders: () => void;
  getAccountProvider: (currency: string) => string;
  setUaeAccountStatus: (status: UaeAccountStatus) => void;
  setShouldPollUaeAccountStatus: (shouldPoll: boolean) => void;
}

const useInternationalAccountsStore = create<InternationalAccountsType>()(
  zustandDevtools(
    log((set: any, get: any) => ({
      callRequested: false,
      shareDetailsState: "",
      shareAccountLocation: LOCATION_CODE.USA,
      shareType: 0,
      pollCount: 0,
      publicLink: "",
      shareAccountClientName: "",
      showNewUI: true,
      lastViewedCurrency: "",
      lastViewedCountry: "",
      isBCVariantEnabled: false,
      ccGBPFundingExists: false,
      ccEURFundingExists: false,
      seenUpdatedEURAccount: false,
      seenUpdatedGBPAccount: false,
      accountProviderForCurrency: { ...latestAccountProviderForCurrency },
      showAccountDetailsOnSharePopup: false,
      uaeAccountStatus: undefined,
      shareBankAccountUsageType: BankUsageType.COLLECTION,
      excludeShareType: [],
      shouldPollUaeAccountStatus: false,
      balanceAccountViewSource: null,
      isAedAccountOperationsSuspended: true,
      setUaeAccountStatus: (status: UaeAccountStatus) => {
        set((store: InternationalAccountsType) => ({ ...store, uaeAccountStatus: status }));
      },
      setShouldPollUaeAccountStatus: (shouldPoll: boolean) => {
        set((store: InternationalAccountsType) => ({ ...store, shouldPollUaeAccountStatus: shouldPoll }));
      },
      setInternationalAccountPreference: async (val: {
        seenUpdatedGBPAccount?: boolean;
        seenUpdatedEURAccount?: boolean;
      }) => {
        await beCall({
          path: BE_ROUTES.INTERNATIONAL_ACCOUNT_PREFERENCE,
          method: ALLOWED_METHODS.POST,
          body: val,
        });
      },
      setShareDetailsState: (state: string) => {
        set((store: InternationalAccountsType) => ({ ...store, shareDetailsState: state }));
      },
      setShareAccountLocation: (location: string) => {
        set((store: InternationalAccountsType) => ({ ...store, shareAccountLocation: toShareableLocation(location) }));
      },
      setShareType: (type: number) => {
        set((store: InternationalAccountsType) => ({ ...store, shareType: type }));
      },
      onShareButtonClick: (
        location?: string,
        shareType?: number,
        showAccountDetailsOnSharePopup?: boolean,
        excludeShareType?: ACCOUNTS_SHARE_TYPE[],
        balanceAccountViewSource?: BalanceAccountViewSource | null
      ) => {
        get().shareButtonClick((response: any) => {
          try {
            const data = response.data;
            if (!!data) {
              set((store: InternationalAccountsType) => ({
                ...store,
                publicLink: data,
                shareAccountLocation: toShareableLocation(location),
                showAccountDetailsOnSharePopup: showAccountDetailsOnSharePopup ? showAccountDetailsOnSharePopup : false,
                excludeShareType: excludeShareType ? excludeShareType : [],
                balanceAccountViewSource:
                  balanceAccountViewSource !== undefined ? balanceAccountViewSource ?? null : null,
              }));
            } else if (response.success == false) {
              throw response;
            }
            set((store: InternationalAccountsType) => ({
              ...store,
              shareType: shareType ? shareType : 1,
              shareDetailsState: SHARE_DETAILS_STATE.DEFAULT_PREVIEW_PAGE,
              excludeShareType: excludeShareType ? excludeShareType : [],
              balanceAccountViewSource:
                balanceAccountViewSource !== undefined ? balanceAccountViewSource ?? null : null,
            }));
          } catch (e) {
            useToastMessages.getState().addToast({
              type: TOAST_TYPES.ERROR,
              id: "error_public_account_url",
              body: Locale.wentWrongMessage,
            });
          }
        });
      },
      setShareAccountClientName: (clientName: string) => {
        set((store: InternationalAccountsType) => ({ ...store, shareAccountClientName: clientName }));
      },

      suggestionPopupType: "",
      isDownloadVirtualDocLoading: false,
      location: LOCATION_CODE.USA,
      currencies: {
        currencies: [],
        topCurrencies: [],
      },
      virtualAccounts: [],
      globalImageUrl: "",
      logoImageUrl: "",
      setIsDownloadVirtualDocLoading: (isLoading: boolean) => {
        set((store: InternationalAccountsType) => ({ ...store, isDownloadVirtualDocLoading: isLoading }));
      },
      setIsDownloadVendorBankStatementLoading: (isLoading: boolean) => {
        set((store: InternationalAccountsType) => ({ ...store, isDownloadVendorBankStatementLoading: isLoading }));
      },
      setIsAudLoading: (isAudLoading: boolean) => {
        set((store: InternationalAccountsType) => ({ ...store, isAudLoading: isAudLoading }));
      },
      setLocation: (location: string) => {
        set((store: InternationalAccountsType) => ({ ...store, location: location }));
      },
      setImageUrl: (url: string) => {
        set((store: InternationalAccountsType) => ({ ...store, logoImageUrl: url }));
      },
      businessName: "",
      isLoading: true,
      isNeedHelpPopupOpen: false,
      sgAccountStatus: undefined,
      sgAccountOperationalTime: "",
      sgAccountAckStatus: undefined,
      pollingForACK2: undefined,
      setSuggestionPopupType: (type: string) => {
        set((store: InternationalAccountsType) => ({ ...store, suggestionPopupType: type }));
      },
      sendFeedback: async (req: SendFeedbackReq) => {
        void fetchData({
          path: BE_ROUTES.GRAPH_QL_DASHBOARD,
          method: ALLOWED_METHODS.POST,
          body: {
            query: AddCustomerFeedbackMutation,
            operationName: "addCustomerFeedback",
            variables: {
              questionType: req.questionType,
              answer: req.answer,
            },
          },
          onSuccess: (data) => {
            if (JSHelpers.isFunction(req.onSuccess)) {
              req.onSuccess(data);
            }
            set((store: InternationalAccountsType) => ({ ...store, callRequested: true }));
          },
          onError: req.onError,
        });
      },
      fetchData: async (silentLoading: boolean = false) => {
        try {
          if (!silentLoading) {
            set((store: InternationalAccountsType) => ({ ...store, isLoading: true }));
          }

          const currencyAndVaDetailsPromise = beCall({
            url: BFF_ROUTES.FETCH_VA_DETAILS,
            method: ALLOWED_METHODS.GET,
          });

          const currencyAndVaDetails = await currencyAndVaDetailsPromise;
          // @ts-ignore
          const fetchExporterDataForLogoPromise = get().fetchExporterDataForLogo();

          await fetchExporterDataForLogoPromise;
          // @ts-ignore
          const virtualAccountDetails: any = currencyAndVaDetails?.data?.virtualAccountRes;
          // @ts-ignore
          const currencyRes = currencyAndVaDetails?.data?.currencyRes;
          // @ts-ignore
          const intAccountPreference = currencyAndVaDetails?.data?.intAccountPreference;
          const fetchedVirtualAccounts: VirtualAccountDetail[] =
            virtualAccountDetails?.data?.virtualAccountDetails?.virtualAccounts || [];
          set((store: InternationalAccountsType) => ({
            ...store,
            isLoading: false,
            currencies: currencyRes,
            virtualAccounts: fetchedVirtualAccounts,
            accountProviderForCurrency: {
              ...latestAccountProviderForCurrency,
              ...getPrimaryProviderOverrides(fetchedVirtualAccounts),
            },
            // @ts-ignore
            sgAccountStatus: currencyAndVaDetails?.data?.sgAccountStatus?.data?.status,
            // @ts-ignore
            sgAccountOperationalTime: currencyAndVaDetails?.data?.sgAccountStatus?.data?.expectedOperationalTime,
            // @ts-ignore
            sgAccountAckStatus: currencyAndVaDetails?.data?.sgAccountStatus?.data?.ackStatus,
            showNewUI: intAccountPreference?.showNewUI,
            lastViewedCurrency: intAccountPreference?.lastViewedCurrency || "",
            lastViewedCountry: intAccountPreference?.lastViewedCountry || "",
            isBCVariantEnabled: intAccountPreference?.showBCVariant || false,
            ccGBPFundingExists: intAccountPreference?.ccGBPFunding || false,
            ccEURFundingExists: intAccountPreference?.ccEURFunding || false,
            seenUpdatedEURAccount: intAccountPreference?.seenUpdatedEURAccount || false,
            seenUpdatedGBPAccount: intAccountPreference?.seenUpdatedGBPAccount || false,
            // @ts-ignore
            uaeAccountStatus: currencyAndVaDetails?.data?.uaeAccountStatus,
          }));
        } catch (e) {}
      },
      fetchSgAccountStatus: async (withoutPolling?: boolean) => {
        const sgStatusDetailsPromise = beCall({
          url: BFF_ROUTES.FETCH_SG_ACCOUNT_STATUS,
          method: ALLOWED_METHODS.GET,
        });
        const sgStatusDetails = await sgStatusDetailsPromise;
        const newPollCount = get().pollCount + 1;
        set((store: InternationalAccountsType) => ({
          ...store,
          pollCount: newPollCount,
          // @ts-ignore
          sgAccountStatus: sgStatusDetails?.data?.sgAccountStatus?.data?.status,
          // @ts-ignore
          sgAccountOperationalTime: sgStatusDetails?.data?.sgAccountStatus?.data?.expectedOperationalTime,
          // @ts-ignore
          sgAccountAckStatus: sgStatusDetails?.data?.sgAccountStatus?.data?.ackStatus,
        }));
        if (!withoutPolling) {
          // @ts-ignore
          if (sgStatusDetails?.data?.sgAccountStatus?.data?.ackStatus === SgAccountAckStatus.ACK1 && newPollCount < 6) {
            set((store: InternationalAccountsType) => ({
              ...store,
              pollingForACK2: true,
            }));
            setTimeout(() => {
              get().fetchSgAccountStatus();
            }, 10000);
          } else if (newPollCount >= 6) {
            set((store: InternationalAccountsType) => ({
              ...store,
              pollingForACK2: false,
            }));
          }
        }
      },
      fetchExporterDataForLogo: async () => {
        const onSuccessFetch = (response: any) => {
          const data = response.data;
          if (data) {
            const logoUrl = data.exporterUser.exporter.businessDescription?.logoUrl;
            const businessName = capitalizeWords(data.exporterUser.exporter.virtualAccountName);
            set((state: InternationalAccountsType) => ({
              ...state,
              globalImageUrl: logoUrl,
              logoImageUrl: logoUrl,
              businessName: businessName || "",
            }));
          }
        };

        await beCall({
          path: BE_ROUTES.GRAPH_QL,
          method: ALLOWED_METHODS.POST,
          body: {
            query: exporterLogoAndDescriptionQuery,
            variables: {},
            operationName: "fetchExporterLogoAndDescription",
          },
          onSuccess: onSuccessFetch,
        });
      },
      shareButtonClick: (onSuccess: (response: any) => void) => {
        void beCall({
          path: BE_ROUTES.PUBLIC_ACCOUNT_URL,
          method: ALLOWED_METHODS.POST,
          onSuccess: onSuccess,
        });
      },
      fetchAudAccount: async () => {
        set((store: InternationalAccountsType) => ({ ...store, isAudLoading: true }));
        const onSuccessFetch = (response: any) => {
          const data = response.data;
          if (data) {
            get().fetchData(true);
            set((store: InternationalAccountsType) => ({ ...store, isAudLoading: false }));
          } else {
            set((store: InternationalAccountsType) => ({ ...store, isAudLoading: false }));
          }
        };
        await beCall({
          path: BE_ROUTES.ACTIVATE_AUD_ACC,
          method: ALLOWED_METHODS.POST,
          onSuccess: onSuccessFetch,
        });
      },
      setLastViewedAccount: (country: string, currency: string) => {
        beCall({
          url: BFF_ROUTES.SET_LAST_VIEWED_ACCOUNT,
          method: ALLOWED_METHODS.POST,
          body: {
            country: country,
            currency: currency,
          },
        });
      },
      setCallRequested: (callRequested: boolean) => {
        set((store: InternationalAccountsType) => ({ ...store, callRequested }));
      },
      setShareBankAccountUsageType: (accountUsageType: string) => {
        set((store: InternationalAccountsType) => ({ ...store, shareBankAccountUsageType: accountUsageType }));
      },
      getAccountProvider: (currency: string) => {
        const { accountProviderForCurrency, shareBankAccountUsageType } = get();
        if (shareBankAccountUsageType === BankUsageType.BALANCE) {
          const vendor = useExporterAndExporterUserStore.getState().exporter?.skydoBalanceVendor;
          return vendor ?? VIRTUAL_ACCOUNT_VENDOR.CALIZA;
        }
        if (accountProviderForCurrency[currency]) {
          return accountProviderForCurrency[currency];
        }
        if (latestAccountProviderForCurrency[currency]) {
          return latestAccountProviderForCurrency[currency];
        }
        if (latestAccountProviderForCurrency.ROW) {
          return latestAccountProviderForCurrency.ROW;
        }
        return VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD;
      },
      toggleAccountProvider: (currency: string, showOldAccountProvider: boolean) => {
        const oldProvider = oldAccountProviderForCurrency[currency];
        const latestProvider = latestAccountProviderForCurrency[currency] || latestAccountProviderForCurrency.ROW;

        if (!oldProvider) {
          return; // No old provider to toggle to
        }

        const newProvider = showOldAccountProvider ? oldProvider : latestProvider;

        set((store: InternationalAccountsType) => ({
          ...store,
          accountProviderForCurrency: {
            ...store.accountProviderForCurrency,
            [currency]: newProvider,
          },
        }));
      },
      resetAccountProviders: () => {
        set((store: InternationalAccountsType) => ({
          ...store,
          accountProviderForCurrency: {
            ...latestAccountProviderForCurrency,
            ...getPrimaryProviderOverrides(store.virtualAccounts),
          },
        }));
      },
    }))
  )
);

export default useInternationalAccountsStore;
