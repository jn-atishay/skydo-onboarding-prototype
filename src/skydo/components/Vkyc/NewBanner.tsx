/**
 * @author Raj Sheth
 * created: 11/03/24
 */

import React, { FC, useContext } from "react";
import { USER_STATES } from "../../constants/onboarding";
import OfflineVerificationIcon from "../Icons/OfflineVerificationIcon";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import { VKYCStatus } from "../../types/vkyc";
import Button from "../AtomicComponents/Button";
import classNames from "classnames";
import USFlagIcon from "../Icons/CountryFlags/USFlagIcon";
import UKFlagIcon from "../Icons/CountryFlags/UKFlagIcon";
import CanadaFlagIcon from "../Icons/CountryFlags/CanadaFlagIcon";
import EuropeFlagIcon from "../Icons/CountryFlags/EuropeFlagIcon";
import ROWFlagIcon from "../Icons/CountryFlags/ROWFlagIcon";
import FullTick from "../Icons/FullTick";
import ExclamationIcon from "../Icons/ExclamationIcon";
import Tooltip from "../AtomicComponents/Tooltip";
import InfoIcon from "../Icons/InfoIcon";
import { UserDetailsContext } from "../DashboardContainer";
import AppContext from "../../context/AppContext";
import useVideoKycStore from "../../store/useVideoKycStore";

interface Props {
  classname?: string;
}

const NewBanner: FC<Props> = (props) => {
  const { classname } = props;
  const { exporterDetails } = useContext(UserDetailsContext);
  const companyShortName = exporterDetails?.correspondentName || exporterDetails?.businessLegalName || "";
  const { theme } = useContext(AppContext);
  const { onVideoVerifClick, verifStatus, failReason, isLoading, remainingDays, isAadhaarExpire } = useVideoKycStore();
  const flagWidth = 32;
  const flagHeight = 32;

  return (
    <>
      {exporterDetails.onBoardingState === USER_STATES.MANUAL_VERIFICATION ? (
        <div className={"flex flex-row items-center gap-6 w-7/12"}>
          <OfflineVerificationIcon height={62} width={98} />
          <div className={"flex flex-col gap-2"}>
            <div className={"flex flex-col gap-0"}>
              <Typography
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.SMALL}
                text={Locale.dashboardWelcomeMainReviewingVkyc}
              />
              <Typography
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.SMALL}
                text={Locale.completeYourVideoVerif}
                textClasses={"!text-green-400"}
              >
                <Typography text={Locale.toSpeedUp} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />
              </Typography>
            </div>
            <Typography
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.LARGE}
              text={Locale.dashboardWelcomeMainReviewingSub}
              textClasses={"!text-black-500"}
            />
            {verifStatus === VKYCStatus.PENDING ? null : (
              <Button title={Locale.startVideoVerif} size={BUTTON_SIZES.SMALL} onButtonClick={onVideoVerifClick} />
            )}
          </div>
        </div>
      ) : (
        <div className={classNames("flex flex-col gap-4 w-7/12 relative", classname)}>
          <div className={"flex space-x-2"}>
            <USFlagIcon isFx={true} width={flagWidth} height={flagHeight} />
            <UKFlagIcon width={flagWidth} height={flagHeight} />
            <CanadaFlagIcon width={flagWidth} height={flagHeight} />
            <EuropeFlagIcon width={flagWidth} height={flagHeight} />
            <ROWFlagIcon width={flagWidth} height={flagHeight} />
          </div>
          <div className={"flex flex-col gap-0"}>
            <div className={"flex flex-row items-center"}>
              <Typography
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.SMALL}
                text={Locale.dashboardWelcomeMain.replace(":shortName", String(companyShortName))}
              />
            </div>
            <Typography
              text={verifStatus === VKYCStatus.PENDING ? Locale.yourVideoVerif : Locale.completeYourVideoVerif}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-green-400"}
            >
              <Typography
                text={verifStatus === VKYCStatus.PENDING ? Locale.isUnderReview : Locale.toStartReceiving}
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.SMALL}
              />
            </Typography>
          </div>
          {verifStatus === VKYCStatus.PENDING ? null : (
            <Button title={Locale.startVideoVerif} size={BUTTON_SIZES.SMALL} onButtonClick={onVideoVerifClick} />
          )}
        </div>
      )}
      <div className={"flex flex-col gap-4 w-5/12"}>
        <Typography
          text={Locale.completeYourKyc}
          textClasses={"!text-black-500 !font-bold pl-6"}
          size={TYPOGRAPHY_SIZES.SMALL}
          type={TYPOGRAPHY_TYPES.PARA}
        />
        <div className={"flex flex-row items-center gap-4 pl-5 py-1"}>
          <FullTick tickColor={theme.hexColors.green[400]} bgColor={theme.hexColors.green[100]} />
          <Typography
            text={Locale.businessKycCompleted}
            textClasses={"!text-green-500 !font-semibold"}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
          />
        </div>
        <div className={"py-2 px-4 rounded-10px bg-yellow-50 flex flex-row items-center gap-4"}>
          <ExclamationIcon width={32} height={32} />
          <div className={"flex flex-col gap-2"}>
            <div className={"flex flex-row items-center gap-4"}>
              <Typography
                text={verifStatus === VKYCStatus.PENDING ? Locale.videoVerifUnderReview : Locale.completeYourVideoVerif}
                textClasses={"!font-semibold"}
                size={TYPOGRAPHY_SIZES.SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
              />
              <Tooltip
                tooltipText={Locale.mandatoryVideoVerif}
                position={TOOLTIP_POSITION.BOTTOM}
                tooltipTheme={"dark"}
              >
                <InfoIcon />
              </Tooltip>
            </div>
            {verifStatus === VKYCStatus.NOT_STARTED ? (
              <>
                {isAadhaarExpire || remainingDays <= 0 || remainingDays > 3 ? null : (
                  <Typography
                    text={Locale.avoidReverif
                      .replace(":days", String(remainingDays))
                      .replace(":plural", remainingDays > 1 ? "s" : "")}
                    textClasses={"!text-black-500"}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                  />
                )}
              </>
            ) : verifStatus === VKYCStatus.PENDING ? (
              <Typography
                text={Locale.dashboardWelcomeMainReviewingSub6Hours}
                textClasses={"!text-black-500"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
              />
            ) : (
              <div className={"flex flex-col gap-2"}>
                <Typography
                  text={`${Locale.reasonOfReject} ${failReason}`}
                  textClasses={"!text-black-500"}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                />
                <div className={"px-2 py-1 rounded-full bg-red-50 w-fit"}>
                  <Typography
                    text={Locale.videoVerifReject}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-red-400"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewBanner;
