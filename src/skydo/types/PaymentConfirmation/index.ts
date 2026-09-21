import { ApiFuncParams, EmailTemplate } from "../index";

export interface PaymentConfirmationEmail {
  id: number;
  fundingId: number;
  invoiceId: number;
  sentAt: Date;
  sendMethod: string;
}

export enum PCButtonCase {
  /**
   * User can send email
   */
  EMAIL_BTN = "EMAIL_BTN",
  /**
   * Email is already sent. Show sent date now
   */
  ALREADY_SENT_INFO = "ALREADY_SENT_INFO",
  /**
   * Show nothing.
   */
  SHOW_NOTHING = "SHOW_NOTHING",
}

export interface SendEmailRequest {
  isTesting: boolean;
  to: string[];
  cc?: string[];
  bcc?: string[];
}

export interface PaymentConfirmationEmailReq extends SendEmailRequest {
  invoiceId: string | number;
  fundingIds: (string | number)[];
  isAutoEmailEnabled: boolean;
}

export interface ToggleEmailConfig extends ApiFuncParams {
  importerId: number;
  isEnabled: boolean;
  emailType: EmailTemplate;
}

export interface SaveEmailSReq extends ApiFuncParams {
  importerId: number;
  emails: Array<string>;
}

export interface SendPCSampleEmailReq extends ApiFuncParams {
  isSample: true;
  to: string[];
  importerId: number;
}

export interface SendPCEmailReq extends PaymentConfirmationEmailReq, ApiFuncParams {}

export type ToggleEmailConfigFunc = (toggleEmailConfig: ToggleEmailConfig) => void;
export type SaveEmailsFunc = (req: SaveEmailSReq) => void;
export type SendSampleEmailFunc = (req: SendPCSampleEmailReq) => void;
export type SendPCEmailFunc = (req: SendPCEmailReq) => void;
