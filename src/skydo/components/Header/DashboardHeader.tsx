import React, {useCallback} from "react";
import {useRouter} from "next/router";
import FE_ROUTES, {HEADER_ENABLED_PUBLIC_ROUTES} from "../../util/feRoutes";
import Help from "./Help";
import UserProfileCard from "./UserProfileCard";
import useAnalytics from "../../analytics/useAnalytics";
import {Events} from "../../analytics/EventConstants";
import useThrottle from "../../util/customHooks/useThrottle";
import useUserData from "../../store/useUserData";
import {isDashboardAccessible, openUrlWithoutSharingSession, shouldRedirectToMobileInput} from "../../util/functions";
import {USER_STATES} from "../../constants/onboarding";
import SkydoFullIcon from "../Icons/SkydoFullIcon";
import BankHolidayListButton from "./BankHolidayListButton";
import WhatsNewButton from "./WhatsNewButton";
import Button from "../AtomicComponents/Button";
import Locale from "../../util/locale/en";
import {BUTTON_SIZES, BUTTON_TYPES} from "../../constants/atomicConstants";
import classnames from "classnames";
import MobileAuthHeader from "./MobileAuthHeader";


//only client side rendering
const DashboardHeader = () => {
  const router = useRouter();
  const analytics = useAnalytics();
  const { userState, phoneNumber } = useUserData();
  const isDashboardAccess = isDashboardAccessible(userState);

  const onLogoClick = useCallback(() => {
    const routeToRedirect = isDashboardAccess
      ? FE_ROUTES.DASHBOARD
      : userState && userState !== USER_STATES.NO_STATE
      ? FE_ROUTES.INSTANT_ONBOARDING
      : FE_ROUTES.HOME;

    if (routeToRedirect === router.pathname) {
      return;
    }
    void router.push(routeToRedirect);
  }, [router.pathname, isDashboardAccess, userState]);

  const throttledOnLogoClick = useThrottle(onLogoClick, 1000);

  const onIconClick = () => {
    throttledOnLogoClick();
    analytics?.trackAsync(Events.HEADER_SKYDO_ICON_CLICK);
  };

  if (router.pathname === FE_ROUTES.INSTANT_ONBOARDING && shouldRedirectToMobileInput(userState, phoneNumber)) {
    return null;
  }

  const isUserCardVisible = () => {
    return !HEADER_ENABLED_PUBLIC_ROUTES.includes(router.pathname);
  };

  const isPublicRouteWithHeader = HEADER_ENABLED_PUBLIC_ROUTES.includes(router.pathname);

  return (
    <>
      <div
        className={classnames(
          "z-[52] bg-white items-center justify-between h-headerHeight fixed top-0 left-0 right-0 border-b border-black-400 px-6 hidden md:flex",
        )}
      >
        <div className={"cursor-pointer flex flex-row items-center"} onClick={onIconClick}>
          <SkydoFullIcon />
        </div>
        <div className={"flex_row_item_center relative"}>
          <Help />
          {isDashboardAccess && !isPublicRouteWithHeader && (
            <>
              <div className={"mr-6"}>
                <BankHolidayListButton />
              </div>
              <WhatsNewButton />
            </>
          )}

          {isUserCardVisible() && <UserProfileCard />}
          {isPublicRouteWithHeader && (
            <div className={"flex flex-row items-center"}>
              <div className={"w-px bg-black-400 h-6 mx-6"} />
              <Button
                title={Locale.login}
                size={BUTTON_SIZES.SMALL}
                type={BUTTON_TYPES.SECONDARY}
                onButtonClick={() => openUrlWithoutSharingSession(FE_ROUTES.LOGIN + `?utm_tracker=${router.pathname}`)}
                buttonClass={"!h-8"}
              />
            </div>
          )}
        </div>
      </div>

      <MobileAuthHeader/>
    </>
  );
};

export default DashboardHeader;
