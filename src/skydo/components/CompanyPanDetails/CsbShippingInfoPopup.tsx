import React from "react";
import classNames from "classnames";
import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import ShipIcon from "../Icons/ShipIcon";
import PackageIcon from "../Icons/PackageIcon";

type Props = {
  open: boolean;
  onClose: () => void;
};

const BulletList = ({ items, className = "" }: { items: string[]; className?: string }) => (
  <ul
    className={`w-full list-disc list-outside space-y-2 pl-5 text-left font-normal text-sm leading-relaxed text-[#757575] marker:text-[#0A2540] [&_li]:break-words ${className}`}
  >
    {items.map((text) => (
      <li key={text}>{text}</li>
    ))}
  </ul>
);

/**
 * CSB-IV vs CSB-V guidance modal (onboarding + reusable elsewhere).
 * Matches product layout: header, two bordered cards, footer with sales contact.
 */
const CsbShippingInfoPopup = ({ open, onClose }: Props) => {
  const footerText = Locale.csbShippingInfoFooter
    .replace(":contact", Locale.salesPhone)
    .replace(":email", Locale.salesMail);

  const titleEl = (
    <div className="min-w-0 flex-1 pr-2 sm:pr-3">
      <Typography
        text={Locale.csbIvVsCsbVPopupTitle}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses="!font-semibold !text-[#0A2540] !leading-snug !text-left break-words"
      />
    </div>
  );

  return (
    <Popup
      open={open}
      isCommonHeader
      title={titleEl}
      closeIconClick={onClose}
      outsideClick={() => onClose()}
      headerClass="items-start gap-2 sm:gap-3"
      customContainerWidth
      containerClass={classNames(
        "!w-[calc(100%-1rem)] sm:!w-[calc(100%-2rem)] !max-w-[520px] !p-0 !pt-4 !px-4 !pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:!pt-6 sm:!px-6 sm:!pb-8",
        "overflow-hidden flex flex-col min-h-0 max-h-[min(92dvh,100vh)] sm:max-h-[90vh]",
        "shadow-xl rounded-xl sm:rounded-2xl"
      )}
      headerContainerClass="!mb-0"
      bgWrapperClass="z-[100002] px-2 py-3 sm:px-4 sm:py-6"
      renderContent={() => (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
          <div className="bg-white py-4 sm:py-6">
            <div className="flex flex-row items-start gap-3 sm:gap-4">
              <div className="shrink-0 w-8 flex justify-center pt-1">
                <ShipIcon isSelected={false} />
              </div>
              <div className="min-w-0 flex-1">
                <Typography
                  text={Locale.csbIvSectionTitle}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight={700}
                  textClasses="!block !text-[#0A2540] !leading-snug"
                />
                <Typography
                  text={Locale.csbIvSectionSubtitle}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight={700}
                  textClasses="!block !text-[#0A2540]  !leading-snug mt-1"
                />
              </div>
            </div>
            {/* Full-width row directly under icon + title row; inset matches title column (w-8 + gap-4) */}
            <div className="mt-2">
              <BulletList items={Locale.csbIvBullets} />
            </div>
          </div>

          <div className="h-px shrink-0 bg-gray-200" />

          <div className="bg-white py-4 sm:py-6">
            <div className="flex flex-row items-start gap-3 sm:gap-4">
              <div className="shrink-0 w-8 flex justify-center pt-1">
                <PackageIcon isSelected={false} />
              </div>
              <div className="min-w-0 flex-1">
                <Typography
                  text={Locale.csbVSectionTitle}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight={700}
                  textClasses="!block !text-[#0A2540] !leading-snug"
                />
                <Typography
                  text={Locale.csbVSectionSubtitle}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight={700}
                  textClasses="!block !text-[#0A2540]  !leading-snug mt-1"
                />
              </div>
            </div>
            <div className="mt-2 ">
              <BulletList items={Locale.csbVBullets} />
            </div>
          </div>
          <div className="mb-4 h-px shrink-0 bg-gray-200 sm:mb-6" />

          <Typography
            text={footerText}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={400}
            textClasses="!block !w-full !text-center !font-lato !text-[13px] sm:!text-[14px] !leading-[18px] sm:!leading-[20px] !tracking-normal !text-[#757575] !pt-1 !px-0.5 break-words"
          />
        </div>
      )}
    />
  );
};

export default CsbShippingInfoPopup;
