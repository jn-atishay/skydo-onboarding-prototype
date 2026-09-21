//Jun 2023

import Locale from "../../util/locale/en";
import FE_ROUTES from "../../util/feRoutes";
import { useRouter } from "next/router";
import SubNavBarItem from "./SubNavBarItem";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import InvoiceDollarIcon from "../Icons/InvoiceDollarIcon";
import InvoiceEditIcon from "../Icons/InvoiceEditIcon";
import useInvoicingStore from "../../store/useInvoicingStore";
import { useEffect } from "react";
import { DraftInvoicesSubRoutes } from "./subNavBarMappings";
import RecurringInvoiceIcon from "../Icons/RecurringInvoiceIcon";
import { useTour } from "@reactour/tour";
import { TOUR_STEPS } from "../../types/appTour";

interface Props {
  isSubNavOpenInside: boolean;
}

const InvoicingSubNav = (props: Props) => {
  const { isSubNavOpenInside } = props;
  const router = useRouter();
  const { isOpen, setCurrentStep, currentStep } = useTour();
  const { numOfDraftInvoices: invoices, getNumberOfDraftInvoices, numberOfRecurringConfigs } = useInvoicingStore();
  useEffect(() => {
    void getNumberOfDraftInvoices(true, true);
  }, []);

  const subNavItems = [
    {
      title: Locale.activeInvoice,
      id: "activeINvoice",
      isSelectedFun: (pathname: string) => pathname.includes(FE_ROUTES.INVOICES),
      href: FE_ROUTES.INVOICES,
      onClick: () => router.push(FE_ROUTES.INVOICES),
      Icon: (isSelected: boolean) => <InvoiceDollarIcon isSelected={isSelected} className={"mr-3 ml-2"} />,
      appTourId: "active_invoice_navbar",
      itemClassName:
        isOpen && currentStep === TOUR_STEPS.ACTIVE_INVOICES_NAV ? "wave-pulse border border-blue-400 !bg-blue-50" : "",
    },
    {
      title: Locale.draftInvoice,
      count: invoices,
      id: "draftInvoice",
      isSelectedFun: (pathname: string) => DraftInvoicesSubRoutes.includes(pathname),
      href: FE_ROUTES.DRAFT_INVOICES,
      onClick: () => router.push(FE_ROUTES.DRAFT_INVOICES),
      Icon: (isSelected: boolean) => <InvoiceEditIcon isSelected={isSelected} className={"mr-3 ml-2"} />,
    },
  ];

  if (numberOfRecurringConfigs) {
    subNavItems.push({
      title: Locale.recurringInvoices,
      count: numberOfRecurringConfigs,
      id: "recurringInvoices",
      isSelectedFun: (pathname: string) => pathname.includes(FE_ROUTES.RECURRING_INVOICE_CONFIGS),
      onClick: () => router.push(FE_ROUTES.RECURRING_INVOICE_CONFIGS),
      href: FE_ROUTES.RECURRING_INVOICE_CONFIGS,
      Icon: (isSelected: boolean) => <RecurringInvoiceIcon isSelected={isSelected} className={"mr-3 ml-2"} />,
    });
  }

  return (
    <div>
      {subNavItems.map((item, index) => (
        <SubNavBarItem
          key={item.id}
          {...item}
          containerClass={"!translate-y-0"}
          className={"!border-0"}
          titleType={TYPOGRAPHY_TYPES.LABEL}
          titleSize={TYPOGRAPHY_SIZES.SMALL}
          renderIcon={item.Icon}
          href={item.href}
        />
      ))}
    </div>
  );
};

export default InvoicingSubNav;
