//Nov 2023

import Popup from "../AtomicComponents/Popup";
import useAppTourStore from "../../store/useAppTourStore";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import TourIcon from "../Icons/TourIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import { useTour } from "@reactour/tour";
import RightArrowIcon from "../Icons/RightArrowIcon";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { getAppTourStep, isPreKycWalkthroughVisible } from "../../util/preKycWalkthroughUtils";
import { UserDetailsContext } from "../DashboardContainer";
import FE_ROUTES from "../../util/feRoutes";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {}

const AppTourStartPopup = (props: Props) => {
  const { isAppTourStartPopupOpen, setAppTourStartPopupStatus } = useAppTourStore();
  const { setIsOpen, setCurrentStep } = useTour();
  const { setInvoicesSubNavStatus } = useAppTourStore();
  const router = useRouter();
  const startWalkthrough = router.query?.startWalkthrough;
  const { exporterDetails } = useContext(UserDetailsContext);
  const currentStep = getAppTourStep();
  const analytics = useAnalytics();

  useEffect(() => {
    if (startWalkthrough === "1" && isPreKycWalkthroughVisible(exporterDetails.onBoardingState)) {
      setAppTourStartPopupStatus(true);
      analytics.trackAsync(Events.WALKTHROUGH_START_POPUP_LOAD);
    }
  }, [startWalkthrough, exporterDetails.onBoardingState]);

  const onClosePopup = () => {
    setAppTourStartPopupStatus(false);
  };

  const onClick = () => {
    const step = getAppTourStep();
    if (
      step > 0 ||
      [
        FE_ROUTES.INVOICES,
        FE_ROUTES.INVOICE_DETAILS,
        FE_ROUTES.DRAFT_INVOICE_DETAILS,
        FE_ROUTES.DRAFT_INVOICES,
        FE_ROUTES.RECURRING_INVOICE_CONFIGS,
      ].includes(router.pathname)
    ) {
      setInvoicesSubNavStatus(true);
    }
    setTimeout(() => {
      setIsOpen(true);
      setCurrentStep(step);
    }, 0);
    setAppTourStartPopupStatus(false);
    analytics.trackAsync(Events.WALKTHROUGH_START_POPUP_CONFIRM);
  };

  const renderContent = () => {
    return (
      <div className={"flex flex-col"}>
        <div className={"flex flex-row justify-end mb-1"}>
          <CrossIcon width={24} height={24} onClick={() => onClosePopup()} className={"cursor-pointer"} />
        </div>
        <TourIcon className={"mb-2"} />
        <Typography
          text={Locale.startAppTourSubtext}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          fontWeight={700}
          textClasses={"!mb-2"}
        />
        <Typography
          text={currentStep > 0 ? Locale.startAppResumeTourTitle_1 : Locale.startAppTourTitle_1}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!mr-1"}
        >
          <Typography
            text={Locale.startAppTourTitle_2}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-green-400 !mr-1 !ml-1"}
          />
        </Typography>
        <div className={"flex flex-row justify-end mt-6"}>
          <Button title={Locale.getStartedTour} rightIcon={() => <RightArrowIcon />} onButtonClick={onClick} />
        </div>
      </div>
    );
  };
  return (
    <Popup
      renderContent={renderContent}
      open={isAppTourStartPopupOpen}
      isDashboardPopup={true}
      outsideClick={onClosePopup}
    />
  );
};

export default AppTourStartPopup;
