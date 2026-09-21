/**
 * @author Raj Sheth
 * created: 16/10/23
 */

import log from "./logger";
import { create, zustandDevtools } from "./index";
import { InvoiceOrReminderPopupContentCase } from "../components/InvoiceOrRemindEmailPopUp/InvoiceOrReminderEmailPreviewPopUpChange";

interface EmailPopupState {
  popupContentCase: InvoiceOrReminderPopupContentCase;
}

interface PopupEmailStore extends EmailPopupState {
  setPopupContentCase: (popupContentCase: InvoiceOrReminderPopupContentCase) => void;
}

const useEmailPopupStore = create<PopupEmailStore>()(
  zustandDevtools(
    log((set: (arg0: (state: any) => any) => void, get: () => PopupEmailStore) => ({
      popupContentCase: "",
      setPopupContentCase: (popupContentCase: InvoiceOrReminderPopupContentCase) => {
        set((state) => {
          return {
            ...state,
            popupContentCase,
          };
        });
      },
    }))
  )
);

export default useEmailPopupStore;
