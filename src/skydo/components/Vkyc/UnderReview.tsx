/**
 * @author Raj Sheth
 * created: 06/03/24
 */

import React, { FC, useContext } from "react";
import DocuSearchIcon from "../Icons/DocuSearchIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import ThankYouPageForMobile from "../LoginComponents/MobileComponents/ThankYouPageForMobile";
import InstructionsAndFxCalculator from "../DashboardContainer/InstructionsAndFxCalculator";
import useUserData from "../../store/useUserData";
import { isManualCheckPending } from "../../util/functions";
import { UserDetailsContext } from "../DashboardContainer";
import { isOldUser } from "../../util/vkycUtils";
import classNames from "classnames";

interface Props {}

export const UnderReviewBanner = () => {
  const { exporterDetails } = useContext(UserDetailsContext);

  return (
    <div className={"flex flex-1 flex-col items-center md:w-full md:flex-row"}>
      <div>
        <DocuSearchIcon />
      </div>
      <div className={"mt-4 flex flex-1 flex-col justify-center md:items-start md:ml-8 md:max-w-[80%]"}>
        <Typography
          text={Locale.videoVerificationIs}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.LARGE}
          textClasses={"text-center md:text-left"}
        >
          <Typography
            text={Locale.underReview}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.LARGE}
            textClasses={"!text-red-300 ml-1"}
          />
          <Typography
            text={isOldUser(exporterDetails.tag) ? Locale.weWillNotifyYou : Locale.youCanSend}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.LARGE}
            textClasses={"ml-1"}
          />
        </Typography>
        <div className={"mt-2 mb-6 flex flex-1 justify-center"}>
          <Typography
            text={Locale.dashboardWelcomeMainReviewingSub6Hours}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
      </div>
    </div>
  );
};

const UnderReview: FC<Props> = (props) => {
  const { exporterDetails } = useContext(UserDetailsContext);
  const { userState } = useUserData();
  const manualVerificationPending = isManualCheckPending(userState);
  return (
    <div>
      <ThankYouPageForMobile
        stepsClassName={classNames("md:hidden", isOldUser(exporterDetails.tag) ? "hide_for_mob" : "")}
        renderStep3={() => {
          return (
            <Typography
              text={Locale.shareYourFirstInvoice}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          );
        }}
        renderMainContent={() => <UnderReviewBanner />}
      />
      {!isOldUser(exporterDetails.tag) && (
        <div className={"mt-2 rounded-10px hide_for_mob"}>
          <InstructionsAndFxCalculator manualVerificationPending={manualVerificationPending} />
        </div>
      )}
    </div>
  );
};

export default UnderReview;
