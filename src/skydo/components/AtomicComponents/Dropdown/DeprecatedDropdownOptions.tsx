import Typography from "../Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import React from "react";
import { Option, Options } from "../../../types/atomicComponentTypes";
import classNames from "classnames";
import { isFunction } from "../../../util/functions";
import Locale from "../../../util/locale/en";

interface Props {
  options: Options;
  onOptionClick?: (value: any, isDisabled: boolean | undefined, isInputText?: boolean) => void;
  selectedValue?: string;
  className?: string;
  containerClass?: string;
  renderNoResultsCard?: (val?: string) => JSX.Element;
  renderOptionTag?: (option: Option) => JSX.Element;
  inputVal?: string;
  subTextClass?: string;
  overridingTypographyProps?: { type: string; size: string };
  overridingSubtextTypographyProps?: { type: string; size: string };
}

/**
 * @Deprecated - Use FilterDropdown instead;
 * **/
const DeprecatedDropdownOptions = React.forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const {
    options,
    onOptionClick = () => {},
    selectedValue,
    className,
    containerClass,
    renderNoResultsCard,
    renderOptionTag,
    subTextClass,
    overridingTypographyProps,
    overridingSubtextTypographyProps,
  } = props;

  return (
    <div
      ref={ref}
      className={classNames(
        "z-50 absolute overflow-auto right-0 bg-white max-h-60  shadow-dropdown mt-1 rounded-10px",
        {
          "left-0": !className,
        },
        containerClass,
        className
      )}
    >
      {options.map((option, index) => {
        if (option.customRowRenderer && isFunction(option.customRowRenderer)) {
          return option.customRowRenderer(option, onOptionClick);
        }
        const { label, value, isDisabled, subText, labelClasses, isInputText } = option;
        return (
          <div
            tabIndex={index}
            key={`${value}${index}`}
            className={"flex flex-col px-4 py-3 hover:bg-blue-50"}
            onClick={(event) => onOptionClick(value, isDisabled, isInputText)}
          >
            <div className={"flex_row_item_center justify-between"}>
              <Typography
                text={label}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses={
                  labelClasses +
                  " " +
                  (isDisabled ? "!text-black-400" : selectedValue === value ? "!text-blue-400" : "")
                }
                {...overridingTypographyProps}
              />
              {isInputText ? (
                <div className={"flex bg-green-400 h-4 px-1 items-center justify-center rounded"}>
                  <Typography text={Locale.new} size={TYPOGRAPHY_SIZES.X_X_SMALL} textClasses={"!text-white"} />
                </div>
              ) : null}
              {renderOptionTag && renderOptionTag(option)}
            </div>
            {subText ? (
              <Typography
                text={subText}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={
                  subTextClass
                    ? subTextClass
                    : isDisabled
                    ? "!text-black-400"
                    : selectedValue === value
                    ? "!text-blue-400"
                    : ""
                }
                {...overridingSubtextTypographyProps}
              />
            ) : null}
          </div>
        );
      })}
      {options.length === 0 && renderNoResultsCard ? renderNoResultsCard(props.inputVal) : null}
    </div>
  );
});

DeprecatedDropdownOptions.displayName = "DeprecatedDropdownOptions";

export default DeprecatedDropdownOptions;
