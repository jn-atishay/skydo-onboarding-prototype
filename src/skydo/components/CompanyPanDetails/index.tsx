import useUserData from "../../store/useUserData";
import { USER_STATES, userStateJourney } from "../../constants/onboarding";
import GlobeIcon from "../Icons/GlobeIcon";
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import FullTick from "../Icons/FullTick";
import UserStateIcon from "../Common/UserStateIcon";
import PanDetails from "./PanDetails";
import LockedState from "../Common/LockedState";
import VerticalDottedLine from "../Common/VerticalDottedLine";
import TrustMarker from "../TrustMarker";
import { getLockedStateTitles } from "../../util/functions";

const CompanyPanDetails = () => {
  const { userState, businessType } = useUserData();
  const isCurrentState = userState === USER_STATES.COMPANY_PAN_DETAILS;
  const isStateDone = userStateJourney.indexOf(USER_STATES.COMPANY_PAN_DETAILS) < userStateJourney.indexOf(userState);

  const { theme } = useContext(AppContext);

  const { postTitle, preTitle } = getLockedStateTitles(USER_STATES.COMPANY_PAN_DETAILS, businessType);

  return (
    <div className={"relative flex flex-col"}>
      <div className={"md:px-29 md:py-10 flex md:items-center md:mb-6 bg-white relative"}>
        <UserStateIcon isCurrentState={isCurrentState} isStateDone={isStateDone} containerClass={"hide_for_mob"}>
          <>
            {isStateDone ? <FullTick bgColor={theme.hexColors.white} tickColor={theme.hexColors.green[400]} /> : null}
            {isCurrentState ? <GlobeIcon /> : null}
            {!isStateDone && !isCurrentState ? <GlobeIcon stroke={theme.hexColors.black} /> : null}
          </>
        </UserStateIcon>
        {isCurrentState ? (
          <PanDetails />
        ) : (
          <div className={"hide_for_mob flex flex-row flex-1"}>
            <LockedState isStateDone={isStateDone} text={isStateDone ? postTitle : preTitle} />
          </div>
        )}
      </div>
      <div className={"hide_for_mob"}>
        <VerticalDottedLine isTopClipped={true} containerClass={"hide_for_mob"} />
        <TrustMarker isCurrentState={isCurrentState} variant={"businessDetails"} />
      </div>
    </div>
  );
};

export default CompanyPanDetails;
