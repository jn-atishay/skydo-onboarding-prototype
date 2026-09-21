import {create, zustandDevtools} from "./index";
import log from "./logger";
import {StoreApi} from "zustand";

interface ArchiveOrBlacklistStore {
  isArchiveOrBlacklistPopupOpen: boolean,
  setArchiveOrBlacklistPopup: (state: boolean) => void
}

const useArchiveOrBlacklistStore = create<ArchiveOrBlacklistStore>()(
  zustandDevtools(
    log((set: StoreApi<ArchiveOrBlacklistStore>["setState"], get: () => ArchiveOrBlacklistStore) => ({
      isArchiveOrBlacklistPopupOpen: false,
      setArchiveOrBlacklistPopup: (state: boolean) => {
        set((store) => ({ ...store, isArchiveOrBlacklistPopupOpen: state }))
      }
    }))
  )
)

export default useArchiveOrBlacklistStore;