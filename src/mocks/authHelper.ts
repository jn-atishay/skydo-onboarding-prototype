// Stand-in for AuthHelper. There is no login in the prototype: any email is accepted
// and any six-digit code works, so staff can click straight through.
import { SAMPLE } from "./fixtures";

const pause = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const authResponse = (provider = "OTP") => ({
  token: "prototype-session",
  refreshToken: "prototype-refresh",
  provider,
  email: SAMPLE.email,
  isNewUser: true,
});

const AuthHelper = {
  sendOtpViaEmail: async (_email: string, _resend?: boolean) => {
    await pause();
    return "prototype-correlation-id";
  },
  verifyOtp: async () => {
    await pause();
    return authResponse();
  },
  googleLogin: async () => {
    await pause();
    return authResponse("GOOGLE");
  },
  logout: async () => {},
  getToken: () => "prototype-session",
  setToken: () => {},
  isLoggedIn: () => true,
  fetchSession: async () => ({ email: SAMPLE.email, name: SAMPLE.name }),
};

export default AuthHelper;
export const sendOtpViaEmail = AuthHelper.sendOtpViaEmail;
export const googleLogin = AuthHelper.googleLogin;
