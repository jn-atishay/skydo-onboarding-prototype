import Typography from "../AtomicComponents/Typography";
import { StraightArrows } from "../Icons/StraightArrows";
import { ArrowDirection } from "../Icons/ArrowIconSmall";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";

const SignUpButtonTitle = () => {
  return (
    <div className={"flex flex-row items-center justify-center flex-1 gap-2"}>
      <Typography
        text={Locale.signUpButton}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.LARGE}
        textClasses={"!text-white"}
      />
      <StraightArrows direction={ArrowDirection.RIGHT} stroke={"#FFFFFF"} width={20} height={20} />
    </div>
  );
};

export default SignUpButtonTitle;
