//Jun 2023

import classnames from "classnames";
import classNames from "classnames";
import React, { memo, useContext, useEffect, useState } from "react";
import Button from "../../AtomicComponents/Button";
import Locale from "../../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import { ArrowDirection, ArrowIconSmallRotated } from "../../Icons/ArrowIconSmall";
import Typography from "../../AtomicComponents/Typography";
import AppContext from "../../../context/AppContext";
import PdfPreviewPopup from "./PdfPreviewPopup";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("../PdfViewer"), { ssr: false });

interface Props {
  className?: string;
  url: string;
  pageNumber?: number;
  showPreviewOnClick?: boolean;
  onOverlayClick?: () => void;
  hideOverlay?: boolean;
  height?: number;
  containerClass?: string;
}

const RenderPdf = memo((props: Props) => {
  const { className, url, pageNumber = 1, showPreviewOnClick = true, onOverlayClick } = props;
  const [showPreview, setShowPreview] = useState(false);
  const pdfContainerRef = React.useRef<HTMLDivElement>(null);
  const [pdfWrapper, setPdfWrapper] = React.useState({} as { width: number; height: number });

  const [numPages, setNumPages] = useState(1);

  const [pageRendered, setPageRendered] = useState(pageNumber);
  const { theme } = useContext(AppContext);

  const onRightClick = () => {
    if (pageRendered < numPages) {
      setPageRendered(pageRendered + 1);
    }
  };

  const onLeftClick = () => {
    if (pageRendered > 1) {
      setPageRendered(pageRendered - 1);
    }
  };

  const isLeftDisabled = pageRendered === 1;
  const isRightDisabled = pageRendered === numPages;

  const paginationText = Locale.pagination.replace(":page", String(pageRendered)).replace(":total", String(numPages));

  const onClick = () => {
    if (showPreviewOnClick) {
      setShowPreview(true);
    }
    onOverlayClick && onOverlayClick();
  };
  const setPdfWrapperDimensions = () => {
    if (pdfContainerRef.current) {
      const width = pdfContainerRef.current.getBoundingClientRect().width;
      const height = pdfContainerRef.current.getBoundingClientRect().height;
      setPdfWrapper({ width, height });
    }
  };

  useEffect(() => {
    setPdfWrapperDimensions();
    window.addEventListener("resize", setPdfWrapperDimensions);
    return () => {
      window.removeEventListener("resize", setPdfWrapperDimensions);
    };
  }, []);

  const renderPreviewOverlay = () => {
    if (props.hideOverlay) {
      return null;
    }
    return (
      <div
        className={
          "absolute inset-0 bg-black-700 opacity-0 flex flex-col justify-center items-center group-hover:bg-opacity-60 group-hover:opacity-100"
        }
        onClick={onClick}
      >
        <Button
          title={Locale.viewSingularInvoice}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          buttonClass={"!bg-black-700 !bg-opacity-0"}
          textClasses={"!text-white"}
        />
      </div>
    );
  };

  return (
    <div className={classnames("flex flex-col items-center w-full", props.containerClass)}>
      <div
        className={classnames(
          "group relative cursor-pointer h-[407px] w-full flex items-center justify-center shadow-headerShadow rounded-10px overflow-hidden border border-black-400",
          className
        )}
        ref={pdfContainerRef}
      >
        <PdfViewer pageNumber={pageRendered} height={pdfWrapper.height} url={url} setNumberOfPages={setNumPages} />
        {renderPreviewOverlay()}
      </div>

      {numPages > 1 ? (
        <div className={"flex_row_item_center w-full justify-center mt-4"}>
          <div className={"flex_row_item_center justify-center w-full"}>
            <div
              className={classNames("bg-white p-2 rounded-full flex items-center justify-center hover:shadow-common", {
                "cursor-pointer": !isLeftDisabled,
                "cursor-not-allowed": isLeftDisabled,
              })}
              onClick={onLeftClick}
            >
              <ArrowIconSmallRotated
                stroke={isLeftDisabled ? theme.hexColors.black[400] : undefined}
                direction={ArrowDirection.LEFT}
              />
            </div>
            <Typography
              text={paginationText}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500 px-2"}
            />
            <div
              className={classNames("bg-white p-2 rounded-full flex items-center justify-center hover:shadow-common", {
                "cursor-pointer": !isRightDisabled,
                "cursor-not-allowed": isRightDisabled,
              })}
              onClick={onRightClick}
            >
              <ArrowIconSmallRotated
                stroke={isRightDisabled ? theme.hexColors.black[400] : undefined}
                direction={ArrowDirection.RIGHT}
              />
            </div>
          </div>
        </div>
      ) : null}
      {showPreviewOnClick ? (
        <PdfPreviewPopup closePreview={() => setShowPreview(false)} url={url} showPreview={showPreview} />
      ) : null}
    </div>
  );
});

RenderPdf.displayName = "RenderPdf";

export default RenderPdf;
