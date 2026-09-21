import { create, zustandDevtools } from "./index";
import { StoreApi } from "zustand";
import log from "./logger";
import useReferralStore from "./useReferralStore";
import useVideoKycStore from "./useVideoKycStore";
import beCall, { fetchData } from "../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../util/beRoutes";
import { DashboardDataResponseDto } from "../types/DashboardContainer";
import useUserData from "./useUserData";
import { USER_STATES } from "../constants/onboarding";
import useExporterAndExporterUserStore from "./useExporterAndExporterUserStore";
import { OnboardingTag } from "../types/Onboarding";
import {
  debouncePromise,
  getGstDetails,
  isDashboardAccessible,
  isManualCheckPending,
  isUserKYCed,
} from "../util/functions";
import FE_ROUTES from "../util/feRoutes";
import Router from "next/router";
import useFundingStore from "./useFundingStore";
import { EInvoiceCredentials } from "../types/NewInvoiceTypes";
import * as Sentry from "@sentry/nextjs";
import { Analytics } from "../analytics/useAnalytics";
import { PurposeCodeDetails } from "../types";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { ResponseWrapper } from "../authentication/api/AuthApiDto";
import Locale from "../util/locale/en";
import useToastMessages from "./toastMessages";
import { TOAST_TYPES } from "../constants/atomicConstants";
import usePaymentLinkStore from "./usePaymentLinkStore";
import useDashboardVersionStore from "./useDashboardVersionStore";
import useEbrcStore from "./useEbrcStore";
import { EligibleEbrcPurposeCodes } from "../constants/ebrcConstants";
import usePurposeCodeList from "./usePurposeCodeList";
import { DashboardVersionType } from "../types/DashboardVersionTypes";
import usePhaseReleaseEligibleStore from "./usePhaseReleaseEligibleStore";
import { checkUaeBannerStatus } from "../BFFServices/UaeAedPricingService/UaeAedPricingService";

type DashboardContainerStore = {
  isDashboardContainerLoading: boolean;
  fetchDashboardData: (onSuccess?: (dashboardData: DashboardDataResponseDto) => void) => Promise<void>;
  fetchAllData: (analytics: Analytics) => Promise<void>;
  skipEInvoice: boolean;
  skipTestTransactionTutorial: boolean;
  skipPaypal: boolean;
  accountNumber: string;
  lastDashboardVisit: Date;
  achAccountNumber: string;
  purposeCodeDetails: PurposeCodeDetails;
  isMounted: boolean;
  einvoiceCredentialsList: EInvoiceCredentials[];
  primaryGst: string;
  uploadMcaDocument: (formData: FormData, redirectUrl?: string) => Promise<ResponseWrapper<boolean>>;
  eligibleForInstalinks: boolean;
  isIndustryEligibleForInstaLinks: boolean | null;
  isVeemCardsSupportedForExporter: boolean;
  setIsVeemCardsSupportedForExporter: (isEligible: boolean) => void;
  hasUaeAccountAccess: boolean;
  hasDismissedUaeBanner: boolean;
  hasDismissedMobileMappingBanner: boolean;
  skipMobileMappingBanner: () => void;
  isSkydoBalanceEnabled: boolean | null;
  skydoBalanceVendor: string | null;
};

const useDashboardContainerStore = create<DashboardContainerStore>()(
  zustandDevtools(
    log((set: StoreApi<DashboardContainerStore>["setState"], get: () => DashboardContainerStore) => ({
      isSkydoBalanceEnabled: null,
      skydoBalanceVendor: null,
      isDashboardContainerLoading: true,
      isIndustryEligibleForInstaLinks: null,
      purposeCodeDetails: {
        defaultPurposeCode: "",
      },
      hasUaeAccountAccess: false,
      hasDismissedUaeBanner: true,
      hasDismissedMobileMappingBanner: false,
      fetchDashboardData: debouncePromise(
        async (onSuccess?: (dashboardData: DashboardDataResponseDto) => void) => {
          try {
            const dashboardData = await fetchData<DashboardDataResponseDto>({
              url: BE_ROUTES.FETCH_DATA_FOR_DASHBOARD,
              method: "GET",
            });
            const dashboardDataResponse = dashboardData.data || ({} as DashboardDataResponseDto);
            onSuccess?.(dashboardDataResponse);

            get().setIsVeemCardsSupportedForExporter(dashboardDataResponse.isVeemCardSupportedForExporter);

            const exporterUser = dashboardDataResponse.exporterDataForDashboard;
            useUserData.getState().setUserDetails({
              userDetailsPreKyc: dashboardDataResponse.userDetailsPreKyc,
              isTransacting: exporterUser?.exporter?.isTransacting || false,
              userState: exporterUser?.exporter?.onBoardingState || USER_STATES.NO_STATE,
              offboardingType: exporterUser?.exporter?.offboardingType,
            });
            useVideoKycStore.getState().setInitialVkycData({
              fullName: exporterUser?.fullName,
            });
            useFundingStore.getState().setUnmappedFundings(dashboardDataResponse.unmappedFundingList || []);
            useExporterAndExporterUserStore.getState().setExporterUserDetails({
              emailAddress: exporterUser?.emailAddress,
              fullName: exporterUser?.fullName,
              registeredName: exporterUser?.registeredName,
              isSkydoInvoiceDisabled: exporterUser?.isSkydoInvoiceDisabled,
            });
            useExporterAndExporterUserStore.getState().setExporterDetails({
              settlementProductType: exporterUser?.exporter?.settlementProductType,
              onBoardingState: exporterUser?.exporter?.onBoardingState,
              businessLegalName: exporterUser?.exporter?.businessLegalName || "",
              correspondentName: exporterUser?.exporter?.correspondentName || "",
              virtualAccountName: exporterUser?.exporter?.virtualAccountName || "",
              tag: exporterUser?.exporter?.tag || OnboardingTag.VKYC,
              mcaDocStatus: exporterUser?.exporter?.mcaDocStatus,
              businessType: exporterUser?.exporter?.businessType,
              gstList: exporterUser?.exporter?.gstList || [],
              isEbrcFeatureActivated: exporterUser?.exporter?.isEbrcFeatureActivated,
              skydoBalanceVendor: exporterUser?.exporter?.skydoBalanceVendor ?? null,
              isAmazonUser: exporterUser?.exporter?.isAmazonUser ?? false,
              selectedExporterIndustry: exporterUser?.exporter?.selectedExporterIndustry,
              isUaeActivationAllowed: exporterUser?.exporter?.isUaeActivationAllowed,
            });

            useDashboardVersionStore.getState().setDashboardVersion(dashboardDataResponse.dashboardVersion);
            usePurposeCodeList
              .getState()
              .setIecAndAmazonAndHdfcBankAccount(
                !!exporterUser?.exporter?.exporterKyc?.iecDetails?.ieCode,
                !!exporterUser?.exporter?.isAmazonUser,
                !!exporterUser?.exporter?.bankAccount?.isHdfcBankAccount,
                exporterUser?.exporter?.totalUnsettledFunds || 0
              );
            const rawShippingMethod =
              exporterUser?.exporter?.exporterKyc?.shippingMethod != null
                ? typeof exporterUser.exporter.exporterKyc.shippingMethod === "string"
                  ? exporterUser.exporter.exporterKyc.shippingMethod
                  : (exporterUser.exporter.exporterKyc.shippingMethod as { shippingMethod?: string })?.shippingMethod
                : undefined;
            const normalizedShippingMethod = rawShippingMethod === "CSB5"
                ? "CSB5"
                : rawShippingMethod === "CSB4"
                  ? "CSB4"
                  : rawShippingMethod === "I_AM_NOT_SURE"
                    ? "NOT_SURE"
                    : rawShippingMethod;
            usePurposeCodeList.getState().setShippingMethod(normalizedShippingMethod);

            const defaultPurposeCode = exporterUser?.exporter?.defaultPurposeCode?.defaultCode || "";
            const isEligibleForEbrc =
              dashboardDataResponse.dashboardVersion === DashboardVersionType.AMAZON_SELLER ||
              EligibleEbrcPurposeCodes.includes(defaultPurposeCode);
            useEbrcStore.getState().setIsEligibleForEbrc(isEligibleForEbrc);
            useEbrcStore.getState().setBasicEbrcDetails(dashboardDataResponse.ebrcDetails);
            const lastDashboardVisitDateString = `${exporterUser?.lastDashboardVisit} UTC`;
            // NOTE - Why UTC Added to date string? The date string is being returned by a different GQL where we do NOT get timezone information.
            let lastDashboardVisit = new Date(lastDashboardVisitDateString);
            lastDashboardVisit = !isNaN(lastDashboardVisit.getTime()) ? lastDashboardVisit : new Date();

            const { isPrimaryExist, priamryGstNumber } = getGstDetails(exporterUser?.exporter?.gstList || []);

            set((s) => ({
              ...s,
              ...{
                skipEInvoice: exporterUser?.exporter?.userPreference?.skipEInvoice || false,
                skipTestTransactionTutorial:
                  exporterUser?.exporter?.userPreference?.skipTestTransactionTutorial || false,
                skipPaypal: exporterUser?.exporter?.userPreference?.skipPaypal || false,
                accountNumber: exporterUser?.exporter?.bankAccount?.accountNumber || "",
                lastDashboardVisit: lastDashboardVisit,
                achAccountNumber: exporterUser?.exporter?.virtualAccount?.accountNumber || "",
                purposeCodeDetails: {
                  defaultPurposeCode: defaultPurposeCode,
                },
                isMounted: true,
                einvoiceCredentialsList: exporterUser?.exporter?.einvoiceCredentialsList || [],
                ...(isPrimaryExist && priamryGstNumber ? { primaryGst: priamryGstNumber } : {}),
                isDashboardContainerLoading: false,
                hasDismissedMobileMappingBanner:
                  exporterUser?.exporter?.userPreference?.preferences?.mobileMappingBanner?.isSkipped || false,
                isSkydoBalanceEnabled: exporterUser?.exporter?.skydoBalanceVendor != null,
                skydoBalanceVendor: exporterUser?.exporter?.skydoBalanceVendor ?? null,
              },
            }));

            usePaymentLinkStore
              .getState()
              .setPaymentLinkConnectionStatus(dashboardDataResponse.paymentLinksConnectionStatus);
            if (
              exporterUser?.exporter?.onBoardingState &&
              !isDashboardAccessible(exporterUser?.exporter?.onBoardingState)
            ) {
              void Router.push(FE_ROUTES.INSTANT_ONBOARDING);
            }
          } catch (e) {}
        },
        5000,
        {
          isLeading: true,
        }
      ),

      fetchAllData: async (analytics: Analytics) => {
        try {
          useReferralStore.getState().fetchReferralTrackingData();
          useVideoKycStore.getState().refetch();
          await usePhaseReleaseEligibleStore.getState().checkExporterIndustryEligibilityForInstalinks();
          await get().fetchDashboardData();
          const onboardingState = useExporterAndExporterUserStore.getState().exporter?.onBoardingState;
          analytics.trackAsync("dashboard_load_success", {
            preKyc: !isUserKYCed(onboardingState || ""),
          });
          const isPreKYC = !(isUserKYCed(onboardingState || "") && !isManualCheckPending(onboardingState || ""));
          const { isExporterIndustryEligibleForInstalinks } = usePhaseReleaseEligibleStore.getState();
          set((s) => ({
            ...s,
            eligibleForInstalinks: isExporterIndustryEligibleForInstalinks && !isPreKYC,
            isIndustryEligibleForInstaLinks: isExporterIndustryEligibleForInstalinks,
          }));
          try {
            const bannerStatus = await checkUaeBannerStatus();
            set((s) => ({
              ...s,
              hasDismissedUaeBanner: bannerStatus.hasDismissedBanner,
            }));
          } catch (error) {
            console.error("Error fetching UAE banner status:", error);
            set((s) => ({ ...s, hasDismissedUaeBanner: false }));
          }
        } catch (error) {
          console.error("Error in fetchDashboardData", error);
          Sentry.captureException(`Unable to load Dashboard ${error}`);
          set((s) => ({ ...s, isDashboardContainerLoading: false }));
        }
      },
      setIsVeemCardsSupportedForExporter: (isEligible: boolean) => {
        set((s) => ({ ...s, isVeemCardsSupportedForExporter: isEligible }));
      },
      updateDashboardContainerStore: (state: Partial<DashboardContainerStore>) => {
        set((s) => ({ ...s, ...state }));
      },
      uploadMcaDocument: async (formData: FormData, redirectUrl?: string) => {
        const response = await fetchData<boolean>({
          url: BFF_ROUTES.FILE_UPLOAD,
          method: ALLOWED_METHODS.POST,
          path: BE_ROUTES.UPLOAD_MCA_DOCUMENT,
          body: formData,
        });
        if (!response || !response.success) {
          useToastMessages.getState().addToast({
            id: "mca-doc-upload",
            type: "error",
            body: Locale.wentWrongMessage,
          });
        } else {
          useToastMessages.getState().addToast({
            id: "mca-doc-upload",
            type: TOAST_TYPES.SUCCESS,
            body: Locale.uploadSuccessMessage,
          });
          await get().fetchDashboardData();
          void Router.push(redirectUrl || FE_ROUTES.DASHBOARD);
        }
      },
      skipMobileMappingBanner: () => {
        set((s) => ({ ...s, hasDismissedMobileMappingBanner: true }));
        try {
          beCall({
            path: BE_ROUTES.SKIP_MOBILE_MAPPING_BANNER,
            method: ALLOWED_METHODS.POST,
          });
        } catch (error) {}
      },
    }))
  )
);

export default useDashboardContainerStore;
