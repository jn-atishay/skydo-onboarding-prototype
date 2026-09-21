import React, { useEffect } from "react";
import { Analytics } from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";
import { getRefereeRewardValue, referralHeadlineCopy } from "../../../util/referralUtil";
import { ReferrerData } from "../../../types/Referral";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import Locale from "../../../util/locale/en";
import GoogleIcon from "../../Icons/GoogleIcon";
import RightArrow from "../../Icons/RightArrow";
import DiscountStarIcon from "../../Icons/DiscountStarIcon";
import FileCheckIcon from "../../Icons/FileCheckIcon";
import ShieldCheckIcon from "../../Icons/ShieldCheckIcon";
import IconTextChip from "../../Common/IconTextChip";
import ReferralRewardDivider from "../ReferralRewardDivider";
import ReferralInvitePill from "../ReferralInvitePill";
import Typography from "../../AtomicComponents/Typography";
import Button from "../../AtomicComponents/Button";
import classnames from "classnames";
import CustomisedNavigationForm from "../../AtomicComponents/CustomisedNavigationForm";
import ResendOtp from "../../Common/ResendOtp";
import TextInput from "../../AtomicComponents/TextInput";
import MobileHeader from "../../MobileComponents/MobileHeader";
import OtpInput from "../../AtomicComponents/OTPInput";
import { OtpInputRef } from "../../../types/atomicComponentTypes";
import Image from "next/image";
import styles from "./EmailLoginFlowMobile.module.css";
import { useMediaQuery } from "../../../util/useMediaQuery";

const LOGIN_OTP_LENGTH = 6;

interface Props {
  className?: string;
  isEmailScreen: boolean;
  isEmailOtpScreen: boolean;
  isEmailDisabled?: boolean;
  platformName?: string;
  referrerDetailsViaCode?: ReferrerData;
  hasFetchedReferrerDetailsViaCode?: boolean;
  email: string;
  emailError: string;
  onEmailChange: (value: string) => void;
  isSendOtpLoading: boolean;
  sendOtp: (
    event: undefined | KeyboardEvent | React.MouseEvent<HTMLButtonElement>,
    resendFlag: boolean
  ) => Promise<void>;
  isScriptLoaded: boolean;
  onButtonClick: () => void;
  analytics: Analytics;
  onArrowClick: () => void;
  otp: string;
  onOtpChange: (otpValue: string) => void;
  otpInputRef: React.RefObject<OtpInputRef>;
  otpError: string;
  onResendOTPClick: () => void;
  onEditEmailClick: () => void;
  onVerifyOTPClick: () => void;
  isVerifyOtpLoading: boolean;
  needsNewCode: boolean;
  correlationId: string;
}

const ReferralEmailLoginFlowMobile = (props: Props) => {
  const {
    className,
    isEmailScreen,
    isEmailOtpScreen,
    isEmailDisabled,
    platformName,
    referrerDetailsViaCode,
    hasFetchedReferrerDetailsViaCode,
    email,
    emailError,
    onEmailChange,
    isSendOtpLoading,
    sendOtp,
    isScriptLoaded,
    onButtonClick,
    analytics,
    onArrowClick,
    otp,
    onOtpChange,
    otpInputRef,
    otpError,
    onResendOTPClick,
    onEditEmailClick,
    onVerifyOTPClick,
    isVerifyOtpLoading,
    needsNewCode,
    correlationId,
  } = props;

  const earnedRewardQty = getRefereeRewardValue(referrerDetailsViaCode);
  const isRewardDividerVisible = !hasFetchedReferrerDetailsViaCode || earnedRewardQty !== undefined;
  const { highlight, subheading } = referralHeadlineCopy(!!hasFetchedReferrerDetailsViaCode, earnedRewardQty);
  // This card stays mounted (CSS-hidden) on desktop too. These trust badges are
  // mobile-only content, so gate them from loading when on a desktop viewport —
  // mirrors DesktopLoginPage's gate for the reverse case.
  const isMobileViewport = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (hasFetchedReferrerDetailsViaCode) {
      analytics?.trackAsync(Events.REFERRAL_LOGIN_PAGE_LOAD, {
        device_type: "mobile",
        referrer_expID: referrerDetailsViaCode?.referrerId,
      });
    }
  }, [hasFetchedReferrerDetailsViaCode, referrerDetailsViaCode?.referrerId]);

  const renderLoginButtonTitle = () => {
    return (
      <div className={"flex flex-row items-center justify-center flex-1"}>
        <GoogleIcon height={20} width={20} />
        <Typography
          text={Locale.signUpwithGoogle}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"ml-1.5"}
        />
      </div>
    );
  };

  return (
    <>
      <div
        className={classnames(
          "fixed top-0 left-0 w-full h-screen -z-10",
          isEmailOtpScreen ? "bg-black-50" : styles.referralIntroBackground
        )}
      />
      <MobileHeader onBackClick={onArrowClick} isReferralFlow />
      <hr className={"border-black-350"} />
      {isEmailOtpScreen && (
        <div className={"pl-6 pt-8"}>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.X_SMALL}
            nativeType={"button"}
            title={""}
            leftIcon={() => <RightArrow />}
            onButtonClick={onArrowClick}
            buttonClass={"!p-0 !gap-x-0 w-[30px] h-[30px] justify-center"}
          />
        </div>
      )}
      <div className={classnames("flex flex-col min-h-[calc(100vh-150px)]", className)}>
        {isEmailScreen && !isEmailDisabled && (
          <>
            <div className={"flex flex-col items-center gap-4 !px-6 pt-8 pb-6"}>
              <ReferralInvitePill
                exporterName={referrerDetailsViaCode?.exporterName}
                hasFetched={!!hasFetchedReferrerDetailsViaCode}
              />
              <div className={"flex flex-col items-center gap-1 w-full"}>
                <Typography
                  text={Locale.referralHeadingPrefix}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.LARGE}
                  textClasses={"!text-green-400 !text-center w-full"}
                >
                  {highlight ? (
                    <Typography
                      text={highlight}
                      type={TYPOGRAPHY_TYPES.HEADING}
                      size={TYPOGRAPHY_SIZES.LARGE}
                      textClasses={"!text-green-400"}
                    />
                  ) : (
                    <span className={"inline-block align-middle animate-pulse rounded-10px bg-black-100 h-6 w-20"} />
                  )}
                </Typography>
                <Typography
                  text={subheading}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-center w-full"}
                />
              </div>
              <Typography
                text={`${Locale.referralExportersSavingTextBoldPrefix} ${Locale.referralExportersSavingTextMiddle} ${Locale.referralExportersSavingTextBoldSuffix} ${Locale.referralExportersSavingTextSuffix}`}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-600 !text-center"}
              />
              <div className={"flex flex-col items-center gap-2 w-full"}>
                <div className={"h-px bg-primary-50 w-full"} />
                <div className={"flex items-center gap-3"}>
                  <IconTextChip
                    icon={<DiscountStarIcon />}
                    text={Locale.referralZeroFxMarkup}
                    textClasses={"!text-black-600"}
                  />
                  <div className={"w-px h-3 bg-primary-50 shrink-0"} />
                  <IconTextChip
                    icon={<FileCheckIcon />}
                    text={Locale.referralInstantFira}
                    textClasses={"!text-black-600"}
                  />
                  <div className={"w-px h-3 bg-primary-50 shrink-0"} />
                  <IconTextChip
                    icon={<ShieldCheckIcon />}
                    text={Locale.referralRbiApproved}
                    textClasses={"!text-black-600"}
                  />
                </div>
                <div className={"h-px bg-primary-50 w-full"} />
              </div>
            </div>
            <div className={"!px-6"}>
              <div className={"flex flex-col w-full rounded-8px shadow-elevation1 overflow-hidden"}>
                <div className={"flex flex-col gap-4 items-center bg-white px-5 pt-6 pb-5 w-full"}>
                  <Button
                    type={BUTTON_TYPES.SECONDARY}
                    title={renderLoginButtonTitle()}
                    onButtonClick={() => {
                      analytics?.trackAsync(Events.GOOGLE_SIGNUP_CLICKED, {
                        device_type: "mobile",
                        login_page_type: "referral",
                      });
                      onButtonClick();
                    }}
                    buttonClass={"!w-full"}
                    textClasses={"w-full"}
                    isDisabled={!isScriptLoaded}
                  />
                  <div className={"content-bwn-line w-full before:border-black-350 after:border-black-350"}>
                    <Typography text={Locale.or} type={TYPOGRAPHY_TYPES.LABEL} textClasses={"!text-black-500"} />
                  </div>
                  <CustomisedNavigationForm
                    onSubmit={(event) => sendOtp(event, false)}
                    className={"flex flex-col gap-4 w-full"}
                  >
                    <TextInput
                      value={email}
                      label={Locale.enterEmailtext}
                      onChange={onEmailChange}
                      isError={!!emailError}
                      footerText={!emailError ? undefined : emailError}
                      isDisabled={isEmailDisabled}
                      labelTextClass={"!text-black-700 mr-1"}
                    />
                    {isEmailDisabled && platformName && (
                      <div>
                        <Typography
                          text={Locale.platformLinkedEmailInfo.replace(/:platformName/g, platformName)}
                          type={TYPOGRAPHY_TYPES.PARA}
                          size={TYPOGRAPHY_SIZES.SMALL}
                          textClasses={"!text-black-500"}
                        />
                      </div>
                    )}
                    <Button
                      loadingTitle={Locale.loginSending}
              isLoading={isSendOtpLoading}
                      onButtonClick={(event) => sendOtp(event, false)}
                      title={Locale.sendOTP}
                      buttonClass={"!w-full justify-center"}
                      textClasses={"flex-1 flex justify-center"}
                    />
                  </CustomisedNavigationForm>
                  {isRewardDividerVisible && <ReferralRewardDivider earnedRewardQty={earnedRewardQty} />}
                </div>
                <div
                  className={"flex flex-col items-center gap-3 bg-black-50 border-t border-black-100 px-5 py-5 w-full"}
                >
                  <Typography
                    text={Locale.referralTrustedByPartners}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={"!text-black-500"}
                  />
                  <div className={"flex items-center gap-4"}>
                    <div className={"flex items-center gap-1.5"}>
                      <div className={"relative h-3 w-3 shrink-0"}>
                        {isMobileViewport && <Image layout={"fill"} src={"/rbi-colored.svg"} alt={"RBI"} />}
                      </div>
                      <Typography
                        text={Locale.referralRbiPaCbAuthorized}
                        type={TYPOGRAPHY_TYPES.LABEL}
                        size={TYPOGRAPHY_SIZES.X_SMALL}
                        textClasses={"!text-black-700"}
                      />
                    </div>
                    <div className={"relative h-3 w-8 shrink-0"}>
                      {isMobileViewport && <Image layout={"fill"} src={"/visa.svg"} alt={"VISA"} />}
                    </div>
                    <div className={"relative h-3 w-16 shrink-0"}>
                      {isMobileViewport && <Image layout={"fill"} src={"/hdfc.svg"} alt={"HDFC Bank"} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {isEmailOtpScreen && (
          <>
            <div className={"flex flex-col p-6"}>
              <div className={classnames("overflow-hidden text-ellipsis !my-10")}>
                <Typography text={Locale.enterOTP} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />
                <Typography
                  text={email}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"ml-1 truncate"}
                  typographyProps={{ title: email }}
                />
              </div>
            </div>
            <div className={"!px-6 flex flex-1 flex-col"}>
              <CustomisedNavigationForm onSubmit={onVerifyOTPClick} className={"flex flex-1 flex-col"}>
                <OtpInput
                  ref={otpInputRef}
                  otp={otp}
                  onChange={onOtpChange}
                  otpLength={LOGIN_OTP_LENGTH}
                  error={otpError}
                  showFieldError
                  onFocus={() => analytics?.trackAsync(Events.LOGIN_SCREEN_OTP_INPUT, { login_page_type: "referral" })}
                />
                <div className={needsNewCode ? "invisible" : ""} aria-hidden={needsNewCode}><ResendOtp
                    key={correlationId}
                    timeToResend={59}
                    onResendOTPClick={onResendOTPClick}
                    containerClass={"mt-6 mb-4 w-fit"}
                  /></div>
                <div>
                  <Typography text={Locale.wrongEmail} />
                  <Typography
                    text={Locale.editHere}
                    textClasses={"ml-1 !text-blue-400 cursor-pointer"}
                    onTextClick={onEditEmailClick}
                  />
                </div>
                <Button
                  loadingTitle={isSendOtpLoading ? Locale.loginSending : Locale.loginVerifying}
                  isLoading={isVerifyOtpLoading || isSendOtpLoading}
                  isDisabled={!needsNewCode && otp.length !== LOGIN_OTP_LENGTH}
                  title={needsNewCode && !otp ? Locale.loginNewCode : Locale.verifyOTP}
                  onButtonClick={onVerifyOTPClick}
                  buttonClass={"mt-auto !w-full justify-center"}
                  textClasses={"flex-1 flex justify-center"}
                />
              </CustomisedNavigationForm>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReferralEmailLoginFlowMobile;
