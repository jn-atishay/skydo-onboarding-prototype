import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../context/AppContext";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import classNames from "classnames";
import useUserData from "../../store/useUserData";
import { USER_STATES } from "../../constants/onboarding";
import OnboardingBannerIcon from "../Icons/OnboardingBannerIcon";

const OnboardingUnderReviewBanner = () => {
  const { theme } = useContext(AppContext);
  const { userState } = useUserData();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [layout, setLayout] = useState("");

  useEffect(() => {
    const w = containerRef?.current?.clientWidth || 0;
    if (w > 0) {
      setIsLoading(false);
      if (w > 500) {
        setLayout("FULL");
      } else {
        setLayout("HALF");
      }
    }
  }, [containerRef]);

  const designClass = layout == "FULL" ? "flex-row items-center" : "flex-col justify-center";

  const getHeaders = () => {
    if (userState == USER_STATES.MANUAL_VERIFICATION) {
      return (
        <div className={"flex flex-col"}>
          <Typography
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            text={Locale.onboardingBanner.reviewKycDetails}
          />
        </div>
      );
    }
    if (userState == USER_STATES.BENEFICIARY_ACCOUNT_PENDING || USER_STATES.ONBOARDING_COMPLETE) {
      return (
        <div className={"flex flex-col"}>
          <span>
            <Typography
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              text={Locale.onboardingBanner.yourViewVerification}
            />
            <Typography
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              text={Locale.onboardingBanner.isUnderReview}
              textClasses={"!text-red-300"}
            />
          </span>
        </div>
      );
    }
  };

  return (
    <div ref={containerRef} className={"bg-white rounded-10px flex flex-row items-center h-full"}>
      <div className={classNames("flex gap-6", designClass)}>
        <OnboardingBannerIcon height={72} width={114.5} />
        <div className={"flex flex-col gap-1"}>
          {getHeaders()}
          <Typography
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            text={Locale.dashboardWelcomeMainReviewingSub}
            textClasses={"!text-black-500"}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingUnderReviewBanner;
