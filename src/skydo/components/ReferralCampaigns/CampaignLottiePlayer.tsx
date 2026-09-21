import React, { useEffect, useState } from "react";
import LottiePlayer from "../Common/LottiePlayer";
import type { Campaign } from "./types";

interface Props {
  achievedReferralCount?: number;
  campaign: Campaign;
  height: number;
  isActive?: boolean;
  width: number;
}

const CampaignLottiePlayer = ({ achievedReferralCount = 0, campaign, height, isActive = true, width }: Props) => {
  const milestoneRewards = campaign.milestoneProgram?.rewards || [];
  const upcomingAnimations = milestoneRewards
    .filter((reward) => reward.referralTarget > achievedReferralCount)
    .map((reward) => reward.animation);
  const finalMilestoneAnimation = milestoneRewards[milestoneRewards.length - 1]?.animation;
  const milestoneAnimations = upcomingAnimations.length
    ? upcomingAnimations
    : finalMilestoneAnimation
    ? [finalMilestoneAnimation]
    : undefined;
  const animations = milestoneAnimations?.length ? milestoneAnimations : [campaign.assets.animation];
  const [animationIndex, setAnimationIndex] = useState(0);
  const cyclesAnimations = animations.length > 1;
  const activeAnimation = animations[animationIndex % animations.length];

  useEffect(() => {
    setAnimationIndex(0);
  }, [achievedReferralCount, campaign.campaignKey]);

  return (
    <LottiePlayer
      key={activeAnimation}
      src={activeAnimation}
      width={width}
      height={height}
      animation={isActive}
      loop={!cyclesAnimations}
      onComplete={
        cyclesAnimations ? () => setAnimationIndex((currentIndex) => (currentIndex + 1) % animations.length) : undefined
      }
    />
  );
};

export default CampaignLottiePlayer;
