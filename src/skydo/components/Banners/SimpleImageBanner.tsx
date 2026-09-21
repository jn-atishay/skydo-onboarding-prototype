import React, { FC } from "react";
import Image from "next/image";
import { useBannerConfig } from "../../hooks/useBannerConfig";
import { BUTTON_SIZES, BUTTON_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import CrossIconFX from "../Icons/CrossIconFX";
import RightArrowIcon from "../Icons/RightArrowIcon";

const BG_OVERRIDE = "!bg-transparent !p-0 !h-auto !min-h-0 !overflow-hidden";

const BANNER_QUERY_CONTAINER: React.CSSProperties = {
  containerType: "inline-size",
} as React.CSSProperties;

const CTA_SCALE: React.CSSProperties = {
  fontSize: "1.46cqw",
};

interface Props {
  imageSrc: string;
  ctaText: string;
  onCtaClick: () => void;
  onSkip: () => void;
  isSkipLoading?: boolean;
}

/**
 * Image-with-CTA banner used by the insta-link and zoho-sync homepage
 * slots. The image is full-bleed; only the primary CTA and the top-right
 * close icon are interactive. Layout matches the referral homepage banner
 * (aspect-[9/5] mobile, aspect-[4/1] desktop, cqw-driven CTA sizing).
 */
const SimpleImageBanner: FC<Props> = ({ imageSrc, ctaText, onCtaClick, onSkip, isSkipLoading }) => {
  useBannerConfig({ backgroundConfig: { className: BG_OVERRIDE } });

  return (
    <div
      className="relative w-full overflow-hidden rounded-10px aspect-[9/5] md:aspect-[4/1]"
      style={BANNER_QUERY_CONTAINER}
    >
      <div className="absolute inset-0">
        <Image src={imageSrc} alt="" layout="fill" objectFit="cover" priority unoptimized />
      </div>

      <Button
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.X_SMALL}
        nativeType="button"
        isDisabled={isSkipLoading}
        onButtonClick={onSkip}
        buttonClass="!absolute top-3 right-3 z-10 !h-8 !w-8 !p-0 !bg-transparent hover:!bg-transparent focus:!bg-transparent"
        buttonProps={{ "aria-label": Locale.skip }}
        title={() => <CrossIconFX fill="#F0F3F7" />}
      />

      <div className="absolute z-10 left-4 bottom-10 md:hidden">
        <Button
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          nativeType="button"
          onButtonClick={onCtaClick}
          buttonClass="shadow-sm"
          title={ctaText}
          rightIcon={() => <RightArrowIcon stroke="#FFFFFF" width={14} height={14} />}
        />
      </div>

      <div className="absolute z-10 hidden md:flex left-[3%] bottom-[18%]" style={CTA_SCALE}>
        <Button
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          nativeType="button"
          onButtonClick={onCtaClick}
          buttonClass="!rounded-[0.55em] !h-auto !px-[1.5em] !py-[0.875em] shadow-sm"
          title={ctaText}
          textClasses="text-[1em] whitespace-nowrap"
          textProps={{ fontSize: "1em", lineHeight: "1.25" }}
          rightIcon={() => <RightArrowIcon stroke="#FFFFFF" width={20} height={20} className="h-[1.25em] w-[1.25em]" />}
        />
      </div>
    </div>
  );
};

export default SimpleImageBanner;
