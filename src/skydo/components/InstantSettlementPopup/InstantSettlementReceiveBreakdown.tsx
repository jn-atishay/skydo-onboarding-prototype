import React from "react";
import Typography from "../AtomicComponents/Typography";
import Tooltip from "../AtomicComponents/Tooltip";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import InformationIconV2 from "../Icons/InfomationIconV2";
import RateLoaderIcon from "../Icons/RateLoaderIcon";
import InstantSettlementLiveRateIcon from "../Icons/InstantSettlementLiveRateIcon";
import Locale from "../../util/locale/en";
import { CURRENCY_SYMBOL_MAP, formatINDNumber, formatIncomingCurrencyWithNumber, roundTo } from "../../util/formatters";
import { CURRENCY_CODE } from "../../constants/dashboardConstants";
import { InstantSettlementInrBreakdown, InstantSettlementPreviewBreakdown } from "../../types";
import { toAmount } from "../../util/instantSettlementUtil";

interface Props {
  breakdown: InstantSettlementPreviewBreakdown | null;
  inrBreakdown: InstantSettlementInrBreakdown | null;
  // true during a refresh re-quote — shows the "Loading live rate" badge over the last good value.
  isLoading: boolean;
}

const formatInr = (value: number): string =>
  `${CURRENCY_CODE.INR} ${formatINDNumber({
    value,
    maximumFractionDigits: 2,
    formatOptions: { minimumFractionDigits: 2 },
  })}`;

const BreakdownRow = ({
  label,
  value,
  isDeduction = false,
  emphasize = false,
}: {
  label: string;
  value: string;
  isDeduction?: boolean;
  emphasize?: boolean;
}) => {
  const textClasses = emphasize ? "!text-white !font-bold" : "!text-white";
  const signedValue = isDeduction ? `- ${value}` : value;
  return (
    <div className="flex flex-row justify-between items-center gap-6">
      <Typography text={label} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={textClasses} />
      <Typography
        text={signedValue}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={textClasses}
      />
    </div>
  );
};

const InstantSettlementReceiveBreakdown = ({ breakdown, inrBreakdown, isLoading }: Props) => {
  if (!breakdown || !inrBreakdown) return null;

  // Gross is already INR → no FX conversion, so the live-rate badge/row is hidden.
  const isInrGross = breakdown.grossAmount.currency === CURRENCY_CODE.INR;

  const renderFxBadge = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-1 rounded-40px bg-green-300 px-3 py-1">
          <RateLoaderIcon width={12} height={12} className="animate-spin" />
          <Typography
            text={Locale.instantSettlementLoadingLiveRate}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_X_SMALL}
            textClasses="!text-white"
          />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center gap-1 rounded-40px bg-green-300 px-3 py-1">
        <InstantSettlementLiveRateIcon width={13} height={14} />
        <Typography
          text={Locale.instantSettlementLiveFx.replace(":rate", `${CURRENCY_CODE.INR} ${inrBreakdown.fxRateUsed}`)}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_X_SMALL}
          textClasses="!text-white"
        />
      </div>
    );
  };

  const renderTooltipBreakdown = () => {
    const showRegionalPremium = inrBreakdown.regionalPremiumInr > 0;
    const showGst = inrBreakdown.gstInr > 0;
    const instantSettlementFeePercent = roundTo(breakdown.instantSettlementFeePercentage * 100, 2);
    const flatBaseFee = formatIncomingCurrencyWithNumber({
      value: toAmount(breakdown.platformFee.amount),
      minFractionDigits: 0,
      maxFractionDigits: 2,
    });
    const flatBaseFeeSymbol =
      CURRENCY_SYMBOL_MAP[breakdown.platformFee.currency] ??
      (breakdown.platformFee.currency === CURRENCY_CODE.USD ? "$" : undefined);
    const baseFeeDescriptor =
      breakdown.platformFeePercentage != null
        ? `${roundTo(breakdown.platformFeePercentage * 100, 2)}%`
        : flatBaseFeeSymbol
        ? `${flatBaseFeeSymbol}${flatBaseFee}`
        : `${breakdown.platformFee.currency} ${flatBaseFee}`;

    return (
      <div className="flex flex-col gap-2 px-2 py-2">
        {/* Quote: settlement amount + live rate */}
        <BreakdownRow
          label={Locale.instantSettlementSettlementAmount}
          value={formatIncomingCurrencyWithNumber({
            value: toAmount(breakdown.grossAmount.amount),
            currency: breakdown.grossAmount.currency,
            minFractionDigits: 2,
            maxFractionDigits: 2,
          })}
        />
        {!isInrGross && (
          <BreakdownRow
            label={Locale.instantSettlementFxRate}
            value={`${CURRENCY_CODE.INR} ${inrBreakdown.fxRateUsed}`}
          />
        )}

        {/* Breakdown: converted amount − fees − GST */}
        <div className="flex flex-col gap-2 border-t border-dotted border-black-500 pt-2">
          <BreakdownRow label={Locale.instantSettlementConvertedAmount} value={formatInr(inrBreakdown.grossInr)} />
          <BreakdownRow
            label={Locale.instantSettlementBaseFeeRow.replace(":descriptor", baseFeeDescriptor)}
            value={formatInr(inrBreakdown.platformFeeInr)}
            isDeduction
          />
          <BreakdownRow
            label={Locale.instantSettlementFeeRow.replace(":percentage", String(instantSettlementFeePercent))}
            value={formatInr(inrBreakdown.instantSettlementFeeInr)}
            isDeduction
          />
          {showRegionalPremium && (
            <BreakdownRow
              label={Locale.instantSettlementRegionalPremium}
              value={formatInr(inrBreakdown.regionalPremiumInr)}
              isDeduction
            />
          )}
          {showGst && (
            <BreakdownRow
              label={Locale.instantSettlementGstApplied}
              value={formatInr(inrBreakdown.gstInr)}
              isDeduction
            />
          )}
        </div>

        {/* Total */}
        <div className="border-t border-dotted border-black-500 pt-2">
          <BreakdownRow
            label={Locale.instantSettlementReceivableAmount}
            value={formatInr(inrBreakdown.settledInr)}
            emphasize
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {!isInrGross && (
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-black-300" />
          <div className="px-3">{renderFxBadge()}</div>
          <div className="flex-1 h-px bg-black-300" />
        </div>
      )}
      <div className="flex flex-row items-center gap-1">
        <Typography
          text={Locale.instantSettlementYoullReceive.replace(":amount", formatInr(inrBreakdown.settledInr))}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={isLoading ? "!text-black-400 !font-bold" : "!text-black-700 !font-bold"}
        />
        <Tooltip
          tooltipText={renderTooltipBreakdown()}
          position={TOOLTIP_POSITION.TOP}
          tooltipTheme="dark"
          arrow={true}
        >
          <div className="cursor-pointer flex items-center">
            <InformationIconV2 width={16} height={16} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default InstantSettlementReceiveBreakdown;
