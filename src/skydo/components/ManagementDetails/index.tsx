import useUserData from "../../store/useUserData";
import { BUSSINESS_TYPES, INDIVIDUAL_BUSINESSES, USER_STATES, userStateJourney } from "../../constants/onboarding";
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import UserStateIcon from "../Common/UserStateIcon";
import FullTick from "../Icons/FullTick";
import LockedState from "../Common/LockedState";
import VerticalDottedLine from "../Common/VerticalDottedLine";
import MultiUsersIcon from "../Icons/MultiUsersIcon";
import ManagementDetailsForm from "./ManagementDetailsForm";
import TrustMarker from "../TrustMarker";
import { getLockedStateTitles } from "../../util/functions";
import SeniorManagementDetailsForm from "./SeniorManagementDetailsForm";
import classNames from "classnames";
import HufManagementDetailsForm from "./HufManagementDetailsForm";

const ManagementDetails = () => {
  const { userState, businessType } = useUserData();
  const isCurrentState = userState === USER_STATES.COMPANY_MANAGEMENT_DETAILS;
  const isStateDone =
    userStateJourney.indexOf(USER_STATES.COMPANY_MANAGEMENT_DETAILS) < userStateJourney.indexOf(userState);

  const { theme } = useContext(AppContext);
  const { preTitle, postTitle } = getLockedStateTitles(USER_STATES.COMPANY_MANAGEMENT_DETAILS, businessType);
  const isIndividualBusiness = INDIVIDUAL_BUSINESSES.includes(businessType);

  const renderManagementForm = () => {
    if (businessType === BUSSINESS_TYPES.PRIVATE_LIMITED_COMPANY || businessType == BUSSINESS_TYPES.LLP) {
      return <SeniorManagementDetailsForm />;
    } else if (businessType == BUSSINESS_TYPES.PARTNERSHIP) {
      return <ManagementDetailsForm />;
    } else if (businessType == BUSSINESS_TYPES.HUF) {
      return <HufManagementDetailsForm />;
    }
  };

  return isIndividualBusiness ? null : (
    <div
      className={classNames("relative flex flex-col", {
        hide_for_mob: !isCurrentState,
      })}
    >
      <div className={"flex-1 md:px-29 md:py-10 flex items-center bg-white md:mt-6 relative mb-[150px] md:mb-6"}>
        <UserStateIcon isCurrentState={isCurrentState} isStateDone={isStateDone} containerClass={"hide_for_mob"}>
          <>
            {isStateDone ? <FullTick bgColor={theme.hexColors.white} tickColor={theme.hexColors.green[400]} /> : null}
            {isCurrentState ? <MultiUsersIcon stroke={theme.hexColors.white} /> : null}
            {!isStateDone && !isCurrentState ? <MultiUsersIcon /> : null}
          </>
        </UserStateIcon>
        {isCurrentState ? (
          renderManagementForm()
        ) : (
          <LockedState isStateDone={isStateDone} text={isStateDone ? postTitle : preTitle} />
        )}
      </div>
      <div className={"hide_for_mob"}>
        <TrustMarker isCurrentState={isCurrentState} />
        <VerticalDottedLine />
      </div>
    </div>
  );
};

export default ManagementDetails;
