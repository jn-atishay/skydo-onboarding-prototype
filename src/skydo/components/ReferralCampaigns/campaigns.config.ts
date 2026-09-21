import type { Campaign, CampaignAssets, RewardCatalogue } from "./types";
import Locale from "../../util/locale/en";

export const DEFAULT_CAMPAIGN_KEY = "Skydo referral 1 + 1";
export const ALEXA_CAMPAIGN_KEY = "alexa_campaign";
export const MOONSHOT_CAMPAIGN_KEY = "moonshot_campaign";

/**
 * Builds every asset URL for a campaign from one folder. All assets live
 * in `/public/referral-campaigns/<assetKey>/` with these fixed filenames:
 *
 *   homepage_banner.<ext>
 *   refpage_desktop_banner.<ext>
 *   refpage_mobile_banner.<ext>
 *   profile_banner.<ext>
 *   logo.<ext>
 *   animation.lottie.json
 *
 * `assetKey` is the folder name and doesn't have to match `campaignKey` —
 * useful when the BE-returned key isn't path-safe (e.g. the default
 * fallback) or when multiple campaigns share an asset bundle.
 */
type AssetExt = "webp" | "png";
const campaignAssets = (assetKey: string, ext: AssetExt = "webp"): CampaignAssets => {
  const base = `/referral-campaigns/${assetKey}`;
  return {
    homepage: `${base}/homepage_banner.${ext}`,
    refpageDesktop: `${base}/refpage_desktop_banner.${ext}`,
    refpageMobile: `${base}/refpage_mobile_banner.${ext}`,
    profile: `${base}/profile_banner.${ext}`,
    logo: `${base}/logo.${ext}`,
    animation: `${base}/animation.lottie.json`,
  };
};

export const CAMPAIGNS: Campaign[] = [
  {
    campaignKey: MOONSHOT_CAMPAIGN_KEY,
    endDate: "2026-10-31T23:59:59+05:30",
    isTimeLimited: true,
    termsUrl: "https://skydo-public-documents.s3.ap-south-1.amazonaws.com/referral/skydo-referral-tc.pdf",
    rewardCatalogue: { rewardValue: 30, referrerRewardValue: 30 },
    assets: {
      ...campaignAssets("moonshot"),
      logo: "/referral-campaigns/moonshot/instax_sidebar.png",
      animation: "/referral-campaigns/moonshot/instax_lottie.json",
    },
    referralPageBannerDimensions: {
      desktop: { width: 5952, height: 1488 },
      mobile: { width: 1312, height: 2000 },
    },
    sidebarGradientClass: "bg-moonshot-sidebar",
    copy: {
      activityGroupLabel: Locale.moonshotActivityGroupLabel,
      sidebar: {
        collapsedTooltipWhite: Locale.moonshotCollapsedTooltipWhite,
        collapsedTooltipGreen: Locale.moonshotCollapsedTooltipGreen,
        expandedHeading: Locale.moonshotExpandedHeading,
        expandedFooter: Locale.moonshotLimitedTimeOffer,
      },
    },
    milestoneProgram: {
      rewards: [
        {
          referralTarget: 1,
          name: Locale.moonshotInstaxName,
          progressName: Locale.moonshotInstaxProgressName,
          claimWarningName: Locale.moonshotInstaxClaimWarningName,
          redemptionLink:
            "https://docs.google.com/forms/d/e/1FAIpQLSccySANpbV2ZWyvstHdOSpeyuSTIKn07WASVtRoSLgY7AOMJA/viewform?usp=pp_url&entry.1601059460={{EncodedReferrerEmail}}",
          image: "/referral-campaigns/moonshot/instax_reward.jpg",
          sidebarImage: "/referral-campaigns/moonshot/instax_sidebar.png",
          animation: "/referral-campaigns/moonshot/instax_lottie.json",
        },
        {
          referralTarget: 3,
          name: Locale.moonshotAirpodsName,
          progressName: Locale.moonshotAirpodsProgressName,
          claimWarningName: Locale.moonshotAirpodsClaimWarningName,
          redemptionLink:
            "https://docs.google.com/forms/d/e/1FAIpQLScekCDvKCni1o01NKvLcAyE2XN3JJdLTuDGXxJnP4g6vrPr3w/viewform?usp=pp_url&entry.1601059460={{EncodedReferrerEmail}}",
          image: "/referral-campaigns/moonshot/airpods_reward.jpg",
          sidebarImage: "/referral-campaigns/moonshot/airpods_sidebar.png",
          animation: "/referral-campaigns/moonshot/airpods_lottie.json",
        },
        {
          referralTarget: 5,
          name: Locale.moonshotRaybansName,
          progressName: Locale.moonshotRaybansProgressName,
          claimWarningName: Locale.moonshotRaybansClaimWarningName,
          redemptionLink:
            "https://docs.google.com/forms/d/e/1FAIpQLSf_4kzwU731z7LVoTs0Kde24sYptbCDlIIgqw6OJrDQl7uWAg/viewform?usp=pp_url&entry.1601059460={{EncodedReferrerEmail}}",
          image: "/referral-campaigns/moonshot/raybans_reward.jpg",
          sidebarImage: "/referral-campaigns/moonshot/raybans_sidebar.png",
          animation: "/referral-campaigns/moonshot/raybans_lottie.json",
        },
        {
          referralTarget: 8,
          name: Locale.moonshotIphoneName,
          progressName: Locale.moonshotIphoneProgressName,
          claimWarningName: Locale.moonshotIphoneClaimWarningName,
          redemptionLink:
            "https://docs.google.com/forms/d/e/1FAIpQLSeCXWvIe2kpTc4WUJWbTPFBakJngmPwNRTZCSPjLeh1J6MC1w/viewform?usp=pp_url&entry.1601059460={{EncodedReferrerEmail}}",
          image: "/referral-campaigns/moonshot/iphone_reward.jpg",
          sidebarImage: "/referral-campaigns/moonshot/iphone_sidebar.png",
          animation: "/referral-campaigns/moonshot/iphone_lottie.json",
        },
      ],
    },
  },
  {
    campaignKey: "group_a_mokobara",
    endDate: "2026-05-31T23:59:59+05:30",
    isTimeLimited: true,
    rewardCatalogue: { rewardValue: 30, referrerRewardValue: 30 },
    assets: campaignAssets("group_a_mokobara"),
    sidebarGradient: ["#FFA73B", "#FFD468", "#FBBE45"],
    copy: {
      sidebar: {
        collapsedTooltipWhite: "Refer and win a",
        collapsedTooltipGreen: " mokobara backpack!",
        expandedHeading: "Refer and win a mokobara backpack",
        expandedFooter: "Limited time offer",
      },
    },
    howItWorksAccordion: {
      thirdStep: {
        title: "You win a Mokobara backpack",
        description: "Get a Mokobara Transit backpack when your friend completes their first payment.",
      },
    },
  },
  {
    campaignKey: "group_a_coffee",
    endDate: "2026-06-30T23:59:59+05:30",
    isTimeLimited: true,
    rewardCatalogue: { rewardValue: 30, referrerRewardValue: 30 },
    assets: campaignAssets("group_a_coffee"),
    sidebarGradient: ["#F2C482", "#E7C093", "#D39445"],
    copy: {
      sidebar: {
        collapsedTooltipWhite: "Refer and win a",
        collapsedTooltipGreen: " Coffee Machine!",
        expandedHeading: "Refer and win a Coffee Machine",
        expandedFooter: "Limited time offer",
      },
    },
    howItWorksAccordion: {
      thirdStep: {
        title: "You win an Espresso Coffee Machine!",
        description: "Get a Wonderchef Coffee Machine when your referral completes their first payment",
      },
    },
  },
  {
    campaignKey: "group_a_powerbank",
    endDate: "2026-07-23T23:59:59+05:30",
    isTimeLimited: true,
    rewardCatalogue: { rewardValue: 30, referrerRewardValue: 30 },
    assets: campaignAssets("group_a_powerbank"),
    sidebarGradient: ["#62A2FF", "#DCECFF", "#A1C7FF"],
    copy: {
      sidebar: {
        collapsedTooltipWhite: "Refer. Recharge.",
        collapsedTooltipGreen: " Repeat.",
        expandedHeading: "Refer and win a wireless powerbank",
        expandedFooter: "Limited time offer",
      },
    },
    howItWorksAccordion: {
      thirdStep: {
        title: "You win a Daily Objects power bank!",
        description: "Get a Loop wireless power bank when your referral completes their first payment",
      },
    },
  },
  {
    campaignKey: "group_a_tommy",
    endDate: "2026-08-31T23:59:59+05:30",
    isTimeLimited: true,
    rewardCatalogue: { rewardValue: 30, referrerRewardValue: 30 },
    assets: campaignAssets("group_a_tommy"),
    sidebarGradient: ["#512D1D", "#9E5D31", "#DFB878"],
    sidebarTextTheme: "light",
    copy: {
      sidebar: {
        collapsedTooltipWhite: "Refer. Win. ",
        collapsedTooltipGreen: "Repeat",
        expandedHeading: "Share Skydo, get a Tommy Hilfiger bag!",
        expandedFooter: "Limited time offer",
      },
    },
    howItWorksAccordion: {
      thirdStep: {
        title: "You win a Tommy Hilfiger Trolley Bag!",
        description: "Get a Tommy Hilfiger bag when your referral completes their first payment",
      },
    },
  },
  {
    campaignKey: ALEXA_CAMPAIGN_KEY,
    // Per-user endDate; `useActiveCampaign` overrides this with the value
    // fetched from /referral/alexa-campaign-eligibility (activation + 15 days).
    endDate: "",
    isTimeLimited: true,
    rewardCatalogue: { rewardValue: 30, referrerRewardValue: 30 },
    assets: campaignAssets("alexa_campaign"),
    referralPageBannerDimensions: {
      desktop: { width: 4384, height: 1460 },
      mobile: { width: 1336, height: 2000 },
    },
    sidebarGradient: ["#B0CAFA", "#D4E2FC", "#A3C2F9"],
    copy: {
      sidebar: {
        collapsedTooltipWhite: "Refer and win an ",
        collapsedTooltipGreen: "Amazon Alexa!",
        expandedHeading: "Win an Amazon Alexa smart speaker!",
        expandedFooter: "Limited time offer",
      },
    },
    howItWorksAccordion: {
      thirdStep: {
        title: "You win an Amazon Echo Dot",
        description: "Get a free Amazon Echo Dot when your referral completes their first payment.",
      },
    },
  },
  {
    campaignKey: DEFAULT_CAMPAIGN_KEY,
    rewardCatalogue: { rewardValue: 30, referrerRewardValue: 30 },
    assets: campaignAssets("default_30usd"),
    referralPageBannerDimensions: {
      desktop: { width: 5844, height: 1344 },
      mobile: { width: 1336, height: 2000 },
    },
    sidebarGradient: ["#B5C6FF", "#DFE9FF", "#A9BBFF"],
    copy: {
      sidebar: {
        collapsedTooltipWhite: "Refer friends, ",
        collapsedTooltipGreen: "earn $30 discount!",
        expandedHeading: "Refer and win!",
        expandedFooter: "Earn $30 discount for every referral",
      },
    },
    howItWorksAccordion: {
      thirdStep: {
        title: "You earn $30 discount!",
        description:
          "Get $30 discount when your referral makes their first payment - auto-applied to your next payment",
      },
    },
  },
];

export const getCampaignByKey = (campaignKey?: string | null): Campaign | undefined =>
  CAMPAIGNS.find((campaign) => campaign.campaignKey === campaignKey);

export const getCampaignReward = (campaignKey?: string | null): RewardCatalogue =>
  (getCampaignByKey(campaignKey) ?? getCampaignByKey(DEFAULT_CAMPAIGN_KEY) ?? CAMPAIGNS[0]).rewardCatalogue;

export const MILESTONE_CAMPAIGNS = CAMPAIGNS.filter((campaign) => campaign.milestoneProgram);
