import Locale from "../../util/locale/en";
import { BankAccount, CashbackReasonType, FileDetails, Transaction } from "../../types";
import { VeemMethodEnum, VeemStatusEnum } from "../../types/Funding";
import {
  DocTypes,
  EntityTypes,
  LOCATION_CODE,
  LOCATION_CURRENCY_MAP,
  TRANSACTION_STATES,
  TRANSACTION_STATES_SERIES,
} from "../../constants/dashboardConstants";
import { formatDate, formatIncomingCurrency, formatINRNumber } from "../../util/formatters";
import TransactionStep from "./TransactionStep";
import React, { useEffect, useState } from "react";
import TransactionFxRate from "./TransactionFxRate";
import Image from "next/image";
import { TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import TextCTA from "../AtomicComponents/TextCTA";
import FE_ROUTES from "../../util/feRoutes";
import { useRouter } from "next/router";
import { Events } from "../../analytics/EventConstants";
import useToastMessages from "../../store/toastMessages";
import useAnalytics from "../../analytics/useAnalytics";
import downloadFile from "../../util/downloadFile";
import { getFileDownloadUrl } from "../../util/functions";
import useReferralStore from "../../store/useReferralStore";
import PCEmailPopupContainer from "../../containers/PaymentConfirmation/PCEmailPopupContainer";
import PCButtonContainer from "../../containers/PaymentConfirmation/PCButtonContainer";
import { getFiraUploadedToZoho, getMarkedAsPaidZoho } from "./ZohoTrackerComponents";
import { isTransactionEligibleForReceipt } from "../../util/invoiceHelperFunctions";
import TransactionTrackerNps from "../NpsInput/TransactionTrackerNps";
import useExporterAndExporterUserStore from "../../store/useExporterAndExporterUserStore";
import useMobileVersionHook from "../Common/useMobileVersionHook";
import classNames from "classnames";
import { FUNDING_VENDOR } from "../PaymentLinks/constants";

type StatusWiseMap = { [key: string]: Transaction };

interface Props {
  invoiceAmount: number;
  transactionStatusWiseAudit: StatusWiseMap;
  transactionId?: number;
  isFiraAvailable: boolean;
  isReceiptAvailable: boolean;
  expectedSettlement: string | undefined;
  fira: FileDetails | null | undefined;
  skydoReceipt: FileDetails | null | undefined;
  transaction: Transaction | null | undefined;
  bankAccount: BankAccount | null | undefined;
  isRefundable: boolean;
  isRefunded: boolean;
  refundReason: string;
  importerName: string;
  transactionCurrency: string;
  isTest?: boolean;
  isInstantSettlement?: boolean;
  cashbackReason?: CashbackReasonType;
  isZohoInvoice?: boolean;
  isLast: boolean;
  isInvoiceLess?: boolean;
  nonVAFunding?: boolean;
  vendor?: string;
  transactionCreationSource?: string | null;
}

export const dateFormattingOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  timeZoneName: "short",
};

export const dateFormattingOptionsDateOnly = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

// same with dateFormattingOptions but does not show IST/PMT etc.
// e.g. 3 Jun 2023, 11:45 AM
export const dateFormattingOptionsWithoutTimeZone = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

const TransactionTracker = (props: Props) => {
  const {
    invoiceAmount,
    transactionStatusWiseAudit,
    transactionId,
    isFiraAvailable,
    isReceiptAvailable,
    fira,
    skydoReceipt,
    transaction,
    bankAccount,
    expectedSettlement,
    importerName,
    isRefundable,
    isRefunded,
    transactionCurrency,
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
  } = props;

  // Helper function to get veemOrder from transaction funding
  const getVeemOrder = () => {
    if (!transaction?.funding || transaction.funding.length === 0) return null;
    return transaction.funding.find((funding) => funding.veemOrder)?.veemOrder || null;
  };

  const veemOrder = getVeemOrder();
  const router = useRouter();
  // get the last part of url after "/"
  const invoiceId = router.asPath.split("/").pop();
  const accountNumber = bankAccount?.accountNumber || "";
  const bankName = bankAccount?.bankMetadata?.bankName || "";
  const bankLogoUrl = bankAccount?.bankMetadata?.logoURL || "";
  const { exporterUser } = useExporterAndExporterUserStore();
  const { isMobile } = useMobileVersionHook();

  const isEligibleForReceipt =
    isReceiptAvailable ||
    (!exporterUser?.isSkydoInvoiceDisabled && isTransactionEligibleForReceipt(transaction as Transaction));
  const isPaymentDone = isEligibleForReceipt ? isFiraAvailable && isReceiptAvailable : isFiraAvailable;
  const currState = transaction?.transactionState || "";

  const fxDetails = transaction?.payment?.fxDeal;
  const paymentId = transaction?.payment?.id || 0;
  const isSez = !!transaction?.payment?.sezType;
  const { addToast } = useToastMessages();
  const { userReferralData } = useReferralStore();
  const [isRewardAvailable, setIsRewardAvailable] = useState<boolean>(false);
  useEffect(() => {
    setIsRewardAvailable((userReferralData?.rewardData?.rewardValue || 0) > 0);
  }, [userReferralData]);

  const analytics = useAnalytics();

  const paymentDetailsLink = FE_ROUTES.PAYMENTS_AND_CHARGES_DETAILS.replace("[payment_id]", String(paymentId));

  const cashbackRecord = transaction?.payment?.cashBackRecord;
  const cashbackUtr = cashbackRecord?.dbsCashBackSettlement?.localUTR || "";
  const cashBackSettlementDate = cashbackRecord?.dbsCashBackSettlement?.updatedAt || "";
  const isApportioned = (transaction?.payment?.transaction?.length || 0) > 1;
  const totalSkydoCharges = transaction?.pricingRecord?.totalCharges || 0;
  const formatedTotalSkydoCharges = formatINRNumber({
    value: totalSkydoCharges,
    maximumFractionDigits: 2,
    formatOptions: { minimumFractionDigits: 2 },
  });
  const isDoneState = (state: string) =>
    TRANSACTION_STATES_SERIES.indexOf(currState) > TRANSACTION_STATES_SERIES.indexOf(state);
  const isCurrState = (startState: string, endState: string) => {
    return (
      TRANSACTION_STATES_SERIES.indexOf(startState) <= TRANSACTION_STATES_SERIES.indexOf(currState) &&
      TRANSACTION_STATES_SERIES.indexOf(currState) <= TRANSACTION_STATES_SERIES.indexOf(endState)
    );
  };

  const getStatusParams = (startState: string, endState: string) => ({
    isPassed: isPaymentDone || isDoneState(endState),
    isCurr: isCurrState(startState, endState),
  });

  const displayableAmount = transaction?.amount || invoiceAmount;

  const fxDealStatus = getStatusParams(
    TRANSACTION_STATES.EXPORT_COLLECTION_ACCOUNT_PENDING,
    TRANSACTION_STATES.EXPORTER_FAIL
  );
  const isFxDealDone = fxDealStatus.isPassed || fxDealStatus.isCurr;

  const getBankLogoAndName = () => {
    if (bankLogoUrl) {
      return (
        <span className={!!transactionId ? "!ml-1 mr-1 align-middle" : "!ml-1 mr-1 !opacity-50 align-middle"}>
          <Image src={bankLogoUrl} alt={bankName} width={16} height={16} />
        </span>
      );
    }
    return "";
  };

  const getExporterSuccessStepContent = ({ isPassed, isCurr }: { isPassed: boolean; isCurr: boolean }) => {
    const isActive = isPassed || isCurr || isPaymentDone;
    return (
      <div className={"flex items-start"}>
        <Typography
          text={Locale.neftInitiated.replace(
            ":amount",
            String(
              transaction?.amountSettled
                ? formatINRNumber({ value: transaction?.amountSettled })
                : LOCATION_CURRENCY_MAP[LOCATION_CODE.IND]
            )
          )}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={isActive ? "mr-1" : "mr-1 !text-black-500"}
        >
          {bankDetailsComponent(isActive)}
        </Typography>
      </div>
    );
  };

  const bankDetailsComponent = (isActive: boolean) => {
    return (
      <>
        {getBankLogoAndName() as JSX.Element}
        <Typography
          text={bankName}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={
            isActive ? `mr-1 ${bankLogoUrl ? "" : "ml-1"}` : `mr-1 ${bankLogoUrl ? "" : "ml-1"} !text-black-500`
          }
        >
          <Typography
            text={Locale.neftInitiatedAccount.replace(":account", accountNumber.slice(-4))}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={isActive ? "ml-1" : "!text-black-500 ml-1"}
          />
        </Typography>
      </>
    );
  };

  const getExporterRefundStepContent = (isRefunded: boolean, isApportioned: boolean, amount: string) => {
    return (
      <div className={"flex items-start"}>
        <Typography
          text={
            isRefunded
              ? isApportioned
                ? Locale.apportionedRefundDone
                : Locale.refundDone.replace("{amount}", amount)
              : Locale.refundPending
          }
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={isRefunded ? "mr-1" : "mr-1 !text-black-500"}
        >
          {bankDetailsComponent(isRefunded)}
        </Typography>
      </div>
    );
  };

  const onViewRefundClick = async () => {
    await router.push(paymentDetailsLink);
  };

  const creditNoteDownloadClick = async () => {
    void downloadFile({
      url: getFileDownloadUrl({
        docType: DocTypes.CASHBACK_RECORD,
        entityType: EntityTypes.TRANSACTION,
        entityId: transactionId,
      }),
      onDownloadError: onCreditNoteDownloadError,
      onDownloadComplete: onCreditNoteDownloadSuccess,
    });
  };

  const onCreditNoteDownloadSuccess = () => {
    analytics?.trackAsync(Events.SKYDO_CREDIT_NOTE_DOWNLOAD_SUCCESS);
  };

  const onCreditNoteDownloadError = () => {
    addToast({
      id: "downl_error",
      body: Locale.wentWrongMessage,
      type: TOAST_TYPES.ERROR,
    });
    analytics?.trackAsync(Events.SKYDO_CREDIT_NOTE_DOWNLOAD_ERROR);
  };

  const getPendingCashbackTitle = () => {
    if (
      cashbackReason === CashbackReasonType.REFERRER_CASHBACK ||
      cashbackReason === CashbackReasonType.REFEREE_CASHBACK
    ) {
      return Locale.refundPendingSubTitleWithReason.replace(":reason", "referral reward");
    } else if (cashbackReason === CashbackReasonType.ACTIVATION_REWARD) {
      return Locale.refundPendingSubTitleWithReason.replace(":reason", "first payment");
    } else if (isRewardAvailable) {
      return Locale.refundPendingSubTitleWoReason;
    } else {
      return Locale.refundPendingSubTitle
        .replace("${importerName}", importerName)
        .replace("${refundReason}", refundReason);
    }
  };

  // Check if any veem step is completed
  const isAnyVeemStepCompleted =
    veemOrder &&
    ((veemOrder.method === VeemMethodEnum.ACH_DEBIT && veemOrder.status !== VeemStatusEnum.CREATED) ||
      (veemOrder.method === VeemMethodEnum.VEEM_CARDS && veemOrder.status === VeemStatusEnum.COMPLETED));

  // Get modified status params for VIRTUAL_ACCOUNT_SUCCESS that considers veem steps
  const getVirtualAccountStatusParams = () => {
    const originalParams = getStatusParams(
      TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS,
      TRANSACTION_STATES.SKYDO_US_HUB_PENDING
    );
    return {
      ...originalParams,
      isCurr: originalParams.isCurr && !isAnyVeemStepCompleted,
      isPassed: !!(originalParams.isPassed || isAnyVeemStepCompleted),
    };
  };

  const renderExpectedCompletedSection = (expectedArrivalTime: string, showTmChecksOption: boolean) => {
    if (new Date(expectedArrivalTime) < new Date()) {
      return "";
    }
    return (
      <div className={"flex flex-col"}>
        <Typography
          text={`Expected to be completed by ${formatDate(expectedArrivalTime, dateFormattingOptions)}`}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 mt-1"}
        />
        {showTmChecksOption ? (
          <Typography
            text={"(subject to our standard processing checks)"}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500 mt-1"}
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className={"md:ml-4 ml-2 mt-6"}>
      {!isTest && !isMobile ? (
        <PCEmailPopupContainer invoiceId={invoiceId as string} transaction={transaction} importerName={importerName} />
      ) : null}

      {/*TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS*/}
      <TransactionStep
        {...{
          ...getVirtualAccountStatusParams(),
          isPaymentDone: isPaymentDone,
          isInstantSettlement: isInstantSettlement,
          title: displayableAmount
            ? transactionCreationSource === "WITHDRAWAL"
              ? Locale.balanceInvoiceTrackerStep.replace(
                  ":amount",
                  String(formatIncomingCurrency(displayableAmount, transactionCurrency))
                )
              : nonVAFunding
              ? Locale.confirmationReceived.replace(
                  ":amount",
                  String(formatIncomingCurrency(displayableAmount, transactionCurrency))
                )
              : Locale.amountReceived.replace(
                  ":amount",
                  String(formatIncomingCurrency(displayableAmount, transactionCurrency))
                )
            : Locale.amountToBeReceived,
          subTitle: formatDate(
            transactionStatusWiseAudit[TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS]?.actionTimestamp,
            dateFormattingOptions
          ),
          isTest: isTest,
        }}
      >
        {/* Payment confirmation CTA here */}
        {!isTest &&
        !isInvoiceLess &&
        !isMobile &&
        vendor !== FUNDING_VENDOR.VEEM &&
        !(transactionCreationSource === "WITHDRAWAL") ? (
          <PCButtonContainer transaction={transaction} />
        ) : (
          <></>
        )}
      </TransactionStep>

      {/* Veem ACH_DEBIT Steps */}
      {veemOrder && veemOrder.method === VeemMethodEnum.ACH_DEBIT && (
        <>
          {/* Step 1: Debit initiated from client's bank */}
          <TransactionStep
            {...{
              isPassed: (() => {
                const baseStatus = getStatusParams(
                  TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS,
                  TRANSACTION_STATES.SKYDO_US_HUB_PENDING
                );
                let isPassed = baseStatus.isPassed || isPaymentDone;
                if (veemOrder.frozenTill) {
                  const currentTime = new Date();
                  const frozenTillTime = new Date(veemOrder.frozenTill);
                  isPassed = isPassed || currentTime > frozenTillTime;
                }
                return isPassed;
              })(),
              isCurr: (() => {
                if (isPaymentDone) return false;
                const baseStatus = getStatusParams(
                  TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS,
                  TRANSACTION_STATES.SKYDO_US_HUB_PENDING
                );
                if (!baseStatus.isCurr) return false;

                let isCurrent = baseStatus.isCurr && veemOrder.status !== VeemStatusEnum.CREATED && !isPaymentDone;

                if (veemOrder.frozenTill) {
                  const currentTime = new Date();
                  const frozenTillTime = new Date(veemOrder.frozenTill);
                  isCurrent = isCurrent && currentTime < frozenTillTime;
                }
                return isCurrent;
              })(),
              isPaymentDone: isPaymentDone,
              isInstantSettlement: isInstantSettlement,
              title: Locale.veemDebitInitiated,
              subTitle: veemOrder.debitInitiatedTime
                ? formatDate(veemOrder.debitInitiatedTime, dateFormattingOptions)
                : "",
            }}
          />

          {/* Step 2: Amount received from client's bank */}
          <TransactionStep
            {...{
              isPassed:
                getStatusParams(TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS, TRANSACTION_STATES.SKYDO_US_HUB_PENDING)
                  .isPassed || isPaymentDone,
              isCurr: (() => {
                if (isPaymentDone) return false;
                const baseStatus = getStatusParams(
                  TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS,
                  TRANSACTION_STATES.SKYDO_US_HUB_PENDING
                );
                if (!baseStatus.isCurr) return false;
                // isCurrent will be true if current time is > frozenTill
                if (veemOrder.frozenTill) {
                  const currentTime = new Date();
                  const frozenTillTime = new Date(veemOrder.frozenTill);
                  return currentTime > frozenTillTime;
                }
                return false;
              })(),
              isPaymentDone: isPaymentDone,
              isInstantSettlement: isInstantSettlement,
              title: Locale.veemAmountReceivedFromBank,
              subTitle: (() => {
                const baseStatus = getStatusParams(
                  TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS,
                  TRANSACTION_STATES.SKYDO_US_HUB_PENDING
                );
                if (baseStatus.isPassed || isPaymentDone) {
                  // Show frozenTill timestamp when passed/completed
                  return veemOrder.frozenTill ? formatDate(veemOrder.frozenTill, dateFormattingOptions) : "";
                }
                if (baseStatus.isCurr && veemOrder.frozenTill) {
                  const currentTime = new Date();
                  const frozenTillTime = new Date(veemOrder.frozenTill);
                  if (currentTime > frozenTillTime) {
                    // Current time > frozenTill, show frozen till timestamp
                    return formatDate(veemOrder.frozenTill, dateFormattingOptions);
                  } else {
                    // Current time < frozenTill, show expected arrival time
                    return veemOrder.expectedArrivalTime
                      ? renderExpectedCompletedSection(veemOrder.expectedArrivalTime, !veemOrder.debitInitiatedTime)
                      : "";
                  }
                }
                const stepNotPassedOrCurrent = !baseStatus.isPassed && !baseStatus.isCurr;
                if (!stepNotPassedOrCurrent && veemOrder.expectedArrivalTime) {
                  return renderExpectedCompletedSection(veemOrder.expectedArrivalTime, !veemOrder.debitInitiatedTime);
                }
                return "";
              })(),
            }}
          >
            {/* Payment confirmation CTA for ACH_DEBIT */}
            {(() => {
              if (isTest || isInvoiceLess || isMobile) return <></>;

              const baseStatus = getStatusParams(
                TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS,
                TRANSACTION_STATES.SKYDO_US_HUB_PENDING
              );
              let shouldShowButton = false;

              if (veemOrder.frozenTill) {
                const currentTime = new Date();
                const frozenTillTime = new Date(veemOrder.frozenTill);
                shouldShowButton = currentTime > frozenTillTime;
              }

              // Also show if transaction state is passed SKYDO_US_HUB_PENDING
              shouldShowButton = shouldShowButton || baseStatus.isPassed;

              return shouldShowButton ? <PCButtonContainer transaction={transaction} /> : <></>;
            })()}
          </TransactionStep>
        </>
      )}

      {/* Veem VEEM_CARDS Step */}
      {veemOrder && veemOrder.method === VeemMethodEnum.VEEM_CARDS && (
        <TransactionStep
          {...{
            isPassed:
              getStatusParams(TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS, TRANSACTION_STATES.SKYDO_US_HUB_PENDING)
                .isPassed || isPaymentDone,
            isCurr:
              getStatusParams(TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS, TRANSACTION_STATES.SKYDO_US_HUB_PENDING)
                .isCurr &&
              veemOrder.status === VeemStatusEnum.COMPLETED &&
              !isPaymentDone,
            isPaymentDone: isPaymentDone,
            isInstantSettlement: isInstantSettlement,
            title: Locale.veemAmountReceivedFromCard,
            subTitle: veemOrder.amountReceivedTime
              ? formatDate(veemOrder.amountReceivedTime, dateFormattingOptions)
              : (() => {
                  const baseStatus = getStatusParams(
                    TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS,
                    TRANSACTION_STATES.SKYDO_US_HUB_PENDING
                  );
                  const passed = baseStatus.isPassed || isPaymentDone;
                  const current = baseStatus.isCurr && veemOrder.status === VeemStatusEnum.COMPLETED && !isPaymentDone;
                  const stepNotPassedOrCurrent = !passed && !current;
                  return stepNotPassedOrCurrent && veemOrder.expectedArrivalTime
                    ? renderExpectedCompletedSection(veemOrder.expectedArrivalTime, false)
                    : "";
                })(),
          }}
        >
          {/* Payment confirmation CTA for VEEM_CARDS */}
          {(() => {
            if (isTest || isInvoiceLess || isMobile) return <></>;

            const baseStatus = getStatusParams(
              TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS,
              TRANSACTION_STATES.SKYDO_US_HUB_PENDING
            );

            // Show if transaction state is passed SKYDO_US_HUB_PENDING OR veemOrder.status === 'COMPLETED'
            const shouldShowButton = baseStatus.isPassed || veemOrder.status === VeemStatusEnum.COMPLETED;

            return shouldShowButton ? <PCButtonContainer transaction={transaction} /> : <></>;
          })()}
        </TransactionStep>
      )}

      {/*TRANSACTION_STATES.SKYDO_US_HUB_SUCCESS */}
      <TransactionStep
        {...{
          ...getStatusParams(TRANSACTION_STATES.SKYDO_US_HUB_SUCCESS, TRANSACTION_STATES.NOSTRO_SENDER_SUCCESS),
          isPaymentDone: isPaymentDone,
          isInstantSettlement: isInstantSettlement,
          title: Locale.skydoUsHub,
          subTitle: formatDate(
            transactionStatusWiseAudit[TRANSACTION_STATES.SKYDO_US_HUB_SUCCESS]?.actionTimestamp,
            dateFormattingOptions
          ),
        }}
      />

      {/*TRANSACTION_STATES.NOSTRO_RECEIVER_SUCCESS */}
      <TransactionStep
        {...{
          ...getStatusParams(TRANSACTION_STATES.NOSTRO_RECEIVER_SUCCESS, TRANSACTION_STATES.NOSTRO_RECEIVER_SUCCESS),
          isPaymentDone: isPaymentDone,
          isInstantSettlement: isInstantSettlement,
          title: Locale.skydoIndHub,
          subTitle: formatDate(
            transactionStatusWiseAudit[TRANSACTION_STATES.NOSTRO_RECEIVER_SUCCESS]?.actionTimestamp,
            dateFormattingOptions
          ),
        }}
      />

      {/*TRANSACTION_STATES.EXPORT_COLLECTION_ACCOUNT_PENDING */}
      <TransactionStep
        {...{
          ...getStatusParams(TRANSACTION_STATES.EXPORT_COLLECTION_ACCOUNT_PENDING, TRANSACTION_STATES.EXPORTER_FAIL),
          transactionId: transactionId,
          isPaymentDone: isPaymentDone,
          isInstantSettlement: isInstantSettlement,
          title: Locale.inrConvert,
          subTitle: isFxDealDone && fxDetails ? formatDate(fxDetails.bookingTimeStamp, dateFormattingOptions) : "",
          dataTour: "invoice_details_fx",
        }}
      >
        <TransactionFxRate
          currency={transactionCurrency}
          transaction={transaction}
          {...{
            ...getStatusParams(TRANSACTION_STATES.EXPORT_COLLECTION_ACCOUNT_PENDING, TRANSACTION_STATES.EXPORTER_FAIL),
          }}
          isFirstPayment={isRefundable}
          isTest={isTest}
          isSez={isSez}
          isInstantSettlement={isInstantSettlement}
          transactionCreationSource={transactionCreationSource}
          invoiceAmount={invoiceAmount}
        />
      </TransactionStep>

      {/*TRANSACTION_STATES.EXPORTER_SUCCESS */}
      <TransactionStep
        {...{
          ...getStatusParams(TRANSACTION_STATES.EXPORTER_SUCCESS, TRANSACTION_STATES.EXPORTER_SUCCESS),
          isPaymentDone: isPaymentDone,
          isInstantSettlement: isInstantSettlement,
          title: getExporterSuccessStepContent(
            getStatusParams(TRANSACTION_STATES.EXPORTER_SUCCESS, TRANSACTION_STATES.EXPORTER_SUCCESS)
          ),
          subTitle: (() => {
            if (transactionStatusWiseAudit[TRANSACTION_STATES.EXPORTER_SUCCESS]?.actionTimestamp) {
              return formatDate(
                transactionStatusWiseAudit[TRANSACTION_STATES.EXPORTER_SUCCESS]?.actionTimestamp,
                dateFormattingOptions
              );
            }
            return expectedSettlement && !isPaymentDone
              ? Locale.expectedMoneyReceived.replace(":time", expectedSettlement)
              : "";
          })(),
          secondarySubTitle: transaction?.dbsSettlement?.localUTR
            ? Locale.utrNumber.replace(":utr", transaction?.dbsSettlement?.localUTR)
            : transaction?.hdfcSettlement?.localUTR
            ? Locale.utrNumber.replace(":utr", transaction?.hdfcSettlement?.localUTR)
            : undefined,
        }}
      >
        {!isMobile &&
        isZohoInvoice &&
        (transaction?.dbsSettlement?.localUTR || transaction?.hdfcSettlement?.localUTR) ? (
          getMarkedAsPaidZoho()
        ) : (
          <></>
        )}
      </TransactionStep>

      {/*Fira and Receipt */}
      <TransactionStep
        {...{
          isPaymentDone: isPaymentDone,
          isInstantSettlement: isInstantSettlement,
          isLast: transaction?.payment?.cashBackRecord?.cashbackProcessState != "SUCCESS",
          isPassed: isPaymentDone,
          title: isEligibleForReceipt ? Locale.firaInvoiceDone : Locale.firaDone,
          subTitle: (() => {
            if (isPaymentDone) {
              const firaTime = fira?.createdAt ? new Date(fira?.createdAt) : new Date();
              let finalTime = firaTime;
              if (isEligibleForReceipt) {
                const skydoReceiptTime = skydoReceipt?.receiptDate ? new Date(skydoReceipt?.receiptDate) : new Date();
                finalTime = firaTime < skydoReceiptTime ? skydoReceiptTime : firaTime;
              }
              return formatDate(String(finalTime), dateFormattingOptions);
            }
            return "";
          })(),
        }}
      >
        {isZohoInvoice && isPaymentDone ? getFiraUploadedToZoho() : <></>}
      </TransactionStep>

      {/*Cashback */}
      {transaction?.payment?.cashBackRecord?.cashbackProcessState == "SUCCESS" ? (
        <TransactionStep
          {...{
            isActive: !!transactionId,
            isPaymentDone: isRefunded,
            isLast: true,
            title: getExporterRefundStepContent(isRefunded, isApportioned, formatedTotalSkydoCharges),
          }}
        >
          <div className={"flex-col md:ml-10 ml-6"}>
            {isRefunded ? (
              <div className={"flex-col"}>
                {!isMobile && isApportioned ? (
                  <TextCTA
                    text={Locale.viewRefundDetails}
                    onClick={onViewRefundClick}
                    href={paymentDetailsLink}
                    typographyStyle={"cursor-pointer !text-blue-400 underline"}
                  />
                ) : null}
                <div>
                  <Typography
                    text={Locale.utrNumber.replace(":utr", cashbackUtr)}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500 mt-1"}
                  />
                </div>
                <div>
                  <Typography
                    text={formatDate(cashBackSettlementDate, dateFormattingOptions)}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500 mt-1"}
                  />
                </div>
                <div
                  className={classNames("", {
                    hidden: isMobile,
                  })}
                >
                  <Typography
                    text={
                      cashbackReason === CashbackReasonType.REFERRER_CASHBACK ||
                      cashbackReason === CashbackReasonType.REFEREE_CASHBACK
                        ? Locale.refundDoneSubTitleWithReason.replace(":reason", "referral reward")
                        : cashbackReason === CashbackReasonType.ACTIVATION_REWARD
                        ? Locale.refundDoneSubTitleWithReason.replace(":reason", "first payment")
                        : Locale.refundDoneSubTitle
                            .replace("${importerName}", importerName)
                            .replace("${refundReason}", refundReason)
                    }
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500 mt-1 mr-1"}
                  />
                  <TextCTA
                    text={Locale.here}
                    typographyType={TYPOGRAPHY_TYPES.PARA}
                    typographySize={TYPOGRAPHY_SIZES.SMALL}
                    onClick={creditNoteDownloadClick}
                    href={paymentDetailsLink}
                    typographyStyle={"cursor-pointer !text-blue-400 underline"}
                  />
                </div>
              </div>
            ) : (
              <>
                <Typography
                  text={getPendingCashbackTitle()}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-500 mt-1"}
                />
              </>
            )}
          </div>
        </TransactionStep>
      ) : null}
      {!isMobile && isPaymentDone && isLast && !isTest && (!isRefundable || isRefunded) ? (
        <TransactionTrackerNps />
      ) : null}
    </div>
  );
};

export default TransactionTracker;
