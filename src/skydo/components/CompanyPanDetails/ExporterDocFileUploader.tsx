//Jun 2023
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { acceptedMimeTypes, TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Dropdown, { DropdownRef } from "../AtomicComponents/Dropdown";
import FileInput from "../AtomicComponents/FileInput";
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { DocTypesOnboarding, MAX_FILE_SIZE } from "../../constants/onboarding";
import beCall from "../../util/beCall";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import BE_ROUTES from "../../util/beRoutes";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import DocInputIcon from "../Icons/DocInputIcon";
import useToastMessages from "../../store/toastMessages";
import DragFileInput from "../AtomicComponents/FileInput/DragFileInput";
import DragAndDropListener from "../AtomicComponents/FileInput/DragAndDropListener";
import useUdyamOcrStore from "../../store/useUdyamOcrStore";
import IECInput, { IecDto } from "./IECInput";
import { Option } from "../../types/atomicComponentTypes";
import { DocOptionsType } from "../../types/Onboarding";

interface Props {
  docType: string;
  setDocType: (x: string) => void;
  docTypeOptions: DocOptionsType[];
  onFileUploaded: (x: boolean) => void;
  exporterData?: { [key: string]: any };
  isDragNDropEnabled?: boolean;
  headerText: String;
  onInputClick?: () => void;
  exporterIec?: IecDto;
  refetchData: () => void;
  isIecVerificationRequired?: boolean;
  isProfileScreenPopup?: boolean;
  fullWidth?: boolean;
  handleSubmitIEC?: () => void;
  disableDropdownOptions?: boolean;
  showDropdownLabel?: boolean;
  showRequiredAsterisk?: boolean;
  /** Top-align label/dropdown with an adjacent IEC field (Amazon sole prop / freelancer two-column row). */
  alignWithIecField?: boolean;
  renderOptionTag?: (option: Option) => JSX.Element;
  /** Hide the upload icon on mobile and center the CTA (icon stays on desktop). */
  hideMobileIcon?: boolean;
  /** Rendered between the dropdown and the file input (e.g. contract checklist on mobile). */
  renderAboveDocInput?: () => JSX.Element;
  /** Replaces the default file input/preview (e.g. contract upload routed through ContractFileUploader). */
  renderUploadArea?: () => JSX.Element;
}

export interface ExporterDocFileUploaderRef extends HTMLElement {
  resetDropdown: (val: string) => void;
}

const ExporterDocFileUploader = forwardRef<any, Props>((props: Props, ref) => {
  const {
    docType,
    setDocType,
    docTypeOptions,
    onFileUploaded,
    exporterData,
    isDragNDropEnabled,
    headerText,
    exporterIec,
    refetchData,
    isIecVerificationRequired,
    isProfileScreenPopup = false,
    fullWidth = false,
    handleSubmitIEC,
    disableDropdownOptions = false,
    showDropdownLabel = true,
    showRequiredAsterisk = false,
    alignWithIecField = false,
    hideMobileIcon = false,
  } = props;
  const dropdownRef = useRef<DropdownRef>();

  useImperativeHandle(
    ref,
    () => ({
      resetDropdown: (val: string) => {
        dropdownRef.current && dropdownRef.current.changeInputVal(val);
      },
    }),
    []
  );
  const savedKycDocUrl = useMemo(() => {
    return exporterData?.exporterKyc?.kycDocList?.filter((doc: any) => doc.docType === docType)[0]?.preSignedUrl || "";
  }, [exporterData, docType]);
  const { reset, setPopupVisible, fetchUdyamStatus, setIsPolling, status: udyamOcrStatus } = useUdyamOcrStore();
  const [isFileDragging, setFileDragging] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFileTypePdf, setIsFileTypePdf] = useState<boolean>(false);
  const [docUrl, setDocUrl] = useState(savedKycDocUrl);
  const [isLoading, setUploadLoader] = useState(false);

  useEffect(() => {
    fetchUdyamStatus();
  }, []);

  useEffect(() => {
    setDocUrl(savedKycDocUrl);
    if (
      savedKycDocUrl ||
      (docType === DocTypesOnboarding.IEC_CERTIFICATE && exporterIec?.ieCode && exporterIec?.verifiedBy === "EXPORTER")
    ) {
      onFileUploaded(true);
    } else {
      onFileUploaded(false);
    }
  }, [savedKycDocUrl, docType]);

  const { addToast } = useToastMessages();

  const analytics = useAnalytics();

  const renderFileIcon = () => {
    return <DocInputIcon />;
  };

  const renderInputText = () => {
    if (!isDragNDropEnabled) {
      return (
        <div className={"mt-4"}>
          <Typography text={Locale.uploadDocument} size={TYPOGRAPHY_SIZES.MEDIUM} type={TYPOGRAPHY_TYPES.PARA} />
        </div>
      );
    }
    return (
      <div className={"mt-4"}>
        <Typography text={Locale.dragSpace} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"text-center"}>
          <Typography
            text={Locale.documentLowercase}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"text-center"}
            fontWeight={"bold"}
          />
          <Typography text={Locale.here} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"text-center ml-1"} />
        </Typography>
      </div>
    );
  };

  // whenever doc type changes reset the file.
  const resetFile = () => {
    setDocUrl("");
    onFileUploaded(false);
  };

  const onFileClick = () => {
    if (docUrl && !isLoading) {
      window?.open(docUrl, "_blank")?.focus();
    }
  };

  const onChangeDocClick = () => {
    resetFile();
  };

  const onFileUploadSuccess = () => {
    analytics?.trackAsync(Events.SOLE_PROPS_DOC_UPLOAD);
    onFileUploaded(true);
    setUploadLoader(false);
    if (docType === DocTypesOnboarding.UDYAM_CERTIFICATE) {
      reset();
      setIsPolling(true);
      setPopupVisible(true);
    }
  };

  const onFileuploadError = () => {
    setError(true);
    setDocUrl("");
    setUploadLoader(false);
    addToast({
      type: TOAST_TYPES.ERROR,
      id: "error_file",
      body: Locale.wentWrongMessage,
    });
    analytics?.trackAsync(Events.SOLE_PROPS_DOC_UPLOAD_FAILED);
  };
  const onFileSelect = async (file: File) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError(true);
      setErrorMessage(Locale.maxLimitExceeds);
      return;
    }
    if (!acceptedMimeTypes.includes(file.type)) {
      setError(true);
      setErrorMessage(Locale.formatNotSupported);
      return;
    }
    if (file.type === "application/pdf") {
      setIsFileTypePdf(true);
    } else {
      setIsFileTypePdf(false);
    }
    setError(false);
    setErrorMessage("");
    setUploadLoader(true);
    setDocUrl(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("kycDocument", file as File);
    formData.append("docType", docType);
    beCall({
      url: "/api/route/file",
      method: ALLOWED_METHODS.POST,
      body: formData,
      path: BE_ROUTES.EXPORTER_KYC_DOC_UPLOAD,
      onSuccess: onFileUploadSuccess,
      onError: onFileuploadError,
    });
  };

  const renderDocInput = () => {
    if (!docType) return null;
    if (docType === DocTypesOnboarding.IEC_CERTIFICATE) {
      return <IECInput exporterIec={exporterIec} refetchData={refetchData} onFileUploaded={onFileUploaded} handleSubmitIEC={handleSubmitIEC}/>;
    }
    if (props.renderUploadArea) {
      return props.renderUploadArea();
    }

    return (
      <div className={"flex flex-1 flex-col w-full"}>
        {isDragNDropEnabled ? (
          <DragAndDropListener
            setFileDragging={setFileDragging}
            onFileSelect={onFileSelect}
            setError={setError}
            setErrorMessage={setErrorMessage}
          />
        ) : null}
        <FileInput
          containerClass={"min-w-[230px]"}
          onFileSelect={onFileSelect}
          isError={isError}
          imageUrl={docUrl}
          isLoading={isLoading}
          onTransparentWrapperClick={onFileClick}
          addWrapper={docUrl && !isLoading}
          showLoader={isLoading}
          renderFileIcon={renderFileIcon}
          renderInputText={renderInputText}
          isFileTypePdf={isFileTypePdf}
          showMobileCta={true}
          mobileCtaText={Locale.uploadYourDoc}
          showBrowseCta={true}
          hideMobileIcon={hideMobileIcon}
        />
        <div className={`mt-0 md:mt-4 ${isProfileScreenPopup ? "!text-center" : ""}`}>
          {docUrl && !isLoading ? (
            <Typography
              text={Locale.editDocument}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-600"}
            >
              <Typography
                text={Locale.clickHere}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-blue-400 cursor-pointer ml-1"}
                onTextClick={onChangeDocClick}
              />
            </Typography>
          ) : (
            <Typography
              text={Locale.sizeAndFileTypeLimit}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-500"}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-1 w-full ${isProfileScreenPopup || fullWidth ? "md:w-full" : "md:max-w-[50%]"} flex-col items-start justify-start space-y-4`}>
      {isIecVerificationRequired && docType === DocTypesOnboarding.IEC_CERTIFICATE ? null : (
        <div className="flex w-full flex-col gap-2">
          {showDropdownLabel && (
            <div className="mr-1 flex flex-row items-center gap-0.5">
              <Typography
                text={headerText}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-600"}
              />
              {showRequiredAsterisk && (
                <Typography
                  text={"*"}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-red-400"}
                />
              )}
            </div>
          )}
          <Dropdown
            placeholder={Locale.selectOne}
            onInputClick={props.onInputClick}
            onSelect={(value: any) => {
              setDocType(value);
            }}
            containerClass={"flex-1 w-full"}
            optionsContainerClass={"!max-h-[280px]"}
            searchable={false}
            selectedValue={docType}
            options={docTypeOptions}
            isError={false}
            hideArrowIcon={disableDropdownOptions}
            subtextClass={"!text-black-500"}
            ref={dropdownRef}
            isDisabled={disableDropdownOptions}
            renderOptionTag={props.renderOptionTag}
          />
        </div>
      )}
      {props.renderAboveDocInput ? props.renderAboveDocInput() : null}
      {renderDocInput()}
      {errorMessage ? (
        <Typography
          text={errorMessage}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          fontWeight={"700"}
          textClasses={"!text-red-400 mt-4"}
        />
      ) : null}
      {isFileDragging ? <DragFileInput title={Locale.dropDocument} /> : null}
    </div>
  );
});

ExporterDocFileUploader.displayName = "ExporterDocFileUploader";
export default ExporterDocFileUploader;
