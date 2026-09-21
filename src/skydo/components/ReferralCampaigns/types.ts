export type AssetSrc = string | null;

// Fixed-filename asset bundle. Conventions, not type-enforced — keep the
// folder layout in sync with `campaignAssets` in `campaigns.config.ts`.
//   homepage_banner       — single image, all breakpoints
//   refpage_desktop_banner, refpage_mobile_banner
//   profile_banner        — profile-page nudge
//   logo                  — sidebar corner + how-it-works step 3 icon
//   animation.lottie.json — collapsed sidebar + mobile top-bar icon
export interface CampaignAssets {
  homepage: AssetSrc;
  refpageDesktop: AssetSrc;
  refpageMobile: AssetSrc;
  profile: AssetSrc;
  logo: AssetSrc;
  animation: string;
}

export interface MilestoneReward {
  referralTarget: number;
  name: string;
  progressName?: string;
  claimWarningName: string;
  redemptionLink: string;
  image: string;
  sidebarImage: string;
  animation: string;
}

export interface MilestoneProgram {
  rewards: MilestoneReward[];
}

export interface CampaignCopy {
  activityGroupLabel?: string;
  sidebar: {
    collapsedTooltipWhite: string;
    collapsedTooltipGreen: string;
    expandedHeading: string;
    // When `isTimeLimited`, a bold "X days left!" line is rendered just
    // below this footer (derived from `endDate`).
    expandedFooter?: string;
  };
}

export interface RewardCatalogue {
  rewardValue: number;
  referrerRewardValue: number;
}

export interface ReferralPageBannerDimensions {
  desktop: { height: number; width: number };
  mobile: { height: number; width: number };
}

// Steps 1+2 of the how-to accordion are universal; step 3 (the reward)
// is per-campaign. Its icon reuses the campaign `logo` asset.
export interface HowItWorksAccordionThirdStep {
  title: string;
  description: string;
}

export interface Campaign {
  campaignKey: string;
  endDate?: string;
  termsUrl?: string;
  // When true, the sidebar widget shows a "X days left!" countdown
  // derived from `endDate`. Always-on campaigns leave this off.
  isTimeLimited?: boolean;
  rewardCatalogue: RewardCatalogue;
  assets: CampaignAssets;
  referralPageBannerDimensions?: ReferralPageBannerDimensions;
  // Existing campaigns use runtime colors; tokenized campaigns use a theme class.
  sidebarGradient?: [string, string, string];
  sidebarGradientClass?: string;
  // Expanded sidebar-card foreground. "dark" (default) reads on the light
  // gradients; "light" (near-white) reads on dark gradients like tommy.
  sidebarTextTheme?: "dark" | "light";
  copy: CampaignCopy;
  howItWorksAccordion?: { thirdStep: HowItWorksAccordionThirdStep };
  milestoneProgram?: MilestoneProgram;
}
