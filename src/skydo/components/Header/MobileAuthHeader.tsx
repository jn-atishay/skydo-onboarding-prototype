import SkydoIcon from "../Icons/SkydoIcon";
import UserProfileCardMobile from "./UserProfileCardMobile";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import FE_ROUTES, { DISABLED_HEADER_FOR_MOBILE } from "../../util/feRoutes";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import { ArrowIconSmallRotated } from "../Icons/ArrowIconSmall";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import SkydoFullIcon from "../Icons/SkydoFullIcon";
import useMobileNavBarStore from "../../store/useMobileNavBarStore";
import MobileNavIcon from "../Icons/MobileNavIcon";
import { USER_STATES } from "../../constants/onboarding";
import useUserData from "../../store/useUserData";
import MobileNavCloseIcon from "../Icons/MobileNavCloseIcon";
import useActiveCampaign from "../ReferralCampaigns/useActiveCampaign";
import useHomeStateStore, { HomeState } from "../../store/useHomeStateStore";
import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, BUTTON_TYPES } from "../../constants/atomicConstants";
import CampaignLottiePlayer from "../ReferralCampaigns/CampaignLottiePlayer";
import useReferralStore from "../../store/useReferralStore";

const MobileAuthHeader = () => {
  const analytics = useAnalytics();
  const router = useRouter();
  const { isNavBarOpen, openNavBar, closeNavBar } = useMobileNavBarStore();
  const { userState } = useUserData();
  const { homeState, fetchHomeState } = useHomeStateStore();
  const campaign = useActiveCampaign();
  const achievedReferralCount = useReferralStore(
    (state) => state.activeCampaign.milestoneProgress?.achievedReferralCount || 0
  );
  const isPublicReferralRoute = router.pathname === FE_ROUTES.PUBLIC_REFERRAL_ROUTE;
  const isFocusedHomeUser = homeState === HomeState.FOCUSED;

  useEffect(() => {
    if (isPublicReferralRoute) return;
    fetchHomeState();
  }, [fetchHomeState, isPublicReferralRoute]);

  if (DISABLED_HEADER_FOR_MOBILE.includes(router.pathname)) {
    return null;
  }

  const isVKyc = router.pathname == FE_ROUTES.VKYC;

  if (router.pathname === FE_ROUTES.PUBLIC_REFERRAL_ROUTE) {
    return (
      <div
        className={"z-[52] bg-black-50 items-center justify-center h-headerHeight fixed top-0 left-0 right-0 px-6 flex"}
      >
        <SkydoFullIcon />
      </div>
    );
  }

  if (userState == USER_STATES.NO_STATE) return null;

  const titleByRoute: Record<string, string> = {
    [FE_ROUTES.INVOICES]: "Invoices",
    [FE_ROUTES.PAYMENTS]: "Invoices",
    [FE_ROUTES.FUNDING]: "Unmapped Payments",
  };

  return (
    <div
      className={
        "z-[52] md:hidden flex bg-white h-headerHeight fixed top-0 left-0 right-0 border-y border-black-400 px-4 items-center justify-between"
      }
    >
      {isVKyc ? (
        <div className={"flex flex-row justify-start items-center gap-2"}>
          <div
            className={"cursor-pointer"}
            onClick={() => {
              analytics?.trackAsync(Events.VKYC_BACK_CLICKED);
              router.push(FE_ROUTES.HOME);
            }}
          >
            <ArrowIconSmallRotated width={24} height={24} />
          </div>
          <Typography
            text={Locale.videoKycOfDirector}
            size={TYPOGRAPHY_SIZES.LARGE}
            type={TYPOGRAPHY_TYPES.LABEL}
            fontWeight={"700"}
          />
        </div>
      ) : (
        <>
          {userState == USER_STATES.BENEFICIARY_ACCOUNT_PENDING ? (
            <div className={"flex flex-row gap-4 items-center"}>
              {isNavBarOpen ? (
                <div onClick={() => closeNavBar(analytics)}>
                  <MobileNavCloseIcon />
                </div>
              ) : (
                <div onClick={() => openNavBar(analytics)}>
                  <MobileNavIcon />
                </div>
              )}
              {titleByRoute[router.pathname] && (
                <Typography
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.LARGE}
                  text={titleByRoute[router.pathname]}
                  fontWeight={"bold"}
                />
              )}
            </div>
          ) : (
            <SkydoIcon />
          )}
          <div className="flex items-center gap-2">
            {!isFocusedHomeUser && campaign && (
              <Button
                type={BUTTON_TYPES.TERTIARY}
                size={BUTTON_SIZES.X_SMALL}
                nativeType="button"
                onButtonClick={() => router.push(FE_ROUTES.REFERRAL)}
                buttonClass="!h-8 !w-8 !p-0 !bg-transparent hover:!bg-transparent focus:!bg-transparent"
                buttonProps={{ "aria-label": Locale.referral }}
                title={() => (
                  <div className="overflow-hidden rounded-10px">
                    <CampaignLottiePlayer
                      campaign={campaign}
                      achievedReferralCount={achievedReferralCount}
                      width={32}
                      height={32}
                    />
                  </div>
                )}
              />
            )}
            <UserProfileCardMobile />
          </div>
        </>
      )}
    </div>
  );
};

export default MobileAuthHeader;
