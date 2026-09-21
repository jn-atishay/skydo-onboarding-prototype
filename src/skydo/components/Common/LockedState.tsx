import Typography from "../AtomicComponents/Typography";
import React from "react";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import FullTick from "../Icons/FullTick";
import Locale from "../../util/locale/en";
import LockIcon from "../Icons/LockIcon";

const LockedState = ({ isStateDone, text }: { isStateDone: boolean; text: string }) => {
  return (
    <div className={"flex-1 flex items-center justify-between"}>
      <Typography
        text={text}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"!text-black-500"}
      />
      {isStateDone ? (
        <div className={"flex flex-row items-center"}>
          <FullTick />
          <Typography
            text={Locale.verified}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.LARGE}
            textClasses={"!text-green-400 ml-1"}
          />
        </div>
      ) : (
        <div className={"p-2 bg-black-100 rounded-full"}>
          <LockIcon />
        </div>
      )}
    </div>
  );
};

export default LockedState;
