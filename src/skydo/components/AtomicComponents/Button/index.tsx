/*
  1. type - primary, secondary, tertiary
  2. size - large, medium, small, x small
  3. disable status
  4. loading status
  5. support for left and right icons,
  6. onButtonClick callback function
 */
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import classNames from "classnames";
import Typography from "../Typography";
import React, { ReactElement, useContext } from "react";
import AppContext from "../../../context/AppContext";
import styles from "./index.module.css";

export interface ButtonProps {
  type: string;
  isDisabled: boolean;
  title: string | JSX.Element | (() => ReactElement);
  isLoading?: boolean;
  loadingTitle?: string;
  size: string;
  leftIcon?: () => any;
  rightIcon?: () => any;
  onButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  textProps?: { [key: string]: string };
  buttonClass?: string;
  textClasses?: string;
  isRedButton?: boolean;
  tabIndex?: number;
  buttonProps?: { [key: string]: any };
  subTitle?: string;
  /**
   * html native type, specially used inside form not get submit activated
   */
  nativeType?: "button" | "reset" | "submit";
  textWrapperClass?: string;
  subtitleTextClasses?: string;
}

export const getTypographySize = (size: string): string => {
  switch (size) {
    case BUTTON_SIZES.SMALL:
      return TYPOGRAPHY_SIZES.SMALL;
    case BUTTON_SIZES.MEDIUM:
      return TYPOGRAPHY_SIZES.MEDIUM;
    case BUTTON_SIZES.LARGE:
      return TYPOGRAPHY_SIZES.LARGE;
    case BUTTON_SIZES.X_SMALL:
      return TYPOGRAPHY_SIZES.X_SMALL;
    default:
      return TYPOGRAPHY_SIZES.MEDIUM;
  }
};

/*
TODO
1. Ignoring small and extra small
2. loaders
 */

const getFontColor = (type: string, isDisabled: boolean, theme: { [key: string]: any }) => {
  return isDisabled
    ? theme.hexColors.black[400]
    : type === BUTTON_TYPES.PRIMARY
    ? theme.hexColors.white
    : theme.hexColors.black[700];
};

const getSubtitleFontColor = (type: string, isDisabled: boolean, theme: { [key: string]: any }) => {
  return isDisabled
    ? theme.hexColors.black[400]
    : type === BUTTON_TYPES.PRIMARY
    ? theme.hexColors.blue[200]
    : theme.hexColors.black[500];
};

const Button = (props: ButtonProps): JSX.Element => {
  const {
    nativeType = "submit", // default to 'submit',
    type,
    title,
    isLoading,
    loadingTitle,
    leftIcon,
    rightIcon,
    size,
    isRedButton,
    tabIndex,
    buttonProps,
    onButtonClick,
    textProps,
    isDisabled,
    buttonClass,
    textClasses,
    subTitle,
    textWrapperClass,
    subtitleTextClasses
  } = props;
  const { theme } = useContext(AppContext);
  const fontColor: string = getFontColor(type, isDisabled, theme);
  const subtitleFontColor: string = getSubtitleFontColor(type, isDisabled, theme);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled || isLoading) {
      event.preventDefault();
      return;
    }
    onButtonClick(event);
    buttonRef?.current?.blur();
  };

  return (
    <button
      type={nativeType}
      ref={buttonRef}
      tabIndex={tabIndex}
      className={classNames(
        "focus:outline-none flex flex-row items-center rounded-10px w-fit cursor-pointer gap-x-2",
        {
          "bg-navyblue-500 hover:bg-navyblue-400 focus:bg-navyblue-400": type === BUTTON_TYPES.PRIMARY,
          "bg-white border border-solid border-black-400": type === BUTTON_TYPES.SECONDARY,
          "hover:shadow-elevation4 focus:shadow-elevation4": type != BUTTON_TYPES.TERTIARY,
          "hover:bg-black-50 focus:bg-black-50": type === BUTTON_TYPES.TERTIARY,
          "pointer-events-none !cursor-not-allowed": isDisabled,
          "!bg-black-100": isDisabled && type != BUTTON_TYPES.TERTIARY,
          "h-14 px-6 py-4": size === BUTTON_SIZES.LARGE,
          "h-12 px-6 py-3.5": size === BUTTON_SIZES.MEDIUM,
          "h-9 px-4 py-2.5": size === BUTTON_SIZES.SMALL,
          "h-8 px-4 py-2": size === BUTTON_SIZES.X_SMALL,
          "!bg-red-400 hover:!opacity-75 focus:!opacity-75": isRedButton,
        },
        buttonClass
      )}
      onClick={onClick}
      {...buttonProps}
    >
      {isLoading ? (
        <div className={loadingTitle ? "flex items-center justify-center gap-2 w-full" : ""} role="status">
          {loadingTitle && <Typography text={loadingTitle} type={TYPOGRAPHY_TYPES.LABEL} size={getTypographySize(size)} fontColor={fontColor} />}
          <div className="px-4" aria-hidden="true">
            <div className={styles[type === BUTTON_TYPES.SECONDARY ? 'dot-typing-secondary' : 'dot-typing']}></div>
          </div>
        </div>
      ) : (
        <>
          {leftIcon ? leftIcon() : null}
          <div className={classNames("flex-1 flex flex-col items-center justify-center", textWrapperClass)}>
            {typeof title === "function" ? (
              title()
            ) : (
              <Typography
                text={title}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={getTypographySize(size)}
                fontColor={fontColor}
                textProps={textProps}
                textClasses={textClasses}
              />
            )}
            {subTitle ? (
              <Typography
                text={subTitle}
                size={TYPOGRAPHY_SIZES.X_X_SMALL}
                fontColor={subtitleFontColor}
                textClasses={classNames("!mt-1", subtitleTextClasses)}
              />
            ) : null}
          </div>
          {rightIcon ? rightIcon() : null}
        </>
      )}
    </button>
  );
};

Button.defaultProps = {
  onButtonClick: () => {},
  type: BUTTON_TYPES.PRIMARY,
  isDisabled: false,
  isLoading: false,
  size: BUTTON_SIZES.MEDIUM,
  tabIndex: 0,
};

export default Button;
