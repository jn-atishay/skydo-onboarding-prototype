/**
 * @author Raj Sheth
 * created: 11/03/24
 */

import React, { FC } from "react";
import VideoVerificationIcon from "../Icons/VideoVerificationIcon";
import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import useVideoKycStore from "../../store/useVideoKycStore";
import { VKYCStatus } from "../../types/vkyc";
import { UnderReviewBanner } from "./UnderReview";

export const getDisplayDateForVkyc = (): string => {
  let currentDate = new Date();

  let displayDate = "20th March, 2024";
  if (currentDate <= new Date("2024-03-20")) {
    displayDate = "20th March, 2024";
  } else {
    displayDate = "31st March, 2024";
  }

  return displayDate;
};

interface Props {}

const OldBanner: FC<Props> = (props) => {
  const { onVideoVerifClick, verifStatus } = useVideoKycStore();

  if (verifStatus === VKYCStatus.PENDING) {
    return <UnderReviewBanner />;
  }

  return (
    <div className={"flex flex-1 flex-row justify-between"}>
      <div className={"flex flex-8 flex-row"}>
        <div className={"-mt-6"}>
          <VideoVerificationIcon />
        </div>
        <div className={"flex flex-col flex-1 ml-6"}>
          <div>
            <Typography
              text={Locale.paymentReceivedUntilVerification31Mar}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontWeight={"bold"}
              textClasses={"!text-red-300"}
            />
          </div>
          <div className={"mt-6"}>
            <Typography
              text={Locale.asPerNewRbiMar31}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontWeight={"bold"}
            />
          </div>
        </div>
      </div>
      <div className={"flex flex-2 items-center flex-col"}>
        <Button title={Locale.startVideoVerif} size={BUTTON_SIZES.MEDIUM} onButtonClick={onVideoVerifClick} />
        <Typography
          text={Locale.processWillTake2}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!text-black-500 mt-1"}
        />
      </div>
    </div>
  );
};

export default OldBanner;
