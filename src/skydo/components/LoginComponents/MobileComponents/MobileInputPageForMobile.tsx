import React, { useEffect, useState } from "react";
import useAnalytics from "../../../analytics/useAnalytics";
import AuthHelper from "../../../authentication/AuthHelper";
import Button from "../../AtomicComponents/Button";
import Locale from "../../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import { Events } from "../../../analytics/EventConstants";
import Popup from "../../AtomicComponents/Popup";
import Typography from "../../AtomicComponents/Typography";
import CustomisedNavigationForm from "../../AtomicComponents/CustomisedNavigationForm";
import TextInput from "../../AtomicComponents/TextInput";
import { getCountryCode } from "../MobileInputComp";
import useLoginStore from "../../../store/useLoginStore";
import { MobileInputPropsDto } from "../../../types/LoginTypes";
import MobileHeader from "../../MobileComponents/MobileHeader";
import CheckBox from "../../AtomicComponents/CheckBox";
import RightArrow from "../../Icons/RightArrow";

const MobileInputPageForMobile = (props: MobileInputPropsDto) => {
  const analytics = useAnalytics();
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
      fromMobile: true,
      whatsappConsent: hasWhatsappConsent,
    });
  };

  return (
    <div className={"flex flex-col h-full md:!hidden"}>
      {isReferred && <div className={"fixed top-0 left-0 w-full h-screen -z-10 bg-black-50"} />}
      <MobileHeader
        isBackButtonVisible={!isReferred}
        onBackClick={() => {
          setLogOutPopUpVisible(true);
        }}
        isReferralFlow={isReferred}
      />
      {isReferred && <hr className={"border-black-350"} />}
      {isReferred && (
        <div className={"pl-6 pt-8"}>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.X_SMALL}
            nativeType={"button"}
            title={""}
            leftIcon={() => <RightArrow />}
            onButtonClick={() => {
              setLogOutPopUpVisible(true);
            }}
            buttonClass={"!p-0 !gap-x-0 w-[30px] h-[30px] justify-center"}
          />
        </div>
      )}
      <div className={"flex flex-col p-6 h-full"}>
        <Typography
          text={Locale.enterMobileNo}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!pt-10 !pb-13"}
        />
        <CustomisedNavigationForm onSubmit={onContinue} className={"flex flex-col h-full justify-between"}>
          <TextInput
            value={mobile}
            type={"number"}
            onChange={(value: string) => {
              setMobile(value);
            }}
            onFocus={() => {
              analytics.trackAsync(Events.MOBILE_INPUT_LOGIN_FOCUS);
            }}
            label={Locale.enterMobileNo}
            isError={!!phoneError}
            leftElement={getCountryCode}
            footerText={phoneError ?? phoneError}
          />
          <div>
            <CheckBox
              checked={hasWhatsappConsent}
              label={
                <Typography
                  text={Locale.receiveAcctUpdatesOnWhatsapp}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  type={TYPOGRAPHY_TYPES.PARA}
                  textClasses={"!text-black-500"}
                />
              }
              onCheckboxClick={() => {
                setHasWhatsappConsent(!hasWhatsappConsent);
              }}
              checkboxClass={"w-4 h-4"}
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
        </CustomisedNavigationForm>
      </div>
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
        isDashboardPopup={true}
        isMobilePopup={true}
      />
    </div>
  );
};

export default MobileInputPageForMobile;
