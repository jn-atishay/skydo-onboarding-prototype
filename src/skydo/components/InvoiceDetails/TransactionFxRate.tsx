import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import React from "react";
import { FXCalc, FXDeal, Transaction } from "../../types";
import FXCConversionCalculation from "../Common/InvoicePaymentsCommonComponents/FXCConversionCalculation";
import { isNicheCurrency, roundTo } from "../../util/functions";
import FE_ROUTES from "../../util/feRoutes";
import { useRouter } from "next/router";
import { LOCATION_CODE, LOCATION_CURRENCY_MAP } from "../../constants/dashboardConstants";
import RefundableElement from "./Refundable";
import WaiveSkydoFeeNote from "./WaiveSkydoFeeNote";
import { formatINDNumber } from "../../util/formatters";
import useReferralStore from "../../store/useReferralStore";
import { ALEXA_CAMPAIGN_KEY } from "../ReferralCampaigns/campaigns.config";
import useMobileVersionHook from "../Common/useMobileVersionHook";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  fxDeal?: FXDeal;
  currency: string;
  transaction?: Transaction | null;
  isPassed?: boolean;
  isCurr?: boolean;
  isFirstPayment?: boolean;
  isTest?: boolean;
  isSez: boolean;
  isInstantSettlement?: boolean;
  transactionCreationSource?: string | null;
  invoiceAmount?: number;
}

const TransactionFxRate = (props: Props) => {
  const {
    currency,
    transaction,
    isPassed,
    isCurr,
    isFirstPayment,
    isTest,
    isSez,
    isInstantSettlement,
    transactionCreationSource,
    invoiceAmount,
  } = props;
  const fxDeal = transaction?.payment?.fxDeal;
  const isFxConversionDone = isPassed || isCurr;
  const router = useRouter();
  const analytics = useAnalytics();
  const { isMobile } = useMobileVersionHook();

  const { userReferralData, activeCampaign } = useReferralStore();
  const isAlexaCampaignActive = activeCampaign?.name === ALEXA_CAMPAIGN_KEY;

  const fxCalculation: FXCalc = {
    amount: transaction?.amount,
    sourceCurrency: currency,
    convertedAmount: roundTo((transaction?.amountSettled || 0) + (transaction?.pricingRecord?.totalCharges || 0), 2),
    skydoFeesUSD: transaction?.pricingRecord?.usdCharges,
    localCharges: transaction?.pricingRecord?.localCharges,
    executedPricingCondition: transaction?.payment?.executedPricingCondition,
    pricingBucket: transaction?.payment?.pricingBucket,
    interBankRate: fxDeal?.interbankRate,
    settledAmount: transaction?.amountSettled,
    interBankRateTimestamp: fxDeal?.ibrTimestamp || fxDeal?.bookingTimeStamp || "",
    usdToInrRate: fxDeal?.usdToInrRate,
    totalSkydoCharges: transaction?.pricingRecord?.totalCharges,
    skydoCharges: transaction?.pricingRecord?.inrCharges,
    skydoChargesTax: transaction?.pricingRecord?.tax,
    chargeCurrency: transaction?.pricingRecord?.localCharges ? transaction?.currency : "USD",
    overrideExecutedPricingCondition:
      transaction?.payment?.transaction?.length != 1 || transaction?.pricingRecord?.totalCharges == 0,
    creditUsedUSD: transaction?.pricingRecord?.creditUsedUSD,
    creditUsedINR: transaction?.pricingRecord?.creditUsedINR,
    inrChargesBeforeCredits: transaction?.pricingRecord?.inrChargesBeforeCredits,
    instantSettlementCharges: transaction?.pricingRecord?.instantSettlementCharges,
    instantSettlementChargesCurrency: transaction?.pricingRecord?.instantSettlementChargesCurrency,
    instantSettlementChargesInr: transaction?.pricingRecord?.instantSettlementChargesInr,
  };

  const skydoFees = transaction?.pricingRecord?.usdCharges;
  const skydoFeesFormatted = !isTest
    ? skydoFees
      ? `${LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]} ${skydoFees.toFixed(2)}`
      : Locale.toBeDetermined
    : "";

  const isApportioned = (transaction?.payment?.transaction?.length || 0) > 1;
  const paymentId = transaction?.payment?.id;

  // Get vendor for passing to FXCConversionCalculation
  const vendor = transaction?.vendor || transaction?.funding?.[0]?.vendor;
  const transactionAmount = transaction?.amount || 0;

  const onViewApportionedClick = () => {
    void router.push(FE_ROUTES.PAYMENTS_AND_CHARGES_DETAILS.replace("[payment_id]", String(paymentId)));
  };

  const renderNoteCta = () => {
    if (isMobile) return null;
    if (isApportioned || transaction?.collectionType == "PAYOUT") return null;
    if (transaction?.payment?.creditUsedUSD || 0.0 > 0) {
      return (
        <RefundableElement
          text={transaction?.payment?.creditUsedUSD ? Locale.referralAutoApplied : Locale.refundApplicable}
          containerClasses={"ml-2"}
        />
      );
    } else if (userReferralData?.rewardData?.rewardValue || 0.0 > 0) {
      return <RefundableElement text={Locale.refundApplicable} containerClasses={"ml-2"} />;
    }
    if (isTest) {
      return <RefundableElement text={Locale.trialPaymentFeeWaiver} containerClasses={"ml-2"} />;
    }
    if (isAlexaCampaignActive || transactionCreationSource === "WITHDRAWAL") return null;
    return <WaiveSkydoFeeNote containerClasses={"ml-2"} text={"Please check this out"} />;
  };

  const renderViewFeesCta = () => {
    if (isMobile) return null;
    return (
      <Typography
        text={Locale.viewStandardSkydoFees}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"!text-blue-400 cursor-pointer"}
        onTextClick={() => {
          analytics.trackAsync(Events.SKYDO_FEES.INVOICE_DETAIL_LINK_CLICKED, {
            invoice_id: router.query.invoice_id,
            invoice_amount: transaction?.amount || invoiceAmount,
            invoice_currency: currency,
          });
          void router.push(FE_ROUTES.SKYDO_FEES);
        }}
      />
    );
  };

  return isFxConversionDone ? (
    <FXCConversionCalculation
      fxCalculation={fxCalculation}
      totalReceiveAmountTitle={Locale.finalReceived}
      containerClass={"ml-10"}
      isApportioned={isApportioned}
      paymentId={paymentId}
      isRefundable={isFirstPayment && transaction?.settlementDate !== null}
      isTest={isTest}
      isSez={isSez}
      vendor={vendor}
      transactionType={transaction?.collectionType}
      isInstantSettlement={isInstantSettlement}
    />
  ) : (
    <div className={"flex flex-col md:ml-10 ml-6"}>
      <Typography text={Locale.fxTobeDetermined} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500 mt-1"} />
      <div className={"flex flex-row items-end"}>
        <Typography
          text={(isNicheCurrency(currency) ? Locale.skydoFeeWithRegionalCurrencyFee : Locale.skydoFee).replace(
            "${skydoFees}",
            skydoFeesFormatted
          )}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 mt-1"}
        >
          {!isMobile && isApportioned ? (
            <>
              <Typography
                text={Locale.apportionedFirst}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"ml-1 !text-black-500"}
              />
              <Typography
                text={Locale.apportionedSecond}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-blue-400 cursor-pointer"}
                onTextClick={onViewApportionedClick}
              />
              )
            </>
          ) : undefined}
        </Typography>
        {renderNoteCta()}
      </div>
      {renderViewFeesCta()}
      {fxCalculation.creditUsedUSD ? (
        <Typography
          text={Locale.creditToBeUsed.replace(
            "${usdCredit}",
            String(
              formatINDNumber({
                value: fxCalculation.creditUsedUSD,
                formatOptions: { minimumFractionDigits: 2 },
              })
            )
          )}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 mt-1"}
        />
      ) : null}
      <Typography text={Locale.toBeReceived} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500 mt-1"} />
    </div>
  );
};

export default TransactionFxRate;
