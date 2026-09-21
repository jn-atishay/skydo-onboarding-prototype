import React, { useState } from "react";
import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import Button from "../AtomicComponents/Button";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES, BUTTON_TYPES, BUTTON_SIZES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import classNames from "classnames";
import useMobileDetect from "../../util/customHooks/useMobileDetect";

interface SanctionDeclarationPopupProps {
  isOpen: boolean;
  onSubmit: (pepAnswer: boolean, criminalAnswer: boolean) => void;
  isLoading?: boolean;
}

const SanctionDeclarationPopup: React.FC<SanctionDeclarationPopupProps> = ({
  isOpen,
  onSubmit,
  isLoading = false,
}) => {
  const [pepAnswer, setPepAnswer] = useState<boolean | null>(null);
  const [criminalAnswer, setCriminalAnswer] = useState<boolean | null>(null);
  const { isMobile } = useMobileDetect();

  const handleSubmit = () => {
    if (pepAnswer !== null && criminalAnswer !== null) {
      onSubmit(pepAnswer, criminalAnswer);
    }
  };

  const isSubmitDisabled = pepAnswer === null || criminalAnswer === null || isLoading;

  const renderRadioButton = (
    name: string,
    value: boolean,
    currentValue: boolean | null,
    onChange: (value: boolean) => void,
    label: string
  ) => {
    if (isMobile) {
      // Render as buttons for mobile
      return (
        <Button
          title={label}
          type={currentValue === value ? BUTTON_TYPES.PRIMARY : BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.MEDIUM}
          onButtonClick={() => onChange(value)}
          buttonClass={classNames("flex-1", {
            "!bg-blue-500 !text-white !border-blue-500": currentValue === value,
            "!bg-white !text-gray-700 !border-gray-300": currentValue !== value,
          })}
        />
      );
    }
    
    // Render as radio buttons for desktop
    return (
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name={name}
          checked={currentValue === value}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        <div
          className={classNames(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3",
            {
              "border-blue-400 bg-blue-400": currentValue === value,
              "border-gray-300": currentValue !== value,
            }
          )}
        >
          {currentValue === value && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <Typography
          text={label}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses="select-none"
        />
      </label>
    );
  };

  const renderContent = () => (
    <div className={classNames("flex flex-col", { 
      "px-4 pb-4": isMobile, // Add proper horizontal and bottom padding for mobile, no top padding
      "px-0": !isMobile 
    })}>
      {/* PEP Question */}
      <div className={classNames({
        "mb-4": isMobile, // Less spacing for mobile
        "mb-6": !isMobile // Normal spacing for desktop
      })}>
        <div className={classNames({
          "mb-3 leading-tight": isMobile, // Tighter line height and less margin for mobile
          "mb-4 leading-relaxed": !isMobile // Normal spacing for desktop
        })}>
          <Typography
            text={Locale.pepDeclarationForIndividualBusinesses}
            type={TYPOGRAPHY_TYPES.PARA}
            size={isMobile ? TYPOGRAPHY_SIZES.SMALL : TYPOGRAPHY_SIZES.MEDIUM}
            textClasses="inline"
          />
          <span className="text-red-500 ml-1">*</span>
        </div>
        <div className={classNames("flex flex-row", {
          "space-x-3": isMobile, // Closer spacing for mobile buttons
          "space-x-6": !isMobile, // More spacing for desktop radio buttons
        })}>
          {renderRadioButton("pep", true, pepAnswer, setPepAnswer, "Yes")}
          {renderRadioButton("pep", false, pepAnswer, setPepAnswer, "No")}
        </div>
      </div>

      {/* Criminal Conviction Question */}
      <div className={classNames({
        "mb-4": isMobile, // Less spacing for mobile
        "mb-6": !isMobile // Normal spacing for desktop
      })}>
        <div className={classNames({
          "mb-3 leading-tight": isMobile, // Tighter line height and less margin for mobile
          "mb-4 leading-relaxed": !isMobile // Normal spacing for desktop
        })}>
          <Typography
            text={Locale.criminalDeclarationTextForIndividualBusinesses}
            type={TYPOGRAPHY_TYPES.PARA}
            size={isMobile ? TYPOGRAPHY_SIZES.SMALL : TYPOGRAPHY_SIZES.MEDIUM}
            textClasses="inline"
          />
          <span className="text-red-500 ml-1">*</span>
        </div>
        <div className={classNames("flex flex-row", {
          "space-x-3": isMobile, // Closer spacing for mobile buttons
          "space-x-6": !isMobile, // More spacing for desktop radio buttons
        })}>
          {renderRadioButton("criminal", true, criminalAnswer, setCriminalAnswer, "Yes")}
          {renderRadioButton("criminal", false, criminalAnswer, setCriminalAnswer, "No")}
        </div>
      </div>

      {/* Border separator */}
      <div className="border-t border-gray-300 mt-3 mb-4"></div>

      {/* Footer Note and Submit Button */}
      {isMobile ? (
        // Mobile: Separate containers for note and button
        <>
          <Typography
            text={Locale.pepDeclarationFooterNote}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses="text-gray-500 leading-relaxed mb-4"
          />
          <div className="w-full">
            <Button
              title="Agree and Submit"
              type={BUTTON_TYPES.PRIMARY}
              size={BUTTON_SIZES.MEDIUM}
              onButtonClick={handleSubmit}
              isDisabled={isSubmitDisabled}
              isLoading={isLoading}
              buttonClass="!w-full !block !max-w-none"
            />
          </div>
        </>
      ) : (
        // Desktop: Keep existing layout
        <div className="flex flex-row items-center justify-between">
          <Typography
            text={Locale.pepDeclarationFooterNote}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses="text-gray-500 leading-relaxed flex-1"
          />
          <Button
            title="Agree and Submit"
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.LARGE}
            onButtonClick={handleSubmit}
            isDisabled={isSubmitDisabled}
            isLoading={isLoading}
            buttonClass="min-w-[200px] ml-6 flex-shrink-0"
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Custom overlay with background similar to mobile */}
      {isOpen && !isMobile && (
        <div 
          className="fixed inset-0 z-[100000] bg-black-700/60"
          style={{ backdropFilter: 'none' }}
        />
      )}
      <Popup
        open={isOpen}
        renderContent={renderContent}
        isCommonHeader={true}
        title={Locale.pepDeclarationHeading}
        isDashboardPopup={true}
        isMobilePopup={false}
        disableCrossIcon={true}
        headerContainerClass={classNames({
          "px-4 pt-2 pb-0": isMobile, // Minimal top padding and no bottom padding for mobile
          "": !isMobile
        })}
        bgWrapperClass={classNames({
          "!items-end": isMobile, // Position at bottom for mobile
          "!items-center !bg-transparent": !isMobile, // Transparent background for desktop to show custom overlay
        })}
        outsideClick={() => {}} // Disable outside click to prevent accidental closure
        containerClass={classNames({
          "!w-full !max-w-none !rounded-t-2xl !rounded-b-none !m-0 !max-h-[90vh] !p-0": isMobile, // Full width bottom sheet for mobile with no padding
          "!w-3/5 !max-w-4xl !rounded-2xl !shadow-2xl !relative !z-[100001]": !isMobile, // Wider modal for desktop with higher z-index
        })}
      />
    </>
  );
};

export default SanctionDeclarationPopup;
