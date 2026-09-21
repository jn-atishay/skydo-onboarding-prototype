import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import { formatDate, formatINDNumber } from "../../util/formatters";
import { defaultDateFormattingOptions } from "../../constants/dashboardConstants";

interface Props {
  currencyToInrRate: string;
  interBankRateTimestamp?: string;
  dateFormattingOptions?: { [key: string]: any };
  currency: string;
  executedCondition?: string;
  amount: number;
  overrideExecutedPricingCondition: boolean;
  showExecutedCondition?: boolean;
}

const CurrencyToINRRateTooltip = (props: Props) => {
  const {
    currencyToInrRate,
    interBankRateTimestamp,
    dateFormattingOptions,
    executedCondition,
    currency,
    amount,
    overrideExecutedPricingCondition,
    showExecutedCondition,
  } = props;
  return (
    <div className={"flex flex-col items-start"}>
      {showExecutedCondition && (
        <Typography
          text={Locale.graterThen10KPricing.replace(
            "{executedCondition}",
            executedCondition && !overrideExecutedPricingCondition
              ? executedCondition
              : currency +
                  " " +
                  formatINDNumber({
                    value: amount,
                    formatOptions: { minimumFractionDigits: 2 },
                  })
          )}
          size={TYPOGRAPHY_SIZES.X_X_SMALL}
          textClasses={"!text-white mb-2"}
        />
      )}
      <Typography
        text={Locale.usdToInrRate.replace(":usdToInrRate", currencyToInrRate).replace("{currency}", currency)}
        size={TYPOGRAPHY_SIZES.X_X_SMALL}
        textClasses={"!text-white"}
      />
      {interBankRateTimestamp ? (
        <Typography
          text={Locale.fxTimeStamp.replace(":time", String(formatDate(interBankRateTimestamp, dateFormattingOptions)))}
          size={TYPOGRAPHY_SIZES.X_X_SMALL}
          textClasses={"!text-black-500 mb-1"}
        />
      ) : null}
    </div>
  );
};

CurrencyToINRRateTooltip.defaultProps = {
  dateFormattingOptions: defaultDateFormattingOptions,
};

export default CurrencyToINRRateTooltip;
