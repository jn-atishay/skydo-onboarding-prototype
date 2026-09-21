/**
 * Instant Settlement FAQ popup content.
 * Edit this file to change questions, answers, or ordering.
 */
export type InstantSettlementFaqItem = {
  /** Full question line, e.g. "1. Will Instant Settlement…?" */
  question: string;
  /** Shown when the row is expanded */
  answer: string;
};

export const INSTANT_SETTLEMENT_FAQ_ITEMS: InstantSettlementFaqItem[] = [
  {
    question: "1. Will Instant Settlement affect Skydo's standard settlement timelines?",
    answer:
      "No. Skydo continues to improve its standard settlement timelines. In fact, 95% of payments on Skydo settle within 24 hours. Settlement timelines may be slightly longer on bank holidays or non-working days, as the forex market remains closed. Instant Settlement feature is simply available for you to use when you need funds urgently.",
  },
  {
    question: "2. Why is there a fee for Instant Settlement?",
    answer:
      "Settling an international payment within minutes involves additional compliance steps and higher banking costs. That's why Instant settlement is offered as an optional paid feature.",
  },
  {
    question: "3. Why can't all payments settle instantly?",
    answer:
      "International payments involve regulatory requirements, banking protocols, and financial risk checks that vary by country, currency, and transaction. Instant Settlement is only available when all of these can be verified in real time, which isn't possible for every payment. Hence, we offer it whenever we can! We aim to bring this to you for all payments.",
  },
  {
    question: "4. When should I use Instant Settlement?",
    answer:
      "Instant Settlement is useful when:\n\n• You need immediate access to funds\n• You want to pay suppliers or employees quickly\n• You are managing tight cash flow timelines.\n\nOtherwise, you can simply wait for the standard settlement cycle.",
  },
  {
    question: "5. Is Instant Settlement mandatory?",
    answer:
      "No. Instant Settlement is completely optional. You can continue with Skydo's standard settlement process exactly as before, with no changes to your pricing or payout timelines. Instant Settlement is just an additional option when you need access to funds faster.",
  },
];
