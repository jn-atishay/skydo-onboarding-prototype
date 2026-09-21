import { AnalyticsBrowser, Context } from "@segment/analytics-next";
import * as Sentry from "@sentry/nextjs";
import React, { useEffect } from "react";
import { AnalyticsContext } from "./AnalyticsProvider";
import { UserAttributes } from "./analyticsTypes";
import { getCleanUTM, getUAParserResult } from "./utils";

type TimeoutDto = {
  error: string;
};

export class SegmentAnalytics {
  segment: AnalyticsBrowser;
  indentifyTimeout: number = 600;
  cleanUtm = getCleanUTM();
  result = getUAParserResult();
  constructor(segment: AnalyticsBrowser) {
    this.segment = segment;
    void this.segment.addSourceMiddleware(({ payload, next }) => {
      const result = this.result;
      const cleanUtm = this.cleanUtm;
      payload["obj"]["context"] = {
        ...(payload?.obj?.context || {}),
        campaign: cleanUtm,
        ...result,
      };
      next(payload);
    });
  }

  identify(userId: string, traits?: Partial<UserAttributes>): Promise<Context | TimeoutDto> {
    return Promise.race([
      this.segment.identify(userId, traits),
      new Promise<TimeoutDto>((resolve) => {
        setTimeout(() => {
          resolve({
            error: `identify promise timed out after ${this.indentifyTimeout} milliseconds.`,
          });
        }, this.indentifyTimeout);
      }),
    ]);
  }

  async identifyUserForAllTools(userId: string, traits: Partial<UserAttributes>) {
    await this.identify(userId, traits);
    Sentry.setUser({ id: userId, email: traits?.email });
  }

  identifyTraits(traits: Object): Promise<Context> {
    return this.segment.identify(traits);
  }

  identifyTraitsAsync(traits: Object) {
    this.segment.identify(traits);
  }

  track(event: string, properties?: Object): Promise<Context> {
    return this.segment.track(event, properties);
  }

  trackAsync(event: string, properties?: Object) {
    this.segment?.track(event, properties);
  }

  page(category: string, name?: string, properties?: { [key: string]: any }) {
    this.segment.page(category, name, properties);
  }
}

const useSegment = (cb?: (analytics: SegmentAnalytics) => void): SegmentAnalytics => {
  const { segment } = React.useContext(AnalyticsContext);
  useEffect(() => {
    if (cb && segment) {
      cb(segment);
    }
  }, []);
  return segment;
};

export default useSegment;
