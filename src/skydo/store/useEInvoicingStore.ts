import log from "./logger";
import { create, zustandDevtools } from "./index";

interface EInvoicingDetails {
  isPopupVisible: boolean;
  onSuccess?: () => void;
  onSkip?: () => void;
  onClose?: () => void;
  showBackButton?: boolean;
  showSampleEInvoice?: boolean;
  openSampleEInvoice?: boolean;
  startWithDescription?: boolean;
  gstin: string;
}

interface EInvoicingActions {
  openEInvoicePopup: (values: EInvoicingDetails) => void;
  closeEInvoicePopup: () => void;
  openSampleEInvoicePopup: () => void;
  closeSampleEInvoicePopup: () => void;
}

interface EInvoicingStore extends EInvoicingDetails, EInvoicingActions {}

const initialState = {
  isPopupVisible: false,
  showBackButton: false,
  showSampleEInvoice: false,
  openSampleEInvoice: false,
  startWithDescription: false,
  onSuccess: () => {},
  onSkip: () => {},
  onClose: () => {},
  gstin: "",
};

const useCashbackStore = create<EInvoicingStore>()(
  zustandDevtools(
    log((set: any) => ({
      ...initialState,
      openEInvoicePopup: (values: EInvoicingDetails) => {
        set((store: EInvoicingDetails) => ({ ...store, ...values }));
      },
      closeEInvoicePopup: () => {
        set((store: EInvoicingDetails) => ({ ...store, ...initialState }));
      },
      openSampleEInvoicePopup: () => {
        set((store: EInvoicingDetails) => ({ ...store, showSampleEInvoice: true }));
      },
      closeSampleEInvoicePopup: () => {
        set((store: EInvoicingDetails) => ({ ...store, showSampleEInvoice: false }));
      },
    }))
  )
);

export default useCashbackStore;
