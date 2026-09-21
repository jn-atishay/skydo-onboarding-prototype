import React, { useContext, useRef } from "react";
import classNames from "classnames";
import Typography from "../Typography";
import Locale from "../../../util/locale/en";
import {
  acceptedMimeTypes,
  BUTTON_SIZES,
  BUTTON_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES
} from "../../../constants/atomicConstants";
import FileInputIcon from "../../Icons/FileInputIcon";
import Image from "next/image";
import { isFileTypeNotPdf } from "../../../util/functions";
import Button from "../Button";
import CircularLoader from "../../UBOPanDetails/CircularLoader";
import IconContainer from "../../Common/IconContainer";
import EditIcon from "../../Icons/EditIcon";
import AppContext from "../../../context/AppContext";
import RenderPdf from "../../Common/RenderPdf";

interface Props {
  isError?: boolean;
  errorMessage?: string;
  imageUrl?: string;
  isLoading?: boolean;
  containerClass?: string;
  onFileSelect: (file: File) => void;
  onTransparentWrapperClick?: () => void;
  addWrapper?: boolean;
  showLoader?: boolean;
  renderFileIcon?: () => JSX.Element;
  renderInputText?: () => JSX.Element;
  isFileTypePdf?: boolean;
  className?: string | { [key: string]: boolean };
  showBrowseCta?: boolean;
  accept?: string[];
  disableOrText?: boolean;
  canEditImage?: boolean;
  showMobileCta?: boolean;
  mobileCtaText?: string;
  /** Hide the upload icon on mobile and center the CTA (icon stays on desktop). */
  hideMobileIcon?: boolean;
  customPreview?: JSX.Element;
  errorClassName?: string;
  supportMultipleFileUpload?: boolean;
  onMultipleFileSelect?: (files: FileList) => void;
  /** Fires when the user opens the file picker (dashed area / browse), before a file is chosen */
  onFilePickerOpen?: () => void;
}

const FileInput = (props: Props) => {
  const {
    isError,
    errorMessage,
    imageUrl,
    isLoading,
    containerClass,
    onFileSelect,
    onTransparentWrapperClick,
    addWrapper,
    showLoader,
    renderFileIcon,
    renderInputText,
    isFileTypePdf,
    accept = acceptedMimeTypes,
    disableOrText,
    showMobileCta,
    mobileCtaText,
    hideMobileIcon,
    customPreview,
    errorClassName,
    supportMultipleFileUpload,
    onMultipleFileSelect,
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList;
    onFileSelect(files[0]);
    if (supportMultipleFileUpload) {
      onMultipleFileSelect?.(files);
    }
    event.target.value = "";
  };
  const { theme } = useContext(AppContext);

  const onWrapperClick = () => {
    if (imageUrl && !props.canEditImage) {
      return;
    }
    if (!imageUrl && !isLoading) {
      props.onFilePickerOpen?.();
    }
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  /*
  1. Re upload
  2. preview
  3. Re upload in preview
   */

  const isPdf = isFileTypePdf || (imageUrl ? !isFileTypeNotPdf(imageUrl) : false);

  return (
    <div className={classNames("relative group", containerClass)}>
      <div
        className={classNames(
          "overflow-hidden relative mt-2 md:mt-0 flex flex-col justify-center items-center bg-black-50 rounded-20px border-2 border-dashed cursor-pointer",
          hideMobileIcon ? "h-24 py-4 md:h-52 md:pt-6 md:pb-5" : "h-[135px] md:h-52 pt-6 pb-5",
          {
            "border-blue-400 p-7": !isError && !imageUrl && !isLoading,
            "border-red-400 p-7": isError,
            "border-none": imageUrl,
          },
          props.className
        )}
        onClick={onWrapperClick}
      >
        <input
          ref={inputRef}
          type={"file"}
          onChange={onFileInput}
          accept={String(accept)}
          className={"hidden"}
          multiple={true}
        />
        {imageUrl ? (
          customPreview ? (
            customPreview
          ) : !isPdf ? (
            <Image src={imageUrl} layout={"fill"} objectFit={"contain"} />
          ) : (
            <div>
              <iframe
                title={Locale.documentPreview}
                width="100%"
                height="100%"
                allow={"fullscreen"}
                src={imageUrl}
                className={"border-0 object-contain hide_for_mob"}
              ></iframe>
              <RenderPdf url={imageUrl} height={34} hideOverlay={true} className={"hide_for_desktop"} />
            </div>
          )
        ) : null}
        {!imageUrl && !isLoading ? (
          <>
            <div
              className={classNames(
                "flex flex-1 w-full flex-row md:flex-col md:justify-center items-center",
                hideMobileIcon ? "justify-center" : "justify-between"
              )}
            >
              {hideMobileIcon ? (
                <div className={"hide_for_mob"}>{renderFileIcon ? renderFileIcon() : <FileInputIcon />}</div>
              ) : renderFileIcon ? (
                renderFileIcon()
              ) : (
                <FileInputIcon />
              )}
              <div className={"hide_for_mob"}>
                {renderInputText ? (
                  renderInputText()
                ) : (
                  <div className={"mt-4"}>
                    <Typography text={Locale.drag} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"mr-1"} />
                    <Typography
                      text={Locale.dragDirectorPan}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.SMALL}
                    />
                    <Typography text={Locale.here} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"ml-1"} />
                  </div>
                )}
              </div>
              {props.showBrowseCta && !disableOrText ? (
                <div className={"hide_for_mob"}>
                  <div
                    className={
                      "content-bwn-line after:border-black-400 before:border-black-400 after:ml-1.5 before:mr-1.5 w-full mt-1"
                    }
                  >
                    <Typography
                      text={Locale.or}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses={"!text-black-500"}
                    />
                  </div>
                  <Button
                    title={Locale.browse}
                    size={BUTTON_SIZES.SMALL}
                    type={BUTTON_TYPES.SECONDARY}
                    buttonClass={"!w-full !justify-center mt-2"}
                  />
                </div>
              ) : null}
              {props.showMobileCta ? (
                <div className={classNames("flex flex-col hide_for_desktop", { "items-center": hideMobileIcon })}>
                  <Typography
                    text={props.mobileCtaText || ""}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={hideMobileIcon ? "text-center" : ""}
                  />
                  <Button
                    title={Locale.browse}
                    size={BUTTON_SIZES.SMALL}
                    type={BUTTON_TYPES.SECONDARY}
                    buttonClass={"!w-full !justify-center mt-2"}
                  />
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
      {errorMessage ? (
        <Typography
          text={errorMessage}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={`!text-red-400 mt-4 ${errorClassName}`}
        />
      ) : null}
      {addWrapper ? (
        <div className={"absolute left-0 right-0 top-0 bottom-0 opacity-0"} onClick={onTransparentWrapperClick} />
      ) : null}
      {showLoader ? (
        <div className={"absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center"}>
          <CircularLoader isGray={true} />
        </div>
      ) : null}
      {props.canEditImage && imageUrl ? (
        <div className={"absolute right-1 top-1 hidden group-hover:block"} onClick={onWrapperClick}>
          <IconContainer containerClass={"!h-8 !w-8 bg-black-700 bg-opacity-50 cursor-pointer"}>
            <EditIcon stroke={theme.hexColors.white} />
          </IconContainer>
        </div>
      ) : null}
    </div>
  );
};

FileInput.defaultProps = {
  onFileSelect: () => {},
};

export default FileInput;
