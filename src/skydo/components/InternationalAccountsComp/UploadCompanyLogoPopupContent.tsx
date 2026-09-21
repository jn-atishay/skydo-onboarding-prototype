import UploadIcon from "../Icons/UploadIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { acceptedMimeTypesForImage, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classnames from "classnames";
import DragAndDropListener from "../AtomicComponents/FileInput/DragAndDropListener";
import React, { useEffect, useRef, useState } from "react";
import DragFileInput from "../AtomicComponents/FileInput/DragFileInput";
import { MAX_COMPANY_LOGO_SIZE } from "../../constants/onboarding";
import UploadLogoIcon from "../Icons/UploadLogoIcon";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

export type UploadLogoFlow =
  | "client_reminder_popup"
  | "international_accounts_share"
  | "invoice_upload"
  | "new_invoice_creation"
  | "payment_confirmation"
  | "sample_popup";

interface UploadCompanyLogoPopupContentProps {
  goToNextScreen?: () => void;
  setLogoImageUrl: (url: string) => void;
  setFile: (file: File | null) => void;
  containerClass?: string;
  mimeTypes?: string[];
  uploadTitleText?: string;
  dragDropText?: string;
  showSizeSpecification?: boolean;
  fileAllowedText?: string;
  isImage?: boolean;
  dragTitleText?: string;
  formatNotSupportedText?: string;
  location: UploadLogoFlow;
  maxSizeOverride?: number;
  maxSizeErrorOverride?: string;
  children?: React.ReactNode;
}

const UploadCompanyLogoPopupContent = (props: UploadCompanyLogoPopupContentProps) => {
  const {
    mimeTypes = acceptedMimeTypesForImage,
    uploadTitleText = Locale.uploadCompanyLogoText,
    dragDropText = Locale.dragAndDropLogoText,
    showSizeSpecification = true,
    fileAllowedText = Locale.typeOfImageAllowedtext,
    isImage = true,
    formatNotSupportedText = Locale.imageFormatNotSupported,
    dragTitleText = Locale.dropLogo,
  } = props;
  const { goToNextScreen, setLogoImageUrl, setFile } = props;
  const [isFileDragging, setFileDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setError] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    analytics?.trackAsync(Events.LOGO_UPLOAD_P1_LOAD);
  }, []);

  const onFileSelect = async (file: File) => {
    if (!file) return;
    const maxSize = props?.maxSizeOverride ? props?.maxSizeOverride : MAX_COMPANY_LOGO_SIZE;
    const maxSizeError = props?.maxSizeErrorOverride ? props.maxSizeErrorOverride : Locale.imageMaxSizeError;
    if (file.size > maxSize) {
      setError(true);
      setErrorMessage(maxSizeError);
      analytics?.trackAsync(Events.MAX_SIZE_ERROR_FILE_UPLOAD, {
        maxSizeAllowed: maxSize,
        fileSize: file.size,
        fileName: file.name,
        maxSizeError: maxSizeError,
        location: props.location,
      });
      return;
    }
    if (!mimeTypes.includes(file.type)) {
      setError(true);
      setErrorMessage(formatNotSupportedText);
      return;
    }
    setError(false);
    setErrorMessage("");
    setLogoImageUrl(URL.createObjectURL(file));
    setFile(file);
    if (goToNextScreen) {
      goToNextScreen();
      analytics?.trackAsync(Events.LOGO_UPLOAD_P2_LOAD);
    }
    analytics?.trackAsync(Events.FILE_UPLOAD_WITHIN_LIMITS, { location: props.location });
  };
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList;
    onFileSelect(files[0]);
    event.target.value = "";
  };

  const onChooseFileClick = () => {
    analytics?.trackAsync(Events.LOGO_UPLOAD_CLICK, {
      location: props.location,
    });
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={classnames("flex flex-col flex-grow", props.containerClass)}>
      <div
        className={classnames(
          "flex flex-col justify-center items-center bg-blue-50 flex-1 border-2 border-dashed rounded-10px",
          isError ? "border-red-500" : "border-black-500"
        )}
      >
        <input ref={inputRef} type={"file"} onChange={onFileInput} accept={String(mimeTypes)} className={"hidden"} />
        <UploadIcon />
        <Typography
          text={uploadTitleText}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"mt-2"}
        />
        <div className={"flex flex-row mt-2 space-x-1"}>
          <Typography text={dragDropText} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
          <Typography
            text={Locale.chooseFileText}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            onTextClick={onChooseFileClick}
            textClasses={"!text-blue-400 cursor-pointer underline"}
          />
        </div>
        {showSizeSpecification ? (
          <Typography
            text={Locale.widthHeightdetailsText}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-black-500 mt-2"}
          />
        ) : null}
        <Typography
          text={fileAllowedText}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-500 mt-2"}
        />
        {props.children}
      </div>
      {isError ? (
        <div className={"flex flex-col mt-6"}>
          <Typography text={errorMessage} textClasses={"!text-red-400"} />
        </div>
      ) : null}
      {isFileDragging ? (
        <DragFileInput
          title={dragTitleText}
          icon={UploadLogoIcon()}
          isImage={isImage}
          containerClass={"!top-0"}
          subtitle={Locale.maxSize60kb}
        />
      ) : null}
      <DragAndDropListener
        setFileDragging={setFileDragging}
        setError={setError}
        setErrorMessage={setErrorMessage}
        onFileSelect={onFileSelect}
      />
    </div>
  );
};

export default UploadCompanyLogoPopupContent;
