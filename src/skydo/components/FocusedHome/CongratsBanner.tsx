import React, { useContext } from "react";
import RightArrowIcon from "../Icons/RightArrowIcon";
import Locale from "../../util/locale/en";
import useUserData from "../../store/useUserData";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { UserDetailsContext } from "../DashboardContainer";
import UKFlagIcon from "../Icons/CountryFlags/UKFlagIcon";
import AusFlagIcon from "../Icons/CountryFlags/AusFlagIcon";
import CanadaFlagIcon from "../Icons/CountryFlags/CanadaFlagIcon";
import EuropeFlagIcon from "../Icons/CountryFlags/EuropeFlagIcon";
import SingaporeFlagIcon from "../Icons/CountryFlags/SingaporeFlagIcon";
import USFlagIcon from "../Icons/CountryFlags/USFlagIcon";
import AccountCardIcon from "../Icons/AccountCardIcon";
import Button from "../AtomicComponents/Button";
import RBIIcon from "../Icons/RBIIcon";
import ShieldWithTickTransparentIcon from "../Icons/ShieldWithTickTransparentIcon";
import SuggestionFeedbackPopup from "../InternationalAccountsComp/SuggestionFeedbackPopup";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import { SUGGESTION_POPUP_TYPES } from "../BusinessAnalytics/constants";
import { getLocationWiseAccountDetails, isManualCheckPending } from "../../util/functions";
import { LOCATION_CODE } from "../../constants/dashboardConstants";
import classNames from "classnames";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface CongratsBannerProps {
  monthlySavings: string;
  monthlyVolume: string;
  onGetStarted: () => void;
}

const CongratsBanner: React.FC<CongratsBannerProps> = ({ monthlySavings, monthlyVolume, onGetStarted }) => {
  const { userName } = useUserData();
  const { exporterDetails } = useContext(UserDetailsContext);
  const { setSuggestionPopupType, virtualAccounts } = useInternationalAccountsStore();
  const isManualVerification = isManualCheckPending(exporterDetails.onBoardingState);
  const analytics = useAnalytics();

  const congratsText = isManualVerification
    ? Locale.focusedHome.congratsBanner.congratsTitleManual
    : Locale.focusedHome.congratsBanner.congratsTitle;

  const accountDetails = getLocationWiseAccountDetails(
    virtualAccounts,
    exporterDetails.virtualAccountName,
    false,
    false
  )[LOCATION_CODE.USA];

  const onMoreQuestions = () => {
    analytics.trackAsync(Events.FOCUSED_HOME.INTENT_CTA_NO_CLICKED, {
      project: "fhv2",
      subpage: "fh_intent",
      cta_label: "No, I have more questions",
    });
    try {
      const launcher = document.querySelector("#botpenguin-launcher-12 .botpenguin-launcher-image-12") as HTMLElement;
      if (!launcher || !launcher.click) {
        throw new Error("Launcher not found");
      }
      launcher.click();
      analytics.trackAsync(Events.FOCUSED_HOME.CHATBOT_OPENED, {
        project: "fhv2",
        subpage: "fh_intent",
      });
    } catch (e) {
      analytics.trackAsync(Events.FOCUSED_HOME.MORE_Q_FORM_OPENED, {
        project: "fhv2",
        subpage: "fh_intent",
      });
      setSuggestionPopupType(SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS);
    }
  };

  return (
    <>
      <div className="bg-white flex flex-col gap-6 p-6 relative rounded-10px shadow-elevation1">
        {/* Header */}
        <Typography
          text={congratsText.replace(":userName", userName)}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={"bold"}
        />

        {/* Banner */}
        <div
          className={
            "relative p-8 flex flex-row items-center justify-between bg-[url('/focused-home-poster-bg.webp')] bg-cover bg-center bg-no-repeat overflow-hidden rounded-10px h-[392px]"
          }
        >
          {/* Trust Marker */}
          <div className={"absolute bottom-8 flex flex-row items-center gap-8"}>
            <div className={"flex flex-row items-center gap-2"}>
              <RBIIcon />
              <div className={"flex flex-col gap-1"}>
                <Typography
                  text={Locale.focusedHome.congratsBanner.operatingUnder}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                  textClasses={"!text-blue-200 !font-bold"}
                />
                <Typography
                  text={Locale.focusedHome.congratsBanner.rbiFramework}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                  textClasses={"!text-blue-200 !font-bold"}
                />
              </div>
            </div>
            <div className={"flex flex-row items-center gap-2"}>
              <ShieldWithTickTransparentIcon />
              <div className={"flex flex-col gap-1"}>
                <Typography
                  text={Locale.focusedHome.congratsBanner.trustedBy}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                  textClasses={"!text-blue-200 !font-bold"}
                />
                <Typography
                  text={Locale.focusedHome.congratsBanner.customersCount}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                  textClasses={"!text-blue-200 !font-bold"}
                />
              </div>
            </div>
          </div>

          {/* Right Content - Savings Text */}
          <div className={"flex flex-col gap-2"}>
            <Typography
              text={Locale.focusedHome.congratsBanner.savingsTitle}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_LARGE}
              textClasses={"!text-white"}
            >
              <Typography
                text={monthlySavings}
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.X_LARGE}
                textClasses={"!text-green-400"}
              />
              <Typography
                text={Locale.focusedHome.congratsBanner.savingsTitlePart2}
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.X_LARGE}
                textClasses={"!text-white"}
              />
            </Typography>
            <Typography
              text={Locale.focusedHome.congratsBanner.monthlyVolumeText.replace(":monthlyVolume", monthlyVolume)}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses={"!text-blue-200 !font-bold"}
            />
          </div>

          {/* Right Content - Account Card */}
          <div className={"rounded-[12px] p-[1.5px] bg-gradient-to-b from-white to-[#5671D2] h-fit relative"}>
            <AccountCardIcon className={"absolute left-1/2 transform -translate-x-1/2 -top-[200px]"} />
            <AccountCardIcon className={"absolute left-1/2 transform -translate-x-1/2 -bottom-[200px] rotate-180"} />
            <div className={"bg-[#435790] rounded-[12px] w-full flex flex-col gap-0"}>
              <div className={"p-4 flex flex-col gap-8 w-[320px]"}>
                <div className={"flex flex-row items-center gap-2"}>
                  <div
                    className={
                      "h-[44px] w-[44px] shrink-0 rounded-full bg-navyblue-500 flex items-center justify-center"
                    }
                  >
                    <USFlagIcon width={27} height={27} isFx={true} />
                  </div>
                  <div className={"flex flex-col gap-[5px] items-start justify-center"}>
                    <Typography
                      text={Locale.focusedHome.congratsBanner.skydoUsdAccount}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={"!text-white"}
                      fontWeight={700}
                    />
                    <Typography
                      text={Locale.focusedHome.congratsBanner.unitedStates}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_X_SMALL}
                      textClasses={"!text-blue-100"}
                      fontWeight={400}
                    />
                  </div>
                </div>
                <div className={"flex flex-row justify-between items-center"}>
                  <div className={"flex flex-col gap-[1px]"}>
                    <Typography
                      text={Locale.focusedHome.congratsBanner.accountHolderNameLabel}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_X_X_SMALL}
                      textClasses={"!text-blue-100"}
                    />
                    <Typography
                      text={exporterDetails.virtualAccountName}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses={"!text-white"}
                    />
                  </div>
                  <div className={"flex flex-col gap-[1px]"}>
                    <Typography
                      text={Locale.focusedHome.congratsBanner.accountNumberLabel}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_X_X_SMALL}
                      textClasses={"!text-blue-100"}
                    />
                    <Typography
                      text={
                        isManualVerification || !accountDetails?.accountNumber
                          ? "XXXXXXXXXX"
                          : accountDetails?.accountNumber
                      }
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses={classNames("!text-white", {
                        "blur-sm": isManualVerification || !accountDetails?.accountNumber,
                      })}
                    />
                  </div>
                </div>
              </div>
              <div
                className={
                  "h-[1px] w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-[#5671D2]"
                }
              />
              <div className={"py-2.5 px-5 flex flex-row items-center gap-2.5"}>
                <UKFlagIcon width={24} height={24} />
                <AusFlagIcon width={24} height={24} />
                <CanadaFlagIcon width={24} height={24} />
                <EuropeFlagIcon width={24} height={24} />
                <SingaporeFlagIcon width={24} height={24} />
                <Typography
                  text={Locale.focusedHome.congratsBanner.countriesCount}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  fontWeight={600}
                  textClasses="!text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-blue-50 flex gap-6 items-center justify-start px-6 py-4 rounded-[10px] w-full">
          <div className="flex-1">
            <Typography
              text={Locale.focusedHome.congratsBanner.readyToReceive}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontWeight={700}
            />
          </div>
          <div className="flex gap-4 items-center justify-start">
            <Button
              title={Locale.focusedHome.congratsBanner.noMoreQuestions}
              onButtonClick={onMoreQuestions}
              buttonClass={"!bg-blue-400"}
            />
            <Button
              title={Locale.focusedHome.congratsBanner.yesGetStarted}
              onButtonClick={onGetStarted}
              rightIcon={() => <RightArrowIcon width={20} height={20} stroke="white" />}
            />
          </div>
        </div>
      </div>
      <SuggestionFeedbackPopup />
    </>
  );
};

export default CongratsBanner;
