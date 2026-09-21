import Locale from "../../util/locale/en";
import { useEffect, useRef, useState } from "react";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import useUserData from "../../store/useUserData";
import { AVG_TRANSACTION_OPTIONS, USER_STATES } from "../../constants/onboarding";
import LoadingState from "../AccountCreationLoader/LoadingState";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import useOnboardingStore from "../../store/useOnboardingStore";

let initiateCalled = false;

const VirtualAccountDetails = () => {
  const { userState, loggedInUserEmail, phoneNumber, exporterIndustry, averageTransaction } = useUserData();
  const { fetchLoggedInUserDetails } = useUserData();
  const retryAttempts = useRef(0);
  const [accountCreationFailed, setAccountCreationFailed] = useState(false);

  const analytics = useAnalytics();
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();

  const createVirtualAccountDetails = async () => {
    try {
      const res = await beCall({
        path: BE_ROUTES.CREATE_VIRTUAL_ACCOUNT,
        method: ALLOWED_METHODS.POST,
      });
      analytics?.trackAsync(Events.ACCOUNT_CREATED, { success: res.success });
      if (res.success && res.data) {
        refetchUserState();
        fetchLoggedInUserDetails();
      } else {
        throw res;
      }
    } catch (e) {
      retryAttempts.current++;
      setTimeout(() => {
        createVirtualAccountDetails();
      }, 10000);
      if (retryAttempts.current >= 6) {
        setAccountCreationFailed(true);
      }
    }
  };

  const sendMarketingEvent = () => {
    const nonSuitableIndustriesIds = [
      2, 4, 13, 9, 16, 19
    ];
    const isNonSuitableIndustry = nonSuitableIndustriesIds.includes(exporterIndustry?.industryId || 0);
    const eligibleAverageTransaction = [
      AVG_TRANSACTION_OPTIONS[3].value,
      AVG_TRANSACTION_OPTIONS[4].value,
      AVG_TRANSACTION_OPTIONS[5].value,
    ];
    if(!isNonSuitableIndustry && eligibleAverageTransaction.includes(averageTransaction)) {
      analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.QUALIFIED_ONBOARDING_DONE, {
        email_address: loggedInUserEmail,
        phone_number: phoneNumber,
        country: "IN",
      });
    }
    
    analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.ONBOARDING_DONE, {
      email_address: loggedInUserEmail,
      phone_number: phoneNumber,
      country: "IN",
    });
  };

  useEffect(() => {
    if (!initiateCalled && userState === USER_STATES.VIRTUAL_ACCOUNT_CREATE) {
      initiateCalled = true;
      createVirtualAccountDetails();
      sendMarketingEvent();
    }
  }, []);

  return (
    <LoadingState
      title={accountCreationFailed ? Locale.accountCreationIsTakingLonger : Locale.verifyingDetails}
      description={accountCreationFailed ? Locale.accountCreationIsTakingLongerSubtext : Locale.applicationSuccess}
    />
  );
};

export default VirtualAccountDetails;
