import Locale from "../../util/locale/en";
import styles from "./NavBar.module.css";
import NavHomeIcon from "../Icons/NavHomeIcon";
import FE_ROUTES from "../../util/feRoutes";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import NavAccountIcon from "../Icons/NavAccountIcon";
import NavBarItem from "./NavBarItem";
import BarChartIcon from "../Icons/BarChartIcon";
import { AnalyticsSubNavBarRoutes, ClientLedgerSubRoutes } from "./subNavBarMappings";
import NavInvoicesIcon from "../Icons/NavInvoicesIcon";
import NavUnmappedPaymentsIcon from "../Icons/NavUnmappedPaymentsIcon";
import { formatIncomingCurrencyWithNumber } from "../../util/formatters";
import useFundingStore from "../../store/useFundingStore";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import InvoicingSubNav from "./InvoicingSubNav";
import NavCountBadge from "./NavCountBadge";
import UsersIcon from "../Icons/UsersIcon";
import ReferralWidget from "./ReferralWidget";
import { UserDetailsContext } from "../DashboardContainer";
import { isUserKYCed } from "../../util/functions";
import { ArrowIconSmallRotated } from "../Icons/ArrowIconSmall";
import Tooltip from "../AtomicComponents/Tooltip";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { useTour } from "@reactour/tour";
import useAppTourStore from "../../store/useAppTourStore";
import { TOUR_STEPS } from "../../types/appTour";
import JSHelpers from "../AtomicComponents/JSHelpers";
import useHomeStateStore, { HomeState } from "../../store/useHomeStateStore";
import LaptopLineIcon from "../Icons/LaptopLineIcon";
import ExporterMilestonesWidget from "../ExporterMilestonesComponents/ExporterMilestonesWidget";
import useExporterMilestoneStore from "../../store/useExporterMilestoneStore";
import useDashboardVersionStore from "../../store/useDashboardVersionStore";
import NavAmazonIcon from "../Icons/NavAmazonIcon";
import SkydoPayoutPaymentIcon from "../Icons/SkydoPayoutPaymentIcon";
import useEbrcStore from "../../store/useEbrcStore";
import EbrcLocale from "../../util/locale/ebrc.en";
import EbrcIcon from "../Icons/EbrcIcon";
import NavInstaLinksIcon from "../Icons/NavInstaLinksIcon";
import { DashboardVersionType } from "../../types/DashboardVersionTypes";
import useDashboardContainerStore from "../../store/useDashboardContainerStore";
import WalletIcon from "../Icons/WalletIcon";
import CheckPaymentStatusModal from "../ClientLedger/CheckPaymentStatusModal";
import NavQuestionIcon from "../Icons/NavQuestionIcon";
import useActiveCampaign from "../ReferralCampaigns/useActiveCampaign";
import { MILESTONE_WIDGET_CLOSED_STORAGE_KEY } from "../../constants/exporterMilestoneConstants";
import { NAV_ACTIVE_ATTRIBUTE } from "../../constants/navBarConstants";

interface NavBarProps {
  isCollapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar = ({ isCollapsed: globalCollapsed, setCollapsed }: NavBarProps) => {
  const router = useRouter();
  const { exporterDetails, isExporterEligibleForInstalinks } = useContext(UserDetailsContext);
  const analytics = useAnalytics();
  const { isOpen, currentStep } = useTour();
  const { isInvoicesSubNavOpen } = useAppTourStore();
  const isCollapsed = globalCollapsed && !isOpen;
  const {
    fetchDashboardVersionData,
    dashboardVersion,
    isLoading: dashboardVersionIsLoading,
  } = useDashboardVersionStore();
  const { isEbrcActive,isHdfc, showFiraFlow } = useEbrcStore();

  const { unmappedFundings, setUnmappedFundings, setFetchingFundingMappingDetailsLoading } = useFundingStore();
  const { isSkydoBalanceEnabled } = useDashboardContainerStore();
  const { fetchExporterMilestone, exporter } = useExporterMilestoneStore();
  const [showMilestoneWidget, setShowMilestoneWidget] = React.useState(false);
  const campaign = useActiveCampaign();

  // The rail reserves height for these, so it has to track what actually renders:
  // SidebarWidget returns null without an active campaign, and the milestone widget
  // is dismissable. Reserving for a hidden widget strands a blank gap and needlessly
  // pushes nav items behind the scrollbar.
  const isReferralVisible = isUserKYCed(exporterDetails.onBoardingState) && !!campaign;
  const isBottomBlockVisible = isReferralVisible || showMilestoneWidget;

  const { fetchHomeState, homeState } = useHomeStateStore();

  const [scrollEl, setScrollEl] = React.useState<HTMLElement | null>(null);
  const [contentEl, setContentEl] = React.useState<HTMLElement | null>(null);
  const [hasMoreBelow, setHasMoreBelow] = React.useState(false);

  // Rows self-scroll when they become selected, but the viewport can shrink under a
  // row that is already selected — the milestone widget arriving grows the reserved
  // bottom block by 85px, and collapsing changes row heights. "nearest" makes this a
  // no-op whenever the row is already fully visible.
  const revealActiveRow = React.useCallback(() => {
    scrollEl?.querySelector<HTMLElement>(`[${NAV_ACTIVE_ATTRIBUTE}]`)?.scrollIntoView({ block: "nearest" });
  }, [scrollEl]);

  // Drives the bottom fade that signals more nav items below. Keyed on the elements
  // rather than on render-gating state, since this component returns null while the
  // dashboard version loads. Observing the content box too catches sub-nav expansion
  // and late-arriving funding items, which do not change the scroll box itself.
  useEffect(() => {
    if (!scrollEl || !contentEl) return;
    const update = () => setHasMoreBelow(scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight - 1);
    const onResize = () => {
      update();
      revealActiveRow();
    };
    update();
    scrollEl.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(onResize);
    observer.observe(scrollEl);
    observer.observe(contentEl);
    return () => {
      scrollEl.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [scrollEl, contentEl, revealActiveRow]);

  // Collapsing swaps every row's contents, so the active row can land off-screen
  // without the observed boxes changing size.
  useEffect(() => {
    revealActiveRow();
  }, [isCollapsed, revealActiveRow]);

  useEffect(() => {
    if (router.pathname === FE_ROUTES.DASHBOARD) {
      void fetchHomeState();
    }
    fetchExporterMilestone();
  }, []);

  useEffect(() => {
    if (!exporter?.exporterMilestone) return;
    // Read the flag rather than assuming visible: the milestone popup re-arms the
    // widget by writing "false", and a dismissal holds for the rest of the session.
    setShowMilestoneWidget(sessionStorage.getItem(MILESTONE_WIDGET_CLOSED_STORAGE_KEY) !== "true");
  }, [exporter]);

  useEffect(() => {
    const collapseChoice = JSHelpers.getFromDeviceStore<string>("navbar_collapse_choice", "");
    if (collapseChoice) {
      if ((collapseChoice === "collapse") !== isCollapsed) {
        setCollapsed((v) => !v);
      }
    } else if (homeState == HomeState.FOCUSED) {
      setCollapsed(true);
    } else {
      const media = window.matchMedia(`(min-width: 1200px)`);
      if (media.matches === isCollapsed) {
        setCollapsed((v) => !v);
      }
    }
  }, [homeState]);

  const getSubNavItemsForFunding = () =>
    unmappedFundings.map((funding) => ({
      id: funding.id,
      isSuccessful: funding.amount === 0,
      title: funding.senderName,
      isSelectedFun: (asPath: string) =>
        asPath === FE_ROUTES.FUNDING_INVOICE_MAPPER.replace("[funding_id]", String(funding.id)),
      onClick: () => {
        analytics.trackAsync(Events.MAPPING.UNMAPPED_PAYMENT_CARD_CLICK);
        // setFetchingFundingMappingDetailsLoading(true);
        void router.push(FE_ROUTES.FUNDING_INVOICE_MAPPER.replace("[funding_id]", String(funding.id)));
      },
      href: FE_ROUTES.FUNDING_INVOICE_MAPPER.replace("[funding_id]", String(funding.id)),
      subTitle: formatIncomingCurrencyWithNumber({
        value: funding.amount - funding.amountMapped,
        currency: funding.currency,
        minFractionDigits: 2,
        maxFractionDigits: 2,
      }),
    }));

  const isFundingSubNavOpen =
    router.pathname === FE_ROUTES.FUNDING_INVOICE_MAPPER || router.pathname === FE_ROUTES.FUNDING;
  const [checkPaymentStatusVisible, setCheckPaymentStatusVisible] = React.useState(false);

  const renderUnmappedPaymentsTitle = (isSelected: boolean) => {
    const isUnmappedPaymentsPresent = unmappedFundings?.length > 0;
    return (
      <div className={"flex items-center justify-between !whitespace-normal"}>
        <Typography
          text={Locale.unmappedPayments}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={isSelected ? "!text-navyblue-500 ml-3" : "ml-3"}
        />
        {isUnmappedPaymentsPresent ? (
          <NavCountBadge
            count={unmappedFundings.length}
            className={"h-5 w-5 bg-red-400"}
            textClasses={"!text-white"}
          />
        ) : null}
      </div>
    );
  };

  const renderUnmappedPaymentsIcon = (isSelected: boolean) => {
    const isUnmappedPaymentsPresent = unmappedFundings?.length > 0;
    return (
      <div className={"relative"}>
        <NavUnmappedPaymentsIcon isSelected={isSelected} className={"shrink-0"} />
        {isUnmappedPaymentsPresent && isCollapsed ? (
          <NavCountBadge
            count={unmappedFundings.length}
            className={"absolute -right-1.5 -top-1 h-3.5 w-3.5 bg-red-400"}
            textClasses={"!text-white !text-para3xsmall"}
          />
        ) : null}
      </div>
    );
  };

  const navItems = [
    {
      title: Locale.homePage,
      icon: (isSelected: boolean) => <NavHomeIcon isSelected={isSelected} className={"shrink-0"} />,
      isSelectedFun: (pathname: string) => pathname === FE_ROUTES.DASHBOARD,
      href: FE_ROUTES.DASHBOARD,
      onClick: () => router.push(FE_ROUTES.DASHBOARD),
    },
    ...(dashboardVersion == DashboardVersionType.AMAZON_SELLER
      ? [
          {
            title: "Amazon payments",
            icon: (isSelected: boolean) => <NavAmazonIcon className={"shrink-0"} />,
            isSelectedFun: (pathname: string) =>
              pathname === FE_ROUTES.PAYMENT_DETAILS || pathname == FE_ROUTES.PAYMENTS,
            href: FE_ROUTES.PAYMENTS,
            onClick: () => router.push(FE_ROUTES.PAYMENTS),
          },
        ]
      : []),
    ...(dashboardVersion == DashboardVersionType.SKYDO_PAYOUTS
      ? [
          {
            title: "Payments",
            icon: (isSelected: boolean) => <SkydoPayoutPaymentIcon isSelected={isSelected} className={"shrink-0"} />,
            isSelectedFun: (pathname: string) =>
              pathname === FE_ROUTES.PAYMENT_DETAILS || pathname == FE_ROUTES.PAYMENTS,
            href: FE_ROUTES.PAYMENTS,
            onClick: () => router.push(FE_ROUTES.PAYMENTS),
          },
        ]
      : []),
    {
      title: Locale.invoices,
      icon: (isSelected: boolean) => <NavInvoicesIcon isSelected={isSelected} className={"shrink-0"} />,
      isSelectedFun: (pathname: string) => false,
      href: FE_ROUTES.INVOICES,
      onClick: () => {
        router.push(FE_ROUTES.INVOICES);
        if (isCollapsed) {
          setCollapsed(false);
        }
      },
      subNavItems: [],
      SubNavComponent: InvoicingSubNav,
      isSubNavOpen: () =>
        [
          FE_ROUTES.INVOICES,
          FE_ROUTES.INVOICE_DETAILS,
          FE_ROUTES.DRAFT_INVOICE_DETAILS,
          FE_ROUTES.DRAFT_INVOICES,
          FE_ROUTES.RECURRING_INVOICE_CONFIGS,
        ].includes(router.pathname) ||
        isInvoicesSubNavOpen ||
        (isOpen && currentStep > TOUR_STEPS.INTERNATION_ACCOUNT_NAV),
    },
    {
      title: Locale.navAnalyticsAndReports,
      icon: (isSelected: boolean) => <BarChartIcon isSelected={isSelected} className={"shrink-0"} />,
      isSelectedFun: (pathname: string) =>
        pathname === FE_ROUTES.ANALYTICS || AnalyticsSubNavBarRoutes.includes(pathname),
      onClick: () => router.push(FE_ROUTES.ANALYTICS),
      href: FE_ROUTES.ANALYTICS,
    },
    ...(isSkydoBalanceEnabled
      ? [
          {
            title: Locale.skydoBalance,
            icon: (isSelected: boolean) => <WalletIcon isSelected={isSelected} className={"shrink-0"} />,
            isSelectedFun: (pathname: string) =>
              pathname === FE_ROUTES.SKYDO_BALANCE ||
              pathname === FE_ROUTES.SKYDO_BALANCE_PENDING_TRANSACTIONS ||
              pathname === FE_ROUTES.SKYDO_BALANCE_DRAFT_PAYOUT,
            onClick: () => {
              void analytics.trackAsync(Events.SKYDO_BALANCE_SIDE_BAR_CLICK);
              void router.push(FE_ROUTES.SKYDO_BALANCE);
            },
            href: FE_ROUTES.SKYDO_BALANCE,
          },
        ]
      : []),
    {
      title: Locale.internationalAccounts,
      icon: (isSelected: boolean) => <NavAccountIcon isSelected={isSelected} className={"shrink-0"} />,
      isSelectedFun: (pathname: string) => pathname === FE_ROUTES.INTERNATIONAL_ACCOUNTS,
      onClick: () => router.push(FE_ROUTES.INTERNATIONAL_ACCOUNTS),
      href: FE_ROUTES.INTERNATIONAL_ACCOUNTS,
      appTourId: "international_account_nav",
      className:
        isOpen && currentStep === TOUR_STEPS.INTERNATION_ACCOUNT_NAV
          ? "wave-pulse border border-blue-400 !bg-blue-50"
          : "",
    },
    {
      title: Locale.intAccountPage.platformWithdrawals,
      subtitle: Locale.intAccountPage.platformWithdrawalsSubtitle,
      icon: (isSelected: boolean) => <LaptopLineIcon isSelected={isSelected} className={"shrink-0"} />,
      isSelectedFun: (pathname: string) =>
        pathname === FE_ROUTES.PLATFORM_WITHDRAWALS || pathname === FE_ROUTES.PLATFORM_WITHDRAWALS_DETAILS,
      onClick: () => router.push(FE_ROUTES.PLATFORM_WITHDRAWALS),
      href: FE_ROUTES.PLATFORM_WITHDRAWALS,
    },
    {
      title: Locale.instaLinks,
      icon: (isSelected: boolean) => <NavInstaLinksIcon isSelected={isSelected} className={"shrink-0"} />,
      isSelectedFun: (pathname: string) => pathname === FE_ROUTES.PAYMENT_LINKS,
      onClick: () => {
        analytics.trackAsync(Events.PAYPAL.INSTALINKS_SIDE_BAR_CLICKED);
        router.push(FE_ROUTES.PAYMENT_LINKS);
      },
      href: FE_ROUTES.PAYMENT_LINKS,
    },
    {
      title: Locale.clients,
      icon: (isSelected: boolean) => <UsersIcon isSelected={isSelected} className={"shrink-0"} />,
      isSelectedFun: (pathname: string) => ClientLedgerSubRoutes.includes(pathname),
      onClick: () => router.push(FE_ROUTES.CLIENT_LIST),
      href: FE_ROUTES.CLIENT_LIST,
    },
    ...(isEbrcActive&&isHdfc || showFiraFlow
      ? [
          {
            title: EbrcLocale.edpmsAndEbrc,
            icon: (isSelected: boolean) => <EbrcIcon isSelected={isSelected} className={"shrink-0"} />,
            isSelectedFun: (pathname: string) => pathname === FE_ROUTES.IRM,
            onClick: () => router.push(FE_ROUTES.IRM),
            href: FE_ROUTES.IRM,
          },
        ]
      : []),
    {
      title: Locale.unmappedPayments,
      icon: renderUnmappedPaymentsIcon,
      isSelectedFun: (pathname: string) => pathname === FE_ROUTES.FUNDING,
      subNavItems: getSubNavItemsForFunding(),
      isSubNavOpen: () => isFundingSubNavOpen,
      // Keep the expand arrow visible even with zero unmapped payments; it only
      // rotates/opens once there are payments to show.
      alwaysShowSubNavArrow: true,
      renderTitle: renderUnmappedPaymentsTitle,
      href: FE_ROUTES.FUNDING,
      onClick: () => {
        void router.push(FE_ROUTES.FUNDING);
        if (isCollapsed) {
          setCollapsed(false);
        }
      },
      renderSubNavFooter: () => unmappedFundings?.length > 0 ? (
        <>
          <hr className={"border-black-200 mx-3"} />
          <div
            className={"mx-3 my-1 px-2 py-2 rounded-10px cursor-pointer flex items-center gap-2 hover:bg-blue-50"}
            onClick={() => {
              analytics.trackAsync(Events.FUNDING_TIMELINE_ENTRY_CLICKED, {
                entry_point: "unmapped_payments_active",
              });
              setCheckPaymentStatusVisible(true);
            }}
          >
            <NavQuestionIcon className={"shrink-0"} />
            <Typography
              text={Locale.waitingForPayment}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-700"}
            />
          </div>
        </>
      ) : null,
    },
  ];

  const onMilestonesWidgetCtaClick = () => {
    router.push("/home?milestone-achieved=true", undefined, { shallow: true });
    analytics.trackAsync(Events.MILESTONE_WIDGET_CLICKED);
    analytics.trackAsync(Events.MILESTONE_POPUP_OPENED, {
      source: "widget",
    });
  };

  const onMilestonesWidgetClose = () => {
    sessionStorage.setItem(MILESTONE_WIDGET_CLOSED_STORAGE_KEY, "true");
    setShowMilestoneWidget(false);
  };

  if (dashboardVersionIsLoading) return null;

  return (
    <>
    <CheckPaymentStatusModal
      isOpen={checkPaymentStatusVisible}
      onClose={() => setCheckPaymentStatusVisible(false)}
      entryPoint={"unmapped_payments_active"}
    />
    <div
      className={classNames(
        // Spans header bottom to viewport bottom. h-full measured from the header offset
        // instead, running 48px past the fold and needing a margin hack to claw it back.
        "z-50 fixed top-headerHeight bottom-0 w-[14.25rem] flex flex-col bg-white border-r border-black-400 ease-linear duration-300 border-solid p-3 left-0",
        {
          "!w-18": isCollapsed,
        }
      )}
    >
      <div className={`${styles.scrollArea} relative flex-1 min-h-0`}>
        <nav
          ref={setScrollEl}
          className={`${styles.navbarScroll} overflow-y-auto overflow-x-hidden h-full`}
          aria-label="Main navigation"
        >
          <div ref={setContentEl} className={styles.scrollAreaContent}>
            {navItems.map((item, index) => {
              const { isSelectedFun } = item;
              const isSelected = isSelectedFun(router.pathname);
              if (isCollapsed) {
                return (
                  // key belongs on the Tooltip, not the item inside it: the Tooltip is the
                  // mapped element, and without it React mismatches tooltips against rows
                  // and shows a neighbour's label.
                  <Tooltip
                    key={index}
                    tooltipText={item.title}
                    position={TOOLTIP_POSITION.RIGHT}
                    tooltipTheme={"dark"}
                    // The rail is a scroll container, so popper measures against it and flips
                    // the tooltip left, on top of the rail — where it covers the icons and,
                    // being interactive, swallows their clicks. Bound to the viewport instead.
                    popperOptions={{
                      modifiers: {
                        preventOverflow: { boundariesElement: "viewport" },
                        flip: { boundariesElement: "viewport" },
                      },
                    }}
                  >
                    <NavBarItem isSelected={isSelected} isCollapsed={true} {...item} />
                  </Tooltip>
                );
              }
              return <NavBarItem key={index} isSelected={isSelected} isCollapsed={false} {...item} />;
            })}
          </div>
        </nav>
        {hasMoreBelow && <div className={styles.scrollFade} aria-hidden={"true"} />}
      </div>
      {/* Reserved slot between the scroll area and the bottom block, sized to the
          collapse control so the scroll track terminates above it — overlapping it
          would swallow clicks meant for the scrollbar thumb. Being a flex sibling also
          anchors the control to the bottom block's real height rather than a
          viewport-relative offset, and keeps it inside the rail when no block renders.
          -right-7 lands it on the rail's border, matching the -right-4 it previously
          took from the rail itself. */}
      <div className={"relative h-8 flex-shrink-0"}>
        <div className={"absolute -right-7 bottom-0 z-10"}>
          <Tooltip
            tooltipText={isCollapsed ? Locale.expand : Locale.collapse}
            position={TOOLTIP_POSITION.RIGHT}
            tooltipTheme={"dark"}
          >
            <div
              className={classNames(
                "h-8 w-8 bg-white rounded-full border border-black-400 items-center justify-center flex ease-linear duration-300 cursor-pointer",
                { "rotate-180": isCollapsed }
              )}
              onClick={() => {
                analytics.trackAsync(Events.NAVBAR_COLLAPSE_CLICK, {
                  action: isCollapsed ? "expand" : "collapse",
                  size: window?.screen?.availWidth,
                });
                JSHelpers.setInDeviceStore("navbar_collapse_choice", isCollapsed ? "expand" : "collapse");
                setCollapsed((v) => !v);
              }}
            >
              <ArrowIconSmallRotated />
            </div>
          </Tooltip>
        </div>
      </div>
      {isBottomBlockVisible ? (
        <div
          // No bottom margin: the rail ends at the viewport bottom, so its p-3 is the only
          // inset the widget needs to sit tight to the screen edge.
          // No top padding for the referral badge's 28px upward overhang via -mt-7: the
          // collapse control's 32px slot above already clears it, with 4px to spare.
          className={classNames("flex flex-col flex-shrink-0 justify-end gap-4", {
            // Both reserved heights measure the referral card (alone, and paired with the
            // milestone), so neither applies without it. Collapsed shows only a 56px badge,
            // where reserving 180px would strand ~124px of dead space.
            [styles.bottomBlock]: !isCollapsed && isReferralVisible && !showMilestoneWidget,
            [styles.bottomBlockWithMilestone]: !isCollapsed && isReferralVisible && showMilestoneWidget,
          })}
        >
          {showMilestoneWidget && (
            <ExporterMilestonesWidget
              onCtaClick={onMilestonesWidgetCtaClick}
              onClose={onMilestonesWidgetClose}
              isCollapsed={isCollapsed}
            />
          )}
          {isReferralVisible && <ReferralWidget isCollapsed={isCollapsed} />}
        </div>
      ) : null}
    </div>
    </>
  );
};

export default NavBar;
