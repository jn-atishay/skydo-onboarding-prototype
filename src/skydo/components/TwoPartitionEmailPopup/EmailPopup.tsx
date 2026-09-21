/**
 * @author Raj Sheth
 * created: 12/10/23
 */

import React, { FC } from "react";
import { LeftSectionBase } from "./types";
import useUploadLogoFlow from "./useUploadLogoFlow";
import { InvoiceOrReminderPopupContentCase } from "../InvoiceOrRemindEmailPopUp/InvoiceOrReminderEmailPreviewPopUpChange";
import TwoPartitionPopup from "../TwoPartitionPopup";
import EmailForm from "../EmailComponents/EmailForm";
import Popup from "../AtomicComponents/Popup";
import PopupHeader from "../AtomicComponents/Popup/PopupHeader";
import Locale from "../../util/locale/en";
import UploadCompanyLogoPopupContent, {
  UploadLogoFlow,
} from "../InternationalAccountsComp/UploadCompanyLogoPopupContent";
import EmailPreviewConfirmLogo from "../PaymentsReminder/EmailPreviewConfirmLogo";
import Button from "../AtomicComponents/Button";
import { BUTTON_TYPES } from "../../constants/atomicConstants";
import EmailPreviewRightSection from "../PaymentsReminder/EmailPreviewRightSection";
import useEmailPopupStore from "../../store/useEmailPopupStore";

export interface Props {
  location: UploadLogoFlow;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;

  leftSectionProps: LeftSectionBase;
  renderEmailPreviewSection: (extraProps?: any) => JSX.Element;

  exporterName: string;
}

const EmailPopup: FC<Props> = (props) => {
  const { isVisible, exporterName } = props;
  const { popupContentCase, setPopupContentCase } = useEmailPopupStore();
  const { setLogoUrl, globalImageUrl, isConfirmLogoLoading, setFilWrapper, onConfirmLogo, logoUrl } = useUploadLogoFlow(
    {
      initialContentCase: InvoiceOrReminderPopupContentCase.EMAIL,
    }
  );

  const onCloseWrapper = () => {
    setPopupContentCase(InvoiceOrReminderPopupContentCase.EMAIL);
    props.setIsVisible(false);
  };

  const renderEmailPreview = (extraProps?: any) => props.renderEmailPreviewSection(extraProps);

  switch (popupContentCase) {
    case InvoiceOrReminderPopupContentCase.EMAIL:
      return (
        <TwoPartitionPopup
          containerClass={"!w-3/4 !min-w-[600px] !max-w-[950px] !h-[80%] !max-h-[750px]"}
          isOpen={isVisible}
          onClose={onCloseWrapper}
          leftContainerClass={"!p-0"}
          rightContainerClass={"!p-0"}
          leftContent={() => {
            if (props.leftSectionProps.emailFormOverride?.renderLeftSection) {
              return props.leftSectionProps.emailFormOverride?.renderLeftSection();
            }
            if (props.leftSectionProps.emailFormSection) {
              return (
                <EmailForm
                  preferredEmails={props.leftSectionProps.emailFormSection.preferredEmails}
                  onClose={onCloseWrapper}
                  title={props.leftSectionProps.emailFormSection.title}
                  isDataFetched={props.leftSectionProps.emailFormSection.isDataFetched}
                  onSendEmail={props.leftSectionProps.emailFormSection.onSendEmail}
                  popUpContentCase={popupContentCase}
                  setPopupContentCase={setPopupContentCase}
                  attachmentFileName={props.leftSectionProps.emailFormSection.attachmentFileName}
                  renderBelowBccFields={props.leftSectionProps.emailFormSection.renderBelowBccFields}
                  onToFocusEvent={
                    props.leftSectionProps.emailFormSection.onToFocusEvent
                      ? props.leftSectionProps.emailFormSection.onToFocusEvent
                      : () => {}
                  }
                  onCcFocusEvent={
                    props.leftSectionProps.emailFormSection.onCcFocusEvent
                      ? props.leftSectionProps.emailFormSection.onCcFocusEvent
                      : () => {}
                  }
                  onBccFocusEvent={
                    props.leftSectionProps.emailFormSection.onBccFocusEvent
                      ? props.leftSectionProps.emailFormSection.onBccFocusEvent
                      : () => {}
                  }
                  onSendClickEvent={
                    props.leftSectionProps.emailFormSection.onSendClickEvent
                      ? props.leftSectionProps.emailFormSection.onSendClickEvent
                      : () => {}
                  }
                />
              );
            }
            return <></>;
          }}
          rightContent={() => (
            <>
              <EmailPreviewRightSection
                isDataFetched={true} // TODO: prop
                logoUrl={logoUrl}
                companyName={exporterName}
                onEditLogoClick={() => {
                  setPopupContentCase(InvoiceOrReminderPopupContentCase.UPLOAD_LOGO);
                }}
              >
                {renderEmailPreview()}
              </EmailPreviewRightSection>
            </>
          )}
        />
      );

    case InvoiceOrReminderPopupContentCase.UPLOAD_LOGO:
      return (
        <Popup
          containerClass={"!w-3/4 !min-w-[600px] !max-w-[950px] !max-h-[750px] !h-[80%]"}
          outsideClick={onCloseWrapper}
          renderContent={() => (
            <div className={"flex flex-col h-full"}>
              <PopupHeader title={Locale.uploadCompanyLogoText} closeIconClick={onCloseWrapper} />
              <UploadCompanyLogoPopupContent
                location={props.location}
                containerClass={"flex-1"}
                goToNextScreen={() => {
                  setPopupContentCase(InvoiceOrReminderPopupContentCase.CONFIRM_LOGO);
                }}
                setLogoImageUrl={setLogoUrl}
                setFile={setFilWrapper}
                fileAllowedText={Locale.signatureMaxSizeLimit}
              />
            </div>
          )}
          open={isVisible}
          isDashboardPopup={true}
          closeIconClick={onCloseWrapper}
          isLargePopup={true}
        />
      );

    case InvoiceOrReminderPopupContentCase.CONFIRM_LOGO:
      return (
        <Popup
          containerClass={"!w-3/4 !min-w-[600px] !max-w-[950px] !max-h-[750px] !h-[80%]"}
          outsideClick={onCloseWrapper}
          renderContent={() => (
            <div className={"flex flex-col h-full"}>
              <PopupHeader title={Locale.confirmLogo} closeIconClick={onCloseWrapper} />
              <EmailPreviewConfirmLogo
                heading={""}
                className={"flex-1 overflow-auto"}
                avoidFixedHeight={true}
                renderBody={() => (
                  <div className={"!max-w-[352px]"}>
                    {renderEmailPreview({
                      showHeader: false,
                    })}
                  </div>
                )}
              />
              <div>
                <div className={"flex justify-center items-center flex-1 mt-2 h-12 bg-white"}>
                  <div className={"flex flex-row justify-between"}>
                    <Button
                      title={Locale.reUploadLogo}
                      onButtonClick={() => {
                        setPopupContentCase(InvoiceOrReminderPopupContentCase.UPLOAD_LOGO);
                        setLogoUrl(globalImageUrl);
                        // TODO: analytics
                      }}
                      type={BUTTON_TYPES.SECONDARY}
                      buttonClass={"mr-2"}
                    />
                    <Button
                      title={Locale.confirmButton}
                      onButtonClick={onConfirmLogo}
                      isLoading={isConfirmLogoLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          open={isVisible}
          isDashboardPopup={true}
          closeIconClick={onCloseWrapper}
          isLargePopup={true}
          ctaClass={"h-12 shrink-0"}
        />
      );
  }

  return null;
};

export default EmailPopup;
