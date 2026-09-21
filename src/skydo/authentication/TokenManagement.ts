import { destroyCookie, parseCookies, setCookie } from "nookies";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import * as next from "next";

export type AuthSession = {
  token?: string;
};

export function getAuthSession(ctx?: Pick<next.NextPageContext, 'req'> | { req: next.NextApiRequest } | null): AuthSession {
  const cookies = parseCookies(ctx);
  const token = cookies["token"];
  return {
    token: token,
  };
}

export function setAuthSession(
  ctx: { res: NextApiResponse } | NextPageContext,
  token: string,
  expiryDate: Date
) {
  const diffInSeconds = Math.abs((new Date(expiryDate).getTime() - new Date().getTime()) / 1000);
  // @ts-ignore
  setCookie(ctx, "token", token, {
    expires: new Date(expiryDate),
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
  });
}

export function destroyAuthSession(res: NextApiResponse | NextPageContext | null) {
  // @ts-ignore
  destroyCookie({ res }, "token", {
    path: "/",
  });
  // this can be removed after some time as we are now specifically setting the cookie in '/' path.
  // earlier somehow cookie got saved in '/invoices' path and while destroying it wasn't getting destroyed completely
  // @ts-ignore
  destroyCookie({ res }, "token", {
    path: "/invoices",
  });
  //todo - we can remove access to dashboard once user logs out, but currently we are keeping his dashboard access
  // destroyDashboardRoutesPublicAccess(res);
}
