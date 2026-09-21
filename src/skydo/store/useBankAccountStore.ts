import log from "./logger";
import { create, zustandDevtools } from "./index";
import { TypeBankDetails } from "../types/Onboarding";
import { ApiFuncParams, BankFieldError, BankVerificationErrorCode, CurrencyAmountPair } from "../types";
import { fetchData } from "../util/beCall";
import { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { debounce } from "../util/functions";
import useToastMessages from "./toastMessages";
import { TOAST_TYPES } from "../constants/atomicConstants";
import * as Sentry from "@sentry/nextjs";

interface PopupState {
  isPopupOpen: boolean;
  neftInProgressSummary: Array<CurrencyAmountPair>;
  isEmailSent: boolean;
}

interface BankAccountState extends PopupState {
  bankDetails: TypeBankDetails;
  accountNumb: string;
  ifscCode: string;
  isVerifyLoading: boolean;
  isSubmitLoading: boolean;
  nameMatchError: string;
  isFormEditable: boolean;
  fieldError: BankFieldError;
  isDocsRequired: boolean;
  errorCode?: BankVerificationErrorCode;
  isNameMismatchRecoverable: boolean;
  isBusinessNameSaving: boolean;
}

const initialState: BankAccountState = {
  bankDetails: {},
  accountNumb: "",
  ifscCode: "",
  isVerifyLoading: false,
  isSubmitLoading: false,
  nameMatchError: "",
  isFormEditable: true,
  fieldError: {},
  isDocsRequired: true,
  isPopupOpen: false,
  neftInProgressSummary: [],
  isEmailSent: false,
  errorCode: undefined,
  isNameMismatchRecoverable: false,
  isBusinessNameSaving: false,
};

interface VerificationReq extends ApiFuncParams {
  bankAccountNumber: string;
  ifscCode: string;
  markOthersAsInactive?: boolean;
}

interface Actions {
  addAndVerifyBankAccount: (req: VerificationReq) => void;
  fetchNeftInProgress: () => void;
  verifyBankAccountViaEmail: (req: VerificationReq) => void;
  activateBankAccount: (req: VerificationReq) => void;
}

export interface BankAccountStore extends BankAccountState, Actions {
  setBankDetails: (x: TypeBankDetails) => void;
  setAccountNumb: (x: string) => void;
  setIfscCode: (x: string) => void;
  setIsVerifyLoading: (x: boolean) => void;
  setIsSubmitLoading: (x: boolean) => void;
  setNameMatchError: (x: string) => void;
  setIsFormEditable: (x: boolean) => void;
  setFieldError: (x: BankFieldError) => void;
  setIsDocsRequired: (x: boolean) => void;
  setIsPopupOpen: (x: boolean) => void;
  setNeftInProgressSummary: (x: Array<CurrencyAmountPair>) => void;
  setIsEmailSent: (x: boolean) => void;
  setErrorCode: (x: BankVerificationErrorCode) => void;
  setIsNameMismatchRecoverable: (x: boolean) => void;
  setIsBusinessNameSaving: (x: boolean) => void;
}

const useBankAccountStore = create<BankAccountStore>()(
  zustandDevtools(
    log((set: any, get: () => BankAccountStore) => ({
      ...initialState,
      setErrorCode: (x: BankVerificationErrorCode) => {
        set((store: BankAccountStore) => ({ ...store, errorCode: x }));
      },
      fetchNeftInProgress: debounce(async () => {
        const response = await fetchData({
          url: BFF_ROUTES.NEFT_IN_PROGRESS,
          method: ALLOWED_METHODS.GET,
        });
        if (response.success) {
          set((store: BankAccountStore) => ({ ...store, neftInProgressSummary: response.data }));
        }
      }, 1000),
      setIsPopupOpen: (x: boolean) => {
        set((store: BankAccountStore) => ({ ...store, isPopupOpen: x }));
      },
      setBankDetails: (x: TypeBankDetails) => {
        set((store: BankAccountStore) => ({ ...store, bankDetails: x }));
      },
      setAccountNumb: (x: string) => {
        set((store: BankAccountStore) => ({ ...store, accountNumb: x }));
      },
      setIfscCode: (x: string) => {
        set((store: BankAccountStore) => ({ ...store, ifscCode: x }));
      },
      setIsVerifyLoading: (x: boolean) => {
        set((store: BankAccountStore) => ({ ...store, isVerifyLoading: x }));
      },
      setIsSubmitLoading: (x: boolean) => {
        set((store: BankAccountStore) => ({ ...store, isSubmitLoading: x }));
      },
      setNameMatchError: (x: string) => {
        set((store: BankAccountStore) => ({ ...store, nameMatchError: x }));
      },
      setIsFormEditable: (x: boolean) => {
        set((store: BankAccountStore) => ({ ...store, isFormEditable: x }));
      },
      setFieldError: (x: BankFieldError) => {
        set((store: BankAccountStore) => ({ ...store, fieldError: x }));
      },
      setIsDocsRequired: (x: boolean) => {
        set((store: BankAccountStore) => ({ ...store, isDocsRequired: x }));
      },
      setNeftInProgressSummary: (x: Array<CurrencyAmountPair>) => {
        set((store: BankAccountStore) => ({ ...store, neftInProgressSummary: x }));
      },
      setIsEmailSent: (x: boolean) => {
        set((store: BankAccountStore) => ({ ...store, isEmailSent: x }));
      },
      setIsNameMismatchRecoverable: (x: boolean) => {
        set((store: BankAccountStore) => ({ ...store, isNameMismatchRecoverable: x }));
      },
      setIsBusinessNameSaving: (x: boolean) => {
        set((store: BankAccountStore) => ({ ...store, isBusinessNameSaving: x }));
      },
      activateBankAccount: async (req: VerificationReq) => {
        try {
          const response = await fetchData({
            url: BFF_ROUTES.ACTIVATE_BANK_ACC,
            method: ALLOWED_METHODS.POST,
            body: {
              bankAccountNumber: req.bankAccountNumber,
              ifscCode: req.ifscCode,
            },
          });
          if (response.success) {
            req.onSuccess && req.onSuccess(response);
          } else {
            throw response;
          }
        } catch (e: any) {
          req.onError && req.onError(e);
          Sentry.captureMessage("bank_acc_activation_failed", {
            level: "error",
            extra: {
              errorCode: e.message,
              error: e,
            },
          });
        }
      },
      verifyBankAccountViaEmail: async (req: VerificationReq) => {
        try {
          const response = await fetchData({
            url: BFF_ROUTES.VERIFY_BANK_ACCOUNT,
            method: ALLOWED_METHODS.POST,
            body: {
              bankAccountNumber: req.bankAccountNumber,
              ifscCode: req.ifscCode,
              viaEmail: true,
            },
          });
          if (!response.success) throw response;
          req.onSuccess && req.onSuccess(response);
        } catch (e: any) {
          console.error(e);
          useToastMessages.getState().addToast({
            id: "send-email-failed",
            type: TOAST_TYPES.ERROR,
            body: "Error sending email. Please try again. If the issue persists, please contact support@skydo.com",
          });
          req.onError && req.onError(e);
        }
      },
      addAndVerifyBankAccount: async (req: VerificationReq) => {
        try {
          const response = await fetchData({
            url: BFF_ROUTES.VERIFY_BANK_ACCOUNT,
            method: ALLOWED_METHODS.POST,
            body: {
              bankAccountNumber: req.bankAccountNumber,
              ifscCode: req.ifscCode,
              markOthersAsInactive: req.markOthersAsInactive,
              viaEmail: false,
            },
          });
          if (response.success) {
            const newBankAcc = response.data as any;
            get().setBankDetails({
              accountHolderName: newBankAcc.accountHolderName,
              accountNumber: newBankAcc.accountNumber,
              ifscCode: newBankAcc.ifscCode,
              bankBranch: newBankAcc.bankBranch,
            });
            get().setAccountNumb(newBankAcc.accountNumber);
            get().setIfscCode(newBankAcc.ifscCode);
            req.onSuccess && req.onSuccess(response);
          } else {
            throw response;
          }
        } catch (e: any) {
          req.onError && req.onError(e);
        }
      },
    }))
  )
);
export default useBankAccountStore;
