import {zustandDevtools} from "./index";
import log from "./logger";
import create, {StoreApi} from "zustand";
import {Exporter, ExporterUserResponseDto} from "../types/Exporter/ExporterUser";
import {debounce} from "../util/functions";
import beCall from "../util/beCall";
import {BFF_ROUTES} from "../util/beRoutes";
import {ALLOWED_METHODS} from "../constants/apiConstants";
import {EXPORTER_MILESTONES_QUERY} from "../util/queries";

type ExporterMilestoneStore = {
  exporter: Partial<Exporter>;
  fetchExporterMilestone: () => void;
  incrementPopupShowCount: () => void;
};

/**
 * {
 *     "exporterUser": {
 *         "exporter": {
 *             "exporterMilestone": {
 *                 "id": 1,
 *                 "milestoneType": "MILESTONE_YEARLY_50K"
 *             },
 *             "correspondentName": "Swapnil",
 *             "businessDescription": {
 *                 "logoUrl": "https://example.com/logo.png"
 *             }
 *         }
 *     }
 * }
 **/

const useExporterMilestoneStore = create<ExporterMilestoneStore>()(
  zustandDevtools(
    log((set: StoreApi<ExporterMilestoneStore>["setState"], get: () => ExporterMilestoneStore) => ({
      exporter: {},
      setExporterDetails: (data: Partial<Exporter>) => {
        set((state) => ({ ...state, exporter: { ...state.exporter, ...data } }));
      },
      fetchExporterMilestone: debounce(
        async () => {
          try {
            const resp = await beCall({
              url: BFF_ROUTES.GET_EXPORTER_MILESTONES,
              method: ALLOWED_METHODS.POST,
              body: { query: EXPORTER_MILESTONES_QUERY, operationName: "FetchExporterMilestones", variables: {} },
            });
            const data = resp.data as { exporterUser?: ExporterUserResponseDto };
            if (data.exporterUser && data.exporterUser.exporter) {
              const exporter = data.exporterUser.exporter;
              const { exporterMilestone, businessDescription, correspondentName } = exporter;
              set((state) => ({
                ...state,
                exporter: {
                  ...state.exporter,
                  exporterMilestone,
                  correspondentName,
                  businessDescription,
                },
              }));
            }
          } catch (e) {
            console.error(e);
          }
        },
        500,
        { isLeading: true }
      ),
      incrementPopupShowCount: async () => {
        await beCall({
          url: BFF_ROUTES.INCREMENT_EXPORTER_MILESTONE_POPUP_COUNT,
          method: ALLOWED_METHODS.POST,
        });
      }
    }))
  )
);

export default useExporterMilestoneStore;
