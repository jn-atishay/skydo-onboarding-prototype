import InitiateTestPaymentPopUp from "./InitiateTestPaymentPopUp";
import React, { useContext, useEffect } from "react";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import { useRouter } from "next/router";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { isManualCheckPending } from "../../util/functions";
import useUserData from "../../store/useUserData";
import FE_ROUTES from "../../util/feRoutes";
import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import OneDollarBillIcon from "../Icons/OneDollarBillIcon";
import Button from "../AtomicComponents/Button";
import RightArrowIcon from "../Icons/RightArrowIcon";
import USFlagIcon from "../Icons/CountryFlags/USFlagIcon";
import UKFlagIcon from "../Icons/CountryFlags/UKFlagIcon";
import CanadaFlagIcon from "../Icons/CountryFlags/CanadaFlagIcon";
import EuropeFlagIcon from "../Icons/CountryFlags/EuropeFlagIcon";
import ROWFlagIcon from "../Icons/CountryFlags/ROWFlagIcon";
import FullTick from "../Icons/FullTick";
import AppContext from "../../context/AppContext";
import { UserDetailsContext } from "../DashboardContainer";
import useHomeInvoiceStore from "../../store/useHomeInvoiceStore";
import { USER_STATES } from "../../constants/onboarding";
import { VKYCStatus } from "../../types/vkyc";
import useVideoKycStore from "../../store/useVideoKycStore";
import useBannersStore from "../../store/useBannersStore";
import useTestTransactionStore from "../../store/useTestTransactionStore";
import useHomeStateStore from "../../store/useHomeStateStore";

const TestTransactionBanner = () => {
  const analytics = useAnalytics();
  const router = useRouter();
  const { theme } = useContext(AppContext);
  const { trial_payment } = router.query;
  const { userState } = useUserData();
  const manualVerificationPending = isManualCheckPending(userState);
  const flagWidth = 32;
  const flagHeight = 32;
  const { exporterDetails } = useContext(UserDetailsContext);
  const companyShortName = exporterDetails?.correspondentName || exporterDetails?.businessLegalName || "";
  const { fetchHomeInvoices } = useHomeInvoiceStore();
  const { verifStatus, isLoading, refetch } = useVideoKycStore();
  const { fetchBanners, fetchHomeWidget } = useBannersStore();
  const { showPopUp, onInitiateTestPaymentClick } = useTestTransactionStore();
  const { homeState } = useHomeStateStore();

  const onInitiateTestPaymentSuccessCallback = () => {
    void fetchHomeInvoices();
    void fetchBanners();
    void fetchHomeWidget();
    analytics?.trackAsync(Events.TEST_TRANSACTION_TRANSFER, {
      deeplink: trial_payment,
      manualVerificationPending: manualVerificationPending,
      source: homeState,
    });
  };

  const openPopUp = () => {
    showPopUp();
    analytics.trackAsync(Events.TEST_TRANSACTION_INITIATE, {
      deeplink: trial_payment,
      manualVerificationPending: manualVerificationPending,
      source: homeState,
    });
  };

  const onPostSuccessCtaClick = () => {
    let url = FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", "test");
    void router.push(url);
    analytics.trackAsync(Events.TEST_TRANSACTION_TRACK, {
      deeplink: trial_payment,
      manualVerificationPending: manualVerificationPending,
    });
  };

  const renderTickMessage = (msg: string, textColor?: string) => {
    return (
      <span className={"flex space-x-1"}>
        <FullTick tickColor={theme.hexColors.green[400]} bgColor={theme.hexColors.green[100]} />
        {textColor ? <Typography text={msg} textClasses={textColor} /> : <Typography text={msg} />}
      </span>
    );
  };

  const initializeVkycStore = async () => {
    await refetch();
  };

  useEffect(() => {
    void initializeVkycStore();
  }, []);

  useEffect(() => {
    if (trial_payment) {
      openPopUp();
    }
  }, [trial_payment]);

  const isVkycApproved = verifStatus == VKYCStatus.APPROVED;
  const isOnboardingCompleted =
    (userState == USER_STATES.BENEFICIARY_ACCOUNT_PENDING || userState == USER_STATES.ONBOARDING_COMPLETE) &&
    isVkycApproved;

  return isLoading ? null : (
    <>
      <InitiateTestPaymentPopUp
        onInitiateTestPayment={() => onInitiateTestPaymentClick(onInitiateTestPaymentSuccessCallback)}
        isManualVerificationPending={manualVerificationPending}
        postSuccessButton={() => {
          return (
            <Button
              title={"Track payment"}
              size={BUTTON_SIZES.SMALL}
              buttonClass={"space-x-3"}
              onButtonClick={() => {
                analytics?.trackAsync(Events.TT_FINISH, {
                  cta: "Track payment",
                });
                onPostSuccessCtaClick();
              }}
            />
          );
        }}
      />
      {!isOnboardingCompleted ? (
        <div className={classNames("flex-4 flex-col justify-evenly space-y-1")}>
          <div className={"flex flex-col justify-between h-full"}>
            <div className={"flex flex-row justify-between"}>
              <div className={"flex flex-col"}>
                <Typography
                  text={Locale.testTransactionCopies.tryPayment}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.SMALL}
                />
                <Typography
                  text={Locale.expPayment}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-black-500"}
                />
              </div>
              <OneDollarBillIcon />
            </div>
            <div className={"flex flex-row justify-between items-end"}>
              <div className={"flex flex-col space-y-2"}>
                {renderTickMessage(Locale.testTransactionCopies.messageOne, "!text-black-500")}
                {renderTickMessage(Locale.testTransactionCopies.messageTwo, "!text-black-500")}
                {renderTickMessage(Locale.testTransactionCopies.messageThree, "!text-black-500")}
              </div>
              <Button
                title={Locale.testTransactionCopies.tryPayment}
                size={BUTTON_SIZES.SMALL}
                rightIcon={() => <RightArrowIcon width={16} height={16} />}
                onButtonClick={openPopUp}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={classNames("flex flex-col items-center space-y-1")}>
          <div className={"flex space-x-2"}>
            <USFlagIcon isFx={true} width={flagWidth} height={flagHeight} />
            <UKFlagIcon width={flagWidth} height={flagHeight} />
            <CanadaFlagIcon width={flagWidth} height={flagHeight} />
            <EuropeFlagIcon width={flagWidth} height={flagHeight} />
            <ROWFlagIcon width={flagWidth} height={flagHeight} />
          </div>
          <div className={"flex flex-col items-center gap-0"}>
            <Typography type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} text={Locale.vkycIsSuccessful} />
            <div className={"flex flex-row items-center"}>
              <Typography
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.SMALL}
                text={Locale.dashboardWelcomeMainVkyc.replace(":shortName", String(companyShortName))}
              />
              <span className={"ml-2 scale-125"}>&#x1f389;</span>
            </div>
          </div>
          <div className={"pt-4"}>
            <Typography
              text={"Do a free test payment to see how your Skydo account works"}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-green-400"}
              fontWeight={"700"}
            />
          </div>
          <div className={"flex space-x-3 pt-1"}>
            {renderTickMessage(Locale.testTransactionCopies.messageOne)}
            {renderTickMessage(Locale.testTransactionCopies.messageTwo)}
            {renderTickMessage(Locale.testTransactionCopies.messageThree)}
          </div>
          <div className={"pt-4"}>
            <Button
              title={Locale.testTransactionCopies.initPayment}
              size={BUTTON_SIZES.SMALL}
              rightIcon={() => <RightArrowIcon width={16} height={16} />}
              onButtonClick={openPopUp}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TestTransactionBanner;
