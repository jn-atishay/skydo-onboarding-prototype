//Nov 2023

import TourIcon from "../Icons/TourIcon";
import { PopoverContentProps, useTour } from "@reactour/tour";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import { ReactElement, useContext } from "react";
import AppContext from "../../context/AppContext";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import CompletionBar from "../Common/CompletionBar";
import { TOUR_STEPS } from "../../types/appTour";
import Button from "../AtomicComponents/Button";
import { ArrowIconSmallRotated } from "../Icons/ArrowIconSmall";
import useAppTourStore from "../../store/useAppTourStore";
import Triangle from "../Triangle";
import classNames from "classnames";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {}

const TourStepDetails = (props: Props) => {
  const { currentStep, steps, meta, setCurrentStep, setIsOpen } = useTour();
  const { theme } = useContext(AppContext);
  const { setAppTourDonePopupStatus } = useAppTourStore();
  const analytics = useAnalytics();
  const renderStepWiseDetails = () => {
    const currStepDetails = steps[currentStep];
    if (typeof currStepDetails.content === "string")
      return (
        <Typography
          text={currStepDetails.content}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-white"}
        />
      );
    else if (typeof currStepDetails.content === "function")
      return currStepDetails.content({} as PopoverContentProps) as unknown as ReactElement;
    return null;
  };

  const onNextClick = () => {
    const nextStep = Math.min(currentStep + 1, (steps?.length || 0) - 1);
    setCurrentStep(nextStep);
    analytics.trackAsync(Events.WALKTHROUGH_STEP_2_CLICKED, { onStep: currentStep });
  };

  const onPreviousClick = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    analytics.trackAsync(Events.WALKTHROUGH_PREVIOUS_CLICKED, { onStep: currentStep });
  };

  const onDoneClick = () => {
    setAppTourDonePopupStatus(true);
    analytics.trackAsync(Events.WALKTHROUGH_DONE_CLICKED);
  };

  const renderActions = () => {
    return (
      <div className={"flex flex-row justify-between mt-4 items-center"}>
        {currentStep !== 0 ? (
          <div onClick={onPreviousClick} className={"flex flex-row cursor-pointer"}>
            <ArrowIconSmallRotated stroke={theme.hexColors.black[500]} />
            <Typography
              text={Locale.previous}
              size={TYPOGRAPHY_SIZES.SMALL}
              type={TYPOGRAPHY_TYPES.LABEL}
              textClasses={"!text-black-500 ml-1"}
            />
          </div>
        ) : null}
        {currentStep === TOUR_STEPS.INTERNATION_ACCOUNT_DETAILS ? (
          <Button
            title={Locale.next}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.X_SMALL}
            onButtonClick={onNextClick}
            buttonClass={"!border !bg-black-700 !border-black-400 hover:!bg-black-600"}
            textClasses={"!text-black-400"}
          />
        ) : null}
        {currentStep === TOUR_STEPS.INVOICE_DETAILS_FX ? (
          <Button
            title={Locale.done}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.X_SMALL}
            onButtonClick={onDoneClick}
            buttonClass={"!border !bg-black-700 !border-black-400 hover:!bg-black-600"}
            textClasses={"!text-black-400"}
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className={"flex flex-col mt-4"}>
      {renderStepWiseDetails()}
      {renderActions()}
    </div>
  );
};

const TourContent = (props: PopoverContentProps) => {
  const { currentStep, steps, afterOpen, setIsOpen, position } = useTour();
  const { theme } = useContext(AppContext);
  const { isInvoicesSubNavOpen, setInvoicesSubNavStatus, setAppTourExitConfirmationPopupStatus } = useAppTourStore();
  const totalSteps = steps.length;
  let trianglePostion = position;
  if (typeof position === "function") {
    // @ts-ignore
    trianglePostion = position();
  }
  return (
    <div className={"rounded-10px p-4 bg-black-700 relative flex flex-col"}>
      <Triangle
        containerClass={classNames("absolute", {
          "rotate-180 left-25 -bottom-4": trianglePostion === "top",
          "-rotate-90 -left-4 top-8": trianglePostion === "right",
          "rotate-90 -right-4 top-8": trianglePostion === "left" && currentStep !== TOUR_STEPS.INVOICE_DETAILS_FX,
          "left-25 -top-4": trianglePostion === "bottom",
        })}
        isBlack={true}
      />
      <div className={"absolute left-4 top-0 -translate-y-1/2"}>
        <TourIcon />
      </div>
      <div className={"flex flex-row justify-end mb-4"}>
        <CrossIcon
          className={"cursor-pointer"}
          height={16}
          width={16}
          stroke={theme.hexColors.white}
          onClick={() => {
            setAppTourExitConfirmationPopupStatus(true);
            // setInvoicesSubNavStatus(false);
            // setIsOpen(false);
          }}
        />
      </div>
      <Typography
        text={Locale.stepOutOf
          .replace(":curr", (currentStep + 1).toString())
          .replace(":total", steps.length.toString())}
        size={TYPOGRAPHY_SIZES.X_X_SMALL}
        textClasses={"!text-white"}
      />
      <CompletionBar successBarWidthPercent={((currentStep + 1) / totalSteps) * 100} className={"!bg-black-600 mt-1"} />
      <TourStepDetails />
    </div>
  );
};

export default TourContent;
