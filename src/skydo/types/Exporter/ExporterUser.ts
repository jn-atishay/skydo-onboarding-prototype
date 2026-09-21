import { UserPreference } from "../DashboardContainer";
import { DefaultPurposeCode, VerificationStatus, VirtualAccountDetail } from "../index";
import { ExporterKyc, OnboardingTag, SelectedExporterIndustry, TypeBankDetails } from "../Onboarding";
import { EInvoiceCredentials, GST } from "../NewInvoiceTypes";

export type ExporterUserResponseDto = ExporterUser & {
  exporter?: Exporter;
};

export enum McaDocStatus {
  NOT_REQUIRED = "NOT_REQUIRED",
  REQUIRED = "REQUIRED",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type ExporterUser = {
  id: number;
  fullName: string;
  registeredName?: string;
  userId: number;
  emailAddress: string;
  lastDashboardVisit: string;
  phoneNumber: string;
  whatsAppConsent?: WhatsappConsent;
  isSkydoInvoiceDisabled?: boolean;
};

export type WhatsappConsent = {
  id: string;
  consentType: string;
  userResponse: string;
};

export type Exporter = {
  settlementProductType: string;
  onBoardingState: string;
  offboardingType: string;
  businessType: string;
  isTransacting: boolean;
  userPreference: UserPreference;
  bankAccount: TypeBankDetails;
  virtualAccount: VirtualAccountDetail;
  businessLegalName: string;
  correspondentName: string;
  virtualAccountName: string;
  tag: OnboardingTag;
  defaultPurposeCode: DefaultPurposeCode;
  einvoiceCredentialsList: EInvoiceCredentials[];
  gstList: GST[];
  mcaDocStatus: McaDocStatus;
  exporterIndustry: ExporterIndustry;
  verificationStatus: VerificationStatus[];
  cin: string;
  businessPAN: string;
  isEmailReductionEnabled?: boolean;
  leads?: Leads[];
  businessDescription?: BusinessDescription;
  exporterMilestone?: ExporterMilestone;
  selectedExporterIndustry?: SelectedExporterIndustry;
  exporterKyc?: ExporterKyc;
  exporterNotification?: ExporterNotification[];
  isEbrcFeatureActivated?: boolean;
  isAmazonUser?: boolean;
  totalUnsettledFunds?: number;
  communicationAddress?: string;
  skydoBalanceVendor?: string | null;
  isUaeActivationAllowed?: boolean;
};

export type ExporterMilestone = {
  id: string;
  milestoneType: string;
  currency: string;
  milestoneShowCount: number;
  milestoneYear?: number;
};

export type ExporterNotification = {
  tag: string;
  notificationType: string;
  title: string;
  description: string;
  bodyLink: string;
  date: string;
};

export type Leads = {
  sourceUrl?: string;
  responseDump?: {
    WHY_USE_SKYDO?: string[];
    AVERAGE_TRANSACTION_VALUE?: string[];
    AMAZON_SELLER?: string[];
    PRIMARY_BUSINESS_ACTIVITY?: string[];
    AMAZON_GLOBAL_SELLER_MARKETPLACE_GPT_RELEVANCE?: string[];
    AMAZON_GLOBAL_SELLER_EXPERIENCE?: string[];
  };
};

export type ExporterIndustry = {
  industryId: number;
  industryDescription: string;
  industryInfoResponse: string;
  entryType?: string;
};

export type BusinessDescription = {
  averageTransaction?: string;
  logoUrl?: string;
};
