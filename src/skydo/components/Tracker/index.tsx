import useUserData from "../../store/useUserData";
import {
  DOC_REQUIRED_BUSINESSES,
  DOC_UPLOAD_STATE,
  INDIVIDUAL_BUSINESSES,
  USER_STATES,
} from "../../constants/onboarding";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import GlobeIcon from "../Icons/GlobeIcon";
import React, { useEffect, useState } from "react";
import UserIcon from "../Icons/UserIcon";
import MultiUsersIcon from "../Icons/MultiUsersIcon";
import CreditCardIcon from "../Icons/CreditCardIcon";
import CompletedIcon from "../Icons/CompletedIcon";
import { getPercentWidthMap, useIsBankDetailsStateDone } from "../../util/onboardingUtil";
import FileIcon from "../Icons/FileIcon";
import TrackerStage from "./TrackerStage";
import classNames from "classnames";
import SkydoIcon from "../Icons/SkydoIcon";

interface TrackerProps {
  className: string;
}

const Tracker = (props: TrackerProps) => {
  const { userState, businessType } = useUserData();
  const percentWidthMap = getPercentWidthMap(businessType);
  const { isStateDone: isBankStepDone } = useIsBankDetailsStateDone();

  let userStateForPercentMap = userState;
  if (DOC_REQUIRED_BUSINESSES.includes(businessType)) {
    if (isBankStepDone) {
      userStateForPercentMap = DOC_UPLOAD_STATE;
    }
  }
  const [trackerPercent, changeTrackerPercent] = useState(percentWidthMap[userStateForPercentMap] || 0);

  useEffect(() => {
    setTimeout(() => {
      changeTrackerPercent(percentWidthMap[userStateForPercentMap]);
    }, 500);
  }, [userStateForPercentMap, businessType]);

  if (percentWidthMap[userStateForPercentMap] === undefined) return null;

  return (
    <div
      className={classNames(
        "h-20 bg-white md:border-b md:border-black-400 sticky top-0 md:top-12 z-[51] flex justify-center",
        props.className
      )}
    >
      <div className={"pt-2 pb-4 flex flex-row flex-1 pl-4 pr-6 md:px-[17%]"}>
        <div className={"flex-1 flex flex-row items-center"}>
          <span className={"hide_for_mob"}>
            <Typography
              text={Locale.percent.replace(":percent", String(trackerPercent || "0"))}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
            />
            <Typography text={Locale.completion} textClasses={"!text-black-500 ml-1"} />
          </span>
          <SkydoIcon className={"hide_for_desktop mr-6"} />
          <div className={"flex-1 flex flex-col md:ml-6 relative"}>
            <div className={"flex-1 rounded-10px bg-black-100 flex"}>
              <div
                className={"rounded-10px bg-green-400 h-2 ease-linear duration-500"}
                style={{ width: `${percentWidthMap[userStateForPercentMap]}%` }}
              />
            </div>
            <Typography
              text={Locale.percent.replace(":percent", String(trackerPercent))}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"hide_for_desktop mt-2"}
            />
            <TrackerStage forState={USER_STATES.COMPANY_PAN_DETAILS} Icon={GlobeIcon} />
            <TrackerStage forState={USER_STATES.UBO_PAN_DETAILS} Icon={UserIcon} />
            {INDIVIDUAL_BUSINESSES.includes(businessType) ? null : (
              <TrackerStage forState={USER_STATES.COMPANY_MANAGEMENT_DETAILS} Icon={MultiUsersIcon} />
            )}
            <TrackerStage forState={USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS} Icon={CreditCardIcon} />
            {DOC_REQUIRED_BUSINESSES.includes(businessType) && (
              <TrackerStage forState={DOC_UPLOAD_STATE} Icon={FileIcon} />
            )}
            <TrackerStage
              trackerClass={"hide_for_desktop"}
              forState={USER_STATES.MANUAL_VERIFICATION}
              Icon={CompletedIcon}
            />
          </div>
          <div className={"ml-4 hide_for_mob"}>
            <CompletedIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
