import React, { useContext, useState } from "react";
import InfoBox from "../Common/InfoBox";
import Button from "../AtomicComponents/Button";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  CalendarPosition,
  INPUT_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import Popup from "../AtomicComponents/Popup";
import Locale from "../../util/locale/en";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import useToastMessages from "../../store/toastMessages";
import { INVOICE_MARKED_AS_PAID_EVENT } from "../../constants/customeEvents";
import Typography from "../AtomicComponents/Typography";
import InvoicePaidIcon from "../Icons/InvoicePaidIcon";
import FullTick from "../Icons/FullTick";
import AppContext from "../../context/AppContext";
import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import { formatIncomingCurrency, formatUTCDate } from "../../util/formatters";
import DateSelector from "../AtomicComponents/DateSelector";
import Notes from "../AtomicComponents/Notes";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  invoiceNo: string;
  clientName: string;
  invoiceAmount: number;
  invoiceCurrency: string;
  dueDate: string | undefined;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  invoiceId: number;
}

export const MarkAsPaidIcon = () => {
  const { theme } = useContext(AppContext);

  return (
    <FullTick
      isSmall={true}
      fill={"transparent"}
      tickColor={theme.hexColors.black[700]}
      bgColor={theme.hexColors.black[700]}
      circleStrokeWidth={"1.3"}
      tickStrokeWidth={"1.3"}
    />
  );
};

interface PopUpContentProps extends Props {
  paymentAmount: string;
  setPaymentAmount: (paymentMethod: string) => void;
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

const PopupTitle: React.FC = () => {
  return (
    <div className={"flex flex-row"}>
      <InvoicePaidIcon />
      <Typography
        textClasses={"ml-4"}
        text={Locale.markAsPaidPPTitle}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.X_SMALL}
      />
    </div>
  );
};

const PopUpContent: React.FC<PopUpContentProps> = (props) => {
  const analytics = useAnalytics();
  return (
    <div className={"flex flex-col"}>
      <Notes text={Locale.noFeeNote} className={"mb-6"} />
      <div className={"flex flex-row"}>
        <div className={"flex-1"}>
          <InfoBox header={Locale.markAsPaidPPInvoiceNo} value={props.invoiceNo} />
        </div>
        <div className={"flex-1"}>
          <InfoBox header={Locale.markAsPaidPPClientName} value={props.clientName} />
        </div>
      </div>
      <div className={"flex flex-row mt-6"}>
        <div className={"flex-1"}>
          <InfoBox
            header={Locale.markAsPaidPPInvoiceAmount}
            value={formatIncomingCurrency(props.invoiceAmount.toString(), props.invoiceCurrency.toString())}
          />
        </div>
        {props.dueDate && (
          <div className={"flex-1"}>
            <InfoBox header={Locale.markAsPaidPPDueDate} value={formatUTCDate(props.dueDate)} />
          </div>
        )}
      </div>
      <hr className={"w-full my-8 border-black-400"} />
      <div className={"flex gap-2 flex-col"}>
        <Typography text={Locale.receivedOn} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL}>
          <Typography
            text={Locale.optional}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500 ml-1"}
          />
        </Typography>
        <DateSelector
          onDateSelect={(date) => {
            props.onDateSelect(date);
            analytics.trackAsync(Events.PAID_OUTSIDE_DATE_CHANGE);
          }}
          placeholder={Locale.dateFormat}
          calendarPosition={CalendarPosition.TOP}
          selectedDate={props.selectedDate?.split("-").reverse().join("/")}
          size={INPUT_TYPES.SMALL}
          containerClass={"flex-1"}
          maxDate={new Date()}
        />
      </div>
    </div>
  );
};

const MarkAsPaidPopup = (props: Props) => {
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, onDateSelect] = useState<string | null>(null);
  const { addToast } = useToastMessages((state) => ({
    addToast: state.addToast,
  }));
  const analytics = useAnalytics();

  const closePopup = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    props.setIsVisible(false);
    analytics.trackAsync(Events.PAID_OUTSIDE_CLOSE);
  };

  const onConfirm = async (e: any) => {
    analytics.trackAsync(Events.PAID_OUTSIDE_CONFIRM);
    setIsLoading(true);
    try {
      const res = await beCall({
        path: BE_ROUTES.MARK_INVOICE_AS_PAID,
        method: ALLOWED_METHODS.POST,
        body: {
          invoiceId: props.invoiceId,
          paymentAmountInr: paymentAmount,
          paymentDate: selectedDate,
        },
      });
      if (res.success) {
        addToast({
          id: "mark_as_paid_success",
          body: Locale.markAsPaidSuccessToast,
          type: TOAST_TYPES.SUCCESS,
        });
        /**
         * `REFETCH_INVOICE_DATA_EVENT` helps in fetching invoice data once again which is defined inside
         * 	`pages/invoices/[invoice_id]/index.tsx`
         */
        document.dispatchEvent(new Event(INVOICE_MARKED_AS_PAID_EVENT));
      } else {
        throw res;
      }
    } catch (e) {
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "mark_as_paid_error",
        body: Locale.wentWrongMessage,
      });
    } finally {
      setIsLoading(false);
      closePopup(e);
    }
  };

  const renderCtas = () => {
    return (
      <Button
        buttonClass={"mt-6"}
        title={Locale.paidOutsSkydo}
        type={BUTTON_TYPES.PRIMARY}
        size={BUTTON_SIZES.SMALL}
        onButtonClick={onConfirm}
        isLoading={isLoading}
      />
    );
  };

  return (
    <CustomisedNavigationForm onSubmit={onConfirm}>
      <Popup
        containerClass={"!p-6"}
        isCommonHeader={true}
        title={<PopupTitle />}
        open={props.isVisible}
        renderContent={() => (
          <PopUpContent
            {...props}
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
            selectedDate={selectedDate}
            onDateSelect={(val) => onDateSelect(val)}
          />
        )}
        renderCTAs={renderCtas}
        closeIconClick={closePopup}
        outsideClick={closePopup}
      />
    </CustomisedNavigationForm>
  );
};

export default MarkAsPaidPopup;
