import { parseCookies, setCookie } from "nookies";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";

export type UTMDetails = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
};
export function getUTMParams(ctx: Pick<NextPageContext, "req"> | { req: NextApiRequest } | null): UTMDetails {
  const cookies = parseCookies(ctx);
  const utm = cookies["utm"];
  try {
    return JSON.parse(utm);
  } catch (e) {
    return {};
  }
}

export function setUTMParams(
  ctx: Pick<NextPageContext, "res"> | { res: NextApiResponse } | null,
  utmDetails: UTMDetails,
  expiryDate: Date
) {
  // @ts-ignore
  setCookie(ctx, "utm", JSON.stringify(utmDetails), {
    expires: new Date(expiryDate),
    httpOnly: false,
    secure: false,
    path: "/",
  });
}
