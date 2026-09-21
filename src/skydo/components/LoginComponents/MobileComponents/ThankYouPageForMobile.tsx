import React, { useEffect } from "react";
import TickWithOuterIcon from "../../Icons/TickWithOuter";
import Typography from "../../AtomicComponents/Typography";
import Locale from "../../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import LaptopIcon from "../../Icons/LaptopIcon";
import LoginWithCursor from "../../Icons/LoginWithCursor";
import KYCShieldIcon from "../../Icons/KYCShieldIcon";
import useUserData from "../../../store/useUserData";
import classNames from "classnames";

export const ThankYouNextSteps = (props: {
  headingComp?: () => React.ReactNode;
  className?: string;
  renderStep1?: () => React.ReactNode;
  renderStep2?: () => React.ReactNode;
  renderStep3?: () => React.ReactNode;
  renderStep3Icon?: () => React.ReactNode;
  step3ClassName?: string;
}) => {
  const { className = "" } = props;
  const { loggedInUserEmail } = useUserData();
  return (
    <div className={classNames("max-w-[370px] align-items", className)}>
      <div className={"flex w-full align-items-center"}>
        {props.headingComp ? (
          props.headingComp()
        ) : (
          <Typography
            text={Locale.hereAreTheNextSteps}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_X_SMALL}
            textClasses={"py-4 text-center w-full"}
          />
        )}
      </div>
      <div className={"flex flex-row flex-grow p-4"}>
        <div className={"flex-1"}>
          <LaptopIcon />
        </div>
        <div className={"flex flex-col flex-5 ml-4"}>
          <Typography
            text={Locale.stepCount.replace(":step", "1")}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-black-500"}
          />
          {props.renderStep1 ? (
            props.renderStep1()
          ) : (
            <>
              <Typography text={Locale.useYourDesktop} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
              <Typography
                text={Locale.dashboardLink}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"700"}
                textClasses={"mt-2"}
              />
            </>
          )}
        </div>
      </div>
      <div className={"flex flex-row flex-grow p-4"}>
        <div className={"flex-1"}>
          <LoginWithCursor />
        </div>
        <div className={"flex flex-col flex-5 ml-4"}>
          <Typography
            text={Locale.stepCount.replace(":step", "2")}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-black-500"}
          />
          {props.renderStep2 ? (
            props.renderStep2()
          ) : (
            <>
              <Typography text={Locale.loginWithEmailId} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
              <Typography
                text={loggedInUserEmail}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"700"}
                textClasses={"mt-2"}
              />
            </>
          )}
        </div>
      </div>
      <div className={classNames("flex flex-row flex-grow p-4", props.step3ClassName)}>
        <div className={"flex-1"}>{props.renderStep3Icon ? props.renderStep3Icon() : <KYCShieldIcon />}</div>
        <div className={"flex flex-col ml-4 flex-5"}>
          <Typography
            text={Locale.stepCount.replace(":step", "3")}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-black-500"}
          />
          {props.renderStep3 ? (
            props.renderStep3()
          ) : (
            <>
              <Typography
                text={Locale.completeKycAndOnboarding}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface Props {
  className?: string;
  stepsClassName?: string;
  renderMainContent?: () => React.ReactNode;
  renderStep1?: () => React.ReactNode;
  renderStep2?: () => React.ReactNode;
  renderStep3?: () => React.ReactNode;
}

const ThankYouPageForMobile = (props: Props) => {
  const { className = "" } = props;
  // scroll to top on first render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={classNames("flex flex-col w-full bg-white rounded-10px", className)}>
      <div className={"flex flex-col px-6 pb-6 items-center"}>
        {props.renderMainContent ? (
          props.renderMainContent()
        ) : (
          <>
            <div className={"pt-4"}>
              <TickWithOuterIcon height={134} width={134} />
            </div>
            <Typography
              text={Locale.thankYouForSigningUp}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"pt-4 text-center w-full"}
            />

            <Typography
              text={Locale.completeVerificationOnDesktop}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"pb-4 text-center w-full"}
            />
          </>
        )}
        <div className={"flex flex-col bg-black-50 w-full rounded-10px items-center"}>
          <ThankYouNextSteps
            renderStep1={props.renderStep1}
            renderStep2={props.renderStep2}
            renderStep3={props.renderStep3}
            className={props.stepsClassName}
          />
        </div>
      </div>
    </div>
  );
};

export default ThankYouPageForMobile;
