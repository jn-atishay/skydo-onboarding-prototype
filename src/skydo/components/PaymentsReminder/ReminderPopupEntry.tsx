import React, { useEffect, useState } from "react";
import Popup from "../AtomicComponents/Popup";
import Locale from "../../util/locale/en";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { exporterLogoAndDescriptionQuery } from "../../util/queries";
import { BankAccountField, ExporterUserDetails, Invoice } from "../../types";
import UploadCompanyLogoPopupContent from "../InternationalAccountsComp/UploadCompanyLogoPopupContent";
import EmailPreviewConfirmLogo from "./EmailPreviewConfirmLogo";
import Button from "../AtomicComponents/Button";
import { BUTTON_TYPES, TOAST_TYPES } from "../../constants/atomicConstants";
import PaymentReminderEmailPreview from "./PaymentReminderEmailPreview";
import useToastMessages from "../../store/toastMessages";
import ReminderNew from "./ReminderNew";
import { getCompanyName, getOutstandingAmountForInvoice } from "../../util/functions";
import PopupHeader, { getPopupTitle } from "../AtomicComponents/Popup/PopupHeader";
import { StraightArrows } from "../Icons/StraightArrows";
import { ArrowDirection } from "../Icons/ArrowIconSmall";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import useUserData from "../../store/useUserData";

export interface PaymentReminderProps {
  isVisible: boolean;
  onClose: () => void;
  importerName: string;
  exporterSystemInvoiceId: string;
  invoiceData: Invoice;
  preferredEmails?: PreferredEmail[];
  fetchRemindersHistory?: () => void;
}

enum PopupContentCase {
  REMINDER = "reminder",
  UPLOAD_LOGO = "uploadLogo",
  CONFIRM_LOGO = "confirmLogo",
}

export interface PreferredEmail {
  email: string;
  type: "to" | "cc" | "bcc";
}

const ReminderPopupEntry: React.FC<PaymentReminderProps> = (props) => {
  const { isVisible, onClose } = props;
  const analytics = useAnalytics();
  const { addToast } = useToastMessages();
  const [popupContentCase, setPopupContentCase] = useState(PopupContentCase.REMINDER);
  const [file, setFile] = useState<File | null>(null);
  const [logoImageUrl, setImageUrl] = useState("");
  const [globalImageUrl, setGlobalImageUrl] = useState("");
  const [preferredEmails, setPreferredEmails] = useState<PreferredEmail[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [exporterUser, setExporterData] = useState<ExporterUserDetails | null>(null);
  const [confirmLogoLoading, setConfirmLogoLoading] = useState(false);
  const [bankAccountFieldList, setBankAccountFieldList] = useState<BankAccountField[] | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [passOnFee, setPassOnFee] = useState<boolean>(false);
  const { userDetailsPreKyc } = useUserData();
  const onCloseWrapper = () => {
    onClose();
    setPopupContentCase(PopupContentCase.REMINDER);
  };

  const companyName = getCompanyName({ ...exporterUser?.exporter, defaultVal: userDetailsPreKyc?.businessName });

  const onConfirmLogo = () => {
    analytics.trackAsync(Events.LOGO_UPLOAD_CONFIRM_CLICK, {
      location: "client_reminder_popup",
    });
    setConfirmLogoLoading(true);
    const onFileUploadSuccess = async (response: any) => {
      await fetchLogoUrl();
      setImageUrl(globalImageUrl);
      addToast({
        type: TOAST_TYPES.SUCCESS,
        id: "logo_upload_success",
        body: Locale.logoAddedSuccessfully,
      });
      setPopupContentCase(PopupContentCase.REMINDER);
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

  const fetchExporterDataApi = async () => {
    return await beCall({
      path: BE_ROUTES.GET_LOGGEDIN_USER_DETAILS,
      onSuccess: (data: any) => {
        if (data) {
          setExporterData(data?.data || {});
        }
      },
    });
  };

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
    Promise.all([fetchExporterDataApi(), fetchLogoUrl(), fetchPreferredEmails(), fetchBankAccountFields()]).finally(
      () => {
        setIsDataFetched(true);
      }
    );
  };

  useEffect(() => {
    void fetchAllTheData();
  }, []);

  const renderPopupTitle = () => {
    return (
      <div className={"flex flex-row"}>
        <div
          className={"flex flex-row mr-1 items-center cursor-pointer"}
          onClick={() => {
            if (popupContentCase === PopupContentCase.UPLOAD_LOGO) {
              setPopupContentCase(PopupContentCase.REMINDER);
            } else if (popupContentCase === PopupContentCase.CONFIRM_LOGO) {
              setPopupContentCase(PopupContentCase.UPLOAD_LOGO);
            } else {
              onCloseWrapper();
            }
          }}
        >
          <StraightArrows direction={ArrowDirection.LEFT} />
        </div>
        <div className={"flex flex-row ml-1"}>
          {getPopupTitle(
            Locale.reminderPopupHeader
              .replace(":importerName", props.importerName)
              .replace(":clientInvoiceId", props.exporterSystemInvoiceId)
          )}
        </div>
      </div>
    );
  };

  if (popupContentCase === PopupContentCase.REMINDER) {
    return (
      <Popup
        outsideClick={onCloseWrapper}
        renderContent={() => {
          return (
            <ReminderNew
              {...props}
              isDataFetched={isDataFetched}
              preferredEmails={preferredEmails}
              globalImageUrl={globalImageUrl}
              companyName={companyName}
              onEditLogoClick={() => {
                setPopupContentCase(PopupContentCase.UPLOAD_LOGO);
              }}
              onSendEmailSuccess={() => {
                props?.fetchRemindersHistory && props?.fetchRemindersHistory();
                onCloseWrapper();
              }}
              bankAccountFieldList={bankAccountFieldList}
              paymentLink={paymentLink}
              passOnFee={passOnFee}
            />
          );
        }}
        open={isVisible}
        isDashboardPopup={true}
        isCommonHeader={false}
        title={Locale.reminderPopupHeader
          .replace(":importerName", props.importerName)
          .replace(":clientInvoiceId", props.exporterSystemInvoiceId)}
        closeIconClick={onCloseWrapper}
        isLargePopup={true}
        containerClass={"h-[80%]"}
      />
    );
  }
  if (popupContentCase === PopupContentCase.UPLOAD_LOGO) {
    return (
      <Popup
        outsideClick={onCloseWrapper}
        renderContent={() => (
          <div className={"flex flex-col h-full"}>
            <PopupHeader title={renderPopupTitle()} closeIconClick={onCloseWrapper} />
            <UploadCompanyLogoPopupContent
              location={"client_reminder_popup"}
              fileAllowedText={Locale.signatureMaxSizeLimit}
              goToNextScreen={() => {
                setPopupContentCase(PopupContentCase.CONFIRM_LOGO);
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
  }
  if (popupContentCase === PopupContentCase.CONFIRM_LOGO) {
    return (
      <Popup
        outsideClick={onCloseWrapper}
        renderContent={() => (
          <div className={"flex flex-col h-full"}>
            <PopupHeader title={renderPopupTitle()} closeIconClick={onCloseWrapper} />
            <EmailPreviewConfirmLogo
              heading={Locale.looksGreatLogoEmailReminder}
              className={"flex-1 overflow-auto"}
              renderBody={() => (
                <PaymentReminderEmailPreview
                  containerClasses={"!w-[352px] mt-6 -mb-6 !mr-0"}
                  emailPreviewClasses={"!rounded-b-none"}
                  logo={logoImageUrl}
                  withFixedHeader={false}
                  withFrom={false}
                  withSubject={false}
                  bankAccountFieldList={bankAccountFieldList}
                  paymentLink={paymentLink}
                  passOnFee={passOnFee}
                  outstandingAmount={getOutstandingAmountForInvoice(props.invoiceData)}
                  exporterSystemInvoiceId={props.invoiceData.exporterSystemInvoiceId}
                  correspondentName={companyName}
                  importerName={props.importerName}
                  invoiceAmount={props.invoiceData.amount}
                  invoiceCurrency={props.invoiceData.currency}
                  invoiceDate={props.invoiceData.raisedDate}
                  dueDate={props.invoiceData.dueDate}
                  onEditLogoClick={() => {
                    setPopupContentCase(PopupContentCase.UPLOAD_LOGO);
                  }}
                  showIgnoreLine={true}
                />
              )}
            />
            <div className={"flex justify-center items-center -mt-[48px] bg-white"}>
              <div className={"flex flex-row justify-between"}>
                <Button
                  title={Locale.reUploadLogo}
                  onButtonClick={() => {
                    setPopupContentCase(PopupContentCase.UPLOAD_LOGO);
                    setImageUrl(globalImageUrl);
                    analytics?.trackAsync(Events.LOGO_UPLOAD_EDIT_LOGO_CLICK, {
                      location: "payment_reminder",
                    });
                  }}
                  type={BUTTON_TYPES.SECONDARY}
                  buttonClass={"mr-2"}
                />
                <Button title={Locale.confirmButton} onButtonClick={onConfirmLogo} isLoading={confirmLogoLoading} />
              </div>
            </div>
          </div>
        )}
        open={isVisible}
        isDashboardPopup={true}
        closeIconClick={onCloseWrapper}
        isLargePopup={true}
        containerClass={"h-[80%]"}
      />
    );
  }

  return null;
};

export default ReminderPopupEntry;
