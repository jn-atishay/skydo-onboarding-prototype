import React, { useEffect, useRef, useState } from "react";
import useToastMessages from "../../store/toastMessages";
import {
  acceptedMimeTypes,
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import { MAX_FILE_SIZE } from "../../constants/onboarding";
import DragAndDropListener from "../AtomicComponents/FileInput/DragAndDropListener";
import DeedFileIcon from "../Icons/DeedFileIcon";
import Typography from "../AtomicComponents/Typography";
import Button from "../AtomicComponents/Button";
import MultiFileInput from "../AtomicComponents/FileInput/MultiFileInput";
import {Events} from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import { useSenderCaseAlertStore } from "../../store/senderCaseAlertStore";

interface Props {
  onSubmitDocs: (files?: File[], text?: string) => void;
}

const SenderCaseAlertDocInput = (props: Props) => {
  const {
    proofDocUrls,
    proofDocFiles,
    proofDocFileTypes,
    isLoading,
    isError,
    errorMessage,
    isFileDragging,
    isConfirmButtonLoading,
    isFileTypePdf,
    setProofDocUrls,
    setProofDocFiles,
    setProofDocFileTypes,
    setUploadLoader,
    setError,
    setErrorMessage,
    setFileDragging,
    setConfirmButtonLoading,
    setIsFileTypePdf,
    removeDoc,
    showSubmitButton,
    proofLink,
  } = useSenderCaseAlertStore();
  const { addToast } = useToastMessages();
  const compRef = useRef<HTMLDivElement | null>(null);
  const analytics = useAnalytics();

  useEffect(() => {
    if (compRef && compRef.current) {
      compRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  }, []);

  const onFileUploadSuccess = (data: any) => {
    setUploadLoader(false);
  };

  const onFileuploadError = () => {
    setError(true);
    setUploadLoader(false);
    addToast({
      type: TOAST_TYPES.ERROR,
      id: "error_file",
      body: Locale.wentWrongMessage,
    });
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
    }
    setError(false);
    setErrorMessage("");
    setUploadLoader(true);
    setProofDocUrls([...proofDocUrls, URL.createObjectURL(file)]);
    setProofDocFiles([...proofDocFiles, file]);
    setProofDocFileTypes([...proofDocFileTypes, file.type]);
    setUploadLoader(false);
    analytics.trackAsync(Events.TM_DOCUMENT_UPLOADED, {
      docType: "TM"
    });
  };

  const onConfirmClickError = () => {
    setConfirmButtonLoading(false);
    addToast({
      type: TOAST_TYPES.ERROR,
      id: "company_details_error",
      body: Locale.wentWrongMessage,
    });
  };

  const onFileClick = () => {
    if (proofDocUrls.length > 0 && !isLoading) {
      window?.open(proofDocUrls[0], "_blank")?.focus();
    }
  };

  const renderFileIcon = () => {
    return <DeedFileIcon />;
  };

  const renderInputText = () => {
    return (
      <div className={"flex flex-col space-y-2 mt-4 items-center justify-center"}>
        <div>
          <Typography text={Locale.drag} size={TYPOGRAPHY_SIZES.SMALL}>
            <Typography
              text={"document"}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"ml-1"}
            />
            <Typography text={Locale.here} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"ml-1"} />
          </Typography>
        </div>
        <div className={"flex flex-row w-full space-x-1 items-center"}>
          <div className="border-t border-black-400 my-2 flex-grow"></div>
          <Typography
            text={"OR"}
            textClasses={"!text-black-500"}
            fontWeight={"400"}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
          />
          <div className="border-t border-black-400 my-2 flex-grow"></div>
        </div>
        <Button title={"Browse"} type={BUTTON_TYPES.SECONDARY} size={BUTTON_SIZES.SMALL} textClasses={"mx-10"} />
      </div>
    );
  };

  const addAnalyticsEvents = () => {
    analytics.trackAsync(Events.TM_BROWSE_DOCUMENT_CLICKED, {
      docType: "TM"
    });
  };

  return (
    <div className={"flex flex-col flex-grow justify-start w-full px-4 mt-4 items-center relative h-full"}>
      <DragAndDropListener
        setFileDragging={setFileDragging}
        onFileSelect={onFileSelect}
        setError={setError}
        setErrorMessage={setErrorMessage}
      />
      <MultiFileInput
        containerClass={"w-full"}
        onFileSelect={onFileSelect}
        isError={isError}
        docUrls={proofDocUrls}
        docTypes={proofDocFileTypes}
        isLoading={isLoading}
        onTransparentWrapperClick={onFileClick}
        addWrapper={proofDocUrls.length > 0 && !isLoading}
        showLoader={isLoading}
        renderFileIcon={renderFileIcon}
        renderInputText={renderInputText}
        isFileTypePdf={isFileTypePdf}
        removeDoc={removeDoc}
        postUploadButtonClick={addAnalyticsEvents}
      />
      <Typography
        text={Locale.sizeAndFileTypeLimit}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"!text-black-500 mt-4"}
      />
      {(proofDocUrls.length > 0 || showSubmitButton) ? (
        <Button
          title={Locale.submit}
          buttonClass={"absolute bottom-4 right-0"}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={() => props.onSubmitDocs(proofDocFiles, proofLink)}
          isLoading={isConfirmButtonLoading}
        />
      ) : null}
    </div>
  );
};

export default SenderCaseAlertDocInput;
