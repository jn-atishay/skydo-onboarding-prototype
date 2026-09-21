import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Image from "next/image";

const TrustPartners = () => (
  <div className={"bg-white shadow-tooltip rounded flex items-center justify-between gap-6 px-4 py-3 w-full mt-10]"}>
    <div className={"flex flex-col shrink-0"}>
      <Typography text={Locale.referralTrustedBy} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_X_SMALL} textClasses={"!text-black-500"} />
      <Typography text={Locale.referralLeadingPartners} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-600"} />
    </div>
    <div className={"h-8 w-px bg-black-300 shrink-0"} />
    <div className={"flex items-center gap-6"}>
      <div className={"flex items-center gap-2"}>
        <div className={"relative h-4 w-4 shrink-0"}>
          <Image layout={"fill"} src={"/rbi-colored.svg"} alt={"RBI"} />
        </div>
        <Typography text={Locale.referralRbiPaCbAuthorized} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
      <div className={"relative h-3 w-9 shrink-0"}>
        <Image layout={"fill"} src={"/visa.svg"} alt={"VISA"} />
      </div>
      <div className={"flex items-center gap-2"}>
        <div className={"relative h-4 w-4 shrink-0"}>
          <Image layout={"fill"} src={"/iso-colored.svg"} alt={"ISO"} />
        </div>
        <Typography text={Locale.isoCertified} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
      <div className={"relative h-3 w-16 shrink-0"}>
        <Image layout={"fill"} src={"/hdfc.svg"} alt={"HDFC Bank"} />
      </div>
    </div>
  </div>
);

export default TrustPartners;
