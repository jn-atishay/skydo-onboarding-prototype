//Nov 2023

import useAppTourStore from "../../store/useAppTourStore";
import Popup from "../AtomicComponents/Popup";
import { useTour } from "@reactour/tour";
import { TOUR_STEPS } from "../../types/appTour";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import TourIcon from "../Icons/TourIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import DoneFieldsWithFullTick from "../Common/DoneFieldsWithFullTick";
import Button from "../AtomicComponents/Button";
import { useRouter } from "next/router";
import FE_ROUTES from "../../util/feRoutes";
import { useEffect, useState } from "react";
import { setAppTourOnceDoneStatus, setAppTourStep } from "../../util/preKycWalkthroughUtils";
import { destroyDashboardRoutesPublicAccess } from "../../authentication/PreKycDashboardManagement";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {}

const AppTourDonePopup = (props: Props) => {
  const {} = props;
  const { isAppTourDonePopupOpen, setAppTourDonePopupStatus } = useAppTourStore();
  const { setCurrentStep, setIsOpen } = useTour();
  const router = useRouter();
  const [isBackButtonLoading, setBackButtonLoading] = useState<boolean>(false);
  const [isIntAccButtonLoading, setIntAccButtonLoading] = useState<boolean>(false);
  const onClosePopup = () => {
    setAppTourDonePopupStatus(false);
  };

  const analytics = useAnalytics();

  useEffect(() => {
    if (isAppTourDonePopupOpen) {
      analytics.trackAsync(Events.WALKTHROUGH_FINISH_POPUP);
    }
  }, [isAppTourDonePopupOpen]);

  const onGetIntAccountClick = async () => {
    setIsOpen(false);
    setAppTourOnceDoneStatus();
    setAppTourStep(TOUR_STEPS.INTERNATION_ACCOUNT_NAV);
    setIntAccButtonLoading(true);
    destroyDashboardRoutesPublicAccess(null);
    await router.push(FE_ROUTES.INSTANT_ONBOARDING);
    setIntAccButtonLoading(false);
    setAppTourDonePopupStatus(false);
    analytics.trackAsync(Events.WALKTHROUGH_FINISH_POPUP_CTA_CLICKED, { cta: "getAccount" });
  };

  const onBackToDashboardClick = async () => {
    setIsOpen(false);
    setAppTourOnceDoneStatus();
    // setCurrentStep(TOUR_STEPS.INTERNATION_ACCOUNT_NAV);
    setAppTourStep(TOUR_STEPS.INTERNATION_ACCOUNT_NAV);
    setBackButtonLoading(true);
    await router.push(FE_ROUTES.DASHBOARD);
    setAppTourDonePopupStatus(false);
    setBackButtonLoading(false);
    analytics.trackAsync(Events.WALKTHROUGH_FINISH_POPUP_CTA_CLICKED, { cta: "backHome" });
  };

  const renderContent = () => {
    return (
      <div className={"flex flex-col"}>
        <div className={"flex flex-row justify-end mb-1"}>
          <CrossIcon width={24} height={24} onClick={() => onClosePopup()} className={"cursor-pointer"} />
        </div>
        <TourIcon className={"mb-2"} />
        <Typography text={Locale.demoComplete} size={TYPOGRAPHY_SIZES.MEDIUM} fontWeight={700} textClasses={"!mb-2"} />
        <Typography
          text={Locale.demoCompleteTitle}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!mb-4"}
        />
        <DoneFieldsWithFullTick
          text={Locale.legalAndCompliance}
          typoGraphySize={TYPOGRAPHY_SIZES.SMALL}
          iconWidth={24}
          iconHeight={24}
          className={"mt-6"}
        />
        <DoneFieldsWithFullTick
          text={Locale.demoCompleteSubtext}
          typoGraphySize={TYPOGRAPHY_SIZES.SMALL}
          iconWidth={24}
          iconHeight={24}
          // className={"mt-6"}
        />
        <DoneFieldsWithFullTick
          text={Locale.freeTransferIntClient}
          typoGraphySize={TYPOGRAPHY_SIZES.SMALL}
          iconWidth={24}
          iconHeight={24}
          // className={"mt-6"}
        />
        <Button
          isLoading={isIntAccButtonLoading}
          title={Locale.intAccNowCta}
          onButtonClick={onGetIntAccountClick}
          buttonClass={"!w-full justify-center my-6"}
        />
        <Button
          isLoading={isBackButtonLoading}
          title={Locale.backToDashboard}
          onButtonClick={onBackToDashboardClick}
          type={BUTTON_TYPES.SECONDARY}
          buttonClass={"!w-full justify-center"}
        />
      </div>
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      isDashboardPopup={true}
      open={isAppTourDonePopupOpen}
      outsideClick={onClosePopup}
    />
  );
};

export default AppTourDonePopup;
