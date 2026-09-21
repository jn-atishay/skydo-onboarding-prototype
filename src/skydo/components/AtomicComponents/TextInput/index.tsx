import Typography from "../Typography";
import { INPUT_TYPES, TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import classNames from "classnames";
import Tooltip from "../Tooltip";
import InfoIcon from "../../Icons/InfoIcon";
import AppContext from "../../../context/AppContext";
import { TextInputRef } from "../../../types/atomicComponentTypes";
import Locale from "../../../util/locale/en";

export type TooltipProps = {
  position?: string;
  tooltipTheme?: "light" | "dark";
};

type Props = {
  label?: string;
  footerText?: string | JSX.Element;
  placeholder?: string;
  infoText?: string | JSX.Element;
  isError?: boolean;
  size?: string;
  type?: string;
  value?: string | number;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  customClass?: string;
  leftElement?: () => JSX.Element | null;
  rightElement?: () => JSX.Element | null;
  isDisabled?: boolean;
  onFocus?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onInputClick?: () => void;
  dropdownDisabled?: boolean; //To disable input but not fade colors in case of non searchable dropdown
  inputClass?: string;
  inputProps?: { [key: string]: any };
  rightLabel?: string | JSX.Element;
  rightLabelClass?: string;
  pattern?: string;
  footerClass?: string; //overrides footer text default class, footer text handles error text and css be default
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  inputWrapperClass?: string;
  onPaste?: (event: React.ClipboardEvent) => void;
  labelTextClass?: string;
  labelWrapperClass?: string;
  tabIndex?: number;
  disabledClass?: string;
  onOnlyInputAreaClick?: () => void;
  isLabelOptional?: boolean;
  isLabelRequired?: boolean;
  tooltipProps?: TooltipProps;
  showOverlay?: boolean;
};

/*
type - large - medium
 1. Label(label (medium, small)), Icon, error
  a. Info tooltip
 2. Input (height 56, 48)
  a. onChange
  b. error handling
 3. footer error handling (para small for all types)
 4. Right element
 5. left element
 6. disabled
 */

const TextInput = React.forwardRef<TextInputRef, Props>((props: Props, ref: any) => {
  const {
    footerText,
    isError,
    label,
    size = INPUT_TYPES.MEDIUM,
    placeholder,
    onFocus,
    onInputClick = () => {},
    dropdownDisabled = false,
    type = "text",
    value,
    onChange = () => {},
    infoText,
    customClass,
    leftElement = () => null,
    rightElement = () => null,
    isDisabled,
    inputClass,
    inputProps = {},
    rightLabel,
    rightLabelClass = "",
    pattern,
    footerClass,
    onKeyDown,
    onBlur,
    inputWrapperClass,
    onPaste,
    labelTextClass,
    labelWrapperClass,
    tabIndex,
    disabledClass,
    isLabelOptional,
    isLabelRequired,
    tooltipProps = {},
    showOverlay = false,
  } = props;
  const { theme } = useContext(AppContext);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const inputElementContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, toggleFocus] = useState(false);
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //@ts-ignore
    onChange(event.target.value, event);
  };

  const onInputBlur = () => {
    toggleFocus(false);
    onBlur && onBlur();
  };

  const onInputFocus = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    toggleFocus(true);
    onFocus && onFocus(event);
  };

  const getLabelFontColor = () => {
    if (isError) return theme.hexColors.red[400];
    return undefined;
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputElement?.current?.focus();
    },
    getInputElementWrapperRef: () => inputElementContainerRef.current,
    select: () => {
      inputElement?.current?.select();
    },
  }));

  useEffect(() => {
    const input = inputElement.current;
    if (type === "number" && input) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
      };
      input.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        input.removeEventListener("wheel", handleWheel);
      };
    }
  }, [type]);

  const labelClass = labelTextClass
    ? labelTextClass
    : isDisabled && !dropdownDisabled
    ? "!text-black-400 mr-1"
    : "mr-1";

  return (
    <div className={classNames("flex flex-col", inputClass)} onClick={onInputClick}>
      {label && (
        <div className={classNames("flex flex-row mb-2 justify-between", labelWrapperClass)}>
          <>
            <div className={"flex flex-row"}>
              <Typography
                text={label}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={size === INPUT_TYPES.LARGE ? TYPOGRAPHY_SIZES.MEDIUM : TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={labelClass}
                fontColor={getLabelFontColor()}
              />
              {isLabelOptional && (
                <Typography
                  text={Locale.optionalInBrckt}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={size === INPUT_TYPES.LARGE ? TYPOGRAPHY_SIZES.MEDIUM : TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-black-500"}
                />
              )}
              {isLabelRequired ? (
                <Typography
                  text={"*"}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={size === INPUT_TYPES.LARGE ? TYPOGRAPHY_SIZES.MEDIUM : TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-red-400"}
                />
              ) : null}
              {infoText ? (
                <Tooltip tooltipText={infoText} position={TOOLTIP_POSITION.RIGHT} {...tooltipProps}>
                  <InfoIcon />
                </Tooltip>
              ) : null}
            </div>
          </>
          {rightLabel && (
            <Typography
              text={rightLabel}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={classNames("!text-black-500", rightLabelClass)}
            />
          )}
        </div>
      )}

      <div
        tabIndex={tabIndex}
        className={classNames(
          "flex flex-row items-center border border-black-400 rounded-10px px-4 bg-white relative",
          {
            "border-navyblue-500": !isDisabled && isFocused && !isError,
            "border-red-400": !isDisabled && isError,
            "h-14": size === INPUT_TYPES.LARGE && type !== "textarea",
            "h-12": size === INPUT_TYPES.MEDIUM && type !== "textarea",
            "h-9 !px-2": size === INPUT_TYPES.SMALL && type !== "textarea",
            "h-8 !px-2": size === INPUT_TYPES.X_SMALL && type !== "textarea",
            "!bg-black-50": isDisabled && !dropdownDisabled,
          },
          inputWrapperClass
        )}
        onClick={props.onOnlyInputAreaClick}
        ref={inputElementContainerRef}
      >
        <>
          {leftElement()}
          {type === "textarea" ? (
            <textarea
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              disabled={isDisabled}
              placeholder={placeholder}
              className={classNames(
                "flex-1 text-black-700 appearance-none focus:outline-none resize-none py-3 placeholder:text-black-400",
                {
                  "!text-black-500": isDisabled && !dropdownDisabled,
                  "!bg-black-50": isDisabled && !dropdownDisabled,
                }
              )}
              onChange={onInputChange}
              value={value}
              {...inputProps}
            />
          ) : (
            <input
              onPaste={onPaste}
              onKeyDown={onKeyDown}
              ref={inputElement}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              disabled={isDisabled}
              placeholder={placeholder}
              type={type}
              onChange={onInputChange}
              value={value}
              pattern={pattern}
              className={classNames(
                "text-black-700 appearance-none focus:outline-none flex-1 h-full placeholder:text-black-400",
                {
                  "py-3.5": size === INPUT_TYPES.LARGE,
                  "py-3": size === INPUT_TYPES.MEDIUM,
                  "py-1.5": size === INPUT_TYPES.SMALL,
                  "!text-black-500": isDisabled && !dropdownDisabled,
                  "!bg-black-50": isDisabled && !dropdownDisabled,
                },
                customClass
              )}
              {...inputProps}
            />
          )}
          <div className={"flex items-center"}>{rightElement()}</div>
          {isDisabled || showOverlay ? (
            <div
              className={classNames("top-0 bottom-0 right-0 left-0 absolute cursor-pointer", disabledClass)}
              onClick={onInputClick}
            />
          ) : null}
        </>
      </div>

      {footerText ? (
        <Typography
          text={footerText}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={footerClass ? footerClass : isError ? "!text-red-400 mt-2" : "!text-black-500 mt-2"}
        />
      ) : null}
    </div>
  );
});

TextInput.displayName = "TextInput";

export default TextInput;
