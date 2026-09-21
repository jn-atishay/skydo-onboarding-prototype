import { create, zustandDevtools } from "./index";
import log from "./logger";
import { StoreApi } from "zustand";
import { fetchData } from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { ResponseWrapper } from "../authentication/api/AuthApiDto";

interface UseDocInputStore {
  verifyIec: (iec: string) => Promise<ResponseWrapper<Boolean>>;
  showIecActivatePopup: boolean;
  setShowIecActivatePopup: (show: boolean) => void;
  iecErrorType: string;
  setIecErrorType: (errorType: string) => void;
  showHelpPopup: boolean;
  setShowHelpPopup: (show: boolean) => void;
}

const useDocInputStore = create<UseDocInputStore>()(
  zustandDevtools(
    log((set: StoreApi<UseDocInputStore>["setState"], get: () => UseDocInputStore) => ({
      showIecActivatePopup: false,
      iecErrorType: "",
      showHelpPopup: false,

      verifyIec: async (iec: string) => {
        try {
          return await fetchData<ResponseWrapper<Boolean>>({
            path: BE_ROUTES.VERIFY_IEC_CODE,
            method: ALLOWED_METHODS.POST,
            body: {
              iec: iec,
            },
          });
        } catch (e) {
          return { success: false };
        }
      },
      setShowIecActivatePopup: (show: boolean) => set({ showIecActivatePopup: show }),
      setIecErrorType: (errorType: string) => set({ iecErrorType: errorType }),
      setShowHelpPopup: (show: boolean) => set({ showHelpPopup: show }),
    }))
  )
);

export default useDocInputStore;
