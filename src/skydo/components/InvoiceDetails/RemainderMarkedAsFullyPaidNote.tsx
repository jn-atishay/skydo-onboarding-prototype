import React from "react";
import classNames from "classnames";
import InformationIcon from "../Icons/InformationIcon";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import { formatIncomingCurrencyWithNumber, ordinalSuffix } from "../../util/formatters";
import useMobileVersionHook from "../Common/useMobileVersionHook";

interface Props {
  remainderAmount: number;
  remainderCurrency: string;
  paymentDate?: string;
}

const formatDateWithOrdinal = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day}${ordinalSuffix(day)} ${month} ${year}`;
  } catch {
    return "";
  }
};

const RemainderMarkedAsFullyPaidNote = (props: Props) => {
  const { remainderAmount, remainderCurrency, paymentDate } = props;
  const { isMobile } = useMobileVersionHook();

  if (isMobile == null) return null;

  const formattedAmount = formatIncomingCurrencyWithNumber({
    value: remainderAmount,
    currency: remainderCurrency,
    minFractionDigits: 2,
    maxFractionDigits: 2,
  });
  const formattedDate = formatDateWithOrdinal(paymentDate);

  const noteText = formattedDate
    ? Locale.markedRemainderAsFullyPaidNote.replace(":amount", formattedAmount).replace(":date", formattedDate)
    : Locale.markedRemainderAsFullyPaidNoteNoDate.replace(":amount", formattedAmount);

  return (
    <div
      className={classNames(
        "flex flex-row items-center gap-2 bg-white border-t border-black-100 rounded-bl-10px rounded-br-10px",
        isMobile ? "p-4" : "p-6"
      )}
    >
      <div className={"shrink-0"}>
        <InformationIcon width={16} height={16} />
      </div>
      <Typography
        text={noteText}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"!text-black-600"}
      />
    </div>
  );
};

export default RemainderMarkedAsFullyPaidNote;
