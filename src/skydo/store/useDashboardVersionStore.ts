import {create, zustandDevtools} from "./index";
import log from "./logger";
import {debounce} from "../util/functions";
import beCall from "../util/beCall";
import {ALLOWED_METHODS} from "../constants/apiConstants";
import BE_ROUTES from "../util/beRoutes";
import {DashboardVersionType} from "../types/DashboardVersionTypes";

interface DashboardVersionStore {
  dashboardVersion: DashboardVersionType;
  isLoading: boolean;
  fetchDashboardVersionData: () => void;
  setDashboardVersion: (version: DashboardVersionType) => void;
}

interface DashboardVersionResponse {
  version: DashboardVersionType;
}

const initialState = {
  isLoading: true,
  dashboardVersion: DashboardVersionType.INVOICE_FULL,
};

export const SYSTEM_GENERATED = "SYSTEM_GENERATED";

const useDashboardVersionStore = create<DashboardVersionStore>()(
  zustandDevtools(
    log((set: any, get: () => DashboardVersionStore) => ({
      ...initialState,
      setDashboardVersion: (version: DashboardVersionType) => {
        set((store: DashboardVersionStore) => ({
          ...store,
          dashboardVersion: version,
          isLoading: false,
        }));
      },
      fetchDashboardVersionData: debounce(
        async () => {
          let newVersion = DashboardVersionType.INVOICE_FULL;
          try {
            const res = await beCall<DashboardVersionResponse>({
              path: BE_ROUTES.DASHBOARD_VERSION,
              method: ALLOWED_METHODS.GET,
            });
            const isError = !res.success;
            if (isError) {
              // toast
            } else {
              newVersion = (res.data as DashboardVersionResponse).version;
            }
          } catch (e) {
          } finally {
            set((store: DashboardVersionStore) => ({
              ...store,
              dashboardVersion: newVersion,
              isLoading: false,
            }));
          }
        },
        500,
        {
          isLeading: true,
        }
      ),
    }))
  )
);

export default useDashboardVersionStore;
