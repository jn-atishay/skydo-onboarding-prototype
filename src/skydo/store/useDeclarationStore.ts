/**
 * @author Raj Sheth
 * created: 27/11/23
 */

import log from "./logger";
import { create, zustandDevtools } from "./index";
import beCall from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { PostDeclarationDataFunc, PostDeclarationDataReq } from "../types/Declaration";
import { ALLOWED_METHODS } from "../constants/apiConstants";

export interface DeclarationDetails {
  isPopupVisible: boolean;
  isSubmitting: boolean;
  setIsPopupVisible: (isPopupVisible: boolean) => void;
  onClosePopup: () => void;
  postDeclarationBackend: PostDeclarationDataFunc;
}

const useDeclarationStore = create<DeclarationDetails>()(
  zustandDevtools(
    log((set: any, get: () => DeclarationDetails) => ({
      isPopupVisible: false,
      isSubmitting: false,
      onClosePopup: () => {
        set((store: DeclarationDetails) => ({ ...store, isPopupVisible: false }));
      },
      setIsPopupVisible: (isPopupVisible: boolean) => {
        set((store: DeclarationDetails) => ({ ...store, isPopupVisible: isPopupVisible }));
      },
      /**
       * Declaring is not idempotent — each accepted click is stored as its own declaration record.
       * The in-flight guard lives here rather than in the popup so every caller is covered, and
       * because the popup's accept button gives no feedback until `isSubmitting` flips back.
       */
      postDeclarationBackend: async (req: PostDeclarationDataReq) => {
        if (get().isSubmitting) return;
        const { declarationDataList, onError, onSuccess } = req;
        set((store: DeclarationDetails) => ({ ...store, isSubmitting: true }));
        try {
          await beCall({
            path: BE_ROUTES.CAPTURE_SOLE_PROP_DECLARATION,
            method: ALLOWED_METHODS.POST,
            body: {
              declarationDataList: declarationDataList,
            },
            params: {
              isUserDetailsRequired: true,
            },
            onSuccess,
            onError,
          });
        } finally {
          // `finally` rather than per-callback resets: beCall swallows its own errors and returns
          // early on 403 without invoking onError, which would otherwise strand the button loading.
          set((store: DeclarationDetails) => ({ ...store, isSubmitting: false }));
        }
      },
    }))
  )
);

export default useDeclarationStore;
