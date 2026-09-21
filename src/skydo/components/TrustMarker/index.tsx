import LockIcon from "../Icons/LockIcon";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import FullTick from "../Icons/FullTick";
import UsersIcon from "../Icons/UsersIcon";
import DollarCircleIcon from "../Icons/DollarCircleIcon";
import classNames from "classnames";

interface Props {
  containerClass?: string;
  variant?: "default" | "businessDetails";
}

export const TrustMarkerMobile = ({ containerClass = "", variant = "default" }: Props) => {
  const { theme } = useContext(AppContext);

    return (
      <div className={classNames("flex items-center gap-3 mt-5 mb-4", containerClass)}>
        <div className={"flex flex-row justify-center w-full items-center gap-3"}>
          <div className={"flex flex-row items-center"}>
            <FullTick
              tickColor={theme.hexColors.green[400]}
              bgColor={theme.hexColors.green[400]}
              fill={theme.hexColors.white}
              isSmall
            />
            <Typography
              text={Locale.referralRbiPaCbAuthorized}
              textClasses={"ml-1.5 !text-black-600"}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </div>
          <div className={"flex flex-row items-center"}>
            <UsersIcon stroke={theme.hexColors.green[400]} width={16} height={16} />
            <Typography
              text={Locale.trustedByExporters}
              textClasses={"ml-1.5 !text-black-600"}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </div>
        </div>
      </div>
    );
};

interface TrustMarkerProps {
  isCurrentState: boolean;
  variant?: "default" | "businessDetails";
}

const TrustMarker = ({ isCurrentState, variant = "default" }: TrustMarkerProps) => {
  const { theme } = useContext(AppContext);

  if (!isCurrentState) return null;

    return (
      <div className={"flex flex-row w-full items-center justify-center h-14 bg-black-100 -my-6 mb-6 space-x-16"}>
        <div className={"flex flex-row items-center"}>
          <FullTick
            tickColor={theme.hexColors.green[400]}
            bgColor={theme.hexColors.green[400]}
            fill={theme.hexColors.black[100]}
          />
          <Typography
            text={Locale.referralRbiPaCbAuthorized}
            textClasses={"ml-2 !text-black-600"}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
        </div>
        <div className={"flex flex-row items-center"}>
          <UsersIcon stroke={theme.hexColors.green[400]} />
          <Typography
            text={Locale.trustedByExporters}
            textClasses={"ml-2 !text-black-600"}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
        </div>
        <div className={"flex flex-row items-center"}>
          <DollarCircleIcon stroke={theme.hexColors.green[400]} />
          <Typography
            text={Locale.processedAmount}
            textClasses={"ml-2 !text-black-600"}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
        </div>
      </div>
    );
};

export default TrustMarker;
