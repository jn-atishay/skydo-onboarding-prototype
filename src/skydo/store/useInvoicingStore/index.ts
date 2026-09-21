import log from "../logger";
import { create, zustandDevtools } from "../index";
import { InvoiceState, SectionType } from "../../constants/newinvoiceConstants";
import actions, { InvoicingStoreActions } from "./actions";
import {
  Cache,
  EInvoice,
  InvoiceBankAccount,
  InvoiceBuyer,
  InvoiceFinancial,
  InvoiceItem,
  InvoiceOtherDetail,
  InvoicePaymentTerm,
  InvoiceProgress,
  InvoiceSeller,
  RecurringInvoiceConfigDto,
} from "../../types/NewInvoiceTypes";
import { Option } from "../../types/atomicComponentTypes";

export type InvoicingStore = {
  openSection: SectionType;
  percentCompleted: number;
  invoiceSeller: InvoiceSeller;
  invoiceBuyer: InvoiceBuyer;
  cache: Cache;
  invoiceFinancial: InvoiceFinancial;
  invoiceBankAccount: InvoiceBankAccount;
  invoiceOtherDetail: InvoiceOtherDetail;
  invoiceItems: InvoiceItem[];
  invoiceNumber: string;
  invoicePaymentTerm: InvoicePaymentTerm;
  invoiceState: InvoiceState;
  isLoading: boolean;
  id: number;
  countryList: Option[];
  unSavedStates: { [key: string]: boolean };
  invoiceProgress: InvoiceProgress[];
  finaliseError: { [key: string]: boolean | string };
  numOfDraftInvoices?: number;
  fileName: string;
  eInvoice?: EInvoice;
  isFinalisePopupVisible: boolean;
  isAutoPopulatedBankAccount: boolean;
  recurringInvoiceConfig?: RecurringInvoiceConfigDto;
  numberOfRecurringConfigs?: number;
  isInvoiceDataLoaded: boolean;
  isBCVariantEnabled: boolean;
  isFirstTimeUser: boolean;
};

export type InvoicingStoreCombined = InvoicingStore & InvoicingStoreActions;
/*
Handling of draft data
1. add one more state --- draft
2. store
  a. fieldData
    i. this will only contain data being entered by user, with initial value as data from backend
    ii. on save click, data save in be. update pdf preview
  b. savedData
    i. this will contain data from backend, and it will be used for pdf generation
 */

/*
1. Sub nav bar
2. Invoicing Page
  a. Invoice Preview Container
     i. Download CTA
     ii. Send Email CTA
     iii. Finalise CTA
     iv. Delete CTA
  b. InvoicingFormContainer
      i. Bill From
      ii. Bill To
      iii. Items container
      iv. Bank Details
      v. Notes

  c. Popups Container
      i. Finalise Invoice
      ii. Send Email (use Common)
      iii. Delete Invoice
      iv. Mark send

3. Draft Invoice list page
 */

/*
1. on save and continue, open next section with isCompleted = false
  - write a function to open next section
2. maintain an ordered list of sections
3. validation function on finalise click
4. if success, open finalise popup
    a. on Submit
      b. change invoice state to finalised
      c. open send email popup
          a. need to check logic on prefill of email ids
 */

/*
store table columns in zustand
 */

export const initialState: InvoicingStore = {
  openSection: SectionType.BILL_FROM,
  id: 0,
  percentCompleted: 0,
  invoiceState: InvoiceState.DRAFT,
  isLoading: true,
  unSavedStates: {},
  invoiceProgress: [],
  fileName: "",

  countryList: [],
  invoiceFinancial: {} as InvoiceFinancial,

  invoicePaymentTerm: {} as InvoicePaymentTerm,
  invoiceSeller: {} as InvoiceSeller,
  invoiceBankAccount: {} as InvoiceBankAccount,

  invoiceItems: [{ quantity: 1 } as InvoiceItem] as InvoiceItem[],
  invoiceNumber: "",

  invoiceOtherDetail: {} as InvoiceOtherDetail,

  cache: {} as Cache,
  invoiceBuyer: {} as InvoiceBuyer,
  finaliseError: {},
  eInvoice: {} as EInvoice,
  isFinalisePopupVisible: false,
  isAutoPopulatedBankAccount: false,
  recurringInvoiceConfig: undefined,
  isInvoiceDataLoaded: false,
  isBCVariantEnabled: false,
  isFirstTimeUser: false,
};

const useInvoicingStore = create<InvoicingStoreCombined>()(
  zustandDevtools(
    log((set: any, get: () => InvoicingStoreCombined) => ({
      numOfDraftInvoices: 0,
      numberOfRecurringConfigs: 0,
      ...initialState,
      ...actions(set, get),
    }))
  )
);
export default useInvoicingStore;
