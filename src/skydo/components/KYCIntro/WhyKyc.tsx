import WhyKycIcon from "../Icons/WhyKycIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import FullTick from "../Icons/FullTick";

const WhyKyc = () => {
  return (
    <div className={"flex flex-col bg-black-50 rounded-20px flex-1 px-13 py-8"}>
      <WhyKycIcon />
      <Typography
        text={Locale.whyKycHeader}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"mt-8 mb-6"}
      />
      <div className={"flex items-start mb-6"}>
        <FullTick />
        <Typography
          text={Locale.rbiGuideline}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"ml-4 flex-1"}
        />
      </div>
      <div className={"flex items-start"}>
        <FullTick />
        <Typography
          text={Locale.ccRequirement}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"ml-4 flex-1"}
        />
      </div>
    </div>
  );
};

export default WhyKyc;
