import React, { useState } from "react";
import Image from "next/image";
import Typography from "../AtomicComponents/Typography";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import type { BalanceInvoiceSummaryResult } from "../../types/SkydoBalance";
import type { BankAccount } from "../../types";
import Tooltip from "../AtomicComponents/Tooltip";
import FE_ROUTES from "../../util/feRoutes";
import { useRouter } from "next/router";
import InformationIcon from "../Icons/InformationIcon";
import AmountDisplay from "../AmountWithFraction/AmountDisplay";
import { ArrowDirection, ArrowIconSmallRotated } from "../Icons/ArrowIconSmall";
import ExclamationIcon from "../Icons/ExclamationIcon";

interface Props {
  summary: BalanceInvoiceSummaryResult;
  bankAccount?: BankAccount | null;
  loading?: boolean;
}

const BalanceInvoiceSummaryCard = (props: Props) => {
  const { summary, bankAccount, loading } = props;
  const currency = summary.currency;
  const router = useRouter();
  const [showUtilisedDetails, setShowUtilisedDetails] = useState(false);

  const utilisedTotal = summary.skydoFees + summary.outwardPayments + summary.withdrawalAmount;
  const availableFunds = summary.mappedAmount - utilisedTotal;

  const bankName = bankAccount?.bankMetadata?.bankName ?? "";
  const bankLogoUrl = bankAccount?.bankMetadata?.logoURL ?? "";
  const accountNumber = bankAccount?.accountNumber ?? "";
  const accountLast4 = accountNumber ? accountNumber.slice(-4) : "";

  const divider = <div className="border w-full border-black-200 border-dashed" />;

  if (loading) {
    return (
      <div className="rounded-[10px] overflow-hidden border border-black-200 bg-black-50">
        <div className="bg-black-100 border-b border-black-200 px-4 py-4">
          <Typography
            text={Locale.balanceInvoiceSummaryTitle}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={700}
            textClasses="!text-black-700"
          />
        </div>
        <div className="p-4">
          <div className="h-20 bg-black-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] overflow-hidden border border-black-200 bg-white">
      {/* Header */}
      <div className="flex bg-black-100 border-b border-black-200 px-4 py-4 gap-2.5 items-center">
        <Image
          src="/images/SkydoBalanceIcon.png"
          alt="Skydo balance"
          width={20}
          height={20}
          className="shrink-0 align-middle"
        />
        <Typography
          text={Locale.balanceInvoiceSummaryTitle}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={700}
          textClasses="!text-black-700"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-4 bg-black-50">
        {/* Received amount */}
        <div className="flex items-center justify-between">
          <Typography
            text={Locale.balanceInvoiceSummaryReceivedAmount}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={600}
            textClasses="!text-black-500"
          />
          <div className={"flex flex-row items-center gap-1"}>
            <AmountDisplay amount={summary.mappedAmount + summary.mappedAmountUnderVerification} currency={currency} />
            {summary.mappedAmountUnderVerification > 0 ? (
              <Tooltip
                tooltipText={
                    <Typography
                      text={Locale.balanceInvoiceSummaryPendingVerificationsTooltip}
                      textClasses={"!text-white !leading-5"}
                      fontWeight={400}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.MEDIUM}
                    />
                }
                tooltipTheme={"dark"}
                position={TOOLTIP_POSITION.TOP}
              >
                <ExclamationIcon strokeColor={"#FFC043"} type={"outline"} height={16} width={16} />
              </Tooltip>
            ) : null}
          </div>
        </div>

        {divider}

        {/* Utilised amount (toggle) */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => setShowUtilisedDetails(!showUtilisedDetails)}
            className="flex items-center gap-1 text-left"
          >
            <Typography
              text={Locale.balanceInvoiceSummaryUtilisedAmount}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses="!text-black-500 !font-semibold"
            />
            <Typography
              text={
                showUtilisedDetails ? Locale.balanceInvoiceSummaryHideDetails : Locale.balanceInvoiceSummaryShowDetails
              }
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={600}
              textClasses="!text-blue-400 !cursor-pointer"
            />
          </div>
          <AmountDisplay amount={-utilisedTotal} currency={currency} />
        </div>

        {showUtilisedDetails && (
          <div className="flex flex-col gap-2 rounded-[10px] bg-white p-4">
            {/* Skydo fees with tooltip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Typography
                  text={Locale.balanceInvoiceSummarySkydoFees}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-black-500 !font-semibold"
                />
                <Tooltip
                  tooltipText={
                      <Typography
                        text={Locale.balanceInvoiceSummarySkydoFeesTooltip}
                        textClasses={"!text-white !leading-5"}
                        fontWeight={400}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.MEDIUM}
                      />
                  }
                  position={TOOLTIP_POSITION.TOP}
                  arrow={true}
                  tooltipTheme="dark"
                >
                  <InformationIcon height={16} width={16} />
                </Tooltip>
              </div>
              <AmountDisplay amount={-summary.skydoFees} currency={currency} />
            </div>

            {divider}

            {/* Payout amount */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Typography
                  text={Locale.balanceInvoiceSummaryPayoutAmount}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-black-500 !font-semibold"
                />

                <Tooltip
                  tooltipText={
                      <Typography
                        text={Locale.balanceInvoicePayoutAmountDisclaimer}
                        textClasses={"!text-white !leading-5"}
                        fontWeight={400}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.MEDIUM}
                      />
                  }
                  position={TOOLTIP_POSITION.TOP}
                  arrow={true}
                  tooltipTheme="dark"
                >
                  <InformationIcon height={16} width={16} />
                </Tooltip>
              </div>
              <AmountDisplay amount={-summary.outwardPayments} currency={currency} />
            </div>

            {divider}

            {/* Withdrawn to (bank details) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 min-w-0">
                <Typography
                  text={Locale.balanceInvoiceSummaryWithdrawnTo}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-black-500 !font-semibold shrink-0"
                />
                {bankLogoUrl ? (
                  <Image src={bankLogoUrl} alt={bankName} width={16} height={16} className="shrink-0 align-middle" />
                ) : null}
                <Typography
                  text={bankName}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-black-500 !font-semibold truncate"
                />
                {accountLast4 ? (
                  <Typography
                    text={Locale.balanceInvoiceSummaryAccountSuffix.replace(":account", accountLast4)}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="!text-black-500 !font-semibold ml-1 truncate"
                  />
                ) : null}
              </div>
              <AmountDisplay amount={-summary.withdrawalAmount} currency={currency} />
            </div>
          </div>
        )}

        {divider}

        {/* Available funds */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <Typography
              text={Locale.balanceInvoiceSummaryAvailableFunds}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses="!text-black-700 !font-bold"
            />
            <AmountDisplay
              amount={availableFunds}
              currency={currency}
              integerTypographySize={TYPOGRAPHY_SIZES.MEDIUM}
            />
          </div>
          <Typography
            text={Locale.balanceInvoiceSummaryAvailableFundsSubtext}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses="!text-black-500"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black-100 border-t border-black-200 px-4 py-2.5 flex items-center justify-end">
        <Typography
          text={Locale.balanceInvoiceSummaryWithdrawFunds}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          onTextClick={() => router.push(FE_ROUTES.SKYDO_BALANCE)}
          textClasses="!text-blue-400 !cursor-pointer flex flex-row"
        >
          <ArrowIconSmallRotated stroke="#5B91F4" width={16} height={16} direction={ArrowDirection.RIGHT} />
        </Typography>
      </div>
    </div>
  );
};

export default BalanceInvoiceSummaryCard;
