import React from "react";
import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { formatIncomingCurrencyWithSymbol } from "../../util/formatters";
import { Invoice } from "../../types";
import { AnimationLoader } from "../Common/AnimationLoader";
import useMobileVersionHook from "../Common/useMobileVersionHook";
import classNames from "classnames";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  showConfetti?: boolean;
}

const SettlementSuccessPopup = (props: Props) => {
  const { isOpen, onClose, invoice, showConfetti = false } = props;
  const { isMobile } = useMobileVersionHook();

  if (!isOpen || !invoice) return null;

  // Get settlement amount - try multiple sources
  // Settlement amount should always be displayed in INR
  let settlementAmount = 0;
  
  // 1. First try from transaction amountSettled (always in INR, available after settlement)
  if (invoice.transaction?.[0]?.amountSettled) {
    settlementAmount = invoice.transaction?.[0].amountSettled;
  }
  // 2. Try from invoiceInstantSettlementDetails (available during eligibility check)
  else if (invoice.invoiceInstantSettlementDetails?.data?.totalAmount) {
    settlementAmount = invoice.invoiceInstantSettlementDetails.data.totalAmount;
  }
  // 3. Fall back to transaction amount (will be converted to INR)
  else if (invoice.transaction?.[0]?.amount) {
    settlementAmount = invoice.transaction?.[0].amount;
  }
  // 4. Fall back to invoice amount
  else {
    settlementAmount = invoice.expectedAmount || invoice.amount || 0;
  }
  
  // Settlement amount is always displayed in INR
  const settlementCurrency = "INR";

  const formattedAmount = formatIncomingCurrencyWithSymbol({
    value: settlementAmount,
    currency: settlementCurrency,
    formatOptions: {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    },
  });

  return (
    <Popup
      open={isOpen}
      renderContent={() => (
        <div className="flex flex-col items-center text-center relative w-full" style={{ 
          padding: isMobile ? '32px 24px 20px 24px' : '32px 24px',
          minHeight: isMobile ? 'auto' : 'auto'
        }}>
          {/* Confetti at top of popup */}
          {showConfetti && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 pointer-events-none z-10">
              <AnimationLoader
                src={"/confetti.json"}
                loop={1}
                animation={true}
                className={"!w-full !h-full"}
              />
            </div>
          )}
          
          {/* Blue Tick Icon */}
          <div 
            className="rounded-full flex items-center justify-center"
            style={{
              width: '54px',
              height: '54px',
              background: 'linear-gradient(180deg, #4A90E2 0%, #276EF1 100%)',
              marginBottom: '16px'
            }}
          >
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M22 11L13 20L10 17" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {/* Large Amount */}
          <div className={classNames("mb-1", isMobile ? '!mb-[2px]' : '!mb-1')}>
            <Typography
              text={formattedAmount}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={isMobile ? TYPOGRAPHY_SIZES.X_SMALL : TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={`!text-blue-400 font-bold ${isMobile ? '!text-2xl' : '!text-3xl'}`}
            />
          </div>          
          {/* Settlement Initiated Title */}
          <div className={classNames("mb-1", isMobile ? '!mb-2' : '!mb-1')}>
            <Typography
              text="Settled Instantly!"
              type={TYPOGRAPHY_TYPES.HEADING}
              size={isMobile ? TYPOGRAPHY_SIZES.X_SMALL : TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={`!text-blue-400 font-bold ${isMobile ? '!text-lg' : '!text-xl'}`}
            />
          </div>
          
          {/* Message */}
          {/*<Typography*/}
          {/*  text="You will receive a notification in 2 mins"*/}
          {/*  type={TYPOGRAPHY_TYPES.PARA}*/}
          {/*  size={TYPOGRAPHY_SIZES.SMALL}*/}
          {/*  textClasses="!text-black-500"*/}
          {/*/>*/}
        </div>
      )}
      renderCTAs={() => <></>}
      outsideClick={onClose}
      closeIconClick={onClose}
      isDashboardPopup={true}
      isCommonHeader={false}
      containerClass={isMobile ? "!w-full !max-w-none !rounded-t-2xl !rounded-b-none !m-0 !max-h-[90vh] !overflow-y-auto" : "!rounded-2xl !max-w-md"}
      customContainerWidth={isMobile || false}
      bgWrapperClass={isMobile ? "!items-end" : ""}
    />
  );
};

export default SettlementSuccessPopup;

