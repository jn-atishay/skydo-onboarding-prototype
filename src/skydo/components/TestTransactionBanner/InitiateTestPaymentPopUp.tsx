import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, DESKTOP_MIN_WIDTH, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import USFlagIcon from "../Icons/CountryFlags/USFlagIcon";
import React, { useContext, useEffect, useState } from "react";
import { UserDetailsContext } from "../DashboardContainer";
import Locale from "../../util/locale/en";
import Notes from "../AtomicComponents/Notes";
import useTestTransactionStore, { TTPopUpState } from "../../store/useTestTransactionStore";
import BottomSheet from "../AtomicComponents/BottomSheet";
import classNames from "classnames";
import dynamic from "next/dynamic";
import FullTickIconWithCircles from "../Icons/FullTickIconWithCircles";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

const AnimationLoader = dynamic(() => import("../Common/AnimationLoader"), { ssr: false });

interface Props {
  onInitiateTestPayment: () => void;
  isManualVerificationPending?: boolean;
  postSuccessButton: () => JSX.Element;
}

const InitiateTestPaymentPopUp = (props: Props) => {
  const { onInitiateTestPayment, isManualVerificationPending } = props;
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { closePopUp, isTTPopUpVisible: isPopUpOpen, ttPopUpState: popUpState } = useTestTransactionStore();
  const { exporterDetails, achAccountNumber } = useContext(UserDetailsContext);
  const companyShortName = exporterDetails?.correspondentName || exporterDetails?.businessLegalName || "";
  const analytics = useAnalytics();

  useEffect(() => {
    if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, []);

  const renderBox = (boxProps: any) => {
    const { bg, copy1, copy2, copy3, copy1Color, copy2Color, copy3TextClasses } = boxProps;
    return (
      <div className={`flex flex-col ${bg} h-full rounded-10px items-center justify-center flex-3 p-4`}>
        <div className={"flex flex-col flex-1 justify-center items-center"}>
          <USFlagIcon isFx={true} is24X24={true} />
          <Typography
            text={copy1}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={`justify-center text-center items-center ${copy1Color} `}
          />
        </div>
        <div className={"flex flex-col flex-1 justify-center items-center"}>
          <Typography
            text={copy2}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={copy2Color}
          />
          <Typography
            text={copy3}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.LARGE}
            textClasses={copy3TextClasses}
          />
        </div>
      </div>
    );
  };

  const leftBoxProps = {
    bg: "bg-blue-50",
    copy1: `Skydo Inc`,
    copy2: "Transfer amount",
    copy3: `USD 0.10`,
    copy1Color: "!text-black-700",
    copy2Color: "!text-black-500",
    copy3TextClasses: "!text-black-700",
  };

  const rightBoxProps = {
    bg: "bg-navyblue-500",
    copy1: `${companyShortName}'s US account`,
    copy2: "Account number",
    copy3: `${achAccountNumber ? achAccountNumber : "XXXXXX"}`,
    copy1Color: "!text-white",
    copy2Color: "!text-blue-200",
    copy3TextClasses: `!text-white ${isManualVerificationPending ? "blur-sm" : ""}`,
  };

  // initTestPaymentPopUpState = 2;

  const renderContent = () => {
    switch (popUpState) {
      case TTPopUpState.NOT_STARTED:
        return (
          <div className={"flex flex-col h-[70%]"}>
            {isManualVerificationPending ? (
              <Notes
                text={Locale.moneyWillReflectPostKYC}
                typographySize={TYPOGRAPHY_SIZES.SMALL}
                iconHeight={24}
                iconWidth={24}
                className={"bg-yellow-100 border-yellow-200 border-[1px] mb-4 -mt-4"}
              />
            ) : null}
            <div className={"flex flex-row w-[100%] items-center h-full"}>
              {renderBox(leftBoxProps)}
              <div className={"flex-col flex-1"}>
                <AnimationLoader src={"./arrow-animation.json"} animation={true} />
              </div>
              {renderBox(rightBoxProps)}
            </div>
          </div>
        );
      case TTPopUpState.IN_PROGRESS:
        return (
          <div className={"flex flex-col items-center justify-center w-[100%] h-[64%]"}>
            {isManualVerificationPending ? (
              <Notes
                text={Locale.moneyWillReflectPostKYC}
                typographySize={TYPOGRAPHY_SIZES.SMALL}
                iconHeight={24}
                iconWidth={24}
                className={"bg-yellow-100 border-yellow-200 border-[1px] mb-4"}
              />
            ) : null}
            <AnimationLoader
              src={"./payment-animation.json"}
              width={isManualVerificationPending ? "63%" : "80%"}
              height={isManualVerificationPending ? "63%" : "80%"}
              animation={true}
            />
          </div>
        );
      case TTPopUpState.COMPLETED:
        const isMobileAndVaCreated = window.innerWidth < DESKTOP_MIN_WIDTH && !isManualVerificationPending;

        if (isMobileAndVaCreated)
          return (
            <div className={"flex flex-col w-[100%]"}>
              <div className={"flex flex-col items-center gap-4 pb-6"}>
                <FullTickIconWithCircles width={80} height={80} />
                <div className={"flex flex-col items-center gap-2"}>
                  <Typography
                    text={"Yay! Your USD 0.10 is on the way 🎉"}
                    type={TYPOGRAPHY_TYPES.HEADING}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    fontWeight={"700"}
                  />
                  <Typography
                    text={"Track your payment in the recent payments page"}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={"400"}
                    textClasses={"!text-black-500"}
                  />
                </div>
              </div>
            </div>
          );

        return (
          <div className={"flex flex-col h-[70%] w-[100%] items-center justify-center"}>
            <div className={"flex flex-col items-center justify-center space-y-2"}>
              <FullTickIconWithCircles width={64} height={64} />
              <div className={"flex flex-col items-center justify-center"}>
                <Typography
                  text={`USD 0.10`}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-green-400"}
                />
                <Typography
                  text={isManualVerificationPending ? "transfer initiated successfully" : "transferred successfully"}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-green-400 mb-2"}
                />
                {isManualVerificationPending ? (
                  <Notes
                    text={Locale.moneyWillReflectPostKYC}
                    typographySize={TYPOGRAPHY_SIZES.SMALL}
                    iconHeight={24}
                    iconWidth={24}
                    className={"bg-yellow-100 border-yellow-200 border-[1px]"}
                  />
                ) : null}
              </div>
            </div>
            <div className="w-[80%] h-px bg-black-400 my-6 "></div>
            <div className={"flex flex-col items-center justify-center space-y-1.5 "}>
              <Typography text={`To: ${companyShortName}`} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
              <div className={"flex flex-row space-x-2 items-center"}>
                <Typography text={`Account number: `} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL}>
                  <Typography
                    text={achAccountNumber ? achAccountNumber : "XXXXXX"}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={`${isManualVerificationPending ? "blur-sm" : ""}`}
                  />
                </Typography>
                <USFlagIcon isFx={true} width={16} height={16} />
              </div>
            </div>
          </div>
        );
    }
  };

  const renderCTAs = () => {
    switch (popUpState) {
      case TTPopUpState.NOT_STARTED:
        return (
          <Button
            title={Locale.testTransactionCopies.startButtonCta}
            size={BUTTON_SIZES.SMALL}
            onButtonClick={() => {
              analytics.trackAsync(Events.TEST_TRANSACTION_INITIATE_CLICK);
              onInitiateTestPayment();
            }}
            buttonClass={classNames("", {
              "!w-full": isMobile,
            })}
          />
        );
      case TTPopUpState.IN_PROGRESS:
        return (
          <Button
            title={"Transferring USD 0.10"}
            size={BUTTON_SIZES.SMALL}
            isDisabled={true}
            buttonClass={classNames("", {
              "!w-full": isMobile,
            })}
          />
        );
      case TTPopUpState.COMPLETED:
        return props.postSuccessButton();
    }
  };

  const renderTitle = () => {
    switch (popUpState) {
      case TTPopUpState.NOT_STARTED:
        return (
          <div>
            <Typography text={"Start test payment"} textClasses={"headingxsmall"} />
          </div>
        );
      case TTPopUpState.IN_PROGRESS:
        return (
          <div>
            <Typography text={"Processing payment"} textClasses={"headingxsmall"} />
          </div>
        );
      case TTPopUpState.COMPLETED:
        return <Typography text={""} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />;
    }
  };

  // titile and ctas

  const getHeaderClass = () => {
    if (popUpState == TTPopUpState.IN_PROGRESS) return "!justify-center";
    return "";
  };

  const getDisableCrossIcon = () => {
    if (popUpState == TTPopUpState.COMPLETED || popUpState == TTPopUpState.NOT_STARTED) return false;
    return true;
  };

  return (
    <>
      <div className={"block md:hidden"}>
        <BottomSheet
          isOpen={isPopUpOpen}
          onClose={() => {
            analytics.trackAsync(Events.TEST_TRANSACTION_CLOSE_CLICK);
            closePopUp();
          }}
        >
          <div className={"flex flex-col gap-6 h-[450px] justify-between"}>
            {renderTitle()}
            {renderContent()}
            {renderCTAs()}
          </div>
        </BottomSheet>
      </div>
      <div className={"hidden md:block"}>
        <Popup
          open={isPopUpOpen}
          title={renderTitle()}
          isCommonHeader={true}
          renderContent={renderContent}
          renderCTAs={renderCTAs}
          outsideClick={() => {
            analytics.trackAsync(Events.TEST_TRANSACTION_CLOSE_CLICK);
            closePopUp();
          }}
          closeIconClick={() => {
            analytics.trackAsync(Events.TEST_TRANSACTION_CLOSE_CLICK);
            closePopUp();
          }}
          containerClass={"h-[450px] !p-6 min-w-[400px]"}
          isDashboardPopup={true}
          ctaClass={"justify-center mt-4"}
          headerClass={getHeaderClass()}
          disableCrossIcon={getDisableCrossIcon()}
        />
      </div>
    </>
  );
};

export default InitiateTestPaymentPopUp;
