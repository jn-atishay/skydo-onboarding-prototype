import Chip from "../Common/Chip";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { formatDate, formatIncomingCurrencyWithNumber, formatINRNumber } from "../../util/formatters";
import LongRightArrow from "../Icons/LongRightArrow";
import { getTransactionStatusWiseColorTextMapping, isCompletedTransaction, isRejected } from "../../util/functions";
import SkydoIcon from "../Icons/SkydoIcon";
import DropdownArrow from "../Common/DropdownArrow";
import { Transaction } from "../../types";
import Locale from "../../util/locale/en";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import classnames from "classnames";
import useMobileVersionHook from "../Common/useMobileVersionHook";
import classNames from "classnames";
import TransactionComponent from "./Transaction";
import {TRANSACTION_STATES} from "../../constants/dashboardConstants";

interface Props {
  transaction?: Transaction;
  totalTransactions: number;
  onTransactionHeaderClick: () => void;
  isTransactionVisible: boolean;
  index?: number;
  isSkydoInvoice: boolean;
  expectedSettlement: string;
}

{
  /*
  @description: returns null in case of single transaction or no transaction
*/
}
const TransactionHeader = (props: Props) => {
  const {
    transaction,
    totalTransactions,
    onTransactionHeaderClick,
    isTransactionVisible,
    index,
    isSkydoInvoice,
    expectedSettlement,
  } = props;

  const { theme } = useContext(AppContext);

  const {isMobile} = useMobileVersionHook();

  const renderSettlementDate = () => {
    if (isCompletedTransaction(transaction?.transactionState)) {
      const settlementDate = formatDate(transaction?.settlementDate as string);
      return (
        <Typography
          text={Locale.settlementOnDate.replace(":date", settlementDate)}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 mt-1"}
        />
      );
    }
    return (
      <Typography
        text={isRejected(transaction?.transactionState) ? "Payment initiated on: " + formatDate(transaction?.createdAt as string) : Locale.expectedSettlement + " " + expectedSettlement}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"!text-black-500 mt-1"}
      />
    );
  };

  const { textColor, bgColor, text } = getTransactionStatusWiseColorTextMapping(
    transaction?.transactionState as string,
    theme,
    isSkydoInvoice
  );

  if(isMobile == null) return null;

  if(isMobile) {
    // Return null if no transaction data for mobile

    if(!transaction || totalTransactions == 1) return <div className={"mt-4"}></div>;

    const isAmountSettledAvailable = !!transaction.amountSettled

    const isSettled = transaction?.transactionState == TRANSACTION_STATES.EXPORTER_SUCCESS;

    const settlementDate = formatDate(transaction?.settlementDate as string);
    
    return (
      <div className={classNames("p-4 bg-white border-t border-black-100 ", {
        "border-b border-black-100 !pb-6": !isTransactionVisible
      })}>
        <div 
          className={"flex flex-row items-center justify-between"}
          onClick={totalTransactions == 1 ? () => {} : onTransactionHeaderClick}
        >
          <div className={"flex flex-row items-center gap-3"}>
            <Typography
              text={formatIncomingCurrencyWithNumber({
                value: transaction.amount,
                currency: transaction.currency,
                maxFractionDigits: 2,
                minFractionDigits: 2,
              })}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-700"}
            />

            {isAmountSettledAvailable && <div className={"bg-black-200 rounded-full p-1"}>
              <LongRightArrow width={12} height={12}/>
            </div>}

            {isAmountSettledAvailable && <Typography
              text={formatINRNumber({
                value: transaction.amountSettled || transaction.amount,
                maximumFractionDigits: 2,
                formatOptions: {minimumFractionDigits: 2},
              })}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-700"}
            />}
          </div>
          <div className={classNames("flex flex-row items-center gap-2")}>
            <DropdownArrow 
              isOpen={isTransactionVisible}
              containerClass={""}
              width={16}
              height={16}
              // stroke={theme.hexColors.black[500]}
            />
          </div>
        </div>
        {!isTransactionVisible && (
          <div className={"flex flex-row items-center justify-between mt-4"}>
            <div className={"flex flex-row items-center gap-1"}>
              <Typography
                text={isSettled ? "Settled on:" : (isRejected(transaction?.transactionState) ? "Payment initiated on:" : Locale.expectedSettlement)}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-600"}
              />
              <Typography
                text={isSettled ? settlementDate : isRejected(transaction?.transactionState) ? formatDate(transaction?.createdAt as string) : expectedSettlement}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"700"}
                textClasses={isRejected(transaction?.transactionState) ? "!text-black-700" : "!text-green-400"}
              />
            </div>
            <div className={"flex flex-row items-center gap-[2px]"}>
              {isSettled ? (
                <SkydoIcon isSmall={true}/>
              ) : null}
              <Typography
                text={text}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"700"}
                textClasses={isRejected(transaction?.transactionState) ? "!text-red-400" : "!text-green-400"}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return !!transaction && totalTransactions > 1 ? (
    <div>
      <div
        className={"flex flex-row p-6 justify-between border-t border-black-400 cursor-pointer"}
        onClick={onTransactionHeaderClick}
      >
        <div className={"flex flex-row basis-[70%]"}>
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
          <div className={"flex-1 flex flex-col ml-2.5"}>
            <div className={"flex-1 flex flex-row items-center"}>
              <div className={"basis-[45%]"}>
                <Typography
                  text={formatIncomingCurrencyWithNumber({
                    value: transaction.amount,
                    currency: transaction.currency,
                    minFractionDigits: 2,
                  })}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.LARGE}
                />
              </div>
              {transaction.amountSettled ? (
                <>
                  <LongRightArrow />
                  <div className={"flex justify-end basis-[55%]"}>
                    <Typography
                      text={formatINRNumber({
                        value: transaction.amountSettled,
                        maximumFractionDigits: 2,
                        formatOptions: { minimumFractionDigits: 2 },
                      })}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.LARGE}
                    />
                  </div>
                </>
              ) : null}
            </div>
            {!isTransactionVisible && isSkydoInvoice ? renderSettlementDate() : null}
          </div>
        </div>

        <div className={"flex flex-row"}>
          {!isTransactionVisible ? (
            <Chip containerClass={classnames("!h-6 flex items-center flex-nowrap")} bgColor={theme.hexColors.white}>
              <div className={"flex flex-row items-center"}>
                <Typography
                  text={text}
                  textProps={{
                    color: textColor,
                  }}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                />
                {isCompletedTransaction(transaction?.transactionState) ? (
                  <SkydoIcon isSmall={true} className={"ml-1"} />
                ) : null}
              </div>
            </Chip>
          ) : null}
          <DropdownArrow isOpen={!!isTransactionVisible} containerClass={"ml-2"} stroke={theme.hexColors.blue[400]} />
        </div>
      </div>
    </div>
  ) : null;
};

export default TransactionHeader;
