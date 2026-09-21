import log from "./logger";
import { create, zustandDevtools } from "./index";

interface BankHolidayStore {
  isPopupOpen: boolean;
  setIsPopupOpen: (isPopupOpen: boolean) => void;
}

const useBankHolidayStore = create<BankHolidayStore>()(
  zustandDevtools(
    log((set: any) => ({
      isPopupOpen: false,
      setIsPopupOpen: (isPopupOpen: boolean) => {
        set((store: BankHolidayStore) => ({ ...store, isPopupOpen }));
      },
    }))
  )
);
export default useBankHolidayStore;
