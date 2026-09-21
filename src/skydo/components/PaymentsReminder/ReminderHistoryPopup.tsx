import React, { useEffect } from "react";
import Popup from "../AtomicComponents/Popup";
import EmailHistoryTable, { EmailHistory } from "./EmailHistoryTable";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import Locale from "../../util/locale/en";
import BellIcon from "../Icons/BellIcon";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  fetchDataCb?: () => void;
  sentInvoiceEmailButtonClick?: () => void;
  isInvoiceEmailHistoryPopUp?: boolean;
  history: EmailHistory[];
  showInvoiceEmailAndReminderOption?: boolean;
}

const EmailHistoryTrackerPopup: React.FC<Props> = (props) => {
  useEffect(() => {
    if (props.isVisible) {
      props.fetchDataCb && props.fetchDataCb();
    }
  }, [props.isVisible]);

  const isInvoiceEmailHistoryPopUp = props.isInvoiceEmailHistoryPopUp;
  const noHistory = props.history.length == 0;
  const showInvoiceEmailAndReminderOption = props.showInvoiceEmailAndReminderOption;

  const renderContent = () => {
    return (
      <div>
        {isInvoiceEmailHistoryPopUp && noHistory ? (
          <div className={"flex flex-col items-center space-y-2 mb-4"}>
            <Typography text={Locale.noRemindersSent} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} />
            <Typography
              text={Locale.checkWhenYourClientOpensEmail}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
            />
          </div>
        ) : null}
        <EmailHistoryTable history={props.history} isInvoiceEmail={props.isInvoiceEmailHistoryPopUp} />
        {isInvoiceEmailHistoryPopUp && noHistory ? (
          <div className={"flex flex-row justify-center items-center"}>
            <Button
              title={showInvoiceEmailAndReminderOption ? Locale.invoiceOrReminderEmail : Locale.sendReminderToClient}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={props?.sentInvoiceEmailButtonClick}
              rightIcon={() => <BellIcon strokeColor={"white"} />}
              buttonClass={"mr-3"}
            />
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      open={props.isVisible}
      isCommonHeader={true}
      title={props.title}
      closeIconClick={props.onClose}
      outsideClick={props.onClose}
      containerClass={"!max-h-[520px] !w-full"}
      isDashboardPopup={true}
    />
  );
};

export default EmailHistoryTrackerPopup;
