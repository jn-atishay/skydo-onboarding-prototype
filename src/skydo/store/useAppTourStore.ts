import { create, zustandDevtools } from "./index";
import log from "./logger";

interface UseAppTourStore {
  isInvoicesSubNavOpen: boolean;
  setInvoicesSubNavStatus: (status: boolean) => void;
  isAppTourDonePopupOpen: boolean;
  setAppTourDonePopupStatus: (status: boolean) => void;
  isAppTourStartPopupOpen: boolean;
  setAppTourStartPopupStatus: (status: boolean) => void;
  isAppTourExitConfirmationPopupOpen: boolean;
  setAppTourExitConfirmationPopupStatus: (status: boolean) => void;
}

//TODO: delete if not required

const useAppTourStore = create<UseAppTourStore>()(
  zustandDevtools(
    log((set: (arg0: (state: any) => any) => void, get: () => UseAppTourStore) => ({
      isAppTourDonePopupOpen: false,
      isInvoicesSubNavOpen: false,
      isAppTourStartPopupOpen: false,
      isAppTourExitConfirmationPopupOpen: false,
      setInvoicesSubNavStatus: (status: boolean) => {
        set((state) => ({ ...state, isInvoicesSubNavOpen: status }));
      },
      setAppTourDonePopupStatus: (status: boolean) => {
        set((state) => ({ ...state, isAppTourDonePopupOpen: status }));
      },
      setAppTourStartPopupStatus: (status: boolean) => {
        set((state) => ({ ...state, isAppTourStartPopupOpen: status }));
      },
      setAppTourExitConfirmationPopupStatus: (status: boolean) => {
        set((state) => ({ ...state, isAppTourExitConfirmationPopupOpen: status }));
      },
    }))
  )
);

export default useAppTourStore;
