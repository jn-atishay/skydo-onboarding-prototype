import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import { numberAbbreviate } from "../../util/numberAbbreviate";

interface Props {
  title: string;
  invoicedAmount: number;
  paidAmount: number;
  revenueShare?: string;
  invoicedText?: string;
  currency: string;
  hideInvoicedAmount?: boolean;
}

const BarChartTooltip = (props: Props) => {
  const { title, invoicedAmount, paidAmount, revenueShare, invoicedText, currency, hideInvoicedAmount } = props;

  return (
    <div className={"flex flex-col bg-white rounded px-2 py-1.5 shadow-common"}>
      <Typography text={title} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} />
      {hideInvoicedAmount ? null :
        <Typography
          text={(invoicedText || Locale.totalInvoicedAmount).replace(
            ":amount",
            currency + " " + numberAbbreviate({ number: invoicedAmount, currency })
          )}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"mt-1 mb-1"}
        />
      }
      <Typography
        text={Locale.totalPaidAmount.replace(
          ":amount",
          currency + " " + numberAbbreviate({ number: paidAmount, currency })
        )}
        size={TYPOGRAPHY_SIZES.X_SMALL}
      />
      {revenueShare ? (
        <Typography
          text={Locale.revenueShareTooltip.replace(":revenueShare", revenueShare)}
          size={TYPOGRAPHY_SIZES.X_SMALL}
        />
      ) : null}
    </div>
  );
};

export default BarChartTooltip;
