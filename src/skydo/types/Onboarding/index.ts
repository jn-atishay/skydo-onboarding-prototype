import { Option, SearchTag } from "../atomicComponentTypes";

export enum VerificationStep {
  EXPORTER_BANK_ACCOUNT = "EXPORTER_BANK_ACCOUNT",
  EXPORTER_GST = "EXPORTER_GST",
  EXPORTER_PAN_FETCHED = "EXPORTER_PAN_FETCHED",
}

export type TypeBankDetails = {
  ifscCode?: string;
  accountNumber?: string;
  accountHolderName?: string;
  isValid?: string;
  bankBranch?: string;
  retry?: string; 
  isHdfcBankAccount?: boolean;
};

export type UBO = {
  fullName: string;
  id: number;
  isPrimary: boolean;
  pan?: string;
  nameMatched?: boolean;
};

export enum BankAccountStep {
  CHANGE_BANK_ACCOUNT,
  NOT_STARTED,
  DETAILS_FILLED,
  STEP_COMPLETED,
}

export type ChangeBusinessNameFormValues = {
  businessLegalName: string;
  shortname: string;
};

export enum OnboardingTag {
  VKYC = "VKYC",
  NON_VKYC = "NON_VKYC",
}

export interface DocUploadProps {
  isSectionVisible: boolean;
  isDone: boolean;
}

export type ExporterIndustry = {
  industryId: number;
  industryDescription?: string;
  industryInfoResponse?: string;
};

export type SelectedExporterIndustry = {
  industryId: number;
  industryDescription?: string;
  industryInfoResponse?: string;
  industryType: string;
};

export type Industry = {
  id: number;
  name: string;
  riskCategory: string;
  metadata: IndustryMetadata[];
  config: IndustryConfig;
};

export type IndustryConfig = {
  searchTags: SearchTag[];
  fixedOption: boolean;
};

export type IndustryMetadata = {
  question: string;
  subQuestion: string;
  options: IndustryQuestionOptions;
};

export type IndustryQuestionOptions = {
  yes: string;
  no: string;
};

export type UtmSource = {
  utmSource: string;
  utmSourceValue: string;
};

export type IecDetails = {
  ieCode: String;
  verifiedBy: String;
};

export type ExporterKyc = {
  iecDetails?: IecDetails;
  /** From backend; may be string (e.g. "CSB5") or object { shippingMethod: "CSB5" } */
  shippingMethod?: string | { shippingMethod?: string };
};

export type ActiveKycDocument = {
  docUrl: string;
  isDocVerified: boolean;
  docType: string;
  complianceComments?: string;
  isDocRequested?: boolean;
  isDocumentFetched?: boolean;
  preSignedUrl?: string;
  lastUploadedTime?: Date;
  docName?: string;
};

export type DocTypeMasterEntry = {
  docType: string;
  description: string;
  docName: string;
  businessType: string;
  isMandatory: boolean;
};

/** Which dropdown's declaration row opened the popup — they release different gates. */
export type DeclarationSource = "DOC_ONE" | "DOC_TWO";

/** A selectable document row in either doc-type dropdown. */
export interface DocOptionRow {
  label: string;
  value: string;
  businessType?: string;
  subText?: string;
  isMandatory?: boolean;
  /**
   * Every business type the master list offers this doc under, collected before the per-docType
   * dedupe collapses the rows. Two docs may be picked together only if these sets intersect —
   * otherwise the pair contradicts itself and the backend cannot infer Freelancer vs Sole Prop.
   */
  compatibleBusinessTypes?: string[];
  customRowRenderer?: never;
}

/**
 * The synthetic "sign a declaration" row, which stands in for a document rather than naming one.
 * It has no `value` — picking it opens the declaration popup instead of selecting a doc type.
 */
export interface DeclarationOptionRow {
  label: string;
  /** Always absent, but declared required so the shape still satisfies the dropdown's `Option`. */
  value: undefined;
  businessType?: string;
  subText?: string;
  isMandatory?: undefined;
  compatibleBusinessTypes?: never;
  customRowRenderer: (
    option: Option,
    onOptionClick: (value: string, isDisabled: boolean | undefined) => void
  ) => JSX.Element;
}

/** Discriminated on `value`: present for a real doc, absent for the declaration row. */
export type DocOptionsType = DocOptionRow | DeclarationOptionRow;
