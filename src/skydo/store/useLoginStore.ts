import { LoginDetails } from "../types/Login";
import { LOGIN_NAVIGATION_TIMEOUT_MS, LOGIN_REQUEST_TIMEOUT_MS } from "../constants/loginConstants";
import { retryLoginStep } from "../util/loginErrors";
import { create } from "./index";
import { trackLogin, startLoginJourney, clearLoginJourney } from "../analytics/loginJourney";
import { getLoginErrorCode } from "../util/loginErrors";
import { LoginResponseDto, ResponseWrapper } from "../authentication/api/AuthApiDto";
import beCall, { fetchData } from "../util/beCall";
import { getUTMParams } from "../authentication/UTMManagement";
import { getReferralData, removeReferralData } from "../authentication/ReferralManagement";
import { DESKTOP_MIN_WIDTH } from "../constants/atomicConstants";
import { RegisterResponse } from "../types";
import { Events } from "../analytics/EventConstants";
import FE_ROUTES from "../util/feRoutes";
import { USER_STATES } from "../constants/onboarding";
import { Analytics } from "../analytics/useAnalytics";
import Router from "next/router";
import useUserData from "./useUserData";
import { getRedirectionUrl } from "../util/functions";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import AuthHelper from "../authentication/AuthHelper";

// Tokens stay in memory, outside the persisted/devtools-visible store.
let verifiedResponse: LoginResponseDto | null = null;
let registration: RegisterResponse | null = null;
let registrationDetailsComplete = false;
let active: Promise<void> | null = null;
let automaticRetryUsed = { registration: false, navigation: false };

const navigateToAccount = async (url: string): Promise<void> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const arrived = await Promise.race([
      Router.push(url),
      new Promise<boolean>((_, reject) => {
        timer = setTimeout(() => reject({ code: "NAVIGATION_FAILED" }), LOGIN_NAVIGATION_TIMEOUT_MS);
      }),
    ]);
    if (!arrived) throw { code: "NAVIGATION_FAILED" };
  } finally {
    clearTimeout(timer);
  }
};

const useLoginStore = create<LoginDetails>()((set, get) => ({
  isVerified: false,
  isBusy: false,
  resetLogin: () => {
    if (active || get().isBusy) return;
    verifiedResponse = null;
    registration = null;
    registrationDetailsComplete = false;
    automaticRetryUsed = { registration: false, navigation: false };
    set({ isVerified: false });
    clearLoginJourney();
  },
  register: (authResponse: LoginResponseDto, analytics: Analytics) => {
    if (active) return active;
    if (!verifiedResponse) trackLogin(analytics, "authentication_succeeded");
    if (verifiedResponse?.token !== authResponse.token) {
      registration = null;
      registrationDetailsComplete = false;
      automaticRetryUsed = { registration: false, navigation: false };
    }
    verifiedResponse = authResponse;
    set({ isVerified: true, isBusy: true });
    active = (async () => {
      try {
        startLoginJourney(analytics, authResponse.provider === "GOOGLE" ? "google" : "otp");
        if (!registration) {
          registration = await retryLoginStep(
            async () => {
              const result = await fetchData<RegisterResponse>({
                method: "POST",
                url: "/api/login",
                timeout: LOGIN_REQUEST_TIMEOUT_MS,
                redirect: false,
                body: {
                  stage: "register",
                  token: authResponse.token,
                  utmAttributes: getUTMParams(null),
                  referralData: getReferralData(null),
                },
              });
              if (!result.success || !result.data) throw result;
              return result.data;
            },
            () => {
              automaticRetryUsed.registration = true;
              trackLogin(analytics, "login_automatic_retry", { stage: "registration" });
            },
            !automaticRetryUsed.registration
          );
          trackLogin(analytics, "account_access_result", {
            outcome: registration.isDomainRegistered ? "access_required" : "allowed",
            is_new_user: registration.isNewUser,
          });
        }
        if (!registrationDetailsComplete) {
          if (!registration.isDomainRegistered) {
            const details = await retryLoginStep(
              async () => {
                const result = await fetchData<RegisterResponse>({
                  method: "POST",
                  url: "/api/login",
                  timeout: LOGIN_REQUEST_TIMEOUT_MS,
                  redirect: false,
                  body: { token: authResponse.token, stage: "details" },
                });
                if (!result.success || !result.data) throw result;
                return result.data;
              },
              () => {
                automaticRetryUsed.registration = true;
                trackLogin(analytics, "login_automatic_retry", { stage: "details" });
              },
              !automaticRetryUsed.registration
            );
            registration = {
              ...registration,
              phoneNumber: details.phoneNumber,
              onboardingState: details.onboardingState,
            };
          }
          registrationDetailsComplete = true;
          if (registration.userId) {
            try {
              analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.SIGN_UP_SUCCESS, {
                email_address: authResponse.emailId,
                country: "IN",
              });
            } catch {
              /* Marketing delivery must not hold the verified session. */
            }
            try {
              void analytics
                ?.identifyUserForAllTools(String(registration.userId), {
                  email: authResponse.emailId,
                  transacting: registration.isTransacting,
                  onboardingState: registration.onboardingState,
                })
                .catch(() => undefined);
            } catch {
              /* Identity tracking must not hold the verified session. */
            }
          }
        }
        if (!registration.isDomainRegistered) {
          useUserData.getState().setUserDetails({
            userState: registration.onboardingState || USER_STATES.NO_STATE,
            phoneNumber: registration.phoneNumber || "",
          });
        }
        const isMobile = window.innerWidth < DESKTOP_MIN_WIDTH;
        const redirect = typeof Router.query.redirect === "string" ? Router.query.redirect : undefined;
        const destination = registration.isDomainRegistered
          ? `${FE_ROUTES.USER_ACCESS}?domain=${encodeURIComponent(authResponse.emailId.split("@")[1] || "")}`
          : getRedirectionUrl(
              registration.onboardingState || "",
              registration.phoneNumber || "",
              isMobile,
              registration.mobileDashDirectionData,
              redirect
            );
        trackLogin(analytics, "login_handoff_started", { access_required: !!registration.isDomainRegistered });
        await retryLoginStep(
          () => navigateToAccount(destination),
          () => {
            automaticRetryUsed.navigation = true;
            trackLogin(analytics, "login_automatic_retry", { stage: "navigation" });
          },
          !automaticRetryUsed.navigation
        );
        if (!registration.isDomainRegistered)
          trackLogin(analytics, Events.LOGIN_SUCCESS, { isNewUser: registration.isNewUser });
        removeReferralData(null);
        verifiedResponse = null;
        registration = null;
        registrationDetailsComplete = false;
        set({ isVerified: false });
      } catch (error: unknown) {
        if (getLoginErrorCode(error) === "SESSION_FAILED") {
          verifiedResponse = null;
          registration = null;
          registrationDetailsComplete = false;
          set({ isVerified: false });
        }
        trackLogin(analytics, Events.LOGIN_FAILURE, {
          stage: registration
            ? registrationDetailsComplete || registration.isDomainRegistered
              ? "navigation"
              : "details"
            : "registration",
          error_code: getLoginErrorCode(error),
        });
        trackLogin(analytics, "login_recovery_shown", {
          stage: registration
            ? registrationDetailsComplete || registration.isDomainRegistered
              ? "navigation"
              : "details"
            : "registration",
          error_code: getLoginErrorCode(error),
        });
        throw error;
      } finally {
        active = null;
        set({ isBusy: false });
      }
    })();
    return active;
  },
  savePhone: async ({
    onSuccess,
    onError,
    mobile,
    fromMobile,
    whatsappConsent,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
    mobile: string;
    fromMobile: boolean;
    whatsappConsent: boolean;
  }) => {
    await beCall({
      path: BE_ROUTES.SUBMIT_PHONE_NO,
      method: ALLOWED_METHODS.POST,
      body: {
        phoneNumber: mobile,
        whatsappConsent: whatsappConsent,
      },
      params: {
        isUserDetailsRequired: true,
      },
      onSuccess: (response: ResponseWrapper<boolean>) => {
        if (response.success) {
          onSuccess?.();
        } else {
          onError?.();
        }
      },
      onError: () => {
        onError?.();
      },
    });
  },
  updateWhatsAppConsent: async ({
    onSuccess,
    onError,
    fromMobile,
    whatsappConsent,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
    fromMobile: boolean;
    whatsappConsent: boolean;
  }) => {
    await beCall({
      path: BE_ROUTES.UPDATE_WHATSAPP_CONSENT,
      method: ALLOWED_METHODS.POST,
      body: {
        whatsappConsent: whatsappConsent,
      },
      params: {
        isUserDetailsRequired: true,
      },
      onSuccess: (response: ResponseWrapper<boolean>) => {
        if (response.success) {
          onSuccess?.();
        } else {
          onError?.();
        }
      },
      onError: () => {
        onError?.();
      },
    });
  },
  login: async ({ correlationId, stringOTP, analytics, complete }) => {
    if (active) return active;
    if (!get().isVerified) {
      verifiedResponse = null;
      registration = null;
      registrationDetailsComplete = false;
      automaticRetryUsed = { registration: false, navigation: false };
    }
    const finish = async (response: LoginResponseDto) => {
      if (!complete) return get().register(response, analytics);
      // Caller-owned flows (such as invoice finalization) must keep their own completion path.
      if (!verifiedResponse) trackLogin(analytics, "authentication_succeeded");
      verifiedResponse = response;
      set({ isVerified: true, isBusy: true });
      try {
        await complete(response);
        verifiedResponse = null;
        registration = null;
        registrationDetailsComplete = false;
        automaticRetryUsed = { registration: false, navigation: false };
        set({ isVerified: false });
      } catch (error: unknown) {
        if (getLoginErrorCode(error) === "SESSION_FAILED") {
          verifiedResponse = null;
          registration = null;
          registrationDetailsComplete = false;
          set({ isVerified: false });
        }
        throw error;
      } finally {
        set({ isBusy: false });
      }
    };
    if (get().isBusy) return;
    if (verifiedResponse) return finish(verifiedResponse);
    set({ isBusy: true });
    let response: ResponseWrapper<LoginResponseDto>;
    try {
      startLoginJourney(analytics, "otp");
      trackLogin(analytics, "otp_verify_started", { challenge_id: correlationId });
      response = await AuthHelper.verifyOtp(correlationId, stringOTP);
      if (!response.success || !response.data) throw response;
      trackLogin(analytics, "otp_verify_result", { outcome: "success", challenge_id: correlationId });
      trackLogin(analytics, Events.EMAIL_OTP_SUBMIT, { success: true });
      trackLogin(analytics, Events.LOGIN_SCREEN_OTP_SUCCESS);
    } catch (error: unknown) {
      const code = getLoginErrorCode(error);
      trackLogin(analytics, "otp_verify_result", { outcome: "failure", challenge_id: correlationId, error_code: code });
      trackLogin(analytics, Events.EMAIL_OTP_SUBMIT, { success: false, message: code });
      trackLogin(analytics, Events.LOGIN_SCREEN_OTP_ERROR, { error_code: code });
      throw error;
    } finally {
      set({ isBusy: false });
    }
    return finish(response.data);
  },
}));
export default useLoginStore;
