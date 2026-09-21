//Sep 2023

import USFlagIcon from "../Icons/CountryFlags/USFlagIcon";
import UKFlagIcon from "../Icons/CountryFlags/UKFlagIcon";
import CanadaFlagIcon from "../Icons/CountryFlags/CanadaFlagIcon";
import EuropeFlagIcon from "../Icons/CountryFlags/EuropeFlagIcon";
import ROWFlagIcon from "../Icons/CountryFlags/ROWFlagIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import { redirectClientToOnboarding } from "../../util/preKycDashboardUtils";
import { useRouter } from "next/router";

const PreKycHeader = () => {
  const router = useRouter();
  return (
    <div className={"flex_row_item_center justify-center"}>
      <div className={"flex_row_item_center gap-1"}>
        <USFlagIcon isFx={true} />
        <UKFlagIcon />
        <CanadaFlagIcon />
        <EuropeFlagIcon />
        <ROWFlagIcon />
      </div>
      <Typography
        text={Locale.fiveMinAccount}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        textClasses={"mx-4"}
      />
      <Button
        title={Locale.completeKyc}
        size={BUTTON_SIZES.SMALL}
        onButtonClick={() => redirectClientToOnboarding(router)}
      />
    </div>
  );
};

export default PreKycHeader;
