import React, { useContext, useRef } from "react";
import classNames from "classnames";
import Typography from "../Typography";
import Locale from "../../../util/locale/en";
import {
  acceptedMimeTypes,
  BUTTON_SIZES,
  BUTTON_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../../constants/atomicConstants";
import FileInputIcon from "../../Icons/FileInputIcon";
import Button from "../Button";
import CircularLoader from "../../UBOPanDetails/CircularLoader";
import AppContext from "../../../context/AppContext";
import FilePreview from "../../Common/FilePreview";
import UploadIcon from "../../Icons/UploadIcon";
import DeleteIcon from "../../Icons/DeleteIcon";

interface Props {
  isError?: boolean;
  errorMessage?: string;
  docUrls: string[];
  docTypes: string[];
  isLoading?: boolean;
  containerClass?: string;
  onFileSelect: (file: File) => void;
  onTransparentWrapperClick?: () => void;
  addWrapper?: boolean;
  showLoader?: boolean;
  renderFileIcon?: () => JSX.Element;
  renderInputText: () => JSX.Element;
  isFileTypePdf?: boolean;
  className?: string | { [key: string]: boolean };
  showBrowseCta?: boolean;
  accept?: string[];
  disableOrText?: boolean;
  canEditImage?: boolean;
  removeDoc: (id: number) => void;
  postUploadButtonClick?: () => void;
}

const MultiFileInput = (props: Props) => {
  const {
    isError,
    errorMessage,
    docUrls,
    docTypes,
    isLoading,
    containerClass,
    onFileSelect,
    onTransparentWrapperClick,
    addWrapper,
    showLoader,
    renderFileIcon,
    renderInputText,
    accept = acceptedMimeTypes,
    disableOrText,
    removeDoc,
    postUploadButtonClick
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList;
    onFileSelect(files[0]);
    event.target.value = "";
  };
  const { theme } = useContext(AppContext);

  const onWrapperClick = () => {
    //
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
    postUploadButtonClick && postUploadButtonClick();
  };

  const docUploaded = docUrls && docUrls.length > 0;

  return (
    <div className={classNames("relative group", containerClass)}>
      <div
        className={classNames(
          "overflow-hidden relative flex flex-col justify-center items-center  rounded-20px border-2 border-dashed ",
          {
            "border-blue-400 bg-black-50 cursor-pointer": !isError && !docUploaded && !isLoading,
            "border-red-400 cursor-pointer": isError,
            "border-none": docUploaded,
          },
          props.className
        )}
        onClick={() => {
          if (docUploaded) return;
          onWrapperClick();
        }}
      >
        <input ref={inputRef} type={"file"} onChange={onFileInput} accept={String(accept)} className={"hidden"} />
        {/*Preview File*/}
        {docUploaded && (
          <div
            className={classNames("grid gap-x-4 gap-y-6 flex-grow", {
              "grid-cols-1": docUrls.length == 1,
              "grid-cols-2": docUrls.length == 2,
              "grid-cols-3": docUrls.length > 2,
            })}
          >
            {docUrls?.map((docUrl, id) => {
              return (
                <div key={id} className={"w-[120px] h-[120px] relative border-2 border-black-200"}>
                  <FilePreview fileLink={docUrl} isPdf={docTypes[id] == "application/pdf"} />
                  <DeleteIcon className={"absolute top-0 right-0 cursor-pointer"} onClick={() => removeDoc(id)} />
                </div>
              );
            })}
          </div>
        )}
        {/*No File Uploaded Yet*/}
        {!docUploaded && !isLoading ? (
          <>
            <div className={"flex flex-1 flex-col justify-center items-center py-4"}>
              {renderFileIcon ? renderFileIcon() : <FileInputIcon />}
              {renderInputText()}
            </div>
          </>
        ) : null}
        {docUploaded ? (
          <Button
            type={BUTTON_TYPES.SECONDARY}
            title={Locale.upload}
            rightIcon={() => <UploadIcon width={16} height={16} stroke={"black"} strokeWidth={3} />}
            size={BUTTON_SIZES.SMALL}
            buttonClass={"flex flex-row space-x-2 mt-6"}
            onButtonClick={onWrapperClick}
          />
        ) : null}
      </div>

      {errorMessage ? (
        <Typography
          text={errorMessage}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!text-red-400 mt-4"}
        />
      ) : null}

      {showLoader ? (
        <div className={"absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center"}>
          <CircularLoader isGray={true} />
        </div>
      ) : null}
    </div>
  );
};

MultiFileInput.defaultProps = {
  onFileSelect: () => {},
};

export default MultiFileInput;
