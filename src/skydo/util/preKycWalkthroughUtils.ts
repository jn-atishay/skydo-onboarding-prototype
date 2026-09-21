import { ACCOUNT_CREATED_STATES, USER_STATES } from "../constants/onboarding";
import { isDashboardAccessible } from "./functions";
import { TOUR_STEPS } from "../types/appTour";
import { PositionProps } from "@reactour/popover";
import JSHelpers from "../components/AtomicComponents/JSHelpers";

export const isPreKycWalkthroughVisible = (onboardingState: string) => {
  return (
    isDashboardAccessible(onboardingState) &&
    !ACCOUNT_CREATED_STATES.includes(onboardingState) &&
    onboardingState !== USER_STATES.NO_STATE &&
    onboardingState
  );
};

export const getDaysAfterDate = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getMonthsAfterDate = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const getPopoverPositionBasedOnStep = (step: number, positionProps: PositionProps) => {
  switch (step) {
    case TOUR_STEPS.INTERNATION_ACCOUNT_NAV:
      return "right";
    case TOUR_STEPS.INTERNATION_ACCOUNT_DETAILS:
      return [positionProps?.left - positionProps?.width - 10, positionProps?.top];
    case TOUR_STEPS.ACTIVE_INVOICES_NAV:
      return "right";
    case TOUR_STEPS.ACTIVE_INVOICES_ROW:
      return "top";
    case TOUR_STEPS.INVOICE_DETAILS_FX:
      return [positionProps?.left - positionProps?.width - 10, positionProps?.top];
  }
  return "";
};
export const setAppTourStep = (step: number) => {
  JSHelpers.setInDeviceStore("app_tour_step", step);
};
export const getAppTourStep = () => {
  return JSHelpers.getFromDeviceStore<number>("app_tour_step", 0);
};

export const setAppTourOnceDoneStatus = () => {
  JSHelpers.setInDeviceStore("app_tour_done", true);
};

export const isAppTourOnceDone = (): boolean => {
  return JSHelpers.getFromDeviceStore<boolean>("app_tour_done", false);
};
