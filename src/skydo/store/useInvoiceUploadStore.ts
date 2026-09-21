import { create } from "./index";
import beCall from "../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { acceptedMimeTypes } from "../constants/atomicConstants";
import { MAX_FILE_SIZE } from "../constants/onboarding";
import Locale from "../util/locale/en";
import { ResponseWrapper } from "../authentication/api/AuthApiDto";
import { OcrParsedInvoiceDto } from "../types/Invoice";
import { Importer } from "../types";
import { InvoiceUploadCallbacks, InvoiceUploadValidationError } from "../types/Invoice/upload";

type InvoiceProcessResponse = {
  invoiceId: number;
  status: string;
};

type ParsedInvoiceResponse = {
  ocrParsedData: OcrParsedInvoiceDto;
  importerList: Importer[];
};

interface InvoiceUploadStore {
  uploadAndParseInvoice: (file: File, callbacks: InvoiceUploadCallbacks) => void;
}

/**
 * The size/type rules and the upload -> parse call sequence used by every invoice upload entry
 * point. Kept in one place because the three call sites (desktop popup, mobile upload, mobile
 * reupload) previously each carried their own copy and had already drifted apart on which
 * analytics events they fired.
 */
export const validateInvoiceFile = (file: File): InvoiceUploadValidationError | null => {
  if (file.size > MAX_FILE_SIZE) {
    return { reason: "MAX_SIZE", message: Locale.maxLimitExceeds };
  }
  if (!acceptedMimeTypes.includes(file.type)) {
    return { reason: "MIME_TYPE", message: Locale.formatNotSupported };
  }
  return null;
};

const useInvoiceUploadStore = create<InvoiceUploadStore>()(() => ({
  uploadAndParseInvoice: (file: File, callbacks: InvoiceUploadCallbacks) => {
    const onParseResponse = (res: ResponseWrapper<ParsedInvoiceResponse>) => {
      if (!res.success) {
        callbacks.onError();
        return;
      }
      callbacks.onParsed({
        ocrParsedData: res.data?.ocrParsedData || ({} as OcrParsedInvoiceDto),
        importerList: res.data?.importerList || [],
      });
    };

    const onUploadResponse = (res: ResponseWrapper<InvoiceProcessResponse>) => {
      if (!res.success) {
        callbacks.onError();
        return;
      }
      // Surfaced before parsing so the caller holds the id even if extraction then fails.
      callbacks.onUploaded?.(res.data?.invoiceId);
      void beCall({
        url: BE_ROUTES.FETCH_PARSED_INVOICE_DATA,
        params: { invoiceId: res.data?.invoiceId },
        method: ALLOWED_METHODS.GET,
        onSuccess: onParseResponse,
        onError: callbacks.onError,
      });
    };

    const formData = new FormData();
    formData.append("file", file);
    void beCall({
      url: BFF_ROUTES.FILE_UPLOAD,
      path: BE_ROUTES.UPLOAD_INVOICE,
      method: ALLOWED_METHODS.POST,
      body: formData,
      onSuccess: onUploadResponse,
      onError: callbacks.onError,
    });
  },
}));

export default useInvoiceUploadStore;
