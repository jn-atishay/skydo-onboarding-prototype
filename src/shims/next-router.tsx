// Stand-in for next/router. The real components call useRouter() for navigation and
// query params; here it is wired to the prototype's own hash route so nothing tries to
// reach a server.
import { useCallback, useEffect, useState } from "react";

type Query = Record<string, string | string[] | undefined>;

const listeners = new Set<() => void>();
export function notifyRouter() {
  listeners.forEach((l) => l());
}

function readHash() {
  const raw = typeof window === "undefined" ? "" : window.location.hash.replace(/^#/, "");
  const [path, search] = raw.split("?");
  const query: Query = {};
  new URLSearchParams(search || "").forEach((v, k) => {
    query[k] = v;
  });
  return { asPath: path || "/", pathname: path || "/", query };
}

export function useRouter() {
  const [state, setState] = useState(readHash);
  useEffect(() => {
    const sync = () => setState(readHash());
    window.addEventListener("hashchange", sync);
    listeners.add(sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      listeners.delete(sync);
    };
  }, []);

  const push = useCallback((url: any) => {
    // The prototype owns navigation; real pushes become no-ops so a component
    // cannot redirect the deck away from the screen being demonstrated.
    if (typeof console !== "undefined") {
      console.debug("[prototype] router.push suppressed:", typeof url === "string" ? url : url?.pathname);
    }
    return Promise.resolve(true);
  }, []);

  return {
    ...state,
    isReady: true,
    route: state.pathname,
    basePath: "",
    push,
    replace: push,
    back: () => Promise.resolve(true),
    reload: () => {},
    prefetch: () => Promise.resolve(),
    beforePopState: () => {},
    events: { on: () => {}, off: () => {}, emit: () => {} },
  };
}

const Router = {
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  back: () => {},
  reload: () => {},
  prefetch: () => Promise.resolve(),
  events: { on: () => {}, off: () => {}, emit: () => {} },
  get asPath() {
    return readHash().asPath;
  },
  get query() {
    return readHash().query;
  },
};

export const withRouter = (C: any) => (props: any) => <C {...props} router={useRouter()} />;
export default Router;
