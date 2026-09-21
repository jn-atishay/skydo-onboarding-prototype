import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Popup from "../AtomicComponents/Popup";
import Button from "../AtomicComponents/Button";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOOLTIP_POSITION,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import { Invoice, TransactionSettlementPaymentMethod } from "../../types";
import { formatIncomingCurrencyWithNumber, ordinalSuffix, roundTo } from "../../util/formatters";
import { toAmount } from "../../util/instantSettlementUtil";
import AppContext from "../../context/AppContext";
import InformationIconV2 from "../Icons/InfomationIconV2";
import Tooltip from "../AtomicComponents/Tooltip";
import { fetchData } from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import Router, { useRouter } from "next/router";
import FE_ROUTES from "../../util/feRoutes";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import Locale from "../../util/locale/en";
import InstantSettlementFeedbackPopup from "./InstantSettlementFeedbackPopup";
import InstantSettlementFaqPopup from "./InstantSettlementFaqPopup";
import useCustomerFeedbackStore from "../../store/useCustomerFeedbackStore";
import InstantSettlementIcon from "../Icons/InstantSettlementIcon";
import InstantSettlementReceiveBreakdown from "./InstantSettlementReceiveBreakdown";
import useInstantSettlementPreview from "../../hooks/useInstantSettlementPreview";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onSettleNow: () => void;
  onSettlementInitiated?: () => void;
}

const InstantSettlementPopup = (props: Props) => {
  const { isOpen, onClose, invoice, onSettleNow, onSettlementInitiated } = props;
  const { theme } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [isFaqPopupOpen, setIsFaqPopupOpen] = useState(false);
  const router = useRouter();
  const analytics = useAnalytics();
  const { hasSubmittedInstantSettlementFeedback, fetchHasSubmittedInstantSettlementFeedback } = useCustomerFeedbackStore();

  // Check if we're already on the invoice details page
  const isOnInvoiceDetailsPage = router.pathname === FE_ROUTES.INVOICE_DETAILS || router.pathname === FE_ROUTES.UNPARSED_INVOICE;

  // Fetch feedback status when component mounts
  useEffect(() => {
    if (isOpen) {
      void fetchHasSubmittedInstantSettlementFeedback();
    }
  }, [isOpen, fetchHasSubmittedInstantSettlementFeedback]);

  // Reset states when popup closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setShowSuccessAnimation(false);
      setShowFeedbackPopup(false);
      setIsFaqPopupOpen(false);
    }
  }, [isOpen]);

  const handleClose = (source: string) => {
    // Show feedback popup only if user hasn't submitted feedback before
    analytics.trackAsync(Events.INSTANT_SETTLEMENT.CLOSE, {
      source: source,
    });
    if (!hasSubmittedInstantSettlementFeedback && source !== "outside-click") {
      setShowFeedbackPopup(true);
    } else {
      onClose();
    }
  };

  const handleFeedbackPopupClose = () => {
    setShowFeedbackPopup(false);
    onClose();
  };

  /** After closing FAQ: end IS session (feedback if needed), same as closing main popup */
  const dismissFaqAndCloseInstantSettlement = (source: string) => {
    setIsFaqPopupOpen(false);
    handleClose(source);
  };

  const {
    breakdown: previewBreakdown,
    inrBreakdown: previewInrBreakdown,
    isLoading: isPreviewLoading,
  } = useInstantSettlementPreview({
    invoiceId: invoice?.id ?? null,
    isOpen,
    source: "desktop",
    onRefreshExhausted: () => handleClose("refresh-exhausted"),
  });

  // Charges caption from the new preview breakdown (base fee + IS fee in source currency).
  const previewChargesLine = previewBreakdown
    ? Locale.instantSettlementChargesLine
        .replace(
          ":baseFee",
          formatIncomingCurrencyWithNumber({
            value: toAmount(previewBreakdown.platformFee.amount),
            currency: previewBreakdown.platformFee.currency,
            minFractionDigits: 0,
            maxFractionDigits: 2,
          })
        )
        .replace(
          ":isFee",
          formatIncomingCurrencyWithNumber({
            value: toAmount(previewBreakdown.instantSettlementFee.amount),
            currency: previewBreakdown.instantSettlementFee.currency,
            minFractionDigits: 0,
            maxFractionDigits: 2,
          })
        )
        .replace(":percentage", String(roundTo(previewBreakdown.instantSettlementFeePercentage * 100, 2)))
    : "";

  if (!invoice || !invoice.id) {
    return null;
  }

  const handleSettleNowClick = async () => {
    // Show success animation directly (skip loading state)
    const pricingPercentage = (invoice.invoiceInstantSettlementDetails?.data?.instantSettlementPricingPercentage ?? 0.01) * 100;
    analytics?.trackAsync(Events.INSTANT_SETTLEMENT.SETTLE_CONFIRM, { pricingPercentage });
    setShowSuccessAnimation(true);
    
    try {
      // Call the instant settlement API
      const response = await fetchData<{ settlementMethod: TransactionSettlementPaymentMethod }>({
        path: BE_ROUTES.EXECUTE_INSTANT_SETTLEMENT,
        method: ALLOWED_METHODS.POST,
        body: {
          invoiceId: invoice.id,
        },
        onSuccess: (resp) => {
          console.log('Instant settlement executed successfully:', resp.data);
        },
        onError: (error) => {
          console.error('Failed to execute instant settlement:', error);
          // TODO: Show error message to user
        },
      });

      if (response.success && response.data) {
        // Call the parent callback
        onSettleNow();
      }
      
      // Get settlement method from response
      const settlementMethod = response.data?.settlementMethod;
      const isIMPS = settlementMethod === TransactionSettlementPaymentMethod.IMPS;
      
      // If we're already on the invoice details page, just refetch and close
      // Otherwise, redirect to invoice detail page ONLY if settlement method is IMPS
      if (isOnInvoiceDetailsPage) {
        // We're already on the invoice details page, just close the popup
        // The refetch will be handled by onSettleNow callback
        setTimeout(() => {
          setShowSuccessAnimation(false);
          onClose();
          // Trigger settlement initiated callback to show success popup after popup closes
          // Add a small delay to ensure the popup is fully closed before showing the next one
          setTimeout(() => {
            if (onSettlementInitiated) {
              onSettlementInitiated();
            }
          }, 100);
        }, 4000);
      } else if (isIMPS) {
        // Redirect to invoice detail page ONLY if settlement method is IMPS
        // Add query parameter to trigger refetch and allow backend processing time
        const invoiceDetailsUrl = FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", String(invoice.id)) + "?instantSettlement=true&t=" + Date.now();
        console.log('Will navigate to invoice details page (IMPS settlement):', invoiceDetailsUrl, 'Invoice ID:', invoice.id);
        
        setTimeout(() => {
          setShowSuccessAnimation(false);
          onClose();
          // Use Router.push for navigation (same as used in store)
          Router.push(invoiceDetailsUrl);
        }, 4000);
      } else {
        // For non-IMPS settlement methods, just close the popup without redirecting
        console.log('Settlement method is not IMPS, closing popup without redirect. Method:', settlementMethod);
        setTimeout(() => {
          setShowSuccessAnimation(false);
          onClose();
        }, 4000);
      }
    } catch (error) {
      console.error('Error executing instant settlement:', error);
      // Still show success animation
      // if (isOnInvoiceDetailsPage) {
      //   setTimeout(() => {
      //     setShowSuccessAnimation(false);
      //     onClose();
      //   }, 4000);
      // } else {
      //   // On error, don't redirect - just close the popup
      //   console.log('Error occurred, closing popup without redirect');
      //   setTimeout(() => {
      //     setShowSuccessAnimation(false);
      //     onClose();
      //   }, 4000);
      // }
    }
  };
  
  const { amount } = invoice;
  const settlementAmount = invoice.invoiceInstantSettlementDetails?.data?.totalAmount || amount || 0;
  const currency = invoice.invoiceInstantSettlementDetails?.data?.totalAmountCurrency || "USD";
  
  // Get instant settlement data from API
  const instantSettlementData = invoice.invoiceInstantSettlementDetails?.data;
  const normalSettlementDate = instantSettlementData?.normalSettlementDate;
  const settlementMethod = instantSettlementData?.settlementMethod;
  const numberOfTransactions = instantSettlementData?.numberOfTransactions || 0;
  const numberOfInvoices = instantSettlementData?.numberOfInvoices || 0;
  
  // Determine if we should show payments UI or invoices UI
  const showPaymentsUI = numberOfTransactions > 0;
  const count = showPaymentsUI ? numberOfTransactions : numberOfInvoices;
  const itemLabel = showPaymentsUI ? 'payment' : 'invoice';
  const itemLabelPlural = showPaymentsUI ? 'payments' : 'invoices';
  
  // Calculate charges (example - adjust based on your business logic)
  // API returns percentage as decimal (0.01 for 1%, 0.005 for 0.5%)
  const instantSettlementPricingPercentage = Math.round((instantSettlementData?.instantSettlementPricingPercentage || 0.01) * 100 * 100) / 100; // Convert to percentage with 2 decimal precision, default to 1%
  const instantSettlementFee = instantSettlementData?.extraCharges;
  const instantSettlementFeeCurrency = instantSettlementData?.extraChargesCurrency || "USD";
  
  // Format normal settlement date to "21st Nov 2025" format
  const formatNormalSettlementDate = (dateString: string | undefined): string => {
    if (!dateString) return "13th Sept 2025"; // Fallback
    
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();

      return `${day}${ordinalSuffix(day)} ${month} ${year}`;
    } catch (e) {
      return "13th Sept 2025"; // Fallback on error
    }
  };
  
  // Get instant settlement time based on settlement method
  const getInstantSettlementTime = (): string => {
    if (invoice.invoiceInstantSettlementDetails?.bufferRequired) {
      return "1 hour";
    }
    if (settlementMethod === TransactionSettlementPaymentMethod.IMPS) {
      return "60 seconds";
    }
    return "20 mins";
  };
  
  const formattedAmount = formatIncomingCurrencyWithNumber({
    value: settlementAmount,
    currency: currency || "USD",
    minFractionDigits: 2,
    maxFractionDigits: 2,
  });

  // Split amount into whole and decimal parts for different styling
  const amountParts = formattedAmount.split('.');
  const wholePart = amountParts[0]; // Includes currency, e.g., "USD 10,000"
  const decimalPart = amountParts.length > 1 ? `.${amountParts[1]}` : '';

  const formattedCharges = formatIncomingCurrencyWithNumber({
    value: instantSettlementFee,
    currency: instantSettlementFeeCurrency || "USD",
    minFractionDigits: 2,
    maxFractionDigits: 2,
  });

  const renderContent = () => {
    return (
      <div className="flex flex-col">
        {/* Top Section with Icon and Amount */}
        <div 
          className="flex flex-col items-center pb-4 relative rounded-t-2xl -mx-6 -mt-6 pt-6 px-6 overflow-hidden"
          style={{
            backgroundImage: 'url(/images/instantsettlementpopup.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* FAQ's link | close — matches Figma header row */}
          <div className="absolute top-4 right-4 z-10 flex flex-row items-center gap-3">
            <button
              type="button"
              className="shrink-0 border-0 bg-transparent p-0 cursor-pointer rounded-sm text-black-700 underline decoration-dotted underline-offset-[3px] decoration-black-700 transition-colors hover:text-primary-400 hover:decoration-primary-400 focus:outline-none focus-visible:text-primary-400 focus-visible:decoration-primary-400 focus-visible:ring-2 focus-visible:ring-[#5671D2] focus-visible:ring-offset-2"
              style={{
                fontFamily: "Lato, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "20px",
              }}
              onClick={() => {
                analytics.trackAsync(Events.INSTANT_SETTLEMENT.FAQ_LINK_CLICK, {
                  source: "popup",
                });
                setIsFaqPopupOpen(true);
              }}
            >
              {Locale.faqsText}
            </button>
            <span
              className="shrink-0 select-none text-[14px] font-light leading-none"
              style={{ color: "rgba(86, 113, 210, 0.45)" }}
              aria-hidden
            >
              |
            </span>
            <button
              onClick={() => handleClose("cross-icon")}
              className="shrink-0 cursor-pointer p-0 m-0 border-0 bg-transparent leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5671D2] focus-visible:ring-offset-2 rounded"
              type="button"
              style={{ color: "#5671D2" }}
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          
          {/* Circular Blue Icon with Lightning Bolt */}
          <div style={{ marginTop: '24px', marginBottom: '12px', position: 'relative', zIndex: 1, border: 'solid #1966F0', borderRadius: '50%', display: 'inline-flex' }}>
            <InstantSettlementIcon width={54} height={54} />
          </div>
          
          {/* Title and Amount Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', position: 'relative', zIndex: 1 }}>
            <Typography
              text="Settle"
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses="text-center"
              textProps={{
                textAlign: 'center',
                fontFamily: 'Lato',
                fontSize: '28px',
                fontStyle: 'normal',
                fontWeight: '800',
                lineHeight: 'normal',
                background: 'linear-gradient(63.442deg, #334DB3 16.21%, #276EF1 108.98%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            />
            
            <div className="flex items-baseline justify-center" style={{ lineHeight: 0 }}>
              <Typography
                text={wholePart}
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses="!text-[#0A2540] font-bold"
                textProps={{
                  textAlign: 'center',
                  fontFamily: 'Lato',
                  fontSize: '28px',
                  fontStyle: 'normal',
                  fontWeight: '800',
                  lineHeight: 'normal',
                  color: '#0A2540',
                } as any}
              />
              {decimalPart && (
                <Typography
                  text={decimalPart}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.LARGE}
                  textClasses="!text-[#0A2540] font-bold"
                  textProps={{
                    fontFamily: 'Lato',
                    fontSize: '28px',
                    fontStyle: 'normal',
                    fontWeight: '800',
                    lineHeight: 'normal',
                    color: '#0A2540',
                  } as any}
                />
              )}
            </div>
            
            <Typography
              text="Instantly?"
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses="text-center"
              textProps={{
                textAlign: 'center',
                fontFamily: 'Lato',
                fontSize: '28px',
                fontStyle: 'normal',
                fontWeight: '800',
                lineHeight: 'normal',
                background: 'linear-gradient(81.0756deg, #334DB3 16.21%, #276EF1 108.98%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            />
          </div>
          
          {/* Against X payments/invoices button */}
          {count > 1 && (
            <div style={{ marginTop: '8px' }}>
            <Tooltip
              tooltipText={
                <div 
                  className="max-w-md rounded-lg relative "
                >
                  <div className="flex items-start flex-col flex-1">
                    <Typography
                      text={showPaymentsUI ? "Payments mapped to this Invoice" : "Invoices mapped to this Payment"}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses="!text-white font-bold"
                    />
                    <Typography
                      text="We've clubbed them so you're charged only once"
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_X_SMALL}
                      textClasses="!text-[#8898AA] mb-3"
                    />
                  </div>
                  
                  {/* Invoice Details Section */}
                  <div className="flex flex-col gap-2 mb-2">
                    {((instantSettlementData?.transactionDetails || invoice.transaction) || []).map((txn: any, index: number) => {
                      // Use transactionDetails if available, otherwise fallback to transaction
                      const txnDetails = instantSettlementData?.transactionDetails?.[index];
                      const invoiceNumber = txnDetails?.invoiceNumber || invoice.exporterSystemInvoiceId || invoice.id || 'N/A';
                      const importerName = txnDetails?.importerName || invoice.importer?.businessName || 'N/A';
                      const txnAmount = txnDetails?.amount || txn.amount || 0;
                      const txnCurrency = txnDetails?.currency || txn.currency || invoice.currency || "USD";
                      const transactionList = instantSettlementData?.transactionDetails || invoice.transaction;
                      
                      return (
                        <div key={txnDetails?.invoiceNumber || txn.id || index} >
                          <div className="flex flex-row justify-between items-start">
                            <div className="flex flex-col flex-1 text-left">
                              <Typography
                                text={`Invoice #${invoiceNumber}`}
                                type={TYPOGRAPHY_TYPES.PARA}
                                size={TYPOGRAPHY_SIZES.X_SMALL}
                                textClasses="!text-white font-bold "
                              />
                              <Typography
                                text={importerName}
                                type={TYPOGRAPHY_TYPES.PARA}
                                size={TYPOGRAPHY_SIZES.X_X_SMALL}
                                textClasses="!text-[#8898AA]"
                              />
                            </div>
                            <div className="ml-4 text-right" style={{ minWidth: '100px' }}>
                              <Typography
                                text={formatIncomingCurrencyWithNumber({
                                  value: txnAmount,
                                  currency: txnCurrency,
                                  minFractionDigits: 2,
                                  maxFractionDigits: 2,
                                })}
                                type={TYPOGRAPHY_TYPES.PARA}
                                size={TYPOGRAPHY_SIZES.X_SMALL}
                                textClasses="!text-white font-bold"
                              />
                            </div>
                          </div>
                          {transactionList && index < transactionList.length - 1 && (
                            <div className="border-t border-dashed border-gray-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex flex-row justify-between items-center pt-2 border-t border-gray-500">
                    <div className="flex flex-col flex-1 text-left">
                      <Typography
                        text="Total settlement amount"
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.X_SMALL}
                        textClasses="!text-white font-bold"
                      />
                    </div>
                    <div className="ml-4 text-right " >
                      <Typography
                        text={formattedAmount}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.X_SMALL}
                        textClasses="!text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              }
              position={TOOLTIP_POSITION.TOP}
              tooltipTheme="dark"
              arrow={true}
            >
              <button
                type="button"
                className="flex items-center justify-center"
                style={{
                  display: 'flex',
                  padding: '6px 10px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '60px',
                  border: '1px solid var(--Primary-Primary300, #276EF1)',
                  background: 'var(--Neutral-Neutral0, #FFF)',
                }}
              >
                <Typography
                  text={`Against ${count} ${count === 1 ? itemLabel : itemLabelPlural}`}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses="!text-black-700 font-medium"
                />
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.00065 14.6666C11.6825 14.6666 14.6673 11.6819 14.6673 7.99998C14.6673 4.31808 11.6825 1.33331 8.00065 1.33331C4.31875 1.33331 1.33398 4.31808 1.33398 7.99998C1.33398 11.6819 4.31875 14.6666 8.00065 14.6666Z"
                    stroke="#0A2540"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.06055 6.00001C6.21728 5.55446 6.52665 5.17875 6.93385 4.93944C7.34105 4.70012 7.81981 4.61264 8.28533 4.69249C8.75085 4.77234 9.17309 5.01436 9.47726 5.3757C9.78144 5.73703 9.94792 6.19436 9.94721 6.66668C9.94721 8.00001 7.94721 8.66668 7.94721 8.66668"
                    stroke="#0A2540"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M8 11.3333H8.00667" stroke="#0A2540" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Tooltip>
            </div>
          )}
        </div>

        {/* Comparison Section */}
        <div className="mb-4">
          <div className="flex items-center w-full mb-4">
            <div className="flex-1 h-px bg-black-300"></div>
            <Typography
              text="Comparison"
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses="!text-black-500 px-3"
            />
            <div className="flex-1 h-px bg-black-300"></div>
          </div>
          
          <div className="flex flex-row rounded-10px overflow-hidden items-stretch">
            {/* Standard Settlement Panel */}
            <div className="flex-1 p-4 flex flex-col justify-start items-center text-center bg-black-50">
              <Typography
                text="Standard Settlement"
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses="!text-black-500 mb-2"
              />
              <Typography
                text={formatNormalSettlementDate(normalSettlementDate)}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses="!text-black-700 !font-bold"
              />
            </div>
            
            {/* Vertical Divider */}
            <div className="w-px bg-black-300"></div>
            
            {/* Instant Settlement Panel */}
            <div 
              className="flex-1 p-4 relative overflow-hidden flex flex-col justify-center items-center text-center"
              style={{
                backgroundImage: 'url(/images/instantsettlementtime.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <Typography
                text="Instant Settlement"
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses="!text-black-500 mb-2"
              />
              <Typography
                text={getInstantSettlementTime()}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses="!text-blue-500 !font-bold"
              />
              {invoice.invoiceInstantSettlementDetails?.bufferRequired ? <Typography
                text={"99% of payments settle in 60 seconds"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-blue-400 mt-1"}
              /> : null}
            </div>
          </div>
        </div>

        {/* Charges Section */}
        <div className="mb-4">
          <div className="flex items-center w-full mb-4">
            <div className="flex-1 h-px bg-black-300"></div>
            <Typography
              text="Charges"
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses="!text-black-500 px-3"
            />
            <div className="flex-1 h-px bg-black-300"></div>
          </div>
          
          <div className={`rounded-10px bg-[#F6F9FC] ${instantSettlementPricingPercentage < 1 ? 'h-[85px]' : 'h-[60px]'}`}>
            {/* Discount Applied Banner - only show if percentage < 1% */}
            {instantSettlementPricingPercentage < 1 && (
              <div 
                className="flex items-center justify-center gap-1 rounded-t-10px bg-[#D7F9EC] h-[25px]"
              >
                <Typography
                  text= {Locale.discountApplied}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses="!text-[#1AA06B] !font-bold"
                />
                <Image
                  src="/instantSettlementDiscountIcon.png"
                  alt="Discount"
                  width={14}
                  height={14}
                  className="object-contain"
                />
              </div>
            )}
            
            <div className="flex flex-col items-center justify-center h-[60px]">
              {previewInrBreakdown ? (
                <Typography
                  text={previewChargesLine}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses="!text-black-700 text-center !font-bold"
                />
              ) : (
              <div className="flex flex-row items-center justify-center gap-1">
                <Typography
                  text= {Locale.skydoBaseFeePlus}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses="!text-black-700 text-center !font-bold"
                />
                <Typography
                  text={`${instantSettlementPricingPercentage}%`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses="!text-black-700 text-center !font-bold"
                />
                {/* Show strikethrough 1% if discount applied */}
                {instantSettlementPricingPercentage < 1 && (
                  <Typography
                    text="1%"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    textClasses="!text-black-500 text-center !font-bold line-through"
                  />
                )}
                <Typography
                  text={Locale.instantSettlementFee}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses="!text-black-700 text-center !font-bold"
                />
                <Tooltip
                  tooltipText={
                    <div
                      style={{
                        color: 'var(--Gray-White, #FFF)',
                        fontFamily: 'Lato',
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: 'normal',
                      }}
                    >
                      {Locale.instantSettlementFeeTooltip
                        .replace(':formattedCharges', formattedCharges)
                        .replace(':percentage', instantSettlementPricingPercentage.toString())
                        .replace(':formattedAmount', formattedAmount)}
                    </div>
                  }
                  position={TOOLTIP_POSITION.RIGHT}
                  tooltipTheme="dark"
                >
                  <div className="ml-1 cursor-pointer">
                    <InformationIconV2 width={16} height={16} />
                  </div>
                </Tooltip>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* You'll receive (INR) breakup — only with a valid FX-resolved quote; else fall back to old view */}
        {previewInrBreakdown && (
          <div className="mb-4">
            <InstantSettlementReceiveBreakdown
              breakdown={previewBreakdown}
              inrBreakdown={previewInrBreakdown}
              isLoading={isPreviewLoading}
            />
          </div>
        )}
      </div>
    );
  };

  const renderCTAs = () => {
    // No buttons shown during loading or success animation
    if (isLoading || showSuccessAnimation) {
      return <></>;
    }
    
    return (
      <div className="flex flex-col gap-3 w-full">
        <Button
          title={Locale.instantSettlementSettleInstantly}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.MEDIUM}
          onButtonClick={handleSettleNowClick}
          isDisabled={isLoading}
          isLoading={isLoading}
          buttonClass="!w-full"
          nativeType="button"
          textProps={{
            fontFamily: 'Lato',
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '20px',
          } as any}
        />
        <Button
          title={Locale.continueWithStandardSettlement}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.MEDIUM}
          onButtonClick={() => handleClose("go-back")}
          isDisabled={false}
          buttonClass="!w-full"
          nativeType="button"
        />
        <Typography
          text={Locale.instantSettlementReachOutText}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses="text-center"
          textProps={{
            color: '#8898AA',
            textAlign: 'center',
            fontFamily: 'Lato',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '20px',
          } as any}
        />
      </div>
    );
  };

  const renderLoadingAnimation = () => {
    return (
      <div className="flex flex-col items-center justify-center py-4 px-6">
        {/* Animated Lightning Bolt GIF */}
        <div className="mb-2 relative flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
          <Image
            src="/images/lightningBolt.gif"
            alt="Lightning Bolt"
            width={64}
            height={64}
            unoptimized
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        {/* Instant settlement GIF */}
        <div className="mb-2 flex items-center justify-center">
          <Image
            src="/images/instantSettlementGif.gif"
            alt="Instant settlement"
            width={1547}
            height={210}
            unoptimized
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        {/* Processing message */}
        <Typography
          text="Processing your settlement.."
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses="!text-black-500 text-center"
        />
      </div>
    );
  };

  const renderSuccessAnimation = () => {
    // Get settlement method to determine time
    const message = 
    invoice.invoiceInstantSettlementDetails?.bufferRequired ? "Settlement initiated, Check back in 1 hour" :
    settlementMethod === "IMPS" 
      ? "Settlement initiated, Check back in 60 seconds"
      : "Settlement initiated, Check back in 20 minutes";
    
    return (
      <div className="flex flex-col items-center justify-center py-4 px-6" style={{ minHeight: '400px' }}>
        {/* Animated Lightning Bolt GIF */}
        <div className="mb-2 relative flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
          <Image
            src="/images/lightningBolt.gif"
            alt="Lightning Bolt"
            width={64}
            height={64}
            unoptimized
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        {/* Instant settlement GIF */}
        <div className="mb-2 flex items-center justify-center w-full">
          <Image
            src="/images/instantSettlementGif.gif"
            alt="Instant settlement"
            width={1547}
            height={210}
            unoptimized
            style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>
        
        {/* Settlement initiated message */}
        <Typography
          text={message}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses="!text-black-500 text-center"
        />
      </div>
    );
  };

  const getContent = () => {
    if (showSuccessAnimation) {
      return renderSuccessAnimation();
    }
    return renderContent();
  };

  return (
    <>
      <Popup
        open={isOpen && !showFeedbackPopup && !isFaqPopupOpen}
        renderContent={getContent}
        renderCTAs={renderCTAs}
        outsideClick={isLoading || showSuccessAnimation ? undefined : () => handleClose("outside-click")}
        isDashboardPopup={true}
        containerClass="!max-w-lg !min-w-[500px]"
        isCommonHeader={false}
      />
      <InstantSettlementFeedbackPopup
        isOpen={showFeedbackPopup}
        onClose={handleFeedbackPopupClose}
      />
      <InstantSettlementFaqPopup
        isOpen={isFaqPopupOpen}
        onClose={() => setIsFaqPopupOpen(false)}
        onCloseCross={() => dismissFaqAndCloseInstantSettlement("faq-cross-icon")}
      />
    </>
  );
};

export default InstantSettlementPopup;

