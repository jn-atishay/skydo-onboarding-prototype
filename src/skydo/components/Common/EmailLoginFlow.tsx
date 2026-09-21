import { getLoginErrorCode, getLoginErrorMessage, needsFreshOtp } from "../../util/loginErrors";
import { startLoginJourney, trackLogin } from "../../analytics/loginJourney";
import LoginRecovery from "../LoginComponents/LoginRecovery";
import useLoginStore from "../../store/useLoginStore";
//Sep 2023

import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import ResendOtp from "./ResendOtp";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import TextInput from "../AtomicComponents/TextInput";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  INPUT_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import React, { useEffect, useRef, useState } from "react";
import RightArrow from "../Icons/RightArrow";
import GoogleIcon from "../Icons/GoogleIcon";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import AuthHelper from "../../authentication/AuthHelper";
import { Events } from "../../analytics/EventConstants";
import { parseErrorMessage } from "../../util/functions";
import useAnalytics from "../../analytics/useAnalytics";
import classnames from "classnames";
import { LoginResponseDto, ResponseWrapper } from "../../authentication/api/AuthApiDto";
import useToastMessages from "../../store/toastMessages";
import useReferralStore from "../../store/useReferralStore";
import useGoogleAuthStore from "../../store/useGoogleAuthStore";
import { isEmail } from "../../util/email";
import OtpInput from "../AtomicComponents/OTPInput";
import { OtpInputRef } from "../../types/atomicComponentTypes";
import { getRefereeRewardValue } from "../../util/referralUtil";
import SignUpButtonTitle from "../LoginComponents/SignUpButtonTitle";
import ReferralRewardDivider from "../LoginComponents/ReferralRewardDivider";

interface Props {
  containerClass?: string;
  className?: string;
  loginHeaderText?: string;
  register: (authResponse: LoginResponseDto, isGoogleLogin?: boolean) => Promise<void>;
  isInputSizeMedium?: boolean;
  isTopArrowHidden?: boolean;
  preFilledEmail?: string;
  isEmailDisabled?: boolean;
  platformName?: string;
  isReferred?: boolean;
}

const LOGIN_OTP_LENGTH = 6;

const EmailLoginFlow = (props: Props) => {
  const {
    isTopArrowHidden,
    isInputSizeMedium,
    containerClass,
    className,
    register,
    preFilledEmail,
    isEmailDisabled,
    platformName,
    isReferred,
  } = props;

  const requestBusy = useRef(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [needsNewCode, setNeedsNewCode] = useState(false);
  const loginStore = useLoginStore();
  const [email, setEmail] = useState(preFilledEmail || "");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [correlationId, setCorrelationId] = useState("");
  const [isSendOtpLoading, toggleSendOptLoading] = useState(false);
  const [otpError, setOTPError] = useState("");
  const otpInputRef = useRef<OtpInputRef>(null);
  const [isVerifyOtpLoading, setVerifyLoading] = useState(false);

  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const { isScriptLoaded } = useGoogleAuthStore();
  const analytics = useAnalytics();
  const isEmailScreen = !!email;

  const { referrerDetailsViaCode, hasFetchedReferrerDetailsViaCode } = useReferralStore();
  // Shape (this component vs. the standard flow, "Create your account" copy, CTA text)
  // renders off isReferred alone — known before mount, no network dependency — so there
  // is never a shape-level flash. Only the reward amount below waits on real data, and
  // shows a skeleton rather than a guessed value while it does.
  const isReferralFlow = !!isReferred;

  const isEmailOtpScreen = isEmailScreen && correlationId;
  const earnedRewardQty = getRefereeRewardValue(referrerDetailsViaCode);
  const isRewardDividerVisible = !hasFetchedReferrerDetailsViaCode || earnedRewardQty !== undefined;
  const loginPageType = isReferralFlow ? "referral" : "standard";

  useEffect(() => {
    if (isReferralFlow && hasFetchedReferrerDetailsViaCode) {
      trackLogin(analytics, Events.REFERRAL_LOGIN_PAGE_LOAD, {
        device_type: "desktop",
        referrer_expID: referrerDetailsViaCode?.referrerId,
      });
    }
  }, [isReferralFlow, hasFetchedReferrerDetailsViaCode, referrerDetailsViaCode?.referrerId]);

  const successResponse = async (response: TokenResponse) => {
    if (requestBusy.current || loginStore.isBusy) return;
    requestBusy.current = true;
    let authenticated = false;
    try {
      startLoginJourney(analytics, "google");
      const authResponse: LoginResponseDto = await AuthHelper.googleLogin(response.access_token || "");
      authenticated = true;
      trackLogin(analytics, "google_signin_result", { outcome: "success" });
      await register(authResponse, true);
    } catch (e) {
      trackLogin(analytics, "login_error_shown", {
        stage: authenticated ? "registration" : "google",
        error_code: getLoginErrorCode(e),
      });
      if (!authenticated) {
        trackLogin(analytics, "google_signin_result", { outcome: "failure", error_code: getLoginErrorCode(e) });
        trackLogin(analytics, "authentication_failed", { error_code: getLoginErrorCode(e), auth_method: "google" });
      }
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "login_error",
        body: useLoginStore.getState().isVerified ? Locale.loginVerified : Locale.loginGoogleFailed,
      });
    } finally {
      requestBusy.current = false;
      setGoogleLoading(false);
    }
  };
  const onOtpChange = (otpValue: string) => {
    if (requestBusy.current || loginStore.isBusy || loginStore.isVerified) return;
    setOtp(otpValue);
    setOTPError("");
    if (otpValue) setNeedsNewCode(false);
  };

  const onEditEmailClick = () => {
    if (requestBusy.current || loginStore.isBusy || loginStore.isVerified) return;
    loginStore.resetLogin();
    setNeedsNewCode(false);
    setCorrelationId("");
  };

  const sendOtp = async (
    event: undefined | KeyboardEvent | React.MouseEvent<HTMLButtonElement>,
    resendFlag: boolean
  ) => {
    if (requestBusy.current || loginStore.isBusy || loginStore.isVerified) return;

    if (!resendFlag) {
      trackLogin(analytics, Events.LOGIN_SCREEN_SIGNUP_CLICKED, { login_page_type: loginPageType });
    }
    if (!email) {
      if (isReferralFlow) {
        setEmailError(Locale.pleaseEnterValidEmail);
        trackLogin(analytics, Events.LOGIN_SCREEN_SIGNUP_ERROR, { login_page_type: loginPageType });
      }
      return;
    }
    requestBusy.current = true;
    toggleSendOptLoading(true);
    try {
      startLoginJourney(analytics, "otp");
      if (!isEmail(email)) {
        toggleSendOptLoading(false);
        setEmailError(Locale.invalidEmail);
        trackLogin(analytics, Events.LOGIN_SCREEN_SIGNUP_ERROR, { login_page_type: loginPageType });
        return;
      }
      trackLogin(analytics, "otp_send_started", { resend: resendFlag });
      if (resendFlag) trackLogin(analytics, "login_recovery_action", { action: "resend_otp", stage: "otp" });
      const correlationId = await AuthHelper.sendOtpViaEmail(email, resendFlag);
      setCorrelationId(correlationId);
      setOtp("");
      setNeedsNewCode(false);
      setOTPError("");
      trackLogin(analytics, "otp_send_result", { outcome: "success", resend: resendFlag, challenge_id: correlationId });
      toggleSendOptLoading(false);
      trackLogin(analytics, Events.SIGNIN_EMAIL_SUBMIT, { email: email, resendOtp: resendFlag });
    } catch (e) {
      trackLogin(analytics, "login_error_shown", { stage: "otp_send", error_code: getLoginErrorCode(e) });
      const message = Locale.loginSendFailed;
      if (correlationId) setOTPError(message);
      else setEmailError(message);
      trackLogin(analytics, "otp_send_result", { outcome: "failure", error_code: getLoginErrorCode(e) });
      toggleSendOptLoading(false);
      trackLogin(analytics, Events.LOGIN_SCREEN_SIGNUP_ERROR, { login_page_type: loginPageType });
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "login_error",
        body: Locale.loginSendFailed,
      });
    } finally {
      requestBusy.current = false;
      toggleSendOptLoading(false);
    }
  };

  const onEmailChange = (value: string) => {
    if (requestBusy.current || loginStore.isBusy || loginStore.isVerified) return;
    if (isEmailDisabled) return; // Prevent changes if email is disabled
    setEmailError("");
    if (value.length > 0 && !isEmailScreen) {
      trackLogin(analytics, Events.EMAIL_OPT_SCREEN_LOAD, { inputValue: value });
    }
    setEmail(value);
  };
  const login = async () => {
    if (requestBusy.current || loginStore.isBusy) return;
    requestBusy.current = true;
    setVerifyLoading(true);
    try {
      await loginStore.login({ correlationId, stringOTP: otp, analytics, complete: register });
    } catch (error: unknown) {
      trackLogin(analytics, "login_error_shown", {
        stage: useLoginStore.getState().isVerified ? "registration" : "otp_verify",
        error_code: getLoginErrorCode(error),
      });
      if (useLoginStore.getState().isVerified) {
        setOTPError(Locale.loginVerified);
      } else {
        if (["SESSION_FAILED", "ACCESS_NOT_ALLOWED", "ACCOUNT_MISMATCH"].includes(getLoginErrorCode(error))) {
          setCorrelationId("");
          setEmailError(getLoginErrorMessage(error));
        }
        setOTPError(getLoginErrorMessage(error));
        setNeedsNewCode(needsFreshOtp(error));
        setOtp("");
        otpInputRef.current?.focus(0);
      }
    } finally {
      requestBusy.current = false;
      setVerifyLoading(false);
    }
  };
  const onVerifyOTPClick = () => {
    if (requestBusy.current || loginStore.isBusy) return;
    if (needsNewCode && !otp) {
      onResendOTPClick();
      return;
    }
    if (!loginStore.isVerified && (!otp || otp.length !== LOGIN_OTP_LENGTH)) {
      setOTPError(Locale.incorrectOTP);
      return;
    }
    if (!loginStore.isVerified)
      trackLogin(analytics, Events.LOGIN_SCREEN_OTP_SUBMIT, { login_page_type: loginPageType });
    void login();
  };
  const failureResponse = () => {
    requestBusy.current = false;
    setGoogleLoading(false);
    trackLogin(analytics, "google_signin_result", { outcome: "failure", error_code: "GOOGLE_FAILED" });
    trackLogin(analytics, "login_error_shown", { stage: "google", error_code: "GOOGLE_FAILED" });
    trackLogin(analytics, "authentication_failed", { auth_method: "google", error_code: "GOOGLE_FAILED" });
    addToast({ type: TOAST_TYPES.ERROR, id: "google_login_error", body: Locale.loginGoogleFailed });
  };

  const beginGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: (response) => {
      requestBusy.current = false;
      void successResponse(response);
    },
    onError: failureResponse,
    ...{ error_callback: failureResponse },
  });
  const onButtonClick = () => {
    if (requestBusy.current || loginStore.isBusy || loginStore.isVerified) return;
    requestBusy.current = true;
    setGoogleLoading(true);
    try {
      startLoginJourney(analytics, "google", true);
      trackLogin(analytics, "google_signin_started");
      beginGoogleLogin();
    } catch {
      failureResponse();
    }
  };
  const onArrowClick = () => {
    if (requestBusy.current || loginStore.isBusy || loginStore.isVerified) return;
    loginStore.resetLogin();
    setNeedsNewCode(false);
    if (isEmailOtpScreen) {
      // Allow going back from OTP screen to email input screen
      setCorrelationId("");
      return;
    }
    // Prevent going back from email input screen to Google login if email is disabled
    if (isEmailDisabled) return;
    setEmail("");
  };
  const onResendOTPClick = () => {
    if (requestBusy.current || loginStore.isBusy || loginStore.isVerified) return;
    setOtp("");
    setOTPError("");
    otpInputRef.current?.focus(0);
    void sendOtp(undefined, true);
  };

  const renderLoginButtonTitle = () => {
    return (
      <div className={"flex flex-row items-center justify-center flex-1"}>
        <GoogleIcon />
        <Typography
          text={isReferralFlow ? Locale.signUpwithGoogle : Locale.loginButton}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.LARGE}
          textClasses={"ml-1.5"}
        />
      </div>
    );
  };
  const renderGoogleLogin = () => {
    return (
      <>
        {isReferralFlow ? (
          <div className={"flex flex-col gap-1"}>
            <Typography
              text={Locale.createAccountHeader}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
            <Typography
              text={Locale.createAccountSubtext}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_X_SMALL}
              textClasses={"!text-neutral-500 !font-normal"}
              fontWeight={400}
            />
          </div>
        ) : (
          <Typography
            text={props.loginHeaderText || Locale.loginHeader}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
        )}

        <Button
          type={BUTTON_TYPES.SECONDARY}
          size={isInputSizeMedium ? BUTTON_SIZES.MEDIUM : BUTTON_SIZES.LARGE}
          title={renderLoginButtonTitle()}
          onButtonClick={() => {
            trackLogin(analytics, Events.GOOGLE_SIGNUP_CLICKED, {
              device_type: "desktop",
              login_page_type: loginPageType,
            });
            onButtonClick();
          }}
          buttonClass={isInputSizeMedium ? "!w-full mt-8 mb-6" : "!w-full mt-13 mb-8"}
          textClasses={"w-full"}
          loadingTitle={Locale.loginSigningIn}
          isLoading={isGoogleLoading}
          isDisabled={!isScriptLoaded}
        />
        <div className={"content-bwn-line before:border-black-350 after:border-black-350"}>
          <Typography text={Locale.or} type={TYPOGRAPHY_TYPES.LABEL} textClasses={"!text-black-500"} />
        </div>
      </>
    );
  };
  const renderEmailInputHeader = () => {
    return (
      <>
        {!isTopArrowHidden && (!isEmailDisabled || isEmailOtpScreen) ? (
          <div onClick={onArrowClick} className={"cursor-pointer"}>
            <RightArrow />
          </div>
        ) : null}
        {isEmailOtpScreen ? (
          <div
            className={classnames("overflow-hidden text-ellipsis", {
              "mb-8": isTopArrowHidden,
              "!my-13": !isTopArrowHidden,
            })}
          >
            <Typography text={Locale.enterOTP} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />
            <Typography
              text={email}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"ml-1 truncate"}
              typographyProps={{ title: email }}
            />
          </div>
        ) : (
          <Typography
            text={Locale.continueEmail}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={isTopArrowHidden ? "mb-2" : "my-13"}
          />
        )}
      </>
    );
  };
  if (loginStore.isVerified) {
    return (
      <>
        <div
          className={classnames(
            "half-flex bg-white px-10 pt-18 pb-18 rounded-10px shadow-stateIcon flex flex-col",
            containerClass
          )}
        >
          <div className="flex flex-col gap-6 w-92">
            <Typography
              text={Locale.loginVerifiedTitle}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
            {email && <Typography text={email} textClasses="break-all !text-black-500" />}
            {correlationId && (
              <fieldset disabled className="opacity-60">
                <OtpInput otp={otp} onChange={() => {}} otpLength={LOGIN_OTP_LENGTH} />
              </fieldset>
            )}
            <LoginRecovery
              message={Locale.loginVerified}
              action={Locale.loginContinue}
              loading={isVerifyOtpLoading || loginStore.isBusy}
              onRetry={() => {
                trackLogin(analytics, "login_recovery_action", { action: "continue", stage: "completion" });
                void login();
              }}
              onChangeEmail={() => {
                trackLogin(analytics, "login_recovery_action", { action: "restart", stage: "completion" });
                loginStore.resetLogin();
                setCorrelationId("");
                setOtp("");
                setOTPError("");
                setNeedsNewCode(false);
              }}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={classnames(
        "z-10 half-flex bg-white pt-18 pb-18 rounded-10px h-[615px] flex flex-col",
        { "shadow-stateIcon": !isReferralFlow, "px-10": !isReferralFlow },
        containerClass
      )}
    >
      <div
        className={classnames("flex flex-col w-92", isReferralFlow && isEmailOtpScreen ? "flex-1" : "mb-48", className)}
      >
        {isEmailScreen && (!isReferralFlow || isEmailOtpScreen) ? renderEmailInputHeader() : renderGoogleLogin()}
        {isEmailOtpScreen && (
          <CustomisedNavigationForm
            onSubmit={onVerifyOTPClick}
            className={classnames({ "flex flex-col": isReferralFlow })}
          >
            <OtpInput
              otp={otp}
              onChange={onOtpChange}
              otpLength={LOGIN_OTP_LENGTH}
              error={otpError}
              showFieldError
              ref={otpInputRef}
              onFocus={() => trackLogin(analytics, Events.LOGIN_SCREEN_OTP_INPUT, { login_page_type: loginPageType })}
            />
            <div className={needsNewCode ? "invisible" : ""} aria-hidden={needsNewCode}>
              <ResendOtp
                key={correlationId}
                timeToResend={59}
                onResendOTPClick={onResendOTPClick}
                containerClass={"mt-6 mb-4 w-fit"}
              />
            </div>
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
              onButtonClick={() => onVerifyOTPClick()}
              buttonClass={classnames("!w-full justify-center", isReferralFlow ? "mt-7" : "mt-6")}
              textClasses={"flex-1 flex justify-center"}
            />
          </CustomisedNavigationForm>
        )}
        {!isEmailOtpScreen && (
          <CustomisedNavigationForm onSubmit={(event) => sendOtp(event, false)}>
            <TextInput
              value={email}
              label={Locale.enterEmailtext}
              size={isInputSizeMedium ? INPUT_TYPES.MEDIUM : INPUT_TYPES.LARGE}
              inputClass={"mt-6"}
              onChange={onEmailChange}
              isError={!!emailError}
              footerText={!emailError ? undefined : emailError}
              isDisabled={isEmailDisabled}
              labelTextClass={"!text-black-700 mr-1"}
            />
            {isEmailDisabled && platformName && (
              <div className={"mt-2"}>
                <Typography
                  text={Locale.platformLinkedEmailInfo.replace(/:platformName/g, platformName)}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-500"}
                />
              </div>
            )}
            {isEmailScreen || isReferralFlow ? (
              <Button
                loadingTitle={Locale.loginSending}
                isLoading={isSendOtpLoading}
                onButtonClick={(event) => sendOtp(event, false)}
                title={isReferralFlow ? <SignUpButtonTitle /> : Locale.sendOTP}
                size={isReferralFlow || isInputSizeMedium ? BUTTON_SIZES.MEDIUM : BUTTON_SIZES.LARGE}
                buttonClass={"mt-6 !w-full justify-center"}
                textClasses={"flex-1 flex justify-center"}
              />
            ) : (
              <></>
            )}
            {isReferralFlow && isRewardDividerVisible && (
              <ReferralRewardDivider
                earnedRewardQty={earnedRewardQty}
                className={"mt-4"}
                textSize={TYPOGRAPHY_SIZES.MEDIUM}
                fontWeight={700}
              />
            )}
          </CustomisedNavigationForm>
        )}
      </div>
    </div>
  );
};

export default EmailLoginFlow;
