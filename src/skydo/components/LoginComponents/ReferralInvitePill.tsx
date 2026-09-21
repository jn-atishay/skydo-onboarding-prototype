import classnames from "classnames";
import Typography from "../AtomicComponents/Typography";
import CheckBadgeIcon from "../Icons/CheckBadgeIcon";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";

interface Props {
  exporterName?: string;
  hasFetched: boolean;
  className?: string;
}

const ReferralInvitePill = ({ exporterName, hasFetched, className }: Props) => (
  <div className={classnames("bg-blue-50 flex items-center gap-2 rounded-full py-1 pl-1.5 pr-2 w-fit", className)}>
    <CheckBadgeIcon />
    {hasFetched ? (
      <Typography
        text={exporterName ? `${exporterName}${Locale.invitedYouToSkydo}` : Locale.youWereInvitedToSkydo}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"!text-navyblue-500"}
      />
    ) : (
      <span className={"inline-block animate-pulse rounded-10px bg-black-100 h-4 w-36"} />
    )}
  </div>
);

export default ReferralInvitePill;
