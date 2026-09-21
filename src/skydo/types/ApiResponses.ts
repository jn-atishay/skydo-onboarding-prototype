import {DashboardVersionType} from "./DashboardVersionTypes";

export type ApiResponseWrapper<T> = {
  data: T;
  message?: string;
  success?: true;
  error?: string;
};

export type ExporterOnboardingInfo = {
  basicOnboarding: boolean;
  advancedOnboarding: boolean;
  aadhaarDownload: boolean;
  esign: boolean;
  info: {
    name: string | null;
    companyName: string | null;
    email: string | null;
  };
};

export type ImportersListResponse = {
  id: number;
  businessName: string;
  exporterId: string;
  country: string;
};

export type ExporterBusinessDetails = {
  businessLegalName: string;
  correspondentName: string;
};

export type SecondaryUserAccessDetails = {
  exporterUserEmail: string;
  emailId: string;
  exporter: ExporterBusinessDetails;
};

export type FXRateResponse = {
  api_timestamp: string;
  base: string;
  fx_rate: number;
  target: string;
};

export type VerificationStatus = {
  isVerified: boolean;
  verificationStep: string;
};

export type MobileDashDirectionData = {
  recentPaymentsExist: boolean;
  dashVersion: DashboardVersionType;
  unmappedFundingExists: boolean;
  fundingExists: boolean;
}

export type RegisterResponse = {
  userId: number;
  isNewUser: boolean;
  isDomainRegistered: boolean;
  onboardingState?: string;
  phoneNumber: string;
  isTransacting: boolean;
  mobileDashDirectionData?: MobileDashDirectionData
};
