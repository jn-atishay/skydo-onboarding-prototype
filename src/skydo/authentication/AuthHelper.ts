import { generateEmailOtp, loginViaGoogle, logoutUser, verifyEmailOtp } from "./api/AuthApi";
import { LoginResponseDto, ResponseWrapper } from "./api/AuthApiDto";
import { AUTH_APP_NAME } from "../config";
import { NextPageContext } from "next";
import FE_ROUTES from "../util/feRoutes";
import Router from "next/router";
import { resetAllStores } from "../store";
import useToastMessages from "../store/toastMessages";
import Locale from "../util/locale/en";
import { TOAST_TYPES } from "../constants/atomicConstants";

class AuthHelper {
  async googleLogin(accessToken: string) {
    try {
      const authResponse = await loginViaGoogle({
        accessToken: accessToken,
        applicationName: AUTH_APP_NAME || "SKYDO_WEBSITE_STAGING",
      });
      return authResponse;
    } catch (e) {
      throw e;
    }
  }

  async sendOtpViaEmail(emailId: string, resendFlag: boolean): Promise<string> {
    return await generateEmailOtp({
      email: emailId,
      applicationName: AUTH_APP_NAME || "SKYDO_WEBSITE_STAGING",
      resendFlag: resendFlag,
    });
  }

  async verifyOtp(correlationId: string, otp: string): Promise<ResponseWrapper<LoginResponseDto>> {
    try {
      const response = await verifyEmailOtp({
        otp: otp,
        correlationId: correlationId,
      });
      if (response.success === false) {
        throw response;
      }
      return response;
    } catch (e: any) {
      throw e;
      // return false;
    }
  }
  async logout() {
    try {
      const response = await logoutUser();
    } finally {
      await Router.push(FE_ROUTES.LOGIN);
      resetAllStores();
    }
  }

  async logoutWithRedirect(nextPath: string) {
    try {
      const response = await logoutUser();
    } finally {
      await Router.push(FE_ROUTES.LOGIN + "?redirect=" + encodeURIComponent(nextPath));
      resetAllStores();
      useToastMessages.getState().addToast({
        id: "session-timed-out",
        body: Locale.sessionTimeOut,
        type: TOAST_TYPES.INFO,
      });
    }
  }

  redirectToLoginPage(ctx: NextPageContext) {
    // destroyAuthSession(ctx);
    if (ctx.res) {
      ctx.res.writeHead(307, { Location: FE_ROUTES.LOGIN + "?redirect=" + encodeURIComponent(ctx.asPath as string) });
      ctx.res.end();
    } else {
      Router.replace(FE_ROUTES.LOGIN + "?redirect=" + encodeURIComponent(ctx.asPath as string));
    }
  }

  redirectToOffboardScreen(ctx: NextPageContext) {
    // Don't redirect if we're already on the offboard screen
    if (ctx.pathname === FE_ROUTES.OFFBOARD_SCREEN_ROUTE) {
      return;
    }

    if (ctx.res) {
      ctx.res.writeHead(307, { Location: FE_ROUTES.OFFBOARD_SCREEN_ROUTE });
      ctx.res.end();
    } else {
      Router.replace(FE_ROUTES.OFFBOARD_SCREEN_ROUTE);
    }
  }
}

export default new AuthHelper();
