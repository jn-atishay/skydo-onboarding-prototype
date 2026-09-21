import Typography from "../../components/AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../../components/AtomicComponents/Button";
import UploadIcon from "../../components/Icons/UploadIcon";
import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../context/AppContext";
import Popup from "../../components/AtomicComponents/Popup";
import UploadInvoicePopup from "./UploadInvoicePopup";
import InvoicesNavIcon from "../../components/Icons/InvoicesNavIcon";
import { useRouter } from "next/router";
import UploadInvoicePopupContext, { ConfigType } from "../../context/UploadInvoicePopupContext";
import { DataQualityDismissal } from "../../types/Invoice/upload";
import AlertPopup from "../../components/AtomicComponents/Popup/AlertPopup";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  isButton?: boolean;
  buttonSize?: string;
  onSuccess: (config?: ConfigType) => void;
  noInvoices?: boolean;
  source?: string;
  buttonTitle?: string;
  buttonClass?: string;
}

const UploadInvoiceContainer = ({
  isButton,
  onSuccess,
  noInvoices,
  buttonSize,
  source,
  buttonTitle,
  buttonClass,
}: Props) => {
  const { theme } = useContext(AppContext);
  const [alert, setAlert] = useState(false);
  const dataQualityDismissalRef = useRef<DataQualityDismissal | null>(null);
  const router = useRouter();
  const { openInvoiceUpload } = router.query;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const analytics = useAnalytics();
  const bgWrapperClass = alert ? "!opacity-0" : "!bg-black-700/80";

  useEffect(() => {
    if (openInvoiceUpload) {
      setIsPopupOpen(true);
    }
  }, [openInvoiceUpload]);

  const renderUploadIcon = (stroke?: string) => {
    return <UploadIcon height={16} width={16} stroke={stroke || theme.hexColors.black[700]} strokeWidth={2.5} />;
  };

  const onButtonClick = () => {
    analytics.trackAsync(Events.UPLOAD_INVOICE_BUTTON_CLICK, {
      source: source || "",
    });
    togglePopupStatus();
  };

  const togglePopupStatus = () => setIsPopupOpen(!isPopupOpen);

  const renderUploadInvoiceContent = () => {
    return (
      <UploadInvoicePopup
        closeIconClick={() => {
          analytics.trackAsync(Events.UPLOAD_INVOICE_CLOSE_WITHOUT_UPLOAD);
          setIsPopupOpen(false);
        }}
      />
    );
  };

  const renderNoInvoicesCard = () => {
    return (
      <div className={"flex-1 w-full flex flex-col items-center justify-center py-4"}>
        <InvoicesNavIcon height={32} width={32} />
        <div className={"mt-3 mb-4 flex flex-col text-center"}>
          <Typography text={Locale.noInvoices} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} />
          <Typography
            text={Locale.uploadMultipleInvoices}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500 mt-1"}
          />
        </div>
        <Button
          title={Locale.upload}
          size={BUTTON_SIZES.SMALL}
          rightIcon={() => renderUploadIcon(theme.hexColors.white)}
          onButtonClick={onButtonClick}
        />
      </div>
    );
  };

  return (
    <UploadInvoicePopupContext.Provider
      value={{
        onSuccess: onSuccess,
        setAlert: (value, dataQualityDismissal) => {
          dataQualityDismissalRef.current = dataQualityDismissal ?? null;
          setAlert(value);
        },
      }}
    >
      {isButton ? (
        <>
          <Button
            title={buttonTitle || Locale.uploadInvoiceButton}
            size={buttonSize || BUTTON_SIZES.SMALL}
            type={BUTTON_TYPES.SECONDARY}
            rightIcon={renderUploadIcon}
            onButtonClick={onButtonClick}
            buttonClass={buttonClass || ""}
          />
          <Popup
            renderContent={renderUploadInvoiceContent}
            open={isPopupOpen}
            closeIconClick={togglePopupStatus}
            isDashboardPopup={true}
            isLargePopup={true}
            containerStyle={{ height: 650 }}
            containerClass={"flex flex-col !p-0 !overflow-visible"}
            bgWrapperClass={bgWrapperClass}
          />
        </>
      ) : (
        <div className={"flex-1 flex flex-row items-center justify-between bg-white rounded-10px px-6 py-4"}>
          <>
            {noInvoices ? (
              renderNoInvoicesCard()
            ) : (
              <>
                <div className={"flex flex-col"}>
                  <Typography
                    text={Locale.uploadInvoice}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.LARGE}
                    fontWeight={"700"}
                  />
                  <Typography
                    text={Locale.uploadMultipleInvoices}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500 mt-1"}
                  />
                </div>
                <Button
                  title={Locale.upload}
                  size={buttonSize || BUTTON_SIZES.SMALL}
                  type={BUTTON_TYPES.SECONDARY}
                  rightIcon={renderUploadIcon}
                  onButtonClick={onButtonClick}
                />
              </>
            )}
            <Popup
              renderContent={renderUploadInvoiceContent}
              open={isPopupOpen}
              closeIconClick={togglePopupStatus}
              isDashboardPopup={true}
              isLargePopup={true}
              containerStyle={{ height: 606 }}
              containerClass={"flex flex-col !p-0 !overflow-visible"}
              bgWrapperClass={bgWrapperClass}
            />
          </>
        </div>
      )}
      {alert && (
        <AlertPopup
          title={Locale.areYouSure}
          text={Locale.uploadInvoiceCloseConfirmText}
          isOpen={alert}
          onCancel={() => {
            setAlert(false);
            analytics.trackAsync(Events.UPLOAD_INVOICE_CLOSE_CANCEL);
          }}
          rightCta={Locale.confirm}
          onRightCtaClick={() => {
            togglePopupStatus();
            analytics.trackAsync(Events.UPLOAD_INVOICE_CLOSE_CONFIRM);
            if (dataQualityDismissalRef.current) {
              analytics.trackAsync(Events.INVOICE_DATA_QUALITY_MODAL_DISMISSED, {
                platform: "desktop",
                ...dataQualityDismissalRef.current,
              });
              dataQualityDismissalRef.current = null;
            }
            setAlert(false);
          }}
          isRightCtaLoading={false}
        />
      )}
    </UploadInvoicePopupContext.Provider>
  );
};

export default UploadInvoiceContainer;
