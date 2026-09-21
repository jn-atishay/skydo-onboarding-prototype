import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useBannerConfig } from "../../../hooks/useBannerConfig";
import useReferralStore from "../../../store/useReferralStore";
import useToastMessages from "../../../store/toastMessages";
import useAnalytics from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../../constants/atomicConstants";
import FE_ROUTES from "../../../util/feRoutes";
import Locale from "../../../util/locale/en";
import Button from "../../AtomicComponents/Button";
import Typography from "../../AtomicComponents/Typography";
import CrossIconFX from "../../Icons/CrossIconFX";
import RightArrowIcon from "../../Icons/RightArrowIcon";
import useActiveCampaign from "../useActiveCampaign";
import { AssetSrc } from "../types";

const BG_OVERRIDE = "!bg-transparent !p-0 !h-auto !min-h-0 !overflow-hidden";

// Banner is a CSS query container so the desktop CTA's font-size and
// position scale as a fixed fraction of the banner across all widths.
const BANNER_QUERY_CONTAINER: React.CSSProperties = {
  containerType: "inline-size",
} as React.CSSProperties;
const DESKTOP_CTA_SCALE: React.CSSProperties = {
  fontSize: "1.46cqw",
};

const PlaceholderImage = ({ label }: { label: string }) => (
  <div className="flex h-full w-full items-center justify-center bg-blue-100">
    <Typography
      text={label}
      type={TYPOGRAPHY_TYPES.LABEL}
      size={TYPOGRAPHY_SIZES.SMALL}
      textClasses="!text-navyblue-500"
    />
  </div>
);

const BackgroundImage = ({ src, label }: { src: AssetSrc; label: string }) => {
  if (!src) return <PlaceholderImage label={label} />;
  return (
    <Image
      src={src}
      alt=""
      layout="fill"
      objectFit="cover"
      sizes="100vw"
      priority
    />
  );
};

const HomepageBanner = () => {
  const router = useRouter();
  const campaign = useActiveCampaign();
  const userReferralData = useReferralStore((s) => s.userReferralData);
  const skipReferralBanner = useReferralStore((s) => s.skipReferralBanner);
  const isSkipLoading = useReferralStore((s) => s.isSkipLoading);
  const { addToast } = useToastMessages();
  const analytics = useAnalytics();

  useBannerConfig({
    backgroundConfig: campaign ? { className: BG_OVERRIDE } : null,
  });

  useEffect(() => {
    if (!campaign) return;
    analytics.trackAsync(Events.REFERRAL_BANNER_SHOWN, {
      activeCampaign: campaign.campaignKey,
      type: campaign.campaignKey,
    });
  }, [campaign?.campaignKey]);

  if (!campaign) return null;

  const referralUrl = userReferralData?.referralUrl || "";
  const homepageSrc = campaign.assets.homepage;

  const onSkip = () => {
    analytics.trackAsync(Events.REFERRAL_BANNER_SKIP, { type: campaign.campaignKey });
    void skipReferralBanner();
  };

  const onCopy = () => {
    analytics.trackAsync(Events.REFERRAL_COPY_LINK_CLICK, {
      source: "home_page_banner",
      type: campaign.campaignKey,
    });
    navigator?.clipboard
      ?.writeText(referralUrl)
      .then(() =>
        addToast({
          type: TOAST_TYPES.SUCCESS,
          id: "success_copied",
          body: Locale.copied,
          time: 2000,
        })
      )
      .catch(() => {});
  };

  const onReferNow = () => {
    analytics.trackAsync(Events.REFERRAL_BANNER_KNOW_MORE, { type: campaign.campaignKey });
    void router.push(FE_ROUTES.REFERRAL);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-10px aspect-[9/5] md:aspect-[4/1]"
      style={BANNER_QUERY_CONTAINER}
    >
      <div className="absolute inset-0">
        <BackgroundImage src={homepageSrc} label="homepage_banner.webp" />
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

      {/* bottom-10 clears the carousel dots (rendered at bottom-4 of the
          parent carousel container). */}
      <div className="absolute z-10 left-4 right-4 bottom-10 flex flex-col gap-2 md:hidden">
        <Button
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          nativeType="button"
          onButtonClick={onCopy}
          buttonClass="w-full shadow-sm"
          textWrapperClass="!flex-row !w-full !gap-2 !justify-between min-w-0"
          title={() => (
            <>
              <Typography
                text={referralUrl}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="!text-black-700 flex-1 min-w-0 truncate leading-tight text-left"
              />
              <Typography
                text={Locale.copyLinkText}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="!text-blue-400 shrink-0 leading-tight text-right"
              />
            </>
          )}
        />
        <Button
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          nativeType="button"
          onButtonClick={onReferNow}
          buttonClass="shadow-sm"
          title={Locale.referNow}
          textClasses="leading-tight"
          rightIcon={() => <RightArrowIcon stroke="#FFFFFF" width={14} height={14} />}
        />
      </div>

      {/* Anchored at the Figma bottom-left offset (40/1096 wide, 64/274 tall). */}
      <div
        className="absolute z-10 hidden md:flex left-[3.65%] bottom-[23.36%] w-[44%]"
        style={DESKTOP_CTA_SCALE}
      >
        <div className="flex w-full items-stretch gap-[0.5em]">
          <Button
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            nativeType="button"
            onButtonClick={onCopy}
            buttonClass="flex-1 min-w-0 !rounded-[0.55em] !h-auto !px-[1em] !py-[0.875em] shadow-sm"
            textWrapperClass="!flex-row !w-full !gap-[0.5em] !justify-between min-w-0"
            title={() => (
              <>
                <Typography
                  text={referralUrl}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-black-700 flex-1 min-w-0 truncate text-[1em] leading-tight text-left"
                  textProps={{ fontSize: "1em", lineHeight: "1.25" }}
                />
                <Typography
                  text={Locale.copyLinkText}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-blue-400 shrink-0 text-[1em] leading-tight text-right"
                  textProps={{ fontSize: "1em", lineHeight: "1.25" }}
                />
              </>
            )}
          />
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            nativeType="button"
            onButtonClick={onReferNow}
            buttonClass="shrink-0 !rounded-[0.55em] !h-auto !px-[1.5em] !py-[0.875em] shadow-sm"
            title={Locale.referNow}
            textClasses="text-[1em] leading-tight whitespace-nowrap"
            textProps={{ fontSize: "1em", lineHeight: "1.25" }}
            rightIcon={() => <RightArrowIcon stroke="#FFFFFF" width={20} height={20} className="h-[1.25em] w-[1.25em]" />}
          />
        </div>
      </div>
    </div>
  );
};

export default HomepageBanner;
