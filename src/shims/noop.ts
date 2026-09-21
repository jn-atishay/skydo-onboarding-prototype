// One stand-in for every analytics, monitoring and server-only package the real
// components import. Nothing here sends data anywhere: Mixpanel, WebEngage, Segment,
// Sentry, Google Tag Manager and Usersnap are all inert in the prototype.
//
// The named exports below exist because the bundler resolves named imports at build
// time. Each is a harmless no-op. If a new import appears, the build will name it.
import React from "react";

function noop(): any {
  return noop;
}

const handler: ProxyHandler<any> = {
  get: (_target, prop) => {
    if (prop === "__esModule") return true;
    if (prop === "default") return proxy;
    if (prop === "then") return undefined; // must never look like a promise
    return proxy;
  },
  apply: () => proxy,
  construct: () => proxy,
};

const proxy: any = new Proxy(noop, handler);

export default proxy;

// --- Sentry ---------------------------------------------------------------
export const init = noop;
export const captureException = noop;
export const captureMessage = noop;
export const setUser = noop;
export const setTag = noop;
export const setContext = noop;
export const addBreadcrumb = noop;
export const withScope = noop;
export const configureScope = noop;
export const startTransaction = noop;
export const getCurrentHub = noop;
export const ErrorBoundary = ({ children }: any) => React.createElement(React.Fragment, null, children);
export const withSentryConfig = (c: any) => c;
export const withErrorBoundary = (C: any) => C;

// --- Segment --------------------------------------------------------------
export const AnalyticsBrowser: any = proxy;
export const sleep = async (_ms?: number) => undefined;
export type Context = any;

// --- Google Tag Manager / Usersnap ---------------------------------------
export const TagManager: any = proxy;
export const loadSpace = async () => proxy;
export const loadEmbed = async () => proxy;
export type SpaceApi = any;

// --- Next types that leak into value position -----------------------------
export type NextApiRequest = any;
export type NextApiResponse = any;
export type NextComponentType = any;
export type NextPageContext = any;
export const Document: any = proxy;

// --- PDF viewer (not used by the onboarding screens) ----------------------
export const pdfjs: any = proxy;
export const Page: any = () => null;
export type PDFPageProxy = any;

// --- Redis (server only) --------------------------------------------------
export type RedisOptions = any;

// --- login journey tracking (inert) ---------------------------------------
export const trackLogin = noop;
export const startLoginJourney = noop;
export const clearLoginJourney = noop;
