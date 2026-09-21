import classNames from "classnames";
import Typography from "../../components/AtomicComponents/Typography";
import {TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES} from "../../constants/atomicConstants";
import { SYSTEM_GENERATED } from "../../store/useDashboardVersionStore";
import {Invoice} from "../../types";
import { formatDate, formatIncomingCurrencyWithNumber, formatINRNumber } from "../../util/formatters";
import Locale from "../../util/locale/en";
import {getFileDownloadUrl, getInvoiceStatusWiseColorTextMapping} from "../../util/functions";
import AppContext from "../../context/AppContext";
import React, { useContext } from "react";
import { getInprogressAmountFromTransactionList, getPaidAmountFromTransactionList } from "../../util/transactionHelpers";
import type { BalanceInvoiceSummaryResponse, BalanceInvoiceSummaryResult } from "../../types/SkydoBalance";
import {
  getBalanceFeesAndPayoutForPaidBarFromProps,
  hasBalanceInvoiceMasterFunding,
} from "../../util/balanceInvoiceSummary";
import EqualIcon from "../../components/Icons/EqualIcon";
import Button from "../../components/AtomicComponents/Button";
import DownloadIcon from "../../components/Icons/DownloadIcon";
import ThreeDotsIcon from "../../components/Icons/ThreeDotsIcon";
import { BUTTON_SIZES, BUTTON_TYPES } from "../../constants/atomicConstants";
import downloadFile from "../../util/downloadFile";
import { useState, useEffect, useRef } from "react";
import {DocTypes, EntityTypes} from "../../constants/dashboardConstants";
import useToastMessages from "../../store/toastMessages";
import {Events} from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";

interface Props {
  invoice: Invoice;
  balanceSummaryData?: BalanceInvoiceSummaryResponse | null;
  balanceSummary?: BalanceInvoiceSummaryResult;
}

const TopPart = (props: Props) => {
  const { invoice } = props;
  const { theme } = useContext(AppContext);
  const isTestInvoice = invoice?.id?.toString() === "test";
  const isInvoiceLess = invoice?.invoiceMetadata?.source == SYSTEM_GENERATED;
  const titleHeading = isInvoiceLess ?  `Received on ${formatDate(invoice?.raisedDate??"")} from` : Locale.invoiceTo.replace(":invoiceId", String(invoice?.exporterSystemInvoiceId));
  const { textColor, bgColor, text, isInprogress } = getInvoiceStatusWiseColorTextMapping(invoice, theme);

  return (
    <div className="flex flex-row justify-between w-full">
      <div className="flex flex-col gap-[6px]">
        {isTestInvoice ?             
          <Typography
            text={Locale.trialPayment}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            fontWeight={"700"}
            textClasses={"!text-black-700 rounded px-2 py-1 bg-yellow-400 w-fit"}
          /> : 
        null}
        <Typography
          text={titleHeading}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500"}
        />
        <Typography
          text={invoice?.importer?.businessName}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          fontWeight={"700"}
        />
      </div>
      <div>
        <div
          className={classNames("inline-flex items-center px-2 py-1 rounded-30px text-center cursor-pointer", {
            bgColor,
          })}
          style={{ backgroundColor: bgColor }}
        >
          <Typography
            text={text}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={textColor}
            textProps={{
              color: textColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const MiddleInvoiceAmount = (props: Props) => {

  const { invoice } = props;
  const isInvoiceLess = invoice?.invoiceMetadata?.source == SYSTEM_GENERATED;
  const title = isInvoiceLess ? "Payment Amount" : "Invoice Amount";
  const amount = formatIncomingCurrencyWithNumber({
    value: invoice?.expectedAmount,
    currency: invoice?.expectedCurrency,
    minFractionDigits: 2,
    maxFractionDigits: 2,
  })
  const preDecimalAmount = amount.split(".")[0];
  const postDecimalAmount = amount.split(".")[1];

  return (
    <div className="flex flex-row justify-between w-full mt-8 items-center">
      <Typography
        text={title}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        fontWeight={"700"}
      />
      <div>
        <Typography
          text={preDecimalAmount}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          fontWeight={"700"}
        />
        <Typography
          text={"." + postDecimalAmount}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={"700"}
          textClasses={"!text-black-500"}
        />
      </div>
    </div>
  )

}

const MiddlePart = (props: Props) => {
  const { invoice, balanceSummaryData, balanceSummary } = props;

  const totalAmount = invoice?.expectedAmount;
  const transaction = invoice?.transaction;
  const balancePaidFromFeesAndPayout = getBalanceFeesAndPayoutForPaidBarFromProps(
    balanceSummaryData,
    balanceSummary,
    invoice.expectedCurrency
  );
  const paidAmount = Math.max(
    getPaidAmountFromTransactionList(invoice, transaction, {
      useAmountMappedWhenNoTransactions: !hasBalanceInvoiceMasterFunding(balanceSummaryData),
    }) + balancePaidFromFeesAndPayout,
    0
  );
  const inProgressAmount = Math.max(getInprogressAmountFromTransactionList(transaction), 0);
  const outstandingAmount = Math.max(totalAmount - paidAmount - inProgressAmount, 0);

  const anyAmountPaid = paidAmount > 0;
  const anyAmountInprogress = inProgressAmount > 0;
  const anyAmountOutstanding = outstandingAmount > 0;

  // check if only one is positive
  const checkIfOnlyOnePositive = (a: number, b: number, c: number) => {
    return (a > 0 && b === 0 && c === 0) || (a === 0 && b > 0 && c === 0) || (a === 0 && b === 0 && c > 0);
  }

  const isOnlyOnePositive = checkIfOnlyOnePositive(paidAmount, inProgressAmount, outstandingAmount);

  if(isOnlyOnePositive) {

    // calculate sum of all amountSettled in transaction list
    const sumOfAmountSettled = transaction?.reduce((acc, curr) => acc + (curr?.amountSettled || 0), 0);
    const isSettlementAmountAvailable = sumOfAmountSettled && sumOfAmountSettled > 0;

    const amount = formatINRNumber({
      value: sumOfAmountSettled,
      maximumFractionDigits: 2,
      formatOptions: { minimumFractionDigits: 2 },
    })
    const preDecimalAmount = amount.split(".")[0];
    const postDecimalAmount = amount.split(".")[1];

    if(isSettlementAmountAvailable) {
      return (
        <div className="flex flex-col w-full">
          <div className="flex justify-center items-center relative">
            <div className="absolute w-full h-[0.75px] bg-black-100"></div>
            <div className="bg-white px-1 z-10">
              <EqualIcon width={24} height={24} fill="#F0F3F7"/>
            </div>
          </div>
          <div className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-col gap-1">
              <Typography
                text={"Settled INR amount"}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                fontWeight={"700"}
              />
              <Typography
                text={"post skydo fee & GST"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500"}
              />
            </div>
            
            <div>
              <Typography
                text={preDecimalAmount}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                fontWeight={"700"}
              />
              <Typography
                text={"." + postDecimalAmount}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"700"}
                textClasses={"!text-black-500"}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }

  }

  
  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      {/* Progress Bar */}
      <div className="w-full relative">
        <div className="w-full h-[5px] bg-[#E11900] rounded-[100px]"></div>
        <div 
          className="absolute top-0 left-0 h-[5px] bg-[#1AA06B] rounded-bl-[100px] rounded-tl-[100px]"
          style={{ width: `${((paidAmount + inProgressAmount) / totalAmount) * 100}%` }}
        ></div>
        <div 
          className="absolute top-0 h-[5px] bg-[#8BB956]"
          style={{ 
            left: `${(paidAmount / totalAmount) * 100}%`,
            width: `${(inProgressAmount / totalAmount) * 100}%`
          }}
        ></div>
      </div>

      {/* Status Items */}
      <div className="flex flex-col gap-1.5 w-full">

        {/* Paid */}
        {anyAmountPaid && (
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row gap-1.5 items-center">
              <div className="w-2.5 h-2.5 bg-[#1AA06B] rounded-full"></div>
              <Typography
                text="Paid"
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500"}
              />
            </div>
            <Typography
              text={formatIncomingCurrencyWithNumber({
                value: paidAmount,
                currency: invoice?.expectedCurrency,
                minFractionDigits: 2,
                maxFractionDigits: 2,
              })}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontWeight={"700"}
              textClasses={"!text-black-700"}
            />
          </div>
        )}

        {/* Settlement in progress */}
        {anyAmountInprogress && (
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row gap-1.5 items-center">
              <div className="w-2.5 h-2.5 bg-[#8BB956] rounded-full"></div>
              <Typography
                text="Settlement in progress"
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500"}
              />
            </div>
            <Typography
              text={formatIncomingCurrencyWithNumber({
                value: inProgressAmount,
                currency: invoice?.expectedCurrency,
                minFractionDigits: 2,
                maxFractionDigits: 2,
              })}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontWeight={"700"}
              textClasses={"!text-black-700"}
            />
          </div>
        )}

        {/* Outstanding */}
        {anyAmountOutstanding && (
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row gap-1.5 items-center">
              <div className="w-2.5 h-2.5 bg-[#E11900] rounded-full"></div>
              <Typography
                text="Outstanding"
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500"}
              />
            </div>
            <Typography
              text={formatIncomingCurrencyWithNumber({
                value: outstandingAmount,
                currency: invoice?.expectedCurrency,
                minFractionDigits: 2,
                maxFractionDigits: 2,
              })}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontWeight={"700"}
              textClasses={"!text-black-700"}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const BottomPart = (props: Props) => {
  const analytics = useAnalytics();
  const { invoice } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastMessages();

  const isTest = invoice.isTest;
  const entityType = isTest ? EntityTypes.TEST_INVOICE : EntityTypes.INVOICE;

  const isFiraAvailable = invoice.transaction?.some(t => t.fira?.fileUrl);
  const isReceiptAvailable = invoice.transaction?.some(t => t.payment?.paymentReceipt?.fileUrl);

  const anyDocAvailable = isFiraAvailable || isReceiptAvailable;
  const bothDocAvailable = isFiraAvailable && isReceiptAvailable;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if(!anyDocAvailable) return null;

  const handleDownloadFira = (e: React.MouseEvent) => {
    e.stopPropagation();
    void downloadFile({
      url: getFileDownloadUrl({ docType: DocTypes.FIRA, entityType: entityType, entityId: invoice.id }),
      onDownloadError: () => {
        addToast({
          id: "fira",
          body: "Download failed",
          type: TOAST_TYPES.ERROR,
        });
        analytics?.trackAsync(Events.FIRA_DOWNLOAD_ERROR);
      },
      onDownloadComplete: () => {
        analytics?.trackAsync(Events.FIRA_DOWNLOAD_SUCCESS);
      }
    });
  };

  const handleDownloadReceipt = (e: React.MouseEvent) => {
    e.stopPropagation();
    void downloadFile({
      url: getFileDownloadUrl({ docType: DocTypes.PAYMENT_RECEIPT, entityType: entityType, entityId: invoice.id }),
      onDownloadError: () => {
        addToast({
          id: "receipt",
          body: "Download failed",
          type: TOAST_TYPES.ERROR,
        });
        analytics?.trackAsync(Events.SKYDO_RECEIPT_DOWNLOAD_ERROR);
      },
      onDownloadComplete: () => {
        analytics?.trackAsync(Events.SKYDO_RECEIPT_DOWNLOAD_SUCCESS);
      }
    });
    setShowDropdown(false);
  };

  // If only one document is available, show single download button
  if (!bothDocAvailable) {
    const buttonText = isFiraAvailable ? "Download FIRA" : "Download Skydo Receipt";
    const handleClick = isFiraAvailable ? handleDownloadFira : handleDownloadReceipt;
    
    return (
      <div className="mt-5 flex flex-row">
        <Button
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          title={buttonText}
          isDisabled={false}
          onButtonClick={handleClick}
          leftIcon={() => <DownloadIcon width={16} height={16} />}
          buttonClass="flex-1 !gap-x-1 !justify-center"
          textWrapperClass="!flex-none"
        />
      </div>
    );
  }

  // If both documents are available, show FIRA button with 3 dots
  return (
    <div className="mt-5 flex flex-row gap-2">
      <Button
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        title="Download FIRA"
        isDisabled={false}
        onButtonClick={handleDownloadFira}
        leftIcon={() => <DownloadIcon width={16} height={16} />}
        buttonClass="flex-1 !gap-x-1 !justify-center"
        textWrapperClass="!flex-none"
      />
      <div className="relative" ref={dropdownRef}>
        <Button
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          title=""
          isDisabled={false}
          onButtonClick={() => setShowDropdown(!showDropdown)}
          leftIcon={() => <ThreeDotsIcon />}
          buttonClass="!pr-0 pl-2"
        />
        {showDropdown && (
          <div className="absolute right-0 top-12 z-50 bg-white shadow-dropdown rounded-10px overflow-hidden">
            <div
              className="px-4 py-3 hover:bg-blue-50 flex flex-row gap-2 items-center cursor-pointer min-w-[200px]"
              onClick={handleDownloadReceipt}
            >
              <DownloadIcon width={16} height={16} />
              <Typography 
                text="Download Skydo Receipt" 
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const PaymentDetailsHeaderMobile = (props: Props) => {
  const { invoice, balanceSummaryData, balanceSummary } = props;

  return (
    <div className="bg-white rounded-10px p-4 flex flex-col w-full shadow-sm">
      <TopPart invoice={invoice} />
      <MiddleInvoiceAmount invoice={invoice} />
      <MiddlePart
        invoice={invoice}
        balanceSummaryData={balanceSummaryData}
        balanceSummary={balanceSummary}
      />
      <BottomPart invoice={invoice} />
    </div>
  );
}


export default PaymentDetailsHeaderMobile;