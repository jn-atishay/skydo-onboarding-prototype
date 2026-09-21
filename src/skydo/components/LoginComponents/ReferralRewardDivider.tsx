import classnames from "classnames";
import Typography from "../AtomicComponents/Typography";
import SparkleIcon from "../Icons/SparkleIcon";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";

interface Props {
  earnedRewardQty?: number;
  className?: string;
  textSize?: string;
  fontWeight?: string | number;
}

const ReferralRewardDivider = ({ earnedRewardQty, className, textSize = TYPOGRAPHY_SIZES.SMALL, fontWeight }: Props) => {
  return (
    <div className={classnames("flex items-center gap-3 w-full", className)}>
      <div className={"h-px flex-1 bg-black-300"} />
      <div className={"flex items-center gap-1.5 shrink-0"}>
        {earnedRewardQty === undefined ? (
          <div className={"animate-pulse rounded-10px bg-black-100 h-4 w-32"} />
        ) : (
          <>
            <SparkleIcon />
            <Typography
              text={Locale.referralRewardWaiting.replace("${rewardValue}", String(earnedRewardQty))}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={textSize}
              textClasses={"!text-green-400"}
              fontWeight={fontWeight}
            />
          </>
        )}
      </div>
      <div className={"h-px flex-1 bg-black-300"} />
    </div>
  );
};

export default ReferralRewardDivider;
