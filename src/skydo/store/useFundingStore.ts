import log from "./logger";
import { create, zustandDevtools } from "./index";
import {
  FundingData,
  FundingDetailData,
  FundingMappingResponse,
  isMasterFunding,
  MappingType,
  OpenInvoiceData,
  TransformedInvoiceDataForMappingTable,
  UnmappedPaymentData,
} from "../types/Funding";
import { debounce } from "../util/functions";
import { fetchData } from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS, SERVICES } from "../constants/apiConstants";
import { FXRateResponse, InvoiceSource } from "../types";
import toastMessages from "./toastMessages";
import { TOAST_TYPES } from "../constants/atomicConstants";
import { FETCH_DATA_FOR } from "../constants/fundingInvoiceMappingConstants";
import { FULL_MAPPING_THRESHOLD, MAPPING_TYPE } from "../constants/fundingMappingConstants";
import { REDIRECT_TO_NEXT_FUNDING_EVENT, SUB_NAV_BAR_REMOVAL_EVENT } from "../constants/customeEvents";
import Locale from "../util/locale/en";
import JSHelpers from "../components/AtomicComponents/JSHelpers";
import Router from "next/router";
import FE_ROUTES from "../util/feRoutes";
import * as Sentry from "@sentry/nextjs";
import { INVOICE_CURRENCIES_NOT_TO_BE_MAPPED } from "../constants/dashboardConstants";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const areAllFundingMappedCompletely = (fundingList: UnmappedPaymentData[]) => {
  if (!fundingList) {
    return true;
  }
  return fundingList.every((funding) => funding.amountMapped === funding.amount);
};

interface FundingStore {
  unmappedFundings: UnmappedPaymentData[];
  fundingIdVsFundingDetailsMap: { [key: string]: FundingDetailData };
  outstandingInvoices: TransformedInvoiceDataForMappingTable;
  fundingIdVsInvoicesMapped: { [key: string]: TransformedInvoiceDataForMappingTable };
  thresholdMappingValue: number;

  selectedInvoiceDataForMapping: OpenInvoiceData | undefined;
  openFundingMappingPopup: {
    open: boolean;
    fxRate: number | undefined;
    autoMap: boolean | undefined;
    showRequestInfo: boolean | undefined;
    fixedInrAmount?: number;
  };
  isFetchingFundingMappingDetails: boolean;
  openMapSuccessPopup: {
    open: boolean;
    invoiceId: number | undefined;
    showCta: boolean;
    isFundingMappedCompletely: boolean;
  };

  setSelectedInvoiceDataForMapping: (invoiceData?: OpenInvoiceData) => void;
  onMapFundingToInvoiceClick: (
    invoiceData: OpenInvoiceData,
    funding: FundingDetailData,
    onSuccess?: () => void,
    onError?: () => void,
    isMobile?: boolean,
    onMapComplete?: () => void
  ) => void;

  /**
   * this is a bit different from `onMapFundingToInvoiceClick`
   * 1. it assumes that the `invoiceData` is already selected and stored inside store as `selectedInvoiceDataForMapping`
   * 2. it will open the popup automatically
   */
  openMappingPopupAutomatically: (funding: FundingDetailData, isMobile?: boolean, onMapComplete?: () => void) => void;

  closeFundingMappingPopup: () => void;
  setFetchingFundingMappingDetailsLoading: (isLoading: boolean) => void;

  setUnmappedFundings: (list: UnmappedPaymentData[]) => void;
  fetchFundingMappingDetails: (config: FetchPageDataConfig) => void;
  mapFundingToInvoice: (
    invoiceData: OpenInvoiceData,
    funding: FundingDetailData,
    type?: MappingType,
    onSuccess?: () => void,
    onError?: () => void,
    isMobile?: boolean
  ) => void;
  closeMapSuccessPopup: () => void;
}

type FetchPageDataConfig = {
  fundingId: number | string;
  fetchDataFor?: string;
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
  redirectToNextFunding?: boolean;
  prevMappedInvoiceId?: number;
  showMapSuccessPopup?: boolean;
};

const useFundingStore = create<FundingStore>()(
  zustandDevtools(
    log((set: (arg0: (state: any) => any) => void, get: () => FundingStore) => ({
      //data vars
      unmappedFundings: [],
      fundingIdVsFundingDetailsMap: {},
      outstandingInvoices: [],
      thresholdMappingValue: FULL_MAPPING_THRESHOLD,

      //helper vars
      selectedInvoiceDataForMapping: undefined,
      isFetchingFundingMappingDetails: false,
      openFundingMappingPopup: {
        open: false,
        fxRate: undefined,
      },
      openMapSuccessPopup: {
        open: false,
        invoiceId: undefined,
        showCta: true,
        isFundingMappedCompletely: false,
      },

      //helper Functions
      closeFundingMappingPopup: () =>
        set((state) => ({
          ...state,
          openFundingMappingPopup: {
            open: false,
            fxRate: undefined,
            autoMap: undefined,
          },
        })),
      setSelectedInvoiceDataForMapping: (invoiceData?: OpenInvoiceData) => {
        set((state) => ({ ...state, selectedInvoiceDataForMapping: invoiceData }));
      },

      closeMapSuccessPopup: () => {
        set((state) => ({
          ...state,
          openMapSuccessPopup: { open: false, invoiceId: undefined, showCta: true, isFundingMappedCompletely: false },
        }));
      },

      onMapFundingToInvoiceClick: async (
        invoiceData: OpenInvoiceData,
        funding: FundingData,
        onSuccess?: () => void,
        onError?: () => void,
        isMobile?: boolean,
        onMapComplete?: () => void
      ) => {
        try {
          if (INVOICE_CURRENCIES_NOT_TO_BE_MAPPED.includes(invoiceData.currency)) {
            set((state) => ({
              ...state,
              openFundingMappingPopup: {
                open: true,
                fxRate: 1,
                autoMap: false,
              },
            }));
            onSuccess && onSuccess();
          } else if (
            funding.fixedInr &&
            invoiceData.currency === "INR" &&
            Number(invoiceData.unmappedAmount) === Number(funding.fixedInr)
          ) {
            if (funding.senderName?.toLowerCase() === invoiceData.importerName?.toLowerCase()) {
              get().mapFundingToInvoice(
                invoiceData,
                funding,
                MAPPING_TYPE.FULL,
                () => {
                  onSuccess?.();
                  onMapComplete?.();
                },
                onError,
                isMobile
              );
            } else {
              set((state) => ({
                ...state,
                openFundingMappingPopup: {
                  open: true,
                  fxRate: undefined,
                  autoMap: true,
                  fixedInrAmount: funding.fixedInr,
                },
              }));
              onSuccess && onSuccess();
            }
          } else if (
            Number(invoiceData.unmappedAmount) === Number(funding.amount - funding.amountMapped) &&
            invoiceData.currency === funding.currency &&
            funding.senderName?.toLowerCase() === invoiceData.importerName?.toLowerCase()
          ) {
            //map unmapped-payment to invoice
            get().mapFundingToInvoice(
              invoiceData,
              funding,
              MAPPING_TYPE.FULL,
              () => {
                onSuccess?.();
                onMapComplete?.();
              },
              onError,
              isMobile
            );
          } else if (invoiceData.currency === funding.currency) {
            set((state) => ({
              ...state,
              openFundingMappingPopup: {
                open: true,
                fxRate: undefined,
                autoMap: true,
              },
            }));
            onSuccess && onSuccess();
          } else if (invoiceData.currency !== funding.currency && invoiceData.amountMapped > 0) {
            toastMessages.getState().addToast({
              type: TOAST_TYPES.ERROR,
              body: `This invoice has already been mapped with a ${invoiceData.currency} payment, it cannot be mapped with a ${funding.currency} payment`,
              id: "fundingMappingError",
            });
            onError && onError();
          } else {
            const fxRateList = await fetchData<FXRateResponse[]>({
              path: BE_ROUTES.FETCH_FX_RATE_LIST,
              method: ALLOWED_METHODS.POST,
              server: SERVICES.FX,
              body: {
                currencyPairList: [
                  {
                    base: invoiceData.currency,
                    target: funding.currency,
                  },
                ],
              },
            });
            const fxRate = fxRateList?.data?.[0]?.fx_rate;
            const convertedAmount = fxRate ? fxRate * Number(invoiceData.unmappedAmount) : 0;
            if (convertedAmount === funding.amount) {
              get().mapFundingToInvoice(
                invoiceData,
                funding,
                MAPPING_TYPE.FULL,
                () => {
                  onSuccess?.();
                  onMapComplete?.();
                },
                onError,
                isMobile
              );
            } else {
              set((state) => ({
                ...state,
                openFundingMappingPopup: {
                  open: true,
                  fxRate: fxRate,
                  autoMap: true,
                },
              }));
              onSuccess && onSuccess();
            }
          }
        } catch (e) {
          onError && onError();
        }
      },

      openMappingPopupAutomatically: async (funding: FundingData, isMobile?: boolean, onMapComplete?: () => void) => {
        let invoiceData = get().selectedInvoiceDataForMapping;
        if (!invoiceData) {
          console.error("invoiceData is not selected or empty");
          Sentry.captureException("max_file_error_while_upload", {
            level: "error",
            extra: {
              error:
                "invoiceData is not selected or empty. User wont see mapping popup automatically, instead a click will be required",
            },
          });
          return;
        }
        get().onMapFundingToInvoiceClick(
          get().selectedInvoiceDataForMapping as OpenInvoiceData,
          funding,
          undefined,
          undefined,
          isMobile,
          onMapComplete
        );
      },

      setFetchingFundingMappingDetailsLoading: (value: boolean) => {
        set((state) => ({ ...state, isFetchingFundingMappingDetails: value }));
      },

      setUnmappedFundings: (list: UnmappedPaymentData[]) => {
        set((state) => ({ ...state, unmappedFundings: list }));
      },

      fetchFundingMappingDetails: debounce(
        async (config: FetchPageDataConfig) => {
          try {
            set((state) => ({ ...state, isFetchingFundingMappingDetails: true }));
            const response = await fetchData<FundingMappingResponse>({
              url: BE_ROUTES.FETCH_DATA_FOR_FUNDING_MAPPING,
              params: { fetchDataFor: config.fetchDataFor, fundingId: config.fundingId },
            });

            const isUpdateUnmappedFunding = config.fetchDataFor
              ? config.fetchDataFor.split(",").includes(FETCH_DATA_FOR.UNMAPPED_FUNDING_LIST)
              : true;

            const fundingDetails = response.data?.fundingDetails || ({} as FundingDetailData);
            const fundingIdKey = String(config.fundingId);
            const isAnimationRequired =
              fundingDetails.amount - fundingDetails.amountMapped === 0 && config.redirectToNextFunding;
            if (isAnimationRequired) {
              document.dispatchEvent(new Event(SUB_NAV_BAR_REMOVAL_EVENT.replace(":id", fundingIdKey)));
            }

            set((state) => {
              const fundingIdVsFundingDetailsMap = {
                ...state.fundingIdVsFundingDetailsMap,
                [fundingIdKey]: response.data?.fundingDetails,
              };

              const outstandingInvoices = response.data?.outstandingInvoices;
              const fundingIdVsInvoicesMapped = {
                ...state.fundingIdVsInvoicesMapped,
                [fundingIdKey]: response.data?.invoicesMappedToThisFunding,
              };

              const unmappedFundings = response.data?.unmappedFundings;
              const noUnmappedFundings =
                JSHelpers.isEmpty(unmappedFundings) || areAllFundingMappedCompletely(unmappedFundings);
              if (noUnmappedFundings && config.prevMappedInvoiceId) {
                if (config.showMapSuccessPopup) {
                  setTimeout(() => {
                    Router.push(FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", String(config.prevMappedInvoiceId)));
                  }, 2000);
                } else {
                  // redirect to previously mapped invoice id
                  Router.push(FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", String(config.prevMappedInvoiceId)));
                }
              }

              const successPopup =
                config.showMapSuccessPopup ||
                (fundingDetails.id &&
                  fundingDetails.amount !== undefined &&
                  fundingDetails.amountMapped !== undefined &&
                  fundingDetails.amount === fundingDetails.amountMapped)
                  ? {
                      open: true,
                      invoiceId: config.prevMappedInvoiceId,
                      showCta: !noUnmappedFundings,
                      isFundingMappedCompletely: fundingDetails.amountMapped === fundingDetails.amount,
                    }
                  : { open: false, invoiceId: undefined, showCta: true, isFundingMappedCompletely: false };

              return {
                ...state,
                fundingIdVsFundingDetailsMap,
                outstandingInvoices,
                fundingIdVsInvoicesMapped,
                thresholdMappingValue: response.data?.thresholdMappingValue || FULL_MAPPING_THRESHOLD,
                openMapSuccessPopup: successPopup,
              };
            });

            if (isAnimationRequired) {
              await sleep(1000);
            }

            set((state) => ({
              ...state,
              unmappedFundings: isUpdateUnmappedFunding
                ? response.data?.unmappedFundings || []
                : state.unmappedFundings,
            }));
            config.onSuccess && config.onSuccess(); //place this at the end
            if (isAnimationRequired) {
              setTimeout(() => document.dispatchEvent(new Event(REDIRECT_TO_NEXT_FUNDING_EVENT)), 800);
            }
          } catch (e) {
            config.onError && config.onError();
          } finally {
            set((state) => ({ ...state, isFetchingFundingMappingDetails: false }));
          }
        },
        500,
        { isLeading: true }
      ),

      mapFundingToInvoice: async (
        invoiceData: OpenInvoiceData,
        funding: FundingDetailData,
        type?: MappingType,
        onSuccess?: () => void,
        onError?: () => void,
        isMobile?: boolean
      ) => {
        try {
          const mappingSource = isMobile ? InvoiceSource.EXPORTER_DASHBOARD_MOBILE : InvoiceSource.EXPORTER_DASHBOARD;
          const response = await fetchData<boolean>({
            path: isMasterFunding(funding)
              ? BE_ROUTES.MAP_MASTER_FUNDING_TO_INVOICE
              : BE_ROUTES.MAP_FUNDING_TO_INVOICE,
            method: ALLOWED_METHODS.POST,
            body: isMasterFunding(funding)
              ? {
                  masterFundingId: funding.id,
                  invoiceId: invoiceData.invoiceId,
                  type: type ?? null,
                  mappingSource,
                }
              : {
                  invoiceId: invoiceData.invoiceId,
                  fundingId: funding.id,
                  type: type,
                  mappingSource,
                },
          });
          if (response.success) {
            const { fetchFundingMappingDetails, closeFundingMappingPopup } = get();
            onSuccess && onSuccess();
            fetchFundingMappingDetails({
              fundingId: funding.id,
              redirectToNextFunding: true,
              prevMappedInvoiceId: invoiceData.invoiceId,
              showMapSuccessPopup: isMobile,
            });
            if (!isMobile) {
              toastMessages.getState().addToast({
                type: TOAST_TYPES.SUCCESS,
                body: "Invoice mapped to unmapped-payment successfully",
                id: "mapFundingToInvoiceSuccess",
              });
            }
            closeFundingMappingPopup();
            get().setSelectedInvoiceDataForMapping();
          } else {
            throw new Error(response.message);
          }
        } catch (e: any) {
          onError && onError();
          if (e.message === "MANUAL_MAP_REQUIRED") {
            set((state) => ({
              ...state,
              openFundingMappingPopup: {
                open: true,
                fxRate: undefined,
                autoMap: false,
                showRequestInfo: true,
              },
            }));
            return;
          }
          let message = Locale.invoiceMappingFailure;
          let toastTime;
          if (e.message === "INVOICE_AMOUNT_LIMIT_EXCEEDED" || e.message === "TRANSACTION_AMOUNT_EXCEEDS_LIMIT") {
            message = Locale["invoiceAmountGreaterThan10KException"];
            toastTime = 10000;
          } else if (e.message === "ALREADY_MAPPED") {
            message = Locale.alreadyMappedPaymentError;
            toastTime = 10000;
          }
          toastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: message,
            id: "mapFundingToInvoiceFailure",
            time: toastTime,
          });
          get().closeFundingMappingPopup();
        }
      },
    }))
  )
);

export default useFundingStore;
