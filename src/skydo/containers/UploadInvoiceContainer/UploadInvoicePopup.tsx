import React, { useEffect, useRef, useState } from "react";
import UploadCompanyLogoPopupContent from "../../components/InternationalAccountsComp/UploadCompanyLogoPopupContent";
import InvoiceChecklist from "./InvoiceChecklist";
import ParsedInvoicePreview from "./ParsedInvoicePreview";
import PopupHeader from "../../components/AtomicComponents/Popup/PopupHeader";
import Locale from "../../util/locale/en";
import InvoicesNavIcon from "../../components/Icons/InvoicesNavIcon";
import Typography from "../../components/AtomicComponents/Typography";
import Button from "../../components/AtomicComponents/Button";
import {
  acceptedMimeTypes,
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import useToastMessages from "../../store/toastMessages";
import { OcrParsedInvoiceDto } from "../../types/Invoice";
import { ParsedInvoiceResult } from "../../types/Invoice/upload";
import useInvoiceUploadStore from "../../store/useInvoiceUploadStore";
import useInvoiceUpload from "../../hooks/useInvoiceUpload";
import { Importer } from "../../types";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { MAX_FILE_SIZE } from "../../constants/onboarding";
import useOutsideClickFinder from "../../hooks/useOutsideClickFinder";
import useZohoSyncStore from "../../store/useZohoSyncStore";
import { ZohoSyncState } from "../../types/ZohoSync";
import ZohoSquareIcon from "../../components/Icons/ZohoSquareIcon";
import CrossIcon from "../../components/AtomicComponents/ToastMessages/CrossIcon";
import { getFileTypeForAnalytics } from "../../util/functions";

interface UploadInvoicePopupProps {
  closeIconClick: () => void;
}

export enum POPUP_STATES {
  UPLOAD,
  LOADING,
  PREVIEW,
  IMPORTER_UPDATE,
  DISCARD,
}

const UploadInvoicePopup = (props: UploadInvoicePopupProps) => {
  const { addToast } = useToastMessages();

  const [popupState, setPopupState] = useState(POPUP_STATES.UPLOAD);
  const [invoiceUrl, setInvoiceUrl] = useState<string>();
  const [invoiceFile, setInvoiceFile] = useState<File | null>();
  const [unparsedInvoiceId, setUnparsedInvoiceId] = useState<number>();
  const [importerList, setImporterList] = useState<Importer[]>([]);
  const [unparsedInvoiceData, setUnparsedInvoiceData] = useState<OcrParsedInvoiceDto>({} as OcrParsedInvoiceDto);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const analytics = useAnalytics();
  const popupRef = useRef<HTMLDivElement>(null);
  const uploadAttemptCountRef = useRef(0);
  const { zohoPopUpState, openZohoSyncPopup, getZohoSyncStatusApi } = useZohoSyncStore();
  const { uploadAndParseInvoice } = useInvoiceUploadStore();
  const { startInvoiceUpload } = useInvoiceUpload();
  const isZohoConnected = zohoPopUpState === ZohoSyncState.CONNECTED;
  const showZohoOption = !isZohoConnected;
  const [zohoOptionDismissed, setZohoOptionDismissed] = useState(false);

  useEffect(() => {
    if (zohoPopUpState === ZohoSyncState.LOADING) {
      getZohoSyncStatusApi();
    }
  }, []);

  const onDataParsed = (result: ParsedInvoiceResult) => {
    analytics.trackAsync(Events.UPLOAD_PARSE_SUCCESS);
    setPopupState(POPUP_STATES.PREVIEW);
    setImporterList(result.importerList);
    setUnparsedInvoiceData(result.ocrParsedData);
  };

  const onFileUploadError = () => {
    analytics.trackAsync(Events.UPLOAD_PARSE_FAILURE);
    setPopupState(POPUP_STATES.UPLOAD);
    addToast({
      body: Locale.invoiceUploadError,
      id: "invoiceUploadError",
      type: TOAST_TYPES.ERROR,
    });
  };

  const onUploadStart = (file: File) => {
    setIsPdf(file.type === "application/pdf");
    uploadAttemptCountRef.current += 1;
    setPopupState(POPUP_STATES.LOADING);
    setInvoiceFile(file);
    setInvoiceUrl(URL.createObjectURL(file));
  };

  // The dropzone has already validated the file and emitted the upload funnel events, so this path
  // goes straight to the shared chain rather than through useInvoiceUpload.
  const onFileSelect = (file: File | null) => {
    if (!file) return;
    analytics.trackAsync(Events.INVOICE_EXTRACTION_STARTED, {
      file_type: getFileTypeForAnalytics(file),
      file_size_kb: Math.round(file.size / 1024),
    });
    onUploadStart(file);
    uploadAndParseInvoice(file, {
      onUploaded: setUnparsedInvoiceId,
      onParsed: onDataParsed,
      onError: onFileUploadError,
    });
  };

  // Lets the confirmation-screen reupload panels open the native file picker directly,
  // instead of first navigating back to the generic "Upload invoice" screen. This picker has no
  // dropzone in front of it, so validation and the funnel events come from useInvoiceUpload.
  const reuploadInputRef = useRef<HTMLInputElement>(null);
  const triggerReupload = () => reuploadInputRef.current?.click();
  const onReuploadFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    startInvoiceUpload(file, {
      onValidationError: (error) => addToast({ body: error.message, id: error.reason, type: TOAST_TYPES.ERROR }),
      onStart: () => onUploadStart(file as File),
      onUploaded: setUnparsedInvoiceId,
      onParsed: onDataParsed,
      onError: onFileUploadError,
    });
  };

  const renderTitle = () => {
    return (
      <div className={"flex"}>
        <InvoicesNavIcon width={32} height={32} />
        <div className={"flex flex-col ml-4"}>
          <Typography text={Locale.uploadInvoiceText} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
          <Typography
            text={Locale.uploadInvoiceSubtitle}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={600}
            textClasses={"!text-black-500 mt-1"}
          >
            <Typography
              text={Locale.viewGuidelines}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={600}
              textClasses={"!text-blue-400 cursor-pointer ml-1"}
              onTextClick={() => {
                analytics.trackAsync(Events.INVOICING_GUIDELINES_CLICK);
                window.open(
                  "https://www.skydo.com/faqs/payments?q=how-to-create-correct-invoices-for-receiving-foreign-payments",
                  "_blank"
                );
              }}
            />
          </Typography>
        </div>
      </div>
    );
  };

  useOutsideClickFinder(popupRef, props.closeIconClick, true);

  const hiddenReuploadInput = (
    <input
      ref={reuploadInputRef}
      type={"file"}
      onChange={onReuploadFileInput}
      accept={String(acceptedMimeTypes)}
      className={"hidden"}
    />
  );

  if (popupState === POPUP_STATES.UPLOAD) {
    return (
      <div id={"upload_invoice_popup"} className={"flex flex-col flex-1 p-6"} ref={popupRef}>
        {hiddenReuploadInput}
        <PopupHeader title={renderTitle()} closeIconClick={props.closeIconClick} />
        <UploadCompanyLogoPopupContent
          maxSizeOverride={MAX_FILE_SIZE}
          maxSizeErrorOverride={Locale.maxLimitExceeds}
          setLogoImageUrl={(url) => setInvoiceUrl(url)}
          setFile={onFileSelect}
          containerClass={"flex-1"}
          mimeTypes={acceptedMimeTypes}
          uploadTitleText={Locale.uploadInvoice}
          dragDropText={Locale.dragAndDropInvoiceText}
          showSizeSpecification={false}
          fileAllowedText={Locale.typeOfInvoiceAllowedText}
          isImage={false}
          dragTitleText={Locale.dropInvoice}
          formatNotSupportedText={Locale.formatNotSupported}
          location={"invoice_upload"}
        >
          <InvoiceChecklist />
        </UploadCompanyLogoPopupContent>
        {showZohoOption && !zohoOptionDismissed && (
          <>
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-gradient-to-r from-white to-black-400" />
              <Typography
                text={"OR"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500"}
              />
              <div className="flex-1 h-px bg-gradient-to-r from-black-400 to-white" />
            </div>
            <div className="flex items-center justify-between bg-black-50 rounded-10px px-4 py-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-[52px] h-[52px] bg-white border-[1.05px] border-blue-100 rounded-10px shadow-[0_0_1.25px_rgba(0,0,0,0.12)] shrink-0">
                  <ZohoSquareIcon size={32} />
                </div>
                <div className="flex flex-col">
                  <Typography
                    text={Locale.zohoSync.uploadZohoTitle}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={"700"}
                  />
                  <Typography
                    text={Locale.zohoSync.uploadZohoSubtext}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500"}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type={BUTTON_TYPES.SECONDARY}
                  size={BUTTON_SIZES.SMALL}
                  nativeType={"button"}
                  title={Locale.zohoSync.connect}
                  onButtonClick={() => {
                    analytics.trackAsync(Events.ZOHO.CONNECT_CLICKED, { source: "upload_pop_up" });
                    openZohoSyncPopup();
                    props.closeIconClick();
                  }}
                />

                <Button
                  type={BUTTON_TYPES.TERTIARY}
                  size={BUTTON_SIZES.X_SMALL}
                  nativeType={"button"}
                  onButtonClick={() => {
                    analytics.trackAsync(Events.ZOHO.CROSS_CLICKED, { source: "upload_pop_up" });
                    setZohoOptionDismissed(true);
                  }}
                  title={() => <CrossIcon width={20} height={20} />}
                  buttonClass={
                    "!h-auto !w-auto !p-1 !bg-transparent hover:!bg-transparent hover:!shadow-none focus:!shadow-none"
                  }
                  buttonProps={{ "aria-label": "Dismiss" }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  return (
    <>
      {hiddenReuploadInput}
      <ParsedInvoicePreview
        invoiceUrl={invoiceUrl as string}
        popupState={popupState}
        setPopupState={setPopupState}
        closeIconClick={props.closeIconClick}
        isPdf={isPdf}
        ocrInvoiceData={unparsedInvoiceData}
        importerList={importerList}
        unparsedInvoiceId={unparsedInvoiceId as number}
        uploadSource={uploadAttemptCountRef.current > 1 ? "re-upload" : "upload"}
        triggerReupload={triggerReupload}
      />
    </>
  );
};
export default UploadInvoicePopup;
