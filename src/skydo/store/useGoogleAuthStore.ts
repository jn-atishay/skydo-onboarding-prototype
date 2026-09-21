import { zustandDevtools } from "./index";
import log from "./logger";
import create, { StoreApi } from "zustand";

interface GoogleAuthStore {
  isScriptLoaded: boolean;
  setGoogleAuthScriptLoaded: (status: boolean) => void;
}

// The states of this store doesn't get reset after logout
const useGoogleAuthStore = create<GoogleAuthStore>()(
  zustandDevtools(
    log((set: StoreApi<GoogleAuthStore>["setState"], get: () => GoogleAuthStore) => ({
      isScriptLoaded: false,
      setGoogleAuthScriptLoaded: (status: boolean) => {
        set((state) => ({ ...state, isScriptLoaded: status }));
      },
    }))
  )
);

export default useGoogleAuthStore;
