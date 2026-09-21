import React from "react";
import useUserData from "../../store/useUserData";
import { isUserKYCed } from "../../util/functions";
import ProfileNudge from "../ReferralCampaigns/surfaces/ProfileNudge";

interface Props {
  closeProfile: () => void;
}

const ProfileSectionReferralWidget: React.FC<Props> = ({ closeProfile }) => {
  const { userState } = useUserData();
  if (!isUserKYCed(userState)) return null;
  return <ProfileNudge closeProfile={closeProfile} />;
};

export default ProfileSectionReferralWidget;
