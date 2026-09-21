import Typography from "../Typography";
import { TYPOGRAPHY_SIZES } from "../../../constants/atomicConstants";
import classnames from "classnames";
import { useEffect, useState } from "react";

interface RadioButtonProps {
  label: string | (() => React.ReactNode);
  checked: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
  id: string;
  inputClassName?: string;
  onBodyClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  isDisabled?: boolean;
  textClasses?: string;
}

const RadioButton = (props: RadioButtonProps) => {
  const {
    label,
    checked: ParentChecked,
    onChange,
    className,
    id,
    name,
    inputClassName,
    onBodyClick,
    isDisabled,
    textClasses,
  } = props;
  const [checked, setChecked] = useState(ParentChecked);
  useEffect(() => {
    setChecked(ParentChecked);
  }, [ParentChecked]);
  return (
    <div className={classnames("flex_row_item_center cursor-pointer", className, {
      "opacity-50 cursor-not-allowed": isDisabled
    })} onClick={isDisabled ? undefined : onBodyClick}>
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={isDisabled}
        className={classnames("w-4 h-4 md:w-[18px] md:h-[18px] cursor-pointer", inputClassName, {
          "cursor-not-allowed": isDisabled
        })}
      />
      {typeof label === "string" ? (
        <label htmlFor={id} className={classnames("pl-2.5 cursor-pointer", {
          "cursor-not-allowed": isDisabled
        })}>
          <Typography text={label} size={TYPOGRAPHY_SIZES.SMALL} textClasses={textClasses} />
        </label>
      ) : (
        label()
      )}
    </div>
  );
};

export default RadioButton;
