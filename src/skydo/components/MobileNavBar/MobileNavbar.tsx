import {useRouter} from "next/router";
import Locale from "../../util/locale/en";
import {useEffect, useRef} from "react";
import useMobileNavBarStore from "../../store/useMobileNavBarStore";
import Typography from "../AtomicComponents/Typography";
import {TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES} from "../../constants/atomicConstants";
import FE_ROUTES from "../../util/feRoutes";
import NavInvoicesIcon from "../Icons/NavInvoicesIcon";
import NavAccountIcon from "../Icons/NavAccountIcon";
import NavUnmappedPaymentsIcon from "../Icons/NavUnmappedPaymentsIcon";
import classNames from "classnames";
import useDashboardVersionStore from "../../store/useDashboardVersionStore";
import {DashboardVersionType} from "../../types/DashboardVersionTypes";
import useAnalytics from "../../analytics/useAnalytics";
import {Events} from "../../analytics/EventConstants";
import {MOBILE_NAV_DRAWER_WIDTH, MOBILE_NAV_ICON_SIZE} from "../../constants/navBarConstants";

interface NavOption {
  title: string;
  icon: (isSelected: boolean) => JSX.Element;
  isSelectedFun: (pathname: string) => boolean;
  onClick: () => void;
}

const MobileNavbar = () => {
  const analytics = useAnalytics();
  const router = useRouter();
  const { isNavBarOpen, isClosing, isOpening, closeNavBar, setClosing, setOpening } = useMobileNavBarStore();
  const navRef = useRef<HTMLDivElement>(null);
  const {
    dashboardVersion,
    isLoading: dashboardVersionIsLoading,
  } = useDashboardVersionStore();


  // Navigation options array
  const navOptions: NavOption[] = [
    {
      title: Locale.invoices,
      icon: (isSelected: boolean) => (
        <NavInvoicesIcon
          isSelected={isSelected}
          width={MOBILE_NAV_ICON_SIZE}
          height={MOBILE_NAV_ICON_SIZE}
          className={"shrink-0"}
        />
      ),
      isSelectedFun: (pathname: string) =>
        pathname === FE_ROUTES.INVOICES ||
        pathname === FE_ROUTES.INVOICE_DETAILS ||
        pathname === FE_ROUTES.PAYMENTS ||
        pathname === FE_ROUTES.PAYMENT_DETAILS,
      onClick: () => {
        analytics?.trackAsync(Events.MOBILE_NAV_BAR.OPTION_SELECT, { option: "payments" });
        dashboardVersion == DashboardVersionType.INVOICE_FULL
          ? router.push(FE_ROUTES.INVOICES)
          : router.push(FE_ROUTES.PAYMENTS);
        handleClose();
      },
    },
    {
      title: Locale.internationalAccounts,
      icon: (isSelected: boolean) => (
        <NavAccountIcon
          isSelected={isSelected}
          width={MOBILE_NAV_ICON_SIZE}
          height={MOBILE_NAV_ICON_SIZE}
          className={"shrink-0"}
        />
      ),
      isSelectedFun: (pathname: string) => pathname === FE_ROUTES.DASHBOARD,
      onClick: () => {
        analytics?.trackAsync(Events.MOBILE_NAV_BAR.OPTION_SELECT, { option: "int_accounts" });
        router.push(FE_ROUTES.DASHBOARD);
        handleClose();
      },
    },
    {
      title: Locale.unmappedPayments,
      icon: (isSelected: boolean) => (
        <NavUnmappedPaymentsIcon
          isSelected={isSelected}
          width={MOBILE_NAV_ICON_SIZE}
          height={MOBILE_NAV_ICON_SIZE}
          className={"shrink-0"}
        />
      ),
      isSelectedFun: (pathname: string) => pathname === FE_ROUTES.FUNDING,
      onClick: () => {
        analytics?.trackAsync(Events.MOBILE_NAV_BAR.OPTION_SELECT, { option: "unmapped_payments" });
        router.push(FE_ROUTES.FUNDING);
        handleClose();
      },
    },
  ];

  const handleClose = () => {
    closeNavBar(analytics);
  };

  // Handle closing animation end
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setClosing(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isClosing, setClosing]);

  // Handle opening animation
  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => {
        setOpening(false);
      }, 50); // Small delay to ensure initial render with translate-x-full
      return () => clearTimeout(timer);
    }
  }, [isOpening, setOpening]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isNavBarOpen) {
        handleClose();
      }
    };

    if (isNavBarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavBarOpen]);

  // Only render if navbar should be visible
  if (!isNavBarOpen && !isClosing && !isOpening) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 mt-12">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isClosing || isOpening ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Navigation Sidebar */}
      <div 
        ref={navRef}
        className={`absolute px-3 pt-4 pb-3 top-0 left-0 h-full bg-white shadow-elevation4 transform transition-transform duration-300 ${
          isClosing || isOpening ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ width: MOBILE_NAV_DRAWER_WIDTH }}
      >
        {/* Navigation Options */}
        <div className="flex flex-col gap-2 w-full">
          {navOptions.map((option, index) => {
            const isSelected = option.isSelectedFun(router.pathname);
            
            return <div
              key={index}
              className={classNames("flex flex-row items-center px-3 py-2 gap-4 w-full", {
                "bg-blue-50 rounded-10px": isSelected
              })}
              onClick={option.onClick}
            >
              {option.icon(isSelected)}
              {/* Below md, LABEL/LARGE is the .labelmedium class: 16px/20px semibold, i.e. the
                  design's Label/Medium SemiBold token. This drawer only renders below md. */}
              <Typography
                text={option.title}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses={`${isSelected ? '!text-navyblue-500' : '!text-black-700'}`}
              />
            </div>
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;