import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import Button from "../AtomicComponents/Button";
import RightArrowIcon from "../Icons/RightArrowIcon";
import renderAgreementText from "./RenderAgreementText";
import RequiredDocDetails from "./RequiredDocDetails";
import WhyKyc from "./WhyKyc";
import SheildIcon from "../Icons/SheildIcon";

interface Props {
  tncClick: () => void;
  ppClick: () => void;

  onGetStartedClick: (utmVal: string) => void;
  utmSource?: string;
}
const CompleteYourKyc = (props: Props) => {
  const { tncClick, ppClick, onGetStartedClick, utmSource } = props;

  const { theme } = useContext(AppContext);
  const [isLoading, setLoading] = useState(false);
  const renderRightIcon = () => {
    return <RightArrowIcon />;
  };

  return (
    <div className={"content-area flex flex-col half"}>
      <div className={"flex items-center justify-between bg-black-50 rounded-20px px-8 py-13 mb-6"}>
        <Typography
          text={Locale.kycIntroHeader}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"flex-1"}
        />
        <div className={"flex flex-col items-end flex-1"}>
          <Button
            isLoading={isLoading}
            title={Locale.getStarted}
            rightIcon={renderRightIcon}
            onButtonClick={() => {
              void onGetStartedClick(utmSource?.toString() || "");
            }}
          />
          {renderAgreementText({ ppClick: ppClick, tncClick: tncClick })}
        </div>
      </div>
      <div className={"flex"}>
        <RequiredDocDetails />
        <WhyKyc />
      </div>
      <div className={"flex flex-row mt-6 items-center mb-10"}>
        <SheildIcon />
        <Typography
          text={Locale.safetyText}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"ml-4 !text-black-500"}
        />
      </div>
    </div>
  );
};

export default CompleteYourKyc;
