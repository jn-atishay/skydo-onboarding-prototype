export enum SectionType {
  BILL_FROM = "BILL_FROM",
  BILL_TO = "BILL_TO",
  ITEMS = "ITEMS",
  BANK_ACCOUNT = "BANK_ACCOUNT",
  OTHERS = "OTHERS",
  PAYMENT_TERMS = "PAYMENT_TERMS",
}

export const SectionNames = {
  BILL_FROM: "BILL_FROM",
  BILL_TO: "BILL_TO",
  ITEMS: "ITEMS",
  BANK_ACCOUNT: "BANK_ACCOUNT",
  OTHERS: "OTHERS",
};

export const sectionProgressNameToSectionDataKey: { [key: string]: string } = {
  BILL_FROM: "invoiceSeller",
  BILL_TO: "invoiceBuyer",
  ITEMS: "invoiceFinancial",
  BANK_ACCOUNT: "invoiceBankAccount",
  OTHERS: "invoiceOtherDetail",
};

export const SectionTypeMap = {
  [SectionType.BILL_FROM]: "invoiceSeller",
  [SectionType.BILL_TO]: "invoiceBuyer",
  [SectionType.ITEMS]: "invoiceFinancial",
  [SectionType.BANK_ACCOUNT]: "invoiceBankAccount",
  [SectionType.OTHERS]: "invoiceOtherDetail",
};

export enum InvoiceState {
  DRAFT = "DRAFT",
  FINALIZED = "FINALIZED",
  SENT = "SENT",
  ARCHIVED = "ARCHIVED",
}

export enum UnitType {
  HOUR = "HOUR",
  QUANTITY = "QUANTITY",
}

export enum BankType {
  SKYDO = "SKYDO",
  OTHERS = "OTHERS",
}

export enum SkydoBankType {
  LOCAL_ACCOUNT = "LOCAL_ACCOUNT",
  INTERNATIONAL_SWIFT = "INTERNATIONAL_SWIFT",
  BALANCE = "BALANCE",
}

export enum PaymentTerms {
  IMMEDIATE = "Immediate",
  N_15 = "Net 15",
  N_30 = "Net 30",
  N_45 = "Net 45",
  N_60 = "Net 60",
  CUSTOM = "Custom",
}

export const paymentTermSubtext: { [key: string]: string } = {
  [PaymentTerms.IMMEDIATE]: "Payment is due immediately",
  [PaymentTerms.N_15]: "Due date is 15 days from invoice date",
  [PaymentTerms.N_30]: "Due date is 30 days from invoice date",
  [PaymentTerms.N_45]: "Due date is 45 days from invoice date",
  [PaymentTerms.N_60]: "Due date is 60 days from invoice date",
  [PaymentTerms.CUSTOM]: "Set custom due date for payment",
};

export enum DeleteConfirmationPopupType {
  deleteLut = "DELETE_LUT",
  deleteUserSignature = "DELETE_USER_SIGNATURE",
}

export enum PaymentLinkMethod {
  NET_BANKING = "NET_BANKING",
  CARDS = "CARDS",
  CARDS_AND_NET_BANKING = "CARDS_AND_NET_BANKING"
}
