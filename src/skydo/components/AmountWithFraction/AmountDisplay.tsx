import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { formatCurrencyWithSmallerDecimals } from "../../util/formatters";
import { roundTo } from "../../util/functions";

interface AmountDisplayProps {
  amount: number;
  currency: string;
  integerTypographyType?: string;
  decimalTypographyType?: string;
  integerTypographySize?: string;
  decimalTypographySize?: string;

  integerTypographyWeight?: number;
  decimalTypographyWeight?: number;

  wrapperClassName?: string;
  integerClassName?: string;
  decimalClassName?: string;
}

const AmountDisplay = ({
  amount,
  currency,
  integerTypographyType = TYPOGRAPHY_TYPES.LABEL,
  decimalTypographyType = TYPOGRAPHY_TYPES.PARA,
  integerTypographySize = TYPOGRAPHY_SIZES.SMALL,
  decimalTypographySize = TYPOGRAPHY_SIZES.X_SMALL,
  integerTypographyWeight = 600,
  decimalTypographyWeight = 700,
  wrapperClassName,
  integerClassName = "!text-black-500",
  decimalClassName = "!text-black-500",
}: AmountDisplayProps) => {
  const { wholePart: rawWhole, decimalPart } = formatCurrencyWithSmallerDecimals({
    value: Math.abs(amount),
    currency,
    maxFractionDigits: 2,
    minFractionDigits: 2,
  });
  const prefix = roundTo(amount, 2) < 0 ? "- " : "";
  const wholePart = prefix + rawWhole;
  return (
    <span className={classNames("flex items-baseline", wrapperClassName)}>
      <Typography
        text={wholePart}
        type={integerTypographyType}
        size={integerTypographySize}
        fontWeight={integerTypographyWeight}
        textClasses={integerClassName}
      />
      <Typography
        text={decimalPart}
        type={decimalTypographyType}
        size={decimalTypographySize}
        fontWeight={decimalTypographyWeight}
        textClasses={decimalClassName}
      />
    </span>
  );
};

export default AmountDisplay;
