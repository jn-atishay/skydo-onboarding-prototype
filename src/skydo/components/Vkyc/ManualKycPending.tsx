/**
 * @author Raj Sheth
 * created: 06/03/24
 */

import React, { FC } from "react";
import DocuSearchIcon from "../Icons/DocuSearchIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import ThankYouPageForMobile from "../LoginComponents/MobileComponents/ThankYouPageForMobile";
import InstructionsAndFxCalculator from "../DashboardContainer/InstructionsAndFxCalculator";
import { isManualCheckPending } from "../../util/functions";
import useUserData from "../../store/useUserData";

interface Props {}

const ManualKycPending: FC<Props> = (props) => {
  const { userState } = useUserData();
  const manualVerificationPending = isManualCheckPending(userState);
  return (
    <div>
      <ThankYouPageForMobile
        stepsClassName={"md:hidden"}
        renderMainContent={() => {
          return (
            <div className={"flex flex-1 flex-col items-center md:w-full md:flex-row"}>
              <div>
                <DocuSearchIcon />
              </div>
              <div className={"mt-4 flex flex-1 flex-col justify-center md:items-start md:ml-8 md:max-w-[80%]"}>
                <div>
                  <Typography
                    text={Locale.dashboardWelcomeMainReviewing}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.LARGE}
                    textClasses={"text-center md:text-left"}
                  />
                </div>
                <div className={"mt-2 mb-6 flex flex-1 justify-center"}>
                  <Typography
                    text={Locale.dashboardWelcomeMainReviewingSub}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500"}
                  />
                </div>
              </div>
            </div>
          );
        }}
      />
      <div className={"mt-2 rounded-10px hide_for_mob"}>
        <InstructionsAndFxCalculator manualVerificationPending={manualVerificationPending} />
      </div>
    </div>
  );
};

export default ManualKycPending;
