import log from "./logger";
import { BUSSINESS_TYPES, USER_STATES } from "../constants/onboarding";
import { create, zustandDevtools } from "./index";
import { LoggedInUserDetailsApiResponseDto, UserDetailsPreKycDto } from "../types/DashboardContainer";
import { BankAccountStep, DocUploadProps, ExporterIndustry, OnboardingTag } from "../types/Onboarding";
import { StoreApi } from "zustand";
import { debounce } from "../util/functions";
import { fetchData } from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";

interface UserDetails {
  userState: string;
  userName: string;
  exporterId: string;
  isDataToReset: boolean;
  setUserState: (state: string) => void;
  resetUserData: (state: boolean) => void;
  loggedInUserEmail: string;
  setLoggedInUserEmail: (email: string) => void;
  businessType: string;
  phoneNumber: string;
  exporterIndustry?: ExporterIndustry;
  averageTransaction?: string;
  setUserDetails: (userDetails: Partial<UserDetails>) => void;
  userDetailsPreKyc?: UserDetailsPreKycDto;
  docUploadProps: DocUploadProps;
  bankAccountStep: BankAccountStep;
  setDocUploadProps: (docUploadInfo: DocUploadProps) => void;
  setBankAccountStep: (bankAccountStep: BankAccountStep) => void;
  tag: OnboardingTag;
  isTransacting: Boolean;
  offboardingType: string;
  loggedInUserDetails?: LoggedInUserDetailsApiResponseDto;
  setLoggerInUserDetails: (loggedInUserDetails: LoggedInUserDetailsApiResponseDto) => void;
  fetchLoggedInUserDetails: () => void;
  amazonExporter?: boolean;
}

const initialState = {
  userState: USER_STATES.NO_STATE,
  userName: "",
  exporterId: "",
  businessType: BUSSINESS_TYPES.PRIVATE_LIMITED_COMPANY,
  isDataToReset: false,
  loggedInUserEmail: "",
  phoneNumber: undefined,
  userDetailsPreKyc: null,
  exporterIndustry: null,
  averageTransaction: null,
  docUploadProps: {
    isSectionVisible: true,
    isDone: false,
  },
  tag: OnboardingTag.VKYC,
  isTransacting: false,
  offboardingType: "",
  loggedInUserDetails: undefined,
  amazonExporter: undefined,
};

const useUserData = create<UserDetails>()(
  zustandDevtools(
    log((set: StoreApi<UserDetails>["setState"], get: () => UserDetails) => ({
      ...initialState,
      setUserState: (state: string) => {
        set((store: UserDetails) => ({ ...store, userState: state }));
      },
      setUserDetails: (userDetails: Partial<UserDetails>) => {
        set((store: UserDetails) => ({ ...store, ...userDetails }));
      },
      resetUserData: (state: boolean) => {
        set((store: UserDetails) => ({ ...store, isDataToReset: state }));
      },
      setLoggedInUserEmail: (email: string) => {
        set((store: UserDetails) => ({ ...store, loggedInUserEmail: email }));
      },
      setDocUploadProps: (docUploadInfo: DocUploadProps) => {
        set((store: UserDetails) => ({ ...store, docUploadProps: docUploadInfo }));
      },
      setBankAccountStep: (bankAccountStep: BankAccountStep) => {
        set((store: UserDetails) => ({ ...store, bankAccountStep }));
      },
      setLoggerInUserDetails: (loggedInUserDetails: LoggedInUserDetailsApiResponseDto) => {
        set((store: UserDetails) => ({ ...store, loggedInUserDetails }));
      },
      fetchLoggedInUserDetails: debounce(
        async () => {
          try {
            const response = await fetchData<LoggedInUserDetailsApiResponseDto>({
              path: BE_ROUTES.GET_LOGGEDIN_USER_DETAILS,
              redirect: false,
            });
            if (response.success && response.data) {
              get().setUserDetails({
                loggedInUserEmail: response.data.emailAddress || "",
                userName: response.data.registeredName || response.data.fullName || "",
                exporterId: response.data.exporterId || "",
              });
              get().setLoggerInUserDetails(response.data);
            } else {
            }
          } catch (e) {}
        },
        500,
        { isLeading: true }
      ),
    }))
  )
);

export default useUserData;
