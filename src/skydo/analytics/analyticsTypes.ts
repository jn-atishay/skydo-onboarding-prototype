export type DataLayerPushDto = {
  event: string;
  extraInfo?: { [key: string]: any };
  eventName?: string;
  userId?: string;
  email?: string;
  eventValue?: string;
};
export type UserAttributes = {
  email: string;
  transacting: boolean;
  onboardingState: string;
  businessLegalName: string;
  businessType: string;
  utmSource: string;
};
