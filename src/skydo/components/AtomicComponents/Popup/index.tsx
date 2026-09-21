import React, { ReactElement, useContext, useEffect, useRef } from "react";
import classNames from "classnames";
import { isFunction } from "../../../util/functions";
import PopupHeader from "./PopupHeader";
import IconContainer from "../../Common/IconContainer";
import CrossIcon from "../ToastMessages/CrossIcon";
import AppContext from "../../../context/AppContext";
import DownloadIcon from "../../Icons/DownloadIcon";
import ArrowLeftIcon from "../../Icons/ArrowLeftIcon";
import Typography from "../Typography";
import Locale from "../../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";

interface Props {
  open: boolean;
  renderContent: () => ReactElement;
  outsideClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  containerClass?: string;
  isCommonHeader?: boolean;
  title?: string | ReactElement;
  subtitle?: string;
  renderCTAs?: () => ReactElement;
  closeIconClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  headerClass?: string;
  ctaClass?: string;
  tabIndex?: number;
  isDashboardPopup?: boolean;
  isLargePopup?: boolean;
  containerStyle?: { [key: string]: any };
  isPdfPreviewPopup?: boolean;
  onDownloadDocClick?: () => void;
  numberOfPages?: number;
  pageRendered?: number;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  disableCrossIcon?: boolean;
  bgWrapperClass?: string;
  isMobilePopup?: boolean;
  customContainerWidth?: boolean;
  headerContainerClass?: string;
}

/*
  1. position fixed
  2. width hight
  3. transparent background
  4. content at the center
  5. optional close on outside click
  6. common css for container
 */

function css(element: any, style: { [key: string]: string }) {
  for (const property in style) element.style[property] = style[property];
}

const Popup = (props: Props) => {
  const {
    open,
    renderContent,
    outsideClick,
    containerClass,
    isCommonHeader,
    closeIconClick,
    title,
    subtitle,
    headerClass,
    renderCTAs,
    tabIndex,
    isDashboardPopup,
    ctaClass,
    isLargePopup,
    containerStyle,
    isPdfPreviewPopup,
    numberOfPages,
    pageRendered,
    onLeftClick,
    onRightClick,
    disableCrossIcon,
    bgWrapperClass,
    isMobilePopup,
    customContainerWidth,
    headerContainerClass
  } = props;
  const contentRef = useRef<HTMLInputElement | null>(null);
  const { theme } = useContext(AppContext);

  const onContainerClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (!(contentRef && contentRef.current && contentRef.current?.contains(target))) {
      outsideClick && outsideClick(event);
    }
  };

  useEffect(() => {
    const element = document.getElementsByTagName("body")[0];
    if (open) {
      contentRef.current?.focus();
      css(element, {
        overflow: "hidden",
      });
    }
    if (!open) {
      css(element, {
        overflow: "auto",
      });
    }
    return () => {
      css(element, {
        overflow: "auto",
      });
    };
  }, [open]);

  if (!open) return null;

  const renderPdfPreviewPopupCTAs = () => {
    return (
      <>
        <IconContainer containerClass={"bg-black-700 fixed top-6 right-6 cursor-pointer"} onClick={closeIconClick}>
          <CrossIcon width={24} height={24} stroke={theme.hexColors.white} />
        </IconContainer>
        {props.onDownloadDocClick && (
          <IconContainer
            containerClass={"bg-black-700 fixed top-6 right-22 cursor-pointer"}
            onClick={props.onDownloadDocClick}
          >
            <DownloadIcon width={24} height={24} stroke={theme.hexColors.white} />
          </IconContainer>
        )}
        {numberOfPages && numberOfPages > 1 ? (
          <>
            <IconContainer
              containerClass={{
                "bg-black-700 fixed left-6 cursor-pointer top-1/2 -translate-y-1/2": true,
                "!cursor-not-allowed": pageRendered === 1,
              }}
              onClick={onLeftClick}
            >
              <ArrowLeftIcon stroke={theme.hexColors.white} className={pageRendered === 1 ? "opacity-60" : ""} />
            </IconContainer>
            <IconContainer
              containerClass={{
                "bg-black-700 fixed right-6 rotate-180 cursor-pointer top-1/2 -translate-y-1/2": true,
                "!cursor-not-allowed": pageRendered === numberOfPages,
              }}
              onClick={onRightClick}
            >
              <ArrowLeftIcon
                stroke={theme.hexColors.white}
                className={pageRendered === numberOfPages ? "opacity-60" : ""}
              />
            </IconContainer>
          </>
        ) : null}
      </>
    );
  };

  return (
    <div
      onClick={onContainerClick}
      className={classNames(
        "z-[100001] fixed top-0 right-0 left-0 bottom-0 bg-black-700/60 flex justify-center items-center",
        bgWrapperClass
      )}
    >
      <div
        tabIndex={tabIndex}
        ref={contentRef}
        className={classNames(
          `focus:outline-none bg-white rounded-2xl shadow-common ${
            customContainerWidth ? "" : "w-4/12 max-w-lg"
          } max-h-[750px] short:max-h-screen overflow-auto`,
          {
            "p-6": isDashboardPopup,
            "p-10": !isDashboardPopup,
            "!w-8/12 !max-w-5xl": isLargePopup,
            "!w-10/12 p-4": isMobilePopup,
          },
          containerClass
        )}
        style={containerStyle}
      >
        {isCommonHeader ? (
          <PopupHeader
            title={title}
            subtitle={subtitle}
            closeIconClick={closeIconClick}
            headerClass={headerClass}
            disableCrossIcon={disableCrossIcon}
            className={headerContainerClass}
          />
        ) : null}
        {renderContent()}
        {isFunction(renderCTAs) && renderCTAs ? (
          <div className={classNames("flex flex-row justify-end items-center gap-x-2", ctaClass)}>
            {renderCTAs() as React.ReactNode}
          </div>
        ) : null}
        {isPdfPreviewPopup ? renderPdfPreviewPopupCTAs() : null}
        {isPdfPreviewPopup && numberOfPages && numberOfPages > 1 ? (
          <div className={"-translate-x-1/2 w-fit mt-3"}>
            <Typography
              text={Locale.pagination.replace(":page", String(pageRendered)).replace(":total", String(numberOfPages))}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-white whitespace-nowrap"}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

Popup.defaultProps = {
  open: false,
  tabIndex: 0,
};

export default Popup;
