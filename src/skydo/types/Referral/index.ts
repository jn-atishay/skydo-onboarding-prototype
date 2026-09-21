import { Payment } from "../index";
import { Exporter } from "../Exporter/ExporterUser";

export type RewardCatalogue = {
  rewardType?: string | null;
  // The BE expresses "this campaign rewards the referee with nothing" as 0, null, or
  // an absent field. All three are legitimate; getRefereeRewardValue flattens them.
  rewardValue?: number | null;
  referrerRewardValue?: number | null;
};

export type ReferralCampaignInfo = {
  name?: string;
  campaignType?: CampaignType;
  rewardCatalogue?: RewardCatalogue;
};

type ReferralParty = {
  id?: number;
  fullName?: string;
  registeredName?: string;
};

export type RefereeRelation = {
  id?: number;
  referrerExporter?: { id?: number };
  referrerExporterUser?: ReferralParty;
  affiliatePartner?: { id?: number; partnerName?: string };
  campaign?: ReferralCampaignInfo;
};

export type UserReferralDataByCode = {
  id?: number;
  affiliatePartner?: { id?: number; partnerName?: string };
  exporterUser?: ReferralParty;
  campaign?: ReferralCampaignInfo;
};

export type ReferrerData = {
  referrerId: number;
  exporterName: string;
  campaignName?: string;
  // Authoritative referee reward from the BE campaign catalogue. 0, null and an
  // absent field all mean this campaign rewards the referee with nothing, and every
  // referee-facing reward claim must then be suppressed rather than defaulted.
  refereeRewardValue?: number | null;
};

export type UserReferralData = {
  referralCode: string;
  exporterId: number;
  referralUrl: string;
  exporter: Partial<Exporter>;
  exporterUser: ReferralExporterUser;
  referrerRelation?: ReferrerRelation[];
  rewardData?: RewardData;
  giftsLedger?: GiftLedgerEntry[];
  rewardLedger?: RewardLedger[];
  referralMetrics?: {
    uniqueReferrersCount?: number;
    totalRewardValueInCrores?: number;
    totalGiftsAchieved?: number;
    daysLeft?: number;
  };
};

export type ReferralExporterUser = {
  fullName?: string;
  registeredName?: string;
  emailAddress?: string;
};

export type ReferrerRelation = {
  id: number;
  refereeExporterId: number;
  referralState: string;
  refereeExporterUser: RefereeExporterUser;
  referralCampaign?: ReferralCampaign;
  alexaReferralCampaign?: AlexaReferralCampaign;
  milestoneTrackingLatest?: MilestoneTracking | null;
};

export type ReferralCampaign = {
  id: number;
  name: string;
};

export type AlexaReferralCampaign = {
  id?: number;
  exporterId: number;
  expiry: string;
  status: string;
  bannerSkip?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type RefereeExporterUser = {
  fullName?: string;
  registeredName?: string;
  emailAddress: string;
};

export type MilestoneTracking = {
  actionTimestamp: string;
  referralState: string;
};

export type RewardData = {
  rewardValue: number;
};

export type GiftLedgerEntry = {
  campaignName: string;
  claimedMilestoneThreshold: number;
  label: string;
  claimedAt: string;
};

export type RewardCategory = "REFERRAL_REWARD" | "PROMOTIONAL_REWARD" | "TOKEN_OF_GOODWILL";

export type RewardLedger = {
  relationType: ReferralRelationType;
  transactionType: ReferralTransactionType;
  rewardValue: number;
  rewardPayment?: Pick<Payment, "id">;
  rewardExporter?: Pick<Exporter, "businessLegalName" | "correspondentName"> & { id: number };
  rewardCategory?: RewardCategory | null;
  redeemed?: boolean;
  itemValue?: number;
  createdAt: string;
};

export enum CampaignType {
  AFFILIATE = "AFFILIATE",
  REFERRAL = "REFERRAL",
}

export enum ReferralRelationType {
  REFEREE = "REFEREE",
  REFERRER = "REFERRER",
  ACTIVATION_REWARD = "ACTIVATION_REWARD",
}

export enum ReferralTransactionType {
  EARN = "EARN",
  REDEEM = "REDEEM",
}

export enum ReferralState {
  SIGNUP_COMPLETE = "SIGNUP_COMPLETE",
  ONBOARDING_COMPLETE = "ONBOARDING_COMPLETE",
  ACHIEVED = "ACHIEVED",
}

enum RewardStatus {
  REDEEMED = "REDEEMED",
  EXPIRED = "EXPIRED",
  REWARDED = "REWARDED",
  ELIGIBLE = "ELIGIBLE",
  NOT_ELIGIBLE = "NOT_ELIGIBLE",
}

export type ExporterRewardStatus = {
  id: string;
  campaignId: string;
  exporterId: number;
  expiresAt: string;
  status: RewardStatus;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  rewardReason?: string;
};

export type ActiveCampaign = {
  name: string;
  milestoneProgress?: Pick<MilestoneProgress, "achievedReferralCount"> | null;
};

export type ReferralMilestone = {
  threshold: number;
  label: string;
  isReached: boolean;
};

export type MilestoneProgress = {
  achievedReferralCount: number;
  isClaimable: boolean;
  currentMilestoneThreshold: number | null;
  nextMilestoneThreshold: number | null;
  referralsToNextMilestone: number | null;
  claimedMilestoneThreshold: number | null;
  redemptionLink: string | null;
  giftForfeited?: boolean;
  milestones: ReferralMilestone[];
};

export type ClaimedMilestoneProgress = MilestoneProgress & {
  campaignName: string;
};

export type ClaimReferralRewardResult = {
  success: boolean;
  data?: ClaimedMilestoneProgress;
  message?: string;
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: { message?: string }[];
};

export type MilestoneProgressRequestStatus = "loading" | "success" | "error";

export type ReferralMetrics = {
  totalReferrers?: number;
  totalRewardValueInCrores?: number;
  totalGiftsAchieved?: number;
};
