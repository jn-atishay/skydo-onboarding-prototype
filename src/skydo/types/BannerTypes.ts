import { FeatureTagType } from "../components/DashboardContainer/FeatureWidget";

export type BANNERS =
  | "ZOHO"
  | "REFERRAL"
  | "TEST_TRANSACTION"
  | "ONBOARDING"
  | "ACTIVATION_EXPERIMENT"
  | "ACTIVATION_EXP"
  | "INSTA_LINK"
  | "NEW_IMPORTER_OFFER"
  | "REGIONAL_CURRENCY";

// Only what the banner renders. Cap and eligibility stay on the backend.
export type NewImporterOfferData = {
  // Calendar date only (YYYY-MM-DD); the UI just displays it. isExpiringSoon
  // is decided by the backend, not here.
  expiryDate: string;
  isExpiringSoon: boolean;
  isNearCap: boolean;
  // New clients added so far. Analytics `new_clients_added` only, never
  // rendered. Optional — backend sends it only while the offer is active.
  redeemCount?: number;
};

export type BannerData = {
  ACTIVATION_EXP: ExporterRewardEligibility;
  NEW_IMPORTER_OFFER?: NewImporterOfferData;
};

export enum RewardStatus {
  EXPIRED = "EXPIRED",
  REWARDED = "REWARDED",
  ELIGIBLE = "ELIGIBLE",
  NOT_ELIGIBLE = "NOT_ELIGIBLE",
}

export type ExporterRewardEligibility = {
  expiryDate: string;
  rewardStatus: RewardStatus;
};

export type FeatureWidgetIdentifierType = "ACTIVATION_EXP";

export type WidgetType = {
  id: number;
  tag: FeatureTagType;
  title: string;
  description: string;
  image?: string;
  imageLink?: string;
  cta: string;
  ctaLink: string;
  identifierType?: FeatureWidgetIdentifierType;
};
