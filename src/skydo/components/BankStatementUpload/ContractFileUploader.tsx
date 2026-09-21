import { useState } from "react";
import FileInput from "../AtomicComponents/FileInput";
import DragAndDropListener from "../AtomicComponents/FileInput/DragAndDropListener";
import DragFileInput from "../AtomicComponents/FileInput/DragFileInput";
import Typography from "../AtomicComponents/Typography";
import DocInputIcon from "../Icons/DocInputIcon";
import PdfFileIcon from "../Icons/PdfFileIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import GreenLoader from "../Icons/GreenLoader";
import Locale from "../../util/locale/en";
import {
  acceptedMimeTypesForContract,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import { DocTypesOnboarding, MAX_FILE_SIZE } from "../../constants/onboarding";
import beCall from "../../util/beCall";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import BE_ROUTES from "../../util/beRoutes";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import useUserData from "../../store/useUserData";
import useBankStatementAnalyseStore from "../../store/useBankStatementAnalyseStore";
import { truncateFileName } from "../../util/functions";
import { logApiFailureToSentry } from "../../util/sentryLogger";
import { ResponseWrapper } from "../../authentication/api/AuthApiDto";

interface ContractFileUploaderProps {
  onFileUploaded: (uploaded: boolean) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}

const ContractFileUploader = ({ onFileUploaded, onUploadingChange }: ContractFileUploaderProps) => {
  const [isFileDragging, setFileDragging] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploadLoader, setUploadLoader] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const analytics = useAnalytics();
  const { exporterId } = useUserData();
  const { addDocUploaded, removeDocUploaded } = useBankStatementAnalyseStore();

  const onFileUploadSuccess = () => {
    setUploadLoader(false);
    setIsUploaded(true);
    onFileUploaded(true);
    onUploadingChange?.(false);
    analytics.trackAsync(Events.SOLE_PROPS_DOC_UPLOAD);
    analytics.trackAsync(Events.CONTRACT_UPLOAD_SUCCESSFUL, { exporter_id: exporterId });
    addDocUploaded(DocTypesOnboarding.CONTRACT_AGREEMENT);
    const markActiveBody = { activeDocTypeList: [DocTypesOnboarding.CONTRACT_AGREEMENT] };
    beCall({
      path: BE_ROUTES.MARK_EXPORTER_DOCS_ACTIVE,
      method: ALLOWED_METHODS.POST,
      body: markActiveBody,
      onSuccess: (data: ResponseWrapper<unknown>) => {
        if (!data?.success) {
          logApiFailureToSentry("ContractFileUploader.tsx", BE_ROUTES.MARK_EXPORTER_DOCS_ACTIVE, markActiveBody, data);
        }
      },
      onError: (error: unknown) =>
        logApiFailureToSentry("ContractFileUploader.tsx", BE_ROUTES.MARK_EXPORTER_DOCS_ACTIVE, markActiveBody, error),
    });
  };

  const onFileUploadError = () => {
    setUploadLoader(false);
    setError(true);
    setErrorMessage(Locale.contractUploadFailed);
    onFileUploaded(false);
    onUploadingChange?.(false);
    analytics.trackAsync(Events.SOLE_PROPS_DOC_UPLOAD_FAILED);
    analytics.trackAsync(Events.CONTRACT_UPLOAD_FAILED, { exporter_id: exporterId });
  };

  const uploadFile = (file: File) => {
    setError(false);
    setErrorMessage("");
    setUploadLoader(true);
    onUploadingChange?.(true);
    setFileName(file.name);
    analytics.trackAsync(Events.CONTRACT_UPLOAD_INITIATED, { exporter_id: exporterId });
    const formData = new FormData();
    formData.append("kycDocument", file);
    formData.append("docType", DocTypesOnboarding.CONTRACT_AGREEMENT);
    beCall({
      url: "/api/route/file",
      method: ALLOWED_METHODS.POST,
      body: formData,
      path: BE_ROUTES.EXPORTER_KYC_DOC_UPLOAD,
      onSuccess: onFileUploadSuccess,
      onError: onFileUploadError,
    });
  };

  const onFileSelect = (file: File) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError(true);
      setErrorMessage(Locale.maxLimitExceeds);
      return;
    }
    if (!acceptedMimeTypesForContract.includes(file.type)) {
      setError(true);
      setErrorMessage(Locale.formatNotSupportedForContractUpload);
      return;
    }
    uploadFile(file);
  };

  const resetFileUpload = () => {
    setIsUploaded(false);
    setFileName("");
    onFileUploaded(false);
    removeDocUploaded(DocTypesOnboarding.CONTRACT_AGREEMENT);
  };

  if (isUploadLoader) {
    return (
      <>
        <div className="flex flex-col flex-1 gap-4 justify-center hide_for_mob">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 py-3">
              <GreenLoader />
              <Typography text={fileName} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 justify-center hide_for_desktop">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 py-3">
              <GreenLoader />
              <Typography
                text={truncateFileName(fileName, 20)}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="max-w-[200px] truncate"
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isUploaded) {
    return (
      <div className="flex flex-1 items-center justify-between md:py-3">
        <div className="flex items-center gap-2">
          <PdfFileIcon />
          <Typography
            text={truncateFileName(fileName, 26)}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"max-w-[200px] md:max-w-[300px] truncate"}
          />
        </div>
        <div className="cursor-pointer" onClick={resetFileUpload}>
          <DeleteIcon />
        </div>
      </div>
    );
  }

  return (
    <>
      <DragAndDropListener
        setFileDragging={setFileDragging}
        onFileSelect={onFileSelect}
        setError={setError}
        setErrorMessage={setErrorMessage}
      />
      <FileInput
        onFileSelect={onFileSelect}
        showBrowseCta={true}
        accept={acceptedMimeTypesForContract}
        renderFileIcon={() => <DocInputIcon />}
        containerClass="flex w-full flex-1 flex-col"
        errorClassName={"!mt-1 md:mt-2"}
        className="w-full"
        isLoading={false}
        showLoader={false}
        isError={isError}
        errorMessage={errorMessage}
        renderInputText={() => (
          <>
            <div className="hidden md:block">
              <Typography text={Locale.dragSpace} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="text-center">
                <Typography text={Locale.contractLowercase} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="text-center" fontWeight={"bold"} />
                <Typography text={Locale.here} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="text-center ml-1" />
              </Typography>
            </div>
            <div className="md:hidden">
              <Typography text={Locale.uploadContractHere} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="text-center" fontWeight={"bold"} />
            </div>
          </>
        )}
        showMobileCta={true}
        mobileCtaText={Locale.uploadContractHere}
        hideMobileIcon={true}
      />
      {isFileDragging ? <DragFileInput title={Locale.dropDocument} /> : null}
    </>
  );
};

export default ContractFileUploader;
