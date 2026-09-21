import NavBar from "../NavBar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ToastMessages from "../AtomicComponents/ToastMessages";
import useAnalytics from "../../analytics/useAnalytics";
import beCall from "../../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../../util/beRoutes";
import { Value } from "../../types/DashboardContainer";
import FE_ROUTES, {
  CUSTOM_PAGE_EVENT_ROUTES,
  SUBNAV_INSIDE_LAYOUT_ROUTES,
  USERSNAP_ENABLED_ROUTES,
} from "../../util/feRoutes";
import withScreenViewHandled from "../ScreenViewCheck";
import AllPagePopups from "../AllPagePopups";
import ContentBody from "./ContentBody";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { OnboardingTag } from "../../types/Onboarding";
import useDashboardContainerStore from "../../store/useDashboardContainerStore";
import useExporterAndExporterUserStore from "../../store/useExporterAndExporterUserStore";
import useHomeStateStore, { HomeState } from "../../store/useHomeStateStore";
import useDebounce from "../../util/customHooks/useDebounce";
import useAnalyticsDataSetterHook from "../../hooks/useAnalyticsDataSetterHook";
import { loadEmbed, loadSpace, SpaceApi } from "@usersnap/browser";
import MobileNavbar from "../MobileNavBar/MobileNavbar";
import PageTopContainer from "../PageTopContainer";

interface Props {
  children: React.ReactElement;
}

export const UserDetailsContext = React.createContext<Value>({
  accountNumber: "",
  achAccountNumber: "",
  exporterUserDetails: { emailAddress: "" },
  purposeCodeDetails: {
    defaultPurposeCode: "",
  },
  exporterDetails: {
    onBoardingState: "",
    businessLegalName: "",
    correspondentName: "",
    virtualAccountName: "",
    // default value for tag
    tag: OnboardingTag.VKYC,
    offboardingType: "",
    totalUnsettledFunds: 0,
  },
  primaryGst: "",
  showEnableEInvoicePopUp: false,
  isLoadingContainerData: false,
  einvoiceCredentialsList: [],
  userPreference: {
    skipEInvoice: true,
    skipTestTransactionTutorial: true,
    skipPaypal: true,
  },
  refetchUserDetails: () => {},
  lastDashboardVisit: new Date(),
  isExporterEligibleForInstalinks: true,
  isExporterIndustryEligibleForInstalinks: null,
  hasUaeAccountAccess: false,
});

const DashboardContainer = (props: Props) => {
  const { children } = props;
  const [isCollapsed, setCollapsed] = useState(false);

  const {
    fetchDashboardData,
    isDashboardContainerLoading,
    isMounted,
    lastDashboardVisit,
    purposeCodeDetails,
    fetchAllData,
    skipEInvoice,
    skipTestTransactionTutorial,
    skipPaypal,
    accountNumber,
    achAccountNumber,
    primaryGst,
    einvoiceCredentialsList,
    eligibleForInstalinks,
    isIndustryEligibleForInstaLinks,
    hasUaeAccountAccess,
  } = useDashboardContainerStore();
  const { homeState } = useHomeStateStore();
  const { exporterUser, exporter } = useExporterAndExporterUserStore();
  const [isMobileUser, setMobileUser] = useState(false);
  const [usersnapApi, setUsersnapApi] = useState<SpaceApi | null>(null);
  const [shouldShowUserSnapWidget, setShouldShowUserSnapWidget] = useState(false);

  const router = useRouter();

  const analytics = useAnalytics();

  useEffect(() => {
    if (USERSNAP_ENABLED_ROUTES.includes(router.pathname)) {
      setShouldShowUserSnapWidget(true);
    }

    /***
     *
     * If statement is intentionally written for doing nothing for custom page event routes.
     *
     */
    if (CUSTOM_PAGE_EVENT_ROUTES.includes(router.pathname)) {
      //do nothing
    } else if (router.pathname === FE_ROUTES.DASHBOARD) {
      if (homeState !== HomeState.LOADING) {
        analytics.page("page_view", router.pathname, {
          exactPath: router.asPath,
          source: homeState,
        });
      }
    } else {
      analytics.page("page_view", router.pathname, {
        exactPath: router.asPath,
      });
    }
  }, [router.pathname, homeState]);

  const handleWindowResize = (event: Event) => {
    if (window.innerWidth <= 768) {
      setMobileUser(true);
    } else {
      setMobileUser(false);
    }
  };

  const handleWindowResizeThrottled = useDebounce(handleWindowResize, 500);

  useEffect(() => {
    addEventListener("resize", handleWindowResizeThrottled);
    if (window.innerWidth <= 768) {
      setMobileUser(true);
    }
    return () => {
      removeEventListener("resize", handleWindowResizeThrottled);
    };
  }, []);

  const fetchData = async () => {
    await fetchAllData(analytics);
  };

  const refetchDashboardData = async () => {
    await fetchDashboardData();
  };

  useEffect(() => {
    void fetchData();
    void beCall({
      path: BE_ROUTES.SET_USER_DASHBOARD_VISIT,
      method: ALLOWED_METHODS.POST,
    });
  }, []);

  useAnalyticsDataSetterHook();

  const showUserSnapWidget = () => {
    if (exporterUser?.emailAddress && !usersnapApi) {
      loadSpace("b0c137ed-db16-4bf5-b28a-486afec0051c")
        .then((api) => {
          api.init({
            custom: {
              user: {
                email: exporterUser?.emailAddress || "",
              },
            },
          });
          api.on("submit", (event) => {
            analytics.trackAsync("usersnap_submit", {
              email: exporterUser?.emailAddress || "",
              // @ts-ignore
              eventValueInputs: event?.values?.ordered_inputs.map((input: any) => input.value).join(", "),
            });
            void beCall({
              url: BFF_ROUTES.SEND_SLACK_NOTIFICATION,
              method: ALLOWED_METHODS.POST,
              body: {
                slackNotificationType: "USERSNAP_NOTIFICATION",
                content: `User ${exporterUser?.emailAddress} has submitted a usersnap form`,
              },
            });
          });
          setUsersnapApi(api);
        })
        .catch((error) => {
          console.log("Error loading usersnap embed", error);
        });
    }
  };

  useEffect(() => {
    const targetNode = document.getElementById("embedWidget");
    loadEmbed("b0c137ed-db16-4bf5-b28a-486afec0051c")
      .then((api) => {
        api.init({
          // @ts-ignore
          mountNode: document.getElementById(targetNode),
        });
      })
      .catch((error) => {
        console.error("Error loading usersnap embed", error);
      });
  }, []);

  useEffect(() => {
    showUserSnapWidget();
  }, [exporterUser?.emailAddress]);

  const isSubNavInsideContainer = SUBNAV_INSIDE_LAYOUT_ROUTES.includes(router.pathname);

  return (
    <UserDetailsContext.Provider
      value={{
        exporterDetails: {
          onBoardingState: exporter?.onBoardingState || "",
          businessLegalName: exporter?.businessLegalName || "",
          correspondentName: exporter?.correspondentName || "",
          virtualAccountName: exporter?.virtualAccountName || "",
          tag: exporter?.tag || OnboardingTag.VKYC,
          offboardingType: exporter?.offboardingType || "",
          totalUnsettledFunds: exporter?.totalUnsettledFunds || 0,
        },
        accountNumber,
        achAccountNumber,
        exporterUserDetails: {
          emailAddress: exporterUser?.emailAddress || "",
        },
        purposeCodeDetails,
        refetchUserDetails: refetchDashboardData,
        isLoadingContainerData: isDashboardContainerLoading,
        showEnableEInvoicePopUp: false,
        primaryGst,
        einvoiceCredentialsList,
        userPreference: {
          skipEInvoice,
          skipTestTransactionTutorial,
          skipPaypal,
        },
        lastDashboardVisit,
        isExporterEligibleForInstalinks: eligibleForInstalinks,
        isExporterIndustryEligibleForInstalinks: isIndustryEligibleForInstaLinks,
        hasUaeAccountAccess,
      }}
    >
      <div className={"pageDashboard !hidden md:!flex bg-black-50 flex-row justify-center"} id={"embedWidget"}>
        <NavBar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />
        {/*Nav bar width hardcoded for all screen sizes */}
        <ContentBody
          isCollapsed={isCollapsed}
          isLoadingContainerData={isDashboardContainerLoading}
          isMounted={isMounted}
          isSubNavInsideContainer={isSubNavInsideContainer}
        >
          {children}
        </ContentBody>
        <AllPagePopups />
      </div>
      {isMobileUser ? (
        <div className={"flex flex-row md:!hidden w-full bg-black-100 pt-12"}>
          <MobileNavbar />
          <div className="flex-1 flex flex-col w-full">
            {[FE_ROUTES.INVOICE_DETAILS, FE_ROUTES.UNPARSED_INVOICE].includes(router.pathname) ? (
              <PageTopContainer isLoading={isDashboardContainerLoading} isMobileView />
            ) : null}
            {children}
          </div>
        </div>
      ) : null}
      <ToastMessages />
    </UserDetailsContext.Provider>
  );
};

export default withScreenViewHandled(DashboardContainer, false, [
  FE_ROUTES.REFERRAL,
  FE_ROUTES.VKYC,
  FE_ROUTES.MOBILE_HOME,
  FE_ROUTES.DASHBOARD,
  FE_ROUTES.PAYMENTS,
  FE_ROUTES.PAYMENT_DETAILS,
  FE_ROUTES.INVOICES,
  FE_ROUTES.INVOICE_DETAILS,
  FE_ROUTES.FUNDING,
  FE_ROUTES.FUNDING_INVOICE_MAPPER,
  FE_ROUTES.SKYDO_BALANCE,
  FE_ROUTES.SKYDO_BALANCE_PENDING_TRANSACTIONS
]);
