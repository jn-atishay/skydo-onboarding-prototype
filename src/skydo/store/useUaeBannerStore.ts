import log from "./logger";
import { create, zustandDevtools } from "./index";

interface UaeBannerState {
  isUaeBannerVisible: boolean;
  setUaeBannerVisibility: (isVisible: boolean) => void;
}

const useUaeBannerStore = create<UaeBannerState>()(
  zustandDevtools(
    log((set: any) => ({
      isUaeBannerVisible: true,
      setUaeBannerVisibility: (isVisible: boolean) => {
        set((store: UaeBannerState) => ({ ...store, isUaeBannerVisible: isVisible }));
      },
    }))
  )
);

export default useUaeBannerStore;

