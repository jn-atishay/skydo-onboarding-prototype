import Locale from "./locale/en";
import type { ReferrerData } from "../types/Referral";

export const replaceNumberAndPluralize = (text: string, rewardValue: number): string => {
  return text.replace("${rewardValue}", rewardValue.toString());
};

export const referralBannerHeading = (referrerRewardValue: number, showCompanyAlexaGift?: boolean) => {
  if (showCompanyAlexaGift) {
    return Locale.referAndWinAnAssured;
  } else {
    if (referrerRewardValue > 0) {
      return replaceNumberAndPluralize(Locale.referFriends, referrerRewardValue);
    } else {
      return Locale.earnRewards;
    }
  }
};

/**
 * The referee reward is authoritative from the BE campaign catalogue, which expresses
 * "this campaign rewards the referee with nothing" as 0, null, or an absent field —
 * all three are legitimate, and this is the one place that flattens them to undefined.
 * The claim is then suppressed, never defaulted to a campaign-table value, which is
 * what silently promised $30 on campaigns that pay the referee nothing.
 */
export const getRefereeRewardValue = (referrerData?: ReferrerData): number | undefined => {
  const rewardValue = referrerData?.refereeRewardValue;
  if (!rewardValue || rewardValue <= 0) {
    return undefined;
  }
  return rewardValue;
};

/**
 * Resolves the login panel headline for all three states in one place so the desktop
 * and mobile panels can't drift. An absent `highlight` means the caller renders its
 * loading skeleton. While unfetched the reward subheading is kept so the line holds
 * its loading width.
 */
export const referralHeadlineCopy = (
  hasFetched: boolean,
  rewardValue?: number
): { highlight?: string; subheading: string } => {
  if (!hasFetched) {
    return { subheading: Locale.referralDiscountSubheading };
  }
  if (rewardValue === undefined) {
    return {
      highlight: Locale.referralNoRewardHighlight,
      subheading: Locale.referralNoRewardSubheading,
    };
  }
  return {
    highlight: Locale.referralDiscountAmount.replace("${rewardValue}", String(rewardValue)),
    subheading: Locale.referralDiscountSubheading,
  };
};
