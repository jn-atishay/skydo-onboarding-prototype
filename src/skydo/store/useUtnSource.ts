import create, { StoreApi } from "zustand";
import { zustandDevtools } from "./index";
import log from "./logger";
import { UtmSource } from "../types/Onboarding";

interface UTMSourceStore {
  utmSource: UtmSource;
  setUtmSource: (source: UtmSource) => void;
}

const useUTMSourceStore = create<UTMSourceStore>()(
  zustandDevtools(
    log((set: StoreApi<UTMSourceStore>["setState"], get: () => UTMSourceStore) => ({
      utmSource: "",
      setUtmSource: (utmSource: UtmSource) => {
        set((state: UTMSourceStore) => ({ ...state, utmSource }));
      },
    }))
  )
);

export default useUTMSourceStore;
