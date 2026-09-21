import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import useUserData from "../store/useUserData";

const useAnalyticsDataSetterHook = () => {
  const { loggedInUserDetails } = useUserData();

  useEffect(() => {
    if (loggedInUserDetails?.userId && loggedInUserDetails.emailAddress) {
      Sentry.setUser({
        id: String(loggedInUserDetails?.userId),
        email: loggedInUserDetails.emailAddress,
      });
    }
  }, [loggedInUserDetails]);
};

export default useAnalyticsDataSetterHook;
