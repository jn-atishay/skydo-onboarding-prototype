// Stand-in for the product's fetchData(). Every REST call the onboarding screens make
// passes through here and is answered from fixtures. No request leaves the page.
import { SAMPLE, displayName, INDUSTRIES } from "./fixtures";
import { COMPANY_TYPES, StepId, businessTypeFromPan, getProto, usePrototype } from "../prototype/state";
import { resolveQuery } from "./apolloClient";
import {
  dashboardDataFixture,
  focusedHomeFixture,
  loggedInUserFixture,
  markTestPaid,
  testPaymentFixture,
  virtualAccountsFixture,
} from "./homeFixtures";

type Config = {
  path?: string;
  body?: any;
  params?: any;
  method?: string;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
  url?: string;
  [k: string]: any;
};

const ok = (data: any = null, message = "") => ({ success: true, message, data });

/** The sample referrer shown on the referral variant of the sign-up screen. */
export const SAMPLE_REFERRER = {
  referrerId: 4021,
  exporterName: "Rahul Verma",
  campaignName: "Refer and earn",
  refereeRewardValue: 30,
};

/** Sample rupee value of one unit of each currency. Not live rates. */
const SAMPLE_INR: Record<string, number> = { INR: 1, USD: 88.2, GBP: 118.9, EUR: 103.4, CAD: 63.8, AUD: 58.1, SGD: 68.7, AED: 24.0 };

/** A short pause so the product's own loading states are visible in the demo. */
const pause = (ms = 450) => new Promise((r) => setTimeout(r, ms));

function answer(path: string, config: Config): any {
  const p = (path || "").toLowerCase();
  const proto = getProto();

  // --- GraphQL ---------------------------------------------------------------
  // The onboarding screens post their GraphQL documents through this same call,
  // so resolve them from the same fixtures.
  if (p.includes("graphql")) {
    return ok(resolveQuery(config.body?.query));
  }

  // --- PAN -----------------------------------------------------------------
  if (p.includes("create_exporter_with_pan") || p.includes("user_pan_profile")) {
    const submitted = String(config.body?.panNumber || config.body?.pan || proto.panValue || SAMPLE.pan).toUpperCase();
    // The fourth letter decides the business type, exactly as the real rule does.
    const derived = businessTypeFromPan(submitted, proto.hasGst) ?? proto.businessType;
    usePrototype.getState().set({ panValue: submitted, panVerified: true, businessType: derived });
    return ok({
      panNumber: submitted,
      businessType: derived,
      businessLegalName: displayName(),
      name: displayName(),
      address: SAMPLE.address,
      companyRegistrationNumber: SAMPLE.cin,
      dateOfIncorporation: "2021-04-12",
      gstDetails: proto.hasGst ? [{ gstin: "29ABCPS1234K1Z5", status: "ACTIVE" }] : [],
      isPanVerified: true,
    });
  }

  // --- referral --------------------------------------------------------------
  // Only the referral variant of the sign-up screen has a referrer.
  if (p.includes("referrer-details")) {
    if (usePrototype.getState().variant !== "referral") return ok({});
    return ok(SAMPLE_REFERRER);
  }
  if (p.includes("referral")) {
    return ok({});
  }

  // --- industries ----------------------------------------------------------
  if (p.includes("industry_types") || p.includes("industry")) {
    return ok(
      INDUSTRIES.map((i) => ({
        industryId: i.id,
        industryName: i.label,
        label: i.label,
        value: String(i.id),
        riskCategory: i.risk,
      }))
    );
  }

  // --- website check -------------------------------------------------------
  if (p.includes("website") || p.includes("validate")) {
    return ok({ isValid: true, favicon: "", url: config.body?.website ?? "" });
  }

  // --- phone / Aadhaar one-time codes --------------------------------------
  if (p.includes("otp") || p.includes("phone_verification") || p.includes("aadhaar")) {
    return ok({ verified: true, isVerified: true, name: displayName(), maskedAadhaar: "XXXX XXXX 4321" });
  }

  // --- bank ----------------------------------------------------------------
  if (p.includes("bank_account")) {
    return ok({
      isVerified: true,
      isValid: true,
      accountHolderName: displayName(),
      bankBranch: SAMPLE.branch,
      bankName: SAMPLE.bankName,
      accountNumber: config.body?.accountNumber ?? SAMPLE.bankAccount,
      ifscCode: config.body?.ifscCode ?? SAMPLE.ifsc,
    });
  }

  // --- documents -----------------------------------------------------------
  if (p.includes("doc") || p.includes("upload")) {
    return ok({ documentId: "sample-doc-1", status: "UPLOADED", verified: true });
  }

  // --- exchange rates ------------------------------------------------------
  // Sample rates for the savings calculator, not live ones.
  if (p.includes("fxratelist")) {
    const pairs: { base: string; target: string }[] = config.body?.currencyPairList ?? [];
    return ok(
      pairs.map(({ base, target }) => ({
        base,
        target,
        fx_rate: +(SAMPLE_INR[base] / SAMPLE_INR[target]).toFixed(4),
        api_timestamp: String(Math.floor(Date.now() / 1000)),
      }))
    );
  }
  if (p.includes("fxrates/live")) {
    return ok({ base: "USD", target: "INR", fx_rate: SAMPLE_INR.USD, api_timestamp: String(Math.floor(Date.now() / 1000)) });
  }

  // --- first home screen and the test payment ------------------------------
  if (p.includes("focused/home/get/home/state")) return ok("FOCUSED");
  if (p.includes("get_loggedin_user_details")) return ok(loggedInUserFixture());
  if (p.includes("/api/dashboard-data")) return ok(dashboardDataFixture());
  if (p.includes("get-all-account-details")) return ok(virtualAccountsFixture());
  if (p.includes("/api/focused-home")) return ok(focusedHomeFixture());
  if (p.includes("dashboard/version/get")) return ok({ version: "SKYDO_PAYOUTS" });
  if (p.includes("test/transaction/initiate")) {
    markTestPaid(true);
    return ok(true);
  }
  if (p.includes("invoice_details")) return ok(testPaymentFixture());

  // --- everything else -----------------------------------------------------
  return ok({});
}

/**
 * When the customer completes a step with the product's own button, move the
 * prototype on to the next screen, as the real backend would by changing their state.
 */
function advanceAfter(path: string) {
  const p = (path || "").toLowerCase();
  const { step, businessType, set } = usePrototype.getState();
  const isCompany = COMPANY_TYPES.includes(businessType);
  let next: StepId | null = null;
  if (p.includes("accept/tnc_privacy")) next = "pan";
  else if (p.includes("create_exporter_with_pan") && step === "pan") next = "business-details";
  else if (p.includes("submit/company_details")) next = "aadhaar";
  else if (p.includes("verify/user_phone_otp")) next = isCompany ? "management" : "bank";
  else if (p.includes("update/ubo_details")) next = "bank";
  else if (p.includes("bank_account_submit")) next = "verification";
  else if (p.includes("submit/exporter_kyc_document")) next = "verification";
  // On the home screen the stage lives in the variant.
  if (step === "home") {
    const v = usePrototype.getState().variant;
    let nextVariant: string | null = null;
    if (p.includes("focused/home/set/payment/timeline")) nextVariant = "receive";
    else if (p.includes("focused/home/set/payment/method")) nextVariant = "share";
    if (nextVariant && nextVariant !== v) window.setTimeout(() => set({ variant: nextVariant as string }), 0);
    return;
  }
  if (next && next !== step) {
    window.setTimeout(() => set({ step: next as StepId, verificationStage: "submitted" }), 0);
  }
}

export const fetchData = async <T>(config: Config): Promise<any> => {
  await pause();
  const path = config.path ?? config.url ?? "";
  // Visible in the browser console so it is obvious which calls a screen makes.
  console.debug("[prototype] fixture call:", path, config.body ?? "");
  let response: any;
  try {
    response = answer(path, config);
  } catch (e) {
    response = ok({});
  }
  if (config.onSuccess) config.onSuccess(response);
  advanceAfter(path);
  return response as T;
};

export const postData = fetchData;
export const getData = fetchData;
export default fetchData;
