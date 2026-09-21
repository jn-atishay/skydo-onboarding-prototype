import { create, zustandDevtools } from "./index";
import { StoreApi } from "zustand";
import log from "./logger";
import { fetchData } from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { FETCH_HAS_SUBMITTED_INSTANT_SETTLEMENT_FEEDBACK_QUERY } from "../gqlQueries/Dashboard";
import { AddCustomerFeedbackMutation } from "../util/queries";

export type AddCustomerFeedbackParams = {
  questionType: string;
  answer: string;
  onSuccess?: (data: { addCustomerFeedback?: boolean }) => void;
  onError?: () => void;
};

type CustomerFeedbackStore = {
  hasSubmittedInstantSettlementFeedback: boolean;
  isLoading: boolean;
  isSubmittingFeedback: boolean;
  fetchHasSubmittedInstantSettlementFeedback: () => Promise<void>;
  setHasSubmittedInstantSettlementFeedback: (hasSubmitted: boolean) => void;
  addCustomerFeedback: (params: AddCustomerFeedbackParams) => void;
};

type FetchExporterFeedbackStatusResponse = {
  exporter: {
    hasSubmittedInstantSettlementFeedback: boolean;
  };
};

const useCustomerFeedbackStore = create<CustomerFeedbackStore>()(
  zustandDevtools(
    log((set: StoreApi<CustomerFeedbackStore>["setState"], get: () => CustomerFeedbackStore) => ({
      hasSubmittedInstantSettlementFeedback: false,
      isLoading: false,
      isSubmittingFeedback: false,
      addCustomerFeedback: (params: AddCustomerFeedbackParams) => {
        set((s) => ({ ...s, isSubmittingFeedback: true }));
        void fetchData<{ addCustomerFeedback?: boolean }>({
          path: BE_ROUTES.GRAPH_QL_DASHBOARD,
          method: ALLOWED_METHODS.POST,
          body: {
            query: AddCustomerFeedbackMutation,
            operationName: "addCustomerFeedback",
            variables: {
              questionType: params.questionType,
              answer: params.answer,
            },
          },
          onSuccess: (data) => {
            set((s) => ({ ...s, isSubmittingFeedback: false }));
            params.onSuccess?.(data?.data ?? {});
          },
          onError: () => {
            set((s) => ({ ...s, isSubmittingFeedback: false }));
            params.onError?.();
          },
        });
      },
      fetchHasSubmittedInstantSettlementFeedback: async () => {
        set((s) => ({ ...s, isLoading: true }));
        try {
          const response = await fetchData<FetchExporterFeedbackStatusResponse>({
            path: BE_ROUTES.GRAPH_QL_DASHBOARD,
            method: ALLOWED_METHODS.POST,
            body: {
              query: FETCH_HAS_SUBMITTED_INSTANT_SETTLEMENT_FEEDBACK_QUERY,
              operationName: "FetchExporterFeedbackStatus",
              variables: {},
            },
          });

          if (response?.data?.exporter?.hasSubmittedInstantSettlementFeedback !== undefined) {
            const hasExporterSubmittedInstantSettlementFeedback = response.data.exporter.hasSubmittedInstantSettlementFeedback as boolean
            set((s) => ({
              ...s,
              hasSubmittedInstantSettlementFeedback: hasExporterSubmittedInstantSettlementFeedback,
              isLoading: false,
            }));
          } else {
            set((s) => ({ ...s, isLoading: false }));
          }
        } catch (error) {
          console.error("Error fetching instant settlement feedback status:", error);
          set((s) => ({ ...s, isLoading: false }));
        }
      },
      setHasSubmittedInstantSettlementFeedback: (hasSubmitted: boolean) => {
        set((s) => ({ ...s, hasSubmittedInstantSettlementFeedback: hasSubmitted }));
      },
    }))
  )
);

export default useCustomerFeedbackStore;