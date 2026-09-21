import classNames from "classnames";
import TransactionTrackerCircles from "../Common/TransactionTrackerCircles";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React, { useContext, useEffect, useState } from "react";
import Tutorial from "../Common/Tutorial";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { UserDetailsContext } from "../DashboardContainer";
import useMobileVersionHook from "../Common/useMobileVersionHook";

interface Props {
  title: string | React.ReactElement;
  subTitle?: string | React.ReactElement;
  isLast?: boolean;
  isPaymentDone?: boolean;
  isPassed?: boolean;
  isCurr?: boolean;
  children?: React.ReactElement;
  secondarySubTitle?: string | null | undefined;
  isTest?: boolean;
  isInstantSettlement?: boolean;
  dataTour?: string;
}

const TransactionStep = (props: Props) => {
  const { title, subTitle, isPassed, isCurr, secondarySubTitle, isLast, isPaymentDone, isTest, isInstantSettlement, dataTour } = props;
  const { userPreference } = useContext(UserDetailsContext);
  const [showTutorialState, setShowTutorialState] = useState(false);
  const {isMobile} = useMobileVersionHook();

  const closeTutorialButton = async () => {
    const res = await beCall({
      path: BE_ROUTES.TEST_TRANSACTION_SKIP_TUTORIAL,
      method: ALLOWED_METHODS.POST,
    });
    if (res.success) setShowTutorialState(false);
  };

  const closeTutorial = () => {
    setShowTutorialState(false);
  };

  useEffect(() => {
    if (isTest) {
      setShowTutorialState(!userPreference?.skipTestTransactionTutorial);
    }
  }, [userPreference]);

  const renderBiggerCircle = () => {
    const circleColor = isInstantSettlement ? "#A0BFF8" : "#1AA06B"; // blue-400 or green-400 from custom theme
    return <div className="absolute -translate-x-2/4 w-6 h-6 -translate-y-1/4 rounded-full opacity-30" style={{ backgroundColor: circleColor }} />;
  };

  const isActive = isPassed || isCurr || isPaymentDone;

  const isBiggerCircleVisible = () => (isPaymentDone ? isLast : isCurr);
  
  // Determine border color - use inline style for instant settlement to ensure it works
  const getBorderColor = () => {
    if (isLast) return "white";
    if (isInstantSettlement && isPassed) return "#276EF1"; // blue-400 from custom theme
    if (!isInstantSettlement && isPassed) return "#1AA06B"; // green-400 from custom theme
    return "#CFD7DF"; // black-400 from custom theme
  };
  
  // console.log('🎨 TransactionStep - isInstantSettlement:', isInstantSettlement, 'isPassed:', isPassed, 'borderColor:', getBorderColor());
  
  return (
    <div
      className={classNames("z-1 relative border-l", {
        "pb-8": !isLast,
      })}
      style={{ borderColor: getBorderColor() }}
      data-tour={dataTour}
    >
      {showTutorialState && !isMobile ? (
        <Tutorial outsideClick={closeTutorial} buttonClick={closeTutorialButton} isPaymentDone={isPaymentDone} />
      ) : null}
      <TransactionTrackerCircles isPassed={isPassed} isCurrentState={isBiggerCircleVisible()} isInstantSettlement={isInstantSettlement} />
      {isBiggerCircleVisible() ? renderBiggerCircle() : null}
      <div className={"md:pl-10 pl-6 flex flex-col"}>
        <Typography
          text={title}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={!isActive ? "!text-black-500" : ""}
        />
        {subTitle ? (
          <Typography size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500 mt-1"} text={subTitle} />
        ) : null}
        {secondarySubTitle ? (
          <Typography size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500 mt-1"} text={secondarySubTitle} />
        ) : null}
      </div>
      {props.children}
    </div>
  );
};

export default TransactionStep;
