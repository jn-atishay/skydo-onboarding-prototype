import {useRouter} from "next/router";
import {useContext, useEffect, useState, useCallback, useRef} from "react";
import { Invoice, InvoiceInstantSettlementEligibilityState } from "../../types";
import useDashboardVersionStore from "../../store/useDashboardVersionStore";
import useToastMessages from "../../store/toastMessages";
import AppContext from "../../context/AppContext";
import useAnalytics from "../../analytics/useAnalytics";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import {ALLOWED_METHODS} from "../../constants/apiConstants";
import {ResponseWrapper} from "../../authentication/api/AuthApiDto";
import {Events} from "../../analytics/EventConstants";
import {getInvoiceStatusWiseColorTextMapping} from "../../util/functions";
import * as R from "remeda";
import FE_ROUTES from "../../util/feRoutes";
import Locale from "../../util/locale/en";
import { TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import PaymentDetailsHeaderMobile from "./PaymentDetailsHeaderMobile";
import RightSection from "../../components/InvoiceDetails/RightSection";
import Notes from "../../components/AtomicComponents/Notes";
import Typography from "../../components/AtomicComponents/Typography";
import TextCTA from "../../components/AtomicComponents/TextCTA";
import { formatIncomingCurrency, formatIncomingCurrencyWithNumber } from "../../util/formatters";
import BottomSheet from "../../components/AtomicComponents/BottomSheet";
import SettlementSuccessPopup from "../../components/InstantSettlementPopup/SettlementSuccessPopup";
import { isInvoiceEligibleForInstantSettlementEvent } from "../../util/instantSettlementUtil";
import { getInvoiceLessPaymentDisplayId } from "../../util/transactionHelpers";
import RightArrowIcon from "../../components/Icons/RightArrowIcon";
import { PROOF_SUBMITTED } from "../../constants/customeEvents";
import { useBalanceInvoiceSummary } from "../../hooks/useBalanceInvoiceSummary";

const RecentPaymentDetailsMobile = () => {

  const router = useRouter();
  const { addToast } = useToastMessages();
  const { theme } = useContext(AppContext);
  const analytics = useAnalytics();

  const isInvoiceBased = router.pathname == FE_ROUTES.INVOICE_DETAILS;
  const isInvoiceLessBased = router.pathname == FE_ROUTES.PAYMENT_DETAILS;

  if(!isInvoiceBased && !isInvoiceLessBased) {
    router.push(FE_ROUTES.DASHBOARD);
  }

  const invoiceId = router.query["invoice_id"] || router.query["payment_id"];
  const isTest = invoiceId == "test";

  const {
    data: balanceSummaryData,
    summary: balanceSummary,
    loading: balanceSummaryLoading,
  } = useBalanceInvoiceSummary(invoiceId as string | string[] | undefined);

  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const previousEligibilityStateRef = useRef<string | undefined>(undefined);
  const [showSettlementSuccessPopup, setShowSettlementSuccessPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSettlementBanner, setShowSettlementBanner] = useState(false);

  const { fetchDashboardVersionData } = useDashboardVersionStore();

  const onFetchData = (response: ResponseWrapper<any>) => {
    const invoiceDataLocal = response.data;
    const { invoiceId, invoiceType } = invoiceDataLocal;
    if (invoiceData == null) {
      const isISEligibleEvent = isInvoiceEligibleForInstantSettlementEvent(invoiceDataLocal)
      analytics?.page("page_view", router.pathname, {
        instant_settlement_eligible: isISEligibleEvent,
      })
      analytics?.trackAsync(Events.INVOICE_DETAILS_PAGE, {
        invoice_status: invoiceDataLocal?.status,
        settlement_status_is_inProgress: getInvoiceStatusWiseColorTextMapping(invoiceDataLocal as Invoice, theme)
          .isInprogress,
        invoice_id: invoiceId,
      });
      if (!(R.isObject(invoiceDataLocal) && Object.keys(invoiceDataLocal).length > 0)) {
        void router.push(FE_ROUTES.DASHBOARD);
        return;
      }
    }

    // Check for state transition from IN_PROGRESS to SETTLED
    const currentEligibilityState = invoiceDataLocal?.invoiceInstantSettlementDetails?.eligibilityState;
    const previousEligibilityState = previousEligibilityStateRef.current;
    console.log('saur:', previousEligibilityState, currentEligibilityState);
    console.log('invoiceData:', invoiceData);
    if (
      previousEligibilityState === "IN_PROGRESS" &&
      currentEligibilityState === "SETTLED" 
    ) {
      console.log('🎉 Mobile Details: Settlement completed! Showing confetti and popup');
      setShowConfetti(true);
      setShowSettlementSuccessPopup(true);
      setShowSettlementBanner(true); // Show banner in RightSection
      console.log('✅ Mobile: Setting showSettlementBanner to TRUE');
      
      // Hide confetti after animation completes (2 seconds)
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }

    // Update previous state ref
    previousEligibilityStateRef.current = currentEligibilityState;
    setInvoiceData(invoiceDataLocal);
  };

  const onFetchError = () => {
    addToast({
      id: "fetch_error",
      body: Locale.wentWrongMessage,
      type: TOAST_TYPES.ERROR,
    });
  };

  const fetchInvoiceData = useCallback(() => {
    void beCall({
      url: BE_ROUTES.FETCH_INVOICE_DETAILS,
      method: ALLOWED_METHODS.POST,
      body: {
        isUnparsed: false,
        isTest: isTest,
        invoiceId: invoiceId,
      },
      onSuccess: onFetchData,
      onError: onFetchError,
    });
  }, [invoiceId, isTest]);

  const handleSettlementInitiated = useCallback(() => {
    // Show success popup immediately after initial popup closes
    console.log('🎉 Mobile Details: Settlement initiated! Showing success popup');
    if (invoiceData) {
      
      // Hide confetti after animation completes (2 seconds)
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }
  }, [invoiceData]);

  useEffect(() => {
    fetchInvoiceData();
    fetchDashboardVersionData();
  }, [invoiceId]);

  useEffect(() => {
    const onProofSubmitted = () => {
      fetchInvoiceData();
    };
    document.addEventListener(PROOF_SUBMITTED, onProofSubmitted);
    return () => {
      document.removeEventListener(PROOF_SUBMITTED, onProofSubmitted);
    };
  }, [fetchInvoiceData]);

  // Initialize previous state ref when invoiceData is first loaded (same as desktop)
  useEffect(() => {
    if (invoiceData && previousEligibilityStateRef.current === undefined) {
      previousEligibilityStateRef.current = invoiceData.invoiceInstantSettlementDetails?.eligibilityState;
    }
  }, [invoiceData]);

  // Continuous polling for instant settlement in IN_PROGRESS state (same as desktop view)
  useEffect(() => {
    if (!invoiceData) {
      return;
    }

    const eligibilityState = invoiceData.invoiceInstantSettlementDetails?.eligibilityState;
    const isInstantSettlementInProgress = 
      eligibilityState === "IN_PROGRESS";

    if (!isInstantSettlementInProgress) {
      return;
    }

    // Get settlement method from invoiceInstantSettlementDetails.data.settlementMethod
    const settlementMethod = invoiceData?.invoiceInstantSettlementDetails?.data?.settlementMethod || 
                             "IMPS"; // Default to IMPS if not available

    // Determine polling interval based on settlement method
    console.log('🔄 Mobile Details: Settlement method:', settlementMethod);
    const pollingInterval = settlementMethod === "RTGS" 
      ? 10 * 60 * 1000  // 10 minutes for RTGS
      : 30 * 1000;       // 30 seconds for IMPS (default)

    console.log('🔄 Mobile Details: Setting up instant settlement polling:', {
      settlementMethod,
      pollingInterval: pollingInterval / 1000 + ' seconds',
      invoiceId: invoiceData.id,
      eligibilityState: eligibilityState
    });

    const intervalId = setInterval(() => {
      console.log('🔄 Mobile Details: Polling for instant settlement update:', {
        invoiceId: invoiceData.id,
        settlementMethod,
        timestamp: new Date().toISOString()
      });
      fetchInvoiceData();
    }, pollingInterval);

    // Cleanup interval when component unmounts or settlement is no longer in progress
    return () => {
      console.log('🛑 Mobile Details: Clearing instant settlement polling interval');
      clearInterval(intervalId);
    };
  }, [invoiceData?.invoiceInstantSettlementDetails?.eligibilityState, invoiceData?.id, fetchInvoiceData]);

  const invoiceNum = invoiceData?.exporterSystemInvoiceId || "Invoice Number"
  const srnNum = getInvoiceLessPaymentDisplayId(invoiceData) || "SRN Number"

  if(!invoiceData) return null;

  return (
    <div className={"flex flex-col -mt-12"}>
      <div className={"bg-white p-4 flex flex-row items-center gap-4"}>
        <RightArrowIcon
          stroke={"#0A2540"}
          className={"rotate-180 cursor-pointer"}
          onClick={() => {
            router.push(isInvoiceBased ? FE_ROUTES.INVOICES : FE_ROUTES.PAYMENTS);
          }}
        />
        <Typography
          size={TYPOGRAPHY_SIZES.LARGE}
          type={TYPOGRAPHY_TYPES.LABEL}
          text={`${isInvoiceBased ? `Invoice #${invoiceNum}` : `Payment #${srnNum}`}`}
        />
      </div>
      <div className={"p-4 w-full"}>
        <PaymentDetailsHeaderMobile
          invoice={invoiceData}
          balanceSummaryData={balanceSummaryData}
          balanceSummary={balanceSummary}
        />
        <PayoutNote invoiceData={invoiceData} payerName={invoiceData.importer?.businessName || ""} />
        <RightSection
          isUnparsed={false}
          invoiceData={invoiceData}
          onInvoiceDataRefetch={fetchInvoiceData}
          onSettlementInitiated={handleSettlementInitiated}
          showSettlementBanner={showSettlementBanner}
          balanceSummaryData={balanceSummaryData}
          balanceSummary={balanceSummary}
          balanceSummaryLoading={balanceSummaryLoading}
        />
        {showSettlementSuccessPopup && invoiceData && (
          <SettlementSuccessPopup
            isOpen={showSettlementSuccessPopup}
            onClose={() => {
              setShowSettlementSuccessPopup(false);
              setShowConfetti(false);
            }}
            invoice={invoiceData}
            showConfetti={showConfetti}
          />
        )}
      </div>
    </div>
  );
};

const PayoutNote = ({ invoiceData, payerName }: { invoiceData: Invoice; payerName: string }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  let skydoCharges = Locale.toBeDetermined;

  let transaction = invoiceData?.transaction || [];
  if (transaction?.length > 0) {
    let usdCharges = transaction?.[0]?.pricingRecord?.usdCharges;

    // if charges are `0` then show `0`
    // only if null or undefined then show `To be determined`
    skydoCharges =
      usdCharges !== null && usdCharges !== undefined
        ? formatIncomingCurrency(usdCharges, "USD")
        : Locale.toBeDetermined;
  }

  if (invoiceData.transaction?.some((txn) => txn.collectionType === "PAYOUT")) {
    return (
      <div className={"mt-3"}>
        <Notes
          iconColor={"#276EF1"}
          typographyClasses={"flex-1"}
          text={
            <div className={"flex flex-col gap-1"}>
              <Typography text={Locale.feeMayVary} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} />
              <TextCTA
                onClick={() => setIsBottomSheetOpen(true)}
                text={Locale.knowMore}
                typographyType={TYPOGRAPHY_TYPES.LABEL}
                typographySize={TYPOGRAPHY_SIZES.SMALL}
              />
            </div>
          }
          iconHeight={16}
          iconWidth={16}
          className={"!bg-blue-50 !border border-blue-200 rounded-[5px] !items-start"}
          typographySize={TYPOGRAPHY_SIZES.X_SMALL}
          iconClassname={"rotate-180"}
        />
        <BottomSheet
          title={
            <div className={"flex flex-col gap-2"}>
              <Typography
                text={Locale.whatIsSkydoPayouts}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_LARGE}
                textClasses={"!font-bold"}
              />
              <Typography
                text={Locale.employerPayment.replace(":employerName", payerName)}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!text-black-500"}
              />
            </div>
          }
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
        >
          <div className={"flex flex-col gap-4 h-[70px]"}>
            <div className={"flex flex-row items-center justify-between pb-4 border-b border-black-400 border-dashed"}>
              <Typography
                text={Locale.totalInvoiceAmount}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
              />
              <Typography
                text={formatIncomingCurrencyWithNumber({
                  value: invoiceData.expectedAmount,
                  currency: invoiceData.expectedCurrency,
                  minFractionDigits: 2,
                  maxFractionDigits: 2,
                })}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
              />
            </div>
            <div className={"flex flex-row items-center justify-between"}>
              <Typography text={Locale.skydoFeeUSD} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} />
              <Typography text={skydoCharges} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} />
            </div>
          </div>
        </BottomSheet>
      </div>
    );
  }
  return null;
};

export default RecentPaymentDetailsMobile;