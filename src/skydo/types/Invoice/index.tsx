export type ServiceDescriptionReviewReason = "NOT_FOUND" | "NOT_DESCRIPTIVE" | "PURPOSE_CODE_MISMATCH";

/** Frontend-only: the backend sends a list of reasons; the combined value is derived when it holds both */
export type ServiceDescriptionRowVariant = ServiceDescriptionReviewReason | "PURPOSE_CODE_MISMATCH_AND_NOT_DESCRIPTIVE";

export type ServiceDescriptionPurposeCodeDto = {
  purposeCode: string;
  purposeCodeDescription: string;
};

export type OcrParsedInvoiceFlagsDto = {
  exporterNameMismatch: boolean;
  importerCountryNeedsReview: boolean;
  serviceDescriptionNeedsReview: boolean;
  serviceDescriptionReviewReasons: ServiceDescriptionReviewReason[];
  serviceDescriptionPurposeCode: ServiceDescriptionPurposeCodeDto | null;
};

export type OcrParsedInvoiceDto = {
  id: number;
  amount: number;
  currency: string;
  invoiceRaiseDate: string;
  dueDate: string;
  invoiceNumber: string;
  importerId?: number | null;
  importerCountry: string;
  unparsedInvoiceId: number;
  invoiceRaisedTo: string;
  invoiceRaisedBy: string;
  flags: OcrParsedInvoiceFlagsDto;
};
