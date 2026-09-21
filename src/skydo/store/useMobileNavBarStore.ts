import { create, zustandDevtools } from "./index";
import {Analytics} from "../analytics/useAnalytics";
import {Events} from "../analytics/EventConstants";

interface MobileNavBarState {
  isNavBarOpen: boolean;
  isClosing: boolean;
  isOpening: boolean;
  openNavBar: (analytics: Analytics) => void;
  closeNavBar: (analytics: Analytics) => void;
  setClosing: (isClosing: boolean) => void;
  setOpening: (isOpening: boolean) => void;
}

const useMobileNavBarStore = create<MobileNavBarState>()(
  zustandDevtools((set: any) => ({
    isNavBarOpen: false,
    isClosing: false,
    isOpening: false,
    openNavBar: (analytics: Analytics) => {
      analytics?.trackAsync(Events.MOBILE_NAV_BAR.OPEN);
      set({isNavBarOpen: true, isClosing: false, isOpening: true})
    },
    closeNavBar: (analytics: Analytics) => {
      analytics?.trackAsync(Events.MOBILE_NAV_BAR.CLOSE);
      set({isClosing: true, isNavBarOpen: false, isOpening: false})
    },
    setClosing: (isClosing: boolean) => set({ isClosing }),
    setOpening: (isOpening: boolean) => set({ isOpening }),
  }))
);

export default useMobileNavBarStore;
