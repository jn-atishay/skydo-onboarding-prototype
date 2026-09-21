/**
 * @author Raj Sheth
 * created: 30/10/23
 */
import { Invoice, Transaction } from "../types";
import { PaymentConfirmationData } from "../types/Funding";
import { PCButtonCase } from "../types/PaymentConfirmation";
import { BUTTON_TYPES } from "../constants/atomicConstants";
import { TRANSACTION_STATES, TRANSACTION_STATES_SERIES } from "../constants/dashboardConstants";
import { isPartiallyPaid } from "./functions";

const FIRA_GENERATION_DAYS_GAP = 7;

interface DisplayInfo {
  buttonCase: PCButtonCase;
  buttonType?: string;
  sentAt?: string;
}

export const getPCDisplayInfo = (invoice: Invoice, transaction: Transaction): DisplayInfo => {
  /**
   * visibility conditions:
   *    1. paymentConf is null
   *    2. has been mapped by a transaction (always true for this page)
   *    3. fira generated is not greater than 7 days
   */

  let paymentConf: PaymentConfirmationData | undefined;

  if (transaction.funding?.length === 0) {
    return { buttonCase: PCButtonCase.SHOW_NOTHING };
  }

  /**
   * iterate over each fundingTransactionMap.funding
   * check if funding.paymentConfirmation is null then show true
   */
  transaction.funding?.map((funding) => {
    paymentConf = funding.paymentConfirmation;
  });

  if (paymentConf) {
    return { buttonCase: PCButtonCase.ALREADY_SENT_INFO, sentAt: paymentConf.sentAt };
  }

  let firaTime = transaction.fira?.createdAt;

  if (firaTime) {
    const daysDifference: number = Math.floor(
      (new Date().getTime() - new Date(firaTime).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDifference <= FIRA_GENERATION_DAYS_GAP) {
      return { buttonCase: PCButtonCase.EMAIL_BTN, buttonType: BUTTON_TYPES.SECONDARY };
    }
    return { buttonCase: PCButtonCase.SHOW_NOTHING };
  } else if (
    TRANSACTION_STATES_SERIES.indexOf(transaction.transactionState) >=
    TRANSACTION_STATES_SERIES.indexOf(TRANSACTION_STATES.VIRTUAL_ACCOUNT_SUCCESS)
  ) {
    return {
      buttonCase: PCButtonCase.EMAIL_BTN,
      buttonType: !isPartiallyPaid(invoice) ? BUTTON_TYPES.PRIMARY : BUTTON_TYPES.SECONDARY,
    };
  } else {
    // show nothing
    return { buttonCase: PCButtonCase.SHOW_NOTHING };
  }
};
