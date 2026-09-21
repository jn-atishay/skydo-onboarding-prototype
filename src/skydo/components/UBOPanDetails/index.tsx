import useUserData from "../../store/useUserData";
import { USER_STATES, userStateJourney } from "../../constants/onboarding";
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import UserStateIcon from "../Common/UserStateIcon";
import FullTick from "../Icons/FullTick";
import LockedState from "../Common/LockedState";
import VerticalDottedLine from "../Common/VerticalDottedLine";
import UserIcon from "../Icons/UserIcon";
import TrustMarker from "../TrustMarker";
import { getLockedStateTitles } from "../../util/functions";
import UBODetailsVKyc from "./UBODetailsVKyc";
import classNames from "classnames";

const UBOPanDetails = () => {
  const { userState, businessType } = useUserData();
  const isCurrentState = userState === USER_STATES.UBO_PAN_DETAILS;
  const isStateDone = userStateJourney.indexOf(USER_STATES.UBO_PAN_DETAILS) < userStateJourney.indexOf(userState);
  const { theme } = useContext(AppContext);

  const { preTitle, postTitle } = getLockedStateTitles(USER_STATES.UBO_PAN_DETAILS, businessType);

  return (
    <>
      <div
        className={classNames("relative flex flex-col", {
          hide_for_mob: !isCurrentState,
        })}
      >
        <div className={"flex-1 md:px-29 md:py-10 flex items-center bg-white md:my-6 relative"}>
          <UserStateIcon isCurrentState={isCurrentState} isStateDone={isStateDone} containerClass={"hide_for_mob"}>
            <>
              {isStateDone ? <FullTick bgColor={theme.hexColors.white} tickColor={theme.hexColors.green[400]} /> : null}
              {isCurrentState ? <UserIcon stroke={theme.hexColors.white} /> : null}
              {!isStateDone && !isCurrentState ? <UserIcon /> : null}
            </>
          </UserStateIcon>
          {isCurrentState ? (
            <UBODetailsVKyc />
          ) : (
            <LockedState isStateDone={isStateDone} text={isStateDone ? postTitle : preTitle} />
          )}
        </div>
        <div className={"hide_for_mob"}>
          <VerticalDottedLine />
          <TrustMarker isCurrentState={isCurrentState} />
        </div>
      </div>
    </>
  );
};

export default UBOPanDetails;
