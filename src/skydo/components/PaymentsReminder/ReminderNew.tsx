import React, { useEffect } from "react";
import SendEmailLeftSection from "./SendEmailLeftSection";
import EmailPreviewRightSection from "./EmailPreviewRightSection";
import { PreferredEmail } from "./ReminderPopupEntry";
import { BankAccountField, Invoice } from "../../types";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { getOutstandingAmountForInvoice } from "../../util/functions";
import PaymentReminderEmailPreview from "./PaymentReminderEmailPreview";
import {
  InvoiceOrReminderPopupContentCase,
} from "../InvoiceOrRemindEmailPopUp/InvoiceOrReminderEmailPreviewPopUpChange";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  importerName: string;
  exporterSystemInvoiceId: string;
  invoiceData: Invoice;
  preferredEmails?: PreferredEmail[];
  globalImageUrl?: string;
  companyName?: string;
  onEditLogoClick: () => void;
  isDataFetched: boolean;
  onSendEmailSuccess: () => void;
  bankAccountFieldList: BankAccountField[] | null;
  paymentLink?: string | null;
  passOnFee?: boolean;

  showEmailTypeToggle?: boolean;
  popUpContentCase?: InvoiceOrReminderPopupContentCase;
  setPopupContentCase?: (popUpContentCase: InvoiceOrReminderPopupContentCase) => void;
}

export const ReminderNew: React.FC<Props> = (props) => {
  const analytics = useAnalytics();

  useEffect(() => {
    if (props.isVisible) {
      analytics?.trackAsync(Events.CLIENT_REMINDER_POPUP_LOAD);
    }
  }, []);

  return (
    <div className={"flex flex-row h-full"}>
      <div className={`flex flex-1 flex-col -my-6 -ml-6 bg-black-100 overflow-auto`}>
        <SendEmailLeftSection {...props} />
      </div>
      <div className={`flex flex-1 flex-col -my-6 -mr-6 bg-black-50`}>
        <div className={`flex flex-col`}>
          <div className={`cursor-pointer flex flex-1 flex-col pr-6 pt-6 self-end`} onClick={props.onClose}>
            <CrossIcon />
          </div>
        </div>
        <div>
          <EmailPreviewRightSection
            isDataFetched={props.isDataFetched}
            logoUrl={props.globalImageUrl}
            companyName={props.companyName}
            onEditLogoClick={() => {
              analytics.trackAsync(Events.CLIENT_REMINDER_ADD_LOGO_CLICK, {
                location: "client_reminder_popup",
              });
              props.onEditLogoClick();
            }}
          >
            <PaymentReminderEmailPreview
              bankAccountFieldList={props.bankAccountFieldList}
              exporterSystemInvoiceId={props.invoiceData.exporterSystemInvoiceId}
              correspondentName={props.companyName}
              importerName={props.invoiceData.importer.businessName}
              invoiceAmount={props.invoiceData.amount}
              invoiceCurrency={props.invoiceData.currency}
              invoiceDate={props.invoiceData.raisedDate}
              dueDate={props.invoiceData.dueDate}
              outstandingAmount={getOutstandingAmountForInvoice(props.invoiceData)}
              logo={props.globalImageUrl}
              onEditLogoClick={props.onEditLogoClick}
              containerClasses={!!props.globalImageUrl ? "max-h-[620px]" : "max-h-[550px]"}
              showIgnoreLine={true}
              paymentLink={props.paymentLink || null}
              passOnFee={props.passOnFee || false}
            />
          </EmailPreviewRightSection>
        </div>
      </div>
    </div>
  );
};

export default ReminderNew;
