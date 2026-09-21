import { PurposeCodeDetails } from "../index";
import { EInvoiceCredentials } from "../NewInvoiceTypes";
import { OnboardingTag } from "../Onboarding";
import { ExporterUserResponseDto } from "../Exporter/ExporterUser";
import { UnmappedPaymentData } from "../Funding";
import { PaymentLinkConnectionStatus } from "../PaymentLinkTypes";
import { EbrcBasicDetails } from "../EbrcTypes";
import { DashboardVersionType } from "../DashboardVersionTypes";

export type Value = {
  accountNumber: string;
  achAccountNumber: string;
  exporterUserDetails: ExporterUser;
  purposeCodeDetails: PurposeCodeDetails;
  refetchUserDetails: () => void;
  exporterDetails: ExporterDetails;
  isLoadingContainerData: boolean;
  showEnableEInvoicePopUp: boolean;
  primaryGst: string;
  einvoiceCredentialsList: EInvoiceCredentials[];
  userPreference?: UserPreference;
  lastDashboardVisit: Date;
  isExporterEligibleForInstalinks: boolean;
  isExporterIndustryEligibleForInstalinks: boolean | null;
  hasUaeAccountAccess: boolean;
};

export type UserPreference = {
  skipEInvoice?: boolean;
  skipTestTransactionTutorial?: boolean;
  skipPaypal?: boolean;
  skipZohoSync?: boolean;
  preferences?: {
    mobileMappingBanner?: {
      isSkipped?: boolean;
    };
  };
};

export type ExporterDetails = {
  onBoardingState: string;
  businessLegalName: string;
  correspondentName: string;
  virtualAccountName: string;
  identifier?: string;
  tag: OnboardingTag;
  offboardingType: string;
  totalUnsettledFunds?: number;
};

export type ExporterUser = {
  emailAddress: string;
};

export type NavBarItems = {
  title: string;
  icon?: () => JSX.Element;
  isSelectedFun: (pathname: string) => boolean;
  onClick: () => void;
  subNavItems?: SubNavBarItemDto[];
  isSubNavOpen?: boolean;
};

export type SubNavBarItemDto = NavBarItems & {
  icon?: () => JSX.Element;
  subTitle?: string;
  id: string | number;
  isSuccessful?: boolean;
  href: string;
};

export type UserDetailsPreKycDto = {
  businessName?: string;
  businessWebsite?: string;
  exporterId?: number;
  userId?: number;
};

export type DashboardDataResponseDto = {
  exporterDataForDashboard: ExporterUserResponseDto;
  userDetailsPreKyc: UserDetailsPreKycDto;
  unmappedFundingList: UnmappedPaymentData[];
  paymentLinksConnectionStatus: PaymentLinkConnectionStatus;
  dashboardVersion: DashboardVersionType;
  ebrcDetails: EbrcBasicDetails;
  isVeemCardSupportedForExporter: boolean;
};

export type ExporterCard = {
  businessLegalName?: string;
  correspondentName?: string;
};

export type LoggedInUserDetailsApiResponseDto = {
  exporter: ExporterCard;
  emailAddress: string;
  fullName?: string;
  registeredName: string;
  userId?: number;
  exporterId?: string;
};