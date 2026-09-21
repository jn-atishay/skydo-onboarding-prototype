import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import RadioButton from "../AtomicComponents/RadioButton";
import Button from "../AtomicComponents/Button";
import RightArrowIcon from "../Icons/RightArrowIcon";
import renderAgreementText from "./RenderAgreementText";
import TextInput from "../AtomicComponents/TextInput";
import MegaPhone from "../Icons/MegaPhone";
import { UTM_VALUES } from "../../constants/onboarding";
import classNames from "classnames";
import useUTMSourceStore from "../../store/useUtnSource";

interface Props {
  tncClick?: () => void;
  ppClick?: () => void;
  containerClass?: string;
  onGetStartedClick: (utmVal: string) => void;
}
const UtmInput = (props: Props) => {
  const { tncClick, ppClick, onGetStartedClick, containerClass } = props;
  const { utmSource, setUtmSource } = useUTMSourceStore();

  const { theme } = useContext(AppContext);
  const [isLoading, setLoading] = useState(false);
  const renderRightIcon = () => {
    return <RightArrowIcon />;
  };

  return (
    <div
      className={classNames("flex flex-col bg-black-50 rounded-20px flex-1 md:px-13 md:py-8 px-4 py-4", containerClass)}
    >
      <div className={"flex !flex-row items-center space-x-4 md:space-x-20 md:mb-0 mb-4"}>
        <div className={"flex flex-col flex-1 gap-y-2"}>
          <Typography
            text={Locale.kycIntroHeader}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"flex-1 !labelsmall md:!headingxsmall"}
            fontWeight={700}
          />
          <Typography
            text={Locale.utmInputKycHeader}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"flex-1 !labelxsmall md:!labelmedium"}
            fontColor={theme.hexColors.black[500]}
          />
        </div>
        <MegaPhone />
      </div>
      <div className={"gap-2 md:gap-6 mt-2 flex-wrap mb-2 grid md:grid-cols-3 grid-cols-1"}>
        <RadioButton
          id={UTM_VALUES.utmFacebookInstagram}
          label={Locale.utmFacebookInstagram}
          checked={utmSource.utmSource === UTM_VALUES.utmFacebookInstagram}
          onChange={() => {
            setUtmSource({
              ...utmSource,
              utmSource: UTM_VALUES.utmFacebookInstagram,
              utmSourceValue: UTM_VALUES.utmFacebookInstagram,
            });
          }}
        />
        <RadioButton
          id={UTM_VALUES.utmLinkedIn}
          label={Locale.utmLinkedIn}
          checked={utmSource.utmSource === UTM_VALUES.utmLinkedIn}
          onChange={() => {
            setUtmSource({
              ...utmSource,
              utmSource: UTM_VALUES.utmLinkedIn,
              utmSourceValue: UTM_VALUES.utmLinkedIn,
            });
          }}
        />
        <RadioButton
          id={UTM_VALUES.utmGoogleAds}
          label={Locale.utmGoogleAds}
          checked={utmSource.utmSource === UTM_VALUES.utmGoogleAds}
          onChange={() => {
            setUtmSource({
              ...utmSource,
              utmSource: UTM_VALUES.utmGoogleAds,
              utmSourceValue: UTM_VALUES.utmGoogleAds,
            });
          }}
        />
        <RadioButton
          id={UTM_VALUES.utmWordOfMouth}
          label={Locale.utmWordOfMouth}
          checked={utmSource.utmSource === UTM_VALUES.utmWordOfMouth}
          onChange={() => {
            setUtmSource({
              ...utmSource,
              utmSource: UTM_VALUES.utmWordOfMouth,
              utmSourceValue: UTM_VALUES.utmWordOfMouth,
            });
          }}
        />

        <RadioButton
          id={UTM_VALUES.utmGoogle}
          label={Locale.utmGoogle}
          checked={utmSource.utmSource === UTM_VALUES.utmGoogle}
          onChange={() => {
            setUtmSource({
              ...utmSource,
              utmSource: UTM_VALUES.utmGoogle,
              utmSourceValue: UTM_VALUES.utmGoogle,
            });
          }}
        />
        <RadioButton
          id={UTM_VALUES.utmOnlineCommunity}
          label={Locale.utmOnlineCommunity}
          checked={utmSource.utmSource === UTM_VALUES.utmOnlineCommunity}
          onChange={() => {
            setUtmSource({
              ...utmSource,
              utmSource: UTM_VALUES.utmOnlineCommunity,
              utmSourceValue: UTM_VALUES.utmOnlineCommunity,
            });
          }}
        />
        <RadioButton
          id={UTM_VALUES.utmChatGPTAITools}
          label={Locale.utmChatGPTAITools}
          checked={utmSource.utmSource === UTM_VALUES.utmChatGPTAITools}
          onChange={() => {
            setUtmSource({
              ...utmSource,
              utmSource: UTM_VALUES.utmChatGPTAITools,
              utmSourceValue: UTM_VALUES.utmChatGPTAITools,
            });
          }}
        />
        <RadioButton
          id={UTM_VALUES.utmOthers}
          label={Locale.utmOthers}
          checked={utmSource.utmSource === UTM_VALUES.utmOthers}
          onChange={() => {
            setUtmSource({ ...utmSource, utmSource: UTM_VALUES.utmOthers });
          }}
        />
      </div>
      <div className={"flex flex-row items-start"}>
        {utmSource.utmSource === UTM_VALUES.utmOthers ? (
          <TextInput
            type={"textarea"}
            inputClass={"flex-1"}
            inputProps={{ rows: 1 }}
            onChange={(value) => {
              // @ts-ignore
              setUtmSource({ ...utmSource, utmSourceValue: value });
            }}
            placeholder={Locale.typeHere}
          />
        ) : null}
        <div className={"flex flex-col items-end flex-1 hide_for_mob_flex"}>
          <Button
            isLoading={isLoading}
            title={Locale.getStarted}
            rightIcon={renderRightIcon}
            onButtonClick={() => {
              onGetStartedClick(utmSource.utmSourceValue);
              setLoading(true);
            }}
          />
          {ppClick && tncClick && renderAgreementText({ ppClick: ppClick, tncClick: tncClick })}
        </div>
      </div>
    </div>
  );
};

export default UtmInput;
