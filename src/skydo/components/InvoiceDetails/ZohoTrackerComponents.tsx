import FullTick from "../Icons/FullTick";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";

export const getMarkedAsPaidZoho = () => {
  return (
    <div className={"flex flex-row ml-8 mt-1"}>
      <FullTick fill={"none"} tickColor={"green"} bgColor={"none"} />
      <Typography
        text={Locale.zohoSync.markedAsPaid}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.SMALL}
        fontWeight={"400"}
      />
    </div>
  );
};

export const getFiraUploadedToZoho = () => {
  return (
    <div className={"flex flex-row items-center md:ml-8 ml-6 mt-1"}>
      <FullTick fill={"none"} tickColor={"green"} bgColor={"none"} />
      <Typography
        text={Locale.zohoSync.firaUploaded}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.SMALL}
        fontWeight={"400"}
      />
    </div>
  );
};
