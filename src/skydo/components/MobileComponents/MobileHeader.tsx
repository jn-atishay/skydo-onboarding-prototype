/**
 * @author Raj Sheth
 * created: 24/01/24
 */

import React, { FC } from "react";
import SkydoFullIcon from "../Icons/SkydoFullIcon";
import RightArrow from "../Icons/RightArrow";
import classNames from "classnames";

export interface MobHeaderProps {
  isBackButtonVisible?: boolean;
  onBackClick?: () => void;
  isReferralFlow?: boolean;
}

const MobileHeader: FC<MobHeaderProps> = (props) => {
  const { isBackButtonVisible, onBackClick, isReferralFlow } = props;

  return (
    <div className="sticky top-0 z-10 bg-white md:hidden">
      <div className={classNames("flex items-center py-4", isReferralFlow ? "px-5" : "justify-between")}>
        {isBackButtonVisible && (
          <div onClick={onBackClick} className={"cursor-pointer ml-4 w-[30px] h-[30px] z-1"}>
            <RightArrow />
          </div>
        )}
        <div
          className={classNames("flex-grow flex", isReferralFlow ? "justify-start" : "justify-center", {
            "-ml-[46px]": isBackButtonVisible && !isReferralFlow,
          })}
        >
          <SkydoFullIcon
            height={isReferralFlow ? 20 : 32}
            width={isReferralFlow ? 70 : 112}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
