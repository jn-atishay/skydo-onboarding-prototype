import { StepType, TourProvider } from "@reactour/tour";
import React, { Dispatch, useEffect, useState } from "react";
import { useRouter } from "next/router";
import TourContent from "./TourContent";
import Locale from "../../util/locale/en";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { TOUR_STEPS } from "../../types/appTour";
import FE_ROUTES from "../../util/feRoutes";
import useAppTourStore from "../../store/useAppTourStore";
import { getAppTourStep, getPopoverPositionBasedOnStep, setAppTourStep } from "../../util/preKycWalkthroughUtils";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { LOCATION_CODE } from "../../constants/dashboardConstants";

interface AppTourP {
  children: React.ReactElement | React.ReactElement[];
}

interface AppTourContextType {
  forceRenderAppTour: () => void;
}
export const AppTourContext = React.createContext<AppTourContextType>({
  forceRenderAppTour: () => {},
});

type ClickProps = {
  setIsOpen: Dispatch<React.SetStateAction<Boolean>>;
  setCurrentStep: Dispatch<React.SetStateAction<number>>;
  currentStep: number;
  steps?: StepType[];
  setSteps?: Dispatch<React.SetStateAction<StepType[]>>;
  meta?: string;
  setMeta?: Dispatch<React.SetStateAction<string>>;
};
const AppTour = (props: AppTourP) => {
  const { children } = props;
  const [step, setStep] = useState(0);
  const [, forceRenderAppTour] = React.useReducer((x) => (x + 1) % 100, 0);
  const router = useRouter();
  const { setInvoicesSubNavStatus } = useAppTourStore();
  const analytics = useAnalytics();

  useEffect(() => {
    const step = getAppTourStep();
    // @ts-ignore
    setStep(step);
  }, []);
  const setCurrentStepUI = async (step?: any) => {
    switch (step) {
      case TOUR_STEPS.INTERNATION_ACCOUNT_NAV:
        await router.push(FE_ROUTES.INTERNATIONAL_ACCOUNTS + `?location=${LOCATION_CODE.USA}`);
        break;
      case TOUR_STEPS.INTERNATION_ACCOUNT_DETAILS:
        setInvoicesSubNavStatus(true);
        await router.push(FE_ROUTES.INTERNATIONAL_ACCOUNTS + `?location=${LOCATION_CODE.USA}`);
        break;
      case TOUR_STEPS.ACTIVE_INVOICES_NAV:
        setInvoicesSubNavStatus(true);
        await router.push(FE_ROUTES.INVOICES);
        break;
      case TOUR_STEPS.ACTIVE_INVOICES_ROW:
        setInvoicesSubNavStatus(true);
        await router.push(FE_ROUTES.INVOICES);
        break;
      case TOUR_STEPS.INVOICE_DETAILS_FX:
        setInvoicesSubNavStatus(true);
        await router.push(FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", "dummy-1"));
        break;
      default:
        break;
    }
    setTimeout(() => {
      setAppTourStep(step);
      setStep(step);
    }, 0);
  };
  const steps: StepType[] = [
    {
      selector: "[data-tour='international_account_nav']",
      content: Locale.appTourStep1,
    },
    {
      selector: "[data-tour='international_account_details_card']",
      content: Locale.appTourStep2,
    },
    {
      selector: "[data-tour='active_invoice_navbar']",
      content: Locale.appTourStep3,
    },
    {
      selector: "[data-tour='invoice_list_row']",
      content: Locale.appTourStep4,
    },
    {
      selector: "[data-tour='invoice_details_fx']",
      content: () => {
        return (
          <div className={"flex flex-col"}>
            <Typography
              text={Locale.appTourStep5}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-white"}
            />
            <div className={"flex flex-col mt-4"}>
              <div className={"flex flex-row"}>
                <Typography
                  text={"1."}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-white mr-1"}
                />
                <Typography
                  text={Locale.appTourStep5_1}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-white"}
                />
              </div>
              <div className={"flex flex-row mt-1"}>
                <Typography
                  text={"2."}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-white mr-1"}
                />
                <Typography
                  text={Locale.appTourStep5_2}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-white"}
                />
              </div>
              <div className={"flex flex-row mt-1"}>
                <Typography
                  text={"3."}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-white mr-1"}
                />
                <Typography
                  text={Locale.appTourStep5_3}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-white"}
                />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const onHighlightClick = (e: MouseEvent, clickProps: ClickProps) => {
    switch (clickProps.currentStep) {
      case TOUR_STEPS.INTERNATION_ACCOUNT_NAV:
        clickProps.setCurrentStep(TOUR_STEPS.INTERNATION_ACCOUNT_DETAILS);
        analytics.trackAsync(Events.WALKTHROUGH_STEP_1_CLICKED);
        break;
      case TOUR_STEPS.INTERNATION_ACCOUNT_DETAILS:
        break;
      case TOUR_STEPS.ACTIVE_INVOICES_NAV:
        clickProps.setCurrentStep(TOUR_STEPS.ACTIVE_INVOICES_ROW);
        analytics.trackAsync(Events.WALKTHROUGH_STEP_3_CLICKED);
        break;
      case TOUR_STEPS.ACTIVE_INVOICES_ROW:
        clickProps.setCurrentStep(TOUR_STEPS.INVOICE_DETAILS_FX);
        analytics.trackAsync(Events.WALKTHROUGH_STEP_4_CLICKED);
        break;
      case TOUR_STEPS.INVOICE_DETAILS_FX:
        break;
      default:
        break;
    }
  };

  /*
    Props info
    popover: represents tour popup box
    maskArea: represents the highlighted/selectable element
    maskWrapper: represents the whole background
    badge: represents the step number default comes at top left corner of popover, not required in this case
    controls: represents the next, previous and done buttons
    close: represents the close button
   */

  return (
    <AppTourContext.Provider
      value={{
        forceRenderAppTour: forceRenderAppTour,
      }}
    >
      <TourProvider
        // scrollSmooth={true}
        scrollSmooth={false}
        steps={steps}
        currentStep={step}
        setCurrentStep={setCurrentStepUI}
        showBadge={false}
        onTransition={() => "center"}
        ContentComponent={TourContent}
        disableInteraction={true}
        onClickHighlighted={onHighlightClick}
        // @ts-ignore
        position={(postionsProps, prevRect) => getPopoverPositionBasedOnStep(step, postionsProps, prevRect)}
        onClickMask={(e) => {}}
        styles={{
          popover: (base, state) => ({
            ...base,
            padding: 0,
            borderRadius: 10,
          }),
          maskArea: (base) => {
            return {
              ...base,
              rx: 10,
            };
          },
          maskWrapper: (base) => ({
            ...base,
            fill: "black",
            color: "black",
            opacity: 0.3,
          }),
        }}
      >
        {children}
      </TourProvider>
    </AppTourContext.Provider>
  );
};

export default AppTour;
