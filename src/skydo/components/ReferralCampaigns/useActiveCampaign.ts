import { useEffect, useMemo } from "react";
import useReferralStore from "../../store/useReferralStore";
import { ALEXA_CAMPAIGN_KEY, CAMPAIGNS, DEFAULT_CAMPAIGN_KEY, getCampaignByKey } from "./campaigns.config";
import type { Campaign } from "./types";
import { ordinalSuffix } from "../../util/formatters";
import type { MilestoneProgress } from "../../types/Referral";

export const campaignDaysLeft = (campaign: Campaign): number => {
  if (!campaign.endDate) return 0;
  const ms = new Date(campaign.endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

export const shouldShowMilestoneTracker = (
  campaign: Campaign | null,
  milestoneProgress?: MilestoneProgress | null
): boolean =>
  !!campaign?.milestoneProgram &&
  !milestoneProgress?.giftForfeited &&
  milestoneProgress?.claimedMilestoneThreshold == null &&
  (!campaign.isTimeLimited || campaignDaysLeft(campaign) > 0);

export const formatCampaignEndDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${day}${ordinalSuffix(day)} ${month} ${d.getFullYear()}`;
};

// Matches BE's campaign name against `campaigns.config`. Falls back to
// the evergreen campaign on unknown key. Alexa endDate is per-user so we
// override the config value with the eligibility-fetch result.
const useActiveCampaign = (): Campaign | null => {
  const activeCampaignName = useReferralStore((s) => s.activeCampaign?.name);
  const alexaCampaignEndDate = useReferralStore((s) => s.alexaCampaignEndDate);
  const alexaEndDateFetched = useReferralStore((s) => s.alexaEndDateFetched);
  const fetchAlexaCampaignEndDate = useReferralStore((s) => s.fetchAlexaCampaignEndDate);

  const resolvedKey = activeCampaignName;
  const needsAlexaEndDate = resolvedKey === ALEXA_CAMPAIGN_KEY && !alexaCampaignEndDate && !alexaEndDateFetched;

  useEffect(() => {
    if (needsAlexaEndDate) fetchAlexaCampaignEndDate();
  }, [needsAlexaEndDate, fetchAlexaCampaignEndDate]);

  return useMemo(() => {
    if (!resolvedKey) return null;
    const defaultCampaign = getCampaignByKey(DEFAULT_CAMPAIGN_KEY) ?? CAMPAIGNS[0];
    const matched = getCampaignByKey(resolvedKey);
    if (matched) {
      if (matched.campaignKey === ALEXA_CAMPAIGN_KEY && alexaCampaignEndDate) {
        return { ...matched, endDate: alexaCampaignEndDate };
      }
      return matched;
    }
    return defaultCampaign;
  }, [resolvedKey, alexaCampaignEndDate]);
};

export default useActiveCampaign;
