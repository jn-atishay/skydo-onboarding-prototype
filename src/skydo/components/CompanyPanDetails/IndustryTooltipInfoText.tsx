//Jun 2024

import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Dot from "../Common/Dot";

const IndustryTooltipInfoText = () => {
  return (
    <div className={"flex flex-col"}>
      <Typography
        text={Locale.asMuchDetailsAsYouCan}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        fontWeight={700}
        textClasses={"!text-white"}
      />
      <div className={"flex_row_item_center"}>
        <Dot containerClass={"!w-1 !h-1 !bg-white mr-1"} />
        <Typography
          text={Locale.serviceYouSell}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-white"}
        />
      </div>
      <div className={"flex_row_item_center"}>
        <Dot containerClass={"!w-1 !h-1 !bg-white  mr-1"} />
        <Typography
          text={Locale.customerYouSell}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-white"}
        />
      </div>
    </div>
  );
};

export default IndustryTooltipInfoText;
