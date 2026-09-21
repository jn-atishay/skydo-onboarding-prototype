import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import ZeroFxBadgeIcon from "../Icons/ZeroFxBadgeIcon";
import InstantFiraBadgeIcon from "../Icons/InstantFiraBadgeIcon";
import RbiApprovedBadgeIcon from "../Icons/RbiApprovedBadgeIcon";

const SkydoBenefits = () => (
  <div className={"flex items-center gap-8 mt-10"}>
    <div className={"flex items-center gap-3"}>
      <ZeroFxBadgeIcon />
      <Typography text={Locale.referralZeroFxMarkup} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} />
    </div>
    <div className={"flex items-center gap-3"}>
      <InstantFiraBadgeIcon />
      <Typography text={Locale.referralInstantFira} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} />
    </div>
    <div className={"flex items-center gap-3"}>
      <RbiApprovedBadgeIcon />
      <Typography text={Locale.referralRbiApproved} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} />
    </div>
  </div>
);

export default SkydoBenefits;
