import { create, zustandDevtools } from "./index";
import log from "./logger";
import { debounce } from "../util/functions";
import { ExporterUseCase, FocusedHomeState, PaymentMethod } from "../constants/focusedHomeConstants";
import { ExporterRewardEligibility } from "../types/BannerTypes";
import beCall from "../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { moveActiveStateToPaymentMethod } from "../util/focusedHomeUtl";
import { Analytics } from "../analytics/useAnalytics";
import { Events } from "../analytics/EventConstants";
import Router from "next/router";

interface FocusedHomeStore {
  focusedHomeStates: [FocusedHomeState];
  exporterReward?: ExporterRewardEligibility;
  exporterUseCase?: ExporterUseCase;
  isLoading: boolean;
  fetchFocusedHomeData: () => void;
  continueIntAccounts: (analytics: Analytics) => void;
  isInvoiceUploaded: boolean;
  isTestTransactionSettled: boolean;
  testAmount: number;
  averageTransaction?: string;
  isVkycVerifiedQueryParams?: boolean;
  isStepsVisible?: boolean;
  setIsStepsVisible: (value: boolean) => void;
  paymentMethod?: PaymentMethod;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
  submitPaymentMethod: () => void;
  submitPaymentMethodLoading: boolean;
  resetPaymentMethodState: () => void;
  isPaymentTimelineExpired: boolean;
  submitPaymentTimeline: (val: string) => void;
  isVkycInitiated: boolean;
  monthlyRevenue?: string;
  confettiShown: boolean;
  markConfettiShown: () => void;
  markReceivePaymentContinued: () => void;
  removeReceivePaymentContinued: () => void;
}

const initialState = {
  isLoading: true,
  focusedHomeStates: [],
  isVkycVerifiedQueryParams: false,
  isStepsVisible: false,
  paymentMethod: PaymentMethod.BANK_TRANSFER,
  submitPaymentMethodLoading: false,
  isPaymentTimelineExpired: true,
  isVkycInitiated: false,
  averageTransaction: "",
  monthlyRevenue: "",
  confettiShown: false,
};

const useFocusedHomeStore = create<FocusedHomeStore>()(
  zustandDevtools(
    log((set: any, get: () => FocusedHomeStore) => ({
      ...initialState,
      fetchFocusedHomeData: debounce(
        async () => {
          try {
            const response: any = await beCall({
              url: BFF_ROUTES.GET_FOCUSED_HOME_DATA,
              method: ALLOWED_METHODS.GET,
            });
            const expUseCase = response?.data?.exporterUseCase;
            const sanitizedUseCase =
              expUseCase != ExporterUseCase.DIRECTLY_WITH_CLIENTS &&
              expUseCase != ExporterUseCase.FREELANCE_PLATFORMS &&
              expUseCase != ExporterUseCase.SALARIED_EMPLOYEE
                ? ExporterUseCase.DIRECTLY_WITH_CLIENTS
                : expUseCase;
            set((store: FocusedHomeStore) => ({
              ...store,
              focusedHomeStates: response?.data?.focusedHomeStates,
              exporterReward: response?.data?.exporterReward,
              exporterUseCase: sanitizedUseCase,
              isLoading: false,
              isInvoiceUploaded: response?.data?.isInvoiceUploaded,
              isTestTransactionSettled: response?.data?.isTestTransactionSettled,
              testAmount: response?.data?.testAmount || 0.1,
              averageTransaction: response?.data?.averageTransaction,
              isVkycVerifiedQueryParams: Router?.query["operator_decision"] === "verified",
              paymentMethod: response?.data?.paymentMethod || PaymentMethod.BANK_TRANSFER,
              isPaymentTimelineExpired: response?.data?.isPaymentTimelineExpired,
              isVkycInitiated: response?.data?.isVkycInitiated,
              monthlyRevenue: response?.data?.monthlyRevenue,
              confettiShown: response?.data?.isConfettiShown,
              isStepsVisible: !response?.data?.isReceivePaymentContinueExpired,
            }));
          } catch (e) {
            set((store: FocusedHomeStore) => ({ ...store, isLoading: false }));
          }
        },
        500,
        { isLeading: true }
      ),
      continueIntAccounts: async (analytics: Analytics) => {
        try {
          analytics?.trackAsync(Events.FOCUSED_HOME.INT_CONTINUE);
          await beCall({
            path: BE_ROUTES.FOCUSED_HOME_CONTINUE_INT_ACC,
            method: ALLOWED_METHODS.POST,
          });
          get().fetchFocusedHomeData();
        } catch (e) {}
      },
      setIsStepsVisible: (value: boolean) => set((store: FocusedHomeStore) => ({ ...store, isStepsVisible: value })),
      setPaymentMethod: (paymentMethod: PaymentMethod) =>
        set((store: FocusedHomeStore) => ({ ...store, paymentMethod })),
      submitPaymentMethod: async () => {
        set((store: FocusedHomeStore) => ({ ...store, submitPaymentMethodLoading: true }));
        try {
          const res = await beCall({
            path: `${BE_ROUTES.SUBMIT_PAYMENT_METHOD_FOCUSED_HOME}?paymentMethod=${get().paymentMethod}`,
            method: ALLOWED_METHODS.POST,
          });
          if (!res.success) {
            throw res;
          }
          get().fetchFocusedHomeData();
        } catch (e) {}
        set((store: FocusedHomeStore) => ({ ...store, submitPaymentMethodLoading: false }));
      },
      resetPaymentMethodState: () => {
        set((store: FocusedHomeStore) => ({
          ...store,
          focusedHomeStates: moveActiveStateToPaymentMethod(store.focusedHomeStates),
        }));
      },
      submitPaymentTimeline: async (val: string) => {
        try {
          const res = await beCall({
            path: `${BE_ROUTES.SUBMIT_PAYMENT_TIMELINE_FOCUSED_HOME}?paymentTimeline=${val}`,
            method: ALLOWED_METHODS.POST,
          });
          if (!res.success) {
            throw res;
          }
        } catch (e) {}
      },
      markConfettiShown: async () => {
        try {
          const res = await beCall({
            path: `${BE_ROUTES.MARK_CONFETTI_SHOWN}`,
            method: ALLOWED_METHODS.POST,
          });
          if (!res.success) {
            throw res;
          }
        } catch (e) {}
      },
      markReceivePaymentContinued: async () => {
        try {
          const res = await beCall({
            path: `${BE_ROUTES.MARK_RECEIVE_PAYMENT_CONTINUED}`,
            method: ALLOWED_METHODS.POST,
          });
        } catch (e) {}
      },
      removeReceivePaymentContinued: async () => {
        try {
          const res = await beCall({
            path: `${BE_ROUTES.REMOVE_RECEIVE_PAYMENT_CONTINUED}`,
            method: ALLOWED_METHODS.POST,
          });
        } catch (e) {}
      },
    }))
  )
);

export default useFocusedHomeStore;
