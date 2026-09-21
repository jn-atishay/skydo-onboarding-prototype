import { create, zustandDevtools } from "./index";
import log from "./logger";
import useNpsStore from "./useNpsStore";
import { Analytics } from "../analytics/useAnalytics";
import { Events } from "../analytics/EventConstants";

interface FiraNpsStore {
  isFiraNpsPopUpVisible: boolean;
  fileName: string;
  setFiraNpsPopVisibility: (visibility: boolean, analytics: Analytics) => void;
  setFiraNpsPopUpFileName: (fileName: string) => void;
}

const initialState = {
  isFiraNpsPopUpVisible: false,
  fileName: "fira.pdf",
};

const useFiraNpsStore = create<FiraNpsStore>()(
  zustandDevtools(
    log((set: any, get: () => FiraNpsStore) => ({
      ...initialState,
      setFiraNpsPopVisibility: (visibility: boolean, analytics: Analytics) => {
        useNpsStore.getState().resetNps();
        useNpsStore.getState().fetchNpsData();
        set((store: FiraNpsStore) => ({ ...store, isFiraNpsPopUpVisible: visibility }));
        if (visibility) {
          analytics?.trackAsync(Events.FIRA_POPUP_OPENED);
        } else {
          analytics?.trackAsync(Events.FIRA_POPUP_CLOSED);
        }
      },
      setFiraNpsPopUpFileName: (fileName: string) => {
        set((store: FiraNpsStore) => ({ ...store, fileName: fileName }));
      },
    }))
  )
);

export default useFiraNpsStore;
