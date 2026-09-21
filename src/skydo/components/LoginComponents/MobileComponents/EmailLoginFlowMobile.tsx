import { getLoginErrorCode, getLoginErrorMessage, needsFreshOtp } from "../../../util/loginErrors";
import { startLoginJourney, trackLogin } from "../../../analytics/loginJourney";
import LoginRecovery from "../LoginRecovery";
import React, { useRef, useState } from "react";
import useToastMessages from "../../../store/toastMessages";
import useAnalytics from "../../../analytics/useAnalytics";
import useReferralStore from "../../../store/useReferralStore";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { LoginResponseDto } from "../../../authentication/api/AuthApiDto";
import AuthHelper from "../../../authentication/AuthHelper";
import { BUTTON_TYPES, TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import Locale from "../../../util/locale/en";
import { Events } from "../../../analytics/EventConstants";
import { parseErrorMessage } from "../../../util/functions";
import GoogleIcon from "../../Icons/GoogleIcon";
import Typography from "../../AtomicComponents/Typography";
import Button from "../../AtomicComponents/Button";
import classnames from "classnames";
import CustomisedNavigationForm from "../../AtomicComponents/CustomisedNavigationForm";
import ResendOtp from "../../Common/ResendOtp";
import TextInput from "../../AtomicComponents/TextInput";
import useLoginStore from "../../../store/useLoginStore";
import MobileHeader from "../../MobileComponents/MobileHeader";
import useGoogleAuthStore from "../../../store/useGoogleAuthStore";
import OtpInput from "../../AtomicComponents/OTPInput";
import { OtpInputRef } from "../../../types/atomicComponentTypes";
import { isEmail } from "../../../util/email";
import ReferralEmailLoginFlowMobile from "./ReferralEmailLoginFlowMobile";

interface Props {
  className?: string;
  preFilledEmail?: string;
  isEmailDisabled?: boolean;
  platformName?: string;
  isReferred?: boolean;
}

const LOGIN_OTP_LENGTH = 6;

const EmailLoginFlowMobile = (props: Props) => {
  const { className, preFilledEmail, isEmailDisabled, platformName, isReferred } = props;
  const { referrerDetailsViaCode, hasFetchedReferrerDetailsViaCode } = useReferralStore();
  // isReferred (known before mount) picks the layout; ReferralEmailLoginFlowMobile
  // shows skeleton placeholders for the personalized bits until the store settles.
  const isReferralFlow = !!isReferred;
  const requestBusy = useRef(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [needsNewCode, setNeedsNewCode] = useState(false);
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
  const isEmailScreen = !correlationId;

  const isEmailOtpScreen = !!correlationId;
  const loginStore = useLoginStore();

  const loginPageType = isReferralFlow ? "referral" : "standard";

  const successResponse = async (response: TokenResponse) => {
    if (requestBusy.current || loginStore.isBusy) return;
    requestBusy.current = true;
    let authenticated = false;
    try {
      startLoginJourney(analytics, "google");
      const authResponse: LoginResponseDto = await AuthHelper.googleLogin(response.access_token || "");
      authenticated = true;
      trackLogin(analytics, "google_signin_result", { outcome: "success" });
      await loginStore.register(authResponse, analytics);
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
      await loginStore.login({ correlationId, stringOTP: otp, analytics });
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
    otpInputRef.current?.focus(0);
    setOTPError("");
    void sendOtp(undefined, true);
  };

  const renderLoginButtonTitle = () => {
    return (
      <div className={"flex flex-row items-center justify-center flex-1"}>
        <GoogleIcon height={20} width={20} />
        <Typography
          text={Locale.loginButton}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"ml-1.5"}
        />
      </div>
    );
  };
  const renderGoogleLogin = () => {
    return (
      <>
        <Button
          type={BUTTON_TYPES.SECONDARY}
          title={renderLoginButtonTitle()}
          onButtonClick={() => {
            trackLogin(analytics, Events.GOOGLE_SIGNUP_CLICKED, {
              device_type: "mobile",
              login_page_type: loginPageType,
            });
            onButtonClick();
          }}
          buttonClass={"!w-full mb-4"}
          textClasses={"w-full my-4"}
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

  const renderMobilePageLogin = () => {
    return <div className={"flex flex-col !px-6"}>{renderGoogleLogin()}</div>;
  };

  const renderSkydoMobileHeader = () => {
    return (
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
      </>
    );
  };

  if (loginStore.isVerified) {
    return (
      <>
        <MobileHeader />
        <div className={"flex flex-col px-6 py-8"}>
          <div className="flex flex-col gap-6 ">
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
  if (isReferralFlow) {
    return (
      <ReferralEmailLoginFlowMobile
        className={className}
        isEmailScreen={isEmailScreen}
        isEmailOtpScreen={isEmailOtpScreen}
        isEmailDisabled={isEmailDisabled}
        platformName={platformName}
        referrerDetailsViaCode={referrerDetailsViaCode}
        hasFetchedReferrerDetailsViaCode={hasFetchedReferrerDetailsViaCode}
        email={email}
        emailError={emailError}
        onEmailChange={onEmailChange}
        isSendOtpLoading={isSendOtpLoading}
        sendOtp={sendOtp}
        isScriptLoaded={isScriptLoaded && !isGoogleLoading}
        onButtonClick={onButtonClick}
        analytics={analytics}
        onArrowClick={onArrowClick}
        otp={otp}
        onOtpChange={onOtpChange}
        otpInputRef={otpInputRef}
        otpError={otpError}
        onResendOTPClick={onResendOTPClick}
        onEditEmailClick={onEditEmailClick}
        onVerifyOTPClick={onVerifyOTPClick}
        isVerifyOtpLoading={isVerifyOtpLoading}
        needsNewCode={needsNewCode}
        correlationId={correlationId}
      />
    );
  }

  return (
    <>
      <MobileHeader isBackButtonVisible={isEmailOtpScreen} onBackClick={onArrowClick} />
      <div className={classnames("flex flex-col min-h-[calc(100vh-150px)]", className)}>
        {isEmailScreen && !isEmailDisabled && renderMobilePageLogin()}
        {isEmailOtpScreen && (
          <>
            {renderSkydoMobileHeader()}
            <div className={"!px-6"}>
              <CustomisedNavigationForm onSubmit={onVerifyOTPClick}>
                <OtpInput
                  ref={otpInputRef}
                  otp={otp}
                  onChange={onOtpChange}
                  otpLength={LOGIN_OTP_LENGTH}
                  error={otpError}
                  showFieldError
                  onFocus={() =>
                    trackLogin(analytics, Events.LOGIN_SCREEN_OTP_INPUT, { login_page_type: loginPageType })
                  }
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
                  onButtonClick={onVerifyOTPClick}
                  buttonClass={"mt-6 !w-full justify-center"}
                  textClasses={"flex-1 flex justify-center"}
                />
              </CustomisedNavigationForm>
            </div>
          </>
        )}
        {!isEmailOtpScreen && (
          <div className={"!px-6"}>
            <CustomisedNavigationForm onSubmit={(event) => sendOtp(event, false)}>
              <TextInput
                value={email}
                label={Locale.enterEmailtext}
                inputClass={"mt-4"}
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
              {isEmailScreen && !!email ? (
                <Button
                  loadingTitle={Locale.loginSending}
                  isLoading={isSendOtpLoading}
                  onButtonClick={(event) => sendOtp(event, false)}
                  title={Locale.sendOTP}
                  buttonClass={"flex mt-6 !w-full justify-center"}
                  textClasses={"flex-1 flex justify-center"}
                />
              ) : (
                <></>
              )}
            </CustomisedNavigationForm>
          </div>
        )}
      </div>
    </>
  );
};

export default EmailLoginFlowMobile;
