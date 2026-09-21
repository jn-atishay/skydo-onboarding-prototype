import { FocusedHomeCompState } from "../../constants/focusedHomeConstants";
import FocusedHomeWrapper from "./FocusedHomeWrapper";
import FreeTrialIcon from "../Icons/FocusedHome/FreeTrialIcon";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import FreeTrialGreenIcon from "../Icons/FocusedHome/FreeTrialGreenIcon";
import Button from "../AtomicComponents/Button";
import FullTick from "../Icons/FullTick";
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import InitiateTestPaymentPopUp from "../TestTransactionBanner/InitiateTestPaymentPopUp";
import useTestTransactionStore from "../../store/useTestTransactionStore";
import FE_ROUTES from "../../util/feRoutes";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import useUserData from "../../store/useUserData";
import { isManualCheckPending } from "../../util/functions";
import useFocusedHomeStore from "../../store/useFocusedHomeStore";
import Locale from "../../util/locale/en";
import { HomeState } from "../../store/useHomeStateStore";
import useDashboardVersionStore from "../../store/useDashboardVersionStore";
import {DashboardVersionType} from "../../types/DashboardVersionTypes";

interface Props {
  isSelected: boolean;
  compState: FocusedHomeCompState;
}

const TestTxnFocusedHome = (props: Props) => {
  const { isSelected, compState } = props;
  const { isTestTransactionSettled, testAmount } = useFocusedHomeStore();
  const { theme } = useContext(AppContext);
  const { userState } = useUserData();
  const manualVerificationPending = isManualCheckPending(userState);
  const { fetchFocusedHomeData } = useFocusedHomeStore();
  const { showPopUp, closePopUp, onInitiateTestPaymentClick } = useTestTransactionStore();
  const analytics = useAnalytics();
  const { dashboardVersion } = useDashboardVersionStore();

  const ontTestTransactionTrackerClick = () => {
    let url = FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", "test");
    if (dashboardVersion == DashboardVersionType.INVOICE_FULL) {
      url = FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", "test");
    } else {
      url = FE_ROUTES.PAYMENT_DETAILS.replace("[payment_id]", "test");
    }
    window.open(url, "_blank", "noopener,noreferrer");
    analytics.trackAsync(Events.TEST_TRANSACTION_TRACK, {
      deeplink: undefined,
      manualVerificationPending: manualVerificationPending,
    });
  };

  const renderTickMessage = (msg: string, textColor?: string) => {
    return (
      <span className={"flex space-x-2 items-center"}>
        <FullTick isSmall={true} tickColor={"white"} bgColor={theme.hexColors.green[400]} />
        {textColor ? <Typography text={msg} textClasses={textColor} /> : <Typography text={msg} />}
      </span>
    );
  };

  let completedTitle = "";
  if (isTestTransactionSettled) {
    completedTitle = Locale.testTransactionCopies.ttSettled.replace("${testAmount}", testAmount.toFixed(2).toString());
  } else if (manualVerificationPending) {
    completedTitle = Locale.focusedHome.testTxn.completed.manualVer;
  } else {
    completedTitle = Locale.focusedHome.testTxn.completed.others;
  }

  const openPopUp = () => {
    showPopUp();
    analytics.trackAsync(Events.TEST_TRANSACTION_INITIATE, {
      deeplink: undefined,
      manualVerificationPending: manualVerificationPending,
      source: HomeState.FOCUSED,
    });
  };

  const renderComponent = () => {
    switch (compState) {
      case FocusedHomeCompState.NOT_STARTED:
        return (
          <div className={"flex flex-row space-x-6 w-full items-center"}>
            <FreeTrialIcon />
            <Typography
              text={Locale.testTransactionCopies.tryPayment}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"700"}
              textClasses={"!text-black-500"}
            />
          </div>
        );
      case FocusedHomeCompState.IN_PROGRESS:
        return (
          <div className={"flex flex-row space-x-6 w-full"}>
            <FreeTrialGreenIcon />
            <div className={"flex flex-col space-y-4 w-full"}>
              <div className={"flex flex-row justify-between"}>
                <div className={"flex flex-col"}>
                  <Typography
                    text={Locale.testTransactionCopies.tryPayment}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={"700"}
                  />
                  <Typography
                    text={"Experience how payments on Skydo actually work"}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={"400"}
                    textClasses={"!text-black-500"}
                  />
                </div>
                <Button
                  title={Locale.testTransactionCopies.tryPaymentShort}
                  type={BUTTON_TYPES.PRIMARY}
                  size={BUTTON_SIZES.SMALL}
                  onButtonClick={openPopUp}
                />
              </div>
              <div className={"flex flex-col space-y-2"}>
                {renderTickMessage(Locale.testTransactionCopies.messageOne, "!text-black-500")}
                {renderTickMessage(Locale.testTransactionCopies.messageTwo, "!text-black-500")}
                {renderTickMessage(Locale.testTransactionCopies.messageThree, "!text-black-500")}
              </div>
            </div>
          </div>
        );
      case FocusedHomeCompState.COMPLETED:
        return (
          <div className={"flex flex-row space-x-6 w-full items-center"}>
            <FullTick isLarge={true} />
            <div className={"flex flex-row w-full justify-between"}>
              <Typography
                text={completedTitle}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                fontWeight={"700"}
                textClasses={"!text-black-500"}
              />
              <Typography
                text={Locale.track}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                fontWeight={"700"}
                textClasses={"!text-blue-300 cursor-pointer"}
                onTextClick={ontTestTransactionTrackerClick}
              />
            </div>
          </div>
        );
    }
  };

  const onInitiateTestPaymentSuccessCallback = () => {
    void fetchFocusedHomeData();
    analytics?.trackAsync(Events.TEST_TRANSACTION_TRANSFER, {
      deeplink: undefined,
      manualVerificationPending: manualVerificationPending,
      source: HomeState.FOCUSED,
    });
  };

  return (
    <div>
      <FocusedHomeWrapper isSelected={isSelected}>{renderComponent()}</FocusedHomeWrapper>
      <InitiateTestPaymentPopUp
        onInitiateTestPayment={() => onInitiateTestPaymentClick(onInitiateTestPaymentSuccessCallback)}
        isManualVerificationPending={manualVerificationPending}
        postSuccessButton={() => {
          return (
            <Button
              title={Locale.focusedHome.testTxn.proceedNextStep}
              size={BUTTON_SIZES.SMALL}
              buttonClass={"space-x-3"}
              onButtonClick={() => {
                analytics?.trackAsync(Events.TT_FINISH, {
                  cta: Locale.focusedHome.testTxn.proceedNextStep,
                });
                closePopUp();
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default TestTxnFocusedHome;
