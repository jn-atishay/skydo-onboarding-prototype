import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import UserIcon from "../Icons/UserIcon";
import Locale from "../../util/locale/en";
import LogoutIcon from "../Icons/LogoutIcon";
import { getCompanyName, getExporterUserName, getFirstCharUpperCase } from "../../util/functions";
import useUserData from "../../store/useUserData";
import FE_ROUTES, { HEADER_PROFILE_DISABLED_ROUTES } from "../../util/feRoutes";
import { useRouter } from "next/router";
import AuthHelper from "../../authentication/AuthHelper";
import DropdownArrow from "../Common/DropdownArrow";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import SkydoIcon from "../Icons/SkydoIcon";
import ProfileSectionReferralWidget from "./ProfileSectionReferralWidget";
import useReferralStore from "../../store/useReferralStore";
import Link from "next/link";

const nameInitialRenderer = (nameInitial: string, isLarge: boolean = false) => {
  if (!nameInitial) {
    return <UserIcon isWithBgXL={isLarge} isWithBg={true} />;
  }
  return (
    <div
      className={classNames(
        "flex_row_item_center justify-center rounded-full bg-navyblue-500",
        { "w-14 h-14": isLarge },
        { "w-7 h-7": !isLarge }
      )}
    >
      <Typography
        text={nameInitial}
        type={isLarge ? TYPOGRAPHY_TYPES.HEADING : TYPOGRAPHY_TYPES.LABEL}
        size={isLarge ? TYPOGRAPHY_SIZES.SMALL : TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"!text-white"}
      />
    </div>
  );
};

const UserProfileCard = () => {
  const [isProfileVisible, setProfileVisible] = useState(false);
  const { userDetailsPreKyc, isTransacting } = useUserData();
  const { userReferralData } = useReferralStore();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const analytics = useAnalytics();
  const isReferralUser = !!userReferralData?.rewardLedger?.length && userReferralData?.rewardLedger?.length !== 0;
  const isMyProfileCTAVisibleFun = (pathname: string) => !HEADER_PROFILE_DISABLED_ROUTES.includes(pathname);
  const { loggedInUserEmail, setUserDetails, fetchLoggedInUserDetails, loggedInUserDetails, setLoggerInUserDetails } =
    useUserData();
  const [isMyProfileCTAVisible, setMyProfileViewCTA] = useState<boolean>(isMyProfileCTAVisibleFun(router.pathname));

  useEffect(() => {
    if (router.pathname !== FE_ROUTES.USER_ACCESS && !loggedInUserDetails) {
      fetchLoggedInUserDetails();
    }
  }, [router.pathname, loggedInUserDetails]);

  useEffect(() => {
    if (isMyProfileCTAVisibleFun(router.pathname)) {
      setMyProfileViewCTA(true);
    } else {
      setMyProfileViewCTA(false);
    }
  }, [router.pathname]);

  const onUserCLick = () => {
    setProfileVisible(!isProfileVisible);
    analytics?.trackAsync(Events.HEADER_USER_PROFILE_CLICK, {
      open: !isProfileVisible,
      isTransacting: isTransacting,
      hasRewards: isReferralUser,
    });
  };

  const userName = getExporterUserName(loggedInUserDetails || {});
  const nameInitial = getFirstCharUpperCase(userName);
  const companyName = getCompanyName({ ...loggedInUserDetails?.exporter, defaultVal: userDetailsPreKyc?.businessName });
  const userEmail = loggedInUserDetails?.emailAddress || loggedInUserEmail || "";

  const onProfileClick = () => {
    setProfileVisible(false);
    router.push(FE_ROUTES.PROFILE);
    analytics?.trackAsync(Events.MY_PROFILE_CTA_CLICK);
  };

  const onViewPaymentsAndSkydoChargesClick = () => {
    setProfileVisible(false);
    router.push(FE_ROUTES.PAYMENTS_AND_CHARGES);
    analytics?.trackAsync(Events.VIEW_PAYMENTS_AND_SKYDO_CHARGES_CLICK);
  };

  const onReferAndEarnClicked = () => {
    setProfileVisible(false);
    analytics?.trackAsync(Events.PROFILE_CARD_REFER_AND_EARN_CLICK);
    router.push(FE_ROUTES.REFERRAL);
  };

  const onPaymentLinksClick = () => {
    setProfileVisible(false);
    analytics?.trackAsync(Events.PAYPAL.PROFILE_CARD_PAYMENTS_LINK_CLICKED);
    router.push(FE_ROUTES.PAYMENT_LINKS);
  };

  const onLogoutClick = async () => {
    try {
      await AuthHelper.logout();
      setLoggerInUserDetails({ emailAddress: "", exporter: {}, fullName: "", registeredName: "", userId: undefined });
    } finally {
      setProfileVisible(false);
      analytics?.trackAsync(Events.LOGOUT_CLICK);
    }
  };

  function onBodyClick(event: any) {
    const target = event.target as HTMLInputElement;
    if (userRef?.current?.contains(target)) {
      return;
    }
    if (!profileRef?.current?.contains(target)) {
      setProfileVisible(false);
    }
    return;
  }

  useEffect(() => {
    document.addEventListener("click", onBodyClick);
    return () => {
      document.removeEventListener("click", onBodyClick);
    };
  }, []);

  const renderProfileSection = () => {
    return (
      <div
        ref={profileRef}
        className={
          "absolute bg-white flex flex-col rounded-10px w-[279px] shadow-stateIcon mt-10 top-0 right-0 overflow-hidden"
        }
      >
        <div className={"flex-1 flex justify-center flex-col items-center py-4 text-center"}>
          {nameInitialRenderer(nameInitial, true)}
          <Typography text={userName} type={TYPOGRAPHY_TYPES.LABEL} textClasses={"mt-1"} />
          <Typography text={companyName} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"!text-black-500"} />
          <div className={classNames({ "h-1": !userName && !companyName })} />
          <Typography text={userEmail} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"!text-black-500"} />
        </div>
        {isMyProfileCTAVisible ? (
          <>
            <ProfileSectionReferralWidget
              closeProfile={() => setProfileVisible(false)}
            />
            <Link href={FE_ROUTES.PROFILE}>
              <a>
                <div
                  className={"cursor-pointer flex_row_item_center px-4 py-2.5 mb-0.5 hover:bg-blue-50 mt-4"}
                  onClick={onProfileClick}
                >
                  <UserIcon isSmall={true} />
                  <Typography
                    text={Locale.myProfile}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"ml-2.5"}
                  />
                </div>
              </a>
            </Link>
            <Link href={FE_ROUTES.PAYMENTS_AND_CHARGES}>
              <a>
                <div
                  className={"cursor-pointer flex_row_item_center px-4 py-2.5 mb-0.5 hover:bg-blue-50"}
                  onClick={onViewPaymentsAndSkydoChargesClick}
                >
                  <SkydoIcon isSmall={true} />
                  <Typography
                    text={Locale.skydoFeesAndCharges}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"ml-2.5"}
                  />
                </div>
              </a>
            </Link>
          </>
        ) : null}
        <div
          className={classNames("cursor-pointer flex_row_item_center px-4 py-2.5 mb-4 hover:bg-blue-50", {
            "mt-4": !isMyProfileCTAVisible,
          })}
          onClick={onLogoutClick}
        >
          <LogoutIcon />
          <Typography
            text={Locale.logout}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"ml-2.5"}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={"w-px bg-black-400 h-6 mx-6"} />
      <div ref={userRef} className={"flex_row_item_center cursor-pointer"} onClick={onUserCLick}>
        {nameInitialRenderer(nameInitial, false)}
        <Typography
          text={userName}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"ml-2 mr-3"}
        />
        <DropdownArrow isOpen={isProfileVisible} />
      </div>
      {isProfileVisible ? renderProfileSection() : null}
    </>
  );
};

export default UserProfileCard;
