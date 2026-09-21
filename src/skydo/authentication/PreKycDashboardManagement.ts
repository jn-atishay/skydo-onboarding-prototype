import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { v4 as uuidv4 } from "uuid";

// can't set cookie with null res or context
// can destroy cookie and set cookie with null from client side, but if the function is running on server side it will need context

export const initPreKycDashboard = (ctx: NextPageContext) => {
  if (String(ctx.query?.dA) === "1") {
    setDashboardRoutesPublic(ctx);
  } else if (String(ctx.query?.dA) === "0") {
    destroyDashboardRoutesPublicAccess(ctx);
  }
};

export const createDashboardAccessForSession = () => {
  try {
    window?.sessionStorage?.setItem("dashboard_routes_public", "true");
  } catch (e) {
    console.log("unable to set dashboard public access");
  }
};

export const isDashboardRoutePublicForSession = () => {
  try {
    const access = window?.sessionStorage?.getItem("dashboard_routes_public");
    return access === "true";
  } catch (e) {
    console.log("unable to access session");
    return false;
  }
};

// const export

export function destroySkydoAnonymousId(res: { res: NextApiResponse } | NextPageContext | null) {
  // @ts-ignore
  destroyCookie(res, "skydo_anonymous_id", {
    path: "/",
  });
}

export const getorSetSkydoAnonymousId = (ctx?: NextPageContext) => {
  const cookies = parseCookies(ctx);
  let anonymousId = cookies["skydo_anonymous_id"];
  if (!anonymousId) {
    anonymousId = uuidv4();
    setCookie({ res: ctx?.res }, "skydo_anonymous_id", anonymousId, {
      httpOnly: false,
      secure: false,
      path: "/",
    });
  }
  return anonymousId;
};
export const getSkydoAnonymousId = (req: { req: NextApiRequest } | NextPageContext | null) => {
  const cookies = parseCookies(req);
  return cookies["skydo_anonymous_id"];
};
export const setDashboardRoutesPublic = (ctx: NextPageContext | null) => {
  // @ts-ignore
  setCookie(ctx, "dashboard_routes_public", true, {
    httpOnly: false,
    secure: false,
    path: "/",
  });
};
export const isDashboardRoutesPublic = (req: { req: NextApiRequest } | NextPageContext | null) => {
  const cookies = parseCookies(req);
  return cookies["dashboard_routes_public"] || isDashboardRoutePublicForSession();
};
export const destroyDashboardRoutesPublicAccess = (res: { res: NextApiResponse } | NextPageContext | null) => {
  // @ts-ignore
  destroyCookie(res, "dashboard_routes_public", {
    path: "/",
  });
  try {
    window?.sessionStorage?.removeItem("dashboard_routes_public");
  } catch (e) {
    console.log("unable to remove dashboard access");
  }
};
