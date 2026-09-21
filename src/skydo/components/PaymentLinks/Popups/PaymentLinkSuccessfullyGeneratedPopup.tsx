import TickWithOuterIcon from "../../Icons/TickWithOuter";
import Typography from "../../AtomicComponents/Typography";
import Locale from "../../../util/locale/en";
import { TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import useToastMessages from "../../../store/toastMessages";
import { formatIncomingCurrencyWithNumber } from "../../../util/formatters";
import FE_ROUTES from "../../../util/feRoutes";
import useAnalytics from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";
import VeemCardPaymentMethod from "../VeemCardPaymentMethod";
import ACHDebitPaymentMethod from "../ACHDebitPaymentMethod";

interface Props {
  invoiceAmount: number;
  invoiceNumber: string;
  clientName: string;
  description: string;
  currency: string;
  paymentLinkId: string;
  allowedMethods: string[];
}
const PaymentLinkSuccessfullyGeneratedPopup = (props: Props) => {
  const { addToast } = useToastMessages();
  const { invoiceAmount, invoiceNumber, clientName, description, currency, paymentLinkId, allowedMethods } = props;
  const analytics = useAnalytics();
  const copyLinkToClipboard = () => {
    navigator?.clipboard
      ?.writeText(`${host}${FE_ROUTES.RECEIVE_PAYMENT.replace("[payment_link_id]", paymentLinkId)}`)
      .then(() => {
        addToast({
          type: TOAST_TYPES.SUCCESS,
          id: "success_copied",
          body: Locale.copied,
          time: 2000,
        });
      })
      .catch((err) => {
        console.log("error copying bank details", err);
      });
    analytics?.trackAsync(Events.PAYPAL.PAYMENT_LINK_COPIED, {
      source: "pay_link_success_popup",
    });
  };

  const host = process.env.NEXT_PUBLIC_FE_BASE_URL;

  return (
    <div className={"flex flex-col items-center space-y-6 pb-6"}>
      <TickWithOuterIcon width={134} height={134} />
      <Typography
        text={Locale.paymentLinkSuccessText}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"!text-green-400"}
      />
      <div className={"flex flex-row p-4 w-full rounded-10px border-[1px] border-black-400 justify-between"}>
        <Typography
          text={`${host}${FE_ROUTES.RECEIVE_PAYMENT.replace("[payment_link_id]", paymentLinkId)}`}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          type={TYPOGRAPHY_TYPES.LABEL}
          textClasses={"truncate w-[80%]"}
        />
        <Typography
          text={Locale.copyLinkText}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"text-blue-400 cursor-pointer"}
          onTextClick={copyLinkToClipboard}
        />
      </div>

      <div className={"grid grid-cols-2 gap-6 w-full"}>
        <div className={"flex flex-col space-y-1 col-span-1"}>
          <Typography
            text={Locale.clientName}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.LABEL}
            textClasses={"!text-black-500"}
          />
          <Typography text={clientName} size={TYPOGRAPHY_SIZES.MEDIUM} type={TYPOGRAPHY_TYPES.LABEL} />
        </div>
        <div className={"flex flex-col space-y-1 col-span-1"}>
          <Typography
            text={Locale.invoiceAmount}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.LABEL}
            textClasses={"!text-black-500"}
          />
          <Typography
            text={formatIncomingCurrencyWithNumber({
              value: invoiceAmount,
              minFractionDigits: 2,
              maxFractionDigits: 2,
              currency: currency,
            })}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            type={TYPOGRAPHY_TYPES.LABEL}
          />
        </div>
        <div className={"flex flex-col space-y-1 col-span-1"}>
          <Typography
            text={Locale.invoiceNumber}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.LABEL}
            textClasses={"!text-black-500"}
          />
          <Typography text={invoiceNumber || "-"} size={TYPOGRAPHY_SIZES.MEDIUM} type={TYPOGRAPHY_TYPES.LABEL} />
        </div>
        <div className={"flex flex-col space-y-1 col-span-1"}>
          <Typography
            text={Locale.statusStr}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.LABEL}
            textClasses={"!text-black-500"}
          />
          <Typography
            text={Locale.outstanding}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-orange-400 px-2 py-1 rounded-[30px] bg-orange-50 w-fit"}
          />
        </div>
        <div className={"flex flex-col space-y-1 col-span-1"}>
          <Typography
            text={Locale.description}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.LABEL}
            textClasses={"!text-black-500"}
          />
          <Typography
            text={description ? description : "-"}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            type={TYPOGRAPHY_TYPES.LABEL}
          />
        </div>
      </div>
      <hr className={"text-black-400 w-full"} />
      <div className={"flex flex-col gap-2 justify-start w-full"}>
        <Typography
          text={Locale.paymentMethods}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500"}
          fontWeight={"600"}
        />
        <div className={"flex flex-row w-full"}>
          {allowedMethods.map((method, index) => (
            <div key={`method-container-${index}`} className={`flex ${allowedMethods.length > 1 ? 'w-1/2' : 'w-full'} justify-start`}>
              {method === "VEEM_CARDS" && <VeemCardPaymentMethod key={method} />}
              {method === "ACH_DEBIT" && <ACHDebitPaymentMethod key={method} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentLinkSuccessfullyGeneratedPopup;
