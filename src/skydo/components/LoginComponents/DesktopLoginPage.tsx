import useReferralStore from "../../store/useReferralStore";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useAnalytics, { Analytics } from "../../analytics/useAnalytics";
import useUserData from "../../store/useUserData";
import { USER_STATES } from "../../constants/onboarding";
import FE_ROUTES from "../../util/feRoutes";
import { isDashboardAccessible } from "../../util/functions";
import { LoginResponseDto } from "../../authentication/api/AuthApiDto";
import EmailLoginFlow from "../Common/EmailLoginFlow";
import LoginFooter, { BackgroundImage } from "./LoginFooter";
import SkydoLogoBig from "../Icons/SkydoLogoBig";
import ToastMessages from "../AtomicComponents/ToastMessages";
import classnames from "classnames";
import useLoginStore from "../../store/useLoginStore";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMediaQuery } from "../../util/useMediaQuery";

const ReferralLoginLeftSection = dynamic(() => import("../ReferralLoginLeftSection"), { ssr: false });

interface DesktopLoginPageProps {
  authenticated: boolean;
  className?: string;
  preFilledEmail?: string;
  isEmailDisabled?: boolean;
  platformName?: string;
  isReferred?: boolean;
}

const DesktopLoginPage = ({
  authenticated,
  className,
  preFilledEmail,
  isEmailDisabled,
  platformName,
  isReferred: initialIsReferred,
}: DesktopLoginPageProps) => {
  const { fetchReferrerDataViaCode } = useReferralStore();
  const isReferred = !!initialIsReferred;
  const router = useRouter();
  const loginStore = useLoginStore();

  const analytics = useAnalytics((analytics: Analytics) => {
    analytics?.page(router.asPath);
  });
  const { userState, phoneNumber } = useUserData();

  // This component stays mounted (CSS-hidden) on mobile too, since the mobile/desktop
  // split below is purely visual (`hidden md:!block`). Unlike the background image below,
  // ReferralLoginLeftSection's dynamic import fires on mount regardless of CSS visibility,
  // so isDesktopViewport is the only thing stopping that chunk from loading on mobile.
  const isDesktopViewport = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    fetchReferrerDataViaCode();
  }, []);

  /**
   * IMPORTANT; only use this for redirection after authentication is successful
   */

  const getRedirectionUrl = (userState: string, phoneNumber: string): string => {
    // p0 preference -- if user state is SIGN_UP_SUCCESS and there is no mobile number send him to onboarding screen collect phone number and then redirect to other places
    // 1st preference redirection url in the query param
    // 2nd preference url generation from the onboarding state
    console.log("router is : ",router)
    if(router.asPath.includes(FE_ROUTES.PAYOUT_BENEFICIARY_LINKING)){
      return decodeURI(router.query.redirect as string);
    }
    if (userState === USER_STATES.SIGN_UP_SUCCESS && !phoneNumber) {
      return (
        FE_ROUTES.INSTANT_ONBOARDING +
        (router.query.redirect ? `?redirect=${encodeURIComponent(router.query.redirect as string)}` : "")
      );
    }

    if (router.query.redirect) {
      return decodeURI(router.query.redirect as string);
    }
    if (isDashboardAccessible(userState as string)) {
      return FE_ROUTES.DASHBOARD;
    } else if (userState && userState !== USER_STATES.NO_STATE) {
      return FE_ROUTES.INSTANT_ONBOARDING;
    }
    return FE_ROUTES.HOME;
  };

  useEffect(() => {
    if (authenticated) {
      (async () => {
        console.log("Calling this")
        await router.push(getRedirectionUrl(userState, phoneNumber));
      })();
    }
  }, [authenticated, userState]);

  const register = async (authResponse: LoginResponseDto) => {
    await loginStore.register(authResponse, analytics);
  };

  const renderRightSection = () => {
    return (
      <div>
        <EmailLoginFlow
          register={register}
          preFilledEmail={preFilledEmail}
          isEmailDisabled={isEmailDisabled}
          platformName={platformName}
          isReferred={isReferred}
        />
        <LoginFooter />
      </div>
    );
  };

  const renderMainContent = () => {
    return (
      <div className={"flex items-center justify-center"}>
        {!isReferred && (
          <div className={"pr-40"}>
            <SkydoLogoBig />
          </div>
        )}
        {renderRightSection()}
      </div>
    );
  };

  return isReferred ? (
    <div className={"flex flex-1 items-center h-full"}>
      <div className={"relative overflow-hidden basis-1/2 flex items-center justify-center h-full"}>
        <Image src={"/bg-image-referral-login.png"} layout={"fill"} objectFit={"cover"} className={"-z-1"} alt={""} />
        {isDesktopViewport && <ReferralLoginLeftSection />}
      </div>
      <div className={"basis-1/2 bg-white flex items-center justify-center h-full"}>
        {renderMainContent()}
        <ToastMessages />
      </div>
    </div>
  ) : (
    <div className={classnames("page py-12 h-full", className)}>
      <BackgroundImage />
      <div className={"flex items-center"}>
        {renderMainContent()}
        <ToastMessages />
      </div>
    </div>
  );
};

export default DesktopLoginPage;
