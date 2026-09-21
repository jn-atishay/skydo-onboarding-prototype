/**
 * @author Raj Sheth
 * created: 24/06/23
 */

import React, { FC, ReactNode } from "react";
import { PreferredEmail } from "../../PaymentsReminder/ReminderPopupEntry";
import CrossIcon from "../../AtomicComponents/ToastMessages/CrossIcon";
import { DEFAULT_PAYMENT_REMINDER_EMAIL } from "../../PaymentsReminder/PaymentReminderEmailPreview";
import EmailPreviewRightSection from "../../PaymentsReminder/EmailPreviewRightSection";
import Locale from "../../../util/locale/en";
import { CurrencyWiseTotal } from "../../../types/ClientLedger";
import beCall from "../../../util/beCall";
import BE_ROUTES from "../../../util/beRoutes";
import { ALLOWED_METHODS } from "../../../constants/apiConstants";
import useAnalytics from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";
import { EmailTemplate } from "../../../types";
import {
  InvoiceOrReminderPopupContentCase,
} from "../../InvoiceOrRemindEmailPopUp/InvoiceOrReminderEmailPreviewPopUpChange";
import EmailForm from "../../EmailComponents/EmailForm";
import { SendEmailRequest } from "../../../types/PaymentConfirmation";
import PreviewEmail from "../../TwoPartitionEmailPopup/PreviewEmail";

interface LedgerEmailTwoSectionProps {
  overrideMainContent?: () => ReactNode;
  isVisible: boolean;
  onClose: () => void;
  preferredEmails?: PreferredEmail[];
  companyName?: string;
  onEditLogoClick: () => void;
  isDataFetched: boolean;
  onSendEmailSuccess: (data: any) => void;
  globalImageUrl?: string;

  importerId: number;
  importerName: string;
  exporterName: string;
  outstandingBalance?: CurrencyWiseTotal[];
  title?: string;
  onSendEmail?: (request: SendEmailRequest) => Promise<void>;
  subject?: string;
  emailTitle?: string;
  renderPreviewEmail?: () => React.ReactNode;
  isInvoiceEmail: boolean;
  invoiceId?: number;
  emailType?: EmailTemplate;

  showEmailTypeToggle?: boolean;
  popUpContentCase?: InvoiceOrReminderPopupContentCase;
  setPopupContentCase?: (popUpContentCase: InvoiceOrReminderPopupContentCase) => void;
  attachmentFileName?: string;
}

const LedgerEmailTwoSection: FC<LedgerEmailTwoSectionProps> = (props) => {
  const analytics = useAnalytics();

  const onSendEmailClick = async (request: SendEmailRequest) => {
    const isInvoiceEmail = props.isInvoiceEmail;
    let path;
    let body;

    if (isInvoiceEmail && props.emailType) {
      analytics.trackAsync(Events.INVOICE_EMAIL_SENT, { type: props.emailType });
      path = BE_ROUTES.SEND_REMINDER_EMAIL.replace(":invoiceId", String(props?.invoiceId));
      body = { ...request, emailType: props.emailType };
    } else {
      path = BE_ROUTES.CLIENT_LEDGER_EMAIL;
      body = { ...request, importerId: props.importerId };
    }

    if (props.onSendEmail) {
      void props.onSendEmail(request);
    }
    await beCall({
      path: path,
      method: ALLOWED_METHODS.POST,
      body: body,
      onSuccess: (response) => {
        if (response.success) {
          if (!request.isTesting) {
            props.onSendEmailSuccess(response.data);
          }
        } else {
          throw response;
        }
      },
      onError: (error) => {
        throw error;
      },
    });
  };

  return (
    <div className={"flex flex-row h-full"}>
      <div className={`flex flex-1 flex-col bg-black-100 overflow-auto`}>
        <EmailForm
          preferredEmails={props.preferredEmails}
          onClose={props.onClose}
          title={props.title || Locale.sendClientLedger}
          isDataFetched={props.isDataFetched}
          onSendEmail={onSendEmailClick}
          onTestEmailSectionClickEvent={() => {
            if (props.emailType) {
              analytics.trackAsync(Events.INVOICE_EMAIL_TEST_EMAIL_SECTION_CLICK, { type: props.emailType });
            } else {
              analytics.trackAsync(Events.CLIENT_LEDGER_EMAIL_TEST_EMAIL_SECTION_CLICK);
            }
          }}
          onTestToFocusEvent={() => {
            if (props.emailType) {
              analytics.trackAsync(Events.INVOICE_EMAIL_TEST_TO_FOCUS, { type: props.emailType });
            } else {
              analytics.trackAsync(Events.CLIENT_LEDGER_EMAIL_TEST_TO_FOCUS);
            }
          }}
          onTestSendClickEvent={() => {
            if (props.emailType) {
              analytics.trackAsync(Events.INVOICE_EMAIL_TEST_SEND_CLICK, { type: props.emailType });
            } else {
              analytics.trackAsync(Events.CLIENT_LEDGER_EMAIL_TEST_SEND_CLICK);
            }
          }}
          onToFocusEvent={() => {
            if (props.emailType) {
              analytics.trackAsync(Events.INVOICE_EMAIL_TO_FOCUS, { type: props.emailType });
            } else {
              analytics.trackAsync(Events.CLIENT_LEDGER_EMAIL_TO_FOCUS);
            }
          }}
          onCcFocusEvent={() => {
            if (props.emailType) {
              analytics.trackAsync(Events.INVOICE_EMAIL_CC_FOCUS, { type: props.emailType });
            } else {
              analytics.trackAsync(Events.CLIENT_LEDGER_EMAIL_CC_FOCUS);
            }
          }}
          onBccFocusEvent={() => {
            if (props.emailType) {
              analytics.trackAsync(Events.INVOICE_EMAIL_BCC_FOCUS, { type: props.emailType });
            } else {
              analytics.trackAsync(Events.CLIENT_LEDGER_EMAIL_BCC_FOCUS);
            }
          }}
          onSendClickEvent={() => {
            if (props.emailType) {
              analytics.trackAsync(Events.INVOICE_EMAIL_SEND_CLICK, { type: props.emailType });
            } else {
              analytics.trackAsync(Events.CLIENT_LEDGER_EMAIL_SEND_CLICK);
            }
          }}
          showEmailTypeToggle={props.showEmailTypeToggle}
          popUpContentCase={props.popUpContentCase}
          setPopupContentCase={props.setPopupContentCase}
          attachmentFileName={props.attachmentFileName}
        />
      </div>
      <div className={`flex flex-1 flex-col bg-black-50`}>
        <div className={`flex flex-col`}>
          <div className={`cursor-pointer flex flex-1 flex-col pr-6 pt-6 self-end`} onClick={props.onClose}>
            <CrossIcon />
          </div>
        </div>
        <div>
          <div>
            <EmailPreviewRightSection
              isDataFetched={props.isDataFetched}
              logoUrl={props.globalImageUrl}
              companyName={props.companyName}
              onEditLogoClick={() => {
                analytics.trackAsync(Events.CLIENT_REMINDER_ADD_LOGO_CLICK, {
                  location: "client_ledger_popup",
                });
                props.onEditLogoClick();
              }}
            >
              {props.renderPreviewEmail ? (
                props.renderPreviewEmail()
              ) : (
                <PreviewEmail
                  onEditLogoClick={props.onEditLogoClick}
                  logo={props.globalImageUrl}
                  from={DEFAULT_PAYMENT_REMINDER_EMAIL}
                  subject={props.subject || `Client ledger with ${props.importerName}`}
                  emailTitle={
                    props.emailTitle ||
                    Locale.transactionHistoryBetween
                      .replace(":importerName", props.importerName ?? "importer")
                      .replace(":exporterName", props.exporterName ?? "exporter")
                  }
                  dearName={`Dear ${props.importerName},`}
                  content={`This is a client ledger shared by ${props.exporterName}. To view ${props.importerName}’s transaction history with ${props.exporterName}, click on the button below.`}
                  exporterName={props.exporterName}
                  outstandingInvoices={props.outstandingBalance}
                  overrideMainContent={props.overrideMainContent}
                />
              )}
            </EmailPreviewRightSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerEmailTwoSection;
