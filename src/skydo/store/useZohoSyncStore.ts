import log from "./logger";
import { create, zustandDevtools } from "./index";
import Locale from "../util/locale/en";
import {
  ZOHO_BOOKS_CONSTANT,
  ZohoAuthenticateRequest,
  ZohoAuthenticateResponse,
  ZohoOrganization,
  ZohoSetOrgRequest,
  ZohoSyncIconState,
  ZohoSyncState,
} from "../types/ZohoSync";
import beCall from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import useToastMessages from "./toastMessages";
import toastMessages from "./toastMessages";
import { TOAST_TYPES } from "../constants/atomicConstants";
import useBannersStore from "./useBannersStore";

interface INRInvoiceAllowStatus {
  inrallowed: boolean;
  inrzohoInvoicesExists: boolean;
}

interface ZohoSynIconDetails {
  zohoSyncIconState: ZohoSyncIconState;
  setZohoSyncIconState: (state: ZohoSyncIconState) => void;
}

interface ZohoDisconnectDetails {
  isZohoDisconnectPopUpVisible: boolean;
  openZohoDisconnectPopUp: () => void;
  closeZohoDisconnectPopUp: () => void;
  disconnectZohoReason: string;
  setDisconnectZohoReason: () => void;
}

interface ZohoSettingsDetails {
  isZohoSettingsPopUpVisible: boolean;
  openZohoSettingsPopup: () => void;
  closeZohoSettingsPopup: () => void;
  inrAllowed: boolean | null;
  getAllowINRInvoicesStatus: () => Promise<INRInvoiceAllowStatus>;
  setAllowINRInvoicesStatus: (status: boolean, removePrevInvoices?: boolean) => void;
  isWantMoreIntegrationsPopUpVisible: boolean;
  openWantMoreIntegrationsPopup: () => void;
  closeWantMoreIntegrationsPopup: () => void;
}

interface ZohoSyncDetails {
  isPopupVisible: boolean;
  zohoPopUpState: ZohoSyncState;
  zohoOrgList: ZohoOrganization[];
  selectedOrgId: string;
  skipZohoSync: boolean;
  lastZohoSyncAt?: Date;
  zohoSyncFrequency: string;
}

interface ZohoSyncActions {
  openZohoSyncPopup: () => void;
  closeZohoSyncPopup: () => void;
  setZohoPopUpState: (state: ZohoSyncState) => void;
  setSelectedOrg: (orgId: string) => void;
  evaluateQuery: (keys: string[]) => void;
  setSkipZohoSync: (skip: boolean) => void;
}

interface ZohoApiActions {
  getGrantTokenApi: () => void;
  getAccessAndRefreshTokenApi: (request: ZohoAuthenticateRequest) => void;
  setZohoOrgApi: () => void;
  getZohoSyncStatusApi: () => void;
  syncZohoDataApi: () => void;
  setSkipZohoSyncApi: (reason: string) => void;
  disconnectZohoApi: () => void;
  getLastSyncApi: () => void;
  getSkipZohoSyncApi: () => void;
  getZohoSyncFrequencyApi: () => void;
}

interface ZohoSyncStore
  extends ZohoSyncDetails,
    ZohoSyncActions,
    ZohoApiActions,
    ZohoDisconnectDetails,
    ZohoSynIconDetails,
    ZohoSettingsDetails {}

const initialState = {
  isPopupVisible: false,
  zohoPopUpState: ZohoSyncState.LOADING,
  zohoOrgList: [],
  selectedOrgId: "",
  lastZohoSyncAt: undefined,
  zohoSyncFrequency: "10",

  skipZohoSync: true,

  isZohoDisconnectPopUpVisible: false,
  disconnectZohoReason: "",

  zohoSyncIconState: ZohoSyncIconState.IDLE,

  isZohoSettingsPopUpVisible: false,
  isWantMoreIntegrationsPopUpVisible: false,

  inrAllowed: null,
};

const useZohoSyncStore = create<ZohoSyncStore>()(
  zustandDevtools(
    log((set: any) => ({
      ...initialState,

      // UI ACTIONS
      openZohoSyncPopup: () => {
        set((store: ZohoSyncStore) => ({ ...store, isPopupVisible: true, zohoPopUpState: ZohoSyncState.LOADING }));
      },
      closeZohoSyncPopup: () => {
        set((store: ZohoSyncStore) => ({
          ...store,
          isPopupVisible: false,
        }));
      },
      setZohoPopUpState: (state: ZohoSyncState) => {
        set((store: ZohoSyncStore) => ({ ...store, zohoPopUpState: state }));
      },
      setSelectedOrg: (orgId: string) => {
        set((store: ZohoSyncStore) => ({ ...store, selectedOrgId: orgId }));
      },
      evaluateQuery: (keys: string[]) => {
        const openSyncPopUp = keys.includes(ZOHO_BOOKS_CONSTANT.OPEN_ZOHO_SYNC);
        if (openSyncPopUp) {
          set((store: ZohoSyncStore) => ({ ...store, isPopupVisible: true, zohoPopUpState: ZohoSyncState.LOADING }));
        }
      },
      setSkipZohoSync: (skip: boolean) => {
        set((store: ZohoSyncStore) => ({ ...store, skipZohoSync: skip }));
      },

      // ZOHO APIs
      getGrantTokenApi: async () => {
        const res = await beCall({
          path: BE_ROUTES.ZOHO_BOOKS.GET_ZOHO_CONNECT_URL,
          method: ALLOWED_METHODS.GET,
        });
        const isError = !res.success;
        if (isError) {
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: Locale.wentWrongMessage,
            id: "GET_ZOHO_CONNECT_URL_ERROR",
          });
        } else {
          window.open(String(res.data), "_self");
        }
      },

      getAccessAndRefreshTokenApi: async (request: ZohoAuthenticateRequest) => {
        const res = await beCall<ZohoAuthenticateResponse>({
          path: BE_ROUTES.ZOHO_BOOKS.AUTHENTICATE,
          method: ALLOWED_METHODS.POST,
          body: request,
        });
        const isError = !res.success;
        const result = res.data as ZohoAuthenticateResponse;
        const isConnected = result?.isConnected;

        if (isError || !isConnected) {
          const errorMessage =
            res?.message == "ZOHO_ORG_NOT_FOUND"
              ? "Unable to fetch Zoho Organizations. Please contact support"
              : Locale.wentWrongMessage;

          useToastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: errorMessage,
            id: "ZOHO_AUTHENTICATE_ERROR",
          });
          set((store: ZohoSyncStore) => ({ ...store, zohoPopUpState: ZohoSyncState.ERROR }));
        } else {
          const isOrgSelcted = result.isOrgSelected;
          const zohoOrgs = result.organizations;

          if (isOrgSelcted) {
            set((store: ZohoSyncStore) => ({
              ...store,
              zohoPopUpState: ZohoSyncState.CONNECTED,
              skipZohoSync: true,
            }));
            useBannersStore.getState().fetchBanners();
          } else {
            set((store: ZohoSyncStore) => ({
              ...store,
              zohoPopUpState: ZohoSyncState.CONNECTED_ORG_PENDING,
              zohoOrgList: zohoOrgs,
            }));
          }
        }
      },

      setZohoOrgApi: async () => {
        const request: ZohoSetOrgRequest = {
          zohoOrganizationId: useZohoSyncStore.getState().selectedOrgId,
        };
        const res = await beCall({
          path: BE_ROUTES.ZOHO_BOOKS.SET_PRIMARY_ORG,
          method: ALLOWED_METHODS.POST,
          body: request,
        });
        const isError = !res.success;

        if (isError) {
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: Locale.wentWrongMessage,
            id: "ZOHO_SET_PRIMARY_ORG_ERROR",
          });
          set((store: ZohoSyncStore) => ({ ...store, zohoPopUpState: ZohoSyncState.ERROR }));
        } else {
          set((store: ZohoSyncStore) => ({ ...store, zohoPopUpState: ZohoSyncState.CONNECTED, skipZohoSync: true }));
          useBannersStore.getState().fetchBanners();
        }
      },

      getZohoSyncStatusApi: async () => {
        const res = await beCall<ZohoAuthenticateResponse>({
          path: BE_ROUTES.ZOHO_BOOKS.GET_CONNECTION_STATUS,
          method: ALLOWED_METHODS.GET,
        });
        const isError = !res.success;
        if (isError) {
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: Locale.wentWrongMessage,
            id: "ZOHO_SET_PRIMARY_ORG_ERROR",
          });
        } else {
          const result = res.data as ZohoAuthenticateResponse;
          const isConnected = result.isConnected;
          const isOrgSelcted = result.isOrgSelected;
          const zohoOrgs = result.organizations;

          if (!isConnected) {
            set((store: ZohoSyncStore) => ({ ...store, zohoPopUpState: ZohoSyncState.READY_TO_CONNECT }));
          } else {
            if (!isOrgSelcted) {
              set((store: ZohoSyncStore) => ({
                ...store,
                zohoPopUpState: ZohoSyncState.CONNECTED_ORG_PENDING,
                zohoOrgList: zohoOrgs,
              }));
            } else {
              set((store: ZohoSyncStore) => ({
                ...store,
                zohoPopUpState: ZohoSyncState.CONNECTED,
              }));
            }
          }
        }
      },
      syncZohoDataApi: async () => {
        const res = await beCall({
          path: BE_ROUTES.ZOHO_BOOKS.SYNC_DATA,
          method: ALLOWED_METHODS.POST,
        });
        const isError = !res.success;
        if (isError) {
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: Locale.wentWrongMessage,
            id: "SYNC_ZOHO_ERROR",
          });
        } else {
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.SUCCESS,
            body: "Data Synced",
            id: "SYNC_ZOHO_SUCCESS",
          });
        }
      },
      setSkipZohoSyncApi: async (reason: string) => {
        const res = await beCall({
          path: BE_ROUTES.ZOHO_BOOKS.SKIP_ZOHO_SYNC,
          method: ALLOWED_METHODS.POST,
          body: {
            reason: reason,
          },
        });
        const isError = !res.success;

        if (isError) {
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: Locale.wentWrongMessage,
            id: "SET_SKIP_ZOHO_ERROR",
          });
        } else {
          useZohoSyncStore.getState().setSkipZohoSync(true);
          useBannersStore.getState().fetchBanners();
        }
      },
      disconnectZohoApi: async () => {
        const res = await beCall({
          path: BE_ROUTES.ZOHO_BOOKS.DISCONNECT,
          method: ALLOWED_METHODS.POST,
          body: {
            reason: useZohoSyncStore.getState().disconnectZohoReason,
          },
        });
        const isError = !res.success;
        if (isError) {
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: Locale.wentWrongMessage,
            id: "DISCONNECT_ZOHO_ERROR",
          });
        } else {
          useZohoSyncStore.getState().closeZohoDisconnectPopUp();
          set((store: ZohoSyncStore) => ({
            ...store,
            zohoPopUpState: ZohoSyncState.READY_TO_CONNECT,
          }));
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.SUCCESS,
            body: Locale.zohoSync.disconnectSuccessToast,
            id: "DISCONNECT_ZOHO_SUCCESS",
          });
        }
      },
      getLastSyncApi: async () => {
        const res = await beCall({
          path: BE_ROUTES.ZOHO_BOOKS.LAST_SYNC_DATE,
          method: ALLOWED_METHODS.GET,
        });
        const isError = !res.success;
        if (isError) {
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: Locale.wentWrongMessage,
            id: "GET_LAST_SYNC_ERROR",
          });
        } else if (res.data) {
          const lastSyncDate = new Date(String(res.data));
          set((store: ZohoSyncStore) => ({ ...store, lastZohoSyncAt: lastSyncDate }));
        }
      },
      getSkipZohoSyncApi: async () => {
        const res = await beCall({
          path: BE_ROUTES.ZOHO_BOOKS.GET_SKIP_ZOHO_SYNC,
          method: ALLOWED_METHODS.GET,
        });
        const isError = !res.success;
        if (isError) {
          useToastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: Locale.wentWrongMessage,
            id: "GET_SKIP_SYNC_ERROR",
          });
        } else {
          set((store: ZohoSyncStore) => ({ ...store, skipZohoSync: res.data }));
          useBannersStore.getState().fetchBanners();
        }
      },
      getZohoSyncFrequencyApi: async () => {
        const res = await beCall({
          path: BE_ROUTES.ZOHO_BOOKS.GET_ZOHO_SYNC_FREQUENCY,
          method: ALLOWED_METHODS.GET,
        });
        const isError = !res.success;
        if (!isError && res?.data) {
          set((store: ZohoSyncStore) => ({ ...store, zohoSyncFrequency: res?.data }));
        }
      },

      // DISCONNECT ZOHO ACTIONS
      openZohoDisconnectPopUp: () => {
        set((store: ZohoSyncStore) => ({ ...store, isZohoDisconnectPopUpVisible: true }));
      },
      closeZohoDisconnectPopUp: () => {
        set((store: ZohoSyncStore) => ({ ...store, isZohoDisconnectPopUpVisible: false, disconnectZohoReason: "" }));
      },
      setDisconnectZohoReason: (reason: string) => {
        set((store: ZohoSyncStore) => ({ ...store, disconnectZohoReason: reason }));
      },

      setZohoSyncIconState: (state: ZohoSyncIconState) => {
        set((store: ZohoSyncStore) => ({ ...store, zohoSyncIconState: state }));
      },

      // ZOHO SETTINGS ACTIONS
      openZohoSettingsPopup: () => {
        set((store: ZohoSyncStore) => ({ ...store, isZohoSettingsPopUpVisible: true }));
      },

      closeZohoSettingsPopup: () => {
        set((store: ZohoSyncStore) => ({ ...store, isZohoSettingsPopUpVisible: false }));
      },

      getAllowINRInvoicesStatus: async () => {
        try {
          const res = await beCall({
            path: BE_ROUTES.ZOHO_BOOKS.GET_ALLOW_INR_INVOICES,
            method: ALLOWED_METHODS.GET,
          });
          if (!res.success) {
            await Promise.reject();
          } else {
            const data = res.data as INRInvoiceAllowStatus;
            set((store: ZohoSyncStore) => ({ ...store, inrAllowed: data.inrallowed }));
            return data;
          }
        } catch (e) {
          throw e;
        }
      },

      setAllowINRInvoicesStatus: async (status: boolean, removePrevInvoices?: boolean) => {
        const res = await beCall({
          path: BE_ROUTES.ZOHO_BOOKS.SET_ALLOW_INR_INVOICES,
          method: ALLOWED_METHODS.POST,
          body: {
            allowINRInvoices: status,
            removePreviousINRInvoices: removePrevInvoices,
          },
        });
        if (!res.success) {
          toastMessages.getState().addToast({
            type: TOAST_TYPES.ERROR,
            body: Locale.wentWrongMessage,
            id: "SET_ALLOW_INR_INVOICES_ERROR",
          });
        } else {
          set((store: ZohoSyncStore) => ({ ...store, inrAllowed: status }));
          toastMessages.getState().addToast({
            type: TOAST_TYPES.SUCCESS,
            body: status ? Locale.zohoSync.allNewInvoicesSynced : Locale.zohoSync.newIntlInvoicesSynced,
            id: "SET_ALLOW_INR_INVOICES_SUCCESS",
          });
        }
      },

      openWantMoreIntegrationsPopup: () => {
        set((store: ZohoSyncStore) => ({ ...store, isWantMoreIntegrationsPopUpVisible: true }));
      },
      closeWantMoreIntegrationsPopup: () => {
        set((store: ZohoSyncStore) => ({ ...store, isWantMoreIntegrationsPopUpVisible: false }));
      },
    }))
  )
);

export default useZohoSyncStore;
