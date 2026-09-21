import Locale from "../../util/locale/en";
import { Events } from "../../analytics/EventConstants";
import { openSocialShare, Social } from "../../util/functions";
import React from "react";
import { replaceNumberAndPluralize } from "../../util/referralUtil";
import useReferralStore from "../../store/useReferralStore";
import useActiveCampaign from "../ReferralCampaigns/useActiveCampaign";
import useAnalytics from "../../analytics/useAnalytics";
import classNames from "classnames";
import EmailIconDarkMode from "../Icons/EmailIconDarkMode";
import WhatsappIconDarkMode from "../Icons/WhatsappIconDarkMode";
import LinkedinIconDarkMode from "../Icons/LinkedinIconDarkMode";
import FacebookIconDarkMode from "../Icons/FacebookIconDarkMode";
import TwitterIconDarkMode from "../Icons/TwitterIconDarkMode";

interface Props {
  containerClass?: string;
  isDarkBackground?: boolean;
  iconsBackgroundColor?: string;
  iconsStrokeColor?: string;
  iconSize?: number | string;
}

const ReferralPlatformSharing = (props: Props) => {
  const { isDarkBackground = false, iconsBackgroundColor, iconsStrokeColor, iconSize } = props;
  const { userReferralData } = useReferralStore();
  const activeCampaign = useActiveCampaign();
  const analytics = useAnalytics();

  if (!activeCampaign) return null;

  const rewardValue = activeCampaign.rewardCatalogue.rewardValue;

  const shareOnSocial = (social: Social) => {
    let text = "";
    if (social === Social.FB) {
      analytics.trackAsync(Events.REFERRAL_FB_SHARE_CLICK);
    } else if (social === Social.LINKEDIN) {
      analytics.trackAsync(Events.REFERRAL_LINKEDIN_SHARE_CLICK);
      text = Locale.referOverLinkedinText.replace("${referralLink}", userReferralData?.referralUrl || "")
        .replace("{{RefereeReward}}", "$" + rewardValue.toString());
    } else if (social === Social.TWITTER) {
      analytics.trackAsync(Events.REFERRAL_TWITTER_SHARE_CLICK);
      text = Locale.referOverTwitterText;
    }
    openSocialShare(social, userReferralData?.referralUrl || "", text);
  };

  const shareOnWhatsapp = () => {
    const whatsappMessage = encodeURIComponent(
      replaceNumberAndPluralize(
        Locale.referOverWhatsappText.replace("${referralLink}", userReferralData?.referralUrl || "").replace("{{RefereeReward}}", "$" + rewardValue.toString()),
        rewardValue
      )
    );
    analytics.trackAsync(Events.REFERRAL_WHATSAPP_SHARE_CLICK);
    window.open("https://api.whatsapp.com/send?text=" + whatsappMessage, "_blank", "noopener");
  };

  const lightIconStroke = "#0F1F4B";
  const lightIconFill = "#FFFFFF";
  const lightIconSize = iconSize ?? 32;
  const darkIconSize = iconSize ?? 32;

  return (
    <div className={classNames("flex flex-row gap-4 pt-4 md:pt-4", props.containerClass)}>
      <a
        href={Locale.referOverEmailText
          .replace("${subject}", Locale.referOverEmailSubject)
          .replace(
            "${body}",
            encodeURIComponent(
              Locale.referOverEmailBody
                .replace("{{ReferralLink}}", userReferralData?.referralUrl || "")
                .replace(
                  "{{Name}}",
                  userReferralData?.exporterUser?.registeredName || userReferralData?.exporterUser?.fullName || ""
                ).replace("{{RefereeReward}}", "$" + rewardValue.toString()
              )
            )
          )}
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => analytics.trackAsync(Events.REFERRAL_EMAIL_SHARE_CLICK)}
      >
        {isDarkBackground ? (
          <EmailIconDarkMode height={darkIconSize} width={darkIconSize} backgroundColor={iconsBackgroundColor} strokeColor={iconsStrokeColor} />
        ) : (
          <EmailIconDarkMode height={lightIconSize} width={lightIconSize} backgroundColor={lightIconFill} strokeColor={lightIconStroke} />
        )}
      </a>
      {isDarkBackground ? (
        <div className={"cursor-pointer"} onClick={shareOnWhatsapp}>
          <WhatsappIconDarkMode height={darkIconSize} width={darkIconSize} backgroundColor={iconsBackgroundColor} strokeColor={iconsStrokeColor} />
        </div>
      ) : (
        <div className={"cursor-pointer"} onClick={shareOnWhatsapp}>
          <WhatsappIconDarkMode height={lightIconSize} width={lightIconSize} backgroundColor={lightIconFill} strokeColor={lightIconStroke} />
        </div>
      )}
      {isDarkBackground ? (
        <div className={"cursor-pointer"} onClick={() => shareOnSocial(Social.LINKEDIN)}>
          <LinkedinIconDarkMode height={darkIconSize} width={darkIconSize} backgroundColor={iconsBackgroundColor} strokeColor={iconsStrokeColor} />
        </div>
      ) : (
        <div className={"cursor-pointer"} onClick={() => shareOnSocial(Social.LINKEDIN)}>
          <LinkedinIconDarkMode height={lightIconSize} width={lightIconSize} backgroundColor={lightIconFill} strokeColor={lightIconStroke} />
        </div>
      )}
      {isDarkBackground ? (
        <div className={"cursor-pointer"} onClick={() => shareOnSocial(Social.FB)}>
          <FacebookIconDarkMode height={darkIconSize} width={darkIconSize} backgroundColor={iconsBackgroundColor} strokeColor={iconsStrokeColor} />
        </div>
      ) : (
        <div className={"cursor-pointer"} onClick={() => shareOnSocial(Social.FB)}>
          <FacebookIconDarkMode height={lightIconSize} width={lightIconSize} backgroundColor={lightIconFill} strokeColor={lightIconStroke} />
        </div>
      )}
      {isDarkBackground ? (
        <div className={"cursor-pointer"} onClick={() => shareOnSocial(Social.TWITTER)}>
          <TwitterIconDarkMode height={darkIconSize} width={darkIconSize} backgroundColor={iconsBackgroundColor} strokeColor={iconsStrokeColor} />
        </div>
      ) : (
        <div className={"cursor-pointer"} onClick={() => shareOnSocial(Social.TWITTER)}>
          <TwitterIconDarkMode height={lightIconSize} width={lightIconSize} backgroundColor={lightIconFill} strokeColor={lightIconStroke} />
        </div>
      )}
    </div>
  );
};

export default ReferralPlatformSharing;
