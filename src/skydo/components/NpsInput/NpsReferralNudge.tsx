import Locale from "../../util/locale/en";
import { TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import React, { useEffect } from "react";
import useReferralStore from "../../store/useReferralStore";
import useActiveCampaign from "../ReferralCampaigns/useActiveCampaign";
import { getCampaignReward } from "../ReferralCampaigns/campaigns.config";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import useToastMessages from "../../store/toastMessages";
import ReferralPlatformSharing from "../Referral/ReferralPlatformSharing";
import { replaceNumberAndPluralize } from "../../util/referralUtil";
import useNpsStore from "../../store/useNpsStore";
import { getScoreRange, NpsInputSource, ScoreRange } from "../../constants/npsInputConstants";

interface Props {
  source: NpsInputSource;
  identifier?: string;
}

const NpsReferralNudge = (props: Props) => {
  const { source, identifier } = props;
  const {
    userReferralData,
    fetchActiveReferral,
    fetchActiveCampaignPublic,
    fetchReferralTrackingDataViaIdentifier,
  } = useReferralStore();
  const activeCampaign = useActiveCampaign();
  const analytics = useAnalytics();
  const { addToast } = useToastMessages();
  const rewardValue = activeCampaign?.rewardCatalogue.rewardValue ?? getCampaignReward().rewardValue;
  const { npsScore } = useNpsStore();
  const scoreRange = getScoreRange(npsScore);

  useEffect(() => {
    if (identifier) {
      fetchReferralTrackingDataViaIdentifier(identifier as string);
    } else {
      fetchActiveReferral();
    }
    fetchActiveCampaignPublic(identifier);

    if (scoreRange == ScoreRange.HIGH) {
      analytics?.trackAsync(Events.REFERRAL_NPS_NUDGE_SHOWN, { source: source });
    }
  }, []);

  if (scoreRange != ScoreRange.HIGH) return null;

  const copyLinkToClipboard = (text: string) => {
    analytics.trackAsync(Events.REFERRAL_COPY_LINK_CLICK, {
      source: "NPS_" + source,
    });
    navigator?.clipboard
      ?.writeText(text)
      .then(() => {
        addToast({
          type: TOAST_TYPES.SUCCESS,
          id: "success_copied",
          body: Locale.copied,
          time: 2000,
        });
      })
      .catch((err) => {});
  };

  return (
    <div className={"flex flex-col gap-4 bg-black-50 rounded py-4 px-6"}>
      <Typography
        text={replaceNumberAndPluralize("Great experiences are better when shared. ", rewardValue)}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.LARGE}
        fontWeight={"700"}
      >
        <Typography
          text={"Invite a friend and earn rewards!"}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.LARGE}
          fontWeight={"700"}
          textClasses={"!text-green-400"}
        />
      </Typography>

      <div
        className={"flex flex-row justify-between rounded-10px border border-black-400 px-4 py-3 bg-white items-center"}
        onClick={() => copyLinkToClipboard(userReferralData?.referralUrl || "")}
      >
        <Typography text={userReferralData?.referralUrl} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} />
        <div
          onClick={() => copyLinkToClipboard(userReferralData?.referralUrl || "")}
          className={"cursor-pointer min-w-fit"}
        >
          <Typography
            text={"Copy Link"}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight={"600"}
            textClasses={"!text-blue-300"}
          />
        </div>
      </div>
      <ReferralPlatformSharing containerClass={"!pt-0"} />
      <div className={"w-full bg-black-400 h-[1px]"} />
      <Typography text={Locale.tillDateCustomersEarner} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM}>
        <Typography
          text={Locale.fourLakhs}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!text-green-400"}
          fontWeight={"bold"}
        />
        <Typography text={Locale.throughReferrals} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM} />
      </Typography>
    </div>
  );
};

export default NpsReferralNudge;
