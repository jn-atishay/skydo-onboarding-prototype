import { useState } from "react";
import { EmailTemplate, Invoice } from "../../types";
import InvoiceOrReminderEmailSelectPopUp from "./InvoiceOrReminderEmailSelectPopUp";
import InvoiceOrReminderEmailPreviewPopUpChange from "./InvoiceOrReminderEmailPreviewPopUpChange";

interface Props {
  invoiceData: Invoice;
  closePopUp: () => void;
  fetchRemindersHistory?: () => void;
}

const InvoiceOrReminderEmailParentPopUp = (props: Props) => {
  const { invoiceData, closePopUp, fetchRemindersHistory } = props;
  const [popUpState, setPopUpState] = useState(0);
  const [selectedEmailType, setSelectedEmailType] = useState<EmailTemplate>(EmailTemplate.INVOICE_EMAIL);

  const postEmailTypeSelect = () => {
    setPopUpState(1);
  };

  return popUpState == 0 ? (
    <InvoiceOrReminderEmailSelectPopUp
      invoiceData={invoiceData}
      closePopUp={closePopUp}
      setSelectedEmailType={setSelectedEmailType}
      postEmailTypeSelect={postEmailTypeSelect}
    />
  ) : (
    <InvoiceOrReminderEmailPreviewPopUpChange
      isVisible={popUpState == 1}
      invoiceData={invoiceData}
      selectedEmailType={selectedEmailType}
      onClose={closePopUp}
      fetchRemindersHistory={fetchRemindersHistory}
    />
  );
};

export default InvoiceOrReminderEmailParentPopUp;
