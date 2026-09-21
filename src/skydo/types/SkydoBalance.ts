import { Invoice, SenderAlertDetails } from "./index";

export type Currency = string;
export type BalanceOutpayState = "INITIATING" | "INITIATED" | "FAILED";
export type MasterFundingVerificationState = "PENDING" | "REJECTED" | "APPROVED" | "IN_PROGRESS";
export type BalanceTransactionType = "WITHDRAW" | "TOPUP" | "OUTPAY";
export type BalanceTransactionStatus = "IN_PROGRESS" | "FAILED" | "SUCCESS";
export type WithdrawalType = "AUTOMATIC" | "MANUAL";
export type BalanceOutpayRequestVerificationState = "PENDING" | "APPROVED" | "REJECTED";
type BalanceTransactionRowType = "OPENING_BALANCE" | "BALANCE_UPDATE";

export interface SkydoBalanceSummary {
  amount: number;
  currency: Currency;
  holdAmount: number;
  usableAmount: number;
}

export interface SkydoBalanceDataResponse {
  balance: SkydoBalanceSummary;
  transactionsPostReview: BalanceTransactionRow[];
  transactionsUnderReview: BalanceUpdateTransactionRow[];
}

/** Shown after draft outpay / Aadhaar verify success; held in balance store until user dismisses. */
export interface OutpayAcknowledgementData {
  outpayAmount: number;
  charges: number;
  recipientName: string;
  outpayAcknowledgementUrl?: string;
}

export interface BaseBalanceTransactionSummary {
  transactionType: BalanceTransactionType;
  amount: number;
  currency: Currency;
  initiatedDate: string;
  summaryDescription: string;
}

export interface WithdrawTransactionSummary extends BaseBalanceTransactionSummary {
  transactionType: "WITHDRAW";
  withdrawType: WithdrawalType;
  invoices: Partial<Invoice>[];
}

export interface BaseOutpayTransactionSummary extends BaseBalanceTransactionSummary {
  transactionType: "OUTPAY";
  outpayInvoice: OutpayInvoiceDto;
  recipientName: string;
  charges: number;
  description: string;
}

export type PendingOutpayTransactionSummary = BaseOutpayTransactionSummary;

export interface OutpayTransactionSummary extends BaseOutpayTransactionSummary {
  chargesReceiptUrl: string | null;
  fileName: string | null;
}

export interface BaseTopupTransactionSummary extends BaseBalanceTransactionSummary {
  transactionType: "TOPUP";
  invoice: Partial<Invoice>;
  senderName: string;
}

export type PendingTopupTransactionSummary = BaseTopupTransactionSummary;

export interface TopupTransactionSummary extends BaseTopupTransactionSummary {
  charges: number;
  chargesReceiptUrl: string | null;
  fileName: string | null;
}

export type BalanceTransactionSummary =
  | WithdrawTransactionSummary
  | OutpayTransactionSummary
  | PendingTopupTransactionSummary
  | TopupTransactionSummary
  | PendingOutpayTransactionSummary;

export type BalanceTransactionRow = BalanceUpdateTransactionRow | OpeningBalanceTransactionRow;

interface BaseBalanceTransactionRow {
  rowType: BalanceTransactionRowType;
  timestamp: string;
  balance: number;
}

export interface BalanceUpdateTransactionRow extends BaseBalanceTransactionRow {
  rowType: "BALANCE_UPDATE";
  referenceId: string;
  ledgerAmount: number;
  balanceTransactionType: BalanceTransactionType;
  amount: number;
  currency: Currency;
  activityDescription: string;
  status: BalanceTransactionStatus;
  summary: BalanceTransactionSummary;
  date: string;
}

export interface OpeningBalanceTransactionRow extends BaseBalanceTransactionRow {
  rowType: "OPENING_BALANCE";
  date: string;
  currency: Currency;
}

// --- API / query types ---

export interface MasterFunding {
  id: string;
  senderName: string | null;
}

export interface MasterFundingVerification {
  id: string;
  amount: string;
  currency: Currency;
  invoiceId: number;
  state: MasterFundingVerificationState;
  creationTimestamp: string;
  updatedTimestamp: string;
}

export interface MasterFundingInvoiceMapping {
  id: string;
  masterFundingId: string;
  invoiceId: string;
  masterFundingVerificationId: string;
}

export interface BalanceTopup {
  id: string;
  amount: number;
  currency: Currency;
  masterFundingVerificationId: string;
}

export interface BalanceTopupCharges {
  id: number;
  amount: number;
  currency: Currency;
  balanceTopupId: string;
  prn: string | null;
}

export interface BalanceOutpay {
  id: string;
  amount: number;
  currency: Currency;
  balanceOutpayVerificationId: string;
  state: BalanceOutpayState;
}

export interface BalanceOutpayTopupMapping {
  id: string;
  balanceTopupId: string;
  fromAmount: number;
  balanceOutpayRequestVerificationId: string;
}

export interface BalanceOutpayVerification {
  id: string;
  amount: number;
  currency: Currency;
  outpayRecipientId: string;
  creationTimestamp: string;
  updatedTimestamp: string;
}

export interface OutpayRecipient {
  id: string;
  name: string;
}

export interface OutpayCharges {
  id: string;
  amount: number;
  currency: Currency;
  balanceOutpayId: string;
  prn: string | null;
  outpayChargesReceipt: OutpayChargesReceipt;
}

export interface OutpayChargesReceipt {
  fileUrl: string | null;
  fileName: string | null;
}

export interface ExporterBalance {
  amount: number;
  currency: Currency;
  holdAmount: number;
}

export interface ExporterBalanceAccountLedger {
  id: number;
  amount: number;
  currency: Currency;
  updatedBalance: number;
  creditId: string | null;
  debitId: string | null;
  entryType: BalanceTransactionType;
  timestamp: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  currency: Currency;
  invoiceId: number;
  balanceTopupId: string;
  withdrawalBatchId: string;
}

export interface WithdrawalBatch {
  id: string;
  creationTimestamp: string;
  amount: number;
  currency: Currency;
  type: WithdrawalType;
  status: WithdrawalBatchStatus;
}

export type WithdrawalBatchStatus = "PENDING" | "PROCESSED" | "SETTLED";

/** Balance topup as in GetExporterBalancePageData ledger (with verification + invoice + sender) */
export type BalanceTopupLedgerEntry = BalanceTopup & {
  balanceTopupCharges: BalanceTopupCharges & {
    balanceTopupChargesReceipt: {
      fileUrl: string | null;
      fileName: string | null;
    };
  };
  masterFundingVerification: Partial<MasterFundingVerification> & {
    invoice: Partial<Invoice>;
    masterFundingInvoiceMapping: Partial<MasterFundingInvoiceMapping> & {
      masterFunding: Partial<MasterFunding>;
    };
  };
};

export type WithdrawalLedgerEntry = Partial<WithdrawalBatch> & {
  withdrawals: Partial<Withdrawal> &
    {
      amount: number;
      invoice: Partial<Invoice> & { id: number };
    }[];
};

export type OutpayLedgerEntry = Partial<BalanceOutpay> & {
  balanceOutpayVerification: Partial<BalanceOutpayVerification> & {
    outpayRecipient: Partial<OutpayRecipient>;
    outpayInvoice: OutpayInvoiceDto;
  };
  outpayCharges: Partial<OutpayCharges>;
};

export type ExporterBalanceLedgerEntry = Partial<ExporterBalanceAccountLedger> & {
  balanceTopup?: BalanceTopupLedgerEntry | null;
  withdrawalBatch?: WithdrawalLedgerEntry | null;
  balanceOutpay?: OutpayLedgerEntry | null;
};

/** Outpay verification as returned by GraphQL (with optional recipient context) */
export interface BalanceOutpayRequestVerification {
  id: string;
  amount: number;
  currency: Currency;
  outpayRecipientId: string;
  creationTimestamp: string;
  updatedTimestamp: string;
  outpayInvoiceId: string;
  status: BalanceOutpayRequestVerificationState;
  outpayRecipient: OutpayRecipient;
  outpayInvoice: OutpayInvoiceDto;
  balanceOutpayTopupMappings: Partial<BalanceOutpayTopupMapping> &
    {
      fromAmount: number;
      balanceTopup: Partial<BalanceTopup> & {
        masterFundingVerification: Partial<MasterFundingVerification> & {
          invoice: Partial<Invoice>;
        };
      };
    }[];
}

/** Single balance item when API returns array or partial */
export type ExporterBalanceItem = Partial<ExporterBalance>;

// --- GetExporterBalancePageData response types ---

/** Master funding verification as returned in masterFundingVerifications list (flat) */
export interface MasterFundingVerificationPageItem {
  id: string;
  creationTimestamp: string;
  updatedTimestamp: string;
  amount: number;
  currency: string;
  state: MasterFundingVerificationState;
  invoice: Partial<Invoice>;
  masterFundingInvoiceMapping: {
    masterFunding: Partial<MasterFunding>;
  };
}

/** REQUEST structures : */
export interface InitiateWithdrawalBatchRequest {
  type: WithdrawalType;
}

export interface ProcessWithdrawalBatchRequest {
  withdrawalBatchId: string;
  amount: number;
  currency: Currency;
}

/** Item in ProcessWithdrawalBatchResponse.withdrawalInvoiceMapping */
export interface WithdrawalInvoiceDto {
  invoice: Partial<Invoice>;
  withdrawalDto: Partial<Withdrawal>;
}

/** Response from POST /exporter-balance/withdraw/process */
export interface ProcessWithdrawalBatchResponse {
  withdrawalInvoiceMapping: WithdrawalInvoiceDto[];
}

// --- Draft outpay (make payout flow) ---

export type DraftOutpayStatus = "INITIATED" | "CREATED" | "FINALISED" | string;

export interface DraftBalanceOutpayDto {
  id: string;
  exporterId: number;
  amount: number | null;
  currency: string | null;
  outpayRecipientId: string | null;
  outpayInvoiceId: string | null;
  balanceOutpayRequestVerificationId: string | null;
  outpayAuthorized: boolean;
  status: DraftOutpayStatus;
  vendor: string | null;
}

/** Outpay ACH details as returned by GetDraftBalanceOutpay (nested in outpayRecipient) */
export interface DraftOutpayAchDetailsDto {
  accountNumber: string | null;
  routingCode: string | null;
  outpayRecipientId: string | null;
  bankName: string | null;
  bankCountry: string | null;
}

/** Outpay SWIFT details as returned by GetDraftBalanceOutpay (nested in outpayRecipient) */
export interface DraftOutpaySwiftDetailsDto {
  outpayRecipientId: string | null;
  swiftCode: string | null;
  accountNumber: string | null;
  iban: string | null;
  bankName: string | null;
  bankAddressStreet1: string | null;
  bankAddressStreet2: string | null;
  bankAddressCity: string | null;
  bankAddressState: string | null;
  bankAddressPostalCode: string | null;
  bankAddressCountry: string | null;
}

/** Outpay recipient as returned by GetDraftBalanceOutpay */
export interface DraftOutpayRecipientDto {
  id: string;
  name: string | null;
  paymentMethod: string | null;
  streetLine1: string | null;
  streetLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  outpayAchDetails: DraftOutpayAchDetailsDto | null;
  outpaySwiftDetails: DraftOutpaySwiftDetailsDto | null;
}

/** Outpay invoice as returned by GetDraftBalanceOutpay */
export interface OutpayInvoiceDto {
  id: string;
  amount: number | null;
  currency: string | null;
  fileUrl: string | null;
  outpayRecipientId: string | null;
  invoiceNumber: string;
  description: string;
}

/** Draft balance outpay as returned by GraphQL (with nested recipient and invoice) */
export interface DraftBalanceOutpayGraphQLDto extends DraftBalanceOutpayDto {
  outpayRecipient: DraftOutpayRecipientDto | null;
  outpayInvoice: OutpayInvoiceDto | null;
}

// --- Outpay invoice upload (draft payout flow) ---

export type OcrVendor = string;

export interface OcrParsedOutpayInvoiceDto {
  id: number;
  unparsedOutpayInvoiceId: number;
  recipientName: string | null;
  bankAccountNumber: string | null;
  routingNumber: string | null;
  recipientAddressLine1: string | null;
  recipientAddressLine2: string | null;
  recipientPostalCode: string | null;
  recipientCity: string | null;
  recipientCountry: string | null;
  outpayAmount: number | null;
  purposeOfOutpay: string | null;
  invoiceNumber: string | null;
  dueDate: string | null;
  ocrVendor: OcrVendor;
}

export interface UploadOutpayInvoiceResponse {
  unparsedOutpayInvoiceId: number;
  ocrParsedOutpayInvoice: OcrParsedOutpayInvoiceDto;
}

// --- Balance Invoice Summary (GraphQL BalanceInvoiceSummary query) ---

/** Charge amount as returned by GraphQL (BigDecimal serialised as string) */
export interface BalanceInvoiceSummaryChargeDto {
  amount: string;
  currency: string;
}

/** Balance topup in balance invoice summary response */
export interface BalanceInvoiceSummaryBalanceTopupDto {
  id: string;
  balanceTopupCharges: BalanceInvoiceSummaryChargeDto[] | null;
}

/** Master funding verification in balance invoice summary response */
export interface BalanceInvoiceSummaryMasterFundingVerificationDto {
  id: string;
  amount: string;
  currency: string;
  state: MasterFundingVerificationState;
  creationTimestamp?: string;
  balanceTopup: BalanceInvoiceSummaryBalanceTopupDto | null;
  senderAlertDetails?: SenderAlertDetails[];
}

/** Balance outpay in balance invoice summary response */
export interface BalanceInvoiceSummaryBalanceOutpayDto {
  id: string;
  /** This topup's slice of the outpay, covering both the payout and its Skydo charges. */
  fromAmount: string;
  /** Part of {@link fromAmount} that reached the vendor. Null until the backend resolves the split. */
  payoutAmount?: string | null;
  /** Part of {@link fromAmount} that was a Skydo outpay charge. Null until the backend resolves the split. */
  chargesAmount?: string | null;
  currency: string;
  balanceOutpayVerification: Partial<BalanceOutpayRequestVerification>;
}

/** Withdrawal in balance invoice summary response */
export interface BalanceInvoiceSummaryWithdrawalDto {
  id: string;
  amount: string;
  currency: string;
}

/** Raw response of BalanceInvoiceSummary GraphQL query */
export interface BalanceInvoiceSummaryResponse {
  invoiceMasterFundingVerifications: BalanceInvoiceSummaryMasterFundingVerificationDto[];
  invoiceBalanceOutpayTopupMappings: BalanceInvoiceSummaryBalanceOutpayDto[];
  invoiceWithdrawals: BalanceInvoiceSummaryWithdrawalDto[];
}

/** Sender-case alert tied to the master funding verification that raised it (correct amount/currency per row). */
export interface BalanceInvoiceSenderAlertRow {
  masterFundingVerificationId: string;
  senderAlertDetails: SenderAlertDetails;
  amount: number;
  currency: Currency;
  /** MFV creation time; shown as “received on” in sender-case popup */
  creationTimestamp: string;
}

/** Computed summary values (all numeric) */
export interface BalanceInvoiceSummaryResult {
  mappedAmount: number;
  mappedAmountUnderVerification: number;
  skydoFees: number;
  outwardPayments: number;
  withdrawalAmount: number;
  currency: Currency;
  senderAlertRows: BalanceInvoiceSenderAlertRow[];
}
