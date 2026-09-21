import Locale from "./locale/en";

export const getLoginErrorCode = (error: unknown): string => {
  const value = error as
    | {
        code?: string;
        message?: string;
        failureCode?: number;
        response?: { status?: number; data?: { code?: string; message?: string } };
      }
    | undefined;
  const code = value?.response?.data?.code || value?.response?.data?.message || value?.code || value?.message;
  const known: Record<string, string> = {
    ACCESS_NOT_ALLOWED: "ACCESS_NOT_ALLOWED",
    ACCOUNT_MISMATCH: "ACCOUNT_MISMATCH",
    INVALID_CHALLENGE: "INVALID_CHALLENGE",
    AUTH_TIMEOUT: "AUTH_TIMEOUT",
    SESSION_FAILED: "SESSION_FAILED",
    OTP_EXPIRED: "OTP_EXPIRED",
    INCORRECT_OTP: "INCORRECT_OTP",
    CORRELATION_OTP_ALREADY_USED: "CORRELATION_OTP_ALREADY_USED",
    MAX_RETRIES_REACHED: "MAX_RETRIES_REACHED",
    REGISTRATION_FAILED: "REGISTRATION_FAILED",
    NAVIGATION_FAILED: "NAVIGATION_FAILED",
    "MerchantId does not match with the secret key provided": "ACCOUNT_MISMATCH",
    "User is not whitelisted": "ACCESS_NOT_ALLOWED",
    "Invalid correlation id": "INVALID_CHALLENGE",
    ECONNABORTED: "AUTH_TIMEOUT",
    ERR_NETWORK: "NETWORK_ERROR",
  };
  if (value?.response?.status === 429) return "MAX_RETRIES_REACHED";
  if (value?.failureCode === 12) return "CORRELATION_OTP_ALREADY_USED";
  return known[code || ""] || (value?.response?.status === 401 ? "SESSION_FAILED" : "LOGIN_FAILED");
};
export const getLoginErrorMessage = (error: unknown): string => {
  const messages: Record<string, string> = {
    SESSION_FAILED: Locale.loginSessionFailed,
    OTP_EXPIRED: Locale.loginExpiredCode,
    INCORRECT_OTP: Locale.loginIncorrectCode,
    CORRELATION_OTP_ALREADY_USED: Locale.loginUsedCode,
    MAX_RETRIES_REACHED: Locale.loginRateLimited,
    ACCOUNT_MISMATCH: Locale.loginAccountMismatch,
    ACCESS_NOT_ALLOWED: Locale.loginAccessDenied,
    INVALID_CHALLENGE: Locale.loginExpiredCode,
    AUTH_TIMEOUT: Locale.loginUncertain,
  };
  return messages[getLoginErrorCode(error)] || Locale.loginFailed;
};

export const retryLoginStep = async <T>(
  operation: () => Promise<T>,
  onRetry: () => void,
  retryAllowed = true
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (!retryAllowed || getLoginErrorCode(error) === "SESSION_FAILED") throw error;
    onRetry();
    return operation();
  }
};

export const needsFreshOtp = (error: unknown): boolean =>
  ["OTP_EXPIRED", "CORRELATION_OTP_ALREADY_USED", "INVALID_CHALLENGE", "MAX_RETRIES_REACHED", "AUTH_TIMEOUT"].includes(getLoginErrorCode(error));
