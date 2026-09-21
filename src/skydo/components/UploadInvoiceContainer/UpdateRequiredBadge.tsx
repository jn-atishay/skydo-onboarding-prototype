import React from "react";
import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import ExclamationIcon from "../Icons/ExclamationIcon";
import StrokeTickIconWithCircle from "../Icons/StrokeTickIconWithCircle";
import Locale from "../../util/locale/en";

interface Props {
  variant?: "default" | "error" | "success";
  updatesCount?: number;
  shouldShowGenericConfirmationLabel?: boolean;
  shouldShowCloseIcon?: boolean;
  onCloseClick: () => void;
}

const UpdateRequiredBadge = ({
  variant = "default",
  updatesCount = 1,
  shouldShowGenericConfirmationLabel = false,
  shouldShowCloseIcon = true,
  onCloseClick,
}: Props) => {
  const defaultText = shouldShowGenericConfirmationLabel
    ? Locale.confirmationRequiredBadge
    : updatesCount > 1
    ? Locale.errorsFoundBadgeMultiple.replace(":count", String(updatesCount))
    : Locale.errorFoundBadge;
  const badgeConfig = {
    default: {
      containerClasses: "bg-yellow-200",
      textClasses: "!text-yellow-600 !font-bold !leading-5",
      text: defaultText,
      icon: <ExclamationIcon height={16} width={16} />,
    },
    error: {
      containerClasses: "bg-red-50",
      textClasses: "!text-red-400 !font-semibold",
      text: Locale.selectOptionToProceed,
      icon: <ExclamationIcon height={14} width={14} fillcolor={"#E11900"} />,
    },
    success: {
      containerClasses: "bg-green-50",
      textClasses: "!text-green-400 !font-semibold",
      text: defaultText,
      icon: <StrokeTickIconWithCircle />,
    },
  }[variant];

  return (
    <div className={"flex flex-row items-center justify-between"}>
      <div
        className={classNames("inline-flex items-center gap-2 px-2 py-1 rounded w-fit", badgeConfig.containerClasses)}
      >
        {badgeConfig.icon}
        <Typography
          text={badgeConfig.text}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          type={TYPOGRAPHY_TYPES.LABEL}
          textClasses={badgeConfig.textClasses}
        />
      </div>
      {shouldShowCloseIcon && <CrossIcon onClick={onCloseClick} />}
    </div>
  );
};

export default UpdateRequiredBadge;
