// Stand-in for the product's fetchData(). Every REST call the onboarding screens make
// passes through here and is answered from fixtures. No request leaves the page.
import { SAMPLE, displayName, INDUSTRIES } from "./fixtures";
import { businessTypeFromPan, getProto, usePrototype } from "../prototype/state";
import { resolveQuery } from "./apolloClient";

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

  // --- everything else -----------------------------------------------------
  return ok({});
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
  return response as T;
};

export const postData = fetchData;
export const getData = fetchData;
export default fetchData;
