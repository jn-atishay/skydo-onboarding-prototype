/**
 * @author Raj Sheth
 * created: 12/10/23
 */

import React, { FC, useContext } from "react";
import EmailPopup from "../TwoPartitionEmailPopup/EmailPopup";
import PCEmailContent from "./PCEmailContent";
import CheckBox from "../AtomicComponents/CheckBox";
import { SendEmailRequest } from "../../types/PaymentConfirmation";
import { Transaction } from "../../types";
import { formatDateAsPerCurrencyTimeZone } from "../../util/dateHelper";
import Locale from "../../util/locale/en";
import ToastMessages from "../AtomicComponents/ToastMessages";
import { UserDetailsContext } from "../DashboardContainer";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import usePaymentConfirmationStore from "../../store/usePaymentConfirmationStore";
import { INVOICE_EMAIL_SENT } from "../../constants/customeEvents";

interface EmailPopupProps {
  isPopupVisible: boolean;
  togglePopupVisible: () => void;
  // sendEmailClick: (
  //   request: PaymentConfirmationEmailReq,
  //   onSuccess?: (resp: any) => any,
  //   onError?: (error: any) => any
  // ) => void;
  invoiceId: string;
  transaction: Transaction | null | undefined;
  importerName: string;
}

const PCEmailPopup: FC<EmailPopupProps> = (props) => {
  const { sendEmail, preferredEmails } = usePaymentConfirmationStore();
  const analytics = useAnalytics();
  const { isPopupVisible, togglePopupVisible } = props;
  const [isConfigEnabled, setIsConfigEnabled] = React.useState<boolean>(true);
  const { exporterDetails } = useContext(UserDetailsContext);
  const exporterName = exporterDetails.correspondentName;

  const onCheckboxClick = () => {
    analytics.trackAsync(Events.PC_POPUP_AUTO_SEND_CHECKBOX_CLICKED, {
      checked: !isConfigEnabled,
    });
    setIsConfigEnabled(!isConfigEnabled);
  };

  const sendEmailClick = (req: SendEmailRequest) => {
    analytics.trackAsync(!req.isTesting ? Events.PC_POPUP_SEND_CLICKED : Events.PC_POPUP_SEND_TEST_CLICKED, {
      autoSendEnabled: isConfigEnabled,
    });
    return new Promise((resolve, reject) => {
      const fundingIds = props.transaction?.funding?.map((curFunding) => {
        return curFunding.id ?? 0;
      });

      if (!fundingIds || fundingIds?.length === 0) {
        return reject("No funding ids found");
      }

      sendEmail({
        ...req,
        invoiceId: props.invoiceId,
        fundingIds: fundingIds || [],
        isAutoEmailEnabled: isConfigEnabled,
        onSuccess: (success: any) => {
          if (!req.isTesting) {
            togglePopupVisible();
            /**
             * This event is used to refresh the data in the Payment Confirmation page
             */
            document.dispatchEvent(new Event(INVOICE_EMAIL_SENT));
          }
          resolve(success);
        },
        onError: (error: any) => {
          reject(error);
        },
      });
    });
  };

  let displayAmount = 0;
  let currency = "";
  let fundingDate = new Date().toString();
  props.transaction?.funding?.map((fnt) => {
    fundingDate = fnt.creditedAt;
  });
  props.transaction?.funding?.forEach((funding) => {
    // only if payment confirmation is not sent
    if (!funding.paymentConfirmation) {
      displayAmount += funding.amount;
      currency = funding.currency;
    }
  });

  return (
    <div>
      <ToastMessages />
      <EmailPopup
        exporterName={exporterName}
        location={"payment_confirmation"}
        isVisible={isPopupVisible}
        setIsVisible={togglePopupVisible}
        leftSectionProps={{
          emailFormSection: {
            preferredEmails: preferredEmails,
            onToFocusEvent: () => {
              analytics.trackAsync(Events.PC_POPUP_TO_FOCUS);
            },
            onCcFocusEvent: () => {
              analytics.trackAsync(Events.PC_POPUP_CC_FOCUS);
            },
            title: Locale.sendConfirmationMailToExporter.replace(":exporterName", exporterName),
            isDataFetched: true,
            onSendEmail: sendEmailClick,
            renderBelowBccFields: () => (
              <div className={"cursor-pointer"} onClick={onCheckboxClick}>
                <CheckBox
                  label={Locale.autoSendConfirmationEmail}
                  checked={isConfigEnabled}
                  onCheckboxClick={onCheckboxClick}
                  containerClass={"!items-start"}
                />
              </div>
            ),
          },
        }}
        renderEmailPreviewSection={(extraProps) => (
          <PCEmailContent
            {...extraProps}
            importerName={props.importerName}
            amount={displayAmount}
            currency={currency}
            fundingDate={formatDateAsPerCurrencyTimeZone(fundingDate, currency)}
            canOverrideEditLogoText={false}
          />
        )}
      />
    </div>
  );
};

export default PCEmailPopup;
