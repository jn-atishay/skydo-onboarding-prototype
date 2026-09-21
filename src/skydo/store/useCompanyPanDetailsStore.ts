import { create, zustandDevtools } from "./index";
import log from "./logger";
import { StoreApi } from "zustand";
import { debounce } from "../util/functions";
import { fetchData } from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import FetchCompanyPanDetails from "../gqlQueries/Onboarding/fetchCompanyPanDetails";
import { CIN_NOT_REQUIRED_BUSINESSES, INDIVIDUAL_BUSINESSES } from "../constants/onboarding";
import { ApiFuncParams, DocTypeDescription } from "../types";
import useUserData from "./useUserData";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { VerificationStep } from "../types/Onboarding";
import {Exporter, ExporterUserResponseDto} from "../types/Exporter/ExporterUser";
import { Analytics } from "../analytics/useAnalytics";
import {firePANSubmitEvent} from "../util/marketingEventsUtil";

interface UpdateBusinessNameReq extends ApiFuncParams {
  businessLegalName: string;
  shortname: string;
}

type UseCompanyPanDetailsStore = {
  fetchCompanyPanDetails: (analytics: Analytics, fireMarketingEvents?: boolean) => void;
  updateBusinessName: (req: UpdateBusinessNameReq) => Promise<void>;
  docTypeDescription: DocTypeDescription[];
  setPanInput: (val: boolean) => void;
  isForcePanInput: boolean;
  setDocTypeDescription: (val: DocTypeDescription[]) => void;
  isPanVerified: boolean;
  companyPanDetailsData: any;
};

const useCompanyPanDetailsStore = create<UseCompanyPanDetailsStore>()(
  zustandDevtools(
    log((set: StoreApi<UseCompanyPanDetailsStore>["setState"], get: () => UseCompanyPanDetailsStore) => ({
      docTypeDescription: [],
      isForcePanInput: false,
      isPanVerified: false,
      companyPanDetailsData: {},
      setPanInput: (val: boolean) => {
        set((store) => ({ ...store, isForcePanInput: val }));
      },
      updateBusinessName: async (req: UpdateBusinessNameReq) => {
        try {
          const response = await fetchData({
            path: BE_ROUTES.UPDATE_BUSINESS_NAME,
            method: ALLOWED_METHODS.POST,
            body: {
              businessLegalName: req.businessLegalName,
              shortname: req.shortname,
            },
          });
          if (!response.success) throw response;
          if (req.onSuccess) await req.onSuccess(response);
        } catch (e) {
          req.onError && req.onError(e);
        }
      },
      fetchCompanyPanDetails: debounce(
        async (analytics: Analytics, fireMarketingEvents?: boolean) => {
          try {
            const resp = await fetchData({
              path: BE_ROUTES.GRAPH_QL,
              method: ALLOWED_METHODS.POST,
              body: {
                query: FetchCompanyPanDetails,
                operationName: "FetchCompanyPanDetails",
                variables: {},
              },
            });
            if (resp.data) {
              const data = resp.data as {
                exporterUser: ExporterUserResponseDto;
                docTypeDescription: DocTypeDescription[];
              };
              const { businessType, verificationStatus } = data.exporterUser?.exporter || {};
              set((store) => ({ ...store, docTypeDescription: data.docTypeDescription, companyPanDetailsData: data }));
              const isPanFetched = verificationStatus?.find(
                (verificationStatus) =>
                  verificationStatus.verificationStep === VerificationStep.EXPORTER_PAN_FETCHED &&
                  verificationStatus.isVerified
              );
              if (isPanFetched) {
                const { loggedInUserEmail, phoneNumber } = useUserData.getState();
                firePANSubmitEvent(
                  data.exporterUser?.exporter as Exporter,
                  loggedInUserEmail,
                  phoneNumber,
                  analytics,
                  fireMarketingEvents
                );
                set((store) => ({ ...store, isPanVerified: true }));
                get().setPanInput(false);
                useUserData.getState().setUserDetails({ businessType });
              }
            }
          } catch (e) {}
        },
        500,
        { isLeading: true }
      ),
    }))
  )
);

export default useCompanyPanDetailsStore;
