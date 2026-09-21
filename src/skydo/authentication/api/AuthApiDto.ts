export type GoogleLoginDto = {
  accessToken: string;
  applicationName: string;
};

export type UserSessionDto = {
  isSessionValid: boolean;
  isAuthorized: boolean;
  sessionData?: LoginResponseDto;
};

export type UserSessionWithoutAuthorizationDto = {
  isSessionValid: boolean;
  sessionData?: LoginResponseDto;
};

export type LoginResponseDto = {
  token: string;
  expiryDate: Date;
  provider: string;
  sessionData: Map<string, any>;
  authId: number;
  userName?: string;
  emailId: string;
  success: boolean;
  message: string;
};

export type EmailOtpGenerateDto = {
  email: string;
  applicationName: string;
  resendFlag?: boolean;
};

export type EmailOtpSubmitDto = {
  otp: string;
  correlationId: string;
};

export type ResponseWrapper<T> = {
  success: boolean;
  message: string;
  data?: T;
};
