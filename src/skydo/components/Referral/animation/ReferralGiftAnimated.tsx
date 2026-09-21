import { FC } from "react";
import dynamic from "next/dynamic";

const AnimationLoader = dynamic(() => import("../../Common/AnimationLoader"), { ssr: false });

export interface Props {
  width?: string;
  height?: string;
  stroke?: string;
  animation?: boolean;
  className?: string;
}

const ReferralGiftAnimated: FC<Props> = (props: Props) => {
  const { width = "40px", height = "40px", animation = true, className = "" } = props;

  return (
    <AnimationLoader
      src={"/skydo_referral.json"}
      width={width}
      height={height}
      animation={animation}
      loop={1}
      className={className}
    />
  );
};

export default ReferralGiftAnimated;
