import React, { useEffect } from "react";
import useFocusedHomeStore from "../../store/useFocusedHomeStore";
import { getEventFromStates } from "../../util/focusedHomeUtl";
import useAnalytics from "../../analytics/useAnalytics";
import IntentPage from "../../components/FocusedHome/IntentPage";
import ReceivePaymentPage from "../../components/FocusedHome/ReceivePaymentPage";
import Script from "next/script";
import { Events } from "../../analytics/EventConstants";
import useUserData from "../../store/useUserData";

const FocusedHome = () => {
  const { fetchFocusedHomeData, focusedHomeStates, isLoading, isStepsVisible } = useFocusedHomeStore();
  const { userName, loggedInUserEmail, exporterId } = useUserData();

  const analytics = useAnalytics();

  useEffect(() => {
    void fetchFocusedHomeData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const event = getEventFromStates(focusedHomeStates);
      if (event) {
        analytics?.trackAsync(event);
      }
    }
  }, [isLoading]);

  // @ts-ignore
  if (!focusedHomeStates || focusedHomeStates.length === 0) {
    return null;
  }

  return (
    <div className={"flex flex-col items-center"}>
      {isStepsVisible ? <ReceivePaymentPage /> : <IntentPage />}
      {!!loggedInUserEmail && !!userName && !!exporterId && (
        <Script
          id="messenger-widget-b"
          src="https://cdn.botpenguin.com/website-bot.js"
          defer
          ctx-email={loggedInUserEmail}
          ctx-name={userName}
          ctx-exporterId={exporterId}
          onLoad={() => {
            analytics.trackAsync(Events.FOCUSED_HOME.CHATBOT_WIDGET_SHOWN, {
              project: "fhv2",
              subpage: "fh_intent",
            });
          }}
          onError={(e) => {
            analytics.trackAsync(Events.FOCUSED_HOME.CHATBOT_WIDGET_LOAD_FAILED, {
              project: "fhv2",
              subpage: "fh_intent",
              error: e.message,
            });
          }}
        >
          68909c8f7bfee4037ce842b3,68909aa9e043a9aed35422be
        </Script>
      )}
    </div>
  );
};

export default FocusedHome;
