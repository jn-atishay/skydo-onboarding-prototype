// Stand-in for the product's analytics hooks. Every tracking call becomes a no-op:
// no Mixpanel, no WebEngage, no Segment, no Google Tag Manager, nothing leaves the page.
import { useEffect, useRef } from "react";

const noop = () => {};
const noopAsync = async () => undefined;

export class Analytics {
  segment: any = {};
  tagManager: any = {};
  trackAsync = noop;
  track = noop;
  page = noop;
  identify = noopAsync;
  identifyUserForAllTools = noopAsync;
  identifyTraitsAsync = noop;
  reset = noop;
}

const instance = new Analytics();

/**
 * Matches the product's two call styles: useAnalytics() returns the object, and
 * useAnalytics(fn) runs fn once the object is ready.
 */
function useAnalytics(callback?: (a: Analytics) => void): Analytics {
  const fired = useRef(false);
  useEffect(() => {
    if (callback && !fired.current) {
      fired.current = true;
      callback(instance);
    }
  }, [callback]);
  return instance;
}

export default useAnalytics;
export const useSegment = () => instance.segment;
export const useTagManager = () => instance.tagManager;
export type SegmentAnalytics = any;
export type TagManagerAction = any;
