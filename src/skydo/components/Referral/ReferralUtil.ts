import { ReferralRelationType, ReferralTransactionType, RewardLedger, RewardCategory } from "../../types/Referral";

export const getRewardCategoryDisplayLabel = (rewardCategory?: RewardCategory | null): string => {
  switch (rewardCategory) {
    case "PROMOTIONAL_REWARD":
      return "Promotional reward";
    case "TOKEN_OF_GOODWILL":
      return "Token of goodwill";
    case "REFERRAL_REWARD":
      return "Referral reward";
    default:
      return "Referral reward";
  }
};

export const formatRewardActivitySummary = (activity: RewardLedger): string => {
  if (activity.rewardPayment?.id) {
    return `Reward used for payment ID ${activity.rewardPayment.id}`;
  }
  if (activity.rewardExporter) {
    return `Referral reward - ${activity.rewardExporter.businessLegalName}`;
  }
  return getRewardCategoryDisplayLabel(activity.rewardCategory);
};

export const calculateUnclaimedRewards = (rewardLedger?: RewardLedger[]): number => {
  if (!rewardLedger) return 0;
  let unclaimedRewards = 0;
  rewardLedger.forEach((ledger) => {
    if (
      ledger.transactionType == ReferralTransactionType.EARN &&
      ledger.redeemed === false &&
      ledger.relationType !== ReferralRelationType.ACTIVATION_REWARD
    ) {
      unclaimedRewards++;
    }
  });
  return unclaimedRewards;
};

export const getReferralType = (campaignKey?: string | null) => {
  switch (campaignKey) {
    case "alexa_campaign":
      return "Alexa15Days";
    case "group_a_mokobara":
      return "GroupAMokobara";
    default:
      return "Default";
  }
};

export const isAllowedReferralRedemptionUrl = (value?: string | null): value is string => {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};
