/**
 * @author Raj Sheth
 * created: 22/01/24
 */

import React, { useEffect } from "react";
import useReferralStore from "../../../store/useReferralStore";
import { getRefereeRewardValue } from "../../../util/referralUtil";
import Locale from "../../../util/locale/en";
import ReferralGiftIcon from "../../Icons/ReferralGiftIcon";
import Typography from "../../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import classNames from "classnames";

const ReferralNoteOnboarding = ({ containerClasses = "" }: { containerClasses?: string }) => {
  const { referrerDetails, fetchReferrerData } = useReferralStore();
  useEffect(() => {
    // Fetching referee details for onboarding flow
    fetchReferrerData();
  }, []);
  const refereeRewardValue = getRefereeRewardValue(referrerDetails);
  if (!referrerDetails || refereeRewardValue === undefined) {
    return null;
  }
  const referredByText = Locale.referredByText
    .replace("${refereeName}", referrerDetails.exporterName || "")
    .replace("${rewardValue}", refereeRewardValue.toString());
  return (
    <div
      className={classNames(
        "flex flex-row bg-yellow-50 rounded-20px mb-2 md:mb-6 pt-4 pb-4 mx-4 md:mx-0",
        containerClasses
      )}
    >
      <div className={"flex flex-row h-full w-full justify-center content-center flex-wrap gap-2 px-4 md:px-0"}>
        <ReferralGiftIcon />
        <div className={"flex flex-row h-full justify-center content-center flex-wrap items-center md:h-12"}>
          <Typography
            text={referredByText}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!text-black-700 text-center md:text-left"}
            fontWeight={"bold"}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferralNoteOnboarding;
