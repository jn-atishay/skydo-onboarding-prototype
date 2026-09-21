import FileInput from "../AtomicComponents/FileInput";
import {
  acceptedMimeTypesForPdf,
  BUTTON_SIZES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES
} from "../../constants/atomicConstants";
import DragAndDropListener from "../AtomicComponents/FileInput/DragAndDropListener";
import Typography from "../AtomicComponents/Typography";
import DocInputIcon from "../Icons/DocInputIcon";
import { useEffect, useState } from "react";
import Locale from "../../util/locale/en";
import DragFileInput from "../AtomicComponents/FileInput/DragFileInput";
import { MAX_FILE_SIZE } from "../../constants/onboarding";
import beCall from "../../util/beCall";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import BE_ROUTES from "../../util/beRoutes";
import { sleep } from "../../constants/npsInputConstants";
import GreenLoader from "../Icons/GreenLoader";
import PdfFileIcon from "../Icons/PdfFileIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import Button from "../AtomicComponents/Button";
import PasswordProtectedPopup from "./PasswordProtectedPopup";
import useOnboardingStore from "../../store/useOnboardingStore";
import useToastMessages from "../../store/toastMessages";
import useBankStatementAnalyseStore from "../../store/useBankStatementAnalyseStore";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { truncateFileName } from "../../util/functions";

const BankStatementFileUploader = () => {
  const [isFileDragging, setFileDragging] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploadLoader, setUploadLoader] = useState(false);
  const [fileName, setFileName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const { addToast } = useToastMessages();
  const { 
    verifyBankStatement, 
    isVerifying,
    uploadingState: storeUploadingState,
    setUploadingState: storeSetUploadingState,
    verifyingErrorState: storeVerifyingErrorState,
    setVerifyingErrorState: storeSetVerifyingErrorState
  } = useBankStatementAnalyseStore();

  const analytics = useAnalytics();

  useEffect(() => {
    if(showPasswordPopup) analytics.trackAsync(Events.BANK_STATEMENT_PASSWORD_PROMPTED);
  }, [showPasswordPopup]);

  const checkPasswordProtection = async (file: File): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await beCall({
        url: "/api/route/file",
        method: ALLOWED_METHODS.POST,
        body: formData,
        path: BE_ROUTES.CHECK_PDF_PASSWORD,
      });

      
      return response.data as boolean || false;
    } catch (error) {
      console.error('Error checking PDF password protection:', error);
      return false;
    }
  };

  const validatePassword = async (file: File, password: string): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);
      
      const response = await beCall({
        url: "/api/route/file",
        method: ALLOWED_METHODS.POST,
        body: formData,
        path: BE_ROUTES.VALIDATE_PDF_PASSWORD,
      });

      
      return response.data as boolean || false;
    } catch (error) {
      console.error('Error validating PDF password:', error);
      return false;
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!currentFile) return;
    
    try {
      const isValidPassword = await validatePassword(currentFile, password);
      if (!isValidPassword) {
        analytics.trackAsync(Events.BANK_STATEMENT_PASSWORD_ENTERED_INCORRECTLY);
        return "Invalid password. Please try again.";
      }
      
      setShowPasswordPopup(false);
      await uploadFile(currentFile, password);
    } catch (error) {
      return "An error occurred while validating the password. Please try again.";
    }
  };

  const uploadFile = async (file: File, password?: string) => {
    setError(false);
    setErrorMessage("");
    setUploadLoader(true);
    setFileName(file.name);
    await sleep(2000);
    
    const formData = new FormData();
    formData.append("kycDocument", file);
    formData.append("docType", "BANK_STATEMENT");
    if (password) {
      formData.append("password", password);
    }
    setDocUrl(URL.createObjectURL(file));
    
    beCall({
      url: "/api/route/file",
      method: ALLOWED_METHODS.POST,
      body: formData,
      path: BE_ROUTES.EXPORTER_KYC_DOC_UPLOAD,
      onSuccess: onFileUploadSuccess,
      onError: onFileuploadError,
    });
  };

  const onFileSelect = async (file: File) => {
    analytics.trackAsync(Events.BANK_STATEMENT_UPLOAD_INITIATED);   
    if(!file) return;
    if(file.size > MAX_FILE_SIZE) {
      setError(true);
      setErrorMessage(Locale.maxLimitExceeds);
      return;
    }
    if(!acceptedMimeTypesForPdf.includes(file.type)) {
      setError(true);
      setErrorMessage(Locale.formatNotSupportedForPdf);
      return;
    }

    // Check for password protection
    const isPasswordProtected = await checkPasswordProtection(file);
    if(isPasswordProtected) {
      setCurrentFile(file);
      setShowPasswordPopup(true);
      return;
    }

    await uploadFile(file);
  };

  const onFileUploadSuccess = () => {
    setUploadLoader(false);
    setIsUploaded(true);
    storeSetUploadingState('UPLOADED');
    analytics.trackAsync(Events.BANK_STATEMENT_UPLOAD_SUCCESSFUL);
  };

  const resetFileUpload = () => {
    setIsUploaded(false);
    setFileName("");
    setDocUrl("");
    setUploadLoader(false);
    storeSetUploadingState('FIRST');
  };

  const onFileuploadError = () => {
    setUploadLoader(false);
    setError(true);
    setErrorMessage("File upload failed. Please try again.");
    analytics.trackAsync(Events.BANK_STATEMENT_UPLOAD_FAILED);
  }

  useEffect(() => {
    if(isUploadLoader) {
      storeSetUploadingState('UPLOADING');
    }
  }, [isUploadLoader]);

  if(isUploadLoader) {
    return (<>
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

    </>);
  }

  if(isVerifying) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <PdfFileIcon />
            <Typography text={fileName} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} />
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <GreenLoader />
            <Typography 
              text={Locale.verifyingBankStatement}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </div>
          <Typography 
            text={Locale.thisWillTakeMinutes}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
          />
        </div>
      </div>
    );
  }

  if(isUploaded) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <PdfFileIcon />
            <Typography 
              text={truncateFileName(fileName, 26)}
              type={TYPOGRAPHY_TYPES.LABEL} 
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"max-w-[200px] md:max-w-[300px] truncate"}
            />
          </div>
          <div className="cursor-pointer" onClick={() => resetFileUpload()}>
            <DeleteIcon />
          </div>
        </div>
        
        <div className="hidden md:flex justify-end">
          <Button
            title={Locale.verifyBankStatement}
            size={BUTTON_SIZES.SMALL}
            onButtonClick={verifyBankStatement}
            isLoading={isVerifying}
          />
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
        isFileTypePdf={true}
        showBrowseCta={true}
        accept={acceptedMimeTypesForPdf}
        renderFileIcon={() => <DocInputIcon />}
        containerClass="flex w-full md:w-auto flex-1 flex-col"
        errorClassName={'!mt-1 md:mt-2'}
        className="w-full"
        isLoading={isUploadLoader}
        showLoader={isUploadLoader}
        isError={isError}
        errorMessage={errorMessage}
        renderInputText={() => (
        <>
            <div className="hidden md:block">
            <Typography text={Locale.dragSpace} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="text-center">
                <Typography text={Locale.bankStatement} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="text-center" fontWeight={"bold"} />
                <Typography text={Locale.here} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="text-center" />
            </Typography>
            </div>
            <div className="md:hidden">
                <Typography text={Locale.uploadBankStatement} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="text-center" fontWeight={"bold"} />
            </div>
        </>
        )}
        showMobileCta={true}
        mobileCtaText={Locale.uploadBankStatement}
        hideMobileIcon={true}
      />
      {isFileDragging ? <DragFileInput title={Locale.dropDocument} /> : null}
      {showPasswordPopup && (
        <PasswordProtectedPopup
          onSubmit={handlePasswordSubmit}
          onClose={() => {
            setShowPasswordPopup(false);
            setCurrentFile(null);
          }}
          open = {showPasswordPopup}
        />
      )}
    </>
  );
};

export default BankStatementFileUploader;
