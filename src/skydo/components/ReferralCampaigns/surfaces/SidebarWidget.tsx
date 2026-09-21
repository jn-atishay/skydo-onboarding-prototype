import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/router";
import AppContext from "../../../context/AppContext";
import useReferralStore from "../../../store/useReferralStore";
import useUserData from "../../../store/useUserData";
import useAnalytics from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";
import { isUserKYCed } from "../../../util/functions";
import FE_ROUTES from "../../../util/feRoutes";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOOLTIP_POSITION,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../../constants/atomicConstants";
import Locale from "../../../util/locale/en";
import Button from "../../AtomicComponents/Button";
import Typography from "../../AtomicComponents/Typography";
import Tooltip from "../../AtomicComponents/Tooltip";
import LongRightArrow from "../../Icons/LongRightArrow";
import LottiePlayer from "../../Common/LottiePlayer";
import useActiveCampaign, { campaignDaysLeft, formatCampaignEndDate } from "../useActiveCampaign";
import type { Campaign, MilestoneReward } from "../types";
import CampaignLottiePlayer from "../CampaignLottiePlayer";

interface Props {
  isCollapsed: boolean;
}

const TRANSITION_MS = 300;

// Shared across all campaigns — only the three colors vary per campaign.
// Average of the original per-campaign Figma angles.
const SIDEBAR_GRADIENT_ANGLE = 67;
const sidebarGradientStyle = (campaign: Campaign): React.CSSProperties | undefined => {
  const gradient = campaign.sidebarGradient;
  if (!gradient) return undefined;
  return {
    backgroundImage: `linear-gradient(${SIDEBAR_GRADIENT_ANGLE}deg, ${gradient[0]} 0%, ${gradient[1]} 50%, ${gradient[2]} 100%)`,
  };
};

const EXPANDED_CARD_CLASS = "w-51 overflow-hidden rounded-10px";

const ExpandedCardIcon = ({ campaign }: { campaign: Campaign }) => {
  const { logo, animation } = campaign.assets;
  return (
    <div
      className={classNames(
        "relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-10px border border-white",
        campaign.sidebarGradientClass
      )}
      style={sidebarGradientStyle(campaign)}
    >
      {logo ? (
        <Image src={logo} alt="" layout="fill" objectFit="cover" sizes="56px" />
      ) : (
        <div className="overflow-hidden rounded-10px">
          <LottiePlayer src={animation} width={56} height={56} />
        </div>
      )}
    </div>
  );
};

const CollapsedView = ({
  achievedReferralCount,
  campaign,
  isActive,
}: {
  achievedReferralCount: number;
  campaign: Campaign;
  isActive: boolean;
}) => {
  const copy = campaign.copy.sidebar;
  return (
    <Tooltip
      tooltipText={
        <Typography
          text={copy.collapsedTooltipWhite}
          size={TYPOGRAPHY_SIZES.SMALL}
          type={TYPOGRAPHY_TYPES.LABEL}
          fontWeight="bold"
          textClasses="!text-white"
        >
          <Typography
            text={copy.collapsedTooltipGreen}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.LABEL}
            fontWeight="bold"
            textClasses="!text-green-300"
          />
        </Typography>
      }
      position={TOOLTIP_POSITION.RIGHT}
      tooltipTheme="dark"
      className="cursor-pointer"
    >
      <div className="h-14 w-14 overflow-hidden rounded-10px">
        <CampaignLottiePlayer
          campaign={campaign}
          achievedReferralCount={achievedReferralCount}
          width={56}
          height={56}
          isActive={isActive}
        />
      </div>
    </Tooltip>
  );
};

const ExpandedCard = ({ campaign, onClick }: { campaign: Campaign; onClick: () => void }) => {
  const copy = campaign.copy.sidebar;
  const { theme } = useContext(AppContext);
  const isLightText = campaign.sidebarTextTheme === "light";
  const headingClass = isLightText ? "!text-neutral-100" : "!text-black-700";
  const footerClass = isLightText ? "!text-neutral-100" : "!text-black-600";
  const countdownClass = isLightText ? "!text-neutral-100" : "!text-black-700";
  const dividerClass = isLightText ? "border-neutral-100" : "border-black-600";
  return (
    <div className="relative overflow-visible">
      <div className="absolute -mt-7 left-3.5 z-1">
        <ExpandedCardIcon campaign={campaign} />
      </div>
      <div
        className={classNames(
          EXPANDED_CARD_CLASS,
          "flex flex-col gap-2 px-4 pb-4 pt-10",
          campaign.sidebarGradientClass
        )}
        style={sidebarGradientStyle(campaign)}
      >
        <Typography
          text={copy.expandedHeading}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={headingClass}
          fontWeight="700"
        />
        <div className={classNames("border-t border-dashed my-1", dividerClass)} />
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col">
            {copy.expandedFooter && (
              <Typography
                text={copy.expandedFooter}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={footerClass}
              />
            )}
            {campaign.isTimeLimited && (
              <Typography
                text={Locale.referralOfferDaysLeftBold.replace(":days", String(campaignDaysLeft(campaign)))}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={countdownClass}
                fontWeight="700"
              />
            )}
          </div>
          <Button
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            nativeType="button"
            onButtonClick={onClick}
            buttonProps={{ "aria-label": Locale.referNow }}
            title={() => <LongRightArrow width={16} height={16} stroke={theme.hexColors.black[700]} />}
          />
        </div>
      </div>
    </div>
  );
};

const MilestoneExpandedCard = ({ campaign, onClick }: { campaign: Campaign; onClick: () => void }) => {
  const progress = useReferralStore((state) => state.activeCampaign.milestoneProgress);
  const rewards = campaign.milestoneProgram?.rewards || [];
  const finalTarget = rewards[rewards.length - 1]?.referralTarget || 0;
  const [hoveredReward, setHoveredReward] = useState<MilestoneReward | null>(null);

  if (!progress || !finalTarget) return <ExpandedCard campaign={campaign} onClick={onClick} />;

  const isComplete = progress.achievedReferralCount >= finalTarget;

  return (
    <div
      className={classNames(EXPANDED_CARD_CLASS, "p-4", campaign.sidebarGradientClass)}
      style={sidebarGradientStyle(campaign)}
    >
      <Typography
        text={campaign.copy.sidebar.expandedHeading}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses="!text-white"
        fontWeight="700"
      />
      <div className="mt-3 flex items-center justify-between gap-2">
        {rewards.map((reward) => (
          <div
            key={reward.referralTarget}
            className="group relative h-9 w-9 shrink-0"
            onMouseEnter={() => setHoveredReward(reward)}
            onMouseLeave={() => setHoveredReward(null)}
          >
            <Button
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.X_SMALL}
              nativeType="button"
              onButtonClick={onClick}
              buttonClass="!h-9 !w-9 cursor-pointer !overflow-visible !bg-transparent !p-0 hover:!bg-transparent focus:!bg-transparent"
              buttonProps={{ "aria-label": reward.name }}
              title={() => (
                <div className="relative h-9 w-9 overflow-hidden rounded-10px border border-white bg-white transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-125">
                  <Image src={reward.sidebarImage} alt="" layout="fill" objectFit="cover" sizes="36px" />
                </div>
              )}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex h-10 items-center justify-center">
        {hoveredReward ? (
          <div className="flex flex-col items-center">
            <Typography
              text={hoveredReward.name}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses="whitespace-nowrap !text-white"
              fontWeight="700"
            />
            <Typography
              text={(hoveredReward.referralTarget === 1 ? Locale.onReferral : Locale.onReferrals).replace(
                ":count",
                String(hoveredReward.referralTarget)
              )}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses="!text-white"
            />
          </div>
        ) : campaign.endDate ? (
          <Typography
            text={Locale.referralOfferValidTill.replace(":date", formatCampaignEndDate(campaign.endDate))}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses="!text-white"
          />
        ) : null}
      </div>
      <Button
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        nativeType="button"
        onButtonClick={onClick}
        buttonClass="!mt-1 !w-full justify-center border-0"
        textClasses="!text-navyblue-500"
        title={isComplete ? Locale.sendShippingDetails : Locale.referNow}
        rightIcon={isComplete ? undefined : () => <LongRightArrow width={16} height={16} stroke="#283C8B" />}
      />
    </div>
  );
};

const SidebarWidget = ({ isCollapsed }: Props) => {
  const router = useRouter();
  const campaign = useActiveCampaign();
  const achievedReferralCount = useReferralStore(
    (state) => state.activeCampaign.milestoneProgress?.achievedReferralCount || 0
  );
  const { userState, isTransacting } = useUserData();
  const userReferralData = useReferralStore((s) => s.userReferralData);
  const analytics = useAnalytics();
  const [showWidget, setShowWidget] = useState(false);
  const [renderExpanded, setRenderExpanded] = useState(!isCollapsed);
  const hasTrackedLoad = useRef(false);

  useEffect(() => {
    if (isUserKYCed(userState)) {
      setShowWidget(true);
      if (!hasTrackedLoad.current) {
        hasTrackedLoad.current = true;
        analytics.trackAsync(Events.REFERRAL_WIDGET_LOADED, { type: campaign?.campaignKey });
      }
    }
  }, [analytics, userState, campaign?.campaignKey]);

  useEffect(() => {
    if (isCollapsed) {
      setRenderExpanded(false);
      return;
    }
    const expandedTimer = setTimeout(() => setRenderExpanded(true), TRANSITION_MS / 2);
    return () => clearTimeout(expandedTimer);
  }, [isCollapsed]);

  if (!showWidget || !campaign) return null;

  const onClick = () => {
    void router.push(FE_ROUTES.REFERRAL);
    analytics.trackAsync(Events.REFERRAL_WIDGET_INVITE_FRIENDS_CLICK, {
      isTransacting,
      hasRewards: !!userReferralData?.rewardLedger?.length,
      isCollapsed,
      type: campaign.campaignKey,
    });
  };

  return (
    <div
      className={classNames("relative overflow-visible rounded-10px transition-all ease-linear", {
        "!h-14 flex items-center justify-center": isCollapsed,
      })}
      style={{ transitionDuration: `${TRANSITION_MS}ms` }}
      onClick={() => {
        if (isCollapsed) onClick();
      }}
    >
      {renderExpanded ? (
        campaign.milestoneProgram ? (
          <MilestoneExpandedCard campaign={campaign} onClick={onClick} />
        ) : (
          <ExpandedCard campaign={campaign} onClick={onClick} />
        )
      ) : null}
      <div
        className={classNames({
          "pointer-events-none invisible absolute inset-0": renderExpanded,
        })}
      >
        <CollapsedView campaign={campaign} achievedReferralCount={achievedReferralCount} isActive={isCollapsed} />
      </div>
    </div>
  );
};

export default SidebarWidget;
