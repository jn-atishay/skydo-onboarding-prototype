import { create, zustandDevtools } from "./index";
import log from "./logger";
import { StoreApi } from "zustand";
import beCall, { fetchData } from "../util/beCall";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import BE_ROUTES from "../util/beRoutes";
import useToastMessages from "./toastMessages";
import Locale from "../util/locale/en";
import Router from "next/router";
import { fetchActiveDocuments } from "../gqlQueries/ProfileSection/KYCDocumentsQuery";
import { ActiveKycDocument, IecDetails } from "../types/Onboarding";

export type OnboardingAlert = {
  alertType:string;
  status:string;
}

type ActiveKycDocumentGraphQLResponse = {
  data:{
    exporterUser: {
      exporter: {
        exporterKyc: {
          iecDetails?: IecDetails;
        }
        case: {
          caseType: string;
          caseStatus: string;
          onboardingAlert: OnboardingAlert;
        }
        activeKycDocuments: ActiveKycDocument[];
      };
    };
  }
}

type UseProfileStore = {
  iecDetails: IecDetails | undefined;
  activeKycDocuments: ActiveKycDocument[];
  updateEmailSettings: (isEmailReductionEnabled: boolean, onResponse: () => void) => Promise<void>;
  getActiveKYCDocuments: () => ActiveKycDocument[];
  onboardingAlert: OnboardingAlert | undefined;
  isBusinessDocumentOnboardingAlertApproved: boolean;
  isCaseClosed: boolean;
};

const initProperties = {
  iecDetails: undefined,
  activeKycDocuments: [],
  onboardingAlert: undefined,
  isBusinessDocumentOnboardingAlertApproved: false,
  isCaseClosed: false
};

const useProfileStore = create<UseProfileStore>()(
  zustandDevtools(
    log((set: StoreApi<UseProfileStore>["setState"], get: () => UseProfileStore) => ({
      ...initProperties,
      updateEmailSettings: async (isEmailReductionEnabled: boolean, onResponse: () => void) => {
        try {
          const resp = await fetchData({
            method: ALLOWED_METHODS.POST,
            path: BE_ROUTES.EMAIL_NOTIFICATION_SETTINGS,
            body: {
              emailSubscriptionType: "TRANSACTION_EMAIL_REDUCTION",
              isEnabled: isEmailReductionEnabled
            }
          });
          if (resp.success) {
            onResponse();
            useToastMessages.getState().addToast({
              id: "email_settings",
              type: "success",
              body: "Email settings updated successfully",
            });
            void Router.push(Router.asPath);
          } else {
            onResponse();
            useToastMessages.getState().addToast({
              id: "email_settings",
              type: "error",
              body: Locale.wentWrongMessage,
            });
          }
        } catch (e) {
          onResponse();
          useToastMessages.getState().addToast({
            id: "email_settings",
            type: "error",
            body: Locale.wentWrongMessage,
          });
        }
      },
      getActiveKYCDocuments: async () => {
        const activeKycDocumentsResp = await beCall({
          method: ALLOWED_METHODS.POST,
          path: BE_ROUTES.GRAPH_QL,
          body: {
            query: fetchActiveDocuments,
            variables: {}
          }
        }) as ActiveKycDocumentGraphQLResponse;
        const iecDetails = activeKycDocumentsResp?.data?.exporterUser?.exporter?.exporterKyc?.iecDetails;
        const activeKYCDocuments = activeKycDocumentsResp?.data?.exporterUser?.exporter?.activeKycDocuments || [];
        const exporterCase = activeKycDocumentsResp?.data?.exporterUser?.exporter?.case;
        const onboardingAlert = activeKycDocumentsResp?.data?.exporterUser?.exporter?.case?.onboardingAlert;
        const isBusinessDocumentOnboardingAlertApproved = onboardingAlert && onboardingAlert.alertType === "BUSINESS_DOC_VERIFICATION" && onboardingAlert.status === "APPROVE";
        const isCaseClosed = exporterCase?.caseType === "EXPORTER" && ["CLOSED", "NO_ALERTS"].includes(exporterCase?.caseStatus.toString());

        set((prev) => ({
          ...prev,
          activeKycDocuments: activeKYCDocuments,
          iecDetails: iecDetails,
          isCaseClosed: isCaseClosed,
          onboardingAlert: onboardingAlert,
          isBusinessDocumentOnboardingAlertApproved: isBusinessDocumentOnboardingAlertApproved
        }));
        return activeKYCDocuments;
      },
    }))
  )
);

export default useProfileStore;
