import beCall from "../../util/beCall";
import { EmailOtpGenerateDto, EmailOtpSubmitDto, GoogleLoginDto, LoginResponseDto, UserSessionDto } from "./AuthApiDto";
import { fetchSessionAndCheckAuthorization } from "../../pages/api/route/session_validator";
import { NextApiRequest, NextPageContext } from "next";

export const loginViaGoogle = async (request: GoogleLoginDto): Promise<LoginResponseDto> => {
  const googleLoginResponse = await beCall<LoginResponseDto>({
    path: "auth/google/login",
    server: "AUTH",
    method: "POST",
    body: request,
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      isUserDetailsRequired: true,
    },
    manageToken: true,
    timeout: 20000,
  });

  if (!googleLoginResponse?.success || !(googleLoginResponse.data as LoginResponseDto)?.token) {
    throw googleLoginResponse;
  }

  return googleLoginResponse?.data as LoginResponseDto;
};

export const generateEmailOtp = async (request: EmailOtpGenerateDto): Promise<string> => {
  const otpResponse = await beCall<string>({
    path: "auth/email/request_otp",
    server: "AUTH",
    method: "POST",
    body: request,
    headers: {
      "Content-Type": "application/json",
    },
    manageToken: true,
    timeout: 20000,
  });

  if (!otpResponse?.success || typeof otpResponse.data !== "string" || !otpResponse.data) {
    throw otpResponse;
  }
  return otpResponse.data as string;
};

export const verifyEmailOtp = async (request: EmailOtpSubmitDto): Promise<any> => {
  const emailLoginResponse = await beCall<LoginResponseDto>({
    path: "auth/email/login",
    server: "AUTH",
    method: "POST",
    body: request,
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      isUserDetailsRequired: true,
    },
    manageToken: true,
    timeout: 20000,
  });

  if (!emailLoginResponse?.success || !(emailLoginResponse.data as LoginResponseDto)?.token) {
    throw emailLoginResponse;
  }

  return emailLoginResponse;
};

export const fetchSessionData = async (token: string, isServer: boolean = false): Promise<UserSessionDto> => {
  const sessionResponse = await beCall<UserSessionDto>({
    path: `auth/session/fetch_session_data/${token}`,
    server: "AUTH",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    ssr: isServer,
    timeout: 15000,
  });

  if (!sessionResponse?.data) {
    throw Error("Api exception");
  }

  return sessionResponse?.data as UserSessionDto;
};

export const fetchSessionDataHttpToken = async (
  ctx: Pick<NextPageContext, "req"> | { req: NextApiRequest } | null
): Promise<UserSessionDto | undefined> => {
  let sessionResponse: UserSessionDto | undefined = undefined;
  const isServer = ctx?.req != undefined;
  if (isServer) {
    sessionResponse = (await fetchSessionAndCheckAuthorization(ctx)).data;
  } else {
    const serverData = await beCall<UserSessionDto>({
      url: `/api/route/session_validator`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      ssr: false,
    });
    if (!serverData?.data) {
      throw Error("Api exception");
    }
    sessionResponse = serverData.data as UserSessionDto;
  }

  return sessionResponse;
};

export const logoutUser = async () => {
  const res = await beCall({
    url: "/api/route/logout",
    path: `auth/session/logout`,
    method: "POST",
    server: "AUTH",
  });
  return;
};
