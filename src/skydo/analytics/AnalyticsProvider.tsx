import { AnalyticsBrowser } from "@segment/analytics-next";
import React from "react";
import { SegmentAnalytics } from "./useSegment";
import { WindowInstance } from "../types";
import { TagManagerAction } from "./useTagManager";
import TagManager from "react-gtm-module";

type AnalyticsContextValue = {
  segment: SegmentAnalytics;
  tagManager?: TagManagerAction;
};
export const AnalyticsContext = React.createContext<AnalyticsContextValue>(undefined!);

type Props = {
  writeKey: string;
  children: React.ReactNode;
};

export const AnalyticsProvider = ({ children, writeKey }: Props) => {
  const analytics = React.useMemo(() => {
    const analyticsBrowser = AnalyticsBrowser.load({ writeKey });
    return new SegmentAnalytics(analyticsBrowser);
  }, [writeKey]);

  const isClientSide = typeof window !== "undefined";

  const initialiseAndSetTagManager = React.useMemo(() => {
    if (isClientSide) {
      const tagManagerArgs = {
        gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
      };
      TagManager.initialize(tagManagerArgs);
      return new TagManagerAction(window as WindowInstance);
    }
    return;
  }, [isClientSide]);
  const tagMangerAction = initialiseAndSetTagManager;
  return (
    <AnalyticsContext.Provider value={{ segment: analytics, tagManager: tagMangerAction }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
