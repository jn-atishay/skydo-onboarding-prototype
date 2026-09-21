import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useUserData from "../../../store/useUserData";
import useAnalytics from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";
import { isUserKYCed } from "../../../util/functions";
import FE_ROUTES from "../../../util/feRoutes";
import useActiveCampaign from "../useActiveCampaign";
import Button from "../../AtomicComponents/Button";
import { BUTTON_TYPES, BUTTON_SIZES } from "../../../constants/atomicConstants";
import Locale from "../../../util/locale/en";

interface Props {
  closeProfile: () => void;
}

// `profile_banner` already has copy and the CTA chevron baked in, so this
// surface is intentionally just a clickable image with no overlay.
const ProfileNudge = ({ closeProfile }: Props) => {
  const { userState, isTransacting } = useUserData();
  const router = useRouter();
  const analytics = useAnalytics();
  const campaign = useActiveCampaign();

  if (!campaign || !isUserKYCed(userState)) return null;

  const banner = campaign.assets.profile;
  if (!banner) return null;

  const onClick = () => {
    closeProfile();
    void router.push(FE_ROUTES.REFERRAL);
    analytics?.trackAsync(Events.REFERRAL_TRACK_REFERRAL_CLICK, {
      isTransacting,
      type: campaign.campaignKey,
    });
  };

  return (
    <div className="mx-4 -mt-2">
      <Button
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.MEDIUM}
        nativeType="button"
        onButtonClick={onClick}
        buttonClass="!w-full overflow-hidden !rounded-10px !p-0 !h-auto !bg-transparent hover:!bg-transparent focus:!bg-transparent"
        buttonProps={{ "aria-label": Locale.referAndEarn }}
        title={() => (
          <div className="relative w-full aspect-[247/56]">
            <Image src={banner} alt="" layout="fill" objectFit="cover" sizes="(max-width: 768px) 90vw, 360px" />
          </div>
        )}
      />
    </div>
  );
};

export default ProfileNudge;
