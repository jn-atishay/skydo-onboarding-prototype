// Fixtures for the focused home screen, the test payment and its tracking page.
//
// The home screen is the product's "focused home": a list of steps, each NOT_STARTED,
// IN_PROGRESS or COMPLETED. Which stage the demo shows is chosen in the top bar (the
// variant) and advanced by the product's own buttons.
import { getProto } from "../prototype/state";
import { SAMPLE, displayName } from "./fixtures";

export type HomeVariant = "" | "next-payment" | "receive" | "test" | "method" | "share" | "tracking";

/** The test payment's amount. Production sends USD 0.10 (captures, September 2026). */
export const TEST_AMOUNT = 0.1;

/** Set when the product's "Receive test payment" call has been answered. */
let testPaid = false;
export function markTestPaid(v = true) {
  testPaid = v;
}
export function isTestPaid() {
  return testPaid;
}

const s = (component: string, componentState: string) => ({ component, componentState });

export function focusedHomeFixture() {
  const variant = getProto().variant as HomeVariant;
  const stepsVisible = variant !== "" && variant !== "next-payment";
  const done = testPaid || ["method", "share", "tracking"].includes(variant);

  let states;
  if (variant === "share") {
    states = [s("TEST_TRANSACTION", "COMPLETED"), s("PAYMENT_METHOD", "COMPLETED"), s("PAYMENT_DETAIL", "IN_PROGRESS")];
  } else if (done) {
    states = [s("TEST_TRANSACTION", "COMPLETED"), s("PAYMENT_METHOD", "IN_PROGRESS"), s("PAYMENT_DETAIL", "NOT_STARTED")];
  } else {
    states = [s("TEST_TRANSACTION", "IN_PROGRESS"), s("PAYMENT_METHOD", "NOT_STARTED"), s("PAYMENT_DETAIL", "NOT_STARTED")];
  }

  return {
    focusedHomeStates: states,
    exporterUseCase: "DIRECTLY_WITH_CLIENTS",
    isInvoiceUploaded: false,
    isTestTransactionSettled: false,
    testAmount: TEST_AMOUNT,
    averageTransaction: null,
    // "Based on your monthly volume of USD 5,000", as in the capture
    monthlyRevenue: "0_10K_USD",
    paymentMethod: "BANK_TRANSFER",
    // The next-payment question is asked when there is no recent answer
    isPaymentTimelineExpired: true,
    isVkycInitiated: false,
    isConfettiShown: true,
    isReceivePaymentContinueExpired: !stepsVisible,
  };
}

function isoDaysAgo(days: number, hour = 23, minute = 33) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/**
 * The test payment as its tracking page reads it. Names and references follow the
 * backend's test-payment constants: sent by "Skydo Inc", invoice Test-INV-001,
 * settlement reference Test-SRN-001, no fees. Only the first stage (money received in
 * the Skydo account) is complete, as in the capture.
 */
export function testPaymentFixture() {
  const received = isoDaysAgo(0);
  const settleBy = new Date();
  settleBy.setDate(settleBy.getDate() + 1);
  const audit = [
    {
      id: 9001,
      createdAt: received,
      actionTimestamp: received,
      transactionState: "VIRTUAL_ACCOUNT_SUCCESS",
      amount: TEST_AMOUNT,
      amountSettled: 0,
      currency: "USD",
      srn: "Test-SRN-001",
    },
  ];
  const transaction = {
    id: 9001,
    transactionId: 9001,
    createdAt: received,
    actionTimestamp: received,
    transactionState: "VIRTUAL_ACCOUNT_SUCCESS",
    amount: TEST_AMOUNT,
    amountSettled: 0,
    currency: "USD",
    srn: "Test-SRN-001",
    settlementDate: settleBy.toISOString(),
    // "Expected INR settlement" on the tracking page: the next day, as in the capture
    transactionMetadata: { expectedSettlementDate: settleBy.toISOString() },
    transactionAudit: audit,
    transactionIncident: [],
    funding: [],
    collectionType: "REGULAR",
    payment: {
      id: 9001,
      fxDeal: null,
      transaction: [],
      cashBackRecord: null,
      manualCashBackEntry: null,
      rewardLedger: null,
      sezType: false,
    },
    pricingRecord: { totalFees: 0, inrFees: 0, gstFees: 0, usdCharges: 0 },
  };
  return {
    invoiceType: "SYSTEM_GENERATED",
    invoiceId: 9001,
    id: 9001,
    amount: TEST_AMOUNT,
    amountMapped: TEST_AMOUNT,
    expectedAmount: TEST_AMOUNT,
    expectedCurrency: "USD",
    currency: "USD",
    submittedDate: received,
    raisedDate: received,
    exporterSystemInvoiceId: "Test-INV-001",
    fileLink: "",
    status: "PAID",
    isTest: true,
    isRefundable: false,
    didSendInvoiceOrReminderEmail: false,
    purposeOfInvoice: "P0802",
    purposeCode: { purposeCode: "P0802", description: "Software consultancy/implementation" },
    reasonToArchive: "",
    importer: { businessName: "Skydo Inc", country: "United States", name: "Skydo Inc" },
    importerName: "Skydo Inc",
    invoiceMetadata: { source: "SYSTEM_GENERATED" },
    bankAccount: {
      accountNumber: SAMPLE.bankAccount,
      ifscCode: SAMPLE.ifsc,
      accountHolderName: displayName(),
    },
    transaction: [transaction],
  };
}

/** The customer's signed-in details, as the dashboard reads them. */
export function loggedInUserFixture() {
  return {
    emailAddress: SAMPLE.email,
    fullName: SAMPLE.legalName,
    registeredName: SAMPLE.name.split(" ")[0],
    exporterId: "1",
  };
}

/** The dashboard's customer record once the international accounts exist. */
export function dashboardDataFixture() {
  const p = getProto();
  return {
    dashboardVersion: "SKYDO_PAYOUTS",
    unmappedFundingList: [],
    userDetailsPreKyc: null,
    isVeemCardSupportedForExporter: false,
    exporterDataForDashboard: {
      fullName: SAMPLE.legalName,
      emailAddress: SAMPLE.email,
      registeredName: SAMPLE.name.split(" ")[0],
      isSkydoInvoiceDisabled: false,
      exporter: {
        onBoardingState: "BENEFICIARY_ACCOUNT_PENDING",
        offboardingType: null,
        isTransacting: false,
        businessLegalName: displayName(),
        correspondentName: SAMPLE.name.split(" ")[0],
        virtualAccountName: displayName(),
        tag: "VKYC",
        businessType: p.businessType,
        gstList: [],
        isAmazonUser: false,
        exporterKyc: { iecDetails: null },
        bankAccount: { isHdfcBankAccount: true, accountNumber: SAMPLE.bankAccount },
        // the USD account the test payment is sent to
        virtualAccount: { accountNumber: SAMPLE.usdAccount },
        userPreference: { skipTestTransactionTutorial: true },
        totalUnsettledFunds: 0,
      },
    },
  };
}

/**
 * The international accounts, as the account-details call returns them. Only the
 * USD account is filled in; it is the one the home screen shows. Sample numbers.
 */
export function virtualAccountsFixture() {
  return {
    virtualAccountRes: {
      data: {
        virtualAccountDetails: {
          virtualAccounts: [
            {
              accountNumber: SAMPLE.usdAccount,
              routingCodeType: "ach_routing_number",
              paymentType: "ACH",
              routingNumber: "000000000",
              bankName: "Sample Bank (prototype)",
              currency: "USD",
              bankAddress: "Sample address",
              accountRole: "PRIMARY",
            },
          ],
        },
      },
    },
    currencyRes: [],
    intAccountPreference: { showNewUI: true },
  };
}
