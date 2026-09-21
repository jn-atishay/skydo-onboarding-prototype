import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import FullTick from "../Icons/FullTick";

const NpsThankYou = () => {
  return (
    <div className={"flex flex-row space-x-4"}>
      <FullTick />
      <Typography
        text={"Thank you for sharing your feedback!"}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        fontWeight={"700"}
      />
    </div>
  );
};

export default NpsThankYou;
