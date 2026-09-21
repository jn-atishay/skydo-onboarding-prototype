import TextInput from "../TextInput";
import { INPUT_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import DownArrowIcon from "../../Icons/DownArrowIcon";
import classNames from "classnames";
import classnames from "classnames";
import DeprecatedDropdownOptions from "./DeprecatedDropdownOptions";
import { MobileSheetProps, Option, Options, TextInputRef } from "../../../types/atomicComponentTypes";
import SearchIcon from "../../Icons/SearchIcon";
import * as R from "remeda";
import BottomSheet from "../BottomSheet";
import useMobileDetect from "../../../util/customHooks/useMobileDetect";
import Typography from "../Typography";
import InfoIcon from "../ToastMessages/InfoIcon";
import AppContext from "../../../context/AppContext";

interface Props {
  dropdownLabel?: string;
  isLabelRequired?: boolean;
  options: Options;
  selectedValue?: any;
  infoText?: string;
  footerText?: string | JSX.Element;
  onSelect: (value: any, option: any) => void;
  searchable: boolean;
  showSearchIcon?: boolean;
  containerClass?: string;
  placeholder?: string;
  isError?: boolean;
  showAllOptionsInit?: boolean;
  onLoadCallback?: (ref: TextInputRef | null) => void;
  showSubtext?: boolean;
  inputTextClass?: string;
  isDisabled?: boolean;
  optionsContainerClass?: string;
  leftElement?: () => JSX.Element | null;
  renderNoResultsCard?: (val?: string) => JSX.Element;
  renderOptionTag?: (option: Option) => JSX.Element;
  defaultVal?: string;
  inputWrapperClass?: string;
  onInputTextChange?: (val: string) => void;
  addInputTextInOptions?: boolean;
  initialValue?: string;
  textInputSize?: string;
  hideArrowIcon?: boolean;
  renderRightIcon?: () => JSX.Element | null;
  subtextClass?: string;
  inputClassNonSearch?: string;
  changeTextValOnOutsideClick?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputClick?: () => void;
  overridingOptionsTypographyProps?: { type: string; size: string };
  overridingOptionsSubtextTypographyProps?: { type: string; size: string };
  disabledClass?: string;
  /** When true, opening the dropdown resets filter to show full list (used by ClientBankCountryInput) */
  resetFilterOnOpen?: boolean;
  /** When set, options open in a BottomSheet instead of the inline panel on mobile viewports */
  mobileSheet?: MobileSheetProps;
}

export interface DropdownRef extends HTMLElement {
  changeInputVal: (val: string) => void;
}

/**
 *
 * @Deprecated - this is the old version, use Select Dropdown or Search Dropdown
 *
 **/
const Dropdown = forwardRef<any, Props>((props: Props, ref) => {
  const {
    infoText,
    footerText,
    options,
    selectedValue,
    onSelect,
    searchable,
    showSearchIcon,
    containerClass,
    placeholder,
    dropdownLabel,
    isLabelRequired,
    isError,
    showAllOptionsInit,
    onLoadCallback,
    showSubtext,
    inputTextClass,
    isDisabled,
    optionsContainerClass,
    leftElement,
    defaultVal,
    inputWrapperClass,
    onInputTextChange,
    addInputTextInOptions,
    textInputSize = INPUT_TYPES.MEDIUM,
    hideArrowIcon,
    renderRightIcon,
    subtextClass,
    changeTextValOnOutsideClick = true,
    overridingOptionsTypographyProps,
    overridingOptionsSubtextTypographyProps,
    disabledClass,
    resetFilterOnOpen,
    mobileSheet,
  } = props;

  const { isMobile } = useMobileDetect();
  const showMobileSheet = !!mobileSheet && isMobile;
  const { theme } = useContext(AppContext);

  useImperativeHandle(
    ref,
    () => ({
      changeInputVal: (val: string) => {
        changeInputVal(val);
      },
    }),
    []
  );

  const getOption = (value?: any): Option => {
    const verifyingValue = value !== undefined ? value : selectedValue;
    for (let i = 0; i < options.length; ++i) {
      const option = options[i];
      if (option.value === verifyingValue) return option;
    }
    return { label: props.initialValue || "", value: undefined, subText: undefined };
  };

  const [filteredOptions, setFilteredOptions] = useState([...options]);
  const [optionsVisible, toggleOptions] = useState(false);
  const [inputVal, changeInputVal] = useState(getOption()?.label || "");
  const dropdownRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<TextInputRef | null>(null);
  const arrowRef = useRef<HTMLInputElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const onFocus = () => {
    toggleOptions(true);
  };

  const onArrowIconClick = () => {
    if (optionsVisible || isDisabled) {
      toggleOptions(false);
    } else {
      toggleOptions(true);
    }
  };

  const renderArrowIcon = () => {
    if (renderRightIcon) return renderRightIcon();
    if (hideArrowIcon) return null;
    return (
      <div
        ref={arrowRef}
        onClick={onArrowIconClick}
        className={classNames("ease-linear duration-300", {
          "rotate-180": optionsVisible,
          "opacity-50": isDisabled,
          "!-ml-4": textInputSize === TYPOGRAPHY_SIZES.SMALL,
        })}
      >
        <DownArrowIcon
          height={textInputSize === TYPOGRAPHY_SIZES.SMALL ? 16 : 24}
          width={textInputSize === TYPOGRAPHY_SIZES.SMALL ? 16 : 24}
        />
      </div>
    );
  };

  const onOptionClick = (value: any, isDisabled: boolean | undefined, isInputText?: boolean) => {
    if (isDisabled) {
      return;
    }
    if (isInputText) {
      onSelect(inputVal, { label: inputVal, value: "NEW" });
      toggleOptions(false);
    } else {
      const option = getOption(value);
      onSelect(value, option);
      toggleOptions(false);
      changeInputVal(option.label);
    }
  };

  const onInputChange = (value: string) => {
    changeInputVal(value);
    onInputTextChange && onInputTextChange(value);
  };

  const onScreenClick = (event: any) => {
    const target = event.target as HTMLInputElement;
    if (!(dropdownRef?.current?.contains(target) || arrowRef?.current?.contains(target))) {
      toggleOptions(false);
      if (searchable && changeTextValOnOutsideClick) {
        changeInputVal(getOption()?.label || "");
      }
    }
  };

  const onInputClick = () => {
    if (isDisabled) return;
    props.onInputClick?.();
    if (!searchable && !optionsVisible) {
      toggleOptions(true);
    } else if (optionsVisible && !searchable) {
      toggleOptions(false);
    }
  };

  useEffect(() => {
    setFilteredOptions(options);
    changeInputVal(getOption()?.label || "");
  }, [options]);

  useEffect(() => {
    if (searchable) {
      const newOptions: Options = [];
      options.forEach((option) => {
        const labelL = (option.label || "").toLowerCase();
        const subText = (option?.subText || "").toLowerCase();
        const metaData = (option?.metaData || "").toLowerCase();
        const inputValL = inputVal.toLowerCase();
        if (labelL?.includes(inputValL) || subText?.includes(inputValL) || metaData?.includes(inputValL)) {
          newOptions.push(option);
        }
      });
      setFilteredOptions(newOptions);
    }
  }, [inputVal, searchable]);

  useEffect(() => {
    onLoadCallback && onLoadCallback(inputRef?.current);
    document.addEventListener("click", onScreenClick);
    return () => {
      document.removeEventListener("click", onScreenClick);
    };
  }, [selectedValue, options, optionsRef]);

  // On close always reset to full list; when resetFilterOnOpen is true, also reset on open so full list shows (e.g. client bank country)
  useEffect(() => {
    if (!optionsVisible) {
      setFilteredOptions([...options]);
    } else if (resetFilterOnOpen) {
      setFilteredOptions([...options]);
    }
    // if (optionsRef) {
    //   // @ts-ignore
    //   optionsRef.current?.firstChild?.focus();
    // }
  }, [optionsVisible, options, resetFilterOnOpen]);

  const renderSearchIcon = () => {
    if (!showSearchIcon) return null;
    return (
      <div className={classnames("mr-1", { "opacity-50": isDisabled })} onClick={onArrowIconClick}>
        {leftElement ? leftElement() : <SearchIcon />}
      </div>
    );
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDown?.(event);
  };

  const valueToShow =
    showSubtext && !optionsVisible && inputVal ? `${inputVal} - ${getOption().subText}` : inputVal || defaultVal || "";

  let dropdownOptions = filteredOptions;

  if (addInputTextInOptions && R.isTruthy(inputVal?.trim())) {
    const isInputTextPresent = R.find(dropdownOptions, (option) => option.label === inputVal);
    dropdownOptions = [
      ...(isInputTextPresent ? [] : [{ label: inputVal, value: "NEW", isInputText: true }]),
      ...filteredOptions,
    ];
  }

  return (
    <div className={classNames("relative", containerClass)} ref={dropdownRef}>
      <TextInput
        onKeyDown={onKeyDown}
        label={dropdownLabel}
        isLabelRequired={isLabelRequired}
        infoText={infoText}
        size={textInputSize}
        footerText={footerText}
        onFocus={onFocus}
        value={valueToShow}
        leftElement={showSearchIcon ? renderSearchIcon : undefined}
        rightElement={renderArrowIcon}
        onChange={onInputChange}
        onInputClick={onInputClick}
        isDisabled={!searchable || isDisabled}
        dropdownDisabled={!searchable}
        placeholder={placeholder}
        isError={isError}
        ref={inputRef}
        customClass={!searchable ? classNames("bg-white", props.inputClassNonSearch) : inputTextClass}
        inputWrapperClass={inputWrapperClass}
        disabledClass={disabledClass}
      />

      {optionsVisible && !showMobileSheet ? (
        <DeprecatedDropdownOptions
          options={dropdownOptions}
          onOptionClick={onOptionClick}
          selectedValue={selectedValue}
          containerClass={optionsContainerClass}
          renderNoResultsCard={props.renderNoResultsCard}
          renderOptionTag={props.renderOptionTag}
          inputVal={inputVal}
          ref={optionsRef}
          subTextClass={subtextClass}
          overridingTypographyProps={overridingOptionsTypographyProps}
          overridingSubtextTypographyProps={overridingOptionsSubtextTypographyProps}
        />
      ) : null}
      {showMobileSheet && mobileSheet ? (
        <BottomSheet isOpen={optionsVisible} onClose={() => toggleOptions(false)} title={mobileSheet.title}>
          {mobileSheet.infoText ? (
            <div
              className={
                "flex flex-row items-center gap-3 pl-6 pr-4 py-2.5 bg-black-50 border-b border-black-100 rounded-10px"
              }
            >
              <InfoIcon stroke={theme.hexColors.black[500]} className={"shrink-0"} />
              <Typography
                text={mobileSheet.infoText}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!text-black-500"}
              />
            </div>
          ) : null}
          {dropdownOptions
            .filter((option) => !option.customRowRenderer)
            .map((option, index) => (
              <div
                key={`${option.label}${option.value}${index}`}
                className={classNames("cursor-default", index === 0 ? "pt-4 pb-3" : "py-3", {
                  "hover:bg-blue-50": !option.isDisabled,
                })}
                onClick={() => onOptionClick(option.value, option.isDisabled)}
              >
                <Typography
                  text={option.label}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.LARGE}
                  textClasses={
                    option.isDisabled ? "!text-black-400" : selectedValue === option.value ? "!text-blue-400" : ""
                  }
                />
              </div>
            ))}
        </BottomSheet>
      ) : null}
    </div>
  );
});

Dropdown.displayName = "Dropdown";

Dropdown.defaultProps = {
  options: [],
  onSelect: () => {},
  searchable: true,
};

export default Dropdown;
