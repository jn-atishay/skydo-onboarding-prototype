//Nov 2023

import TourIcon from "../Icons/TourIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import useAppTourStore from "../../store/useAppTourStore";
import { getAppTourStep, isAppTourOnceDone } from "../../util/preKycWalkthroughUtils";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {}

const PreKycWalkthroughCta = (props: Props) => {
  const { setAppTourStartPopupStatus } = useAppTourStore();
  const analytics = useAnalytics();
  const appTourStep = getAppTourStep();

  const onClick = () => {
    setAppTourStartPopupStatus(true);
    analytics.trackAsync(Events.CONTINUE_WALKTHROUGH_CLICKED, {
      onStep: appTourStep,
      hasDoneOnce: isAppTourOnceDone(),
    });
  };

  const appTourCTA =
    appTourStep > 0
      ? Locale.continueWalkthrough
      : isAppTourOnceDone()
      ? Locale.reStartWalkthrough
      : Locale.startWalkthrough;

  return (
    <div className={"fixed bottom-4 right-6 flex flex-row items-center cursor-pointer z-10"} onClick={onClick}>
      <div className={"h-8 bg-navyblue-500 flex items-center px-4 rounded-l-50px"}>
        <Typography
          text={appTourCTA}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-white"}
        />
      </div>
      <TourIcon width={48} height={48} className={"-ml-2"} />
    </div>
  );
};

export default PreKycWalkthroughCta;
