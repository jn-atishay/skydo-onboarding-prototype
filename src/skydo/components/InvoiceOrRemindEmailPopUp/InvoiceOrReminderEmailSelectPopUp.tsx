import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { EmailTemplate, Invoice } from "../../types";
import InfoBox from "../Common/InfoBox";
import { formatDate, formatIncomingCurrency } from "../../util/formatters";
import Image from "next/image";
import React from "react";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  invoiceData: Invoice;
  closePopUp: () => void;
  setSelectedEmailType: (emailTemplate: EmailTemplate) => void;
  postEmailTypeSelect: () => void;
}

interface SelectEmailTypeBoxProps {
  source: string;
  subtitle: string;
  onClick: () => void;
}

const InvoiceOrReminderEmailSelectPopUp = (props: Props) => {
  const { invoiceData, closePopUp, setSelectedEmailType, postEmailTypeSelect } = props;
  const analytics = useAnalytics();

  const renderInvoiceInfoBox = () => {
    return (
      <div className={"bg-black-50 grid grid-cols-2 w-[424px] gap-y-6 p-8 rounded-10px"}>
        <InfoBox header={"Invoice no."} value={invoiceData.exporterSystemInvoiceId} />
        <InfoBox header={"Client name"} value={invoiceData.importer.businessName} />
        <InfoBox
          header={"Invoice amount"}
          value={String(formatIncomingCurrency(invoiceData.amount, invoiceData.currency))}
        />
        <InfoBox header={"Due date"} value={formatDate(invoiceData.dueDate || "")} />
      </div>
    );
  };

  const renderSelectEmailTypeBox = (selectEmailTypeBoxProps: SelectEmailTypeBoxProps) => {
    const source = selectEmailTypeBoxProps.source;
    const subtitle = selectEmailTypeBoxProps.subtitle;
    const onClick = selectEmailTypeBoxProps.onClick;
    return (
      <div
        className={
          "h-[200px] w-[200px] flex flex-col space-y-4 justify-center items-center border-2 border-black-300 rounded-10px cursor-pointer hover:shadow-md"
        }
        onClick={() => {
          onClick();
          props.postEmailTypeSelect();
        }}
      >
        <div className="relative w-[90px] h-[90px]">
          <Image src={source} layout="fill" objectFit="contain" />
        </div>
        <Typography text={subtitle} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} />
      </div>
    );
  };

  const renderSelectEmailTypeBoxes = () => {
    return (
      <div className={"flex flex-row w-[424px] justify-between"}>
        {renderSelectEmailTypeBox({
          source: "/invoice_email.png",
          subtitle: "Send invoice to client",
          onClick: () => {
            setSelectedEmailType(EmailTemplate.INVOICE_EMAIL);
            analytics.trackAsync(Events.EMAIL_INVOICE);
          },
        })}
        {renderSelectEmailTypeBox({
          source: "/remind_email.png",
          subtitle: "Send reminder to client",
          onClick: () => setSelectedEmailType(EmailTemplate.PAYMENT_REMINDER),
        })}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={"flex-1 flex flex-col items-center justify-center space-y-6"}>
        <Typography
          text={"How would you like to proceed?"}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.X_SMALL}
        />
        {renderInvoiceInfoBox()}
        {renderSelectEmailTypeBoxes()}
      </div>
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      outsideClick={closePopUp}
      open={true}
      isLargePopup={true}
      closeIconClick={closePopUp}
      containerClass={"h-[80%] !p-0 flex flex-col"}
      isCommonHeader={true}
      title={""}
      headerClass={"mr-6 mt-6"}
    />
  );
};

export default InvoiceOrReminderEmailSelectPopUp;
