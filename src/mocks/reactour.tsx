// Stand-in for @reactour. The guided product tour is not part of this prototype.
import React from "react";
export const TourProvider = ({ children }: any) => <>{children}</>;
export const useTour = () => ({
  setIsOpen: () => {},
  setSteps: () => {},
  setCurrentStep: () => {},
  isOpen: false,
  currentStep: 0,
  steps: [],
});
export const StepType = {};
export const PopoverContentProps = {};
export default TourProvider;
