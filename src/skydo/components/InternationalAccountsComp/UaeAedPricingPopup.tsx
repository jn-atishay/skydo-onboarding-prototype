import React, { useContext } from "react";
import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import Button from "../AtomicComponents/Button";
import Tooltip from "../AtomicComponents/Tooltip";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
  TOOLTIP_POSITION,
} from "../../constants/atomicConstants";
import InfoIcon from "../Icons/InfoIcon";
import Locale from "../../util/locale/en";
import AppContext from "../../context/AppContext";
import PricingPopUpAccountIcon from "../Icons/GlomoPayComponents/PricingPopUpAccountIcon";
import RightArrowIcon from "../Icons/RightArrowIcon";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface UaeAedPricingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptPricing: () => void;
  isLoading?: boolean;
  onGoBack?: () => void;
  // Overridden when the same pricing is shown for niche regional currencies rather than AED.
  title?: string;
  accountLabel?: string;
}

const UaeAedPricingPopup: React.FC<UaeAedPricingPopupProps> = ({
  isOpen,
  onClose,
  onAcceptPricing,
  isLoading = false,
  onGoBack,
  title,
  accountLabel,
}) => {
  const { theme } = useContext(AppContext);
  const isRegionalVariant = !!accountLabel;
  const popupTitle = title ?? Locale.uaeAedPricingPopup.pricingForAedPayments;
  const pricingPrefix = isRegionalVariant
    ? Locale.uaeAedPricingPopup.pricingPrefixRegional
    : Locale.uaeAedPricingPopup.pricingPrefixAed;
  const analytics = useAnalytics();

  const handlePricingAccept = () => {
    analytics?.trackAsync(Events.UAE_ACCOUNT.PRICING_ACCEPTED);
    onAcceptPricing();
  };

  const handleGoBack = () => {
    analytics?.trackAsync(Events.UAE_ACCOUNT.PRICING_POPUP_GO_BACK);
    (onGoBack ?? onClose)();
  };

  // Desktop popup content
  const renderDesktopContent = () => (
    <div className="flex flex-col items-center bg-white rounded-lg">
      {/* Header with Custom SVG Account Card - Full Width */}
      <div className="w-full flex justify-center">
        <PricingPopUpAccountIcon
          width={574}
          height={Math.round((574 * 150) / 574)}
          accountLabel={accountLabel}
          showGlobeIcon={isRegionalVariant}
        />
      </div>

      <div className="w-full h-px bg-black-400 mb-6" />

      {/* Content Container with 24px left/right margin */}
      <div className="w-full flex flex-col items-center px-6">
        {/* Main Content */}
        <div className="flex items-center gap-2 mb-6">
          <Typography
            text={popupTitle}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_LARGE}
            textClasses="!font-bold"
          />
        </div>

        {/* Pricing Info Container */}
        <div className="flex items-center gap-2 mb-6">
          {/* Green Pricing Info */}
          <div className="h-[40px] bg-green-400 rounded-[10px] flex items-center justify-center px-4 gap-2">
            <Typography
              text={Locale.uaeAedPricingPopup.feeFormula}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses="!text-white"
            />
            {/* Tooltip */}
            <Tooltip
              tooltipText={
                <div>
                  <div>{Locale.uaeAedPricingPopup.tooltipBaseFee}</div>
                  <div>{Locale.uaeAedPricingPopup.tooltipRegionalFee}</div>
                </div>
              }
              tooltipTheme={"dark"}
              position={TOOLTIP_POSITION.TOP}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_1190_7097)">
                  <path
                    d="M8.00065 14.6668C11.6825 14.6668 14.6673 11.6821 14.6673 8.00016C14.6673 4.31826 11.6825 1.3335 8.00065 1.3335C4.31875 1.3335 1.33398 4.31826 1.33398 8.00016C1.33398 11.6821 4.31875 14.6668 8.00065 14.6668Z"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.06055 5.99989C6.21728 5.55434 6.52665 5.17863 6.93385 4.93931C7.34105 4.7 7.81981 4.61252 8.28533 4.69237C8.75085 4.77222 9.17309 5.01424 9.47727 5.37558C9.78144 5.73691 9.94792 6.19424 9.94721 6.66656C9.94721 7.99989 7.94721 8.66656 7.94721 8.66656"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M8 11.3335H8.00667" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_1190_7097">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Tooltip>
          </div>
        </div>
        {/* Horizontal Divider */}
        <div className="w-full h-px bg-gray-300 my-6"></div>
        {/* Pricing Tiers */}
        <div className="flex w-full mb-2 mt-2">
          <div className="flex-1 text-left">
            <div className="mb-2">
              <Typography
                text={`${Locale.uaeAedPricingPopup.tier1.title1} `}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="!text-black-500 whitespace-pre"
              />
              <Typography
                text={Locale.uaeAedPricingPopup.tier1.title2}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="!text-black-500"
              />
            </div>
            <Typography
              text={Locale.uaeAedPricingPopup.tier1.price}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses="!font-bold"
            />
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-gray-300 mx-4 self-stretch"></div>

          <div className="flex-1 text-left">
            <div className="mb-2">
              <Typography
                text={`${Locale.uaeAedPricingPopup.tier2.title1} `}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="!text-black-500 whitespace-pre"
              />
              <Typography
                text={Locale.uaeAedPricingPopup.tier2.title2}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="!text-black-500"
              />
            </div>
            <Typography
              text={Locale.uaeAedPricingPopup.tier2.price}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses="!font-bold"
            />
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-gray-300 mx-4 self-stretch"></div>

          <div className="flex-1 text-left">
            <div className="mb-2">
              <Typography
                text={`${Locale.uaeAedPricingPopup.tier3.title1} `}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="!text-black-500 whitespace-pre"
              />
              <Typography
                text={Locale.uaeAedPricingPopup.tier3.title2}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="!text-black-500"
              />
            </div>
            <Typography
              text={Locale.uaeAedPricingPopup.tier3.price}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses="!font-bold"
            />
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-px bg-gray-300 my-6"></div>

        {/* Disclaimer */}
        <Typography
          text={Locale.uaeAedPricingPopup.disclaimer}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses="!text-black-500 text-center w-full mb-4"
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 items-stretch w-full mb-6">
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.MEDIUM}
            isLoading={isLoading}
            title={Locale.uaeAedPricingPopup.iUnderstandButton}
            isDisabled={isLoading}
            onButtonClick={handlePricingAccept}
            buttonClass="!w-full justify-center"
            rightIcon={() => <RightArrowIcon width={20} height={20} stroke="white" />}
          />
          <Button
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.MEDIUM}
            title={Locale.uaeAedPricingPopup.goBackButton}
            isDisabled={isLoading}
            onButtonClick={handleGoBack}
            buttonClass="!w-full justify-center"
          />
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Bottom Sheet */}
      <div className="fixed inset-0 z-50 md:hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

        {/* Bottom Sheet */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl flex flex-col max-h-[90vh] overflow-y-auto">
          {/* Close Button - Positioned over the image */}
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-1 bg-white rounded-full shadow-sm">
              <CrossIcon width={20} height={20} stroke={theme?.hexColors?.black?.[700] || "#333"} />
            </button>
          </div>

          {/* Header with Account Card Icon - Full Width Background */}
          <div className="w-full mb-4 flex justify-center">
            <PricingPopUpAccountIcon
              width={574}
              height={150}
              className="w-full h-auto"
              accountLabel={accountLabel}
              showGlobeIcon={isRegionalVariant}
            />
          </div>

          {/* Content */}
          <div className="px-6 pb-6 flex flex-col">
            {/* Title */}
            <Typography
              text={popupTitle}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses="!font-bold text-center mb-4"
            />

            {/* Pricing Badge */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-400 rounded-full px-3 py-2 flex items-center gap-2 mr-2">
                <Typography
                  text={pricingPrefix}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-white"
                />
                <Typography
                  text={Locale.uaeAedPricingPopup.feeFormula}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-white"
                />
              </div>
              <Tooltip
                tooltipText={
                  <div>
                    <div>Skydo base fee is based on your transaction amount ($19, $29 or 0.3%)</div>
                    <div>
                      1% is the &apos;Regional Currency fee&apos; which is applicable on certain currencies due to
                      higher FX conversion costs
                    </div>
                  </div>
                }
                tooltipTheme={"dark"}
                position={TOOLTIP_POSITION.TOP}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8.00016 14.6666C11.6821 14.6666 14.6668 11.6818 14.6668 7.99992C14.6668 4.31802 11.6821 1.33325 8.00016 1.33325C4.31826 1.33325 1.3335 4.31802 1.3335 7.99992C1.3335 11.6818 4.31826 14.6666 8.00016 14.6666Z"
                    stroke="#8898AA"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.06006 5.99989C6.21679 5.55434 6.52616 5.17863 6.93336 4.93931C7.34056 4.7 7.81932 4.61252 8.28484 4.69237C8.75036 4.77222 9.1726 5.01424 9.47678 5.37558C9.78095 5.73691 9.94743 6.19424 9.94673 6.66656C9.94673 7.99989 7.94673 8.66656 7.94673 8.66656"
                    stroke="#8898AA"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M8 11.3333H8.00667" stroke="#8898AA" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Tooltip>
            </div>

            {/* Pricing Tiers - Stacked vertically for mobile */}
            <div className="flex flex-col gap-4 mb-4">
              {/* Tier 1 */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <Typography
                    text={Locale.uaeAedPricingPopup.tier1.title1}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="!text-black-500"
                  />
                  <Typography
                    text={Locale.uaeAedPricingPopup.tier1.title2}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="!text-black-500"
                  />
                </div>
                <Typography
                  text={Locale.uaeAedPricingPopup.tier1.price}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses="!font-bold"
                />
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* Tier 2 */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <Typography
                    text={Locale.uaeAedPricingPopup.tier2.title1}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="!text-black-500"
                  />
                  <Typography
                    text={Locale.uaeAedPricingPopup.tier2.title2}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="!text-black-500"
                  />
                </div>
                <Typography
                  text={Locale.uaeAedPricingPopup.tier2.price}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses="!font-bold"
                />
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* Tier 3 */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <Typography
                    text={Locale.uaeAedPricingPopup.tier3.title1}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="!text-black-500"
                  />
                  <Typography
                    text={Locale.uaeAedPricingPopup.tier3.title2}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="!text-black-500"
                  />
                </div>
                <Typography
                  text={Locale.uaeAedPricingPopup.tier3.price}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses="!font-bold"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-2 w-full">
              <Button
                type={BUTTON_TYPES.PRIMARY}
                size={BUTTON_SIZES.MEDIUM}
                title={Locale.uaeAedPricingPopup.iUnderstandButton}
                isLoading={isLoading}
                isDisabled={isLoading}
                onButtonClick={handlePricingAccept}
                buttonClass="!w-full justify-center"
              />
              <Button
                type={BUTTON_TYPES.SECONDARY}
                size={BUTTON_SIZES.MEDIUM}
                title={Locale.uaeOptInPopup.cancelButton}
                isDisabled={isLoading}
                onButtonClick={onClose}
                buttonClass="!w-full justify-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Popup */}
      <div className="hidden md:block">
        <Popup
          open={isOpen}
          renderContent={renderDesktopContent}
          outsideClick={() => {}}
          closeIconClick={onClose}
          containerClass="!w-[574px] !max-w-[90vw] !p-0 !bg-transparent"
          customContainerWidth={true}
        />
      </div>
    </>
  );
};

export default UaeAedPricingPopup;
