/**
 * @author Raj Sheth
 * created: 10/07/23
 */

import React, { useEffect, useState } from "react";
import AuthHelper from "../../authentication/AuthHelper";
import Button from "../AtomicComponents/Button";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import RightArrow from "../Icons/RightArrow";
import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import TextInput from "../AtomicComponents/TextInput";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import useLoginStore from "../../store/useLoginStore";
import { MobileInputPropsDto } from "../../types/LoginTypes";
import CheckBox from "../AtomicComponents/CheckBox";
import classnames from "classnames";

export const getCountryCode = () => {
  return (
    <Typography
      text={"+91 -"}
      type={TYPOGRAPHY_TYPES.PARA}
      size={TYPOGRAPHY_SIZES.LARGE}
      textClasses={"py-3 mr-1 min-w-[38px]"}
    />
  );
};

const MobileInputComp: React.FC<MobileInputPropsDto> = (props) => {
  const {
    goToNextStep,
    logOutPopUpVisible,
    setLogOutPopUpVisible,
    mobile,
    setMobile,
    setIsContinueLoading,
    setIsLogoutLoading,
    isLogoutLoading,
    isContinueLoading,
    setPhoneError,
    phoneError,
    isReferred,
  } = props;
  const analytics = useAnalytics();
  const loginStore = useLoginStore();
  const [hasWhatsappConsent, setHasWhatsappConsent] = useState(true);

  useEffect(() => {
    analytics?.trackAsync(Events.WHATSAPP_CONSENT_CLICK, { hasWhatsappConsent: hasWhatsappConsent });
  }, [hasWhatsappConsent]);

  const closeLogOutPopUp = () => {
    setLogOutPopUpVisible(false);
  };

  const onLogoOut = async () => {
    setIsLogoutLoading(true);
    await AuthHelper.logout();
    setLogOutPopUpVisible(false);
    setIsLogoutLoading(false);
  };

  const renderCTAs = () => {
    return (
      <div className={"flex flex-row mt-6 "}>
        <Button
          title={Locale.cancel}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={closeLogOutPopUp}
          buttonClass={"mr-2"}
        />
        <Button
          title={Locale.logout}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={onLogoOut}
          isRedButton={true}
          loadingTitle={Locale.loginSigningOut}
          isLoading={isLogoutLoading}
        />
      </div>
    );
  };

  const loginPageType = isReferred ? "referral" : "standard";

  const onContinue = async () => {
    analytics.trackAsync(Events.MOBILE_INPUT_LOGIN_SUBMIT);
    setIsContinueLoading(true);
    if (mobile.length !== 10) {
      setPhoneError(Locale.invalidPhone);
      setIsContinueLoading(false);
      analytics.trackAsync(Events.LOGIN_SCREEN_PHONE_ERROR, { login_page_type: loginPageType });
      return;
    }
    setPhoneError("");
    await loginStore.savePhone({
      onSuccess: () => {
        goToNextStep();
        setIsContinueLoading(false);
        analytics.trackAsync(Events.LOGIN_SCREEN_PHONE_SUCCESS, { login_page_type: loginPageType });
      },
      onError: () => {
        setPhoneError(Locale.invalidPhone);
        setIsContinueLoading(false);
        analytics.trackAsync(Events.LOGIN_SCREEN_PHONE_ERROR, { login_page_type: loginPageType });
      },
      mobile,
      fromMobile: false,
      whatsappConsent: hasWhatsappConsent,
    });
  };

  return (
    <div
      className={classnames("z-10 half-flex pt-18 pb-18", {
        "bg-white shadow-stateIcon rounded-10px": !isReferred,
         "px-10": !isReferred,
      })}
    >
      <Popup
        title={Locale.logout}
        isCommonHeader={true}
        renderContent={() => (
          <Typography text={Locale.sureLogout} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
        )}
        open={logOutPopUpVisible}
        outsideClick={closeLogOutPopUp}
        closeIconClick={closeLogOutPopUp}
        renderCTAs={renderCTAs}
      />
      <div className={"flex flex-col w-92 h-[464px]"}>
        <div
          className={"cursor-pointer w-fit"}
          onClick={() => {
            setLogOutPopUpVisible(true);
          }}
        >
          <RightArrow />
        </div>
        <Typography
          text={Locale.enterMobileNo}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"my-13"}
        />
        <CustomisedNavigationForm onSubmit={onContinue} className={"flex flex-col flex-1"}>
          <div className={"flex flex-col justify-between flex-1"}>
            <div>
              <TextInput
                value={mobile}
                type={"number"}
                onChange={(value: string) => {
                  setMobile(value);
                }}
                customClass={"paramedium md:paralarge"}
                onFocus={() => {
                  analytics.trackAsync(Events.MOBILE_INPUT_LOGIN_FOCUS);
                }}
                label={Locale.mobileNumber}
                isError={!!phoneError}
                leftElement={getCountryCode}
                footerText={phoneError ?? phoneError}
              />
            </div>
            <div>
              <CheckBox
                checked={hasWhatsappConsent}
                onCheckboxClick={() => {
                  setHasWhatsappConsent(!hasWhatsappConsent);
                }}
                checkboxClass={"w-4 h-4"}
                label={
                  <Typography
                    text={Locale.receiveAcctUpdatesOnWhatsapp}
                    textClasses={"!text-black-500"}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    type={TYPOGRAPHY_TYPES.PARA}
                  />
                }
              />
              <Button
                loadingTitle={Locale.loginSubmitting}
              isLoading={isContinueLoading}
                onButtonClick={onContinue}
                title={Locale.continue}
                size={BUTTON_SIZES.LARGE}
                buttonClass={"mt-6 !w-full justify-center"}
                textClasses={"flex-1 flex justify-center"}
              />
            </div>
          </div>
        </CustomisedNavigationForm>
      </div>
    </div>
  );
};

export default MobileInputComp;
