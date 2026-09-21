/**
 * @author Raj Sheth
 * created: 21/03/24
 */

import React, { FC } from "react";
import ReferralGiftAnimated from "../Referral/animation/ReferralGiftAnimated";
import classnames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import FE_ROUTES from "../../util/feRoutes";
import { useRouter } from "next/router";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";

interface Props {
  containerClasses?: string;
  text: string;
}

const WaiveSkydoFeeNote: FC<Props> = (props) => {
  const { containerClasses, text } = props;
  const analytics = useAnalytics();
  const router = useRouter();
  const navigateToReferral = () => {
    analytics.trackAsync(Events.REFERRAL_PAYMENT_TRACKER_NUDGE_CLICKED);
    void router.push(FE_ROUTES.REFERRAL);
  };
  return (
    <div
      className={classnames(
        "inline-flex flex-row items-center h-5 bg-blue-50 rounded-40px space-x-1 px-2 cursor-pointer hover:bg-blue-100",
        containerClasses
      )}
      onClick={navigateToReferral}
    >
      <div>
        <ReferralGiftAnimated height={"16px"} width={"16px"} animation={false} />
      </div>
      <div className={"flex flex-1 flex-row items-center"}>
        <Typography text={Locale.wantToWaveSkydoFee} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
    </div>
  );
};

export default WaiveSkydoFeeNote;
