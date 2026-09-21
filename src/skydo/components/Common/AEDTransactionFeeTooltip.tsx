import React from "react";
import classNames from "classnames";
import { formatINDNumber } from "../../util/formatters";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";

interface AEDTransactionFeeTooltipProps {
  baseFee: number;
  baseCurrency: string;
  regionalFee: number;
  invoiceAmount: number;
  baseFeeInINR: number;
  regionalFeeInINR: number;
  totalFeeInINR: number;
  baseToInrRate: number;
  aedToInrRate: number;
  rateTimestamp: string;
  showRegionalFeeCalculation?: boolean;
  showBaseFeeAsPercentage?: boolean;
  regionalFeePercentage?: number;
  // The regional fee is charged in the collection currency, which is AED only for UAE.
  regionalCurrency?: string;
  // The FX calculator splits the fee into two rows and shows one section per row.
  showHeader?: boolean;
  showBaseFeeSection?: boolean;
  showRegionalFeeSection?: boolean;
  showTotal?: boolean;
  containerClass?: string;
}

/**
 * Tooltip component to display AED transaction fee breakdown
 * Shows base Skydo fee + 1% regional currency fee with conversions to INR
 */
const AEDTransactionFeeTooltip: React.FC<AEDTransactionFeeTooltipProps> = ({
  baseFee,
  baseCurrency,
  regionalFee,
  invoiceAmount,
  baseFeeInINR,
  regionalFeeInINR,
  totalFeeInINR,
  baseToInrRate,
  aedToInrRate,
  rateTimestamp,
  showRegionalFeeCalculation = true,
  showBaseFeeAsPercentage = false,
  regionalFeePercentage = 1,
  regionalCurrency = "AED",
  showHeader = true,
  showBaseFeeSection = true,
  showRegionalFeeSection = true,
  showTotal = true,
  containerClass,
}) => {
  return (
    <div className={classNames("text-left", containerClass)}>
      {showHeader ? (
        <div className="mb-3">
          <Typography
            text="Skydo transaction fee:"
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses="!text-white"
            type={TYPOGRAPHY_TYPES.PARA}
          />
        </div>
      ) : null}

      {/* Base Fee Section */}
      {showBaseFeeSection ? (
        <div className={classNames({ "mb-4": showRegionalFeeSection || showTotal })}>
          <Typography
            text="Skydo base fee:"
            size={TYPOGRAPHY_SIZES.X_SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
            textClasses="!text-blue-200 !font-bold"
          />
          <Typography
            text={
              showBaseFeeAsPercentage
                ? "0.3% of amount received"
                : `${baseCurrency} ${formatINDNumber({
                    value: baseFee,
                    formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  })}`
            }
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses="text-blue-200 block !font-bold"
            type={TYPOGRAPHY_TYPES.PARA}
          />

          <div className="flex gap-2 mt-2">
            <div className="w-[126px]">
              <Typography
                text={`${baseCurrency} ${formatINDNumber({
                  value: baseFee,
                  formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                })} x ${formatINDNumber({
                  value: baseToInrRate,
                  formatOptions: { minimumFractionDigits: 4 },
                })} INR`}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses="!text-white"
              />
            </div>
            <div className="w-[93px] text-right">
              <Typography
                text={`INR ${formatINDNumber({
                  value: baseFeeInINR,
                  formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                })}`}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses="!text-white"
              />
            </div>
          </div>

          <Typography
            text={`1 ${baseCurrency} = ${formatINDNumber({
              value: baseToInrRate,
              formatOptions: { minimumFractionDigits: 4 },
            })} INR`}
            size={TYPOGRAPHY_SIZES.X_X_SMALL}
            textClasses="!text-neutral-500 mt-1"
          />
          <Typography
            text={`(${rateTimestamp})`}
            size={TYPOGRAPHY_SIZES.X_X_SMALL}
            textClasses="text-neutral-500 block"
          />
        </div>
      ) : null}

      {showBaseFeeSection && showRegionalFeeSection ? <hr className="border-gray-600 my-3" /> : null}

      {/* Regional Fee Section */}
      {showRegionalFeeSection ? (
        <div className={classNames({ "mb-4": showTotal })}>
          <Typography
            text="Regional Currency Fee:"
            size={TYPOGRAPHY_SIZES.X_SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
            textClasses="text-blue-200 !font-bold"
          />
          {showRegionalFeeCalculation && (
            <Typography
              text={`${regionalFeePercentage}% X ${regionalCurrency} ${formatINDNumber({
                value: invoiceAmount,
                formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
              })}`}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses="text-blue-200 block !font-bold"
              type={TYPOGRAPHY_TYPES.PARA}
            />
          )}

          <div className="flex gap-2 mt-2">
            <div className="w-[126px]">
              <Typography
                text={`${regionalCurrency} ${formatINDNumber({
                  value: regionalFee,
                  formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                })} x ${formatINDNumber({
                  value: aedToInrRate,
                  formatOptions: { minimumFractionDigits: 4 },
                })} INR`}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses="!text-white"
              />
            </div>
            <div className="w-[93px] text-right">
              <Typography
                text={`INR ${formatINDNumber({
                  value: regionalFeeInINR,
                  formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                })}`}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses="!text-white"
              />
            </div>
          </div>

          <Typography
            text={`1 ${regionalCurrency} = ${formatINDNumber({
              value: aedToInrRate,
              formatOptions: { minimumFractionDigits: 4 },
            })} INR`}
            size={TYPOGRAPHY_SIZES.X_X_SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
            textClasses="!text-neutral-500 mt-1"
          />
          <Typography
            text={`(${rateTimestamp})`}
            size={TYPOGRAPHY_SIZES.X_X_SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
            textClasses="text-neutral-500 block"
          />
        </div>
      ) : null}

      {showTotal ? (
        <>
          <hr className="border-gray-600 my-3" />

          {/* Total Fee Section */}
          <div className="flex gap-2">
            <div className="w-[126px]">
              <Typography
                text="Total Skydo fee"
                size={TYPOGRAPHY_SIZES.X_SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses="!text-white !font-bold"
              />
            </div>
            <div className="w-[93px] text-right">
              <Typography
                text={`INR ${formatINDNumber({
                  value: totalFeeInINR,
                  formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                })}`}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses="!text-white !font-bold"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AEDTransactionFeeTooltip;
