import axios from "axios";
import * as Sentry from "@sentry/nextjs";

export const logExceptionToSentry = (fileName: string, errorMessage: string): void => {
  try {
    Sentry.captureException(`[${fileName}] ~ ${errorMessage}`, { level: "error" });
  } catch {
    // Sentry failures must never impact the app flow
  }
};

export const logApiFailureToSentry = (fileName: string, apiUrl: string, requestBody: unknown, error: unknown): void => {
  try {
    const errorResponseBody = axios.isAxiosError(error) ? error.response?.data ?? { message: error.message } : error;
    Sentry.captureException(
      `[${fileName}] ~ "${apiUrl}", ${JSON.stringify(requestBody ?? {})}, ${JSON.stringify(errorResponseBody ?? {})}`,
      { level: "error" }
    );
  } catch {
    // Sentry failures must never impact the app flow
  }
};
