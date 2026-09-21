import { NextApiRequest, NextPageContext } from "next";
import requestIp from "request-ip";
import { IncomingMessage } from "http";
import { getAuthSession } from "../authentication/TokenManagement";
import { getSkydoAnonymousId } from "../authentication/PreKycDashboardManagement";
import BASIC_AUTH_ROUTES from "../util/basicAuthRoutes";

type ClientInfo = {
  ipAddress: string;
  agent: string | undefined;
};
const getClientIpAddr = (request?: NextApiRequest | IncomingMessage): ClientInfo => {
  return {
    ipAddress: request ? requestIp.getClientIp(request)?.toString() || "" : "",
    agent: request ? request.headers?.["user-agent"] : "",
  };
};

export default getClientIpAddr;

const getRequiredEnvironmentVariable = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
};

export const getBEPath = (queryParams: { path?: string }) => {
  return queryParams?.path;
};
export const isBasicAuthRequest = (path?: string): boolean => BASIC_AUTH_ROUTES.includes(path as string);
export const generateHeaders = (request: NextApiRequest) => {
  const clientInfo = getClientIpAddr(request);
  const path = getBEPath(request.query);
  const isBasicAuthRoute = isBasicAuthRequest(path);
  const requestHeaders = request.headers || {};
  const acceptHeader = requestHeaders?.accept;
  const authSession = getAuthSession({ req: request });
  const anonymousToken = getSkydoAnonymousId({ req: request });

  return {
    accept: acceptHeader === "*/*" ? "application/json" : acceptHeader,
    "Content-Type": requestHeaders["content-type"] || "application/json",
    "user-agent": requestHeaders["user-agent"],
    ...(authSession.token && !isBasicAuthRoute ? { Authorization: `Bearer ${authSession.token}` } : {}),
    "x-forwarded-for": clientInfo.ipAddress,
    "x-secret-key": getRequiredEnvironmentVariable("NEXT_PUBLIC_MERCHANT_KEY"),
    ...(anonymousToken ? { skydoAnonymousId: anonymousToken } : {}),
  };
};

export const generateHeadersWithCtx = (ctx: NextPageContext) => {
  const clientInfo = getClientIpAddr(ctx.req);
  const requestHeaders = ctx?.req?.headers || {};
  const acceptHeader = requestHeaders?.accept;
  const authSession = getAuthSession(ctx);
  const anonymousToken = getSkydoAnonymousId(ctx);
  return {
    accept: acceptHeader === "*/*" ? "application/json" : acceptHeader,
    "Content-Type": requestHeaders["content-type"] || "application/json",
    "user-agent": requestHeaders["user-agent"],
    ...(authSession.token ? { Authorization: `Bearer ${authSession.token}` } : {}),
    "x-forwarded-for": clientInfo.ipAddress,
    ...(anonymousToken ? { skydoAnonymousId: anonymousToken } : {}),
  };
};
