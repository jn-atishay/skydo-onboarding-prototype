import log from "./logger";
import { create, zustandDevtools } from "./index";
import beCall from "../util/beCall";
import { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import Router from "next/router";
import FE_ROUTES from "../util/feRoutes";
import { UBO } from "../types/Onboarding";
import { BackendVKYCStatus, GenerateVKYCLinkResponse, VKYCStatus } from "../types/vkyc";
import { FE_BASE_URL } from "../config";
import useToastMessages from "./toastMessages";
import * as Sentry from "@sentry/nextjs";
import { VkycAlreadyUnderProcessError } from "../types/Errors";
import { debounce } from "../util/functions";
import { StoreApi } from "zustand";

const ALREADY_IN_PROGRESS = "ALREADY_UNDER_PROCESS";

const MINUTES_FOR_POLLING = 15;
const DURATION_PER_POLL_MS = 5000;
const MAX_POLLS = Math.floor((MINUTES_FOR_POLLING * 60 * 1000) / DURATION_PER_POLL_MS);

interface VideoKycState {
  isVideoKycDone: boolean;
  vkycLink: string;
  verifStatus: VKYCStatus;
  isAadhaarExpire: boolean;
  fullName: string;
  remainingDays: number;
  uboList: UBO[];
  isLoading: boolean;
  failReason: string;
  isDropdownSectionVisible: boolean;
  selectedUboId: number | null;
  isBtnLoading: boolean;
  isAvailable: boolean;
  isSanctionAlertsAvailable: boolean;
  isScreeningComplete: boolean;
}

interface VideoKycStore extends VideoKycState {
  onVideoVerifClick: () => void;
  setInitialVkycData: (state: Partial<VideoKycStore>) => void;
  setIsDropdownSectionVisible: (state: boolean) => void;
  setSelectedUboId: (uboId: number) => void;
  refetch: (uboId?: number) => void;
  refetchForPollingStatus: (uboId?: number) => void;
  fetchVkycProfile: (profileId: string) => void;
  generateVkycLink: (isMobile: boolean, setVkycLinkString?: boolean) => void;
  fetchUbos: () => void;
  setIsLoading: (state: boolean) => void;
  setVerifStatus: (status: VKYCStatus) => void;
  showQRCode: boolean;
  setShowQRCode: (state: boolean) => void;
  refetchPollCount: number;
  updateStore: (state: Partial<VideoKycState>) => void;
  setAvailable: (state: boolean) => void;
  setIsScreeningComplete: (state: boolean) => void;
}

export const getPrimaryUbo = (uboList: UBO[]): number => {
  let primaryUboId;
  if (uboList && uboList.length > 0) {
    primaryUboId = uboList.find((ubo) => ubo.isPrimary)?.id;
    if (primaryUboId === undefined) {
      primaryUboId = uboList[0].id;
    }
  }
  if (primaryUboId === undefined) {
    // assumption: we always have at least one primary UBO for each exporter
    throw new Error("Primary UBO not found");
  }
  return primaryUboId;
};

const convertBackendStatusToVKYCStatus = (status: BackendVKYCStatus): VKYCStatus => {
  switch (status) {
    case BackendVKYCStatus.AUDITOR_APPROVED:
      return VKYCStatus.APPROVED;
    case BackendVKYCStatus.AUDITOR_REVIEW_REQUIRED:
      return VKYCStatus.PENDING;
    case BackendVKYCStatus.AUDITOR_REJECTED:
      return VKYCStatus.FAILED;
    default:
      return VKYCStatus.NOT_STARTED;
  }
};

const useVideoKycStore = create<VideoKycStore>()(
  zustandDevtools(
    log((set: StoreApi<VideoKycStore>["setState"], get: () => VideoKycStore) => ({
      fullName: "",
      isLoading: false,
      isVideoKycDone: undefined,
      remainingDays: 3,
      verifStatus: VKYCStatus.NOT_STARTED,
      failReason: "Rejected due to compliance issues",
      isAadhaarExpire: true,
      vkycLink: "",
      uboList: [],
      refetchPollCount: 0,
      showQRCode: false,
      isSanctionAlertsAvailable: false,
      isScreeningComplete: false,
      setShowQRCode: (state: boolean) => {
        set((store: VideoKycStore) => ({ ...store, showQRCode: state }));
        if (state === false) {
          set((store: VideoKycStore) => ({ ...store, refetchPollCount: 0 }));
        }
      },
      setIsLoading: (state: boolean) => {
        set((store: VideoKycStore) => ({ ...store, isLoading: state }));
      },
      setVerifStatus: (status: VKYCStatus) => {
        set((store: VideoKycStore) => ({ ...store, verifStatus: status }));
      },
      updateStore: (data: Partial<VideoKycStore>) => {
        set((store: VideoKycStore) => ({ ...store, ...data }));
      },
      setIsScreeningComplete: (state: boolean) => {
        set((store: VideoKycStore) => ({ ...store, isScreeningComplete: state }));
      },
      fetchUbos: async () => {
        set((store: VideoKycStore) => ({ ...store, isLoading: true }));
        try {
          const response: any = await beCall({
            url: BFF_ROUTES.FETCH_UBOS,
            method: ALLOWED_METHODS.POST,
          });
          let uboList = response.data.uboList;
          const exporterScreeningResults = response.data.exporterUser?.exporter?.exporterScreeningResults ?? {};
          const isSanctionAlertsAvailable = Boolean(exporterScreeningResults.isSanctionAlertsAvailable);
          const isScreeningComplete = Boolean(exporterScreeningResults.isScreeningComplete);
          
          set((store: VideoKycStore) => ({
            ...store,
            uboList: uboList,
            isSanctionAlertsAvailable,
            isScreeningComplete,
            isLoading: false,
          }));
        } catch (e: any) {
          console.log(e);
          set((store: VideoKycStore) => ({ 
            ...store, 
            uboList: [], 
            isSanctionAlertsAvailable: true,
            isScreeningComplete: true,
            isLoading: false 
          }));
        }
      },
      fetchVkycProfile: async (profileId: string) => {
        const response: any = await beCall({
          url: BFF_ROUTES.FETCH_VKYC_PROFILE,
          method: ALLOWED_METHODS.POST,
          params: { profileId: profileId },
        });
        if (response.success) {
          const vkycStatus = response.data.status;
          const vkycState = convertBackendStatusToVKYCStatus(vkycStatus as BackendVKYCStatus);
          set((store: VideoKycStore) => ({
            ...store,
            isVideoKycDone: vkycStatus === BackendVKYCStatus.AUDITOR_APPROVED,
            vkycLink: response.data.vkycLink,
            isAadhaarExpire: response.data.isExpired,
            verifStatus: vkycState,
            isLoading: false,
            remainingDays: response.data.remainingDays,
          }));
        } else {
          throw response;
        }
      },
      refetch: debounce(
        async (uboId?: number) => {
          set((store: VideoKycStore) => ({ ...store, isLoading: true }));
          try {
            const response: any = await beCall({
              url: BFF_ROUTES.FETCH_VKYC,
              method: ALLOWED_METHODS.POST,
              // only if uboId is present then send it
              body: uboId ? { uboId: uboId } : undefined,
            });
            if (response.success) {
              const vkycStatus = response.data.status;
              const vkycState = convertBackendStatusToVKYCStatus(vkycStatus as BackendVKYCStatus);
              set((store: VideoKycStore) => ({
                ...store,
                isVideoKycDone: vkycStatus === BackendVKYCStatus.AUDITOR_APPROVED,
                vkycLink: response.data.vkycLink,
                isAadhaarExpire: response.data.isExpired,
                verifStatus: vkycState,
                isLoading: false,
                remainingDays: response.data.remainingDays,
              }));
            } else {
              throw response;
            }
          } catch (e: any) {
            set((store: VideoKycStore) => ({
              ...store,
              isVideoKycDone: e.data === null,
              isLoading: false,
            }));
          }
        },
        500,
        { isLeading: true }
      ),
      refetchForPollingStatus: debounce(
        async (uboId?: number) => {
          // set((store: VideoKycStore) => ({ ...store, isLoading: true }));
          try {
            const response: any = await beCall({
              url: BFF_ROUTES.FETCH_VKYC,
              method: ALLOWED_METHODS.POST,
              // only if uboId is present then send it
              body: uboId ? { uboId: uboId } : undefined,
            });
            if (response.success) {
              const vkycStatus = response.data.status;
              const vkycState = convertBackendStatusToVKYCStatus(vkycStatus as BackendVKYCStatus);
              if (get().refetchPollCount <= MAX_POLLS) {
                console.log(get().refetchPollCount, MAX_POLLS);
                if (![VKYCStatus.PENDING, VKYCStatus.APPROVED].includes(vkycState) && get().showQRCode) {
                  setTimeout(() => {
                    get().refetchForPollingStatus(uboId);
                  }, 5000);
                  const pollCount = get().refetchPollCount + 1;
                  set((store: VideoKycStore) => ({ ...store, refetchPollCount: pollCount }));
                } else if ([VKYCStatus.PENDING, VKYCStatus.APPROVED].includes(vkycState)) {
                  await Router.push(FE_ROUTES.DASHBOARD);
                }
              }
            } else {
              throw response;
            }
          } catch (e: any) {
            set((store: VideoKycStore) => ({
              ...store,
              isVideoKycDone: e.data === null,
              isLoading: false,
            }));
          }
        },
        500,
        { isLeading: true }
      ),
      generateVkycLink: debounce(
        async (isMobile: boolean, setVkycLinkString?: boolean) => {
          set((store: VideoKycStore) => ({ ...store, isBtnLoading: true }));
          try {
            const response: any = await beCall({
              url: BFF_ROUTES.GENERATE_VKYC_LINK,
              method: ALLOWED_METHODS.POST,
              body: {
                uboId: get().selectedUboId || getPrimaryUbo(get().uboList),
              },
            });
            if (response.success === false) {
              if (response.message === ALREADY_IN_PROGRESS) {
                useToastMessages.getState().addToast({
                  id: "link-gen-failed",
                  body: "Your Video Kyc is already under process. Please wait for the approval.",
                  type: "error",
                });
                throw new VkycAlreadyUnderProcessError(
                  "Your Video Kyc is already under process. Please wait for the approval.",
                  400
                );
              }
            }
            let vkycLinkResp: GenerateVKYCLinkResponse = response.data;
            if (vkycLinkResp.vkycLink !== "" && vkycLinkResp.profileId !== "") {
              /**
               * `profileId` is very important here.
               * whenever user comes back from VKYC, we need to know which profileId to fetch
               *
               * Sample URLs:
               * case: verified
               * https://dashboard.skydo.com/vkyc?profileId=profileId=df2ec1ea-61f2-443c-a7d6-28ef1175b99d&operator_decision=verified
               *
               * case: rejected
               * https://dashboard.skydo.com/vkyc?profileId=profileId=df2ec1ea-61f2-443c-a7d6-28ef1175b99doperator_decision=rejected&operator_reason=Details+not+matching+document%2528s%2529
               *
               * for mobile: we will redirect to vkyc page
               * for web: we will redirect to home page
               */
              if (setVkycLinkString === true) {
                set((store: VideoKycStore) => ({
                  ...store,
                  vkycLink: vkycLinkResp.vkycLink,
                }));
              } else {
                window.open(
                  `${vkycLinkResp.vkycLink}&redirect_uri=${FE_BASE_URL}/home?profileId=${
                    vkycLinkResp.profileId
                  }`,
                  "_self"
                );
              }
            } else {
              throw new Error(
                `Either VKYC link or profileId not found in response. ${response} profileId: ${vkycLinkResp}`
              );
            }
          } catch (e: any) {
            if (!(e instanceof VkycAlreadyUnderProcessError)) {
              useToastMessages.getState().addToast({
                id: "link-gen-failed",
                body: "Failed to generate link, Please try again later",
                type: "error",
              });
              Sentry.captureException("vkyc_link_gen_failed", {
                level: "info",
                extra: {
                  error: e,
                },
              });
            }
          } finally {
            set((store: VideoKycStore) => ({ ...store, isBtnLoading: false }));
          }
        },
        500,
        { isLeading: true }
      ),
      onVideoVerifClick: async () => {
        await Router.push(FE_ROUTES.VKYC);
        void get().fetchUbos();
        void get().refetch();
      },
      setInitialVkycData: (state: Partial<VideoKycState>) => {
        const { fullName } = state;

        set((store: VideoKycStore) => ({
          ...store,
          fullName: fullName,
        }));
      },
      isDropdownSectionVisible: false,
      setIsDropdownSectionVisible: (state: boolean) => {
        set((store: VideoKycStore) => ({ ...store, isDropdownSectionVisible: state }));
      },
      selectedUboId: null,
      setSelectedUboId: (uboId: number) => {
        set((store: VideoKycStore) => ({ ...store, selectedUboId: uboId }));
      },
      isAvailable: true,
      setAvailable: (state: boolean) => {
        set((store: VideoKycStore) => ({ ...store, isAvailable: state }));
      },
    }))
  )
);

export default useVideoKycStore;
