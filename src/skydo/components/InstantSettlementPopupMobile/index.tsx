import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Router, { useRouter } from "next/router";
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
import Tooltip from "../AtomicComponents/Tooltip";
import InformationIconV2 from "../Icons/InfomationIconV2";
import { fetchData } from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import FE_ROUTES from "../../util/feRoutes";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import Locale from "../../util/locale/en";
import InstantSettlementFeedbackPopup from "../InstantSettlementPopup/InstantSettlementFeedbackPopup";
import useCustomerFeedbackStore from "../../store/useCustomerFeedbackStore";
import InstantSettlementFaqPage from "./InstantSettlementFaqPage";
import InstantSettlementIcon from "../Icons/InstantSettlementIcon";
import InstantSettlementReceiveBreakdown from "../InstantSettlementPopup/InstantSettlementReceiveBreakdown";
import useInstantSettlementPreview from "../../hooks/useInstantSettlementPreview";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onSettleNow: () => void;
  onSettlementInitiated?: () => void;
}

const InstantSettlementPopupMobile = (props: Props) => {
  const { isOpen, onClose, invoice, onSettleNow, onSettlementInitiated } = props;

  // All hooks must be called before any conditional returns
  const router = useRouter();
  const { theme } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [isFaqPopupOpen, setIsFaqPopupOpen] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const analytics = useAnalytics();
  const {
    hasSubmittedInstantSettlementFeedback,
    fetchHasSubmittedInstantSettlementFeedback,
  } = useCustomerFeedbackStore();

  // Check if we're already on the invoice details page (can be calculated before early return)
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
      setSlideProgress(0);
      setIsDragging(false);
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

  const dismissFaqAndCloseInstantSettlement = (source: string) => {
    setIsFaqPopupOpen(false);
    handleClose(source);
  };

  // Memoize handleSettleNowClick to avoid recreating it on every render
  const handleSettleNowClick = useCallback(async () => {
    if (!invoice || !invoice.id) return;
    // Show success animation directly (skip loading state)
    setShowSuccessAnimation(true);
    const pricingPercentage = (invoice.invoiceInstantSettlementDetails?.data?.instantSettlementPricingPercentage ?? 0.01) * 100;
    analytics?.trackAsync(Events.INSTANT_SETTLEMENT.SETTLE_CONFIRM, { pricingPercentage });

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
      if (isOnInvoiceDetailsPage) {
        // We're already on the invoice details page, just close the popup
        setTimeout(() => {
          setShowSuccessAnimation(false);
          onClose();
        }, 4000);
      } else {
        // On error, don't redirect - just close the popup
        console.log('Error occurred, closing popup without redirect');
        setTimeout(() => {
          setShowSuccessAnimation(false);
          onClose();
        }, 4000);
      }
      // TODO: Show error message to user
    }
  }, [invoice?.id, onSettleNow, onClose, isOnInvoiceDetailsPage, onSettlementInitiated]);

  // Global mouse/touch move listeners for better drag handling
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const rect = slideRef.current?.getBoundingClientRect();
      if (!rect) return;
      const currentX = e.clientX - rect.left;
      const width = rect.width;
      const progress = Math.min(Math.max((currentX / width) * 100, 0), 100);
      setSlideProgress(progress);
      
      if (progress >= 95) {
        setIsDragging(false);
        setSlideProgress(100);
        void handleSettleNowClick();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = slideRef.current?.getBoundingClientRect();
      if (!rect) return;
      const currentX = e.touches[0].clientX - rect.left;
      const width = rect.width;
      const progress = Math.min(Math.max((currentX / width) * 100, 0), 100);
      setSlideProgress(progress);
      
      if (progress >= 95) {
        setIsDragging(false);
        setSlideProgress(100);
        void handleSettleNowClick();
      }
    };

    const handleGlobalMouseUp = () => {
      if (slideProgress < 95) {
        setSlideProgress(0);
        setIsDragging(false);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (slideProgress < 95) {
        setSlideProgress(0);
        setIsDragging(false);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, slideProgress, isLoading, showSuccessAnimation, handleSettleNowClick]);
  
  const {
    breakdown: previewBreakdown,
    inrBreakdown: previewInrBreakdown,
    isLoading: isPreviewLoading,
  } = useInstantSettlementPreview({
    invoiceId: invoice?.id ?? null,
    isOpen,
    source: "mobile",
    onRefreshExhausted: () => handleClose("refresh-exhausted"),
  });

  // Charges caption from the new preview breakdown (base fee + IS fee in source currency).
  const previewChargesLine = previewBreakdown
    ? Locale.instantSettlementChargesLineMobile
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

  // Early return check AFTER all hooks
  if (!invoice || !invoice.id) {
    return null;
  }

  // Slide to confirm handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLoading || showSuccessAnimation) return;
    e.preventDefault();
    setIsDragging(true);
    const rect = slideRef.current?.getBoundingClientRect();
    if (rect) {
      startXRef.current = e.touches[0].clientX - rect.left;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLoading || showSuccessAnimation) return;
    e.preventDefault();
    setIsDragging(true);
    const rect = slideRef.current?.getBoundingClientRect();
    if (rect) {
      startXRef.current = e.clientX - rect.left;
    }
  };

  const { amount} = invoice;
  const settlementAmount = invoice.invoiceInstantSettlementDetails?.data?.totalAmount || amount || 0;
  const currency = invoice.invoiceInstantSettlementDetails?.data?.totalAmountCurrency || "USD";
  
  // Use API data if available
  const instantSettlementData = invoice.invoiceInstantSettlementDetails?.data;
  // API returns percentage as decimal (0.01 for 1%, 0.005 for 0.5%)
  const instantSettlementPricingPercentage = Math.round((instantSettlementData?.instantSettlementPricingPercentage || 0.01) * 100 * 100) / 100; // Convert to percentage with 2 decimal precision, default to 1%
  const instantSettlementFee = instantSettlementData?.extraCharges || (settlementAmount * (instantSettlementData?.instantSettlementPricingPercentage || 0.01));
  const instantSettlementFeeCurrency = instantSettlementData?.extraChargesCurrency || "USD";
  const normalSettlementDate = instantSettlementData?.normalSettlementDate;
  const settlementMethod = instantSettlementData?.settlementMethod;
  const numberOfTransactions = instantSettlementData?.numberOfTransactions || 0;
  const numberOfInvoices = instantSettlementData?.numberOfInvoices || 0;
  
  // Determine if we should show payments UI or invoices UI
  const showPaymentsUI = numberOfTransactions > 0;
  const count = showPaymentsUI ? numberOfTransactions : numberOfInvoices;
  const itemLabel = showPaymentsUI ? 'payment' : 'invoice';
  const itemLabelPlural = showPaymentsUI ? 'payments' : 'invoices';
  
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
          className="flex flex-col items-center pb-6 relative rounded-t-2xl -mx-6 -mt-6 pt-6 px-6 overflow-hidden"
          style={{
            backgroundImage: 'url(/images/instantsettlementpopup.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* FAQ's | close — Instant-settlement MF header */}
          <div className="absolute top-[16px] right-[16px] z-10 flex flex-row items-center gap-4">
            <button
              type="button"
              className="shrink-0 border-0 bg-transparent p-0 cursor-pointer rounded-sm text-black-700 underline decoration-dotted underline-offset-[3px] decoration-black-700 transition-colors hover:text-primary-400 hover:decoration-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5671D2] focus-visible:ring-offset-1 font-lato text-sm font-semibold leading-5"
              onClick={() => {
                analytics.trackAsync(Events.INSTANT_SETTLEMENT.FAQ_LINK_CLICK, {
                  source: "mobile-popup",
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
            <Button
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.X_SMALL}
              title={() => (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              onButtonClick={() => handleClose("cross-icon")}
              buttonClass="shrink-0 cursor-pointer p-0 m-0 border-0 bg-transparent leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5671D2] focus-visible:ring-offset-1 rounded !h-auto !min-h-0 !p-0 text-[#5671D2]"
              nativeType="button"
              buttonProps={{ "aria-label": "Close" }}
            />
          </div>
          
          {/* Circular Blue Icon with Lightning Bolt */}
          <div style={{ marginTop: '36px', position: 'relative', zIndex: 1, border: 'solid #1966F0', borderRadius: '50%', display: 'inline-flex' }}>
            <InstantSettlementIcon width={54} height={54} />
          </div>
          
          {/* Title and Amount Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', position: 'relative', zIndex: 1, marginTop: '16px' }}>
            <Typography
              text="Settle"
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses="text-center"
              textProps={{
                textAlign: 'center',
                fontFamily: 'Lato',
                fontSize: '24px',
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
                  fontSize: '26px',
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
                    fontSize: '26px',
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
                fontSize: '24px',
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
                  <path d="M8 11.3333H8.00667" stroke="#276EF1" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Tooltip>
            </div>
          )}
        </div>

        {/* Comparison Section */}
        <div className="mb-4">
          <div className="flex items-center w-full mb-3">
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
            <div className="flex-1 p-3 flex flex-col justify-start items-center text-center bg-black-50">
              <Typography
                text="Standard Settlement"
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses="!text-black-500 mb-1"
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
              className="flex-1 p-3 relative overflow-hidden flex flex-col justify-center items-center text-center"
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
                textClasses="!text-black-500 mb-1"
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
          
          <div className={`rounded-10px bg-[#F6F9FC] ${instantSettlementPricingPercentage < 1 ? 'h-[76px]' : 'h-[48px]'}`}>
            {/* Discount Applied Banner - only show if percentage < 1% */}
            {instantSettlementPricingPercentage < 1 && (
              <div 
                className="flex items-center justify-center gap-1 rounded-t-10px bg-[#D7F9EC] h-[28px]"
              >
                <Typography
                  text={Locale.discountApplied}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses="!text-[#1AA06B] !font-bold"
                />
                <img 
                  src="/instantSettlementDiscountIcon.png" 
                  alt="Discount" 
                  width={14} 
                  height={14}
                  className="object-contain"
                />
              </div>
            )}
            
            <div className="flex flex-col items-center justify-center h-[48px]">
              {previewInrBreakdown ? (
                <Typography
                  text={previewChargesLine}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses="!text-black-700 text-center !font-bold"
                />
              ) : (
              <div className="flex flex-row items-center justify-center flex-wrap gap-1">
                <Typography
                  text={Locale.skydoBaseFeePlus}
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
                <div className="ml-1 cursor-pointer">
                  <Tooltip
                    tooltipText={
                      <div
                        style={{
                          color: '#FFFFFF',
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
                    position={TOOLTIP_POSITION.TOP}
                    tooltipTheme="dark"
                    arrow={true}
                  >
                    <InformationIconV2 width={16} height={16} />
                  </Tooltip>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* You'll receive (INR) breakup — only with a valid FX-resolved quote; else fall back to old view */}
        {previewInrBreakdown && (
          <div className="mb-6">
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
      <div className="flex flex-col gap-2 w-full">
        {/* Slide to confirm button */}
        <div
          ref={slideRef}
          className="relative w-full h-12 rounded-lg overflow-hidden cursor-pointer select-none px-1"
          style={{
            background: slideProgress >= 80 
              ? '#1AA06B' // Fully green when confirmed
              : slideProgress === 0
              ? '#334DB3' // Original blue at start
              : (() => {
                  // Interpolate from original blue to darker green as slider progresses
                  const progressRatio = slideProgress / 100;
                  
                  const interpolateColor = (start: number[], end: number[], ratio: number) => {
                    return start.map((s, i) => Math.round(s + (end[i] - s) * ratio));
                  };
                  
                  // Original blue: #334DB3 (51, 77, 179) - stays constant
                  // Lighter green: #4FD4A0 (79, 212, 160)
                  // Darker green: #1AA06B (26, 160, 107)
                  
                  const originalBlue = [51, 77, 179];
                  const lightGreen = [79, 212, 160];
                  const darkGreen = [26, 160, 107];
                  
                  // Blue stays as original, green transitions from light to dark
                  const currentGreen = interpolateColor(lightGreen, darkGreen, progressRatio);
                  
                  const blueHex = '#334DB3';
                  const greenHex = `#${currentGreen.map(c => c.toString(16).padStart(2, '0')).join('')}`;
                  
                  return `linear-gradient(90deg, ${blueHex} 0%, ${greenHex} 100%)`;
                })(),
            borderRadius: '7.712px',
            transition: isDragging ? 'none' : 'background 0.2s ease-out',
          }}
          onTouchStart={handleTouchStart}
          onMouseDown={handleMouseDown}
        >
          {/* Slider thumb - positioned on the left initially */}
          <div
            className="absolute left-0 z-10"
            style={{
              left: slideProgress > 75 
                ? 'calc(100% - 55.527px - 4px)'
                : `max(4px, min(${slideProgress}%, calc(100% - 55.527px - 4px)))`,
              top: '50%',
              transform: `translateY(-50%) ${slideProgress >= 80 ? 'scale(1.05)' : 'scale(1)'}`,
              transition: isDragging ? 'none' : 'left 0.2s ease-out, transform 0.2s ease-out',
            }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                borderRadius: '7.712px',
                background: slideProgress >= 80 ? '#13744E' : '#283C8B', // Green when confirmed, dark blue otherwise
                width: '55.527px',
                height: '40.103px',
                padding: '10.797px 18.509px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: isDragging ? 'none' : 'background 0.2s ease-out',
              }}
            >
              {slideProgress >= 80 ? (
                // Checkmark icon when confirmed
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // Arrow icon when sliding
                <svg
                  width="16"
                  height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 18L15 12L9 6"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round" 
                />
              </svg>
              )}
            </div>
          </div>
          
          {/* Text overlay - positioned to the right of the handle */}
          <div 
            className="absolute inset-0 flex items-center justify-center z-0 mr-20"
            style={{
              paddingLeft: '70px', // Space for the handle on the left
            }}
          >
            <Typography
              text={slideProgress >= 80 ? "Confirmed" : "Slide to confirm"}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses="!text-white font-bold"
            />
          </div>
        </div>
        
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
          size={TYPOGRAPHY_SIZES.X_X_SMALL}
          textClasses="text-center"
          textProps={{
            color: '#8898AA',
            textAlign: 'center',
            fontFamily: 'Lato',
            fontSize: '10px',
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
          <img 
            src="/images/lightningBolt.gif" 
            alt="Lightning Bolt" 
            width={64} 
            height={64}
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        {/* Instant settlement GIF */}
        <div className="mb-2 flex items-center justify-center">
          <img 
            src="/images/instantSettlementGif.gif" 
            alt="Instant settlement" 
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
    const message = invoice.invoiceInstantSettlementDetails?.bufferRequired ? "Settlement initiated, Check back in 1 hour" :
    settlementMethod === "IMPS" 
      ? "Settlement initiated, Check back in 60 seconds"
      : "Settlement initiated, Check back in 20 minutes";
    
    return (
      <div className="flex flex-col items-center py-4 px-6">
        {/* Animated Lightning Bolt GIF */}
        <div className="mb-2 relative flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
          <img 
            src="/images/lightningBolt.gif" 
            alt="Lightning Bolt" 
            width={64} 
            height={64}
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        {/* Instant settlement GIF */}
        <div className="mb-2 flex items-center justify-center">
          <img 
            src="/images/instantSettlementGif.gif" 
            alt="Instant settlement" 
            style={{ maxWidth: '100%', height: 'auto' }}
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
        open={isOpen && !showFeedbackPopup}
        renderContent={() =>
          isFaqPopupOpen ? (
            <InstantSettlementFaqPage
              onBack={() => setIsFaqPopupOpen(false)}
              onCloseCross={() => dismissFaqAndCloseInstantSettlement("faq-cross-icon")}
            />
          ) : (
            getContent()
          )
        }
        renderCTAs={isFaqPopupOpen ? () => <></> : renderCTAs}
        outsideClick={
          isLoading || showSuccessAnimation
            ? undefined
            : () => (isFaqPopupOpen ? setIsFaqPopupOpen(false) : handleClose("outside-click"))
        }
        isDashboardPopup={true}
        containerClass={
          isFaqPopupOpen
            ? "!w-full !max-w-none !rounded-none !m-0 !min-h-[100dvh] !h-full !max-h-none !overflow-hidden !px-0 !py-0"
            : "!w-full !max-w-none !rounded-t-2xl !rounded-b-none !m-0 !max-h-[90vh] !overflow-hidden !px-4"
        }
        customContainerWidth={true}
        bgWrapperClass={isFaqPopupOpen ? "!items-stretch !justify-stretch" : "!items-end"}
        isCommonHeader={false}
      />
      <InstantSettlementFeedbackPopup
        isOpen={showFeedbackPopup}
        onClose={handleFeedbackPopupClose}
      />
    </>
  );
};

export default InstantSettlementPopupMobile;

