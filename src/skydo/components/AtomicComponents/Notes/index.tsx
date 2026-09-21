//Jul 2023

import classnames from "classnames";
import classNames from "classnames";
import ExclamationIcon from "../../Icons/ExclamationIcon";
import Typography from "../Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import { ReactNode } from "react";

interface Props {
  text: ReactNode | string | string[];
  className?: string;
  iconHeight?: number;
  iconWidth?: number;
  iconColor?: string;
  typographySize?: string;
  iconClassname?: string;
  subText?: ReactNode | string;
  textClasses?: string;
  iconType?: "solid" | "outline";
  typographyClasses?: string;
  subTextClasses?: string;
  isSubTextChild?: boolean;
}

const Notes = (props: Props) => {
  const {
    text,
    className = "",
    iconHeight = 16,
    iconWidth = 16,
    iconColor,
    typographySize = TYPOGRAPHY_SIZES.SMALL,
    iconClassname,
    subText,
    iconType,
    typographyClasses = "",
    subTextClasses = "",
    isSubTextChild = false,
  } = props;
  return (
    <div className={classnames("flex flex-row items-center bg-yellow-50 p-2 rounded-5px", className)}>
      <ExclamationIcon
        height={iconHeight}
        width={iconWidth}
        className={"mr-2 shrink-0 " + iconClassname}
        fillcolor={iconColor}
        type={iconType}
      />
      <div className={classNames("flex flex-col gap-y-1", typographyClasses)}>
        <Typography text={text} size={typographySize} type={TYPOGRAPHY_TYPES.LABEL} textClasses={props.textClasses}>
          {isSubTextChild && subText ? (
            <Typography
              text={subText}
              size={typographySize}
              type={TYPOGRAPHY_TYPES.LABEL}
              fontWeight={"400"}
              textClasses={classNames("!text-black-500", subTextClasses)}
            />
          ) : null}
        </Typography>
        {subText && !isSubTextChild ? (
          <Typography
            text={subText}
            size={typographySize}
            type={TYPOGRAPHY_TYPES.LABEL}
            fontWeight={"400"}
            textClasses={classNames("!text-black-500", subTextClasses)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Notes;
