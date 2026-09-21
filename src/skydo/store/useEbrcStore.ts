import { create, zustandDevtools } from "./index";
import log from "./logger";
import { StoreApi } from "zustand";
import {
  DgftConfigDetails,
  EbrcBasicDetails,
  EbrcBatchDetails,
  EbrcDto,
  EbrcListResponse,
  EligibleTransactions,
  FiraDto,
  FiraHomeResponse, FiraSBBatchDetails,
  IrmAndEligibleTransactionDto,
  IrmDto,
  IrmHdfcHomeResponse,
  PendingHdfcIrmHomeResponseDto,
  ShippingBill,
} from "../types/EbrcTypes";
import { fetchData } from "../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { ResponseWrapper } from "../authentication/api/AuthApiDto";
import useToastMessages from "./toastMessages";
import { TOAST_TYPES } from "../constants/atomicConstants";
import EbrcLocale from "../util/locale/ebrc.en";
import downloadFile from "../util/downloadFile";
import { getFileDownloadUrl } from "../util/functions";
import { DocTypes, EntityTypes } from "../constants/dashboardConstants";
import { EbrcListQuery } from "../gqlQueries/EbrcQueries/irmHdfcHomeData";

type SelectedRowsType = {
  [key: string]: boolean;
};

type IrmIdVsIrmMap = {
  [key: string]: IrmDto | IrmAndEligibleTransactionDto;
};

export type UnparsedSbVsShippingBillMap = {
  [key: string]: ShippingBill;
};

export type NonHdfcTabs = "request_irm" | "available_irm";
export type HdfcTabs = "available_irms" | "utilised_irms" | "view_all_ebrc";
export type FiraTabs = "available_firas" | "utilised_firas";

type FiraIdVsFiraMap = {
  [key: string]: FiraDto;
};

type EbrcStore = {
  isEligibleForEbrc: boolean;
  isEbrcActive: boolean;
  isHdfc: boolean;
  // Identifier to show FIRA flow instead of IRM flow for Non-HDFC users
  showFiraFlow: boolean;
  // Identifier to show first-time landing page for FIRA users
  isFiraFirstTime: boolean;
  setIsEligibleForEbrc: (isEligible: boolean) => void;
  setFiraFirstTime: (isFirstTime: boolean) => void;
  markFiraGetStarted: () => Promise<void>;
  setBasicEbrcDetails: (details: EbrcBasicDetails) => void;
  getHdfcEbrcHomeDetails: () => Promise<void>;
  pendingIrms: IrmAndEligibleTransactionDto[];
  unmappedShippingBills: ShippingBill[];
  approvalPendingEbrcBatchDetails?: EbrcBatchDetails;
  dgftConfigDetails?: DgftConfigDetails;
  importPastIrmNumber: () => Promise<void>;
  requestedForPastIrmNumber: boolean;
  resendEbrcApprovalEmail: (isFiraFlow?: boolean) => Promise<void>;
  freshIrms: IrmDto[];
  pendingEligibleTransactions: EligibleTransactions[];
  getNonHdfcHomeDetails: () => Promise<void>;
  checkConnectionStatus: () => Promise<boolean>;
  selectedIrmsForMapping: SelectedRowsType;
  setSelectedIrmsForMapping: (selectedRows: SelectedRowsType) => void;
  irmIdVsIrmMap: IrmIdVsIrmMap;
  unparsedSbVsShippingBillMap: UnparsedSbVsShippingBillMap;
  setUnparsedShippingBillMap: (unmappedShippingBills: UnparsedSbVsShippingBillMap) => void;
  resetMappingState: () => void;
  setDeletedSb: (sbId: string) => void;
  setDeletedSbs: (sbIds: string[]) => void;
  setDeletedUnpSb: (unpSbId: string) => void;
  deletedSbs: string[];
  createMapping: () => Promise<boolean>;
  isMappingConfirmationPopupOpen: boolean;
  setMappingConfirmationPopupOpen: (isOpen: boolean) => void;
  downloadMappingFile: (onSuccess: (fileName: string) => void, onError: () => void, docType?: string) => Promise<void>;
  fetchAllAvailableEbrc: () => Promise<void>;
  availableEbrc: EbrcDto[];
  getEbrcActivationDetails: () => Promise<void>;
  setActiveTabForNonHdfc: (activeTab: NonHdfcTabs) => void;
  activeTabForNonHdfc: NonHdfcTabs;
  setActiveTabForHdfc: (activeTab: HdfcTabs) => void;
  activeTabForHdfc: HdfcTabs;
  // FIRA flow state
  firaList: FiraDto[];
  firaUnmappedShippingBills: ShippingBill[];
  firaApprovalPendingEbrcBatchDetails?: FiraSBBatchDetails;
  selectedFirasForMapping: SelectedRowsType;
  setSelectedFirasForMapping: (selectedRows: SelectedRowsType) => void;
  firaIdVsFiraMap: FiraIdVsFiraMap;
  getFiraHomeDetails: () => Promise<void>;
  activeTabForFira: FiraTabs;
  setActiveTabForFira: (activeTab: FiraTabs) => void;
  createFiraMapping: () => Promise<boolean>;
};

const initialState = {
  isEligibleForEbrc: false,
  isEbrcActive: false,
  isHdfc: false,
  showFiraFlow: false,
  isFiraFirstTime: false,
  pendingIrms: [],
  unmappedShippingBills: [],
  approvalPendingEbrcBatchDetails: undefined,
  dgftConfigDetails: undefined,
  requestedForPastIrmNumber: false,
  freshIrms: [],
  pendingEligibleTransactions: [],
  irmIdVsIrmMap: {},
  unparsedSbVsShippingBillMap: {},
  deletedSbs: [],
  isMappingConfirmationPopupOpen: false,
  availableEbrc: [],
  activeTabForNonHdfc: "request_irm",
  activeTabForHdfc: "available_irms",
  // FIRA flow initial state
  firaList: [],
  firaUnmappedShippingBills: [],
  firaApprovalPendingEbrcBatchDetails: undefined,
  selectedFirasForMapping: {},
  firaIdVsFiraMap: {},
  activeTabForFira: "available_firas",
};

const useEbrcStore = create<EbrcStore>()(
  zustandDevtools(
    log((set: StoreApi<EbrcStore>["setState"], get: () => EbrcStore) => ({
      ...initialState,
      setIsEligibleForEbrc: (isEligible: boolean) => {
        set((store: EbrcStore) => ({ ...store, isEligibleForEbrc: isEligible }));
      },
      setFiraFirstTime: (isFirstTime: boolean) => {
        set((store: EbrcStore) => ({ ...store, isFiraFirstTime: isFirstTime }));
      },
      markFiraGetStarted: async () => {
        await fetchData({
          path: BE_ROUTES.FIRA_GET_STARTED,
          method: ALLOWED_METHODS.POST,
        });
        set((store: EbrcStore) => ({ ...store, isFiraFirstTime: false }));
      },
      setBasicEbrcDetails: (details: EbrcBasicDetails) => {
        set((store: EbrcStore) => ({
          ...store,
          isEbrcActive: details?.isEbrcActive,
          isHdfc: details?.isHdfc,
          showFiraFlow: details?.showFiraFlow ?? store.showFiraFlow,
          isFiraFirstTime: details?.isFiraFirstTime ?? store.isFiraFirstTime,
        }));
      },
      getHdfcEbrcHomeDetails: async () => {
        const ebrcHdfcHomeData: ResponseWrapper<PendingHdfcIrmHomeResponseDto> = await fetchData({
          url: BFF_ROUTES.FETCH_IRM_HDFC_HOME,
          method: ALLOWED_METHODS.GET,
        });
        const pendingIrms = ebrcHdfcHomeData.data?.pendingIrms || [];
        const irmIdVsIrmMap = pendingIrms.reduce((acc: IrmIdVsIrmMap, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        set((store) => ({ ...store, ...ebrcHdfcHomeData.data, irmIdVsIrmMap: irmIdVsIrmMap }));
      },
      importPastIrmNumber: async () => {
        const response = await fetchData({
          url: BFF_ROUTES.REQUEST_PAST_IRM,
          method: ALLOWED_METHODS.POST,
        });
        set((store) => ({ ...store, requestedForPastIrmNumber: true }));
        useToastMessages.getState().addToast({
          id: "irm_past_success",
          type: TOAST_TYPES.SUCCESS,
          body: EbrcLocale.requestRegisteredSuccess,
        });
      },
      resendEbrcApprovalEmail: async (isFiraFlow?: boolean) => {
        const apiRoute = isFiraFlow ? BE_ROUTES.RESEND_FIRA_MAPPING_EMAIL : BE_ROUTES.RESEND_EBRC_APPROVAL_EMAIL;
        const response = await fetchData({
          path: apiRoute,
          method: ALLOWED_METHODS.POST,
        });
        useToastMessages.getState().addToast({
          id: isFiraFlow ? "fira_email_resend_success" : "irm_email_resend_success",
          type: TOAST_TYPES.SUCCESS,
          body: isFiraFlow ? EbrcLocale.emailSentSuccessfullyFira : EbrcLocale.emailSentSuccessfully,
        });
      },
      getNonHdfcHomeDetails: async () => {
        const ebrcNonHdfcHomeData: ResponseWrapper<IrmHdfcHomeResponse> = await fetchData({
          url: BFF_ROUTES.FETCH_IRM_NON_HDFC_HOME,
          method: ALLOWED_METHODS.GET,
        });
        const pendingIrms = ebrcNonHdfcHomeData.data?.fetchIrms || [];
        const irmIdVsIrmMap = pendingIrms.reduce((acc: IrmIdVsIrmMap, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        set((store) => ({ ...store, ...ebrcNonHdfcHomeData.data, irmIdVsIrmMap: irmIdVsIrmMap }));
      },
      checkConnectionStatus: async (): Promise<boolean> => {
        const connectionStatus = await fetchData({
          path: BE_ROUTES.CHECK_CONNECTION_STATUS,
          method: ALLOWED_METHODS.POST,
        });
        console.log("Connection Status", connectionStatus);
        return connectionStatus.success;
      },
      setSelectedIrmsForMapping: (selectedIrms: SelectedRowsType) => {
        set((store) => ({ ...store, selectedIrmsForMapping: selectedIrms }));
      },
      resetMappingState: () => {
        set((store) => ({
          ...store,
          unparsedSbVsShippingBillMap: {},
          deletedSbs: [],
        }));
      },
      setUnparsedShippingBillMap: (unmappedShippingBills: UnparsedSbVsShippingBillMap) => {
        set((store) => ({
          ...store,
          unparsedSbVsShippingBillMap: unmappedShippingBills,
        }));
      },
      setDeletedSb: (sbId: string) => {
        set((store) => ({
          ...store,
          deletedSbs: [...(store.deletedSbs || []), sbId],
        }));
      },
      setDeletedSbs: (sbIds: string[]) => {
        set((store) => ({
          ...store,
          deletedSbs: sbIds,
        }));
      },
      setDeletedUnpSb: (unpSbId: string) => {
        const map = get().unparsedSbVsShippingBillMap;
        const shippingBill = map[unpSbId];
        delete map[unpSbId];
        console.log("map", map);
        set((store) => ({
          ...store,
          unparsedSbVsShippingBillMap: {
            ...map,
          },
        }));
      },
      createMapping: async () => {
        const {
          selectedIrmsForMapping,
          irmIdVsIrmMap,
          unparsedSbVsShippingBillMap,
          deletedSbs,
          unmappedShippingBills,
        } = get();
        const pastSbs = unmappedShippingBills.filter((sb) => !deletedSbs.includes(sb.id)).map((sb) => sb.id);
        const unparsedSbs = Object.keys(unparsedSbVsShippingBillMap);
        const selectedIrms = Object.keys(selectedIrmsForMapping || {})?.filter((irmId) => {
          if (selectedIrmsForMapping[irmId] && irmIdVsIrmMap[irmId].irmNumber) {
            return true;
          }
        });
        const response = await fetchData({
          path: BE_ROUTES.CREATE_MAPPING,
          method: ALLOWED_METHODS.POST,
          body: {
            shippingBillIds: pastSbs,
            unparsedShippingBillIds: unparsedSbs,
            irmsIds: selectedIrms,
          },
        });
        if (response.success) {
          get().setMappingConfirmationPopupOpen(true);
        } else {
          if (response.message === "NO_SHIPPING_BILL_FOUND") {
            useToastMessages.getState().addToast({
              id: "irm_mapping_file_downloaded",
              type: TOAST_TYPES.INFO,
              body: EbrcLocale.noShippingBillsSelected,
            });
          } else {
            useToastMessages.getState().addToast({
              id: "irm_mapping_file_downloaded",
              type: TOAST_TYPES.ERROR,
              body: response.message || EbrcLocale.shippingBillUploadFailure,
            });
          }
        }
        return response.success;
      },
      setMappingConfirmationPopupOpen: (isOpen: boolean) => {
        set((store) => ({
          ...store,
          isMappingConfirmationPopupOpen: isOpen,
        }));
      },
      downloadMappingFile: async (onSuccess: (fileName: string) => void, onDownloadError: () => void, docType?: string) => {
        downloadFile({
          url: getFileDownloadUrl({ docType: docType || DocTypes.SB_MAPPING, entityType: EntityTypes.EXPORTER, entityId: 0 }),
          onDownloadError: onDownloadError,
          onDownloadComplete: onSuccess,
        });
      },
      fetchAllAvailableEbrc: async () => {
        const response = await fetchData<EbrcListResponse>({
          path: BE_ROUTES.EBRC_GRAPHQL,
          method: ALLOWED_METHODS.POST,
          body: {
            query: EbrcListQuery,
            variables: {},
          },
        });
        const allAvailableEbrc = response.data?.allAvailableEbrc || [];
        set((store) => ({ ...store, availableEbrc: allAvailableEbrc }));
      },
      getEbrcActivationDetails: async () => {
        const ebrcActivationDetails: ResponseWrapper<EbrcBasicDetails> = await fetchData({
          path: BE_ROUTES.EBRC_BASIC_DETAILS,
          method: ALLOWED_METHODS.GET,
        });
        get().setBasicEbrcDetails(ebrcActivationDetails.data as EbrcBasicDetails);
      },
      setActiveTabForNonHdfc: (activeTab: NonHdfcTabs) => {
        set((store) => ({
          ...store,
          activeTabForNonHdfc: activeTab,
        }));
      },
      setActiveTabForHdfc: (activeTab: HdfcTabs) => {
        set((store) => ({
          ...store,
          activeTabForHdfc: activeTab,
        }));
      },
      // FIRA flow actions
      setSelectedFirasForMapping: (selectedFiras: SelectedRowsType) => {
        set((store) => ({ ...store, selectedFirasForMapping: selectedFiras }));
      },
      getFiraHomeDetails: async () => {
        const firaHomeData: ResponseWrapper<FiraHomeResponse> = await fetchData({
          url: BFF_ROUTES.FETCH_FIRA_HOME,
          method: ALLOWED_METHODS.GET,
        });
        const firaList = firaHomeData.data?.firaList || [];
        console.log("firaList", firaList);
        const firaIdVsFiraMap = firaList.reduce((acc: FiraIdVsFiraMap, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        set((store) => ({
          ...store,
          firaList: firaList,
          firaUnmappedShippingBills: firaHomeData.data?.unmappedShippingBills || [],
          firaApprovalPendingEbrcBatchDetails: firaHomeData.data?.approvalPendingFiraBatchDetails,
          firaIdVsFiraMap: firaIdVsFiraMap,
        }));
      },
      setActiveTabForFira: (activeTab: FiraTabs) => {
        set((store) => ({
          ...store,
          activeTabForFira: activeTab,
        }));
      },
      createFiraMapping: async () => {
        const {
          selectedFirasForMapping,
          firaIdVsFiraMap,
          unparsedSbVsShippingBillMap,
          deletedSbs,
          firaUnmappedShippingBills,
        } = get();
        const pastSbs = firaUnmappedShippingBills.filter((sb) => !deletedSbs.includes(sb.id)).map((sb) => sb.id);
        const unparsedSbs = Object.keys(unparsedSbVsShippingBillMap);
        const selectedFiras = Object.keys(selectedFirasForMapping || {})?.filter((firaId) => {
          if (selectedFirasForMapping[firaId] && firaIdVsFiraMap[firaId]?.firaNumber) {
            return true;
          }
        });
        const response = await fetchData({
          url: BFF_ROUTES.CREATE_FIRA_MAPPING,
          method: ALLOWED_METHODS.POST,
          body: {
            shippingBillIds: pastSbs,
            unparsedShippingBillIds: unparsedSbs,
            firaIds: selectedFiras,
          },
        });
        if (response.success) {
          set((store) => ({ ...store, showFiraFlow: true }));
          get().setMappingConfirmationPopupOpen(true);
        } else {
          if (response.message === "NO_SHIPPING_BILL_FOUND") {
            useToastMessages.getState().addToast({
              id: "fira_mapping_failed",
              type: TOAST_TYPES.INFO,
              body: EbrcLocale.noShippingBillsSelected,
            });
          } else {
            useToastMessages.getState().addToast({
              id: "fira_mapping_failed",
              type: TOAST_TYPES.ERROR,
              body: response.message || EbrcLocale.shippingBillUploadFailure,
            });
          }
        }
        return response.success;
      },
    }))
  )
);

export default useEbrcStore;
