import { Invoice } from "../../types";
import {getInvoiceStatusWiseColorTextMapping, isCompleted,} from "../../util/functions";
import React, { useCallback, useContext} from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { formatDate } from "../../util/formatters";
import Link from "next/link";
import { useRouter } from "next/router";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import InfoBox from "../Common/InfoBox";
import {
  getSettledAmountFromTransactionList,
  isAnyTransactionPastNostroReceiverSuccess,
  isCreditNoteAvailableInTransactionList,
  isReceiptAvailableInTransactionList,
} from "../../util/transactionHelpers";
import classnames from "classnames";
import AppContext from "../../context/AppContext";
import Chip from "../Common/Chip";
import PaymentDetails from "../Common/InvoicePaymentsCommonComponents/PaymentDetails";
import RepeatIcon from "../Icons/RepeatIcon";
import Tooltip from "../AtomicComponents/Tooltip";

interface Props {
  invoiceData: Invoice;
}

const InvoiceLessLeftSection = (props: Props) => {
  const { invoiceData } = props;
  const {
    status,
    importer,
    amount,
    transaction,
    purposeCode,
    currency,
    raisedDate,
    exporterSystemInvoiceId,
    isTest,
  } = invoiceData;
  const isFiraAvailable = transaction?.some((txn) => !!txn.fira);
  const { theme } = useContext(AppContext);
  const { textColor, bgColor, text, isInprogress } = getInvoiceStatusWiseColorTextMapping(invoiceData, theme);
  const router = useRouter();
  const analytics = useAnalytics();
  const inrAmount = getSettledAmountFromTransactionList(transaction);
  let raisedDateFallback = "";

  const isIndiaReceived = useCallback(() => {
    let moneyReceivedFlag = false;
    if (isAnyTransactionPastNostroReceiverSuccess(transaction)) {
      moneyReceivedFlag = true;
    }
    return moneyReceivedFlag || isCompleted(status);
  }, [status]);

  const renderChangePCCode = () => {
    if (isIndiaReceived()) return null;
    const onChangeClick = () => analytics?.trackAsync(Events.CHANGE_PC_PROFILE_PAGE_CLICK);
    return (
      <Link
        href={{
          pathname: router.pathname,
          query: {
            ...router.query,
            openPurposeCodePopup: true,
            exporterSystemInvoiceId,
            purposeCode: purposeCode?.code,
          },
        }}
        shallow={true}
      >
        <a onClick={onChangeClick}>
          <Typography text={Locale.change} textClasses={"cursor-pointer !text-blue-400"} />
        </a>
      </Link>
    );
  };


  const renderInvoiceStatus = () => {
    return (
      <div className={"flex_row_item_center"}>
        <Chip bgColor={bgColor} containerClass={"w-fit h-7 flex_row_item_center"}>
          <Typography
            text={text}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontColor={textColor}
            fontWeight={"700"}
          />
        </Chip>
        {invoiceData?.recurringInvoiceConfigId ? (
          <Tooltip tooltipText={Locale.recurringInvoice}>
            <RepeatIcon className={"ml-2"} stroke={theme.hexColors.navyblue[400]} />
          </Tooltip>
        ) : null}
      </div>
    );
  };

  const isReceiptAvailable = isReceiptAvailableInTransactionList(transaction);
  const isCreditNoteAvailable = isCreditNoteAvailableInTransactionList(transaction);

  return (
    <div className={"flex flex-col flex-1"}>
      <PaymentDetails
        titleHeading={`Received on ${formatDate(raisedDate??"")} from`}
        importerName={importer?.businessName}
        importerId={importer?.id}
        sourceAmountTitle={"Payment amount"}
        sourceAmount={amount}
        sourceCurrency={currency}
        inrAmountTitle={Locale.settledAmount}
        inrAmount={inrAmount}
        isFiraAvailable={isFiraAvailable}
        showMarkAsPaidBtn={false}
        onMarkAsPaidClick={()=>{}}
        showDeleteInvoiceBtn={false}
        showPaymentReminderBtn={false}
        showDuplicateInvoiceBtn={false}
        onDeleteInvoiceClick={()=>{}}
        invoiceId={props.invoiceData.id}
        isPartiallyPaidInvoice={false}
        renderPartialPaidInvoiceDetails={()=><></>}
        isReceiptAvailable={isReceiptAvailable}
        isCreditNoteAvailable={isCreditNoteAvailable}
        invoiceData={props.invoiceData}
        statusComponent={renderInvoiceStatus}
        isEInvoice={false}
        isTest={isTest}
        onCancelRecurringInvoiceClick={()=>{}}
        invoiceStatus={status}
      />
      <div>
        <div
          className={classnames("bg-white rounded-t-10px p-6 mt-4 flex flex-col")}
        >
          <Typography text={Locale.paymentDetails} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} />
          <div className={"grid grid-cols-3 gap-y-6 gap-x-4 mt-6"}>
            <InfoBox header={"Payment currency"} value={currency} />
            <InfoBox header={"Payment date"} value={formatDate(raisedDate || raisedDateFallback) || "-"} />
            {purposeCode?.code ? (
              <InfoBox
                header={Locale.pCode}
                value={purposeCode?.code}
                subValue={purposeCode?.description}
                renderCTA={isTest ? () => null : renderChangePCCode}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLessLeftSection;
