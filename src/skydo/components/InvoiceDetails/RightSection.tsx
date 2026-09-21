import {
  Invoice,
  InvoiceInstantSettlementEligibilityState,
  MarkFullyPaidReason,
  Transaction,
  TransactionSettlementPaymentMethod,
} from "../../types";

import { findIfSkydoInvoiceFromPaymentProcessor, isRejected, isUnparsed } from "../../util/functions";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { INVOICE_STATUS } from "../../constants/dashboardConstants";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classNames from "classnames";
import { useRouter } from "next/router";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import TransactionComponent from "./Transaction";
import { useContext, useEffect, useState } from "react";
import { UserDetailsContext } from "../DashboardContainer";
import dynamic from "next/dynamic";
import usePaymentConfirmationStore from "../../store/usePaymentConfirmationStore";
import { useTour } from "@reactour/tour";
import { SYSTEM_GENERATED } from "../../store/useDashboardVersionStore";
import Button from "../AtomicComponents/Button";
import InstantSettlementPopup from "../InstantSettlementPopup";
import InstantSettlementPopupMobile from "../InstantSettlementPopupMobile";
import InstantSettlementInfoPopup from "../InstantSettlementPopup/InstantSettlementInfoPopup";
import useMobileVersionHook from "../Common/useMobileVersionHook";
import { Tooltip as TippyTooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import BalanceInvoiceSummaryCard from "./BalanceInvoiceSummaryCard";
import type { BalanceInvoiceSummaryResponse, BalanceInvoiceSummaryResult } from "../../types/SkydoBalance";
import { hasBalanceInvoiceMasterFunding } from "../../util/balanceInvoiceSummary";
import ActionableCtaOnTransaction from "./ActionableCtaOnTransaction";
import RemainderMarkedAsFullyPaidNote from "./RemainderMarkedAsFullyPaidNote";
import RemainderPaidOutsideCard from "./RemainderPaidOutsideCard";
import useVideoKycStore from "../../store/useVideoKycStore";
import useExporterAndExporterUserStore from "../../store/useExporterAndExporterUserStore";
import { McaDocStatus } from "../../types/Exporter/ExporterUser";
import invoice_details from "../../pages/api/route/invoice_details";

const PreKycInvoiceRightSection = dynamic(() => import("./PreKycInvoiceRightSection"), {});

interface Props {
  invoiceData: Invoice;
  isUnparsed: boolean;
  onInvoiceDataRefetch?: () => void;
  onSettlementInitiated?: () => void;
  showSettlementBanner?: boolean;
  balanceSummaryData: BalanceInvoiceSummaryResponse | null;
  balanceSummary: BalanceInvoiceSummaryResult;
  balanceSummaryLoading: boolean;
}

/*
Considering invoice in progress if invoice status is INfo awaited and transaction has started
 */

const RightSection = (props: Props) => {
  const { isMobile } = useMobileVersionHook();
  const { showSettlementBanner } = props;
  // console.log('showSettlementBanner inside right section:', showSettlementBanner);
  const {
    amount,
    status,
    transaction,
    reasonToArchive,
    purposeCode,
    exporterSystemInvoiceId,
    paymentProcessor,
    invoiceMetadata,
    bankAccount,
    currency,
    isRefundable,
    importer,
    isTest,
    readyToTransact,
    expectedAmount,
    amountMapped,
    activationRewardOnInvoice,
  } = props.invoiceData;

  const isInvoiceLess = invoiceMetadata?.source == SYSTEM_GENERATED;

  const noTransactionTrackerAmount = expectedAmount - amountMapped || amount;

  const { setInvoiceData } = usePaymentConfirmationStore();
  useEffect(() => {
    setInvoiceData(props.invoiceData);
    return () => {
      setInvoiceData({} as Invoice);
    };
  }, [props.invoiceData, setInvoiceData]);

  const router = useRouter();
  const analytics = useAnalytics();
  const { balanceSummaryData, balanceSummary, balanceSummaryLoading } = props;

  const showBalanceInvoiceSummary = hasBalanceInvoiceMasterFunding(balanceSummaryData);
  const shouldRenderFallbackTracker = !showBalanceInvoiceSummary && !balanceSummaryLoading;
  const isSkydoInvoice = findIfSkydoInvoiceFromPaymentProcessor(paymentProcessor);
  const showRemainderPaidOutsideCard =
    invoiceMetadata?.markFullyPaidReason === MarkFullyPaidReason.REMAINDER_PAID_OUTSIDE &&
    invoiceMetadata?.remainderAmount != null &&
    invoiceMetadata?.remainderCurrency != null;
  const totalTransactions = (transaction?.length || 0) + (showRemainderPaidOutsideCard ? 1 : 0);
  const { exporterDetails } = useContext(UserDetailsContext);
  const { isVideoKycDone } = useVideoKycStore();
  const { exporter = {} } = useExporterAndExporterUserStore();
  const { mcaDocStatus } = exporter;
  const { isOpen } = useTour();
  const [isSettleNowPopupOpen, setIsSettleNowPopupOpen] = useState(false);
  const [infoPopupType, setInfoPopupType] = useState<"unavailable" | "already_initiated" | "already_settled" | null>(
    null
  );
  const [isSettlementTooltipOpen, setIsSettlementTooltipOpen] = useState(false);

  const isPCRequired = !purposeCode?.code && !props.isUnparsed && isSkydoInvoice;
  const vkycNeeded = !isVideoKycDone && isSkydoInvoice;
  const isMcaDocsBlockVisible =
    (mcaDocStatus === McaDocStatus.REQUIRED || mcaDocStatus === McaDocStatus.UNDER_REVIEW) && isSkydoInvoice;
  const hasSummaryActionable = vkycNeeded || isPCRequired || isMcaDocsBlockVisible;
  const senderAlertRows = balanceSummary.senderAlertRows ?? [];
  const hasBalanceSummarySenderAlerts = senderAlertRows.length > 0;

  const isUnpaidInvoice =
    status === INVOICE_STATUS.UNPAID ||
    isUnparsed(status) ||
    status === INVOICE_STATUS.READY_TO_TRANSACT ||
    status == INVOICE_STATUS.INFO_AWAITED;

  const onAddPCClick = () => {
    analytics.trackAsync(Events.ADD_INVOICE_PC_CLICK);

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        openPurposeCodePopup: true,
        exporterSystemInvoiceId,
        isDefault: true,
      },
    });
  };

  const renderTransactionTracker = ({
    transaction,
    key,
    isVisible,
    index,
    isLast,
  }: {
    transaction?: Transaction;
    key?: string;
    isVisible: boolean;
    index?: number;
    isLast: boolean;
  }) => {
    // Check if this is an instant settlement
    const isInstantSettlement = (props.invoiceData as any)?.isInstantSettlement === true;
    // console.log('🎨 RightSection - isInstantSettlement:', isInstantSettlement, 'invoiceData:', (props.invoiceData as any)?.isInstantSettlement);

    return (
      <TransactionComponent
        invoiceMetadata={invoiceMetadata}
        isSkydoInvoice={isSkydoInvoice}
        isPCRequired={isPCRequired}
        onAddPCClick={onAddPCClick}
        isUnpaidInvoice={isUnpaidInvoice}
        reasonToArchive={reasonToArchive}
        invoiceStatus={status}
        bankAccount={bankAccount}
        invoiceCurrency={currency}
        invoiceAmount={noTransactionTrackerAmount}
        invoiceAmountMapped={amountMapped}
        key={key}
        transaction={transaction}
        isVisible={isVisible}
        totalTransactions={totalTransactions}
        isInstantSettlement={isInstantSettlement}
        index={index}
        isRefundable={isRefundable}
        importer={importer}
        isTest={isTest}
        readyToTransact={readyToTransact}
        isLast={isLast}
        isInvoiceLess={isInvoiceLess}
        showUserActionables={!showBalanceInvoiceSummary}
      />
    );
  };

  /**
   * emptying transaction array if readyToTransact is false in case of test transaction
   */
  const sortedTransaction =
    isTest && readyToTransact === false
      ? null
      : transaction?.sort((a, b) => {
          // If one transaction is rejected and the other is not, put rejected last
          if (isRejected(a.transactionState) && !isRejected(b.transactionState)) {
            return 1;
          }
          if (isRejected(b.transactionState) && !isRejected(a.transactionState)) {
            return -1;
          }
          // Otherwise sort by id
          return a.id - b.id;
        });

  const singlePayment = !sortedTransaction || (sortedTransaction?.length && sortedTransaction?.length == 1);

  // Get settlement state from API data (same logic as PaymentsTable)
  const getSettlementState = (invoice: Invoice): "settle_now" | "in_progress" | "instant_settlement" | null => {
    // Use API data if available
    if (invoice.invoiceInstantSettlementDetails?.eligibilityState) {
      const eligibilityState = invoice.invoiceInstantSettlementDetails.eligibilityState;

      switch (eligibilityState) {
        case InvoiceInstantSettlementEligibilityState.IN_PROGRESS:
          return "in_progress";
        case InvoiceInstantSettlementEligibilityState.ELIGIBLE:
          return "settle_now";
        case InvoiceInstantSettlementEligibilityState.SETTLED:
          return "instant_settlement";
        case InvoiceInstantSettlementEligibilityState.NOT_ELIGIBLE:
        default:
          return null;
      }
    }
    return null;
  };

  const settlementState = getSettlementState(props.invoiceData);

  // Check if popup should be opened from URL query parameter
  useEffect(() => {
    if (router.isReady && router.query.openSettleNow === "true") {
      console.log("🔗 URL parameter detected - openSettleNow=true", {
        settlementState,
        invoiceId: props.invoiceData.id,
        routerReady: router.isReady,
        eligibilityState: props.invoiceData.invoiceInstantSettlementDetails?.eligibilityState,
      });

      if (settlementState === "settle_now") {
        console.log("✅ Opening settle now popup from URL");
        setIsSettleNowPopupOpen(true);
        const pricingPercentage =
          (props.invoiceData.invoiceInstantSettlementDetails?.data?.instantSettlementPricingPercentage ?? 0.01) * 100;
        analytics?.trackAsync(Events.INSTANT_SETTLEMENT.SETTLE_CLICK, { source: "invoice_details", pricingPercentage });
        // Clean up the query parameter from URL after opening
        const { openSettleNow, ...restQuery } = router.query;
        router.replace(
          {
            pathname: router.pathname,
            query: restQuery,
          },
          undefined,
          { shallow: true }
        );
      } else {
        // Show appropriate info popup based on state
        const eligibilityState = props.invoiceData.invoiceInstantSettlementDetails?.eligibilityState;
        if (eligibilityState === InvoiceInstantSettlementEligibilityState.IN_PROGRESS) {
          setInfoPopupType("already_initiated");
        } else if (eligibilityState === InvoiceInstantSettlementEligibilityState.SETTLED) {
          setInfoPopupType("already_settled");
        } else {
          setInfoPopupType("unavailable");
        }

        // Clean up the query parameter from URL
        const { openSettleNow, ...restQuery } = router.query;
        router.replace(
          {
            pathname: router.pathname,
            query: restQuery,
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [router.isReady, router.query.openSettleNow, settlementState, router, props.invoiceData]);

  const handleSettleNowClick = () => {
    // Check eligibility before opening popup
    const eligibilityState = props.invoiceData.invoiceInstantSettlementDetails?.eligibilityState;

    if (eligibilityState === InvoiceInstantSettlementEligibilityState.ELIGIBLE) {
      setIsSettleNowPopupOpen(true);
      const pricingPercentage =
        (props.invoiceData.invoiceInstantSettlementDetails?.data?.instantSettlementPricingPercentage ?? 0.01) * 100;
      analytics?.trackAsync(Events.INSTANT_SETTLEMENT.SETTLE_CLICK, { source: "invoice_details", pricingPercentage });
    } else if (eligibilityState === InvoiceInstantSettlementEligibilityState.IN_PROGRESS) {
      setInfoPopupType("already_initiated");
    } else if (eligibilityState === InvoiceInstantSettlementEligibilityState.SETTLED) {
      setInfoPopupType("already_settled");
    } else {
      setInfoPopupType("unavailable");
    }
  };

  const handleSettleNow = () => {
    // Refetch invoice data after successful settlement
    // The actual API call is handled in InstantSettlementPopup component
    if (props.onInvoiceDataRefetch) {
      // Add a small delay to allow backend to process the settlement
      setTimeout(() => {
        props.onInvoiceDataRefetch?.();
      }, 1000);
    }
  };

  // Render button based on settlement state
  const getButtonConfig = () => {
    if (!settlementState) return null;

    switch (settlementState) {
      case "in_progress":
        return {
          title: "Settling now..",
          isDisabled: true,
          showIcon: false,
          gradient: "#EEF3FE", // Primary-Primary50 background
        };
      case "instant_settlement":
        return {
          title: "Instant Settlement",
          isDisabled: true,
          showIcon: true,
          gradient: "#FFFFFF", // White background
        };
      case "settle_now":
      default:
        return {
          title: "Settle Now",
          isDisabled: false,
          showIcon: true,
          gradient:
            "linear-gradient(180deg, #276EF1 6.65%, #163F8B 159.85%), linear-gradient(283deg, #D2E0FF 6.45%, #F4F8FF 57.12%, #D2E0FF 101.63%)", // Dual gradient background
        };
    }
  };

  const buttonConfig = getButtonConfig();

  // Get settlement method and time text for settle_now state
  const settlementMethod =
    props.invoiceData.invoiceInstantSettlementDetails?.data?.settlementMethod ||
    TransactionSettlementPaymentMethod.IMPS;
  const settlementTimeText = props.invoiceData.invoiceInstantSettlementDetails?.bufferRequired
    ? "1 hour"
    : settlementMethod === TransactionSettlementPaymentMethod.IMPS
    ? "60 seconds"
    : "20 minutes";

  const settlementMethodPosInitiation =
    props.invoiceData.invoiceInstantSettlementDetails?.settlementMethodInCaseOfInitiatedInstantSettlement ||
    TransactionSettlementPaymentMethod.IMPS;
  const settlementTimeTextPostInitiation = props.invoiceData.invoiceInstantSettlementDetails?.bufferRequired
    ? "1 hour"
    : settlementMethodPosInitiation === TransactionSettlementPaymentMethod.IMPS
    ? "60 seconds"
    : "20 minutes";

  return (
    <div className={classNames("bg-white pt-6 md:ml-4 mt-3 md:mt-0 flex-1 h-fit rounded-10px")}>
      <div
        className={
          "md:pb-6 pb-4 bottom-b border-b border-black-100 md:border-none flex flex-row justify-between items-center md:px-6 px-4"
        }
      >
        <div className="flex flex-col">
          <Typography
            text={singlePayment ? "Payment" : Locale.paymentsTitle}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.LARGE}
          >
            <Typography
              text={sortedTransaction?.length && sortedTransaction?.length > 1 ? ` (${sortedTransaction.length})` : ""}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!text-black-500 md:hidden"}
            />
          </Typography>
        </div>
        {buttonConfig &&
          settlementState !== "in_progress" &&
          settlementState !== "settle_now" &&
          !showSettlementBanner &&
          (settlementState === "instant_settlement" ? (
            <div
              style={{
                background: "linear-gradient(90deg, #276EF1 0%, #FFFFFF 80%)",
                borderRadius: "60px",
                padding: "1px",
              }}
            >
              <Button
                title={buttonConfig.title}
                type={BUTTON_TYPES.PRIMARY}
                size={isMobile ? BUTTON_SIZES.X_SMALL : BUTTON_SIZES.SMALL}
                isDisabled={buttonConfig.isDisabled}
                onButtonClick={buttonConfig.isDisabled ? () => {} : handleSettleNowClick}
                nativeType="button"
                buttonClass="whitespace-nowrap overflow-hidden instant-settlement-white-btn"
                textProps={
                  {
                    fontFamily: "Lato",
                    fontSize: isMobile ? "10px" : "12px",
                    fontStyle: "italic",
                    fontWeight: "700",
                    lineHeight: isMobile ? "16px" : "20px",
                    color: "#276EF1",
                    marginLeft: "-4px",
                  } as any
                }
                buttonProps={{
                  style: {
                    background: "#FFFFFF",
                    borderRadius: "60px",
                    border: "none",
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    ...(isMobile
                      ? {
                          height: "29px",
                          paddingTop: "4px",
                          paddingBottom: "4px",
                        }
                      : {}),
                  },
                }}
                leftIcon={
                  buttonConfig.showIcon
                    ? () => {
                        return (
                          <div
                            className={classNames("flex justify-center", isMobile ? "w-4 h-4 -ml-2" : "w-6 h-6 -ml-2")}
                          >
                            <img
                              src="/images/skydoInstantSettle.png"
                              alt="Instant Settlement"
                              width={isMobile ? 16 : 24}
                              height={isMobile ? 16 : 24}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        );
                      }
                    : undefined
                }
              />
            </div>
          ) : (
            <></>
          ))}
      </div>
      {settlementState === "in_progress" && (
        <div
          className={classNames(
            "mt-1 flex flex-col items-start gap-[10px] px-4 py-3 rounded-[10px] bg-[#EEF3FE]",
            isMobile ? "m-[18px] mt-[18px]" : "m-6"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src="/images/skydoInstantSettle.png"
                alt="Settling payment"
                width={16}
                height={16}
                style={{ objectFit: "contain" }}
              />
              <Typography
                text={`Settling your payment in ${settlementTimeTextPostInitiation}`}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="font-medium"
                textProps={{
                  style: {
                    background: "linear-gradient(88deg, #2B43A1 -16.21%, #276EF1 108.98%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  } as any,
                }}
              />
            </div>
            <div
              className="settling-loader"
              style={{
                width: "32px",
                height: "12px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: "0px",
                  animation: "settlingDot1 1s infinite linear alternate",
                }}
              />
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: "12px",
                  animation: "settlingDot2 1s infinite linear alternate",
                  animationDelay: "0.33s",
                }}
              />
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: "24px",
                  animation: "settlingDot3 1s infinite linear alternate",
                  animationDelay: "0.66s",
                }}
              />
            </div>
            <style jsx>{`
              @keyframes settlingDot1 {
                0% {
                  background: #276ef1;
                }
                50% {
                  background: rgba(39, 110, 241, 0.3);
                }
                100% {
                  background: #276ef1;
                }
              }

              @keyframes settlingDot2 {
                0% {
                  background: rgba(39, 110, 241, 0.3);
                }
                50% {
                  background: #276ef1;
                }
                100% {
                  background: rgba(39, 110, 241, 0.3);
                }
              }

              @keyframes settlingDot3 {
                0% {
                  background: rgba(39, 110, 241, 0.3);
                }
                50% {
                  background: rgba(39, 110, 241, 0.3);
                }
                100% {
                  background: #276ef1;
                }
              }
            `}</style>
          </div>
        </div>
      )}
      {settlementState === "settle_now" && !isMobile && (
        <div className="mt-1 flex flex-row items-center justify-between gap-[10px] px-4 py-3 rounded-[10px] bg-[#EEF3FE] mt-6 mb-4 ml-6 mr-6">
          <div className="flex items-center gap-2">
            <img
              src="/images/instantSettlementPaymentTrackerTop.png"
              alt="Instant Settlement"
              width={20}
              height={20}
              style={{ objectFit: "contain" }}
            />
            <Typography
              text={`Settle your payment in ${settlementTimeText}`}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses="!text-[#276EF1] !font-bold"
            />
          </div>
          <Button
            title={Locale.tryInstantSettlement}
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            isDisabled={false}
            onButtonClick={handleSettleNowClick}
            nativeType="button"
            buttonClass="whitespace-nowrap"
            textProps={
              {
                fontFamily: "Lato",
                fontSize: "14px",
                fontWeight: "700",
                lineHeight: "20px",
                color: "#276EF1",
              } as any
            }
            buttonProps={{
              style: {
                display: "flex",
                padding: "8px 16px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                borderRadius: "10px",
                border: "1px solid var(--Primary-Primary300, #276EF1)",
                background: "var(--Neutral-Neutral0, #FFF)",
              },
            }}
          />
        </div>
      )}
      {settlementState === "settle_now" && isMobile && (
        <div
          className={classNames(
            "mt-1 flex flex-row items-center justify-between gap-[10px] px-4 py-3 rounded-[10px] bg-[#EEF3FE]",
            "m-[18px] mt-[18px]"
          )}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <img
              src="/images/instantSettlementPaymentTrackerTop.png"
              alt="Instant Settlement"
              width={20}
              height={20}
              style={{ objectFit: "contain", flexShrink: 0 }}
            />
            {/* @ts-ignore */}
            <TippyTooltip
              html={<div className="p-2 text-sm">{`${settlementTimeText} settlement`}</div>}
              position="top"
              trigger="click"
              interactive={true}
              arrow={true}
              theme="light"
              open={isSettlementTooltipOpen}
              onRequestClose={() => setIsSettlementTooltipOpen(false)}
              style={{ minWidth: 0, overflow: "hidden", flex: 1 }}
            >
              <div className="cursor-pointer" onClick={() => setIsSettlementTooltipOpen(!isSettlementTooltipOpen)}>
                <Typography
                  text={`${settlementTimeText} settlement`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-[#276EF1] !font-bold"
                  textProps={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                />
              </div>
            </TippyTooltip>
          </div>
          <Button
            title={Locale.tryInstantSettlement}
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            isDisabled={false}
            onButtonClick={handleSettleNowClick}
            nativeType="button"
            buttonClass="whitespace-nowrap flex-shrink-0"
            textProps={
              {
                fontFamily: "Lato",
                fontSize: "12px",
                fontWeight: "600",
                lineHeight: "16px",
                color: "#276EF1",
              } as any
            }
            buttonProps={{
              style: {
                display: "flex",
                padding: "8px 16px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                borderRadius: "10px",
                border: "1px solid var(--Primary-Primary300, #276EF1)",
                background: "var(--Neutral-Neutral0, #FFF)",
                flexShrink: 0,
              },
            }}
          />
        </div>
      )}
      {/* Settlement Banner - Show when state first changes from IN_PROGRESS to SETTLED */}
      {showSettlementBanner && !isMobile && settlementState === "instant_settlement" && (
        <div className="mx-6 mb-4 flex items-center justify-between px-4 py-3 rounded-[10px] bg-[#EEF3FE]">
          <div className="flex items-center gap-2">
            <img
              src="/images/skydoInstantSettle.png"
              alt="Instant Settlement"
              width={20}
              height={20}
              style={{ objectFit: "contain" }}
            />
            <Typography
              text="Payment settled instantly!"
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses="!text-[#276EF1] !font-bold"
            />
          </div>
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
              <circle
                cx="8.33398"
                cy="8.33398"
                r="7.5"
                fill="#276EF1"
                stroke="#276EF1"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.2727 5.83398L7.27273 10.834L5 8.56126"
                stroke="white"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
      {showSettlementBanner && isMobile && settlementState === "instant_settlement" && (
        <div className="m-[18px] mb-4 flex items-center justify-between px-4 py-3 rounded-[10px] bg-[#EEF3FE]">
          <div className="flex items-center gap-2">
            <img
              src="/images/skydoInstantSettle.png"
              alt="Instant Settlement"
              width={14}
              height={14}
              style={{ objectFit: "contain" }}
            />
            <Typography
              text="Payment settled instantly!"
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses="!text-[#276EF1] !font-bold"
            />
          </div>
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle
                cx="6.66602"
                cy="6.66699"
                r="6"
                fill="#276EF1"
                stroke="#276EF1"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.81818 4.66699L5.81818 8.66699L4 6.84881"
                stroke="white"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
      {showBalanceInvoiceSummary && (
        <div className={classNames(isMobile ? "mx-[18px] mt-4 mb-4 pb-4" : "mx-6 mt-4 mb-4")}>
          {hasSummaryActionable || hasBalanceSummarySenderAlerts ? (
            <div className={classNames("flex flex-col gap-4", isMobile ? "mt-4" : "-mt-4")}>
              {hasBalanceSummarySenderAlerts
                ? senderAlertRows.map((row) => {
                    const { senderAlertDetails: senderDetails } = row;
                    return (
                      <ActionableCtaOnTransaction
                        key={`${row.masterFundingVerificationId}-${senderDetails.caseId}`}
                        balanceSummarySenderRowOnly
                        importer={importer}
                        senderAlertDetails={senderDetails}
                        transactionAmount={row.amount}
                        transactionCurrency={row.currency}
                        transactionReceivedOnTimestamp={row.creationTimestamp || undefined}
                        standaloneRounded
                      />
                    );
                  })
                : null}
              {hasSummaryActionable ? (
                <ActionableCtaOnTransaction
                  vkycNeeded={vkycNeeded}
                  isPCRequired={isPCRequired}
                  onAddPCClick={onAddPCClick}
                  importer={importer}
                  isSkydoInvoice={isSkydoInvoice}
                  invoiceAmount={noTransactionTrackerAmount}
                  invoiceAmountMapped={amountMapped}
                  transactionCurrency={currency}
                  standaloneRounded
                />
              ) : null}
              <BalanceInvoiceSummaryCard
                summary={balanceSummary}
                bankAccount={bankAccount}
                loading={balanceSummaryLoading}
              />
            </div>
          ) : (
            <BalanceInvoiceSummaryCard
              summary={balanceSummary}
              bankAccount={bankAccount}
              loading={balanceSummaryLoading}
            />
          )}
        </div>
      )}
      {sortedTransaction && sortedTransaction.length != 0
        ? sortedTransaction.map((txn, index: number) => {
            const lastNonRejectedIndex = sortedTransaction
              .map((t) => !isRejected(t.transactionState))
              .lastIndexOf(true);
            const isVisible =
              lastNonRejectedIndex >= 0 ? index === lastNonRejectedIndex : index === sortedTransaction.length - 1;

            return renderTransactionTracker({
              transaction: txn,
              key: String(txn.id),
              isVisible,
              index: index + 1,
              isLast: index == sortedTransaction.length - 1,
            });
          })
        : shouldRenderFallbackTracker
        ? renderTransactionTracker({ isVisible: true, isLast: true })
        : null}
      {showRemainderPaidOutsideCard && (
        <RemainderPaidOutsideCard
          index={totalTransactions}
          totalTransactions={totalTransactions}
          remainderAmount={invoiceMetadata!.remainderAmount!}
          remainderCurrency={invoiceMetadata!.remainderCurrency!}
          paymentDate={invoiceMetadata?.paymentDate}
        />
      )}
      {
        invoiceMetadata?.markFullyPaidReason === MarkFullyPaidReason.NO_FURTHER_PAYMENT &&
        invoiceMetadata?.remainderAmount != null &&
        invoiceMetadata?.remainderCurrency != null && (
          <RemainderMarkedAsFullyPaidNote
            remainderAmount={invoiceMetadata.remainderAmount}
            remainderCurrency={invoiceMetadata.remainderCurrency}
            paymentDate={invoiceMetadata.paymentDate}
          />
        )}
      {isMobile ? (
        <InstantSettlementPopupMobile
          isOpen={isSettleNowPopupOpen}
          onClose={() => setIsSettleNowPopupOpen(false)}
          invoice={props.invoiceData}
          onSettleNow={handleSettleNow}
          onSettlementInitiated={props.onSettlementInitiated}
        />
      ) : (
        <InstantSettlementPopup
          isOpen={isSettleNowPopupOpen}
          onClose={() => setIsSettleNowPopupOpen(false)}
          invoice={props.invoiceData}
          onSettleNow={handleSettleNow}
          onSettlementInitiated={props.onSettlementInitiated}
        />
      )}
      {infoPopupType && (
        <InstantSettlementInfoPopup
          isOpen={!!infoPopupType}
          onClose={() => setInfoPopupType(null)}
          type={infoPopupType}
        />
      )}
    </div>
  );
};

export default RightSection;
