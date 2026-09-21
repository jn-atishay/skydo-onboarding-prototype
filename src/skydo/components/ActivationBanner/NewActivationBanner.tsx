import Card from "../Common/Card";
import useBannersStore from "../../store/useBannersStore";
import MoneyWallet from "../Icons/MoneyWallet";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { formatDate } from "../../util/formatters";
import Triangle from "../Triangle";
import React, { useEffect } from "react";
import TextCTA from "../AtomicComponents/TextCTA";

const NewActivationBanner = () => {
  const { bannerData, fetchTnc, tncFileUrl } = useBannersStore();

  useEffect(() => {
    fetchTnc();
  }, []);

  const rewardEligibilityDetails = bannerData?.["ACTIVATION_EXP"];
  const expiryDate = rewardEligibilityDetails?.expiryDate ? formatDate(rewardEligibilityDetails.expiryDate) : "";
  return (
    <Card className={"!p-0 flex flex-col relative"}>
      <div className={"bg-green-500 flex flex-row items-center h-9 absolute -right-6 top-0"}>
        <Triangle isLarge={true} containerClass={"rotate-90 mr-3 -ml-2.5"} />
        <Typography
          text={expiryDate ? Locale.welcomeMonthRewardWDate.replace(":date", expiryDate) : Locale.welcomeMonthReward}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          fontWeight={700}
          textClasses={"!text-white mr-8"}
        />
      </div>
      <MoneyWallet className={"mb-4"} />
      <Typography
        text={Locale.allPayments}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.SMALL}
        fontWeight={700}
        textClasses={"!text-green-400"}
      >
        <Typography
          text={Locale.inYourFirstMonth}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={700}
          textClasses={"!ml-1"}
        />
      </Typography>
      <span className={"flex flex-row"}>
        <Typography
          text={
            expiryDate ? Locale.firstMonthFreeSubtextWDate.replace(":date", expiryDate) : Locale.firstMonthFreeSubtext
          }
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.LARGE}
          fontWeight={600}
          textClasses={"!text-black-600 mr-1"}
        />
        <TextCTA
          text={Locale.learnMore}
          typographyType={TYPOGRAPHY_TYPES.LABEL}
          typographySize={TYPOGRAPHY_SIZES.LARGE}
          onClick={() => {
            if (tncFileUrl) {
              window.open(tncFileUrl, "_blank");
            }
          }}
        />
      </span>
    </Card>
  );
};

export default NewActivationBanner;
