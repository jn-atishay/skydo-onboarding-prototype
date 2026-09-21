import React from "react";
import classNames from "classnames";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import { PURPOSE_CODE_ICON_COLORS } from "../../constants/purposeCodeConstants";
import { PurposeCode } from "../../types";
import Locale from "../../util/locale/en";
import Typography from "../AtomicComponents/Typography";
import DownArrowIcon from "../Icons/DownArrowIcon";

type Props = {
  purposeCode?: PurposeCode;
  isError?: boolean;
  onClick: () => void;
};

const PurposeCodeSelectorTrigger = ({ purposeCode, isError = false, onClick }: Props) => {
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={"button"}
      tabIndex={0}
      aria-label={Locale.searchOrSelectPC}
      className={classNames(
        "flex cursor-pointer items-center gap-4 rounded-10px border bg-white px-4 py-3 focus:outline-none",
        isError ? "border-warning-400" : "border-neutral-400"
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <Typography
        text={purposeCode ? `${purposeCode.code}: ${purposeCode.description}` : Locale.searchOrSelectPC}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        textClasses={classNames("min-w-0 flex-1 truncate", { "!text-neutral-500": !purposeCode })}
      />
      <DownArrowIcon width={24} height={24} stroke={PURPOSE_CODE_ICON_COLORS.MUTED} />
    </div>
  );
};

export default PurposeCodeSelectorTrigger;
