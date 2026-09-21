import React, { forwardRef, useEffect, useState } from "react";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import Typography from "../Typography";
import classNames from "classnames";
import DropdownArrow from "../../Common/DropdownArrow";

type TitleConfig = {
  type: string;
  size: string;
};

type CollapsibleBase = {
  title?: string;
  children: React.ReactNode;
  isDefaultOpen?: boolean;
  containerClass?: string;
  onClick?: () => void;
  onClickWithOpenState?: (isOpen: boolean) => void;
  titleConfig?: TitleConfig;
  titleEle?: React.ReactNode;
  titleFontWeight?: string | number;
  id?: string;
  titleClasses?: string;
  openTitleClasses?: string;
  /** Wrapper around children when expanded (default `mt-2`) */
  contentWrapperClass?: string;
  dropdownArrowProps?: {
    stroke?: string;
    width?: number;
    height?: number;
    strokeWidth?: number;
    containerClass?: string;
    svgClassName?: string;
    onArrowClick?: () => void;
  };
};

/**
 * 1. One of `title` or `titleEle` must be present at a time.
 * 2. Both cannot be present at the same time
 */
type CollapsibleProps = (
  | ({ title: string } & Partial<{ titleEle: never }>)
  | ({ titleEle: React.ReactNode } & Partial<{
      title: never;
    }>)
) &
  CollapsibleBase;

const Accordion = forwardRef<HTMLDivElement, CollapsibleProps>((props: CollapsibleProps, ref) => {
  const {
    title,
    children,
    isDefaultOpen = false,
    containerClass = "",
    onClick = () => {},
    onClickWithOpenState = (isOpen: boolean) => {
    },
    titleConfig,
    titleEle,
    titleFontWeight,
    id,
    titleClasses,
    openTitleClasses,
    contentWrapperClass,
    dropdownArrowProps,
  } = props;
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  const handleToggle = () => {
    let nextOpenState = !isOpen;
    setIsOpen(nextOpenState);
    onClick();
    onClickWithOpenState(nextOpenState);
  };

  useEffect(() => {
    setIsOpen(isDefaultOpen);
  }, [isDefaultOpen]);

  return (
    <div className={classNames(containerClass)} ref={ref} id={id}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={classNames(
          "cursor-pointer flex flex-row items-center justify-between select-none",
          titleClasses,
          isOpen ? openTitleClasses : ""
        )}
      >
        {titleEle ? (
          titleEle
        ) : (
          <Typography
            text={title}
            type={titleConfig?.type || TYPOGRAPHY_TYPES.LABEL}
            size={titleConfig?.size || TYPOGRAPHY_SIZES.LARGE}
            fontWeight={titleFontWeight}
          />
        )}
        <DropdownArrow isOpen={isOpen} {...dropdownArrowProps} />
      </div>
      {isOpen && (
        <div className={contentWrapperClass !== undefined ? contentWrapperClass : "mt-2"}>{children}</div>
      )}
    </div>
  );
});

Accordion.displayName = "Accordion";
export default Accordion;
