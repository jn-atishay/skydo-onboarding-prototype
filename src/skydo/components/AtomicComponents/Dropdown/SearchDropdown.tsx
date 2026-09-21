//Dec 2023

import classNames from "classnames";
import classnames from "classnames";
import TextInput from "../TextInput";
import React, { useEffect, useRef, useState } from "react";
import {
  BUTTON_SIZES,
  INPUT_TYPES,
  OptionSizes,
  SearchDropdownSizes,
  TYPOGRAPHY_SIZES,
} from "../../../constants/atomicConstants";
import {
  CommonDropdownProps,
  MobileSheetProps,
  Option,
  SearchDropdownMetaInfo,
  TextInputRef,
} from "../../../types/atomicComponentTypes";
import SearchIcon from "../../Icons/SearchIcon";
import DropdownOptions from "./DropdownOptions";
import DownArrowIcon from "../../Icons/DownArrowIcon";
import { dropdownOptionsFilter } from "../../../util/searchHelpers";
import useDropdownHook from "../../../util/customHooks/useDropdownHook";
import useMobileDetect from "../../../util/customHooks/useMobileDetect";
import Popup from "../Popup";
import Locale from "../../../util/locale/en";
import Button from "../Button";
import Notes from "../Notes";
import BottomSheet from "../BottomSheet";

interface Props extends CommonDropdownProps {
  size?: (typeof SearchDropdownSizes)[keyof typeof SearchDropdownSizes];
  showSearchIcon?: boolean;
  onInputTextChange?: (val: string, filteredOptions: Option[]) => void;
  onSelect: (value: unknown, option: Option, metaInfo: SearchDropdownMetaInfo) => void;
  changeTextValOnOutsideClick?: boolean;
  showNoOptionsFound?: boolean;
  showAddNewCta?: boolean;
  onAddNewClick?: () => void;
  onAddTextClick?: () => void;
  showOptionsOnInputChange?: boolean;
  addNewNote?: string;
  alwaysShowAddNewPopup?: boolean;
  dropdownDisabled?: boolean;
  onOpenDropdown?: () => void;
  /** When set, options open in a BottomSheet with an in-sheet search box instead of the inline panel on mobile devcices */
  mobileSheet?: MobileSheetProps;
}

const SearchDropdown = (props: Props) => {
  const {
    size = SearchDropdownSizes.Medium,
    changeTextValOnOutsideClick = true,
    showOptionsOnInputChange,
    alwaysShowAddNewPopup,
    mobileSheet,
  } = props;
  const [options, setOptions] = useState(props.options);

  const inputRef = useRef<TextInputRef>(null);
  const sheetResultsRef = useRef<HTMLDivElement>(null);
  const [filteredOptions, setFilteredOptions] = useState([...options]);
  const [addClientPopup, setAddClientPopup] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [sheetResultsMinHeight, setSheetResultsMinHeight] = useState<number>();
  const { isMobile } = useMobileDetect();
  const showMobileSheet = !!mobileSheet && isMobile;

  const {
    optionsVisible: optionsVisibleDefault,
    inputVal,
    getOption,
    toggleOptions,
    changeInputVal,
    newOption,
    setNewOption,
  } = useDropdownHook({
    selectedValue: props.selectedValue,
    initialValue: props.initialValue,
    options: options,
  });

  const optionsVisible = showOptionsOnInputChange ? isDirty && optionsVisibleDefault : optionsVisibleDefault;

  const changeOptionsVisibility = (status: boolean, avoidSetDirty?: boolean) => {
    !avoidSetDirty && setIsDirty(status);
    if (status && !optionsVisibleDefault) {
      props.onOpenDropdown?.();
    }
    toggleOptions(status);
    if (!status) {
      setSearchEnabled(false);
    }
  };

  const onInputChange = (value: string) => {
    setSearchEnabled(true);
    changeInputVal(value);
    changeOptionsVisibility(true);
    props.onInputTextChange?.(value, filteredOptions);
  };

  const onOptionClick = (value: any, isDisabled: boolean | undefined, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (isDisabled) {
      return;
    }
    const option = getOption(value);
    props.onSelect(value, option, { inputValue: inputVal, optionsVisible: filteredOptions });
    changeOptionsVisibility(false);
    changeInputVal(option.label);
  };

  const onScreenClick = (event: any) => {
    const target = event.target as HTMLInputElement;
    const inputContainer = inputRef?.current?.getInputElementWrapperRef();
    if (!inputContainer?.contains?.(target)) {
      changeOptionsVisibility(false);
      if (changeTextValOnOutsideClick) {
        changeInputVal(getOption()?.label || "");
      }
      setFilteredOptions([...options]);
    }
  };

  const onDropdownAreaClick = () => {
    if (props.isDisabled) return;
    changeOptionsVisibility(true, !showMobileSheet);
  };

  const onArrowIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (optionsVisible || props.isDisabled) {
      changeOptionsVisibility(false);
    } else {
      setSearchEnabled(false);
      changeOptionsVisibility(true);
    }
  };

  useEffect(() => {
    setOptions([...props.options]);
  }, [props.options]);

  useEffect(() => {
    props.onLoadCallback?.(inputRef?.current);
    document.addEventListener("click", onScreenClick);
    return () => {
      document.removeEventListener("click", onScreenClick);
    };
  }, [props.selectedValue, options, newOption]);

  useEffect(() => {
    if (optionsVisible) {
      const totalOptions = newOption ? [...options, newOption] : options;
      const filteredOptions = searchEnabled ? dropdownOptionsFilter(inputVal, totalOptions) : totalOptions;
      setFilteredOptions(filteredOptions);
    }
  }, [inputVal, optionsVisible, options, newOption, searchEnabled]);

  useEffect(() => {
    if (!optionsVisible) {
      setSheetResultsMinHeight(undefined);
      return;
    }
    if (showMobileSheet && !searchEnabled && sheetResultsRef.current) {
      setSheetResultsMinHeight(sheetResultsRef.current.scrollHeight);
    }
  }, [optionsVisible, showMobileSheet, searchEnabled, filteredOptions]);

  const renderSearchIcon = () => {
    if (!props.showSearchIcon) return null;
    return (
      <div className={classnames("mr-1", { "opacity-50": props.isDisabled })}>
        {props.leftElement ? props.leftElement() : <SearchIcon />}
      </div>
    );
  };

  const renderArrowIcon = () => {
    if (props.renderRightIcon) return props.renderRightIcon();
    if (props.hideArrowIcon || props.staticDropdown) return null;
    return (
      <div
        onClick={(event) => onArrowIconClick(event)}
        className={classNames("ease-linear duration-300 cursor-pointer", {
          "rotate-180": optionsVisible,
          "opacity-50": props.isDisabled,
        })}
      >
        <DownArrowIcon
          height={SearchDropdownSizes.Medium === size ? 24 : 16}
          width={SearchDropdownSizes.Medium === size ? 24 : 16}
        />
      </div>
    );
  };

  const onAddNewClick = () => {
    setAddClientPopup(true);
  };

  const onAddTextClick = (label: string) => {
    const option: Option = { label, value: "NEW", badgeText: Locale.newNormal };
    props.onSelect(option.value, option, { inputValue: inputVal, optionsVisible: filteredOptions });
    setNewOption(option);
    changeOptionsVisibility(false);
    changeInputVal(option.label);
  };

  const valueToShow =
    props.showSubtext && !optionsVisible && inputVal
      ? `${inputVal} - ${getOption().subText}`
      : inputVal || props.defaultVal || "";

  return (
    <div className={classNames("relative", props.className)}>
      <TextInput
        onKeyDown={props.onKeyDown}
        label={props.dropdownLabel}
        isLabelRequired={props.isLabelRequired}
        infoText={props.infoText}
        size={size}
        footerText={props.footerText}
        value={valueToShow}
        leftElement={props.showSearchIcon ? renderSearchIcon : undefined}
        rightElement={renderArrowIcon}
        onChange={onInputChange}
        isDisabled={props.isDisabled || showMobileSheet}
        placeholder={props.placeholder}
        disabledClass={classNames({
          "!cursor-not-allowed": !!props.staticDropdown,
        })}
        isError={props.isError}
        dropdownDisabled={props.dropdownDisabled || showMobileSheet}
        ref={inputRef}
        customClass={classNames(!props.staticDropdown ? "bg-white" : "bg-black-50", props.inputClass)}
        inputWrapperClass={classNames({ "!bg-black-50": !!props.staticDropdown }, props.inputWrapperClass)}
        onOnlyInputAreaClick={onDropdownAreaClick}
        footerClass={props.footerClass}
      />

      {optionsVisible && !showMobileSheet ? (
        <DropdownOptions
          options={filteredOptions}
          onOptionClick={onOptionClick}
          selectedValue={props.selectedValue}
          className={`${props.isError && props.footerText ? "!-mt-5" : ""} ${props.optionsContainerClass}`}
          size={OptionSizes.SMALL}
          renderBadge={props.renderOptionBadge}
          leftIcon={props.leftIcon}
          renderLeftIcon={props.renderLeftIcon}
          showNoOptionsFound={props.showNoOptionsFound}
          showAddNewCta={props.showAddNewCta}
          onAddNewClick={onAddNewClick}
          onAddTextClick={alwaysShowAddNewPopup ? onAddNewClick : onAddTextClick}
          inputVal={inputVal}
          isDirty={isDirty}
        />
      ) : null}
      {showMobileSheet && mobileSheet ? (
        <BottomSheet
          isOpen={optionsVisible}
          onClose={() => {
            changeOptionsVisibility(false);
            if (changeTextValOnOutsideClick) {
              changeInputVal(getOption()?.label || "");
            }
            setFilteredOptions([...options]);
          }}
          title={mobileSheet.title}
          contentChildrenClass={"overflow-x-hidden"}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <TextInput
              size={INPUT_TYPES.SMALL}
              value={inputVal}
              onChange={onInputChange}
              placeholder={mobileSheet.searchPlaceholder}
              leftElement={() => <SearchIcon />}
              inputWrapperClass={"mb-6"}
              customClass={"parasmall"}
            />
          </div>
          <div ref={sheetResultsRef} style={{ minHeight: sheetResultsMinHeight }}>
            <DropdownOptions
              disableFloatingStyles
              options={filteredOptions}
              onOptionClick={onOptionClick}
              selectedValue={props.selectedValue}
              size={OptionSizes.SMALL}
              renderBadge={props.renderOptionBadge}
              leftIcon={props.leftIcon}
              renderLeftIcon={props.renderLeftIcon}
              showNoOptionsFound={props.showNoOptionsFound}
              showAddNewCta={props.showAddNewCta}
              onAddNewClick={onAddNewClick}
              onAddTextClick={alwaysShowAddNewPopup ? onAddNewClick : onAddTextClick}
              inputVal={inputVal}
              isDirty={isDirty}
            />
          </div>
        </BottomSheet>
      ) : null}
      {addClientPopup ? (
        <Popup
          isDashboardPopup={true}
          isCommonHeader={true}
          title={Locale.addNewClientTitle}
          open={addClientPopup}
          closeIconClick={() => setAddClientPopup(false)}
          outsideClick={() => setAddClientPopup(false)}
          renderContent={() => (
            <AddOptionContent
              inputVal={inputVal}
              onAddClick={onAddTextClick}
              close={setAddClientPopup}
              note={props.addNewNote}
            />
          )}
        />
      ) : null}
    </div>
  );
};

type PopupProps = {
  inputVal: string;
  onAddClick: (text: string) => void;
  close: (val: boolean) => void;
  note?: string;
};

const AddOptionContent = (props: PopupProps) => {
  const [value, setValue] = useState(props.inputVal);
  return (
    <div className={"flex flex-col"}>
      {!!props.note && (
        <Notes
          iconHeight={24}
          iconWidth={24}
          iconColor={"#276EF1"}
          text={props.note}
          className={"mb-4 border border-[#A0BFF8] !bg-blue-50"}
          typographySize={TYPOGRAPHY_SIZES.X_SMALL}
        />
      )}
      <TextInput
        size={INPUT_TYPES.SMALL}
        label={Locale.clientName}
        value={value}
        onChange={(value) => setValue(value)}
      />
      <div className={"flex w-full justify-end"}>
        <Button
          title={Locale.saveAndContinue}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={() => {
            props.onAddClick(value);
            props.close(false);
          }}
          buttonClass={"!mt-4"}
        />
      </div>
    </div>
  );
};

export default SearchDropdown;
