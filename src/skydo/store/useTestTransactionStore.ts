import { TestTransactionConstants } from "../types/TestTransaction";
import { create, zustandDevtools } from "./index";
import log from "./logger";
import beCall from "../util/beCall";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import useToastMessages from "./toastMessages";
import { TOAST_TYPES } from "../constants/atomicConstants";
import Locale from "../util/locale/en";
import { StoreApi } from "zustand";

interface TestTransactionStore {
  isTTPopUpVisible: boolean;
  ttPopUpState: TTPopUpState;
  showPopUp: () => void;
  closePopUp: () => void;
  testInvoiceConstants?: TestTransactionConstants;
  onInitiateTestPaymentClick: (onSuccessCallback: () => void) => void;
  onInitiatePaymentFail: () => void;
}

export enum TTPopUpState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initialState = {
  isTTPopUpVisible: false,
  ttPopUpState: TTPopUpState.NOT_STARTED,
};

const useTestTransactionStore = create<TestTransactionStore>()(
  zustandDevtools(
    log((set: StoreApi<TestTransactionStore>["setState"], get: () => TestTransactionStore) => ({
      ...initialState,
      showPopUp: () => {
        set((store: TestTransactionStore) => ({
          ...store,
          isTTPopUpVisible: true,
          ttPopUpState: TTPopUpState.NOT_STARTED,
        }));
      },
      closePopUp: () => {
        set((store: TestTransactionStore) => ({
          ...store,
          isTTPopUpVisible: false,
          ttPopUpState: TTPopUpState.NOT_STARTED,
        }));
      },
      onInitiateTestPaymentClick: async (onSuccessCallback: () => void) => {
        set((store: TestTransactionStore) => ({
          ...store,
          ttPopUpState: TTPopUpState.IN_PROGRESS,
        }));
        await beCall({
          path: "test/transaction/initiate",
          method: ALLOWED_METHODS.POST,
          onSuccess: async (res) => {
            if (res.success) {
              await sleep(1000);
              set((store: TestTransactionStore) => ({ ...store, ttPopUpState: TTPopUpState.COMPLETED }));
              onSuccessCallback();
            } else {
              get().onInitiatePaymentFail();
            }
          },
          onError: () => {
            get().onInitiatePaymentFail();
          },
        });
      },
      onInitiatePaymentFail: () => {
        useToastMessages.getState().addToast({
          type: TOAST_TYPES.ERROR,
          id: "error_tt",
          body: Locale.wentWrongMessage,
        });
        set((store: TestTransactionStore) => ({
          ...store,
          isTTPopUpVisible: false,
          ttPopUpState: TTPopUpState.NOT_STARTED,
        }));
      },
    }))
  )
);

export default useTestTransactionStore;
