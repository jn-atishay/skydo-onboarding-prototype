import React, { useContext, useEffect, useRef } from "react";
import styles from "./bottom-sheet.module.css";
import CrossIcon from "../ToastMessages/CrossIcon";
import AppContext from "../../../context/AppContext";
import Typography from "../Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import JSHelpers from "../JSHelpers";
import { getMobileDetect } from "../../../util/functions";
import classNames from "classnames";

interface BottomSheetProps {
  isOpen: boolean;
  /**
   * Callback function that will be called when the user clicks on the overlay outside the bottom sheet or the "close" button.
   */
  onClose: () => void;
  children?: React.ReactNode;
  withCloseIcon?: boolean;
  title?: string | React.ReactNode;
  subtitle?: string;
  containerClass?: string;
  bottomContent?: () => JSX.Element;
  topContent?: () => JSX.Element;
  contentClass?: string;
  contentChildrenClass?: string;
}

/**
 * Only renders on mobile devices.
 */
const BottomSheet: React.FC<BottomSheetProps> = (props) => {
  const { isOpen, onClose, children, withCloseIcon = true, bottomContent, topContent, subtitle, contentClass, contentChildrenClass } = props;
  const { theme } = useContext(AppContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMobileFlag, setIsMobileFlag] = React.useState(false);

  useEffect(() => {
    const element = document.getElementsByTagName("body")[0];
    if (isOpen) {
      contentRef.current?.focus();
      JSHelpers.css(element, {
        overflow: "hidden",
      });
    }
    if (!isOpen) {
      JSHelpers.css(element, {
        overflow: "auto",
      });
    }
    return () => {
      JSHelpers.css(element, {
        overflow: "auto",
      });
    };
  }, [isOpen]);

  const handleClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // event.preventDefault();
    onClose();
  };

  useEffect(() => {
    const { isMobile } = getMobileDetect(navigator.userAgent);
    setIsMobileFlag(isMobile());
  }, []);

  /**
   * if it is not mobile screen don't render the bottom sheet
   */
  if (!isMobileFlag) {
    return null;
  }

  return (
    <div ref={contentRef} className={`${styles.bottomSheet} ${isOpen ? styles.open : ""}`}>
      <div className={styles.overlay} onClick={handleClose} />
      <div className={classNames(styles.content, contentClass)}>
        {topContent ? topContent() : null}
        {withCloseIcon && (
          <div className={styles.closeIcon} onClick={handleClose}>
            <CrossIcon stroke={theme.hexColors.black[500]} />
          </div>
        )}
        <div className={classNames(styles.contentChildren, contentChildrenClass)}>
          {props.title && (
            <div className="max-w-sm mb-4">
              {typeof props.title === "string" ? (
                <div className={"flex flex-col gap-1"}>
                  <Typography text={props.title} size={TYPOGRAPHY_SIZES.X_SMALL} type={TYPOGRAPHY_TYPES.HEADING} />
                  {subtitle && (
                    <Typography
                      text={subtitle}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      type={TYPOGRAPHY_TYPES.PARA}
                      textClasses="!text-black-500"
                      fontWeight="400"
                    />
                  )}
                </div>
              ) : (
                props.title
              )}
            </div>
          )}
          {children}
        </div>
        {bottomContent ? bottomContent() : null}
      </div>
    </div>
  );
};

export default BottomSheet;
