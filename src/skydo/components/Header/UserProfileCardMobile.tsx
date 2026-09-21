import MobileHeaderProfile from "../Icons/MobileHome/MobileHeaderProfile";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import AuthHelper from "../../authentication/AuthHelper";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import LogoutIcon from "../Icons/LogoutIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classNames from "classnames";
import RightArrowIcon from "../Icons/RightArrowIcon";
import { useRouter } from "next/router";
import FE_ROUTES from "../../util/feRoutes";
import useReferralStore from "../../store/useReferralStore";
import useUserData from "../../store/useUserData";
import { isUserKYCed } from "../../util/functions";
import AppContext from "../../context/AppContext";
import { getReferralType } from "../Referral/ReferralUtil";

const UserProfileCardMobile = () => {
  const [isProfileVisible, setProfileVisible] = useState(false);
  const analytics = useAnalytics();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  const onLogoutClick = async () => {
    try {
      await AuthHelper.logout();
    } finally {
      setProfileVisible(false);
      analytics?.trackAsync(Events.LOGOUT_CLICK);
    }
  };

  const onUserCLick = () => {
    setProfileVisible(!isProfileVisible);
    analytics?.trackAsync(Events.HEADER_USER_PROFILE_CLICK, {
      open: !isProfileVisible,
    });
  };

  function onBodyClick(event: any) {
    const target = event.target as HTMLInputElement;
    if (userRef?.current?.contains(target)) return;
    if (!profileRef?.current?.contains(target)) setProfileVisible(false);
  }

  useEffect(() => {
    document.addEventListener("click", onBodyClick);
    return () => document.removeEventListener("click", onBodyClick);
  }, []);

  const renderProfileSection = () => (
    <div
      ref={profileRef}
      className="absolute bg-white flex flex-col rounded-10px w-[279px] shadow-elevation1 mt-[52px] top-0 right-0 overflow-hidden pt-2"
    >
      <div
        className={classNames("cursor-pointer flex flex-row px-4 py-4 hover:bg-blue-50 items-center")}
        onClick={onLogoutClick}
      >
        <LogoutIcon />
        <Typography
          text={Locale.logout}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses="ml-2.5"
        />
      </div>
    </div>
  );

  return (
    <div>
      <div ref={userRef} className="flex_row_item_center cursor-pointer" onClick={onUserCLick}>
        <MobileHeaderProfile />
      </div>
      {isProfileVisible ? renderProfileSection() : null}
    </div>
  );
};

export default UserProfileCardMobile;
