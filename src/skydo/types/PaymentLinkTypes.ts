type PPROMerchantStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "INACTIVE" | null;
type PaypalOnboardingStatus = "CREATED" | "COMPLETED" | "REVOKED" | "PENDING" | "CANCELLED" | null;

export type PaymentLinkConnectionStatus = {
  connected: boolean;
  pproStatus: PPROMerchantStatus;
  paypalStatus: PaypalOnboardingStatus;
  enabled: boolean;
};

export interface PaymentLinkState {
  importerId: string;
  clientName: string;
  country: string;
  currency: string;
  invoiceAmount: number;
  invoiceNumber: string;
  description: string;
  passFeeToClient: boolean;
  allowedMethods: string[];
}
