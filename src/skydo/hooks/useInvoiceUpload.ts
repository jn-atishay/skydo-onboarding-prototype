import useAnalytics from "../analytics/useAnalytics";
import { Events } from "../analytics/EventConstants";
import { MAX_FILE_SIZE } from "../constants/onboarding";
import { getFileTypeForAnalytics } from "../util/functions";
import useInvoiceUploadStore, { validateInvoiceFile } from "../store/useInvoiceUploadStore";
import { InvoiceUploadCallbacks, InvoiceUploadValidationError } from "../types/Invoice/upload";

type StartInvoiceUploadOptions = InvoiceUploadCallbacks & {
  onValidationError: (error: InvoiceUploadValidationError) => void;
  /** Runs once validation has passed, before the upload call, for the caller's own loading state. */
  onStart: () => void;
};

/**
 * Entry point for surfaces that own their own file picker -- the mobile upload screen and both
 * reupload panels. It validates, emits the upload funnel events, then runs the shared upload ->
 * parse chain. The desktop first-upload path does NOT use this: its dropzone
 * (UploadCompanyLogoPopupContent) already validates and emits the same two events, so routing it
 * through here would double-count them. Callers supply only how a failure is presented, which is
 * the one part that legitimately differs per surface.
 */
const useInvoiceUpload = () => {
  const analytics = useAnalytics();
  const { uploadAndParseInvoice } = useInvoiceUploadStore();

  const startInvoiceUpload = (file: File | null, options: StartInvoiceUploadOptions) => {
    if (!file) return;

    const validationError = validateInvoiceFile(file);
    if (validationError) {
      if (validationError.reason === "MAX_SIZE") {
        analytics?.trackAsync(Events.MAX_SIZE_ERROR_FILE_UPLOAD, {
          maxSizeAllowed: MAX_FILE_SIZE,
          fileSize: file.size,
          fileName: file.name,
          maxSizeError: validationError.message,
          location: "invoice_upload",
        });
      }
      options.onValidationError(validationError);
      return;
    }

    analytics?.trackAsync(Events.FILE_UPLOAD_WITHIN_LIMITS, { location: "invoice_upload" });
    // Reducto OCR runs synchronously inside the upload call, so extraction is already complete by
    // the time it resolves -- this must fire before the call to genuinely mark "started". invoice_id
    // is omitted because the backend has not created the record yet.
    analytics.trackAsync(Events.INVOICE_EXTRACTION_STARTED, {
      file_type: getFileTypeForAnalytics(file),
      file_size_kb: Math.round(file.size / 1024),
    });

    options.onStart();
    uploadAndParseInvoice(file, {
      onParsed: options.onParsed,
      onError: options.onError,
      onUploaded: options.onUploaded,
    });
  };

  return { startInvoiceUpload };
};

export default useInvoiceUpload;
