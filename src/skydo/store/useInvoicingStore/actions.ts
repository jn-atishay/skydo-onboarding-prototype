import { initialState, InvoicingStoreCombined } from "./index";
import { SectionType } from "../../constants/newinvoiceConstants";
import beCall, { fetchData } from "../../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../../util/beRoutes";
import { ALLOWED_METHODS, SERVICES } from "../../constants/apiConstants";
import {
  Cache,
  ChallanCountDto,
  DraftInvoiceGQLResponse,
  EInvoice,
  FinaliseInvoiceConfigDto,
  InvoiceItem,
  InvoiceNumberType,
  UpdateEInvoiceConfigDto,
} from "../../types/NewInvoiceTypes";
import useToastMessages from "../toastMessages";
import { ResponseWrapper } from "../../authentication/api/AuthApiDto";
import Router from "next/router";
import FE_ROUTES from "../../util/feRoutes";
import { createDashboardAccessForSession } from "../../authentication/PreKycDashboardManagement";
import FormData from "form-data";
import { TOAST_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import { calculateNextDateForRecurringConfig } from "../../util/recurringInvoiceHelper";
import { Analytics } from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

type ConfCustomHeader = {
  publicInvoice?: boolean;
};

type Config = {
  body?: any;
  params?: any;
  path?: string;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
  invoiceId: number;
  header: ConfCustomHeader;
  // section: SectionType;
};

export type InvoicingStoreActions = {
  getNumberOfDraftInvoices: (draft: boolean, recurringConfig: boolean) => void;
  updateOpenSection: (section: SectionType) => void;
  getNewInvoiceData: (invoiceId: number) => void;
  updateSectionData: (conf: Config) => void;
  updateUnsavedState: (section: SectionType, state: boolean) => void;
  updateFinaliseError: (errors: { [key: string]: boolean | string }) => void;
  resetInvoiceStore: () => void;
  updateEInvoiceData: (data: EInvoice) => void;

  updateInvoiceItems: (invoiceItems: InvoiceItem[]) => void;
  setIsFinalisePopupVisible: (isVisible: boolean) => void;
  setIsAutoPopulatedBankAccount: (isAutoPopulatedBankAccount: boolean) => void;
  verifyAndCreateBankDetails: (conf: Config) => void;
  finaliseInvoice: (finaliseInvoiceConfig: FinaliseInvoiceConfigDto) => Promise<ResponseWrapper<any>>;
  updateInvoice: (finaliseInvoiceConfig: FinaliseInvoiceConfigDto) => Promise<ResponseWrapper<any>>;
  updateEinvoiceQrCode: (eInvoiceConfigDto: UpdateEInvoiceConfigDto) => void;
  createProspectInvoice: (anonymousId: string) => void;
  captureLead: (onSuccess: () => void, email: string) => void;
  getUpdatedInvoiceData: (invoiceId: number) => Promise<void>;
  createDuplicateInvoice: (alphaInvoiceId?: number, draftInvoiceId?: number, analytics?: Analytics) => void;
  editInvoice: (alphaInvoiceId?: number, draftInvoiceId?: number, analytics?: Analytics, originalInvoiceNumber?: string, hasPaymentLink?: boolean) => void;
  createPaymentLink: (requestBody: any) => Promise<string | null>;
  fetchUserProcessStatus: () => Promise<void>;
  setCacheInvoiceNumberForUpdateMode: (originalInvoiceNumber: string) => void;
};

/**
 * 1. Sorts challan clients
 * 2. If update mode is on, sets invoice numbers to originalInvoiceNumber
 */
const getUpdatedCache = (cache?: Cache, isUpdateMode?: boolean, originalInvoiceNumber?: string): Cache => {
  if (cache) {
    // sort challan clients by name
    cache.challanClients =
      cache?.challanClients.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) || [];

    // sort invoice items by name
    cache.invoiceItems =
      cache?.invoiceItems.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) || [];

    // If update mode is on, set invoice numbers to originalInvoiceNumber
    if (isUpdateMode && originalInvoiceNumber) {
      cache.generatedInvoiceNumber = originalInvoiceNumber;
      if (cache.invoiceSequence) {
        cache.invoiceSequence.invoiceNumber = originalInvoiceNumber;
        cache.invoiceSequence.lastInvoiceNumber = originalInvoiceNumber;
      }
    }
  }
  return <Cache>cache;
};

const actions = (set: any, get: () => InvoicingStoreCombined) => ({
  updateInvoiceItems: (invoiceItems: InvoiceItem[]) => {
    set((s: InvoicingStoreCombined) => {
      return {
        ...s,
        invoiceItems: invoiceItems,
      };
    });
  },

  verifyAndCreateBankDetails: async (conf: Config) => {
    const response = await fetchData<{
      invoiceDetails?: DraftInvoiceGQLResponse;
      cacheDetails?: Cache;
      redirect?: boolean;
    }>({
      url: BE_ROUTES.UPDATE_PROSPECT_BANK_ACCOUNT_DETAILS,
      method: "POST",
      body: conf.body,
      params: conf.params,
      headers: {
        "x-server": SERVICES.CHALLAN,
        ...conf.header,
      },
      onSuccess: conf.onSuccess,
      onError: conf.onError,
    });
    if (response?.success) {
      if (response.data?.redirect) {
        createDashboardAccessForSession();
        void Router.push(FE_ROUTES.DRAFT_INVOICE_DETAILS.replace("[draft_id]", String(conf.invoiceId)));
        return;
      }
      set((state: InvoicingStoreCombined) => ({
        ...state,
        ...response.data?.invoiceDetails,
        isLoading: false,
        cache: response.data?.cacheDetails,
      }));
    }
  },

  resetInvoiceStore: () => {
    set((s: InvoicingStoreCombined) => ({ ...s, ...initialState }));
  },
  getNumberOfDraftInvoices: async (draft: boolean, recurringConfig: boolean) => {
    const draftInvoices: ResponseWrapper<ChallanCountDto> = await fetchData({
      url: BFF_ROUTES.GET_CHALLAN_COUNTS,
      method: "GET",
      headers: {
        "x-server": SERVICES.CHALLAN,
      },
      params: {
        draftCount: draft,
        recurringConfigCount: recurringConfig,
      },
    });
    const counts = draftInvoices.data;
    set((s: InvoicingStoreCombined) => ({
      ...s,
      ...(draft ? { numOfDraftInvoices: counts?.draftInvoiceCount } : {}),
      ...(recurringConfig ? { numberOfRecurringConfigs: counts?.recurringInvoiceConfigCount } : {}),
    }));
  },

  updateUnsavedState: (section: SectionType, state: boolean = true) => {
    const isFinaliseError = Object.keys(get().finaliseError).some((key) => get().finaliseError[key]);
    set((s: InvoicingStoreCombined) => ({
      ...s,
      unSavedStates: { ...s.unSavedStates, [section]: state },
      ...(!state ? { finaliseError: { ...s.finaliseError, [section]: false } } : {}),
      ...(state && isFinaliseError ? { finaliseError: { ...s.finaliseError, [section]: true } } : {}),
    }));
  },
  updateFinaliseError: (errors: { [key: string]: boolean | string }) => {
    set((s: InvoicingStoreCombined) => ({ ...s, finaliseError: { ...errors } }));
  },
  updateSectionData: async (conf: Config) => {
    const response = await fetchData<{
      invoiceDetails?: DraftInvoiceGQLResponse;
      cacheDetails?: Cache;
      redirect?: boolean;
    }>({
      url: BE_ROUTES.UPDATE_NEW_INVOICE,
      method: "POST",
      body: conf.body,
      params: conf.params,
      headers: {
        "x-server": SERVICES.CHALLAN,
        ...conf.header,
      },
      onError: conf.onError,
    });
    if (response?.success) {
      if (response?.data?.redirect) {
        createDashboardAccessForSession();
        await Router.push(FE_ROUTES.DRAFT_INVOICE_DETAILS.replace("[draft_id]", String(conf.invoiceId)));
        return;
      }
      set((state: InvoicingStoreCombined) => ({
        ...state,
        ...response.data?.invoiceDetails,
        isLoading: false,
        cache: getUpdatedCache(response.data?.cacheDetails),
      }));
      conf?.onSuccess?.(response);
    } else {
      conf?.onError?.(response);
    }
  },
  getUpdatedInvoiceData: async (invoiceId: number) => {
    const response = await fetchData<{
      invoiceDetails: DraftInvoiceGQLResponse;
      cacheDetails: Cache;
      countryList: string[];
      showBCVariant: boolean;
    }>({
      url: BE_ROUTES.FETCH_NEW_INVOICE_PAGE_DATA,
      params: {
        invoiceId,
      },
      headers: {
        "x-server": SERVICES.CHALLAN,
      },
    });

    if (response.data?.invoiceDetails && response.data?.cacheDetails) {
      set((state: InvoicingStoreCombined) => ({
        ...state,
        ...response.data?.invoiceDetails,
        isLoading: false,
        cache: getUpdatedCache(response.data?.cacheDetails),
        countryList: response.data?.countryList,
        isInvoiceDataLoaded: true,
        isBCVariantEnabled: response.data?.showBCVariant,
      }));
    } else {
      useToastMessages.getState().addToast({
        type: "error",
        body: "Failed to fetch invoice data, please try again later.",
        id: "fetchInvoiceData",
      });
      set((state: InvoicingStoreCombined) => ({ ...state, isLoading: false }));
    }
  },
  getNewInvoiceData: async (invoiceId: number) => {
    set((state: InvoicingStoreCombined) => ({ ...state, isLoading: true }));
    await get().getUpdatedInvoiceData(invoiceId);
  },

  updateOpenSection: (section: SectionType) =>
    set((state: InvoicingStoreCombined) => ({ ...state, openSection: section })),

  updateEInvoiceData: (data: any) => set((state: InvoicingStoreCombined) => ({ ...state, eInvoice: { ...data } })),

  setIsFinalisePopupVisible: (isVisible: boolean) =>
    set((state: InvoicingStoreCombined) => ({ ...state, isFinalisePopupVisible: isVisible })),

  setIsAutoPopulatedBankAccount: (isAutoPopulatedBankAccount: boolean) =>
    set((state: InvoicingStoreCombined) => ({ ...state, isAutoPopulatedBankAccount: isAutoPopulatedBankAccount })),

  // Update cache invoice numbers for update mode
  setCacheInvoiceNumberForUpdateMode: (originalInvoiceNumber: string) => {
    set((state: InvoicingStoreCombined) => {
      if (!state.cache) return state;
      
      const updatedCache = { ...state.cache };
      updatedCache.generatedInvoiceNumber = originalInvoiceNumber;
      if (updatedCache.invoiceSequence) {
        updatedCache.invoiceSequence = {
          ...updatedCache.invoiceSequence,
          invoiceNumber: originalInvoiceNumber,
          lastInvoiceNumber: originalInvoiceNumber,
        };
      }
      
      return { ...state, cache: updatedCache };
    });
  },

  updateInvoice: async (finaliseInvoiceConfig: FinaliseInvoiceConfigDto) => {
    const { invoiceBlob, onError, id, formValues, onSuccess, paymentLinkUrl, originalInvoiceNumber, originalInvoiceId } = finaliseInvoiceConfig;
    try {
      const formData = new FormData();
      formData.append("invoiceFile", invoiceBlob);
      formData.append("invoiceId", id);
      formData.append("paymentTerms", formValues.paymentTerms);
      formData.append("invoiceDate", formValues.invoiceDate);
      formData.append("dueDate", formValues.dueDate);
      // For update mode:
      // - If AUTO mode, use the original invoice number (fixed)
      // - If MANUAL mode, use the form's manual invoice number (user can edit it)
      let invoiceNumberToSend: string;
      if (formValues.invoiceNumberType === InvoiceNumberType.AUTO) {
        invoiceNumberToSend = originalInvoiceNumber || finaliseInvoiceConfig.invoiceNumber;
      } else {
        invoiceNumberToSend = formValues.manualInvoiceNumber || originalInvoiceNumber || "";
      }
      formData.append("invoiceNumber", invoiceNumberToSend);
      // Also send the original invoice number and ID separately for backend reference
      if (originalInvoiceNumber) {
        formData.append("originalInvoiceNumber", originalInvoiceNumber);
      }
      if (originalInvoiceId) {
        formData.append("originalInvoiceId", String(originalInvoiceId));
      }

      if (paymentLinkUrl) {
        formData.append("paymentLinkUrl", paymentLinkUrl);
      }

      if (formValues.enableRecurringInvoice) {
        formData.append("enableRecurringInvoice", formValues.enableRecurringInvoice);
        formData.append("recurringFrequency", formValues.recurringFrequency);
        // First recurring invoice date
        formData.append(
          "recurringStartDate",
          calculateNextDateForRecurringConfig(formValues.recurringStartDate, "TODAY")
        );
        formData.append("startDate", new Date().toISOString()); // Date when the config was made
      }
      const finaliseResponse = await beCall({
        url: BFF_ROUTES.FILE_UPLOAD,
        path: BE_ROUTES.CHALLAN_EDIT_INVOICE,
        server: SERVICES.CHALLAN,
        method: ALLOWED_METHODS.POST,
        body: formData,
      });
      if (finaliseResponse.success) {
        return finaliseResponse;
      } else {
        throw finaliseResponse;
      }
    } catch (e: any) {
      if (e.message === "CREATE_E_INVOICE") {
        useToastMessages.getState().addToast({
          id: "finalize_error",
          type: TOAST_TYPES.ERROR,
          body: Locale.invoiceNoCharLimit,
        });
      } else if (e.message === "INVOICE_NUMBER_EXISTS") {
        useToastMessages.getState().addToast({
          id: "finalize_error_1",
          type: TOAST_TYPES.ERROR,
          body: "Invoice number already exists, please try with a different number",
        });
      } else if (e.message === "Cannot archive invoice as payment has already been received on the payment link") {
        useToastMessages.getState().addToast({
          id: "update_invoice_payment_received_error",
          type: TOAST_TYPES.ERROR,
          body: Locale.cannotEditInvoicePaymentReceived,
        });
      } else {
        useToastMessages.getState().addToast({
          id: "finalize_error_2",
          type: TOAST_TYPES.ERROR,
          body: Locale.wentWrongMessage,
        });
      }
      await Promise.reject(e);
    }
  },

  finaliseInvoice: async (finaliseInvoiceConfig: FinaliseInvoiceConfigDto) => {
    const { invoiceBlob, onError, id, formValues, onSuccess, paymentLinkUrl } = finaliseInvoiceConfig;
    try {
      const formData = new FormData();
      formData.append("invoiceFile", invoiceBlob);
      formData.append("invoiceId", id);
      formData.append("paymentTerms", formValues.paymentTerms);
      formData.append("invoiceDate", formValues.invoiceDate);
      formData.append("dueDate", formValues.dueDate);
      formData.append(
        "invoiceNumber",
        formValues.invoiceNumberType === InvoiceNumberType.AUTO
          ? finaliseInvoiceConfig.invoiceNumber
          : formValues.manualInvoiceNumber
      );

      if (paymentLinkUrl) {
        formData.append("paymentLinkUrl", paymentLinkUrl);
      }
      
      if (formValues.enableRecurringInvoice) {
        formData.append("enableRecurringInvoice", formValues.enableRecurringInvoice);
        formData.append("recurringFrequency", formValues.recurringFrequency);
        // First recurring invoice date
        formData.append(
          "recurringStartDate",
          calculateNextDateForRecurringConfig(formValues.recurringStartDate, "TODAY")
        );
        formData.append("startDate", new Date().toISOString()); // Date when the config was made
      }
      const finaliseResponse = await beCall({
        url: BFF_ROUTES.FILE_UPLOAD,
        path: BE_ROUTES.CHALLAN_FINALIZE_INVOICE,
        server: SERVICES.CHALLAN,
        method: ALLOWED_METHODS.POST,
        body: formData,
      });
      if (finaliseResponse.success) {
        return finaliseResponse;
      } else {
        throw finaliseResponse;
      }
    } catch (e: any) {
      if (e.message === "CREATE_E_INVOICE") {
        useToastMessages.getState().addToast({
          id: "finalize_error",
          type: TOAST_TYPES.ERROR,
          body: Locale.invoiceNoCharLimit,
        });
      } else if (e.message === "INVOICE_NUMBER_EXISTS") {
        useToastMessages.getState().addToast({
          id: "finalize_error_1",
          type: TOAST_TYPES.ERROR,
          body: "Invoice number already exists, please try with a different number",
        });
      } else {
        useToastMessages.getState().addToast({
          id: "finalize_error_2",
          type: TOAST_TYPES.ERROR,
          body: Locale.wentWrongMessage,
        });
      }
      await Promise.reject(e);
    }
  },
  updateEinvoiceQrCode: (eInvoiceConfigDto: UpdateEInvoiceConfigDto) => {
    const { invoiceBlob, id, onError, onSuccess } = eInvoiceConfigDto;
    const formData = new FormData();
    formData.append("invoiceFile", invoiceBlob);
    formData.append("invoiceId", id);
    void beCall({
      url: BFF_ROUTES.FILE_UPLOAD,
      path: BE_ROUTES.UPDATE_E_INVOICE,
      server: SERVICES.CHALLAN,
      method: ALLOWED_METHODS.POST,
      body: formData,
      onSuccess: onSuccess,
      onError: onError,
    });
  },
  createProspectInvoice: async (anonymousId: string) => {
    const response = await beCall({
      method: ALLOWED_METHODS.POST,
      url: BFF_ROUTES.CREATE_PROSPECT_INVOICE,
      body: {
        anonymousId: anonymousId,
      },
    });
    if (response.success) {
      Router.replace({
        pathname: FE_ROUTES.TRIAL_INVOICE_CREATION_DETAILS.replace("[draft_id]", String(response.data)),
        query: {
          ...Router.query,
        },
      });
    } else {
      throw "FAILED";
    }
  },
  captureLead: (onSuccess: () => void, email: string) => {
    void beCall({
      url: BFF_ROUTES.CAPTURE_INVOICE_LEAD,
      method: ALLOWED_METHODS.POST,
      body: {
        email: email,
      },
      onSuccess: onSuccess,
    });
  },
  createDuplicateInvoice: async (alphaInvoiceId?: number, draftInvoiceId?: number, analytics?: Analytics) => {
    try {
      const response = await beCall({
        server: SERVICES.CHALLAN,
        path: BE_ROUTES.CREATE_DUPLICATE_INVOICE,
        method: ALLOWED_METHODS.POST,
        body: {
          draftInvoiceId: draftInvoiceId,
          alphaInvoiceId: alphaInvoiceId,
        },
      });
      if (response.success) {
        const draftInvoiceId = response.data;
        // move to invoices -> id
        await Router.push(FE_ROUTES.DRAFT_INVOICE_DETAILS.replace("[draft_id]", String(draftInvoiceId)));
        useToastMessages.getState().addToast({
          id: "duplicate_invoice_creation_success",
          body: Locale.duplicateInvoiceCreationSuccess,
          type: TOAST_TYPES.SUCCESS,
        });
      } else if (!response.success && response.message === "CHALLAN_INVOICE_NOT_FOUND") {
        useToastMessages.getState().addToast({
          id: "duplicate_invoice_creation_failed",
          body: Locale.invoiceDuplicateError,
          type: TOAST_TYPES.INFO,
        });
        analytics?.trackAsync(Events.NON_SKYDO_INVOICE_DUPLICATION_REQUEST);
        return;
      } else {
        useToastMessages.getState().addToast({
          id: "invoice_delete_error",
          body: Locale.wentWrongMessage,
          type: TOAST_TYPES.ERROR,
        });
        throw response;
      }
    } catch (e: any) {
      useToastMessages.getState().addToast({
        id: "invoice_delete_error",
        body: Locale.wentWrongMessage,
        type: TOAST_TYPES.ERROR,
      });
    }
  },

  editInvoice: async (alphaInvoiceId?: number, draftInvoiceId?: number, analytics?: Analytics, originalInvoiceNumber?: string, hasPaymentLink?: boolean) => {
    try {

      const response = await beCall({
        server: SERVICES.CHALLAN,
        path: BE_ROUTES.EDIT_DUPLICATE_INVOICE,
        method: ALLOWED_METHODS.POST,
        body: {
          draftInvoiceId: draftInvoiceId,
          alphaInvoiceId: alphaInvoiceId,
        },
      });
      if (response.success) {
        const draftInvoiceId = response.data;
        // move to invoices -> id with updateMode query param, original invoice number, original invoice id, and payment link status
        await Router.push({
          pathname: FE_ROUTES.DRAFT_INVOICE_DETAILS.replace("[draft_id]", String(draftInvoiceId)),
          query: { 
            updateMode: "true", 
            originalInvoiceNumber: originalInvoiceNumber || "",
            originalInvoiceId: alphaInvoiceId ? String(alphaInvoiceId) : "",
            hasPaymentLink: hasPaymentLink ? "true" : "",
          },
        });
        // No toast message for edit invoice - just navigate to draft page
      } else if (!response.success && response.message === "CHALLAN_INVOICE_NOT_FOUND") {
        useToastMessages.getState().addToast({
          id: "edit_invoice_not_skydo",
          body: Locale.invoiceEditError,
          type: TOAST_TYPES.INFO,
        });
        analytics?.trackAsync(Events.NON_SKYDO_INVOICE_EDIT_REQUEST);
        return;
      } else {
        useToastMessages.getState().addToast({
          id: "invoice_delete_error",
          body: Locale.wentWrongMessage,
          type: TOAST_TYPES.ERROR,
        });
        throw response;
      }
    } catch (e: any) {
      useToastMessages.getState().addToast({
        id: "invoice_delete_error",
        body: Locale.wentWrongMessage,
        type: TOAST_TYPES.ERROR,
      });
    }
  },
  createPaymentLink: async (requestBody: any) => {
    try {
      const response = await beCall({
        path: "/payment-link/create-payment-link",
        method: ALLOWED_METHODS.POST,
        body: requestBody,
      });
      
      if (response.success && response.data) {
        const paymentLinkData = response.data as { id: string };
        const paymentLinkUrl = `${process.env.NEXT_PUBLIC_FE_BASE_URL}/pay/${paymentLinkData.id}`;
        return paymentLinkUrl;
      } else {
        useToastMessages.getState().addToast({
          id: "payment_link_creation_error",
          type: TOAST_TYPES.ERROR,
          body: response.message || "Failed to create payment link. Please try again.",
        });
        return null;
      }
    } catch (error: any) {
      useToastMessages.getState().addToast({
        id: "payment_link_creation_error",
        type: TOAST_TYPES.ERROR,
        body: "Unable to create payment link. Please try again.",
      });
      return null;
    }
  },

  fetchUserProcessStatus: async () => {
    try {
      const response = await beCall({
        server: SERVICES.CHALLAN,
        path: BE_ROUTES.CHECK_USER_PROCESS_STATUS,
        method: ALLOWED_METHODS.GET,
      });
      
      set((s: InvoicingStoreCombined) => ({
        ...s,
        isFirstTimeUser: response.success ? !!response.data : false,
      }));
    } catch (error) {
      set((s: InvoicingStoreCombined) => ({
        ...s,
        isFirstTimeUser: false,
      }));
    }
  },
});

export default actions;
