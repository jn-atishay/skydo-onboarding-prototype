/**
 * @author Raj Sheth
 * created: 16/10/23
 */

import log from "./logger";
import { create, zustandDevtools } from "./index";
import {
  PaymentConfirmationEmail,
  SendPCEmailFunc,
  SendPCEmailReq,
  SendPCSampleEmailReq,
  SendSampleEmailFunc,
} from "../types/PaymentConfirmation";
import { BUTTON_TYPES } from "../constants/atomicConstants";
import { Invoice } from "../types";
import { fetchData } from "../util/beCall";
import { BFF_ROUTES } from "../util/beRoutes";
import { PreferredEmail } from "../components/PaymentsReminder/ReminderPopupEntry";

interface SamplePopupContent {
  importerId: number | undefined;
  importerName: string | undefined;
}

interface PaymentConfirmationState {
  sentEmailInfo?: PaymentConfirmationEmail;
  firaGeneratedDate?: Date;
  buttonType: (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];
  invoiceData?: Invoice;

  emailPopupVisibleForTxnId?: number | undefined;
  sendEmail: SendPCEmailFunc;
  preferredEmails?: PreferredEmail[];
}

interface PaymentConfirmationStore extends PaymentConfirmationState, SamplePopupContent {
  setSentEmailInfo: (sentEmailInfo: PaymentConfirmationEmail) => void;
  setFiraGeneratedDate: (firaGeneratedDate: Date) => void;
  setEmailPopupVisibleForTxnId: (emailPopupVisibleForTxnId: number | undefined) => void;
  setButtonType: (buttonType: (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES]) => void;
  setInvoiceData: (invoiceData: Invoice) => void;

  setImporterId: (importerId: number | undefined) => void;
  setImporterName: (importerName: string | undefined) => void;
  sendSampleEmail: SendSampleEmailFunc;
  fetchAndStorePreferredEmails: (invoiceId: string) => void;
}

const usePaymentConfirmationStore = create<PaymentConfirmationStore>()(
  zustandDevtools(
    log((set: (arg0: (state: any) => any) => void, get: () => PaymentConfirmationStore) => ({
      sentEmailInfo: undefined,
      firaGeneratedDate: undefined,
      importerId: undefined,
      importerName: undefined,
      emailPopupVisibleForTxnId: undefined,
      invoiceData: undefined,
      buttonType: BUTTON_TYPES.SECONDARY,

      setInvoiceData: (invoiceData: Invoice) => {
        set((state) => {
          return {
            ...state,
            invoiceData,
          };
        });
      },
      setImporterId: (importerId: number | undefined) => {
        set((state) => {
          return {
            ...state,
            importerId,
          };
        });
      },
      setButtonType: (buttonType: (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES]) => {
        set((state) => {
          return {
            ...state,
            buttonType,
          };
        });
      },

      setImporterName: (importerName: string | undefined) => {
        set((state) => {
          return {
            ...state,
            importerName,
          };
        });
      },
      setEmailPopupVisibleForTxnId: (emailPopupVisibleForTxnId: number | undefined) => {
        set((state) => {
          return {
            ...state,
            emailPopupVisibleForTxnId,
          };
        });
      },
      setSentEmailInfo: (sentEmailInfo: PaymentConfirmationEmail) => {
        set((state) => {
          return {
            ...state,
            sentEmailInfo,
          };
        });
      },
      setFiraGeneratedDate: (firaGeneratedDate: Date) => {
        set((state) => {
          return {
            ...state,
            firaGeneratedDate,
          };
        });
      },
      sendSampleEmail: (req: SendPCSampleEmailReq) => {
        void fetchData({
          url: BFF_ROUTES.SEND_PC_EMAIL,
          body: req,
          method: "POST",
          onSuccess: (resp) => {
            req.onSuccess && req.onSuccess(resp);
          },
          onError: (error) => {
            req.onError && req.onError(error);
          },
        });
      },
      sendEmail: (req: SendPCEmailReq) => {
        void fetchData({
          url: BFF_ROUTES.SEND_PC_EMAIL,
          body: req,
          method: "POST",
          onSuccess: (resp) => {
            req.onSuccess && req.onSuccess(resp);
          },
          onError: (error) => {
            req.onError && req.onError(error);
          },
        });
      },
      fetchAndStorePreferredEmails: (invoiceId: number) => {
        void fetchData({
          url: BFF_ROUTES.BFF_GET_PREFERRED_EMAILS_FOR_IMPORTER,
          params: {
            invoiceId,
          },
          method: "GET",
          onSuccess: (resp) => {
            if (resp) {
              set((state) => {
                return {
                  ...state,
                  preferredEmails: resp,
                };
              });
            }
          },
        });
      },
    }))
  )
);

export default usePaymentConfirmationStore;
