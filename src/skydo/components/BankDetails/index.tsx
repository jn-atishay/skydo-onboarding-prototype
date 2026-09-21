import useUserData from "../../store/useUserData";
import { USER_STATES } from "../../constants/onboarding";
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import UserStateIcon from "../Common/UserStateIcon";
import FullTick from "../Icons/FullTick";
import LockedState from "../Common/LockedState";
import VerticalDottedLine from "../Common/VerticalDottedLine";
import CreditCardIcon from "../Icons/CreditCardIcon";
import BankDetailsForm from "./BankDetailsForm";
import TrustMarker from "../TrustMarker";
import { getLockedStateTitles } from "../../util/functions";
import { useIsBankDetailsStateDone } from "../../util/onboardingUtil";
import classNames from "classnames";

const BankDetails = () => {
  const {
    businessType,
    docUploadProps,
  } = useUserData();
  const { isCurrentState, isStateDone } = useIsBankDetailsStateDone();

  const { theme } = useContext(AppContext);

  const { preTitle, postTitle } = getLockedStateTitles(USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS, businessType);

  return (
    <div
      className={classNames("relative flex flex-col", {
        hide_for_mob: !isCurrentState,
      })}
    >
      <div className={"flex-1 md:px-29 md:py-10 flex items-center bg-white md:my-6 relative"}>
        <UserStateIcon isCurrentState={isCurrentState} isStateDone={isStateDone} containerClass={"hide_for_mob"}>
          <>
            {isStateDone ? <FullTick bgColor={theme.hexColors.white} tickColor={theme.hexColors.green[400]} /> : null}
            {isCurrentState ? <CreditCardIcon stroke={theme.hexColors.white} /> : null}
            {!isStateDone && !isCurrentState ? <CreditCardIcon /> : null}
          </>
        </UserStateIcon>
        {isCurrentState ? (
          <BankDetailsForm />
        ) : (
          <LockedState isStateDone={isStateDone} text={isStateDone ? postTitle : preTitle} />
        )}
      </div>
      {/* bottom clipped = false when isSectionVisible is true */}
      <div className={"hide_for_mob"}>
        <VerticalDottedLine isBottomClipped={!docUploadProps.isSectionVisible} />
        <TrustMarker isCurrentState={isCurrentState} />
      </div>
    </div>
  );
};

export default BankDetails;
