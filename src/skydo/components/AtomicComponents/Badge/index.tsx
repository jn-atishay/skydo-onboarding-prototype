import { BadgeSizes, BadgeTypes, TYPOGRAPHY_SIZES } from "../../../constants/atomicConstants";
import classnames from "classnames";
import Typography from "../Typography";

interface Props {
  type?: BadgeTypes;
  size?: BadgeSizes;
  title?: string;
  textClasses?: string;
  className?: string;
  leftIcon?: () => JSX.Element;
}
const Badge = (props: Props) => {
  const textClasses = props.textClasses || (props.type === BadgeTypes.Full ? "!text-white" : "!text-black-500");

  const getTypoSize = (badgeSize: BadgeSizes | undefined) => {
    switch (badgeSize) {
      case BadgeSizes.X_Small:
        return TYPOGRAPHY_SIZES.X_X_X_SMALL;
      case BadgeSizes.Small:
        return TYPOGRAPHY_SIZES.X_X_SMALL;
      case BadgeSizes.Medium:
        return TYPOGRAPHY_SIZES.X_SMALL;
      default:
        return TYPOGRAPHY_SIZES.X_SMALL;
    }
  };

  return (
    <span
      className={classnames(
        "px-1 py-0.5 align-middle flex items-center justify-center",
        {
          "bg-green-400": props.type === BadgeTypes.Full,
          "border border-black-500": props.type === BadgeTypes.Outline,
          "h-6 rounded-5px": props.size === BadgeSizes.Medium,
          "h-4 rounded-sm": props.size === BadgeSizes.Small,
          "h-[12px] rounded-sm": props.size == BadgeSizes.X_Small,
        },
        props.className
      )}
    >
      {props.leftIcon ? props.leftIcon() : null}
      <Typography text={props.title} size={getTypoSize(props.size)} textClasses={textClasses} />
    </span>
  );
};

export default Badge;
