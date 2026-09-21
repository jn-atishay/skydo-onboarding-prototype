import React from "react";
import Image from "next/image";
import Popup from "../AtomicComponents/Popup";
import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import ExclamationIcon from "../Icons/ExclamationIcon";
import CircleCheckIcon from "../Icons/CircleCheckIcon";
import useMobileVersionHook from "../Common/useMobileVersionHook";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'unavailable' | 'already_initiated' | 'already_settled';
}

const InstantSettlementInfoPopup = (props: Props) => {
  const { isOpen, onClose, type } = props;
  const { isMobile } = useMobileVersionHook();

  if (!isOpen) return null;

  const getPopupContent = () => {
    switch (type) {
      case 'unavailable':
        return {
          icon: () => <ExclamationIcon width={44} height={44} fillcolor="#FFC043" />,
          title: "Instant settlement unavailable",
          message: "We're sorry! Instant settlement isn't possible for this payment at the moment. Your funds will reach your Indian bank account in standard time.",
        };
      case 'already_initiated':
        return {
          icon: () => <ExclamationIcon width={44} height={44} fillcolor="#FFC043" />,
          title: "Instant settlement already initiated",
          message: "INR settlement has already been initiated to your Indian account. You'll receive the funds via standard settlement in 2-3 hours.",
        };
      case 'already_settled':
        return {
          icon: () => <Image src="/images/Tick.svg" alt="Tick" width={64} height={64} style={{ objectFit: 'contain' }} />,
          title: "This payment has already been settled!",
          message: "INR settlement has already been initiated to your Indian account. You'll receive the funds via standard settlement in 2-3 hours.",
        };
      default:
        return null;
    }
  };

  const content = getPopupContent();
  if (!content) return null;

  const renderTitle = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-3 w-full relative">
        {content.icon()}
        <Typography
          text={content.title}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses="text-center"
        />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="flex flex-col items-center justify-center -mt-4" >
        <Typography
          text={content.message}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses="!text-black-500 text-center"
        />
      </div>
    );
  };

  const renderCTAs = () => {
    return (
      <div className="flex flex-row w-full mt-14" >
        <Button
          title="Understood"
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={onClose}
          buttonProps={{
            className: "w-full",
            style: {
              display: 'flex',
              padding: '14px 24px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'stretch',
              borderRadius: '10px',
              background: '#283C8B',
            }
          }}
        />
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .instant-settlement-popup-header > div:first-child > div:first-child {
            justify-content: center !important;
            position: relative;
            padding-top: 48px !important;
          }
          .instant-settlement-popup-header > div:first-child > div:first-child > div:last-child {
            position: absolute !important;
            right: 0 !important;
            top: 0 !important;
          }
        `
      }} />
      <Popup
        title={renderTitle()}
        isCommonHeader={true}
        renderContent={renderContent}
        open={isOpen}
        outsideClick={onClose}
        closeIconClick={onClose}
        renderCTAs={renderCTAs}
        isDashboardPopup={true}
        isMobilePopup={isMobile || false}
        customContainerWidth={isMobile || false}
        containerClass={isMobile ? "!w-full !max-w-full mx-4" : ""}
        headerContainerClass="relative instant-settlement-popup-header"
      />
    </>
  );
};

export default InstantSettlementInfoPopup;

