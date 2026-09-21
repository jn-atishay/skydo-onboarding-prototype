import { EInvoice } from "./NewInvoiceTypes";
import { FundingData } from "./Funding";
import { TransactionIncident } from "./TransactionIncident";
import { DataLayerPushDto } from "../analytics/analyticsTypes";
import type { FailureReasonDto } from "../components/PaymentLinks/PaymentLinksList";

export * from "./ApiResponses";

export type AccountDetails = {
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  accountType?: string;
  beneAddress?: string;
  accountHolderName?: string;
  exporterAccountNumb?: string;
  companyName?: string;
  companyShortName?: string;
  director?: string;
  paymentMethod?: string;
};

export type FileDetails = {
  fileUrl: string;
  fileName: string;
  createdAt?: string;
  receiptDate?: string;
};

export type BankVerificationErrorCode =
  | undefined
  | "BANK_NAME_MATCHED_FAILED"
  | "BANK_NAME_MATCHED_FAILED_INDIVIDUAL_AND_ENTITY"
  | "INVALID_BANK_DETAILS"
  | "MAX_RETRIES_EXCEEDED"
  | "INVALID_IFSC"
  | "ALREADY_ACTIVE";

export type BankFieldError = {
  accountNumber?: string;
  ifscCode?: string;
};

export interface CurrencyAmountPair {
  amount: number;
  currency: string;
}

export enum ImporterType {
  ENTITY = "ENTITY",
  PLATFORM = "PLATFORM",
}

export type Importer = {
  businessName: string;
  emailAddress?: string;
  id?: number;
  exporterId?: number;
  country?: string;
  identifier?: string;
  importerType?: ImporterType;
};

export type DBSSettlementDTO = {
  localUTR?: string;
};

export type HDFCSettlementDTO = {
  localUTR?: string;
};

export type DBSCashBackSettlementDTO = {
  localUTR?: string;
  updatedAt?: string;
};

export type PricingRecord = {
  totalCharges?: number;
  usdCharges?: number;
  inrCharges?: number;
  localCharges?: number;
  tax?: number;
  creditUsedUSD?: number;
  creditUsedINR?: number;
  inrChargesBeforeCredits?: number;
  instantSettlementChargesInr?: number;
  instantSettlementChargesCurrency?: string;
  instantSettlementCharges?: number;
};

export type FXDeal = {
  bookingRate: number;
  interbankRate: number;
  currency: string;
  bookingTimeStamp: string;
  sourceCurrencyToUsdRate?: number;
  usdToInrRate?: number;
  ibrTimestamp?: string;
};

export type Payment = {
  id: number;
  pricingBucket?: string;
  executedPricingCondition?: string;
  creditUsedUSD?: number;
  creditUsedINR?: number;
  fxDeal: FXDeal;
  transaction: Transaction[];
  paymentReceipt?: FileDetails;
  cashBackRecord: CashbackRecord;
  manualCashBackEntry: ManualCashBackEntry;
  rewardLedger: RewardLedger;
  sezType: Boolean;
};

export type Transaction = {
  id: number;
  createdAt: string;
  amountSettled: number;
  transactionId: number;
  actionTimestamp: string;
  transactionState: string;
  amount: number;
  srn: string;
  dbsSettlement?: DBSSettlementDTO;
  hdfcSettlement?: HDFCSettlementDTO;
  transactionMetadata?: TransactionMetadata;
  pricingRecord?: PricingRecord;
  payment: Payment;
  currency: string;
  transactionAudit: Transaction[];
  fira?: FileDetails;
  settlementDate?: string;
  transactionIncident?: TransactionIncident[];
  senderAlertDetails?: SenderAlertDetails;
  // fundingTransactionMap: FundingTransactionMapData[];
  funding: FundingData[];
  collectionType?: "PAYOUT" | "REGULAR" | "AMAZON";
  vendor?: string;
  fixedInr?: number;
  failureReasonDto?: FailureReasonDto;
};

export type SenderAlertDetails = {
  caseId: number;
  alertStatus: string;
  alertDocUrls?: string[];
  senderName: string;
  proofType: string;
  proofContent: string;
  proofSampleUrl?: string;
  proofTutorialUrl?: string;
};

export type Invoice = {
  invoiceType: string;
  invoiceId: number;
  amount: number; //dollar amount
  submittedDate: string;
  currency: string;
  exporterSystemInvoiceId: string;
  fileLink: string;
  id: number; // srn id to be used for details call
  // this `importer` comes with filtered invoice list
  // TODO: should we consider refactoring the home page table as well?
  importerName?: string;
  importer: Importer;
  status: string;
  transaction?: Transaction[];
  isRefundable: boolean;
  purposeOfInvoice: string; //purpose code
  purposeCode: PurposeCode;
  reasonToArchive: string;
  dueDate?: string;
  fileName?: string;
  raisedDate?: string;
  paymentProcessor?: string;
  invoiceMetadata?: InvoiceMetadata;
  bankAccount?: BankAccount;
  amountMapped: number;
  expectedAmount: number;
  expectedCurrency: string;
  eInvoice?: EInvoice;
  isTest?: boolean;
  didSendInvoiceOrReminderEmail: boolean;
  recurringInvoiceConfigId?: number;
  readyToTransact?: boolean;
  activationRewardOnInvoice?: ActivationRewardDto;
  paymentLink?: string;
  veemDebitSuccessful?: boolean;
  invoiceInstantSettlementDetails?: InvoiceInstantSettlement;
};

export type ActivationRewardDto = {
  applicable: boolean;
  campaignName: string;
  expiryDate?: string;
};

export enum InvoiceInstantSettlementEligibilityState {
  NOT_ELIGIBLE = "NOT_ELIGIBLE",
  ELIGIBLE = "ELIGIBLE",
  IN_PROGRESS = "IN_PROGRESS",
  SETTLED = "SETTLED",
}

export enum TransactionSettlementPaymentMethod {
  RTGS = "RTGS",
  IMPS = "IMPS",
  NEFT = "NEFT",
}

export type InstantSettlementTxnDetails = {
  importerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
};

export type InvoiceInstantSettlementData = {
  numberOfInvoices: number;
  numberOfTransactions: number;
  transactionDetails: InstantSettlementTxnDetails[];
  totalAmount: number;
  totalAmountCurrency: string;
  baseCharges: number;
  baseChargesCurrency: string;
  extraCharges: number;
  extraChargesCurrency: string;
  instantSettlementPricingPercentage: number;
  normalSettlementDate: string;
  expectedInstantSettlementTime: string;
  settlementMethod: TransactionSettlementPaymentMethod;
};

export type InvoiceInstantSettlement = {
  eligibilityState: InvoiceInstantSettlementEligibilityState;
  data?: InvoiceInstantSettlementData;
  settlementMethodInCaseOfInitiatedInstantSettlement?: TransactionSettlementPaymentMethod;
  bufferRequired?: boolean;
};

export enum InstantSettlementPreviewStatus {
  AVAILABLE = "AVAILABLE",
  NOT_APPLICABLE = "NOT_APPLICABLE",
  NOT_ELIGIBLE = "NOT_ELIGIBLE",
  IN_PROGRESS = "IN_PROGRESS",
  SETTLED = "SETTLED",
}

export enum InstantSettlementGstSplitType {
  IGST = "IGST",
  CGST_SGST = "CGST_SGST",
  NONE = "NONE",
}

// BE returns decimal scalars as strings ("15000.00") or numbers depending on the field
export type InstantSettlementAmount = string | number;

export type InstantSettlementMoney = {
  amount: InstantSettlementAmount;
  currency: string;
};

export type InstantSettlementGst = {
  taxPercent: InstantSettlementAmount;
  splitType: InstantSettlementGstSplitType;
};

export type InstantSettlementScopeTxn = {
  importerName: string;
  invoiceNumber: string;
  amount: InstantSettlementAmount;
  currency: string;
};

export type InstantSettlementScope = {
  numberOfInvoices: number;
  numberOfTransactions: number;
  totalAmount: InstantSettlementAmount;
  totalAmountCurrency: string;
  transactions: InstantSettlementScopeTxn[];
};

export type InstantSettlementPreviewBreakdown = {
  settlementMethod: TransactionSettlementPaymentMethod | null;
  normalSettlementDate: string;
  bufferRequired: boolean;
  instantSettlementFeePercentage: number;
  // Base-fee tier flag: null = flat tier (render platformFee amount, e.g. "$19"); a fraction (0.003) = 0.3% tier.
  platformFeePercentage: number | null;
  scope: InstantSettlementScope;
  grossAmount: InstantSettlementMoney;
  platformFee: InstantSettlementMoney;
  regionalPremium: InstantSettlementMoney | null;
  instantSettlementFee: InstantSettlementMoney;
  gst: InstantSettlementGst;
};

export type InstantSettlementPreview = {
  status: InstantSettlementPreviewStatus;
  disabledReason: string | null;
  breakdown: InstantSettlementPreviewBreakdown | null;
};

// INR-converted, ready-to-render breakdown (all values in INR)
export type InstantSettlementInrBreakdown = {
  grossInr: number;
  platformFeeInr: number;
  regionalPremiumInr: number;
  instantSettlementFeeInr: number;
  netFeesInr: number;
  gstInr: number;
  gstSplitType: InstantSettlementGstSplitType;
  settledInr: number;
  fxRateUsed: number;
  fxRateTimestamp: string;
};

export type BankAccount = {
  accountNumber: string;
  bankMetadata?: BankMetadata;
};

type BankMetadata = {
  bankName: string;
  /**
   * Not being used as of now
   */
  bankCode: string;
  logoURL: string;
};

export enum MarkFullyPaidReason {
  REMAINDER_PAID_OUTSIDE = "REMAINDER_PAID_OUTSIDE",
  NO_FURTHER_PAYMENT = "NO_FURTHER_PAYMENT",
}

export type InvoiceMetadata = {
  paymentProcessorDetails?: string;
  paymentDate?: string;
  paymentAmountInr?: number;
  source: string;
  remainderAmount?: number;
  remainderCurrency?: string;
  markFullyPaidReason?: MarkFullyPaidReason;
};

export enum InvoiceSource {
  CHALLAN = "CHALLAN",
  CHALLAN_RECURRING = "CHALLAN_RECURRING",
  EMAIL = "EMAIL",
  EXPORTER_DASHBOARD = "EXPORTER_DASHBOARD",
  EXPORTER_DASHBOARD_MOBILE = "EXPORTER_DASHBOARD_MOBILE",
  ZOHO_BOOKS = "ZOHO_BOOKS",
}

type TransactionMetadata = {
  expectedSettlementDate?: string;
  bankAccount?: BankAccount;
  creationSource?: "COLLECTION" | "WITHDRAWAL" | null;
};

export type CurrencyWisePaymentSummary = {
  currency: string;
  amount: number;
  totalInvoices: number;
};

export type PaymentsSummaryCardDetails = {
  outstandingInvoices: CurrencyWisePaymentSummary[];
  inProgressInvoices: CurrencyWisePaymentSummary[];
};

export interface SummaryDataDto extends PaymentsSummaryCardDetails {
  summaryChartList: RevenueSummaryChartDto[];
}

export type RevenueSummaryChartDto = {
  month: string;
  paidAmount: number;
  invoicedAmount: number;
  pending: number;
  startDate?: string;
  endDate?: string;
  isDataIncomplete?: boolean;
};

export type ImporterAnalyticsResponse = {
  importerAnalyticsData: RevenueSummaryChartDto[];
  fxRateMap: { [key: string]: number };
};

export type BusinessAnalyticsResponse = {
  businessAnalyticsData: RevenueSummaryChartDto[];
  fxRateMap: { [key: string]: number };
};

export type ImporterSummaryResponse = {
  top5ImporterList: ImporterSummaryChartDto[];
  totalImporterCount: number;
  totalInvoicedAmount: number;
  otherImporterSummary: OtherImporterSummary;
};

export type CurrencyWiseImporterPaymentSummary = {
  avgInvoiceAmount: number;
  pending: number;
  currency: string;
  totalInvoices: number;
  pendingInvoices: number;
};

export type CurrencyWiseImporterPaymentSummaryResponse = {
  listOfCurrencyLevelRevenue: [CurrencyWiseImporterPaymentSummary];
  importerName: String;
  importerId: number;
  avgPaymentDays: number;
};

export type OtherImporterSummary = {
  paidAmount: number;
  invoicedAmount: number;
  pending: number;
  nextImporterName?: string;
};

export type ImporterSummaryChartDto = {
  paidAmount: number;
  invoicedAmount: number;
  pending: number;
  importerName: string;
  importerId: number;
};

export type ExporterUserDetails = {
  fullName: string;
  registeredName: string;
  emailAddress: string;
  exporter?: { [key: string]: any };
};
export type PurposeCode = {
  code: string;
  description: string;
};

export type PurposeCodeDetails = {
  defaultPurposeCode: string;
  defaultPurposeCodeDescription?: string;
};

export type DefaultPurposeCode = {
  defaultCode: string;
};

export type PurposeCodeList = PurposeCode[];

export type FXCalc = {
  amount?: number;
  convertedAmount: number;
  interBankRate?: number;
  interBankRateTimestamp: string;
  settledAmount?: number;
  skydoCharges?: number;
  skydoChargesTax?: number;
  skydoFeesUSD?: number;
  localCharges?: number;
  pricingBucket?: string;
  executedPricingCondition?: string;
  chargeCurrency: string;
  totalSkydoCharges?: number;
  usdToInrRate?: number;
  sourceCurrency: string;
  overrideExecutedPricingCondition: boolean;
  creditUsedUSD?: number;
  creditUsedINR?: number;
  inrChargesBeforeCredits?: number;
  instantSettlementCharges?: number;
  instantSettlementChargesCurrency?: string;
  instantSettlementChargesInr?: number;
};

export interface VirtualAccountDetail {
  accountNumber: string;
  routingCodeType: string;
  paymentType: string;
  routingNumber: string;
  bankName: string;
  currency: string;
  bankAddress: string;
  accountProvider?: string;
  bankCode?: string;
  accountRole?: string;
}

export interface CompleteVirtualAccountDetail extends VirtualAccountDetail {
  accountHolderName: string;
  paymentMethod: string;
  accountType: string;
  fedWireRoutingNumberUS?: string;

  [key: string]: any;
}

export type CountryVsAccountDetails = {
  [key: string]: ExtendedCompleteVirtualAccountDetail;
};

export type ExtendedCompleteVirtualAccountDetail = CompleteVirtualAccountDetail & {
  accountsByUsageType?: Partial<Record<string, CompleteVirtualAccountDetail>>;
};

export type PaymentTransaction = {
  id: number;
  amount: number;
  amountSettled?: number;
  settlementDate?: string;
  currency: string;
  collectionType?: "PAYOUT" | "REGULAR" | "AMAZON";
  vendor?: string;
  invoice: {
    id?: number;
    exporterSystemInvoiceId: string;
  };
  pricingRecord?: PricingRecord;
  paymentReceipt?: FileDetails;
  fira?: FileDetails;
};

export type CashbackRecord = {
  commercialCreditNoteUrl?: string;
  cashbackProcessState: string;
  ccnFilename?: string;
  dbsCashBackSettlement?: DBSCashBackSettlementDTO;
  cashbackReasonType?: CashbackReasonType;
};

export enum CashbackReasonType {
  OFFLINE_CASHBACK = "OFFLINE_CASHBACK",
  DEFAULT_CASHBACK = "DEFAULT_CASHBACK",
  REFEREE_CASHBACK = "REFEREE_CASHBACK",
  REFERRER_CASHBACK = "REFERRER_CASHBACK",
  ACTIVATION_REWARD = "ACTIVATION_REWARD",
}

export type ManualCashBackEntry = {
  cashbackReasonType: CashbackReasonType;
};

export type RewardLedger = {
  rewardValue: Number;

  itemValue: Number;
  transactionType: string;
};

export type PaymentDetailsDto = {
  id: number;
  amount: number;
  currency: string;
  totalCharges?: number;
  usdCharges?: number;
  localCharges?: number;
  pricingBucket?: string;
  executedPricingCondition?: string;
  creditUsedUSD?: number;
  creditUsedINR?: number;
  inrChargesBeforeCredits?: number;
  inrCharges?: number;
  tax?: number;
  amountSettled?: number;
  prn: string;
  importers: Importer[];
  fxDeal?: FXDeal;
  transaction: PaymentTransaction[];
  paymentReceipt?: FileDetails;
  cashbackRecord?: CashbackRecord;
  manualCashBackEntry?: ManualCashBackEntry;
  activationRewardOnPayments?: ActivationRewardDto;
  sezType: boolean;
};

export interface Holiday {
  id: number;
  date: string;
  description?: string;
}

export type HolidayType = "WEEKEND" | "BANK_HOLIDAY" | "NON_HOLIDAY" | "TODAY";

export type PaymentAndChargesListData = {
  id: number;
  amount: number;
  currency: string;
  usdCharges?: number;
  localCharges?: number;
  creditUsedUSD?: number;
  inrCharges?: number;
  tax?: number;
  amountSettled?: number;
  prn: string;
  importers: Importer[];
  transaction: PaymentTransaction[];
  cashBackRecord?: CashbackRecord;
  paymentReceipt?: FileDetails;
};

/**
 * Useful for extending zustand API functions
 * Create your request and extend this interface
 */
export interface ApiFuncParams {
  onSuccess?: (resp: any) => void;
  onError?: (err: any) => void;
}

export type BankAccountField = {
  label: string;
  value: string;
};

export type PaymentMethodField = {
  accountFields: BankAccountField[];
  paymentLink: string;
  passOnFee: boolean;
};

export enum EmailTemplate {
  INVOICE_EMAIL = "INVOICE_EMAIL",
  PAYMENT_REMINDER = "PAYMENT_REMINDER",
  PAYMENT_CONFIRMATION = "PAYMENT_CONFIRMATION",
}

export type DocTypeDescription = {
  docType: string;
  description: string;
  docName: string;
  businessType: string;
  isMandatory: boolean;
};

export type DecodedToken = {
  userId: number;
  iat: number;
  roles: any;
  exp: number;
};

export enum SgAccountStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  DELETED = "DELETED",
}

export enum SgAccountAckStatus {
  ACK1 = "ACK1",
  ACK2 = "ACK2",
}

export type WindowInstance = Window & typeof globalThis & { dataLayer: { push: (data: DataLayerPushDto) => void } };

export type InvoiceLessTableRow = {
  isTest: boolean;
  paymentId: string;
  payerName: string;
  paymentStatus: string;
  receivedOn: string;
  amount: number;
  currency: string;
  settledOn: string;
  invoiceId: number;
  invoice: Invoice;
};
