import { ALLOWED_METHODS } from "../constants/apiConstants";
import beCall from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { create, zustandDevtools } from "./index";
import log from "./logger";
import { StoreApi } from "zustand";

interface PhaseReleaseEligibilityResponse {
  eligible: boolean;
}

interface PhaseReleaseEligibleStore {
  isExporterEligibleForVeemCards: boolean;
  checkExporterEligibilityForVeemCards: () => Promise<void>;
  isExporterIndustryEligibleForInstalinks: boolean;
  checkExporterIndustryEligibilityForInstalinks: () => Promise<void>;
  doWeSupportVeemCardsForExporter: () => Promise<void>;
  isVeemCardsSupportedForExporter: boolean;
}

const usePhaseReleaseEligibleStore = create<PhaseReleaseEligibleStore>()(
  zustandDevtools(
    log((set: StoreApi<PhaseReleaseEligibleStore>["setState"], get: () => PhaseReleaseEligibleStore) => ({
      isExporterEligibleForVeemCards: false,
      isExporterEligibleForInstalinks: true,
      isVeemCardsSupportedForExporter: false,
      checkExporterEligibilityForVeemCards: async () => {
        set({ isExporterEligibleForVeemCards: false });
        // const response = await beCall({
        //     path: BE_ROUTES.PHASE_RELEASE_ELIGIBILITY,
        //     method: ALLOWED_METHODS.POST,
        //     body: {
        //         releaseType: "VEEM_CARDS",
        //     }
        // });
        // if (response.success) {
        //     const data = response.data as PhaseReleaseEligibilityResponse;
        //     set({ isExporterEligibleForVeemCards: data.eligible });
        // }
      },
      doWeSupportVeemCardsForExporter: async (paymentLinkId: string | undefined) => {
        const response = await beCall({
          path: BE_ROUTES.PHASE_RELEASE_ELIGIBILITY,
          method: ALLOWED_METHODS.POST,
          body: {
            releaseType: "VEEM_CARDS_ENABLED",
          },
        });
        if (response.success) {
          const data = response.data as PhaseReleaseEligibilityResponse;
          set({ isVeemCardsSupportedForExporter: data.eligible });
        }
      },
      checkExporterIndustryEligibilityForInstalinks: async () => {
        const response = await beCall({
          path: BE_ROUTES.BLACK_LIST_ELIGIBILITY,
          method: ALLOWED_METHODS.POST,
          body: {
            releaseType: "INSTALINKS",
          },
        });
        if (response.success) {
          const data = response.data as PhaseReleaseEligibilityResponse;
          set({ isExporterIndustryEligibleForInstalinks: data.eligible });
        }
      },
    }))
  )
);

export default usePhaseReleaseEligibleStore;
