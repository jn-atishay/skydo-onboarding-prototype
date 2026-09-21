/**
 * @author Raj Sheth
 * created: 06/03/24
 */

import React, { FC, useContext } from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import ThankYouPageForMobile from "../LoginComponents/MobileComponents/ThankYouPageForMobile";
import TickWithOuterIcon from "../Icons/TickWithOuter";
import useUserData from "../../store/useUserData";
import { isManualCheckPending } from "../../util/functions";
import InstructionsAndFxCalculator from "../DashboardContainer/InstructionsAndFxCalculator";
import { isOldUser } from "../../util/vkycUtils";
import { UserDetailsContext } from "../DashboardContainer";
import classNames from "classnames";

interface Props {}

const Approved: FC<Props> = (props) => {
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
        renderMainContent={() => {
          return (
            <div className={"flex flex-1 flex-col items-center mb-4 md:mb-0 md:w-full md:flex-row"}>
              <div className={"pt-4 md:mr-6"}>
                <TickWithOuterIcon height={134} width={134} />
              </div>
              <Typography
                text={Locale.completedVideoKYC}
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"pt-4 text-center w-full md:text-left"}
              />
            </div>
          );
        }}
      />
      {!isOldUser(exporterDetails.tag) && (
        <div className={"mt-2 rounded-10px hide_for_mob"}>
          <InstructionsAndFxCalculator manualVerificationPending={manualVerificationPending} />
        </div>
      )}
    </div>
  );
};

export default Approved;
