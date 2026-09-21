import React, { useState } from "react";
import classNames from "classnames";
import Chip from "../Common/Chip";
import DropdownArrow from "../Common/DropdownArrow";
import InfoIcon from "../AtomicComponents/ToastMessages/InfoIcon";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import { formatIncomingCurrencyWithNumber, formatUTCDate } from "../../util/formatters";
import useMobileVersionHook from "../Common/useMobileVersionHook";

interface Props {
  index: number;
  totalTransactions: number;
  remainderAmount: number;
  remainderCurrency: string;
  paymentDate?: string;
}

const RemainderPaidOutsideCard = (props: Props) => {
  const { index, totalTransactions, remainderAmount, remainderCurrency, paymentDate } = props;
  const { isMobile } = useMobileVersionHook();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const formattedAmount = formatIncomingCurrencyWithNumber({
    value: remainderAmount,
    currency: remainderCurrency,
    minFractionDigits: 2,
    maxFractionDigits: 2,
  });

  const formattedDate = paymentDate ? formatUTCDate(paymentDate) : "";

  if (isMobile == null) return null;

  const renderHeader = () => (
    <div
      className={classNames("flex flex-row justify-between cursor-pointer", isMobile ? "p-4" : "p-6")}
      onClick={() => setIsExpanded((prev) => !prev)}
    >
      <div className={"flex flex-row items-start gap-3 flex-1"}>
        <Chip containerClass={"!h-6 flex items-center"}>
          <Typography text={index} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL}>
            <Typography
              text={`/${totalTransactions}`}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500"}
            />
          </Typography>
        </Chip>
        <div className={"flex flex-col gap-0.5"}>
          <Typography text={formattedAmount} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} />
          {formattedDate && (
            <Typography
              text={Locale.markedOnDate.replace(":date", formattedDate)}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500"}
            />
          )}
        </div>
      </div>
      <div className={"flex flex-row items-center gap-2"}>
        <Typography
          text={Locale.completedOutsideSkydo}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          fontWeight={"700"}
          textClasses={"!text-green-400"}
        />
        <DropdownArrow isOpen={isExpanded} containerClass={""} />
      </div>
    </div>
  );

  const renderBody = () => (
    <div className={classNames("flex flex-col gap-4", isMobile ? "px-4 pb-6" : "px-6 pb-6")}>
      <div className={"flex flex-row items-center bg-green-50 px-6 py-4 rounded-10px"}>
        <Typography text={Locale.statusFields} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM}>
          <Typography
            text={Locale.completedOutsideSkydo}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight={"700"}
            textClasses={"!text-green-400 ml-1"}
          />
        </Typography>
      </div>
      {formattedDate && (
        <div className={"flex flex-col gap-1"}>
          <Typography
            text={Locale.paymentDate}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
          <Typography
            text={formattedDate}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-700"}
          />
        </div>
      )}
      <div className={"flex flex-row items-start gap-4 bg-blue-50 border border-blue-400 p-4 rounded"}>
        <InfoIcon />
        <div className={"flex flex-col gap-1.5"}>
          <Typography
            text={Locale.nonSkydoProcessorHead}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={"600"}
          />
          <Typography
            text={Locale.nonSkydoProcessorMessage}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={"flex flex-col border-t border-black-100"}>
      {renderHeader()}
      {isExpanded && renderBody()}
    </div>
  );
};

export default RemainderPaidOutsideCard;
