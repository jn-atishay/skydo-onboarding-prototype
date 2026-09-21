import Locale from "../../../util/locale/en";
import {
  formatDate,
  formatIncomingCurrency,
  formatIncomingCurrencyWithNumber,
  formatINDNumber,
  formatINRNumber,
  formatSkydoCharges,
} from "../../../util/formatters";
import { dateFormattingOptions } from "../../InvoiceDetails/TransactionTracker";
import SheildIcon from "../../Icons/SheildIcon";
import Typography from "../../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import React, { useContext, useEffect } from "react";
import classNames from "classnames";
import classnames from "classnames";
import { FXCalc } from "../../../types";
import Tooltip from "../../AtomicComponents/Tooltip";
import CurrencyToINRRateTooltip from "../CurrencyToINRRateTooltip";
import InfoIcon from "../../Icons/InfoIcon";
import { useRouter } from "next/router";
import FE_ROUTES from "../../../util/feRoutes";
import RefundableElement from "../../InvoiceDetails/Refundable";
import Triangle from "../../Triangle";
import { useTour } from "@reactour/tour";
import { AppTourContext } from "../../AppTour";
import useMobileVersionHook from "../useMobileVersionHook";
import { VIRTUAL_ACCOUNT_VENDOR } from "../../../constants/dashboardConstants";
import AEDTransactionFeeTooltip from "../AEDTransactionFeeTooltip";

const getSkydoCharges = (fxCalculation: FXCalc) =>
  formatSkydoCharges(fxCalculation?.chargeCurrency, fxCalculation?.localCharges, fxCalculation?.skydoFeesUSD);

const getSkydoFeesCopy = (fxCalculation: FXCalc) =>
  Locale.transactionFeeInvoiceCharges.replace("${charges}", getSkydoCharges(fxCalculation) || "-");

const getSKydoFeesCopyMobile = (fxCalculation: FXCalc): string => {
  const charges = getSkydoCharges(fxCalculation);
  return charges ? `(${charges})` : "-";
};

const Row = ({
  left,
  right,
  isBold,
  classname,
  typographySize,
  rightTextClasses,
}: {
  left: string | Function;
  right: string;
  isBold?: boolean;
  classname?: string;
  typographySize?: string;
  rightTextClasses?: string;
}) => {
  let config = isBold
    ? {
        type: TYPOGRAPHY_TYPES.LABEL,
        size: typographySize || TYPOGRAPHY_SIZES.SMALL,
      }
    : {
        type: TYPOGRAPHY_TYPES.PARA,
        size: TYPOGRAPHY_SIZES.X_SMALL,
        textClass: "!text-black-600",
      };

  return (
    <div className={classNames("flex_row_item_center justify-between", classname)}>
      {typeof left === "function" ? (
        left()
      ) : (
        <Typography text={left} type={config.type} size={config.size} textClasses={config.textClass} />
      )}
      <Typography
        text={right}
        type={config.type}
        size={config.size}
        textClasses={rightTextClasses || config.textClass}
      />
    </div>
  );
};

interface Props {
  fxCalculation: FXCalc;
  totalReceiveAmountTitle: string;
  containerClass?: string;
  isApportioned?: boolean;
  paymentId?: number;
  isRefundable?: boolean;
  isTest?: boolean;
  isSez: boolean;
  vendor?: string;
  transactionType?: string;
  isInstantSettlement?: boolean;
}

const FXCConversionCalculation = (props: Props) => {
  const {
    fxCalculation,
    totalReceiveAmountTitle,
    containerClass,
    isApportioned,
    paymentId,
    isRefundable,
    isTest,
    isSez,
    vendor,
    transactionType,
    isInstantSettlement,
  } = props;
  const {
    sourceCurrency,
    skydoFeesUSD,
    interBankRate,
    settledAmount,
    usdToInrRate,
    executedPricingCondition,
    chargeCurrency,
  } = fxCalculation;

  const regionalFeePercentage = transactionType === "AMAZON" ? 0.005 : 0.01;

  const isGlomoPayTransaction = vendor === VIRTUAL_ACCOUNT_VENDOR.GLOMO_PAY;

  const localCharges = fxCalculation.localCharges || 0;

  const regionalFee =
    skydoFeesUSD && skydoFeesUSD > 0
      ? localCharges
      : fxCalculation.amount && localCharges >= regionalFeePercentage * fxCalculation.amount
      ? fxCalculation.amount * regionalFeePercentage
      : 0;

  const showRegionalFeeCalculation = !isApportioned;

  const baseFee = skydoFeesUSD && skydoFeesUSD > 0 ? skydoFeesUSD : localCharges - regionalFee;

  const baseCurrency = skydoFeesUSD && skydoFeesUSD > 0 ? "USD" : sourceCurrency;

  const baseToInrRate = skydoFeesUSD && skydoFeesUSD > 0 ? usdToInrRate || 1 : interBankRate || 1;
  const aedToInrRate = interBankRate || 1;

  // Calculate INR amounts
  const baseFeeInINR = baseFee * baseToInrRate;
  const regionalFeeInINR = regionalFee * aedToInrRate;
  const totalFeeInINR = baseFeeInINR + regionalFeeInINR;
  const fxFormattedTimeStamp = formatDate(fxCalculation.interBankRateTimestamp, dateFormattingOptions);
  const router = useRouter();
  const { isOpen, setCurrentStep } = useTour();
  const { isMobile } = useMobileVersionHook();
  const { forceRenderAppTour } = useContext(AppTourContext);
  const fxRateTitle = fxFormattedTimeStamp
    ? Locale.fxTimeStamp.replace(":time", fxFormattedTimeStamp)
    : Locale.fxTimeStamp.replace("# :time", "");
  const fxRate = interBankRate
    ? formatINRNumber({
        value: interBankRate,
        isTrail: false,
        maximumFractionDigits: 4,
        formatOptions: { minimumFractionDigits: 4 },
      })
    : Locale.toBeDetermined;

  const onApportionedClick = () => {
    void router.push(FE_ROUTES.PAYMENTS_AND_CHARGES_DETAILS.replace("[payment_id]", String(paymentId)));
  };

  useEffect(() => {
    if (isOpen) {
      forceRenderAppTour();
    }
  }, [isOpen]);

  const handleForApportionedText = (text: string, hideApportionedText?: boolean) => {
    return (
      <Typography
        text={text}
        type={isMobile ? TYPOGRAPHY_TYPES.PARA : TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"!text-black-600 md:!text-black-700"}
      >
        {!isMobile && isApportioned && !hideApportionedText ? (
          <>
            <Typography
              text={Locale.apportionedFirst}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"ml-1"}
            />
            <Typography
              text={Locale.apportionedSecond}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-blue-400 cursor-pointer"}
              onTextClick={onApportionedClick}
            />
            )
          </>
        ) : undefined}
      </Typography>
    );
  };

  const renderSkydoFeesTextToolTip = (additionalToolTipComp?: () => JSX.Element) => {
    return (
      <Tooltip
        tooltipText={
          isGlomoPayTransaction ? (
            <AEDTransactionFeeTooltip
              baseFee={baseFee}
              baseCurrency={baseCurrency}
              regionalFee={regionalFee}
              invoiceAmount={fxCalculation.amount || 0}
              baseFeeInINR={baseFeeInINR}
              regionalFeeInINR={regionalFeeInINR}
              totalFeeInINR={totalFeeInINR}
              baseToInrRate={baseToInrRate}
              aedToInrRate={aedToInrRate}
              rateTimestamp={fxCalculation?.interBankRateTimestamp || new Date().toDateString()}
              showRegionalFeeCalculation={showRegionalFeeCalculation}
              showBaseFeeAsPercentage={false}
              regionalFeePercentage={regionalFeePercentage * 100}
            />
          ) : (
            <CurrencyToINRRateTooltip
              currencyToInrRate={
                fxCalculation.chargeCurrency == fxCalculation.sourceCurrency
                  ? formatINDNumber({ value: interBankRate, formatOptions: { minimumFractionDigits: 4 } })
                  : formatINDNumber({ value: usdToInrRate, formatOptions: { minimumFractionDigits: 4 } })
              }
              interBankRateTimestamp={fxCalculation?.interBankRateTimestamp || new Date().toDateString()}
              currency={chargeCurrency}
              executedCondition={executedPricingCondition}
              amount={
                fxCalculation.skydoFeesUSD
                  ? fxCalculation.skydoFeesUSD
                  : fxCalculation.localCharges
                  ? fxCalculation.localCharges
                  : 0
              }
              overrideExecutedPricingCondition={fxCalculation.overrideExecutedPricingCondition}
              showExecutedCondition={true}
            />
          )
        }
        tooltipTheme={"dark"}
      >
        <div className={"flex flex-row items-center"}>
          {additionalToolTipComp ? additionalToolTipComp() : null}
          <div className={classnames({ "p-1 -m-1": isGlomoPayTransaction && !additionalToolTipComp })}>
            <InfoIcon width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} containerClass={"md:ml-1 ml-[2px]"} />
          </div>
        </div>
      </Tooltip>
    );
  };

  const renderSkdoFeesText = () => {
    return (
      <div className={"flex flex-row items-center"}>
        <Typography
          text={isGlomoPayTransaction ? "Skydo transaction fee" : getSkydoFeesCopy(fxCalculation)}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-600"}
        />
        {renderSkydoFeesTextToolTip()}
      </div>
    );
  };

  const renderSkydoCreditToolTip = (additionalToolTipComp?: () => JSX.Element) => {
    return (
      <Tooltip
        tooltipText={
          fxCalculation.chargeCurrency == "USD" || fxCalculation.skydoCharges ? (
            <CurrencyToINRRateTooltip
              currencyToInrRate={
                "USD" == fxCalculation.sourceCurrency
                  ? formatINDNumber({ value: interBankRate, formatOptions: { minimumFractionDigits: 4 } })
                  : formatINDNumber({ value: usdToInrRate, formatOptions: { minimumFractionDigits: 4 } })
              }
              interBankRateTimestamp={fxCalculation?.interBankRateTimestamp || new Date().toDateString()}
              currency={"USD"}
              executedCondition={executedPricingCondition}
              amount={
                fxCalculation.skydoFeesUSD
                  ? fxCalculation.skydoFeesUSD
                  : fxCalculation.localCharges
                  ? fxCalculation.localCharges
                  : 0
              }
              overrideExecutedPricingCondition={fxCalculation.overrideExecutedPricingCondition}
              showExecutedCondition={false}
            />
          ) : (
            <div className={"flex flex-col items-start gap-2"}>
              <Typography
                text={Locale.usdToInr.replace(
                  "${usdToInr}",
                  String(
                    fxCalculation.sourceCurrency == "USD"
                      ? fxCalculation.interBankRate
                      : fxCalculation?.usdToInrRate || 0
                  )
                )}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_X_SMALL}
                textClasses={"!text-white"}
              />
              <Typography
                text={Locale.referralCreditTooltip
                  .replace("${usdCredit}", (fxCalculation.creditUsedUSD || 0).toString())
                  .replace(
                    "${usdToInr}",
                    String(
                      fxCalculation.sourceCurrency == "USD"
                        ? fxCalculation.interBankRate
                        : fxCalculation?.usdToInrRate || 0
                    )
                  )
                  .replace("${inrCredit}", String(fxCalculation.creditUsedINR || 0))}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_X_SMALL}
                textClasses={"!text-white"}
              />
            </div>
          )
        }
        tooltipTheme={"dark"}
      >
        <div className={"flex flex-row items-center"}>
          {additionalToolTipComp ? additionalToolTipComp() : null}
          <InfoIcon width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} containerClass={"md:ml-1 ml-[2px]"} />
        </div>
      </Tooltip>
    );
  };

  const renderSkdoCreditText = () => {
    return (
      <div className={"flex flex-row items-center"}>
        <Typography
          text={Locale.referralCreditApplied.replace(
            "${usdCredit}",
            String(
              formatINDNumber({
                value: fxCalculation.creditUsedUSD,
                formatOptions: { minimumFractionDigits: 2 },
              })
            )
          )}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-600"}
        />
        {renderSkydoCreditToolTip()}
      </div>
    );
  };

  const renderTestPaymentFeesCalculation = () => {
    return (
      <>
        <Typography
          text={Locale.trialPaymentFeeCalcMessageLineOne}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-600"}
          fontWeight={"400"}
        />
        <span className={"space-x-1"}>
          <Typography
            text={Locale.trialPaymentFeeCalcMessageLineTwo}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            fontWeight={"400"}
            textClasses={"!text-black-600"}
          />
          <a href="https://www.skydo.com/" rel="noopener noreferrer" target="_blank">
            <Typography
              text={Locale.clickHere}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontWeight={"400"}
              textClasses={"!text-blue-400"}
            />
          </a>
        </span>
      </>
    );
  };

  if (isMobile) {
    return (
      <div className={classnames("bg-black-50 px-[14px] py-3 mt-3 rounded ml-4")}>
        <div className={classNames("flex flex-row items-center justify-between mb-3")}>
          <Typography
            text={Locale.amountReceivedHeader}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-600"}
          />
          <Typography
            text={formatIncomingCurrencyWithNumber({
              value: fxCalculation?.amount,
              currency: fxCalculation.sourceCurrency,
              maxFractionDigits: 2,
              minFractionDigits: 2,
            })}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={"700"}
          />
        </div>

        <div className={classNames("flex flex-row items-start justify-between mb-3")}>
          <Typography
            text={fxRateTitle}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-600 w-3/5"}
          />
          <Typography text={fxRate} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} fontWeight={"700"} />
        </div>
        <div className={"rounded-40px flex_row_item_center w-fit"}>
          <SheildIcon isMobile={true} />
          <Typography
            text={Locale.liveFx}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-green-400 ml-1"}
          />
        </div>
        <hr className={"w-full border-black-400 my-3"} />

        {fxCalculation.convertedAmount ? (
          <div>
            <div className={classNames("flex flex-row items-start justify-between mb-[14px]")}>
              <Typography
                text={Locale.convertedAmount}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-600 w-3/5"}
              />
              <Typography
                text={formatINRNumber({
                  value: fxCalculation.convertedAmount,
                  formatOptions: { maximumFractionDigits: 2, minimumFractionDigits: 2 },
                })}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"700"}
              />
            </div>

            <div className={classNames("flex flex-row items-start justify-between mb-[10px]")}>
              <Typography
                text={Locale.skydoFeeAndGST}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-600 w-3/5"}
              />
              <Typography
                text={`- ${formatINRNumber({
                  value: fxCalculation?.totalSkydoCharges,
                  maximumFractionDigits: 2,
                  formatOptions: { minimumFractionDigits: 2 },
                })}`}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"700"}
              />
            </div>

            {isTest && (
              <div className={classNames("p-3 rounded flex flex-col bg-white w-full")}>
                {renderTestPaymentFeesCalculation()}
              </div>
            )}

            <div
              className={classNames("p-3 rounded flex flex-col bg-white w-full", {
                hidden: isTest,
              })}
            >
              <div className={classNames("flex flex-row items-start justify-between mb-[10px]")}>
                <div className={"flex flex-col gap-[2px]"}>
                  <Typography
                    text={"Skydo transaction fee"}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-600"}
                  />
                  {renderSkydoFeesTextToolTip(
                    isGlomoPayTransaction
                      ? undefined
                      : () => (
                          <Typography
                            text={getSKydoFeesCopyMobile(fxCalculation)}
                            type={TYPOGRAPHY_TYPES.PARA}
                            size={TYPOGRAPHY_SIZES.SMALL}
                            textClasses={"!text-black-600"}
                          />
                        )
                  )}
                </div>
                <Typography
                  text={formatINRNumber({
                    value: fxCalculation.inrChargesBeforeCredits || fxCalculation.skydoCharges,
                    maximumFractionDigits: 2,
                    formatOptions: { minimumFractionDigits: 2 },
                  })}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={""}
                />
              </div>

              {isInstantSettlement &&
                fxCalculation?.instantSettlementCharges &&
                fxCalculation.instantSettlementCharges > 0 && (
                  <div className={classNames("flex flex-row items-start justify-between mb-[10px]")}>
                    <div className={"flex flex-col gap-[2px]"}>
                      <div className={"flex flex-row items-center"}>
                        <Typography
                          text={Locale.instantSettlementFee}
                          type={TYPOGRAPHY_TYPES.PARA}
                          size={TYPOGRAPHY_SIZES.SMALL}
                          textClasses={"!text-black-600"}
                        />
                        <Tooltip
                          tooltipText={
                            <div className={"flex flex-col items-start gap-2"}>
                              <Typography
                                text={`Instant settlement fee: ${
                                  fxCalculation.instantSettlementChargesCurrency || ""
                                } ${formatINDNumber({
                                  value: fxCalculation.instantSettlementCharges,
                                  formatOptions: { minimumFractionDigits: 2 },
                                })}`}
                                type={TYPOGRAPHY_TYPES.PARA}
                                size={TYPOGRAPHY_SIZES.X_X_SMALL}
                                textClasses={"!text-white"}
                              />
                              {fxCalculation.interBankRate && (
                                <Typography
                                  text={`FX rate @ ${formatDate(
                                    fxCalculation.interBankRateTimestamp,
                                    dateFormattingOptions
                                  )}: ${formatINDNumber({
                                    value: fxCalculation.interBankRate,
                                    formatOptions: { minimumFractionDigits: 4 },
                                  })}`}
                                  type={TYPOGRAPHY_TYPES.PARA}
                                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                                  textClasses={"!text-white"}
                                />
                              )}
                              <Typography
                                text={`Converted to INR: ${formatINRNumber({
                                  // INR value comes from transaction.pricingRecord.instantSettlementChargesInr (from backend)
                                  value: fxCalculation.instantSettlementChargesInr || 0,
                                  formatOptions: { minimumFractionDigits: 2 },
                                })}`}
                                type={TYPOGRAPHY_TYPES.PARA}
                                size={TYPOGRAPHY_SIZES.X_X_SMALL}
                                textClasses={"!text-white"}
                              />
                            </div>
                          }
                          tooltipTheme={"dark"}
                        >
                          <InfoIcon
                            width={isMobile ? 14 : 16}
                            height={isMobile ? 14 : 16}
                            containerClass={"md:ml-1 ml-[2px]"}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <Typography
                      text={formatINRNumber({
                        // INR value comes from transaction.pricingRecord.instantSettlementChargesInr (from backend)
                        value: fxCalculation.instantSettlementChargesInr || 0,
                        maximumFractionDigits: 2,
                        formatOptions: { minimumFractionDigits: 2 },
                      })}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      fontWeight={""}
                    />
                  </div>
                )}

              <div className={classNames("flex flex-row items-start justify-between mb-[10px]")}>
                <div className={"flex flex-col gap-[2px]"}>
                  <Typography
                    text={"Referral discount"}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-600"}
                  />
                  {renderSkydoCreditToolTip(() => (
                    <Typography
                      text={`(USD ${String(
                        formatINDNumber({
                          value: fxCalculation.creditUsedUSD,
                          formatOptions: { minimumFractionDigits: 2 },
                        })
                      )})`}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={"!text-black-600"}
                    />
                  ))}
                </div>
                <Typography
                  text={
                    "- " +
                    formatINRNumber({
                      value: fxCalculation?.creditUsedINR,
                      maximumFractionDigits: 2,
                      formatOptions: { minimumFractionDigits: 2 },
                    })
                  }
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={""}
                />
              </div>

              <hr className={"w-full border-black-400 mb-[10px] border-dashed"} />

              <div className={classNames("flex flex-row items-start justify-between mb-[10px]")}>
                <Typography
                  text={Locale.totalTransactionFee}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-600 w-3/5"}
                />
                <Typography
                  text={formatINRNumber({
                    value: fxCalculation?.skydoCharges,
                    maximumFractionDigits: 2,
                    formatOptions: { minimumFractionDigits: 2 },
                  })}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={""}
                />
              </div>

              <div className={classNames("flex flex-row items-start justify-between mb-[10px]")}>
                <div className={"flex flex-col gap-[2px]"}>
                  <Typography
                    text={"GST"}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-600"}
                  />
                  <Typography
                    text={`(${isSez ? "0" : "18"}% transaction fee)`}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-600"}
                  />
                </div>
                <Typography
                  text={formatINRNumber({
                    value: fxCalculation?.skydoChargesTax,
                    maximumFractionDigits: 2,
                    formatOptions: { minimumFractionDigits: 2 },
                  })}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={""}
                />
              </div>

              <hr className={"w-full border-black-400 mb-[10px] border-dashed"} />

              <div className={classNames("flex flex-row items-start justify-between mb-[10px]")}>
                <Typography
                  text={Locale.total}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-600 w-3/5"}
                />
                <Typography
                  text={formatINRNumber({
                    value: fxCalculation?.totalSkydoCharges,
                    maximumFractionDigits: 2,
                    formatOptions: { minimumFractionDigits: 2 },
                  })}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={""}
                />
              </div>
            </div>
          </div>
        ) : null}

        <hr className={"w-full border-black-400 my-[10px]"} />

        <div className={classNames("flex flex-row items-center justify-between")}>
          <Typography
            text={"You'll receive"}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-600"}
          />
          <Typography
            text={
              settledAmount
                ? formatINRNumber({ value: settledAmount, formatOptions: { minimumFractionDigits: 2 } })
                : Locale.toBeDetermined
            }
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={"700"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={classnames("bg-black-50 md:p-6 px-[14px] py-3 mt-4 ", containerClass)}>
      <Row
        left={Locale.amountReceivedHeader}
        right={formatIncomingCurrencyWithNumber({
          value: fxCalculation?.amount,
          currency: fxCalculation.sourceCurrency,
          maxFractionDigits: 2,
          minFractionDigits: 2,
        })}
        isBold
        classname={"mb-4"}
      />
      <Row
        left={fxRateTitle}
        right={fxRate}
        classname={"mb-1"}
        isBold
        rightTextClasses={!interBankRate ? "!text-black-500" : ""}
      />
      <div className={"px-2 py-1 rounded-40px flex_row_item_center bg-green-300 w-fit"}>
        <SheildIcon isSmall={true} />
        <Typography
          text={Locale.liveFx}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_X_SMALL}
          textClasses={"!text-white ml-1"}
        />
      </div>
      <hr className={"w-full border-black-400 my-4"} />
      {fxCalculation.convertedAmount ? (
        <>
          <Row
            left={Locale.convertedAmount}
            right={formatINRNumber({
              value: fxCalculation.convertedAmount,
              formatOptions: { maximumFractionDigits: 2, minimumFractionDigits: 2 },
            })}
            isBold
            classname={"mb-1"}
          />
          <Row
            left={() => {
              return (
                <div className={"flex flex-row items-center space-x-2"}>
                  {handleForApportionedText(Locale.skydoFeeAndGST)}{" "}
                  {fxCalculation.creditUsedUSD ? <RefundableElement text={Locale.referralAutoApplied} /> : null}
                  {isTest ? <RefundableElement text={Locale.trialPaymentFeeWaiver} /> : null}
                </div>
              );
            }}
            right={`- ${formatINRNumber({
              value: fxCalculation?.totalSkydoCharges,
              maximumFractionDigits: 2,
              formatOptions: { minimumFractionDigits: 2 },
            })}`}
            isBold
            classname={"mt-4"}
            rightTextClasses={isTest ? "!text-green-400" : ""}
          />
          {/*
         Render transaction fee, gst charges and total skydo charges with white background and rounded corners and Triangle at top write
      */}
          <div className={"mt-2 px-4 py-2 rounded-5px flex flex-col bg-white w-full relative"}>
            <Triangle containerClass={"absolute right-4 -top-2"} />
            {isTest ? (
              renderTestPaymentFeesCalculation()
            ) : (
              <>
                <Row
                  left={renderSkdoFeesText}
                  right={formatINRNumber({
                    value: fxCalculation.inrChargesBeforeCredits || fxCalculation.skydoCharges,
                    maximumFractionDigits: 2,
                    formatOptions: { minimumFractionDigits: 2 },
                  })}
                  classname={"mb-1"}
                />
                {isInstantSettlement &&
                  fxCalculation?.instantSettlementCharges &&
                  fxCalculation.instantSettlementCharges > 0 && (
                    <Row
                      left={() => (
                        <div className={"flex flex-row items-center"}>
                          <Typography
                            text={Locale.instantSettlementFee}
                            type={TYPOGRAPHY_TYPES.PARA}
                            size={TYPOGRAPHY_SIZES.X_SMALL}
                            textClasses={"!text-black-600"}
                          />
                          <Tooltip
                            tooltipText={
                              <div className={"flex flex-col items-start gap-2"}>
                                <Typography
                                  text={`Instant settlement fee: ${
                                    fxCalculation.instantSettlementChargesCurrency || ""
                                  } ${formatINDNumber({
                                    value: fxCalculation.instantSettlementCharges,
                                    formatOptions: { minimumFractionDigits: 2 },
                                  })}`}
                                  type={TYPOGRAPHY_TYPES.PARA}
                                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                                  textClasses={"!text-white"}
                                />
                                {fxCalculation.interBankRate && (
                                  <Typography
                                    text={`FX rate @ ${formatDate(
                                      fxCalculation.interBankRateTimestamp,
                                      dateFormattingOptions
                                    )}: ${formatINDNumber({
                                      value: fxCalculation.interBankRate,
                                      formatOptions: { minimumFractionDigits: 4 },
                                    })}`}
                                    type={TYPOGRAPHY_TYPES.PARA}
                                    size={TYPOGRAPHY_SIZES.X_X_SMALL}
                                    textClasses={"!text-white"}
                                  />
                                )}
                                <Typography
                                  text={`Converted to INR: ${formatINRNumber({
                                    // INR value comes from transaction.pricingRecord.instantSettlementChargesInr (from backend)
                                    value: fxCalculation.instantSettlementChargesInr || 0,
                                    formatOptions: { minimumFractionDigits: 2 },
                                  })}`}
                                  type={TYPOGRAPHY_TYPES.PARA}
                                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                                  textClasses={"!text-white"}
                                />
                              </div>
                            }
                            tooltipTheme={"dark"}
                          >
                            <InfoIcon
                              width={isMobile ? 14 : 16}
                              height={isMobile ? 14 : 16}
                              containerClass={"md:ml-1 ml-[2px]"}
                            />
                          </Tooltip>
                        </div>
                      )}
                      right={formatINRNumber({
                        // INR value comes from transaction.pricingRecord.instantSettlementChargesInr (from backend)
                        value: fxCalculation.instantSettlementChargesInr || 0,
                        maximumFractionDigits: 2,
                        formatOptions: { minimumFractionDigits: 2 },
                      })}
                      classname={"mb-1"}
                    />
                  )}
                {fxCalculation?.creditUsedINR !== 0 && (
                  <Row
                    left={renderSkdoCreditText}
                    right={
                      "- " +
                      formatINRNumber({
                        value: fxCalculation?.creditUsedINR,
                        maximumFractionDigits: 2,
                        formatOptions: { minimumFractionDigits: 2 },
                      })
                    }
                    classname={"mb-1"}
                  />
                )}
                <hr className={"w-full border-black-400 my-1 border-dashed"} />
                <Row
                  left={Locale.totalTransactionFee}
                  right={formatINRNumber({
                    value: fxCalculation?.skydoCharges,
                    maximumFractionDigits: 2,
                    formatOptions: { minimumFractionDigits: 2 },
                  })}
                  classname={"mb-1"}
                />
                <Row
                  left={isSez ? Locale.sezGstAmount : Locale.gstAmount}
                  right={formatINRNumber({
                    value: fxCalculation?.skydoChargesTax,
                    maximumFractionDigits: 2,
                    formatOptions: { minimumFractionDigits: 2 },
                  })}
                  classname={"mt-1"}
                />
                <hr className={"w-full border-black-400 my-1 border-dashed"} />
                <Row
                  left={Locale.total}
                  right={formatINRNumber({
                    value: fxCalculation?.totalSkydoCharges,
                    maximumFractionDigits: 2,
                    formatOptions: { minimumFractionDigits: 2 },
                  })}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <Row
            isBold
            left={() => handleForApportionedText(Locale.skydoFeeUsd, !skydoFeesUSD)}
            right={skydoFeesUSD ? formatIncomingCurrency(skydoFeesUSD, sourceCurrency) : Locale.toBeDetermined}
            rightTextClasses={!skydoFeesUSD ? "text-black-500" : ""}
            classname={"mb-4"}
          />
          <Row isBold left={Locale.skydoFeeAndGst} right={Locale.toBeDetermined} rightTextClasses={"text-black-500"} />
        </>
      )}

      <hr className={"w-full border-black-400 my-4"} />
      <Row
        isBold
        left={totalReceiveAmountTitle}
        right={
          settledAmount
            ? formatINRNumber({ value: settledAmount, formatOptions: { minimumFractionDigits: 2 } })
            : Locale.toBeDetermined
        }
        typographySize={TYPOGRAPHY_SIZES.MEDIUM}
        rightTextClasses={!settledAmount ? "!text-black-500" : ""}
      />
    </div>
  );
};

export default FXCConversionCalculation;
