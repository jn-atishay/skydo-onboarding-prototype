import React from "react";
import UtmInput from "./UtmInput";
import UtmKycDocsHandy from "./UtmKycDocsHandy";
import CompleteYourKyc from "./CompleteYourKyc";
import SheildIcon from "../Icons/SheildIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import useReferralStore from "../../store/useReferralStore";
import { UTM_VALUES } from "../../constants/onboarding";
import KYCIntroMob from "./KYCIntroMob";
import useKYCIntro from "./useKYCIntro";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";

const KYCIntroInner = () => {
  const { utmPresent, onGetStartedClick, tncClick, ppClick } = useKYCIntro();
  const { referrerDetails } = useReferralStore();

  const userSourceIsKnown = referrerDetails || utmPresent;

  return userSourceIsKnown ? (
    <CompleteYourKyc
      tncClick={tncClick}
      ppClick={ppClick}
      onGetStartedClick={onGetStartedClick}
    />
  ) : (
    <div className={"content-area flex flex-col space-y-8"}>
      <UtmInput ppClick={ppClick} onGetStartedClick={onGetStartedClick} tncClick={tncClick} />
      <UtmKycDocsHandy />
      <div className={"flex flex-row mt-6 items-center pb-[20px]"}>
        <SheildIcon />
        <div className={"flex flex-col"}>
          <Typography
            text={Locale.safetyTextUtm}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"ml-4 !text-black-500"}
          />
          <Typography
            text={Locale.safetyTextUtm2}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"ml-4 !text-black-500"}
          />
        </div>
      </div>
    </div>
  );
};

const KYCIntro = () => {
  useAnalytics((analytics) => {
    analytics.trackAsync(Events.TNC_SCREEN_LOAD);
  });
  return (
    <>
      <div className={"hide_for_desktop flex flex-col flex-1 h-screen"}>
        <KYCIntroMob />
      </div>
      <div className={"hide_for_mob"}>
        <KYCIntroInner />
      </div>
    </>
  );
};

export default KYCIntro;
