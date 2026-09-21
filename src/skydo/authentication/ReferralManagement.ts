import { destroyCookie, parseCookies, setCookie } from "nookies";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { UTMDetails } from "./UTMManagement";

export type ReferralData = {
  referralCode?: string;
  referralSource?: string;
};

export const initReferral = (ctx: NextPageContext) => {
  const cookies = parseCookies(ctx);
  const existingReferralData = cookies["referralData"];

  // if (!existingReferralData) {
  let referralData: ReferralData = {
    referralCode: ctx.query?.referralCode as string,
    referralSource: ctx.query?.referralSource as string,
  };
  // Saving referral data
  if (referralData.referralCode) {
    saveReferralData(ctx, referralData);
  }
  // }
};

export const saveReferralData = (ctx: NextPageContext, referralData: ReferralData) => {
  let date = new Date(); // Now
  date.setDate(date.getDate() + 90);
  setCookie(ctx, "referralData", JSON.stringify(referralData), {
    expires: date,
    httpOnly: false,
    secure: false,
    path: "/",
  });
};

export function getReferralData(ctx: Pick<NextPageContext, "req"> | { req: NextApiRequest } | null): ReferralData {
  const cookies = parseCookies(ctx);
  const utm = cookies["referralData"];
  try {
    return JSON.parse(utm);
  } catch (e) {
    return {};
  }
}

/**
 * Resolves referral state synchronously during getInitialProps, before any component
 * mounts. A referralCode query param (the landing request) is preferred because the
 * referralData cookie set by initReferral() in the same pass only takes effect on the
 * browser's *next* request, not this one.
 */
export function resolveReferralData(ctx: NextPageContext): ReferralData {
  const referralCode = ctx.query?.referralCode as string | undefined;
  if (referralCode) {
    return { referralCode, referralSource: ctx.query?.referralSource as string | undefined };
  }
  return getReferralData(ctx);
}

export function removeReferralData(res: NextApiResponse | NextPageContext | null) {
  // @ts-ignore
  destroyCookie({ res }, "referralData", {
    path: "/",
  });
}
