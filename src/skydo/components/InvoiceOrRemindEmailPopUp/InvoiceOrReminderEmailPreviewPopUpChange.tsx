import { BankAccountField, EmailTemplate, Invoice } from "../../types";
import Popup from "../AtomicComponents/Popup";
import React, { useContext, useEffect, useState } from "react";
import { BUTTON_TYPES, TOAST_TYPES } from "../../constants/atomicConstants";
import { PreferredEmail } from "../PaymentsReminder/ReminderPopupEntry";
import { UserDetailsContext } from "../DashboardContainer";
import { getCompanyName } from "../../util/functions";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { exporterLogoAndDescriptionQuery } from "../../util/queries";
import Locale from "../../util/locale/en";
import { StraightArrows } from "../Icons/StraightArrows";
import { ArrowDirection } from "../Icons/ArrowIconSmall";
import PopupHeader, { getPopupTitle } from "../AtomicComponents/Popup/PopupHeader";
import PaymentReminderEmailPreview from "../PaymentsReminder/PaymentReminderEmailPreview";
import LedgerEmailTwoSection from "../ClientLedger/LedgerEmailPopup/LedgerEmailTwoSection";
import UploadCompanyLogoPopupContent from "../InternationalAccountsComp/UploadCompanyLogoPopupContent";
import EmailPreviewConfirmLogo from "../PaymentsReminder/EmailPreviewConfirmLogo";
import Button from "../AtomicComponents/Button";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import useToastMessages from "../../store/toastMessages";
import { formatDate, formatIncomingCurrencyWithNumber } from "../../util/formatters";
import ReminderNew from "../PaymentsReminder/ReminderNew";
import { INVOICE_EMAIL_SENT } from "../../constants/customeEvents";
import useUserData from "../../store/useUserData";
import { SendEmailRequest } from "../../types/PaymentConfirmation";

interface Props {
  isVisible: boolean;
  invoiceData: Invoice;
  selectedEmailType: EmailTemplate;
  onClose: () => void;
  fetchRemindersHistory?: () => void;
}

const InvoiceOrReminderEmailPreviewPopUpChange = (props: Props) => {
  const { selectedEmailType, onClose, invoiceData, isVisible, fetchRemindersHistory } = props;

  const { addToast } = useToastMessages();

  const invoiceNumber = invoiceData?.exporterSystemInvoiceId || "";
  const invoiceAmount = invoiceData?.amount || 0;
  const invoiceCurrency = invoiceData?.currency || "";
  const invoiceDueDate = formatDate(invoiceData?.dueDate || "");
  const invoiceDate = formatDate(invoiceData?.raisedDate || "");
  const importerId = invoiceData?.importer?.id || 0;
  const importerName = invoiceData?.importer?.businessName || "";
  const exporterSystemInvoiceId = invoiceData?.exporterSystemInvoiceId || "";

  const totalAmount = formatIncomingCurrencyWithNumber({
    value: invoiceAmount,
    currency: invoiceCurrency,
    minFractionDigits: 2,
    maxFractionDigits: 2,
  });

  const analytics = useAnalytics();
  const { userDetailsPreKyc } = useUserData();

  const { exporterDetails } = useContext(UserDetailsContext);
  const basePopUpContentCase =
    selectedEmailType == EmailTemplate.INVOICE_EMAIL
      ? InvoiceOrReminderPopupContentCase.EMAIL
      : InvoiceOrReminderPopupContentCase.REMINDER;
  const [popupContentCase, setPopupContentCase] = useState(basePopUpContentCase);
  const [file, setFile] = useState<File | null>(null);
  const [logoImageUrl, setImageUrl] = useState("");
  const [globalImageUrl, setGlobalImageUrl] = useState("");
  const [confirmLogoLoading, setConfirmLogoLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [preferredEmails, setPreferredEmails] = useState<PreferredEmail[]>([]);
  const [bankAccountFieldList, setBankAccountFieldList] = useState<BankAccountField[] | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [passOnFee, setPassOnFee] = useState<boolean>(false);
  const companyName = getCompanyName({ ...exporterDetails, defaultVal: userDetailsPreKyc?.businessName });

  /********************* apis **********************/
  const fetchLogoUrl = async () => {
    return await beCall({
      path: BE_ROUTES.GRAPH_QL,
      method: ALLOWED_METHODS.POST,
      body: {
        query: exporterLogoAndDescriptionQuery,
        variables: {},
        operationName: "fetchExporterLogoAndDescription",
      },
      onSuccess: (response: any) => {
        const data = response.data;
        if (data) {
          const logoUrl = data.exporterUser.exporter.businessDescription?.logoUrl;
          setImageUrl(logoUrl);
          setGlobalImageUrl(logoUrl);
        }
      },
    });
  };

  const fetchPreferredEmails = async () => {
    return await beCall({
      path: BE_ROUTES.REMINDERS_PREFERRED_EMAILS.replace(":invoiceId", props.invoiceData.id.toString()),
      method: ALLOWED_METHODS.GET,
      onSuccess: (responseData) => {
        const data = responseData.data;
        if (data) {
          setPreferredEmails(data);
        }
      },
    });
  };

  const fetchBankAccountFields = async () => {
    return await beCall({
      path: BE_ROUTES.REMINDER_BANK_ACCOUNT_FIELDS.replace(":invoiceId", props.invoiceData.id.toString()),
      method: ALLOWED_METHODS.GET,
      onSuccess: (responseData) => {
        const data = responseData.data;
        // Extract all fields from the PaymentMethodField response
        setBankAccountFieldList(data?.accountFields || null);
        setPaymentLink(data?.paymentLink || null);
        setPassOnFee(data?.passOnFee || false);
      },
    });
  };

  const fetchAllTheData = async () => {
    Promise.all([fetchLogoUrl(), fetchPreferredEmails(), fetchBankAccountFields()]).finally(() => {
      setIsDataFetched(true);
    });
  };

  useEffect(() => {
    void fetchAllTheData();
  }, []);

  /********************* onClick **********************/
  const onCloseWrapper = () => {
    setPopupContentCase(basePopUpContentCase);
    onClose();
  };

  const onConfirmLogo = () => {
    setConfirmLogoLoading(true);
    const onFileUploadSuccess = async (response: any) => {
      await fetchLogoUrl();
      setImageUrl(globalImageUrl);
      addToast({
        type: TOAST_TYPES.SUCCESS,
        id: "logo_upload_success",
        body: Locale.logoAddedSuccessfully,
      });
      setPopupContentCase(basePopUpContentCase);
      setConfirmLogoLoading(false);
    };

    const onFileuploadError = () => {
      setImageUrl(globalImageUrl);
      addToast({
        type: TOAST_TYPES.SUCCESS,
        id: "logo_upload_failure",
        body: Locale.wentWrongMessage,
      });
      setConfirmLogoLoading(false);
    };

    const formData = new FormData();
    formData.append("companyLogo", file as File);
    void beCall({
      path: BE_ROUTES.UPDATE_COMPANY_LOGO,
      method: ALLOWED_METHODS.POST,
      body: formData,
      url: "/api/route/file",
      onSuccess: onFileUploadSuccess,
      onError: onFileuploadError,
    });
  };

  const onSendEmailClick = async (emailContent: SendEmailRequest) => {
    // console.log("onSendEmailClick", emailContent);
  };

  const onEditLogoClick = () => {
    setPopupContentCase(InvoiceOrReminderPopupContentCase.UPLOAD_LOGO);
  };

  const emailPreviewTitle =
    popupContentCase == InvoiceOrReminderPopupContentCase.EMAIL
      ? Locale.invoiceRaisedBy.replace(":name", companyName)
      : Locale.paymentReminderFrom.replace(":exporterName", companyName ?? "");

  const emailPreviewSubject =
    popupContentCase == InvoiceOrReminderPopupContentCase.EMAIL
      ? Locale.sendInvoiceSubject
          .replace(":exporterName", companyName)
          .replace(":invoiceNumber", invoiceNumber)
          .replace(":amount", totalAmount)
      : Locale.paymentReminderEmailSubject
          .replace(":exporterName", companyName)
          .replace(":invoiceNumber", invoiceNumber)
          .replace(":amount", totalAmount);

  const emailPreviewDescription =
    popupContentCase == InvoiceOrReminderPopupContentCase.EMAIL
      ? Locale.sendInvoiceDescription.replace(":name", companyName).replace(":names", `${companyName}'s`)
      : Locale.emailDescription.replaceAll(":customerEntityName", companyName ?? "exporter");

  const popUpTitle =
    popupContentCase == InvoiceOrReminderPopupContentCase.EMAIL
      ? Locale.sendInvoiceToClient.replace(":name", importerName).replace(":number", invoiceNumber)
      : Locale.reminderPopupHeader
          .replace(":importerName", importerName)
          .replace(":clientInvoiceId", exporterSystemInvoiceId);

  const emailPreviewConfirmLogoHeading =
    popupContentCase == InvoiceOrReminderPopupContentCase.EMAIL
      ? Locale.looksGreatLogoEmailInvoice
      : Locale.looksGreatLogoEmailReminder;

  const showIgnoreLine = popupContentCase == InvoiceOrReminderPopupContentCase.EMAIL ? false : true;

  const renderConfirmLogoStatePopupTitle = () => {
    return (
      <div className={"flex flex-row"}>
        <div
          className={"flex flex-row mr-1 items-center cursor-pointer"}
          onClick={() => {
            setPopupContentCase(InvoiceOrReminderPopupContentCase.UPLOAD_LOGO);
          }}
        >
          <StraightArrows direction={ArrowDirection.LEFT} />
        </div>
        <div className={"flex flex-row ml-1"}>{getPopupTitle(popUpTitle)}</div>
      </div>
    );
  };

  // This is Invoice Email Preview
  const renderPreviewEmail = () => {
    return (
      <PaymentReminderEmailPreview
        title={Locale.invoiceRaisedBy.replace(":name", companyName)}
        subject={Locale.sendInvoiceSubject
          .replace(":exporterName", companyName)
          .replace(":invoiceNumber", invoiceNumber)
          .replace(":amount", totalAmount)}
        emailDescription={Locale.sendInvoiceDescription
          .replace(":name", companyName)
          .replace(":names", `${companyName}'s`)}
        exporterSystemInvoiceId={invoiceNumber}
        correspondentName={companyName}
        importerName={importerName}
        invoiceAmount={invoiceAmount}
        invoiceCurrency={invoiceCurrency}
        invoiceDate={invoiceDate}
        dueDate={invoiceDueDate}
        outstandingAmount={invoiceAmount}
        logo={globalImageUrl}
        onEditLogoClick={onEditLogoClick}
        containerClasses={!!globalImageUrl ? "max-h-[620px]" : "max-h-[550px]"}
        bankAccountFieldList={bankAccountFieldList}
        paymentLink={paymentLink}
        passOnFee={passOnFee}
        showIgnoreLine={false}
      />
    );
  };

  const onEmailSendSuccess = (data: any) => {
    document.dispatchEvent(new Event(INVOICE_EMAIL_SENT));
    props?.fetchRemindersHistory && props?.fetchRemindersHistory();
    onCloseWrapper();
  };

  if (popupContentCase === InvoiceOrReminderPopupContentCase.EMAIL) {
    return (
      <Popup
        outsideClick={onCloseWrapper}
        renderContent={() => {
          return (
            <LedgerEmailTwoSection
              invoiceId={invoiceData.id}
              isVisible={isVisible}
              onClose={onCloseWrapper}
              isDataFetched={isDataFetched}
              preferredEmails={preferredEmails}
              globalImageUrl={globalImageUrl}
              companyName={companyName}
              onEditLogoClick={() => {
                setPopupContentCase(InvoiceOrReminderPopupContentCase.UPLOAD_LOGO);
              }}
              onSendEmailSuccess={onEmailSendSuccess}
              importerName={importerName}
              importerId={importerId}
              exporterName={companyName}
              onSendEmail={onSendEmailClick}
              title={Locale.sendInvoiceToClient.replace(":name", importerName).replace(":number", invoiceNumber)}
              renderPreviewEmail={renderPreviewEmail}
              isInvoiceEmail={true}
              emailType={EmailTemplate.INVOICE_EMAIL}
              showEmailTypeToggle={true}
              popUpContentCase={popupContentCase}
              setPopupContentCase={setPopupContentCase}
              attachmentFileName={invoiceData.fileName}
            />
          );
        }}
        open={isVisible}
        isDashboardPopup={true}
        isCommonHeader={false}
        closeIconClick={onCloseWrapper}
        isLargePopup={true}
        containerClass={`h-[80%] !p-0`}
      />
    );
  } else if (popupContentCase === InvoiceOrReminderPopupContentCase.REMINDER) {
    return (
      <Popup
        outsideClick={onCloseWrapper}
        renderContent={() => {
          return (
            <ReminderNew
              isVisible={isVisible}
              onClose={onCloseWrapper}
              importerName={importerName}
              exporterSystemInvoiceId={exporterSystemInvoiceId}
              invoiceData={invoiceData}
              isDataFetched={isDataFetched}
              preferredEmails={preferredEmails}
              globalImageUrl={globalImageUrl}
              companyName={companyName}
              onEditLogoClick={() => {
                setPopupContentCase(InvoiceOrReminderPopupContentCase.UPLOAD_LOGO);
              }}
              onSendEmailSuccess={() => {
                document.dispatchEvent(new Event(INVOICE_EMAIL_SENT));
                props?.fetchRemindersHistory && props?.fetchRemindersHistory();
                onCloseWrapper();
              }}
              bankAccountFieldList={bankAccountFieldList}
              paymentLink={paymentLink}
              passOnFee={passOnFee}
              showEmailTypeToggle={true}
              popUpContentCase={popupContentCase}
              setPopupContentCase={setPopupContentCase}
            />
          );
        }}
        open={isVisible}
        isDashboardPopup={true}
        isCommonHeader={false}
        title={Locale.reminderPopupHeader
          .replace(":importerName", importerName)
          .replace(":clientInvoiceId", exporterSystemInvoiceId)}
        closeIconClick={onCloseWrapper}
        isLargePopup={true}
        containerClass={"h-[80%]"}
      />
    );
  } else if (popupContentCase === InvoiceOrReminderPopupContentCase.UPLOAD_LOGO) {
    return (
      <Popup
        outsideClick={onCloseWrapper}
        renderContent={() => (
          <div className={"flex flex-col h-full"}>
            <PopupHeader title={Locale.uploadCompanyLogoText} closeIconClick={onCloseWrapper} />
            <UploadCompanyLogoPopupContent
              fileAllowedText={Locale.signatureMaxSizeLimit}
              location={"new_invoice_creation"}
              goToNextScreen={() => {
                setPopupContentCase(InvoiceOrReminderPopupContentCase.CONFIRM_LOGO);
              }}
              setLogoImageUrl={(url) => {
                setImageUrl(url);
              }}
              setFile={(file) => {
                if (file) {
                  setImageUrl(URL.createObjectURL(file));
                  setFile(file);
                }
              }}
            />
          </div>
        )}
        open={isVisible}
        isDashboardPopup={true}
        closeIconClick={onCloseWrapper}
        isLargePopup={true}
        containerClass={"h-[80%]"}
      />
    );
  } else if (popupContentCase === InvoiceOrReminderPopupContentCase.CONFIRM_LOGO) {
    return (
      <Popup
        outsideClick={onCloseWrapper}
        renderContent={() => (
          <div className={"flex flex-col h-full"}>
            <PopupHeader title={renderConfirmLogoStatePopupTitle()} closeIconClick={onCloseWrapper} />
            <EmailPreviewConfirmLogo
              heading={emailPreviewConfirmLogoHeading}
              className={"flex-1 overflow-auto"}
              avoidFixedHeight={true}
              renderBody={() => (
                <PaymentReminderEmailPreview
                  title={emailPreviewTitle}
                  subject={emailPreviewSubject}
                  emailDescription={emailPreviewDescription}
                  showIgnoreLine={showIgnoreLine}
                  containerClasses={"!w-[352px] mt-6"}
                  emailPreviewClasses={"!rounded-b-none"}
                  logo={logoImageUrl}
                  withFixedHeader={false}
                  withFrom={false}
                  withSubject={false}
                  outstandingAmount={invoiceAmount}
                  exporterSystemInvoiceId={invoiceNumber}
                  correspondentName={companyName}
                  importerName={importerName}
                  invoiceAmount={invoiceAmount}
                  invoiceCurrency={invoiceCurrency}
                  invoiceDate={invoiceDate}
                  dueDate={invoiceDueDate}
                  onEditLogoClick={onEditLogoClick}
                  bankAccountFieldList={bankAccountFieldList}
                  paymentLink={paymentLink}
                  passOnFee={passOnFee}
                />
              )}
            />
            <div>
              <div className={"flex justify-center items-center flex-1 mt-2 h-12 bg-white"}>
                <div className={"flex flex-row justify-between"}>
                  <Button
                    title={Locale.reUploadLogo}
                    onButtonClick={() => {
                      setPopupContentCase(InvoiceOrReminderPopupContentCase.UPLOAD_LOGO);
                      setImageUrl(globalImageUrl);
                      analytics?.trackAsync(Events.LOGO_UPLOAD_EDIT_LOGO_CLICK, {
                        location: "new_invoice_creation",
                      });
                    }}
                    type={BUTTON_TYPES.SECONDARY}
                    buttonClass={"mr-2"}
                  />
                  <Button title={Locale.confirmButton} onButtonClick={onConfirmLogo} isLoading={confirmLogoLoading} />
                </div>
              </div>
            </div>
          </div>
        )}
        open={isVisible}
        isDashboardPopup={true}
        closeIconClick={onCloseWrapper}
        isLargePopup={true}
        containerClass={"h-[80%]"}
        ctaClass={"h-12 shrink-0"}
      />
    );
  }

  return null;
};

export default InvoiceOrReminderEmailPreviewPopUpChange;

export enum InvoiceOrReminderPopupContentCase {
  REMINDER = "reminder",
  EMAIL = "email",
  UPLOAD_LOGO = "uploadLogo",
  CONFIRM_LOGO = "confirmLogo",
}
