//Nov 2023

import Popup from "../AtomicComponents/Popup";
import useAppTourStore from "../../store/useAppTourStore";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import { useTour } from "@reactour/tour";
import Typography from "../AtomicComponents/Typography";
import FE_ROUTES from "../../util/feRoutes";
import { useRouter } from "next/router";

interface Props {}

const AppTourExitConfirmationPopup = (props: Props) => {
  const {} = props;
  const { setInvoicesSubNavStatus, isAppTourExitConfirmationPopupOpen, setAppTourExitConfirmationPopupStatus } =
    useAppTourStore();
  const { setIsOpen } = useTour();
  const router = useRouter();
  const onclose = () => {
    setAppTourExitConfirmationPopupStatus(false);
  };

  const onExitTour = async () => {
    setAppTourExitConfirmationPopupStatus(false);
    setInvoicesSubNavStatus(false);
    setIsOpen(false);
    void router.push(FE_ROUTES.DASHBOARD);
  };
  const renderContent = () => {
    return (
      <div className={"my-6"}>
        <Typography text={Locale.exitConfText} size={TYPOGRAPHY_SIZES.SMALL} />
      </div>
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      outsideClick={onclose}
      open={isAppTourExitConfirmationPopupOpen}
      isCommonHeader={true}
      title={Locale.areTouSureToExit}
      closeIconClick={onclose}
      isDashboardPopup={true}
      renderCTAs={() => {
        return (
          <>
            <Button
              title={Locale.goBack}
              onButtonClick={onclose}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
            />
            <Button title={Locale.yesExit} onButtonClick={onExitTour} size={BUTTON_SIZES.SMALL} isRedButton={true} />
          </>
        );
      }}
    />
  );
};

export default AppTourExitConfirmationPopup;
