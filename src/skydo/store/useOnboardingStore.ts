import log from "./logger";
import { ApiResponseWrapper, ExporterOnboardingInfo } from "../types";
import beCall, { fetchData } from "../util/beCall";
import { create, zustandDevtools } from "./index";
import { debounce } from "../util/functions";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { Option } from "../types/atomicComponentTypes";
import JSHelpers from "../components/AtomicComponents/JSHelpers";
import { StoreApi } from "zustand";
import FetchExporterUserDetails from "../gqlQueries/Onboarding/fetchExporterUserDetails";
import { ExporterUserResponseDto } from "../types/Exporter/ExporterUser";
import { BankAccountStep, DocUploadProps } from "../types/Onboarding";
import { DOC_REQUIRED_BUSINESSES, INDUSTRY_TYPES, MIN_OTHER_INDUSTRY_DETAILS_LENGTH } from "../constants/onboarding";
import useUserData from "./useUserData";
import validateWebUrlRequest, { UrlValidationResult } from "../util/validateWebUrl";

interface OnboardingState {
  fetchOnboardingDetails: (arg0: FetchConOnboardingConfig) => void;
  exporterOnboardingInfo: any;
  errorFetchingDetails: boolean;
  fetchIndustryOptions: (
    businessDescription: any,
    successCallback: (industry: any) => void,
    industryOption: Option[]
  ) => Promise<void>;
  setSystemSelectedIndustryOption: (industryOption?: Option) => void;
  setIsIndustryLoading: (isLoading: boolean) => void;
  selectedIndustryOption?: Option;
  isIndustryLoading: boolean;
  fetchExporterUserDetails: () => void;
  lastValidatedUrl: string | null;
  lastUrlValidationResult: UrlValidationResult | null;
  validateWebUrl: (url: string) => Promise<UrlValidationResult | undefined>;
}

type FetchConOnboardingConfig = {
  exporterId: string;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
};

const useOnboardingStore = create<OnboardingState>()(
  zustandDevtools(
    log((set: StoreApi<OnboardingState>["setState"], get: () => OnboardingState) => ({
      exporterOnboardingInfo: {
        basicOnboarding: true,
        advancedOnboarding: false,
        esign: false,
        aadhaarDownload: false,
        info: {
          name: "",
          companyName: "",
          email: "",
        },
      },
      selectedIndustryOption: undefined,
      isIndustryLoading: false,
      errorFetchingDetails: false,
      lastValidatedUrl: null,
      lastUrlValidationResult: null,
      validateWebUrl: async (url: string) => {
        const { lastValidatedUrl, lastUrlValidationResult } = get();
        if (url === lastValidatedUrl && lastUrlValidationResult) {
          return lastUrlValidationResult;
        }
        const result = await validateWebUrlRequest(url);
        if (result?.isValid) {
          set((state: OnboardingState) => ({ ...state, lastValidatedUrl: url, lastUrlValidationResult: result }));
        }
        return result;
      },
      fetchOnboardingDetails: debounce(async (config: FetchConOnboardingConfig) => {
        try {
          // @ts-ignore
          const exporterOnboardingInfoApiResp: ApiResponseWrapper<ExporterOnboardingInfo> = await beCall({
            path: `/swagat/api/onboarding_info/${config.exporterId}`,
            onSuccess: config.onSuccess,
            onError: config.onError,
          });
          set((state: any) => ({
            ...state,
            exporterOnboardingInfo: { ...state.exporterOnboardingInfo, ...exporterOnboardingInfoApiResp.data },
          }));
        } catch (e) {
          set((state: any) => ({ ...state, errorFetchingDetails: true }));
        }
      }, 500),
      setSystemSelectedIndustryOption: (industryOption: Option) => {
        set((state) => ({ ...state, selectedIndustryOption: industryOption }));
      },
      setIsIndustryLoading: (isLoading: boolean) => {
        set((state) => ({ ...state, isIndustryLoading: isLoading }));
      },
      fetchIndustryOptions: debounce(
        async (businessDescription: any, successCallback: (industry: any) => void, industryOptions: Option[]) => {
          try {
            if (
              !businessDescription ||
              JSHelpers.isEmpty(String(businessDescription).trim()) ||
              businessDescription?.length < MIN_OTHER_INDUSTRY_DETAILS_LENGTH
            ) {
              get().setSystemSelectedIndustryOption(undefined);
              return;
            }
            get().setIsIndustryLoading(true);
            get().setSystemSelectedIndustryOption(undefined);
            const response = await beCall({
              path: BE_ROUTES.SUBMIT_BUSINESS_DESCRIPTION,
              method: ALLOWED_METHODS.POST,
              body: {
                businessDescription: businessDescription,
              },
            });
            if (response.success) {
              const industry = industryOptions.filter((it) => it?.value === response.data);
              get().setSystemSelectedIndustryOption(industry[0] || {});
              successCallback(industry[0]);
              get().setIsIndustryLoading(false);
            } else {
              get().setSystemSelectedIndustryOption(undefined);
              get().setIsIndustryLoading(false);
              // alert("Failed");
            }
          } catch (e) {
            get().setSystemSelectedIndustryOption(undefined);
            get().setIsIndustryLoading(false);
          }
        },
        1000
      ),
      fetchExporterUserDetails: debounce(
        async () => {
          try {
            const response = await fetchData({
              path: BE_ROUTES.GRAPH_QL,
              method: ALLOWED_METHODS.POST,
              body: {
                query: FetchExporterUserDetails,
                variables: {},
                operationName: "FetchUserState",
              },
            });
            const data = response.data as { exporterUser: ExporterUserResponseDto };
            const phoneNumber = data?.exporterUser?.phoneNumber;
            const businessType = data?.exporterUser?.exporter?.businessType;
            const exporterIndustry = data?.exporterUser?.exporter?.exporterIndustry;
            const averageTransaction = data?.exporterUser?.exporter?.businessDescription?.averageTransaction;
            const onboardingState = data?.exporterUser?.exporter?.onBoardingState;
            const bankAccountInfo = data?.exporterUser?.exporter?.bankAccount;

            const bankAccountStep = useUserData.getState().bankAccountStep;

            const getBankAccountStep = () => {
              if (data) {
                if (bankAccountStep === BankAccountStep.STEP_COMPLETED) {
                  return BankAccountStep.STEP_COMPLETED;
                }
                if (bankAccountInfo?.accountNumber && bankAccountInfo?.ifscCode) {
                  return BankAccountStep.DETAILS_FILLED;
                }
              }
              return BankAccountStep.NOT_STARTED;
            };

            const bankAccountStepDerived = getBankAccountStep();
            const selectedExporterIndustryType = data?.exporterUser?.exporter?.selectedExporterIndustry?.industryType;
            const isIecVerified = data?.exporterUser?.exporter?.exporterKyc?.iecDetails?.ieCode;
            const isIecVerificationRequired =
              (selectedExporterIndustryType === INDUSTRY_TYPES.GOODS_EXPORT ||
                selectedExporterIndustryType === INDUSTRY_TYPES.E_COMMERCE) &&
              !isIecVerified;
            const docUploadProps: DocUploadProps = {
              isSectionVisible: isIecVerificationRequired || DOC_REQUIRED_BUSINESSES.includes(businessType as string),
              isDone: false,
            };
            useUserData.getState().setUserDetails({
              businessType: businessType,
              userState: onboardingState,
              phoneNumber: phoneNumber,
              docUploadProps: docUploadProps,
              bankAccountStep: bankAccountStepDerived,
              exporterIndustry: exporterIndustry,
              averageTransaction: averageTransaction,
              amazonExporter: data?.exporterUser?.exporter?.isAmazonUser,
            });
          } catch (e) {
            set((state: OnboardingState) => ({ ...state, errorFetchingDetails: true }));
          }
        },
        500,
        { isLeading: true }
      ),
    }))
  )
);

export default useOnboardingStore;
