import VideoKycBanner from "../Vkyc/VideoKycBanner";
import useVideoKycStore from "../../store/useVideoKycStore";
import { isUserKYCed } from "../../util/functions";
import useUserData from "../../store/useUserData";
import { useTour } from "@reactour/tour";
import OnboardingUnderReviewBanner from "./OnboardingUnderReviewBanner";
import React, { useEffect } from "react";
import { VKYCStatus } from "../../types/vkyc";
import BannerLoader from "../Banners/BannerLoader";

const OnboardingBanner = () => {
  const { isOpen } = useTour();
  const { userState } = useUserData();
  const { isVideoKycDone, refetch, isLoading, verifStatus } = useVideoKycStore();
  const isUserPreKyc = !isOpen && !isUserKYCed(userState);

  /**
   * 3 States
   * Vkyc Not Initiated - in Manual or BAP or other account created state
   * Vkyc in Progress - Manual
   * Vkyc in Progress - BAP
   * */

  const initialize = async () => {
    await refetch();
  };

  useEffect(() => {
    void initialize();
  }, []);

  const isVkycNotStarted = verifStatus == VKYCStatus.NOT_STARTED;

  return (
    <>
      {isLoading ? (
        <BannerLoader />
      ) : !isVkycNotStarted ? (
        !isUserPreKyc ? (
          <OnboardingUnderReviewBanner />
        ) : null
      ) : (
        <VideoKycBanner />
      )}
    </>
  );
};

export default OnboardingBanner;
