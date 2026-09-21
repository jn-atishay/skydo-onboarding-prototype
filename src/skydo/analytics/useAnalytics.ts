import { useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import useTagManager, { TagManagerAction } from "./useTagManager";
import { UserAttributes } from "./analyticsTypes";
import useSegment, { SegmentAnalytics } from "./useSegment";
import beCall from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";

type UserTraits = {
  email: string;
  transacting: boolean;
  onboardingState?: string;
};

export class Analytics {
  segment: SegmentAnalytics;
  tagManager?: TagManagerAction;
  constructor(segment: SegmentAnalytics, tagManager?: TagManagerAction) {
    this.segment = segment;
    this.tagManager = tagManager;
  }

  trackAsync(event: string, properties?: { [key: string]: any }) {
    this.segment.trackAsync(event, properties);
    this.tagManager?.fireUserTrackingEvent(event, properties);
  }

  async identifyUserForAllTools(userId: string, traits: UserTraits) {
    Sentry.setUser({ id: userId, email: traits?.email });
    this.tagManager?.fireUserLoginEvent(userId, traits?.email);
    await this.segment.identify(userId, traits);
    const attributes = { ...traits } as Partial<UserTraits>;
    delete attributes.email;
    this.tagManager?.fireUserAttributeEvent(attributes);
  }

  identifyTraitsAsync(traits: Partial<UserAttributes>) {
    this.segment.identifyTraitsAsync(traits);
    this.tagManager?.fireUserAttributeEvent(traits);
  }

  page(category: string, name?: string, properties?: { [key: string]: any }) {
    this.segment.page(category, name, properties);
    this.tagManager?.fireUserTrackingEvent(`Viewed ${name || category}`, properties);
  }

  fireMarketingEvent(eventName: string, properties: { [key: string]: any } = {}) {
    this.tagManager?.fireEvent(eventName, properties);
  }

  // only works for event names entered in an ENUM in backend
  firePublicBackendEvent(eventName: string, info?: { [key: string]: any }) {
    beCall({
      path: BE_ROUTES.PUBLIC_EVENTS_TRACK,
      method: ALLOWED_METHODS.POST,
      body: {
        event: eventName,
        info,
      },
    });
  }
}

const useAnalytics = (cb?: (analytics: Analytics) => void): Analytics => {
  const segment = useSegment();
  const tagManager = useTagManager();
  const [analyticsWrapper, setAnalyticsWrapper] = useState(new Analytics(segment, tagManager));

  useEffect(() => {
    setAnalyticsWrapper(new Analytics(segment, tagManager));
  }, [segment, tagManager, setAnalyticsWrapper]);

  useEffect(() => {
    if (cb && analyticsWrapper) {
      cb(analyticsWrapper);
    }
  }, []);

  return analyticsWrapper;
};

export default useAnalytics;
