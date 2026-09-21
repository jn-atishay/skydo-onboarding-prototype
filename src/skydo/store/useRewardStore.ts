import log from "./logger";
import { create, zustandDevtools } from "./index";
import { ExporterRewardStatus } from "../types/Referral";
import { debounce } from "../util/functions";
import { fetchData } from "../util/beCall";
import { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";

interface ReferralStore {
  isLoading: boolean;
  exporterRewardStatus: ExporterRewardStatus;

  setExporterRewardStatus: (data: ExporterRewardStatus) => void;
  setIsLoading: (state: boolean) => void;

  fetchExporterRewardStatus: () => void;
}

const useRewardStore = create<ReferralStore>()(
  zustandDevtools(
    log((set: (arg0: (state: any) => any) => void, get: () => ReferralStore) => ({
      isLoading: true,
      exporterRewardStatus: undefined,
      // setters
      setExporterRewardStatus: (data: ExporterRewardStatus) => {
        set((state) => ({ ...state, exporterRewardStatus: data }));
      },

      fetchExporterRewardStatus: debounce(
        async () => {
          const response = await fetchData<ExporterRewardStatus>({
            url: BFF_ROUTES.REWARD_STATUS_FOR_TEST_TXN,
            method: ALLOWED_METHODS.GET,
          });
          set((state) => ({ ...state, isLoading: false, exporterRewardStatus: response.data as ExporterRewardStatus }));
        },
        500,
        { immediate: true }
      ),
    }))
  )
);

export default useRewardStore;
