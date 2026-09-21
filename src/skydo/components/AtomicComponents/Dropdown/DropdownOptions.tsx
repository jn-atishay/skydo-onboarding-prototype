//Dec 2023

import {
  BadgeSizes,
  BadgeTypes,
  OptionSizes,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../../constants/atomicConstants";
import { Option } from "../../../types/atomicComponentTypes";
import React, { useContext, useEffect, useRef } from "react";
import classNames from "classnames";
import Typography from "../Typography";
import Badge from "../Badge";
import JSHelpers from "../JSHelpers";
import DownArrowIcon from "../../Icons/DownArrowIcon";
import AppContext from "../../../context/AppContext";
import Locale from "../../../util/locale/en";

/*
removed overriding typography props
 */

interface Props {
  size: (typeof OptionSizes)[keyof typeof OptionSizes];
  // state: (typeof OptionStates)[keyof typeof OptionStates];
  renderBadge?: (option: Option) => JSX.Element;
  options: Option[];
  className?: string;
  optionClassName?: string;
  selectedValue?: unknown;
  renderRightIcon?: (option: Option) => JSX.Element;
  rightIcon?: Boolean;
  onArrowClick?: () => void;
  leftIcon?: Boolean;
  renderLeftIcon?: (option: Option) => JSX.Element;
  onOptionClick: (value: any, isDisabled: boolean | undefined, event: React.MouseEvent<HTMLDivElement>) => void;
  showNoOptionsFound?: boolean;
  showAddNewCta?: boolean;
  onAddNewClick?: () => void;
  onAddTextClick?: (label: string) => void;
  inputVal?: string;
  changeLabel?: (label: string) => void;
  isDirty?: boolean;
  /** Renders as a normal in-flow block instead of a floating panel anchored under the input — for embedding inside a BottomSheet. */
  disableFloatingStyles?: boolean;
}

type OptionProps = Omit<Props, "options"> & { option: Option; index: number };

export const DropdownOption = React.forwardRef<HTMLDivElement, OptionProps>((props, ref) => {
  const { theme } = useContext(AppContext);
  const { size, isDirty, selectedValue, option, index, onOptionClick } = props;
  const optionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (option.value === selectedValue && optionRef.current) {
      !isDirty && optionRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [selectedValue, option, isDirty]);
  return (
    <div
      tabIndex={index}
      className={classNames("flex flex-col px-4 py-3 cursor-default", { "hover:bg-blue-50": !option.isDisabled })}
      onClick={(event) => onOptionClick(option.value, option.isDisabled, event)}
      ref={optionRef}
    >
      <div className={"flex_row_item_center justify-between"}>
        <div className={"flex_row_item_center"}>
          {props.leftIcon ? (JSHelpers.isFunction(props.renderLeftIcon) ? props.renderLeftIcon(option) : null) : null}
          <div
            className={classNames("flex flex-col", {
              "ml-2.5": props.leftIcon && JSHelpers.isFunction(props.renderLeftIcon),
            })}
          >
            <Typography
              text={option.label}
              type={TYPOGRAPHY_TYPES.PARA}
              size={size === OptionSizes.LARGE ? TYPOGRAPHY_SIZES.MEDIUM : TYPOGRAPHY_SIZES.SMALL}
              textClasses={
                option.isDisabled ? "!text-black-400" : selectedValue === option.value ? "!text-blue-400" : ""
              }
            />
            {option.subText ? (
              <Typography
                text={option.subText}
                size={size === OptionSizes.LARGE ? TYPOGRAPHY_SIZES.X_SMALL : TYPOGRAPHY_SIZES.X_X_SMALL}
                textClasses={option.isDisabled ? "!text-black-400" : "!text-black-500"}
              />
            ) : null}
          </div>
        </div>
        <div className={"flex_row_item_center"}>
          {option.badgeText ? (
            JSHelpers.isFunction(props.renderBadge) ? (
              props.renderBadge(option)
            ) : (
              <Badge
                type={BadgeTypes.Full}
                size={size === OptionSizes.LARGE ? BadgeSizes.Medium : BadgeSizes.Small}
                title={option.badgeText}
                className={"flex_row_item_center"}
              />
            )
          ) : null}
          {props.rightIcon || option.showRightIcon ? (
            JSHelpers.isFunction(props.renderRightIcon) ? (
              props.renderRightIcon(option)
            ) : (
              <DownArrowIcon
                className={"-rotate-90 ml-2.5"}
                onClick={props.onArrowClick}
                width={size === OptionSizes.LARGE ? 24 : 16}
                height={size === OptionSizes.LARGE ? 24 : 16}
                stroke={option.isDisabled ? theme.hexColors.black[400] : theme.hexColors.black[700]}
              />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
});

DropdownOption.displayName = "DropdownOption";

const DropdownOptions = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { size, className, options, disableFloatingStyles } = props;
  return (
    <div
      ref={ref}
      className={classNames(
        "z-50 bg-white",
        !disableFloatingStyles && "absolute overflow-auto right-0 max-h-60 shadow-dropdown mt-1 rounded-10px left-0",
        className
      )}
    >
      {options.map((option, index) => {
        if (option.customRow) {
          return (
            <div key={`${option.label}${option.value}${index}`}>
              {option.customRow(option, index, props.onOptionClick, props.selectedValue)}
            </div>
          );
        }
        return (
          <DropdownOption key={`${option.label}${option.value}${index}`} {...props} index={index} option={option} />
        );
      })}
      {JSHelpers.isEmpty(options) && props.showNoOptionsFound ? (
        <DropdownOption
          key={"no_results"}
          size={size}
          option={{ label: Locale.noResultsFound, value: "", isDisabled: true }}
          index={0}
          onOptionClick={() => {}}
        />
      ) : null}
      {props.showAddNewCta ? (
        !props.inputVal || options.some((option) => option.label === props.inputVal) ? (
          <div
            className={"cursor-pointer sticky bottom-0 px-4 py-2.5 w-full bg-white flex_row_item_center"}
            onClick={props.onAddNewClick}
          >
            <Typography text={Locale.addNewClient} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-blue-400"} />
          </div>
        ) : (
          <div
            className={"flex_row_item_center px-4 py-2.5 cursor-pointer sticky bottom-0 bg-white justify-between"}
            onClick={() => props.onAddTextClick?.(props.inputVal!!)}
          >
            <Typography
              text={Locale.addInputInOption.replace(":option", props.inputVal || "")}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-blue-400"}
            />
            <Badge
              type={BadgeTypes.Full}
              size={size === OptionSizes.LARGE ? BadgeSizes.Medium : BadgeSizes.Small}
              title={Locale.newNormal}
              className={"flex_row_item_center"}
            />
          </div>
        )
      ) : null}
    </div>
  );
});

DropdownOptions.displayName = "DropdownOptions";

export default DropdownOptions;
