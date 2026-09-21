import { BankAccount, Importer, InvoiceMetadata, InvoiceSource, Transaction } from "../../types";
import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import {
  getRefundReason,
  getTransactionStatusWiseColorTextMapping,
  isArchived,
  isCompletedTransaction,
  isRefundAvailable,
  isRejected,
} from "../../util/functions";
import RightSubTitle from "./RightSubTitle";
import InfoBox from "../Common/InfoBox";
import { formatDate, formatINRNumber, formatUTCDate } from "../../util/formatters";
import MessageBox from "./MessageBox";
import TransactionTracker from "./TransactionTracker";
import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import TransactionHeader from "./TransactionHeader";
import SkydoIcon from "../Icons/SkydoIcon";
import useVideoKycStore from "../../store/useVideoKycStore";
import ActionableCtaOnTransaction from "./ActionableCtaOnTransaction";
import useExporterAndExporterUserStore from "../../store/useExporterAndExporterUserStore";
import { McaDocStatus } from "../../types/Exporter/ExporterUser";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import InfoIcon from "../AtomicComponents/ToastMessages/InfoIcon";
import { FUNDING_VENDOR } from "../PaymentLinks/constants";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import useReferralStore from "../../store/useReferralStore";
import useMobileVersionHook from "../Common/useMobileVersionHook";
import { INVOICE_STATUS, TRANSACTION_STATES } from "../../constants/dashboardConstants";
import BlackPointerIcon from "../Icons/BlackPointerIcon";
import TickIconInsta from "../Icons/TickIconInsta";
import ExclamationIcon from "../Icons/ExclamationIcon";
import CheckPaymentStatusModal from "../ClientLedger/CheckPaymentStatusModal";
import FailedSectionPaymentLink from "../PaymentLinks/FailedSectionPaymentLink";
import { getHasStackedActionableBelow } from "../../util/actionableCtaOnTransactionVisibility";

interface Props {
  transaction?: Transaction;
  isPCRequired: boolean;
  isSkydoInvoice: boolean;
  invoiceMetadata?: InvoiceMetadata;
  onAddPCClick?: () => void;
  isUnpaidInvoice?: boolean;
  reasonToArchive?: string;
  invoiceStatus?: string;
  bankAccount?: BankAccount;
  invoiceCurrency: string;
  invoiceAmount: number;
  invoiceAmountMapped: number;
  isVisible: boolean;
  totalTransactions: number;
  index?: number;
  isRefundable?: boolean;
  importer: Importer;
  isTest?: boolean;
  readyToTransact?: boolean;
  isLast: boolean;
  isInstantSettlement?: boolean;
  isInvoiceLess?: boolean;
  showUserActionables?: boolean;
}

const TransactionComponent = (props: Props) => {
  const { theme } = useContext(AppContext);
  const {
    transaction,
    isPCRequired,
    isSkydoInvoice,
    invoiceMetadata,
    onAddPCClick,
    isUnpaidInvoice,
    reasonToArchive,
    invoiceStatus,
    invoiceCurrency,
    invoiceAmount,
    invoiceAmountMapped,
    isVisible,
    totalTransactions,
    index,
    isRefundable,
    importer,
    isTest,
    readyToTransact,
    isLast,
    isInstantSettlement,
    isInvoiceLess,
    showUserActionables,
  } = props;
  const bankAccount = props.transaction?.transactionMetadata?.bankAccount;
  const [isTransactionVisible, setTransactionVisible] = useState<boolean>(isVisible);
  const [checkPaymentStatusVisible, setCheckPaymentStatusVisible] = useState(false);
  const senderAlertDetails = transaction?.senderAlertDetails;
  const { isVideoKycDone } = useVideoKycStore();
  const analytics = useAnalytics();
  const { isMobile } = useMobileVersionHook();

  const onTransactionHeaderClick = () => {
    setTransactionVisible(!isTransactionVisible);
  };

  const vendor = transaction?.funding?.[0]?.vendor;

  const fira = transaction?.fira;
  const skydoReceipt = transaction?.payment?.paymentReceipt;
  const transactionMetadata = transaction?.transactionMetadata;
  const expectedSettlement = transactionMetadata?.expectedSettlementDate
    ? formatUTCDate(transactionMetadata.expectedSettlementDate)
    : "";
  const transactionCreationSource = transactionMetadata?.creationSource;
  const nonVAFunding = vendor === FUNDING_VENDOR.VEEM;

  const transactionStatusWiseAudit = (transaction?.transactionAudit || []).reduce(
    (map: { [key: string]: Transaction }, transaction: Transaction) => {
      map[transaction.transactionState] = transaction;
      return map;
    },
    {}
  );

  const transactionCurrency = transaction?.currency || invoiceCurrency;

  const { textColor, bgColor, text, fullText } = getTransactionStatusWiseColorTextMapping(
    transaction?.transactionState as string,
    theme,
    isSkydoInvoice
  );
  const { userReferralData } = useReferralStore();

  const paymentStatusText = isSkydoInvoice
    ? isTransactionVisible
      ? fullText
      : text
    : Locale.nonSkydoProcessorInvStatus;

  const cashbackProcessState = transaction?.payment?.cashBackRecord?.cashbackProcessState;
  const isRefundableInvoice =
    (isRefundable || isRefundAvailable(userReferralData?.rewardData?.rewardValue || 0.0)) &&
    (cashbackProcessState != "SUCCESS" || (transaction?.payment?.creditUsedUSD || 0.0) == 0.0);
  const isRefunded = cashbackProcessState === "SUCCESS" || (transaction?.payment?.creditUsedUSD || 0.0) > 0.0;
  const cashbackReason =
    transaction?.payment?.manualCashBackEntry?.cashbackReasonType ||
    transaction?.payment?.cashBackRecord?.cashbackReasonType;
  const refundReason = getRefundReason(cashbackReason);

  const srn = transaction?.srn;

  // only for new user
  const vkycNeeded = !isVideoKycDone && isSkydoInvoice;
  const { exporter = {} } = useExporterAndExporterUserStore();
  const { mcaDocStatus } = exporter;
  const isMcaDocsBlockVisible =
    (mcaDocStatus === McaDocStatus.REQUIRED || mcaDocStatus === McaDocStatus.UNDER_REVIEW) && isSkydoInvoice;

  const isInfoRequired = isPCRequired || senderAlertDetails || vkycNeeded || isMcaDocsBlockVisible;
  // Outstanding invoice with nothing else pending → show the "Where is my payment?"
  // prompt inline inside the orange status card (matches the Payments card design).
  const showInlineOutstanding = !!isSkydoInvoice && !!isUnpaidInvoice && !isInfoRequired;
  const hasStackedActionableBelow = getHasStackedActionableBelow({
    vkycNeeded,
    isPCRequired,
    isSkydoInvoice,
    showUserActionables,
    mcaDocStatus,
    senderAlertDetails,
  });
  const senderCaseAlertPending = !!(senderAlertDetails?.alertStatus && senderAlertDetails?.alertStatus == "PENDING");
  const senderCaseAlertDocUrls = senderAlertDetails?.alertDocUrls;

  const isZohoInvoice = invoiceMetadata?.source == InvoiceSource.ZOHO_BOOKS;

  const isSettled = transaction?.transactionState == TRANSACTION_STATES.EXPORTER_SUCCESS;
  const settlementDate = formatDate(transaction?.settlementDate as string);

  if (isMobile) {
    const complianceActionReq = senderCaseAlertPending || isMcaDocsBlockVisible;
    const bothPCAndCompReq = complianceActionReq && isPCRequired;
    const anyOfPCOrCompReq = complianceActionReq || isPCRequired;

    let actionCta = null;
    let actionTitle = Locale.actionNeeded;
    if (anyOfPCOrCompReq) {
      if (bothPCAndCompReq) actionCta = Locale.mobBothPCAndCOmpAction;
      else if (isPCRequired) {
        actionCta = Locale.mobilePurposeCodeRequired;
        actionTitle = Locale.actionRequired;
      } else if (senderCaseAlertPending || isMcaDocsBlockVisible) actionCta = Locale.mobCompCTa;
    }

    return (
      <>
        {anyOfPCOrCompReq && actionCta ? (
          <div className={"px-4 mt-4"}>
            <div className={"flex flex-row items-start rounded-5px border border-alert-200 bg-alert-50 p-3"}>
              <ExclamationIcon height={18} width={18} className={"mr-2 shrink-0 "} />
              <div className={"flex flex-col gap-1"}>
                <Typography
                  text={actionTitle}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={"700"}
                />
                <Typography text={actionCta} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
              </div>
            </div>
          </div>
        ) : null}
        {isZohoInvoice ? (
          <div className={"px-4 mt-4"}>
            <div className={"flex flex-row bg-black-50 px-4 py-3 rounded gap-2"}>
              {isSettled ? <TickIconInsta /> : <BlackPointerIcon />}
              <Typography
                text={isSettled ? "Zoho has been updated with the " : "Zoho will be updated with the "}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
              >
                <Typography
                  text={"exchange rate & payment UTR number."}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={"700"}
                ></Typography>
              </Typography>
            </div>
          </div>
        ) : null}
        {transaction?.fixedInr ? (
          <Typography
            text={Locale.thisIsAPayoutOf}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"flex justify-center mx-4 px-4 py-2.5 rounded-[5px] bg-blue-50 !font-semibold"}
          >
            <Typography
              text={formatINRNumber({
                value: transaction?.fixedInr,
                maximumFractionDigits: 2,
                formatOptions: { minimumFractionDigits: 2 },
              })}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"ml-1 !font-bold"}
            />
          </Typography>
        ) : null}
        <TransactionHeader
          transaction={transaction}
          totalTransactions={totalTransactions}
          onTransactionHeaderClick={onTransactionHeaderClick}
          isTransactionVisible={isTransactionVisible}
          index={index}
          isSkydoInvoice={isSkydoInvoice}
          expectedSettlement={expectedSettlement}
        />
        {isRejected(transaction?.transactionState) && isTransactionVisible && (
          <div className={"px-4 pb-6"}>
            <FailedSectionPaymentLink
              failureReason={transaction?.failureReasonDto}
              settlementReference={srn}
              isMobile={true}
              source={"invoice"}
            />
          </div>
        )}
        {isTransactionVisible && !isRejected(transaction?.transactionState) && (
          <div className={"px-4 pb-6"}>
            <div className={"flex flex-col bg-green-50 px-4 py-3 rounded-10px"}>
              <Typography text={Locale.statusFields} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL}>
                <Typography
                  text={paymentStatusText}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-green-400 ml-1"}
                  fontWeight="700"
                />
              </Typography>
              {transaction && (
                <Typography
                  text={isSettled ? "Settled on:" : Locale.expectedSettlement}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-600 mt-1"}
                >
                  <Typography
                    text={isSettled ? settlementDate : expectedSettlement}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    fontWeight={"700"}
                    textClasses={"!text-green-400 ml-1"}
                  />
                </Typography>
              )}
              {srn && (
                <Typography
                  text={Locale.settlementRef + ": "}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-600 mt-4"}
                >
                  <Typography
                    text={srn}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    fontWeight={"700"}
                    textClasses={"ml-1"}
                  />
                </Typography>
              )}
            </div>
            {isSkydoInvoice && (
              <TransactionTracker
                {...{
                  invoiceAmount: invoiceAmount,
                  transactionStatusWiseAudit,
                  transactionId: transaction?.id,
                  transaction,
                  fira,
                  skydoReceipt,
                  isFiraAvailable: !!fira,
                  isReceiptAvailable: !!skydoReceipt,
                  bankAccount,
                  expectedSettlement: expectedSettlement,
                  transactionCurrency,
                  isRefundable: isRefundableInvoice,
                  isRefunded: isRefunded,
                  importerName: importer?.businessName,
                  refundReason,
                  isTest,
                  isInstantSettlement,
                  cashbackReason,
                  isZohoInvoice,
                  isLast,
                  isInvoiceLess,
                  nonVAFunding,
                  vendor,
                  transactionCreationSource,
                }}
              />
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/*Only valid for multiple transactions*/}
      <TransactionHeader
        transaction={transaction}
        totalTransactions={totalTransactions}
        onTransactionHeaderClick={onTransactionHeaderClick}
        isTransactionVisible={isTransactionVisible}
        index={index}
        isSkydoInvoice={isSkydoInvoice}
        expectedSettlement={expectedSettlement}
      />

      {isRejected(transaction?.transactionState) && isTransactionVisible ? (
        <div className={"px-6 pb-6"}>
          <div className="flex flex-col gap-2.5">
            {/* <div className="flex flex-col gap-1">
              <Typography
                text={formatIncomingCurrencyWithNumber({
                  value: transaction?.amount || 0,
                  currency: transaction?.currency || "",
                  maxFractionDigits: 2,
                  minFractionDigits: 2,
                })}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.LARGE}
                fontWeight={"600"}
                textClasses={"!text-black-700"}
              />
              <Typography
                text={"Payment Initiated on: " + formatDate(transaction?.createdAt as string)}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500"}
              />
            </div> */}
            <FailedSectionPaymentLink
              failureReason={transaction?.failureReasonDto}
              settlementReference={srn}
              showPaymentLinkButton={invoiceStatus === INVOICE_STATUS.READY_TO_TRANSACT}
              source={"invoice"}
            />
          </div>
        </div>
      ) : null}

      {/*Transaction remains visible in case of single transaction*/}
      {isTransactionVisible && !isRejected(transaction?.transactionState) ? (
        <div className={"px-6 pb-6"}>
          <div
            className={classNames("px-6 py-4", {
              "rounded-t-10px border border-b-0 border-black-400": hasStackedActionableBelow,
              "rounded-10px": !hasStackedActionableBelow,
            })}
            style={{ background: hasStackedActionableBelow ? "" : bgColor }}
          >
            {/*Transaction status*/}
            <div className={"flex flex-row justify-between"}>
              <div className={"flex flex-col 1.5xl:flex_row_item_center"}>
                <Typography text={Locale.statusFields} textClasses={"mr-1"} />
                <div className={"flex_row_item_center"}>
                  <Typography
                    text={paymentStatusText}
                    textProps={{
                      color: textColor,
                    }}
                    fontWeight="700"
                    textClasses={"mr-1 flex"}
                  >
                    {isSkydoInvoice && isCompletedTransaction(transaction?.transactionState) ? (
                      <SkydoIcon className={"ml-1"} isMedium={true} />
                    ) : undefined}
                  </Typography>
                </div>
              </div>
              {srn ? <InfoBox header={Locale.settlementRef} value={srn} containerClass={"items-end"} /> : null}
            </div>
            {/*Shows the delay reason will only come once transaction is created*/}
            {isSkydoInvoice ? (
              <RightSubTitle
                invoiceStatus={invoiceStatus}
                transactionStatus={transaction?.transactionState}
                textColor={textColor}
                expectedSettlement={expectedSettlement}
                transactionIncident={transaction?.transactionIncident}
              />
            ) : null}
            {showInlineOutstanding ? (
              <>
                <hr className={"border-black-300 my-4"} />
                <div className={"flex flex-row items-center justify-between gap-4"}>
                  <div className={"flex flex-col gap-1"}>
                    <Typography
                      text={Locale.waitingForPaymentFromYourClient}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      fontWeight={"700"}
                      textClasses={"!text-black-700"}
                    />
                    <Typography
                      text={Locale.shareFewDetailsToCheckStatus}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses={"!text-black-500"}
                    />
                  </div>
                  <button
                    className={
                      "shrink-0 bg-white border border-black-300 rounded-lg px-4 py-2 text-sm font-semibold text-black-700 cursor-pointer hover:bg-black-50"
                    }
                    onClick={() => {
                      analytics.trackAsync(Events.FUNDING_TIMELINE_ENTRY_CLICKED, {
                        entry_point: "invoice_detail",
                        invoice_currency: invoiceCurrency,
                      });
                      setCheckPaymentStatusVisible(true);
                    }}
                  >
                    {Locale.whereIsMyPayment}
                  </button>
                </div>
              </>
            ) : null}
          </div>
          {/*Section for invoices marked paid outside skydo*/}
          {!isSkydoInvoice ? (
            <div className={"grid grid-cols-3 gap-y-6 gap-x-4 mt-6"}>
              <InfoBox
                header={Locale.paymentDate}
                value={
                  invoiceMetadata && invoiceMetadata.paymentDate ? String(formatDate(invoiceMetadata.paymentDate)) : "-"
                }
              />
            </div>
          ) : null}
          <ActionableCtaOnTransaction
            vkycNeeded={vkycNeeded}
            isPCRequired={isPCRequired}
            onAddPCClick={onAddPCClick}
            senderAlertDetails={senderAlertDetails}
            senderCaseAlertPending={senderCaseAlertPending}
            senderCaseAlertDocUrls={senderCaseAlertDocUrls}
            transactionAmount={transaction?.amount}
            transactionCurrency={transactionCurrency}
            transactionReceivedOnTimestamp={
              transactionStatusWiseAudit[TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS]?.actionTimestamp
            }
            importer={importer}
            isSkydoInvoice={isSkydoInvoice}
            invoiceAmount={invoiceAmount}
            invoiceAmountMapped={invoiceAmountMapped}
            showUserActionables={showUserActionables}
          />
          {/*Message for outstanding invoice -- this will not come in case of multiple transaction*/}
          {isTest && readyToTransact === false ? (
            <MessageBox head={Locale.awaitingFunds} message={Locale.moneyWillReflectPostKYC} />
          ) : null}
          {isUnpaidInvoice && !isPCRequired && !vkycNeeded && !showInlineOutstanding ? (
            <div
              className={"rounded-10px p-4 flex flex-col gap-3"}
              style={{ backgroundColor: "#fff5f5", border: "1px solid #fecaca" }}
            >
              <div className={"flex flex-col gap-1"}>
                <Typography
                  text={Locale.waitingForPaymentFromYourClient}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-700"}
                />
                <Typography
                  text={Locale.shareFewDetailsToCheckStatus}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-black-500"}
                />
              </div>
              <button
                className={"self-start text-sm font-semibold text-blue-400 cursor-pointer bg-transparent border-0 p-0"}
                onClick={() => {
                  analytics.trackAsync(Events.FUNDING_TIMELINE_ENTRY_CLICKED, {
                    entry_point: "invoice_detail",
                    invoice_currency: invoiceCurrency,
                  });
                  setCheckPaymentStatusVisible(true);
                }}
              >
                {Locale.whereIsMyPayment}
              </button>
            </div>
          ) : null}
          {isArchived(invoiceStatus) ? <MessageBox head={Locale.reason} message={reasonToArchive as string} /> : null}
          {/*Message for payment settled outside skydo*/}
          {!isSkydoInvoice ? (
            <MessageBox head={Locale.nonSkydoProcessorHead} message={Locale.nonSkydoProcessorMessage} />
          ) : null}
          {/* Fixed INR Declaration */}
          {transaction?.fixedInr ? (
            <Typography
              text={Locale.thisIsAFixedINRPayout}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"mt-2 w-full flex justify-center p-4 rounded-10px bg-blue-50 !font-semibold"}
            >
              <Typography
                text={formatINRNumber({
                  value: transaction?.fixedInr,
                  maximumFractionDigits: 2,
                  formatOptions: { minimumFractionDigits: 2 },
                })}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"ml-1 !font-bold"}
              />
            </Typography>
          ) : null}
          {isArchived(invoiceStatus) || !isSkydoInvoice || vendor === FUNDING_VENDOR.PPRO ? (
            vendor === FUNDING_VENDOR.PPRO ? (
              <div className={"mt-6 p-4 bg-blue-50 border border-blue-400 rounded-[4px] flex flex-row gap-4"}>
                <InfoIcon />
                <div className={"flex flex-col gap-1.5"}>
                  <Typography
                    text={Locale.paymentLink.paymentLinkTracking}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    fontWeight={"semibold"}
                  />
                  <Typography
                    text={Locale.paymentLink.paymentLinkTrackingSubText}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    type={TYPOGRAPHY_TYPES.PARA}
                  />
                </div>
              </div>
            ) : null
          ) : (
            <TransactionTracker
              {...{
                invoiceAmount: invoiceAmount,
                transactionStatusWiseAudit,
                transactionId: transaction?.id,
                transaction,
                fira,
                skydoReceipt,
                isFiraAvailable: !!fira,
                isReceiptAvailable: !!skydoReceipt,
                bankAccount,
                expectedSettlement: expectedSettlement,
                transactionCurrency,
                isRefundable: isRefundableInvoice,
                isRefunded: isRefunded,
                importerName: importer?.businessName,
                refundReason,
                isTest,
                isInstantSettlement,
                cashbackReason,
                isZohoInvoice,
                isLast,
                isInvoiceLess,
                nonVAFunding,
                vendor,
                transactionCreationSource,
              }}
            />
          )}
        </div>
      ) : null}
      <CheckPaymentStatusModal
        isOpen={checkPaymentStatusVisible}
        onClose={() => setCheckPaymentStatusVisible(false)}
        formTitle={Locale.waitingForPaymentFromYourClient}
        entryPoint={"invoice_detail"}
        invoiceCurrency={invoiceCurrency}
      />
    </>
  );
};

export default TransactionComponent;
