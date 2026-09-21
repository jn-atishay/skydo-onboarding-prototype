/**
 * @author Raj Sheth
 * created: 06/12/23
 */

import React, { FC, useContext } from "react";
import AppContext from "../../context/AppContext";
import { getPercentWidthMap, useIsUserStateDone } from "../../util/onboardingUtil";
import useUserData from "../../store/useUserData";
import classNames from "classnames";

interface Props {
  trackerClass?: string;
  forState: string;
  Icon: React.ComponentType<{
    width?: number;
    height?: number;
    stroke: string;
    containerClass?: string;
  }>;
}

const TrackerStage: FC<Props> = (props) => {
  const { theme } = useContext(AppContext);
  const { businessType } = useUserData();

  const { Icon, forState, trackerClass } = props;
  const percentWidthMap = getPercentWidthMap(businessType);
  const leftPercent = percentWidthMap[props.forState];
  const isDone = useIsUserStateDone(forState);

  return (
    <div
      className={classNames("flex flex-col absolute items-start", trackerClass)}
      style={{ marginLeft: `${leftPercent}%` }}
    >
      <div className={"w-0.5 h-2 bg-black-700 opacity-20 -translate-x-full"}></div>
      <div className={"-translate-x-1/2 mt-2"}>
        <Icon
          stroke={isDone ? (theme.hexColors.black[700] as string) : (theme.hexColors.black[400] as string)}
          containerClass={"h-[14px] w-[14px] md:h-[24px] md:w-[24px]"}
        />
      </div>
    </div>
  );
};

export default TrackerStage;
