import classNames from "classnames";
import Typography from "../Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import React from "react";

export interface CheckBoxProps {
  label?: string | JSX.Element;
  onCheckboxClick?: React.ChangeEventHandler<HTMLInputElement>;
  containerClass?: string;
  checkboxClass?: string;
  checked?: boolean;
  isDisabled?: boolean;
  textClasses?: string;
}

const CheckBox = (props: CheckBoxProps) => {
  const { checked, label, onCheckboxClick, containerClass, checkboxClass, isDisabled, textClasses } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className={classNames("flex flex-row items-center", containerClass)}>
      <input
        disabled={isDisabled}
        checked={checked}
        type={"checkbox"}
        className={classNames("border-none w-6 h-6 rounded border-black-400 hover:!border-blue-400", checkboxClass)}
        onChange={onCheckboxClick}
        ref={inputRef}
      />
      {label && (
        <Typography
          text={label}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={textClasses ? textClasses : "ml-3"}
          onTextClick={() => {
            if (!isDisabled) {
              inputRef.current?.click();
            }
          }}
        />
      )}
    </div>
  );
};

export default CheckBox;
