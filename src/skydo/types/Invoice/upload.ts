import { OcrParsedInvoiceDto } from "./index";
import { Importer } from "../index";

export type InvoiceUploadValidationReason = "MAX_SIZE" | "MIME_TYPE";

export type InvoiceUploadValidationError = {
  reason: InvoiceUploadValidationReason;
  message: string;
};

export type ParsedInvoiceResult = {
  ocrParsedData: OcrParsedInvoiceDto;
  importerList: Importer[];
};

export type InvoiceUploadCallbacks = {
  onParsed: (result: ParsedInvoiceResult) => void;
  onError: () => void;
  onUploaded?: (invoiceId?: number) => void;
};

export type DataQualityDismissal = {
  field_name: string;
  issue_type: string;
};
