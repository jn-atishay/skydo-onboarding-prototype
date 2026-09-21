import React, { useContext, useEffect, useState } from "react";
import useVideoKycStore, { getPrimaryUbo } from "../../store/useVideoKycStore";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { INPUT_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES, TOAST_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import LightBulbIcon from "../Icons/LightBulbIcon";
import WifiIcon from "../Icons/WifiIcon";
import PANIcon from "../Icons/PANIcon";
import classNames from "classnames";
import AadhaarIcon from "../Icons/AadhaarIcon";
import useAnalytics from "../../analytics/useAnalytics";
import Breadcrumb from "../Common/Breadcrumb";
import FE_ROUTES from "../../util/feRoutes";
import TextCTA from "../AtomicComponents/TextCTA";
import Dropdown from "../AtomicComponents/Dropdown";
import InfoIcon from "../AtomicComponents/ToastMessages/InfoIcon";
import AppContext from "../../context/AppContext";
import { Events } from "../../analytics/EventConstants";
import useUserData from "../../store/useUserData";
import { USER_STATES, SANCTION_CATEGORY } from "../../constants/onboarding";
import { VKYCStatus } from "../../types/vkyc";
import ManualKycPending from "./ManualKycPending";
import UnderReview from "./UnderReview";
import Approved from "./Approved";
import useMobileDetect from "../../util/customHooks/useMobileDetect";
import { QRCodePageForVkyc } from "./QRCodePageForVkyc";
import VkycPageLoader from "../Common/VkycPageLoader";
import { PopupModal, useCalendlyEventListener } from "react-calendly";
import Notes from "../AtomicComponents/Notes";
import VPNDisableIcon from "../Icons/VPNDIsableIcon";
import SanctionDeclarationPopup from "./SanctionDeclarationPopup";
import beCall from "../../util/beCall";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { BFF_ROUTES } from "../../util/beRoutes";
import useToastMessages from "../../store/toastMessages";
import { gql, useQuery } from "@apollo/client";
import { UBOS_QUERY } from "../../gqlQueries/Vkyc";

const FETCH_SCREENING_STATUS = gql`${UBOS_QUERY}`;

const videoKycReq = [
  {
    icon: <PANIcon />,
    text: Locale.vkycReq3,
  },
  {
    icon: <LightBulbIcon />,
    text: Locale.vkycReq1,
  },
  {
    icon: <WifiIcon />,
    text: Locale.vkycReq2,
  },
  {
    icon: <VPNDisableIcon />,
    text: Locale.vkycReq5,
  },
];

interface VideoIcon {
  icon: () => JSX.Element;
}

const getVideoKycIcon = (idx: number): VideoIcon => {
  if (idx === 0) {
    return {
      icon: () => <PANIcon className={"w-8 h-8 md:h-auto md:w-auto"} />,
    };
  }
  if (idx === 1) {
    return {
      icon: () => <LightBulbIcon className={"w-8 h-8 md:h-auto md:w-auto"} />,
    };
  }
  if (idx === 3) {
    return {
      icon: () => <VPNDisableIcon className={"w-8 h-8 md:h-auto md:w-auto"} />,
    };
  }
  return {
    icon: () => <WifiIcon className={"w-8 h-8 md:h-auto md:w-auto"} />,
  };
};

type CalendlyVkycPopupProps = {
  setShowCalendly: (value: boolean) => void;
  showCalendly: boolean;
  loggedInUserEmail: string;
  userName: string;
  setIsEventScheduled: (value: boolean) => void;
};

const CalendlyVkycPopup = (props: CalendlyVkycPopupProps) => {
  const analytics = useAnalytics();
  useCalendlyEventListener({
    onProfilePageViewed: () => {
      analytics.trackAsync(Events.CALENDLY_PROFILE_PAGE_VIEW, { eventType: "vkyc" });
    },
    onDateAndTimeSelected: () => {
      analytics.trackAsync(Events.CALENDLY_DATE_TIME_SELECTED, { eventType: "vkyc" });
    },
    onEventTypeViewed: () => {
      analytics.trackAsync(Events.CALENDLY_EVENT_TYPE_VIEWED, { eventType: "vkyc" });
    },
    onEventScheduled: (e) => {
      analytics.trackAsync(Events.CALENDLY_EVENT_SCHEDULED, { eventType: "vkyc" });
      props.setIsEventScheduled(true);
    },
  });
  return (
    <PopupModal
      onModalClose={() => {
        props.setShowCalendly(false);
      }}
      open={props.showCalendly}
      rootElement={document.getElementById("__next") as HTMLElement}
      url={"https://calendly.com/skydo_vkyc/video-kyc-reminder"}
      prefill={{
        email: props.loggedInUserEmail,
        name: props.userName,
      }}
    />
  );
};

export const VideoKycContent = () => {
  const analytics = useAnalytics();
  const {
    isDropdownSectionVisible,
    setIsDropdownSectionVisible,
    isAadhaarExpire,
    generateVkycLink,
    uboList,
    selectedUboId,
    setSelectedUboId,
    isBtnLoading,
    verifStatus,
    vkycLink,
    refetchForPollingStatus,
    setShowQRCode,
    showQRCode,
    isAvailable,
    isScreeningComplete,
    isSanctionAlertsAvailable,
    updateStore,
  } = useVideoKycStore();
  const { theme } = useContext(AppContext);
  const { userState, userName, loggedInUserEmail, phoneNumber } = useUserData();
  const directorsName = selectedUboId ? uboList.find((ubo) => ubo.id === selectedUboId)?.fullName : "";
  const { isMobile } = useMobileDetect();
  const { addToast } = useToastMessages();
  const [isEventScheduled, setIsEventScheduled] = useState(false);
  const [isClientSide, setClientSide] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [showSanctionDeclaration, setShowSanctionDeclaration] = useState(false);
  const [sanctionSubmissionLoading, setSanctionSubmissionLoading] = useState(false);
  const [pollingStartTime, setPollingStartTime] = useState<Date | null>(null);

  // Poll screening status (isScreeningComplete and isSanctionAlertsAvailable) every 3 seconds
  const { data: screeningData } = useQuery(FETCH_SCREENING_STATUS, {
    pollInterval: !isScreeningComplete ? 3000 : 0, // Poll every 3 seconds only when screening is not complete
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'ignore', // Continue polling even if there are errors
    fetchPolicy: 'network-only', // Always fetch from network, don't use cache
    skip: isScreeningComplete, // Skip query when screening is complete
  });

  // Start polling timer when screening is not complete
  useEffect(() => {
    if (!isScreeningComplete && !pollingStartTime) {
      setPollingStartTime(new Date());
    } else if (isScreeningComplete) {
      setPollingStartTime(null);
    }
  }, [isScreeningComplete, pollingStartTime]);

  // Update store when screening status changes and check for timeout
  useEffect(() => {
    if (screeningData?.exporterUser?.exporter?.exporterScreeningResults && !isScreeningComplete) {
      const { isSanctionAlertsAvailable, isScreeningComplete: newScreeningComplete } = 
        screeningData.exporterUser.exporter.exporterScreeningResults;
      
      console.log('Screening status fetched during VKYC loading:', {
        isSanctionAlertsAvailable,
        isScreeningComplete: newScreeningComplete,
        timestamp: new Date().toISOString()
      });

      // Update the store with new screening status
      updateStore({
        isSanctionAlertsAvailable,
        isScreeningComplete: newScreeningComplete
      });
    }

    // Check if 9 seconds have passed since polling started and show declaration
    if (pollingStartTime && !isScreeningComplete && !showSanctionDeclaration) {
      const currentTime = new Date();
      const timeDifference = currentTime.getTime() - pollingStartTime.getTime();
      const fifteenSeconds = 9 * 1000; // 15 seconds in milliseconds

      if (timeDifference >= fifteenSeconds) {
        console.log('9 seconds timeout reached, showing sanction declaration');
        setShowSanctionDeclaration(true);
        // Update store to mark screening as complete to stop polling
        updateStore({
          isScreeningComplete: true,
          isSanctionAlertsAvailable: true
        });
      }
    }
  }, [screeningData, isScreeningComplete, updateStore, pollingStartTime, showSanctionDeclaration]);

  useEffect(() => {
    setClientSide(true);
  }, []);

  useEffect(() => {
    if (uboList.length === 1) {
      setSelectedUboId(uboList[0].id);
      setIsDropdownSectionVisible(false);
      return;
    }
    if (isOutsideOfficeHours()) {
      setIsDropdownSectionVisible(false);
    } else {
      setIsDropdownSectionVisible(isAadhaarExpire);
    }
    if (uboList && uboList.length > 0) {
      let primaryId = getPrimaryUbo(uboList);
      setSelectedUboId(primaryId);
    }
  }, [uboList, isAadhaarExpire]);

  useEffect(() => {
    if (showQRCode && selectedUboId) {
      generateVkycLink(true, true);
      refetchForPollingStatus(selectedUboId);
    }
  }, [showQRCode]);

  useEffect(() => {
    if (isScreeningComplete && isSanctionAlertsAvailable) {
      setShowSanctionDeclaration(true);
    }
  }, [isScreeningComplete, isSanctionAlertsAvailable]);

  const isOutsideOfficeHours = (): boolean => {
    return !isAvailable;
  };
  const canShowAadhaarStep = () => {
    let primaryUbo = uboList?.filter((ubo) => ubo.isPrimary);
    let primaryUboId;
    if (primaryUbo && primaryUbo.length > 0) {
      primaryUboId = primaryUbo[0].id;
    }
    if (isAadhaarExpire) return true;
    if (selectedUboId && selectedUboId !== primaryUboId) {
      return true;
    }
    return false;
  };

  const toggleDropdownSection = () => {
    setIsDropdownSectionVisible(!isDropdownSectionVisible);
  };

  const onSubmit = () => {
    analytics.trackAsync(Events.VKYC_START_CLICK, { aadhaarExpire: canShowAadhaarStep() || false });
    generateVkycLink(isMobile);
  };

  const handleSanctionDeclarationSubmit = async (pepAnswer: boolean, criminalAnswer: boolean) => {
    setSanctionSubmissionLoading(true);
    try {
      const declarationDataList = [];
      
      declarationDataList.push({
        declarationType: SANCTION_CATEGORY.PEP,
        userResponse: pepAnswer ? "YES" : "NO",
      });
      
      declarationDataList.push({
        declarationType: SANCTION_CATEGORY.ADVERSE_MEDIA,
        userResponse: criminalAnswer ? "YES" : "NO",
      });

      const response = await beCall({
        url: BFF_ROUTES.SUBMIT_VKYC_DECLARATION,
        method: ALLOWED_METHODS.POST,
        body: {
          declarationDataList: declarationDataList,
        },
        params: {
          isUserDetailsRequired: true,
        },
              });

      const isSuccess = (response as any) === true || (response && (response as any).success === true);
      
      if (isSuccess) {
        setShowSanctionDeclaration(false);
        analytics.trackAsync(Events.VKYC_DECLARATION_SUBMITTED, {
          pepAnswer, 
          criminalAnswer,
          action: 'sanction_declaration_submitted'
        });
      } else {
        throw new Error('Failed to submit declaration');
      }
    } catch (error) {
      console.error('Error submitting sanction declaration:', error);
      
      // Show error toast message
      addToast({
        type: TOAST_TYPES.ERROR,
        header: "Declaration Submission Failed",
        body: "There was an error submitting your declaration. Please try again.",
        id: "sanction_declaration_error",
        time: 5000,
      });
    } finally {
      setSanctionSubmissionLoading(false);
    }
  };

  let canShowChangeDirectorCta = true;
  if (uboList.length === 1) {
    canShowChangeDirectorCta = false;
  }

  const videoKycSteps = [
    canShowAadhaarStep() ? Locale.vkycStep1Alt : Locale.vkycStep1,
    canShowAadhaarStep() ? Locale.vkycStep2Alt : Locale.vkycStep2,
    canShowAadhaarStep() ? Locale.vkycStep3Alt : Locale.vkycStep3,
  ];

  const renderDropdownSection = () => {
    if (!isDropdownSectionVisible) return null;
    return (
      <div
        className={
          "md:mt-4 p-6 bg-black-50 rounded-10px w-full md:w-2/3 flex flex-col items-center self-center max-w-[450px]"
        }
      >
        <div className={"flex flex-col flex-1 items-left w-full"}>
          <div className={"flex flex-col md:flex-row flex-1 items-left md:items-center"}>
            <Typography
              text={Locale.chooseDirectorsName}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"400"}
              textClasses={"flex-2 mb-2 md:mb-0"}
            />
            <Dropdown
              searchable={true}
              options={uboList.map((ubo) => ({ value: ubo.id, label: ubo.fullName }))}
              placeholder={Locale.selectDirector}
              textInputSize={INPUT_TYPES.X_SMALL}
              containerClass={"flex-3 my-2 md:my-0"}
              onSelect={(value) => {
                setSelectedUboId(value);
              }}
              selectedValue={selectedUboId}
            />
          </div>
          <span className={"flex flex-row md:mt-2 items-center"}>
            <InfoIcon stroke={"#8898AA"} className={"mr-2 w-4 h-4"} />
            <Typography
              text={"The chosen director should be present on the call"}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontWeight={"400"}
              textClasses={"mr-2"}
              fontColor={theme.hexColors.black[500]}
            />
          </span>
        </div>
      </div>
    );
  };

  const getDirectorsName = (): string => {
    if (selectedUboId) {
      return uboList.find((ubo) => ubo.id === selectedUboId)?.fullName || "director";
    }
    if (!isAadhaarExpire) {
      return uboList.find((ubo) => ubo.isPrimary)?.fullName || "director";
    }
    return "director";
  };

  if (
    userState === USER_STATES.MANUAL_VERIFICATION &&
    // for `not_started` or `failed` we show them complete VKYC
    [VKYCStatus.PENDING, VKYCStatus.APPROVED].includes(verifStatus)
  ) {
    return <ManualKycPending />;
  }
  if (vkycLink) {
    if (verifStatus === VKYCStatus.PENDING) {
      return <UnderReview />;
    }
    if (verifStatus === VKYCStatus.APPROVED) {
      return <Approved />;
    }
  }
  if (showQRCode) {
    return (
      <QRCodePageForVkyc
        goBack={() => {
          setShowQRCode(false);
        }}
      />
    );
  }

  return (
    <div className={"flex flex-1 flex-col pb-[80px] md:pb-0 px-4 md:px-0"}>
      <div className={"hide_for_mob"}>
        <Breadcrumb text={Locale.homePage} textRoute={FE_ROUTES.HOME} subText={Locale.videoVerification} />
      </div>

      {!isScreeningComplete&& (<div className="flex flex-col items-center">
        <VkycPageLoader />
      </div>)
      }
      {isScreeningComplete && (
      <div
        className={
          "relative flex flex-col items-center px-4 md:px-8 pb-8 pt-4 md:pt-8 flex-1 h-full justify-between bg-white rounded-10px"
        }
      >
        <div className={"flex flex-col items-center"}>
          <div className={"w-full"}>
            <div className={"flex flex-col gap-4"}>
              <Typography
                text={
                  directorsName
                    ? Locale.videoKycOfDirectorName.replace(":director", directorsName)
                    : Locale.videoKycOfDirector
                }
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!font-bold text-center"}
              />
              <div className={"flex flex-col md:flex-row items-center justify-center"}>
                <Typography
                  text={Locale.presenceOfDirector.replace("director", getDirectorsName())}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"text-center mr-2"}
                />
                {canShowChangeDirectorCta && !isDropdownSectionVisible && (
                  <TextCTA text={"Change director"} onClick={toggleDropdownSection} />
                )}
              </div>
              {renderDropdownSection()}
            </div>
          </div>
          <div
            className={classNames("flex flex-col md:flex-row my-8 items-center w-full gap-2", {
              "md:gap-12": canShowAadhaarStep(),
              "md:gap-24": !canShowAadhaarStep(),
            })}
          >
            {canShowAadhaarStep() ? (
              <div className={"flex flex-col items-center w-11/12 my-2 md:my-0 md:w-1/5 h-auto md:h-40"}>
                <div
                  className={
                    "h-12 w-12 md:h-25 md:w-25 rounded-full bg-blue-200 flex items-center justify-center md:mb-4"
                  }
                >
                  <AadhaarIcon className={"w-8 h-8 md:h-auto md:w-auto"} />
                </div>
                <Typography
                  text={Locale.vkycReq4}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!font-bold text-center"}
                />
              </div>
            ) : null}
            {videoKycReq.map((item, index) => (
              <div
                key={index}
                className={classNames("flex flex-col items-center w-11/12 my-2 md:my-0 h-auto md:h-40", {
                  "md:w-1/5": canShowAadhaarStep(),
                  "md:w-1/4": !canShowAadhaarStep(),
                })}
              >
                <div
                  className={
                    "h-12 w-12 md:h-25 md:w-25 rounded-full bg-blue-200 flex items-center justify-center md:mb-4"
                  }
                >
                  {getVideoKycIcon(index).icon()}
                </div>
                <Typography
                  text={item.text}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!font-bold text-center"}
                />
              </div>
            ))}
          </div>
          {!isOutsideOfficeHours() && (
            <div
              className={
                "md:mt-2 p-6 bg-black-50 rounded-10px flex flex-col gap-4 md:gap-6 w-full md:w-2/3 max-w-[850px]"
              }
            >
              <Typography
                text={Locale.whatToExpectVkyc}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                type={TYPOGRAPHY_TYPES.LABEL}
                textClasses={"border-l-4 border-green-400 pl-4"}
              />
              <div className={"flex flex-col gap-2"}>
                {videoKycSteps.map((item, index) => (
                  <div key={index} className={"flex flex-row items-center gap-4"}>
                    <Typography
                      text={index + 1}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses={
                        "h-5 w-5 flex items-center justify-center rounded-full bg-black-700 !text-white shrink-0"
                      }
                    />
                    <Typography text={item} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={"w-full flex flex-col items-center"}>
          <hr
            className={classNames("w-full border-black-400 my-6", {
              hide_for_mob: !isOutsideOfficeHours(),
            })}
          />
          {isOutsideOfficeHours() && isClientSide ? (
            <>
              <div className={"hide_for_desktop_flex flex flex-col !items-center !gap-6"}>
                <Typography
                  text={Locale.ourRepresentativeOfflineText}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  textClasses={"text-center"}
                />
                <Notes text={Locale.availabilityVkyc} className={"border-[1px] border-yellow-200"} />
              </div>
              <div
                className={
                  "hide_for_desktop flex flex-row flex-1 fixed bottom-0 right-0 left-0 px-4 pt-4 bg-white shadow-elevation1"
                }
              >
                <Button
                  title={isEventScheduled ? Locale.callScheduled : Locale.scheduleCallText}
                  isDisabled={isEventScheduled}
                  onButtonClick={() => {
                    setShowCalendly(true);
                  }}
                  buttonClass={"!w-full mb-4"}
                />
              </div>
            </>
          ) : (
            <div
              className={
                "hide_for_desktop flex flex-row flex-1 fixed bottom-0 right-0 left-0 px-4 pt-4 bg-white shadow-elevation1"
              }
            >
              <Button
                buttonClass={"!w-[100%] flex flex-row flex-1 justify-center"}
                title={Locale.startVerif}
                subTitle={canShowAadhaarStep() ? Locale.startVerifSub2 : Locale.startVerifSub}
                onButtonClick={onSubmit}
                isLoading={isBtnLoading}
                isDisabled={isAadhaarExpire && !selectedUboId}
              />
              <div className={"flex pt-2 pb-4 justify-center"}>
                <Typography
                  text={Locale.byClickingAbove}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-black-500"}
                >
                  <a href="https://www.skydo.com/tnc-vcip" rel="noopener noreferrer" target="_blank">
                    <Typography
                      text={Locale.termsAndConditions}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses={"!text-blue-400 pl-1"}
                    />
                  </a>
                </Typography>
              </div>
            </div>
          )}
          <div className={"hide_for_mob flex flex-row mt-2"}>
            {isOutsideOfficeHours() ? (
              <div className={"flex flex-col items-center gap-6"}>
                <Typography
                  text={Locale.ourRepresentativeOfflineText}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  type={TYPOGRAPHY_TYPES.HEADING}
                />
                <Notes text={Locale.availabilityVkyc} className={"border-[1px] border-yellow-200"} />
                {isClientSide && (
                  <Button
                    title={isEventScheduled ? Locale.callScheduled : Locale.scheduleCallText}
                    isDisabled={isEventScheduled}
                    onButtonClick={() => {
                      setShowCalendly(true);
                    }}
                  />
                )}
              </div>
            ) : (
              <div className={"flex flex-col items-center"}>
                <Typography
                  text={Locale.wantTodoVKYConMobileText}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  type={TYPOGRAPHY_TYPES.PARA}
                  textClasses={"!text-black-500 pb-6"}
                >
                  <Typography
                    text={Locale.clickHereWithCapital}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    type={TYPOGRAPHY_TYPES.PARA}
                    textClasses={"!text-blue-400 pl-1 cursor-pointer"}
                    fontWeight={"bold"}
                    onTextClick={() => {
                      analytics.trackAsync(Events.VKYC_QR_PAGE_VIEW);
                      setShowQRCode(true);
                    }}
                  />
                </Typography>
                <Button
                  isLoading={isBtnLoading}
                  title={Locale.startVerif}
                  subTitle={canShowAadhaarStep() ? Locale.startVerifSub2 : Locale.startVerifSub}
                  onButtonClick={onSubmit}
                  isDisabled={isAadhaarExpire && !selectedUboId}
                  buttonClass={"!justify-center"}
                />
                <Typography
                  text={Locale.byClickingAbove}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                  textClasses={"!text-black-500 pt-4"}
                >
                  <a href="https://www.skydo.com/tnc-vcip" rel="noopener noreferrer" target="_blank">
                    <Typography
                      text={Locale.termsAndConditions}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_X_SMALL}
                      textClasses={"!text-blue-400 pl-1"}
                    />
                  </a>
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
      {isClientSide && showCalendly && (
        <CalendlyVkycPopup
          setShowCalendly={setShowCalendly}
          showCalendly={showCalendly}
          userName={userName}
          loggedInUserEmail={loggedInUserEmail}
          setIsEventScheduled={setIsEventScheduled}
        />
      )}
      {showSanctionDeclaration && (
        <SanctionDeclarationPopup
          isOpen={showSanctionDeclaration}
          onSubmit={handleSanctionDeclarationSubmit}
          isLoading={sanctionSubmissionLoading}
        />
      )}
    </div>
  );
};

export default VideoKycContent;
