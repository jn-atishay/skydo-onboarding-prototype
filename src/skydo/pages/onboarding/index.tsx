import useUserData from "../../store/useUserData";
import React, { useEffect } from "react";
import { ACCOUNT_CREATED_STATES, USER_STATES } from "../../constants/onboarding";
import CompanyPanDetails from "../../components/CompanyPanDetails";
import UBOPanDetails from "../../components/UBOPanDetails";
import ManagementDetails from "../../components/ManagementDetails";
import AccountCreationLoader from "../../components/AccountCreationLoader";
import { isDashboardAccessible, isManualCheckPending, shouldRedirectToMobileInput } from "../../util/functions";
import VirtualAccountDetails from "../../components/VirtualAccountDetails";
import BankDetails from "../../components/BankDetails";
import classNames from "classnames";
import ToastMessages from "../../components/AtomicComponents/ToastMessages";
import withAuth from "../../authentication/WithAuth";
import FullPageLoader from "../../components/Common/FullPageLoader";
import { useRouter } from "next/router";
import FE_ROUTES from "../../util/feRoutes";
import useAnalytics, { Analytics } from "../../analytics/useAnalytics";
import Tracker from "../../components/Tracker";
import MobileInputPage from "../../components/LoginComponents/MobileInputPage";
import DocUpload from "../../components/DocUpload/Index";
import ReferralNoteOnboarding from "../../components/LoginComponents/MobileComponents/ReferralNoteOnboarding";
import KYCIntro from "../../components/KYCIntro";
import { Events } from "../../analytics/EventConstants";
import useOnboardingStore from "../../store/useOnboardingStore";
import useAnalyticsDataSetterHook from "../../hooks/useAnalyticsDataSetterHook";
import useBankStatementAnalyseStore from "../../store/useBankStatementAnalyseStore";

const Onboarding = () => {
  const { userState, phoneNumber, loggedInUserEmail, businessType, exporterIndustry } = useUserData();
  const router = useRouter();
  const isFormScreen = userState !== USER_STATES.SIGN_UP_SUCCESS;
  const analytics = useAnalytics();
  const { fetchExporterUserDetails: refetch } = useOnboardingStore();

  useEffect(() => {
    refetch();
  }, []);

  useAnalytics((analytics: Analytics) => {
    analytics?.page(router.asPath);
  });

  useEffect(() => {
    if (ACCOUNT_CREATED_STATES.includes(userState)) {
      analytics?.trackAsync(Events.ONBOARDING_COMPLETE, {
        onboarding_status: userState,
        docs_uploaded: useBankStatementAnalyseStore.getState().docsUploaded,
      });
    }
  }, [userState]);

  useEffect(() => {
    if (userState === USER_STATES.ARCHIVED || userState === USER_STATES.BLACK_LISTED) {
      router.push(FE_ROUTES.OFFBOARD_SCREEN_ROUTE);
    } else if (
      userState &&
      userState !== USER_STATES.NO_STATE &&
      isDashboardAccessible(userState) &&
      !shouldRedirectToMobileInput(userState, phoneNumber)
    ) {
      void router.push({ pathname: FE_ROUTES.DASHBOARD, query: { ...router.query } });
    }
  }, [userState, phoneNumber]);

  useEffect(() => {
    if (userState && userState !== USER_STATES.NO_STATE) {
      analytics.identifyTraitsAsync({ onboardingState: userState });
    }
  }, [userState]);
  useAnalyticsDataSetterHook();

  const renderContent = () => {
    if (!isFormScreen) {
      return <KYCIntro />;
    }

    if (userState === USER_STATES.VIRTUAL_ACCOUNT_CREATE || isManualCheckPending(userState)) {
      return <VirtualAccountDetails />;
    }

    if (userState === USER_STATES.NO_STATE) {
      return <FullPageLoader />;
    }

    if (userState === USER_STATES.BACKGROUND_VERIFICATION) {
      return <AccountCreationLoader />;
    }
    return (
      <>
        <CompanyPanDetails />
        <UBOPanDetails />
        <ManagementDetails />
        <BankDetails />
        <DocUpload />
      </>
    );
  };

  const isWhiteBackground =
    isManualCheckPending(userState) || !isFormScreen || userState === USER_STATES.BACKGROUND_VERIFICATION;

  const showTracker = !(userState === USER_STATES.NO_STATE);

  if (shouldRedirectToMobileInput(userState, phoneNumber)) {
    return (
      <MobileInputPage
        refetchData={async () => {
          if (isDashboardAccessible(userState)) {
            const redirectUrl = router.query.redirect
              ? decodeURI(router.query.redirect as string)
              : FE_ROUTES.DASHBOARD;
            await router.push(redirectUrl);
            return;
          }
          void refetch();
        }}
      />
    );
  }

  return (
    <div
      className={classNames("pageWithoutDisplay md:bg-black-50 md:mt-12 mt-0 flex-col !justify-start w-screen", {
        "!bg-white": isWhiteBackground,
        "!pt-0": showTracker,
      })}
    >
      {showTracker ? <Tracker className={""} /> : null}
      <div
        className={classNames("flex justify-center w-screen", {
          "md:pt-8": showTracker,
          "md:pt-13": !showTracker,
        })}
      >
        <div
          className={classNames("commonOnboardingContent", {
            "!half-flex": isManualCheckPending(userState),
            "px-6": !isFormScreen,
          })}
        >
          <ReferralNoteOnboarding containerClasses={!isFormScreen ? "mx-0" : ""} />
          {renderContent()}
          <ToastMessages />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Onboarding);
