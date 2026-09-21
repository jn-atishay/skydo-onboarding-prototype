interface EbrcBasicDetails {
  isEbrcActive: boolean;
  isHdfc: boolean;
  showFiraFlow?: boolean;
  isFiraFirstTime?: boolean;
}

export enum EbrcBatchStatus {
  CREATION_REQUESTED = "CREATION_REQUESTED",
  USER_APPROVAL_PENDING = "USER_APPROVAL_PENDING",
  REJECTED = "REJECTED",
  USER_APPROVED = "USER_APPROVED",
  EBRC_PENDING = "EBRC_PENDING",
  EBRC_CREATION_FAILED = "EBRC_CREATION_FAILED",
  EBRC_SUCCESS = "EBRC_SUCCESS",
}

export enum FiraSbBatchStatus {
  CREATION_REQUESTED = "CREATION_REQUESTED",
  USER_APPROVAL_PENDING = "USER_APPROVAL_PENDING",
  REJECTED = "REJECTED",
  USER_APPROVED = "USER_APPROVED",
}

export interface IrmDto {
  id: string;
  irmNumber: string;
  remitterName: string;
  remittanceFccAmount: number;
  remittanceFcc: string;
  irmAvailableAmount: number;
  irmApprovedAmount?: number;
  irmIssueDate: string;
  purposeOfRemittance: string;
  ebrcEligibleTransaction?: EligibleTransactions;
}

export interface EligibleTransactions {
  id: string;
  importerName: string;
  settledAmount: number;
  amount: number;
  currency: string;
  srn: string;
  purposeCode: string;
  settlementDate?: string;
  hdfcSettlement?: {
    localUTR: string;
  };
}

export interface IrmAndEligibleTransactionDto {
  id: string;
  irmNumber?: string;
  remitterName: string;
  remittanceFccAmount: number;
  remittanceFcc?: string;
  irmAvailableAmount?: number;
  irmApprovedAmount?: number;
  irmIssueDate?: string;
  purposeOfRemittance: string;
  ebrcEligibleTransaction?: EligibleTransactions;
}

export interface ShippingBill {
  id: string;
  sbNumber: string;
  originalFileName: string;
  invoiceNumber: string;
  url?: string;
  ebrcConsumedAmount?: number;
  sbFobValueInr?: number;
}

export interface EbrcBatchDetails {
  batchStatus: EbrcBatchStatus;
  url?: string;
  mappedShippingBills: number;
}

export interface DgftConfigDetails {
  lastIrmSyncDate?: string;
}

export interface IrmHdfcHomeResponse {
  fetchIrms: IrmDto[];
  pendingEligibleTransactions: EligibleTransactions[];
  unmappedShippingBills: ShippingBill[];
  approvalPendingEbrcBatchDetails?: EbrcBatchDetails;
  dgftConfigDetails?: DgftConfigDetails;
}

export interface PendingHdfcIrmHomeResponseDto {
  pendingIrms: IrmAndEligibleTransactionDto[];
  unmappedShippingBills: ShippingBill[];
  approvalPendingEbrcBatchDetails?: EbrcBatchDetails;
  dgftConfigDetails?: DgftConfigDetails;
}

//   val id: String,
//   val ebrcBatchId: String,
//   val exporterId: Long,
//   val ebrcNumber: String,
//   val ebrcDate: LocalDate,
//   val ebrcStatus: EbrcStatus,
//   val billNo: String,
//   val sbCumInvoiceNumber: String ?= null,
//   val sbCumInvoiceDate: LocalDate ?= null,
//   val realizedAmount: BigDecimal,
//   val currency: Currency,
//   val realizationDate: LocalDate ?= null,
//   val brcUtilStatus: String ?= null

export interface EbrcDto {
  id: string;
  ebrcBatchId: string;
  exporterId: string;
  ebrcNumber: string;
  ebrcDate: string;
  ebrcStatus: string;
  billNo: string;
  sbCumInvoiceNumber: string;
  sbCumInvoiceDate: string;
  realizedAmount: number;
  currency: string;
  realizationDate: string;
  brcUtilStatus?: string;
  shippingBill: {
    consigneeName: string;
  };
}

export interface EbrcListResponse {
  allAvailableEbrc: EbrcDto[];
}

// FIRA Types for Non-HDFC flow
export interface FiraDto {
  id: string;
  firaNumber?: string;
  payerName: string;
  amount: number;
  currency: string; // FCY currency (e.g., USD, EUR)
  firaAvailableAmount?: number;
  firaApprovedAmount?: number;
  firaDate?: string;
  purposeCode?: string;
  transactionId?: string;
  srn?: string;
  settlementDate?: string;
  fileUrl?: string;
  fcyAmount?: number; // Foreign currency amount
  transactionReferenceNumber?: string;
}

export interface FiraHomeResponse {
  firaList: FiraDto[];
  unmappedShippingBills: ShippingBill[];
  approvalPendingFiraBatchDetails?: FiraSBBatchDetails;
}

export interface FiraSBBatchDetails {
  batchStatus: FiraSbBatchStatus;
  url?: string;
  mappedShippingBills: number;
}

export type { EbrcBasicDetails };
