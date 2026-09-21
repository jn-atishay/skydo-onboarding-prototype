import React, { useContext, useEffect, useRef, useState } from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import { ReactMultiEmail } from "react-multi-email";
import AttachmentIcon from "../Icons/AttachmentIcon";
import Button from "../AtomicComponents/Button";
import Accordion from "../AtomicComponents/Accordion";
import AppContext from "../../context/AppContext";
import { PreferredEmail } from "../PaymentsReminder/ReminderPopupEntry";
import useToastMessages from "../../store/toastMessages";
import TextInput from "../AtomicComponents/TextInput";
import { UserDetailsContext } from "../DashboardContainer";
import classNames from "classnames";
import SelectEmailTypeToggle from "../InvoiceOrRemindEmailPopUp/SelectEmailTypeToggle";
import { InvoiceOrReminderPopupContentCase } from "../InvoiceOrRemindEmailPopUp/InvoiceOrReminderEmailPreviewPopUpChange";
import { SendEmailRequest } from "../../types/PaymentConfirmation";
import EmailChips from "./EmailChips";

enum WHICH_EMAIL_FIELD {
  TO = "to",
  CC = "cc",
  BCC = "bcc",
  TEST_TO = "test_to",
}

interface Props {
  onClose: () => void;
  title?: string;
  attachmentFileName?: string;
  preferredEmails?: PreferredEmail[];
  isDataFetched: boolean;
  onSendEmail: (request: SendEmailRequest) => Promise<any>;

  /* Events related functions */
  onTestEmailSectionClickEvent?: () => void;
  onTestToFocusEvent?: () => void;
  onTestSendClickEvent?: () => void;
  onToFocusEvent?: () => void;
  onCcFocusEvent?: () => void;
  onBccFocusEvent?: () => void;
  onSendClickEvent?: () => void;
  onSendEmailFailedEvent?: (error: any) => void;

  showEmailTypeToggle?: boolean;
  popUpContentCase?: InvoiceOrReminderPopupContentCase;
  setPopupContentCase?: (popUpContentCase: InvoiceOrReminderPopupContentCase) => void;

  /**
   * Above attachment file and below bcc field
   */
  renderBelowBccFields?: () => React.ReactNode;

  containerClass?: string;
  accordionClass?: string;
  hideHeader?: boolean;
}

interface EmailHeaderProps {
  title: string;
}

const InvoiceHeader: React.FC<EmailHeaderProps> = (props) => {
  return (
    <div className={"pb-6 pl-6 pr-6 pt-6 bg-white"}>
      <Typography text={props.title} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />
    </div>
  );
};

interface MultiEmailWithLoaderProps {
  emailType: WHICH_EMAIL_FIELD;
  emails: string[];
  isEmpty?: boolean;
  onEmailChange: (emails: string[], emailType: WHICH_EMAIL_FIELD) => void;
  isLoading?: boolean;
  loadingText?: string;
  onFocus?: () => void;
}

const MultiEmailWithLoader: React.FC<MultiEmailWithLoaderProps> = (props) => {
  if (props?.isLoading) {
    return (
      <div>
        <TextInput
          placeholder={props?.loadingText ?? Locale.fetchingEmailsBasedOnHistory.replace(":type", "sender")}
          isDisabled={true}
        />
      </div>
    );
  }

  return (
    <ReactMultiEmail
      onFocus={() => {
        props?.onFocus && props.onFocus();
      }}
      emails={props.emails}
      onChange={(emails) => props.onEmailChange(emails, props.emailType)}
      getLabel={(email: string, index: number, removeEmail: (index: number, isDisabled?: boolean) => void) => (
        <EmailChips email={email} customIdx={index} removeEmail={removeEmail} />
      )}
      className={`[&>*]:outline-none px-2 cursor-text !min-h-[48px] !border rounded-10px !py-1 flex flex-row flex-wrap ${
        props?.isEmpty ? "!border-red-400" : "!border-black-400"
      }`}
    />
  );
};

export const EmailForm: React.FC<Props> = (props) => {
  const { theme } = useContext(AppContext);
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const accordionWrapperRef = useRef<HTMLInputElement>(null);

  const [to, setTo] = useState<string[]>(
    props.preferredEmails?.filter((email) => email.type === "to").map((email) => email.email) || []
  );
  const [cc, setCc] = useState<string[]>(
    props.preferredEmails?.filter((email) => email.type === "cc").map((email) => email.email) || []
  );
  const [bcc, setBcc] = useState<string[]>(
    props.preferredEmails?.filter((email) => email.type === "bcc").map((email) => email.email) || []
  );
  const [testTo, setTestTo] = useState<string[]>([]);
  const [isSendButtonLoading, setIsSendButtonLoading] = useState<boolean>(false);
  const [isSendTestBtnLoading, setIsSendTestBtnLoading] = useState<boolean>(false);
  const [isToEmpty, setIsToEmpty] = useState<boolean>(false);
  const [isToTestEmpty, setIsToTestEmpty] = useState<boolean>(false);
  const { exporterUserDetails } = useContext(UserDetailsContext);

  useEffect(() => {
    setTo(props.preferredEmails?.filter((email) => email.type === "to").map((email) => email.email) || []);
    setCc(props.preferredEmails?.filter((email) => email.type === "cc").map((email) => email.email) || []);
    setBcc(props.preferredEmails?.filter((email) => email.type === "bcc").map((email) => email.email) || []);
  }, [props.preferredEmails]);

  useEffect(() => {
    /**
     * 1. check if emailAddress is present
     * 2. check if newTestTo doesn't already have this email
     */
    if (exporterUserDetails.emailAddress && !testTo.includes(exporterUserDetails.emailAddress)) {
      setTestTo([...testTo, exporterUserDetails.emailAddress]);
    }
  }, [exporterUserDetails.emailAddress]);

  const handleAccordionClick = () => {
    setTimeout(() => {
      if (accordionWrapperRef.current && accordionWrapperRef.current.scrollIntoView) {
        accordionWrapperRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 10);
    props.onTestEmailSectionClickEvent && props.onTestEmailSectionClickEvent();
  };

  const onEmailChange = (emails: string[], whichEmailField: WHICH_EMAIL_FIELD) => {
    switch (whichEmailField) {
      case WHICH_EMAIL_FIELD.TO:
        if (emails.length >= 1) {
          setIsToEmpty(false);
        }
        setTo(emails);
        break;
      case WHICH_EMAIL_FIELD.CC:
        setCc(emails);
        break;
      case WHICH_EMAIL_FIELD.BCC:
        setBcc(emails);
        break;
      case WHICH_EMAIL_FIELD.TEST_TO:
        setTestTo(emails);
        if (emails.length >= 1) {
          setIsToTestEmpty(false);
        }
        break;
      default:
        break;
    }
  };

  const sendEmail = async (isTesting: boolean) => {
    if (isTesting) {
      props.onTestSendClickEvent && props.onTestSendClickEvent();
      if (testTo.length === 0) {
        setIsToTestEmpty(true);
        return;
      }
      setIsSendTestBtnLoading(true);
    } else {
      props.onSendClickEvent && props.onSendClickEvent();
      if (to.length === 0) {
        setIsToEmpty(true);
        return;
      }
      setIsSendButtonLoading(true);
    }

    const sendReminderEmailRequest = {
      isTesting: isTesting,
      to: isTesting ? testTo : to,
      ...(!isTesting
        ? {
            cc: cc,
            bcc: bcc,
          }
        : {}),
    };

    props
      .onSendEmail(sendReminderEmailRequest)
      .then((response) => {
        addToast({
          type: TOAST_TYPES.SUCCESS,
          id: "email_sent",
          body: Locale.emailSentSuccessfully,
        });
      })
      .catch((error) => {
        props.onSendEmailFailedEvent && props.onSendEmailFailedEvent(error);
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "email_send_failed",
          body: Locale.wentWrongMessage,
        });
      })
      .finally(() => {
        setIsSendButtonLoading(false);
        setIsSendTestBtnLoading(false);
      });
  };

  return (
    <div className={"flex flex-col w-full"}>
      {props.title ? <InvoiceHeader title={props.title} /> : null}
      <div className={"flex flex-col flex-1 overflow-y-auto bg-black-50"}>
        <div className={classNames("flex flex-col flex-1 bg-white pl-6 pr-6", props.containerClass)}>
          {props.hideHeader ? null : props.showEmailTypeToggle ? (
            <SelectEmailTypeToggle
              popUpContentCase={props.popUpContentCase}
              setPopupContentCase={props.setPopupContentCase}
            />
          ) : (
            <div className={"flex flex-col"}>
              <div className={"flex mb-1"}>
                <Typography
                  text={Locale.whoShouldReceive}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.LARGE}
                />
              </div>
              <div className={"flex mb-1"}>
                <Typography
                  text={Locale.addMultiple}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontColor={theme.hexColors.black[500]}
                />
              </div>
            </div>
          )}

          {/*input starts here*/}
          <div
            className={classNames("flex flex-col", {
              "mt-6": !props.hideHeader,
            })}
          >
            <div className={"flex flex-col"}>
              <div className={"flex flex-col"}>
                <Typography
                  text={Locale.sendTo}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={isToEmpty ? "!text-red-400" : ""}
                />
              </div>
              <div className={"flex flex-col mt-1"}>
                <MultiEmailWithLoader
                  emailType={WHICH_EMAIL_FIELD.TO}
                  emails={to}
                  isEmpty={isToEmpty}
                  onEmailChange={onEmailChange}
                  onFocus={() => {
                    props.onToFocusEvent && props.onToFocusEvent();
                  }}
                  isLoading={!props.isDataFetched}
                  loadingText={Locale.fetchingEmailsBasedOnHistory.replace(":type", "sender")}
                />
              </div>
              {isToEmpty && (
                <div className={"flex flex-col mt-1"}>
                  <Typography
                    text={Locale.thisIsRequired}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={isToEmpty ? "!text-red-400" : ""}
                  />
                </div>
              )}
              <Typography
                text={Locale.ccedEmail.replace(":directorEmail", exporterUserDetails.emailAddress)}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500"}
              />
            </div>

            <div className={"flex flex-col mt-3"}>
              <Typography text={Locale.cc} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.X_SMALL} />
            </div>
            <div className={"flex flex-col mt-1"}>
              <MultiEmailWithLoader
                emailType={WHICH_EMAIL_FIELD.CC}
                emails={cc}
                onEmailChange={onEmailChange}
                isLoading={!props.isDataFetched}
                onFocus={() => {
                  props.onCcFocusEvent && props.onCcFocusEvent();
                }}
                loadingText={Locale.fetchingEmailsBasedOnHistory.replace(":type", "cc")}
              />
            </div>
          </div>

          <div className={"flex flex-col mt-3"}>
            <Typography text={Locale.bcc} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.X_SMALL} />
          </div>

          <div className={"flex flex-col mt-1"}>
            <MultiEmailWithLoader
              emails={bcc}
              emailType={WHICH_EMAIL_FIELD.BCC}
              onEmailChange={onEmailChange}
              isLoading={!props.isDataFetched}
              onFocus={() => {
                props.onBccFocusEvent && props.onBccFocusEvent();
              }}
              loadingText={Locale.fetchingEmailsBasedOnHistory.replace(":type", "bcc")}
            />
          </div>
          {props.renderBelowBccFields && <div className={"flex flex-col mt-4"}>{props.renderBelowBccFields()}</div>}

          <div
            className={classNames("flex flex-row mt-3 mb-6 justify-between items-center", {
              "!justify-end": !props.attachmentFileName,
            })}
          >
            {props.attachmentFileName && (
              <div className={"flex flex-row items-center"}>
                <div className={"mr-1"}>
                  <AttachmentIcon width={16} height={16} />
                </div>
                <div className={"flex max-w-[250px] items-center"}>
                  <Typography
                    text={props.attachmentFileName}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!truncate"}
                  />
                </div>
              </div>
            )}

            <div>
              <Button
                isLoading={isSendButtonLoading}
                isDisabled={!props.isDataFetched}
                title={Locale.sendEmail}
                size={BUTTON_SIZES.SMALL}
                type={BUTTON_TYPES.PRIMARY}
                onButtonClick={() => sendEmail(false)}
                buttonClass={"!py-[10px] !px-4"}
              />
            </div>
          </div>
        </div>
        <div
          className={classNames("flex flex-col flex-1 bg-black-100 pl-6 pr-6 pb-6", props.accordionClass)}
          ref={accordionWrapperRef}
        >
          <Accordion
            title={Locale.testThisEmailBeforeSending}
            isDefaultOpen={false}
            containerClass={"mt-6"}
            onClick={handleAccordionClick}
          >
            <div className={"flex flex-col"}>
              <div className={"flex flex-col mt-4"}>
                <Typography
                  text={Locale.sendTestEmailTo}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={isToTestEmpty ? "!text-red-400" : ""}
                />
              </div>
              <div className={"flex flex-col mt-1"}>
                <ReactMultiEmail
                  emails={testTo}
                  onFocus={() => {
                    props.onTestToFocusEvent && props.onTestToFocusEvent();
                  }}
                  onChange={(emails) => onEmailChange(emails, WHICH_EMAIL_FIELD.TEST_TO)}
                  getLabel={(
                    email: string,
                    index: number,
                    removeEmail: (index: number, isDisabled?: boolean) => void
                  ) => <EmailChips email={email} customIdx={index} removeEmail={removeEmail} />}
                  className={`[&>*]:outline-none px-2 bg-white cursor-text !min-h-[48px] !border rounded-10px !py-1 flex flex-row flex-wrap ${
                    isToTestEmpty ? "!border-red-400" : "!border-navyblue-500"
                  }`}
                />
              </div>
              {isToTestEmpty && (
                <div className={"flex flex-col mt-1"}>
                  <Typography
                    text={Locale.thisIsRequired}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={isToTestEmpty ? "!text-red-400" : ""}
                  />
                </div>
              )}
            </div>
            <div className={"mt-4 flex flex-row justify-end"}>
              <Button
                isDisabled={!props.isDataFetched}
                isLoading={isSendTestBtnLoading}
                title={Locale.sendTestEmail}
                size={BUTTON_SIZES.SMALL}
                type={BUTTON_TYPES.PRIMARY}
                buttonClass={"!py-2.5 !px-4"}
                onButtonClick={() => sendEmail(true)}
              />
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default EmailForm;
