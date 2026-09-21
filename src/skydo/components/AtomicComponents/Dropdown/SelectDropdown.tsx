//Dec 2023

import classnames from "classnames";
import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import TextInput from "../TextInput";
import { DropdownSizes, OptionSizes } from "../../../constants/atomicConstants";
import { CommonDropdownProps, Option, TextInputRef } from "../../../types/atomicComponentTypes";
import JSHelpers from "../JSHelpers";
import DownArrowIcon from "../../Icons/DownArrowIcon";
import DropdownOptions from "./DropdownOptions";
import useDropdownHook from "../../../util/customHooks/useDropdownHook";

interface Props extends CommonDropdownProps {
  onSelect: (value: unknown, option: Option) => void;
  size?: (typeof DropdownSizes)[keyof typeof DropdownSizes];
  isValueOverridingFromParent?: boolean;
  onOpenDropdown?: () => void;
}

const SelectDropdown = (props: Props) => {
  const { size = DropdownSizes.Medium } = props;
  const inputRef = useRef<TextInputRef>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { optionsVisible, inputVal, getOption, toggleOptions, changeInputVal } = useDropdownHook({
    selectedValue: props.selectedValue,
    initialValue: props.initialValue,
    options: props.options,
  });

  // interaction function
  const onFocus = () => {
    toggleOptions(true);
  };

  const onScreenClick = (event: any) => {
    const target = event.target as HTMLInputElement;
    if (!dropdownRef?.current?.contains?.(target)) {
      toggleOptions(false);
    }
  };

  useEffect(() => {
    if (props.isValueOverridingFromParent) {
      const option = getOption(props.selectedValue);
      if (option.label && option.label !== inputVal) {
        changeInputVal(option.label);
      }
    }
  }, [props.isValueOverridingFromParent, props.selectedValue, props.options]);

  const onOptionClick = (value: any, isDisabled: boolean | undefined) => {
    if (isDisabled) {
      return;
    }
    const option = getOption(value);
    props.onSelect(value, option);
    toggleOptions(false);
    changeInputVal(option.label);
  };

  const onDropdownAreaClick = () => {
    if (props.isDisabled) return;
    if (!optionsVisible) {
      props.onOpenDropdown?.();
    }
    toggleOptions(!optionsVisible);
  };

  // render helpers
  const renderLeftIcon = () => {
    if (JSHelpers.isFunction(props.leftElement)) {
      return (
        <div className={classnames("mr-1", { "opacity-50": props.isDisabled && !props.staticDropdown })}>
          {props.leftElement()}
        </div>
      );
    }
    return null;
  };

  const renderArrowIcon = () => {
    if (props.renderRightIcon) return props.renderRightIcon();
    if (props.hideArrowIcon || props.staticDropdown) return null;
    return (
      <div
        className={classNames("ease-linear duration-300", {
          "rotate-180": optionsVisible,
          "opacity-50": props.isDisabled,
        })}
      >
        <DownArrowIcon
          height={[DropdownSizes.Large.toString(), DropdownSizes.Medium.toString()].includes(size) ? 24 : 16}
          width={[DropdownSizes.Large.toString(), DropdownSizes.Medium.toString()].includes(size) ? 24 : 16}
        />
      </div>
    );
  };

  // useEffects

  useEffect(() => {
    props.onLoadCallback?.(inputRef?.current);
    document.addEventListener("click", onScreenClick);
    return () => {
      document.removeEventListener("click", onScreenClick);
    };
  }, [inputRef?.current, props.options, dropdownRef?.current, dropdownRef, optionsVisible]);

  const getOptionsSize = () => {
    switch (size) {
      case DropdownSizes.Large:
        return OptionSizes.LARGE;
      case DropdownSizes.Medium:
        return OptionSizes.MEDIUM;
      default:
        return OptionSizes.SMALL;
    }
  };

  const valueToShow =
    props.showSubtext && !optionsVisible && inputVal
      ? `${inputVal} - ${getOption().subText}`
      : inputVal || props.defaultVal || "";

  return (
    <div className={classnames("relative", props.className)} ref={dropdownRef}>
      <TextInput
        onKeyDown={props.onKeyDown}
        label={props.dropdownLabel}
        infoText={props.infoText}
        tooltipProps={props.tooltipProps}
        size={size}
        footerText={props.footerText}
        onFocus={onFocus}
        value={valueToShow}
        leftElement={renderLeftIcon}
        rightElement={renderArrowIcon}
        isDisabled={true}
        dropdownDisabled={true}
        disabledClass={classNames({
          "!cursor-not-allowed": !!props.staticDropdown,
        })}
        placeholder={props.placeholder}
        isError={props.isError}
        ref={inputRef}
        customClass={classNames(!props.staticDropdown ? "bg-white" : "bg-black-50", props.inputClass)}
        inputWrapperClass={classNames({ "!bg-black-50": !!props.staticDropdown }, props.inputWrapperClass)}
        onOnlyInputAreaClick={onDropdownAreaClick}
      />
      {optionsVisible ? (
        <DropdownOptions
          size={getOptionsSize()}
          options={props.options}
          onOptionClick={onOptionClick}
          selectedValue={props.selectedValue}
          className={props.optionsContainerClass}
          renderBadge={props.renderOptionBadge}
          renderLeftIcon={props.renderLeftIcon}
          leftIcon={props.leftIcon}
          changeLabel={(label: string) => changeInputVal(label)}
        />
      ) : null}
    </div>
  );
};

export default SelectDropdown;
