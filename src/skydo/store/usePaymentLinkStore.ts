import { create, zustandDevtools } from "./index";
import log from "./logger";
import { StoreApi } from "zustand";
import { PaymentLink } from "../components/PaymentLinks/PaymentLinksList";
import beCall from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { PaymentLinkConnectionStatus } from "../types/PaymentLinkTypes";
import {debouncePromise} from "../util/functions";

interface PaymentLinkState {
  paymentLinks: PaymentLink[];
  paymentLinksLoading: boolean;
  paymentLinksConnectionStatus: PaymentLinkConnectionStatus;
  openCompletePaymentLinkPopup: boolean;
  completedPaymentLink: CompletedPaymentLink;
}

interface CompletedPaymentLink {
  invoiceAmount: number;
  currency: string;
  id: string;
  clientName: string;
  invoiceNumber: string;
  description: string;
  allowedMethods: string[];
}

interface PaymentLinkStore extends PaymentLinkState {
  getPaymentLinks: () => void;
  getPaymentLinksConnectionStatus: () => void;
  handleRedirect: (txId: string, cs: string) => Promise<string>;
  setPaymentLinkConnectionStatus: (paymentLinkConnectionStatus: PaymentLinkConnectionStatus) => void;
  onPaymentLinkCompleted: (paymentLink: CompletedPaymentLink) => void;
  closeCompletePaymentLinkPopup: () => void;
  deletePaymentLink: (paymentLinkId: string, reason?: string) => Promise<{ success: boolean; message?: string }>;
}

const PAYMENT_LINKS_LIST_QUERY = `query  {
paymentLinks 
   { 
     id 
     invoiceAmount
     invoiceNumber
     currency
     createdAt
     clientName
     description
     status
     inProgress
     methodsConfig {
      allowedMethods
     }
     paymentVendor
     failureReason {
       text
       title
     }
     paymentLinkDebitSuccessful
     paymentLinkDebitSuccessfulDate
   }
}`;

type PaymentLinkQueryDto = {
  paymentLinks: PaymentLink[];
};

const usePaymentLinkStore = create<PaymentLinkStore>()(
  zustandDevtools(
    log((set: StoreApi<PaymentLinkStore>["setState"], get: () => PaymentLinkStore) => ({
      paymentLinks: [],
      paymentLinksLoading: true,
      paymentLinksConnectionStatus: {
        connected: false,
        pproStatus: null,
        paypalStatus: null,
        enabled: false,
      },
      openCompletePaymentLinkPopup: false,
      completedPaymentLink: {
        invoiceAmount: 0,
        currency: "",
        id: "",
        clientName: "",
        invoiceNumber: "",
        description: "",
      },

      setPaymentLinkConnectionStatus: (paymentLinkConnectionStatus: PaymentLinkConnectionStatus) => {
        set(() => ({ paymentLinksConnectionStatus: paymentLinkConnectionStatus }));
      },

      getPaymentLinks: async () => {
        set({ paymentLinksLoading: true });
        const response = await beCall({
          path: BE_ROUTES.GRAPH_QL_DASHBOARD,
          method: ALLOWED_METHODS.POST,
          body: {
            query: PAYMENT_LINKS_LIST_QUERY,
            variables: {},
          },
        });

        const paymentLinks = response.data as PaymentLinkQueryDto;

        if (paymentLinks?.paymentLinks) {
          set({ paymentLinks: paymentLinks.paymentLinks });
        }
        set({ paymentLinksLoading: false });
      },
      getPaymentLinksConnectionStatus: async () => {
        const response = await beCall({
          path: BE_ROUTES.PAYMENT_LINKS_CONNECTION_STATUS,
          method: ALLOWED_METHODS.GET,
        });

        if (response?.data) {
          set({ paymentLinksConnectionStatus: response.data as PaymentLinkState["paymentLinksConnectionStatus"] });
        }
      },
      handleRedirect: async (txId: string, cs: string) => {
        const res = await beCall({
          path: BE_ROUTES.PPRO_VALIDATE_REDIRECT,
          method: ALLOWED_METHODS.POST,
          body: {
            txId,
            cs,
          },
        });
        return res.data;
      },
      onPaymentLinkCompleted: (paymentLink: CompletedPaymentLink) => {
        set(() => ({ openCompletePaymentLinkPopup: true, completedPaymentLink: paymentLink }));
      },
      closeCompletePaymentLinkPopup: () => {
        set(() => ({ openCompletePaymentLinkPopup: false }));
      },
      deletePaymentLink: debouncePromise( async (paymentLinkId: string, reason?: string) => {
        const response = await beCall({
          path: BE_ROUTES.DELETE_PAYMENT_LINK,
          method: ALLOWED_METHODS.POST,
          body: {
            paymentLinkId: paymentLinkId,
            deleteReason: reason,
          },
        });

        if (response?.success) {
          // Refresh the payment links list after successful deletion
          get().getPaymentLinks();
          return { success: true, message: response.message };
        }
        return { success: false, message: response?.message || "Failed to delete payment link" };
      },5000, {
          isLeading: true,
      }),
    }))
  )
);

export default usePaymentLinkStore;
