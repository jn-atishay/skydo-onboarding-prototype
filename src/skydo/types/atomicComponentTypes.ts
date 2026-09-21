import { JSX } from "@babel/types";
import { FilterType } from "./Filters";
import React from "react";
import { TooltipProps } from "../components/AtomicComponents/TextInput";

export type TableColumn = {
  headerTitle?: string | JSX.Element;
  dataKey?: string;
  widthClass?: string;
  ctas?: ((data: any) => JSX.Element | null)[];
  formattedCellData?: (data: any, index: number, isSelected: boolean) => JSX.Element;
  isMoney?: boolean;
  isDate?: boolean;
  headerTextClass?: string;
  currencyDataKey?: string;
};

export type SearchTag = {
  term: string;
  weight: number;
};

export type Option = {
  label: string;
  value: any;
  isDisabled?: boolean;
  subText?: string;
  metaData?: string;
  labelClasses?: string;
  customRowRenderer?: (
    option: any,
    onOptionClick: (value: any, isDisabled: boolean | undefined) => void
  ) => JSX.Element;
  isInputText?: boolean;
  searchTags?: SearchTag[];
  badgeText?: string;
  showRightIcon?: boolean;
  showLeftIcon?: boolean;
  fixedOption?: boolean;
  customRow?: (
    option: Option,
    index: number,
    onOptionClick: (value: any, isDisabled: boolean | undefined, event: React.MouseEvent<HTMLDivElement>) => void,
    selectedValue?: unknown
  ) => JSX.Element;
};

export interface NestedOptionCore extends Option {
  nestedOptions: Options;
  onNestedOptionClick?: (value: any) => void;
  getSelectedValues: () => any;
  type: FilterType;
  onClearFilterClick: () => void;
}

export type Options = Option[];

export type TrianglePointingDirectionType = "up" | "down" | "left" | "right";

export type TextInputRef = {
  focus: () => void;
  getInputElementWrapperRef: () => HTMLDivElement | null;
};

export type OtpInputRef = {
  focus: (number: number) => void;
};

export type SearchDropdownMetaInfo = {
  inputValue: string;
  optionsVisible: Option[];
};

export type MobileSheetProps = {
  title: string;
  searchPlaceholder?: string;
  infoText?: string;
};

export type CommonDropdownProps = {
  className?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  dropdownLabel?: string;
  isLabelRequired?: boolean;
  infoText?: string;
  footerText?: string;
  showSubtext?: boolean;
  options: Option[];
  selectedValue?: unknown;
  initialValue?: string;
  defaultVal?: string;
  leftElement?: () => JSX.Element | null;
  isDisabled?: boolean;
  renderRightIcon?: () => JSX.Element | null;
  hideArrowIcon?: boolean;
  placeholder?: string;
  isError?: boolean;
  inputClass?: string;
  inputWrapperClass?: string;
  onLoadCallback?: (ref: TextInputRef | null) => void;
  optionsContainerClass?: string;
  renderOptionBadge?: (option: Option) => JSX.Element;
  footerClass?: string;
  renderLeftIcon?: (option: Option) => JSX.Element;
  leftIcon?: boolean;
  tooltipProps?: TooltipProps;
  staticDropdown?: boolean;
};

export type AadhaarNumberType = [string, string, string];

export type noOp<T> = (data?: T) => void;
