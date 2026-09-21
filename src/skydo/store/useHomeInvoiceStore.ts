import { create, zustandDevtools } from "./index";
import log from "./logger";
import beCall from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import Locale from "../util/locale/en";
import { TOAST_TYPES } from "../constants/atomicConstants";
import useToastMessages from "./toastMessages";
import { debounce } from "../util/functions";
import useHomeStateStore from "./useHomeStateStore";

interface HomeInvoiceStore {
  fetchHomeInvoices: () => void;
  testInvoiceState: any;
  invoiceListState: any;
  summaryState: any;
  isLoading: Boolean;
}

const useHomeInvoiceStore = create<HomeInvoiceStore>()(
  zustandDevtools(
    log((set: any, get: () => HomeInvoiceStore) => ({
      isLoading: true,
      invoiceListState: [],
      testInvoiceState: undefined,

      fetchHomeInvoices: debounce(
        async () => {
          try {
            const resp: any = await beCall({
              url: BE_ROUTES.FETCH_INVOICE_LIST_AND_SUMMARY_HOME,
              method: ALLOWED_METHODS.POST,
              onError: (res: any) => {
                useToastMessages.getState().addToast({
                  id: "fetch_error",
                  body: Locale.wentWrongMessage,
                  type: TOAST_TYPES.ERROR,
                });
              },
            });

            const invoiceListAndSummary = resp?.data;
            const invoiceList = invoiceListAndSummary.invoiceList;
            const invoiceSummary = invoiceListAndSummary.invoiceSummary;
            const testInvoice = invoiceListAndSummary.testInvoice;

            set((store: HomeInvoiceStore) => ({
              ...store,
              testInvoiceState: testInvoice,
              invoiceListState: invoiceList,
              summaryState: invoiceSummary,
            }));
            useHomeStateStore.getState().fetchHomeState();
          } catch (e) {
          } finally {
            set((store: HomeInvoiceStore) => ({ ...store, isLoading: false }));
          }
        },
        500,
        { isLeading: true }
      ),
    }))
  )
);

export default useHomeInvoiceStore;
