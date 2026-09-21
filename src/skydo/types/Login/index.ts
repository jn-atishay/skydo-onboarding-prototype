import { Analytics } from "../../analytics/useAnalytics";
import { LoginResponseDto } from "../../authentication/api/AuthApiDto";
export interface LoginJourney {
  id: string;
  method: string;
  origin: string;
  startedAt: number;
}
export interface LoginRecoveryProps {
  message: string;
  action: string;
  loading: boolean;
  onRetry: () => void;
  onChangeEmail?: () => void;
}
export interface MagicLinkProps {
  ready: boolean;
  redirectUrl: string;
  journey: LoginJourney | null;
  isNewUser: boolean;
  identity: { userId: number; email: string; transacting: boolean; onboardingState: string } | null;
}
export interface MagicLinkState {
  isBusy: boolean;
  automaticRetryUsed: boolean;
  reset: () => void;
  proceed: (destination: string, analytics: Analytics) => Promise<void>;
}
export interface LoginDetails {
  isVerified: boolean;
  isBusy: boolean;
  resetLogin: () => void;
  register: (authResponse: LoginResponseDto, analytics: Analytics) => Promise<void>;
  savePhone: ({
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
  }) => void;

  updateWhatsAppConsent: ({
    onSuccess,
    onError,
    fromMobile,
    whatsappConsent,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
    fromMobile: boolean;
    whatsappConsent: boolean;
  }) => void;
  login: ({
    correlationId,
    stringOTP,
    analytics,
  }: {
    correlationId: string;
    stringOTP: string;
    analytics: Analytics;
    complete?: (response: LoginResponseDto) => Promise<void>;
  }) => Promise<void>;
}
