import { PreferredEmail } from "../PaymentsReminder/ReminderPopupEntry";
import { ReactElement } from "react";
import { SendEmailRequest } from "../../types/PaymentConfirmation";

/**
 * Left Component props
 */
interface EmailFormSectionProps {
  title: string;
  attachmentFileName?: string;
  preferredEmails?: PreferredEmail[];
  isDataFetched: boolean;
  onSendEmail: (request: SendEmailRequest) => Promise<any>;

  /* Events related functions */
  onTestEmailSectionClickEvent?: () => void;
  onTestToFocusEvent?: () => void;
  onTestSendClickEvent?: () => void;
  onToFocusEvent?: () => void;
  onCcFocusEvent?: () => void;
  onBccFocusEvent?: () => void;
  onSendClickEvent?: () => void;

  renderBelowBccFields?: () => React.ReactNode;
}

interface EmailFormOverrideProps {
  renderLeftSection: () => ReactElement;
}

/**
 * 1. Either of EmailFormSectionProps or EmailFormOverrideProps is required
 * 2. Both cannot be present at the same time
 */
export type LeftSectionBase =
  | ({ emailFormSection: EmailFormSectionProps } & Partial<{ emailFormOverride: never }>)
  | ({ emailFormOverride: EmailFormOverrideProps } & Partial<{ emailFormSection: never }>);
