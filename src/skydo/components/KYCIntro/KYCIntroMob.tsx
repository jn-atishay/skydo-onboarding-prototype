/**
 * @author Raj Sheth
 * created: 22/01/24
 */

import React, { FC } from "react";
import useKYCIntro from "./useKYCIntro";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import SheildIcon from "../Icons/SheildIcon";
import useReferralStore from "../../store/useReferralStore";
import UtmInput from "./UtmInput";
import classNames from "classnames";
import Button from "../AtomicComponents/Button";
import RightArrowIcon from "../Icons/RightArrowIcon";
import UtmKycDocsHandy from "./UtmKycDocsHandy";
import { UTM_VALUES } from "../../constants/onboarding";
import useUTMSourceStore from "../../store/useUtnSource";

interface Props {}

const KYCIntroMob: FC<Props> = (props) => {
  const { isLoading, onGetStartedClick, utmPresent } = useKYCIntro();
  const { referrerDetails } = useReferralStore();
  const { utmSource, setUtmSource } = useUTMSourceStore();

  const userSourceIsKnown = referrerDetails || utmPresent;
  const { tncClick, ppClick } = useKYCIntro();

  const renderContent = () => {
    return (
      <div className={"h-full w-full flex flex-1 flex-col overflow-y-auto"}>
        {userSourceIsKnown ? null : <UtmInput onGetStartedClick={() => {}} containerClass={"mb-6"} />}
        {/*In case of mobile, the button in utm input is replaced with bottom buttom*/}
        <div className={"mb-50 md:mb-0"}>
          <UtmKycDocsHandy />
        </div>
      </div>
    );
  };

  return (
    <div className={classNames("flex flex-1 flex-col justify-between")}>
      <div className={"flex flex-1 flex-col"}>{renderContent()}</div>
      <div className={"flex flex-col justify-center fixed right-0 left-0 bottom-0 pb-4 px-4 pt-1 bg-white"}>
        <div className={"flex flex-row items-center gap-1"}>
          <SheildIcon />
          <span>
            <Typography
              text={Locale.safetyTextMob}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={Locale.iAgreeMob}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-500"}
            />
            <a href="https://www.skydo.com/terms-of-use" rel="noopener noreferrer" target="_blank">
              <Typography
                text={Locale.terms}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-blue-400 mx-0.5 cursor-pointer"}
                onTextClick={tncClick}
              />
            </a>
            <Typography
              text={Locale.and}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-500"}
            />
            <a href="https://www.skydo.com/privacy-policy" rel="noopener noreferrer" target="_blank">
              <Typography
                text={Locale.policy}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-blue-400 mx-0.5 cursor-pointer"}
                onTextClick={ppClick}
              />
            </a>
          </span>
        </div>
        <hr className={"w-full my-2 border-black-400"} />
        {/*<AgreementText className={"!mt-0"} />*/}
        <div className={"flex flex-row"}>
          <Button
            isDisabled={false}
            title={Locale.getStarted}
            onButtonClick={() => onGetStartedClick(utmSource.utmSourceValue)}
            isLoading={isLoading}
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.MEDIUM}
            rightIcon={() => <RightArrowIcon />}
            buttonClass={"flex flex-1 !justify-center"}
          />
        </div>
      </div>
    </div>
  );
};

export default KYCIntroMob;
