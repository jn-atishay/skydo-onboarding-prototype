import React, { useEffect } from "react";
import { UserAttributes } from "./analyticsTypes";
import { WindowInstance } from "../types";
import { AnalyticsContext } from "./AnalyticsProvider";

export class TagManagerAction {
  windowInstance: WindowInstance;
  constructor(windowInstance: WindowInstance) {
    this.windowInstance = windowInstance;
  }

  fireEvent(eventName: string, properties: { [key: string]: any } = {}) {
    this.windowInstance?.dataLayer.push({
      event: eventName,
      ...properties,
    });
  }

  fireUserLoginEvent(userId: string, email?: string) {
    this.windowInstance?.dataLayer.push({
      event: "loginEvent",
      userId: userId,
      email: email,
    });
  }

  fireUserAttributeEvent(traits: Partial<UserAttributes>) {
    const keys = Object.keys(traits).join("::");
    const values = Object.values(traits).join("::");
    this.windowInstance?.dataLayer.push({
      event: "userAttributeEvent",
      eventName: keys,
      eventValue: values,
    });
  }

  fireUserTrackingEvent(eventName: string, properties?: { [key: string]: any }) {
    this.windowInstance?.dataLayer.push({
      event: "trackEvent",
      eventName: eventName,
      extraInfo: properties,
    });
  }
}

const useTagManager = (cb?: (tagManager: TagManagerAction) => void) => {
  const { tagManager } = React.useContext(AnalyticsContext);
  useEffect(() => {
    if (cb && tagManager) {
      cb(tagManager);
    }
  }, []);
  return tagManager;
};

export default useTagManager;
