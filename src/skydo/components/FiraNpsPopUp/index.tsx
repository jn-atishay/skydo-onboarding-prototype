import Popup from "../AtomicComponents/Popup";
import NpsInput from "../NpsInput";
import useFiraNpsStore from "../../store/useFiraNpsStore";
import FullTickIconWithCircles from "../Icons/FullTickIconWithCircles";
import Typography from "../AtomicComponents/Typography";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import { getScoreRange, NpsInputSource, ScoreRange, sleep } from "../../constants/npsInputConstants";
import React, { useEffect, useRef } from "react";
import useNpsStore from "../../store/useNpsStore";
import Button from "../AtomicComponents/Button";
import useUserData from "../../store/useUserData";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import useToastMessages from "../../store/toastMessages";
import useAnalytics from "../../analytics/useAnalytics";

const FiraNpsPopUp = () => {
  const { isFiraNpsPopUpVisible, setFiraNpsPopVisibility, fileName } = useFiraNpsStore();
  const { fetchNpsData, showNps } = useNpsStore();
  const ref = useRef<HTMLDivElement>(null);
  const { loggedInUserEmail } = useUserData();
  const { submitNpsResponse, npsScore, npsSubmitted } = useNpsStore();
  const { addToast } = useToastMessages();
  const analytics = useAnalytics();

  const scrollCallback = async () => {
    await sleep(0);
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    fetchNpsData();
  }, []);

  const onClosePopUp = () => {
    setFiraNpsPopVisibility(false, analytics);
  };

  const postSubmit = () => {
    const scoreRange = getScoreRange(npsScore);
    if (scoreRange != ScoreRange.HIGH) {
      setFiraNpsPopVisibility(false, analytics);
      addToast({
        type: TOAST_TYPES.SUCCESS,
        id: "success_copied",
        body: "Thank you for your feedback! We shall continue to improve ",
        time: 2000,
      });
    }
  };

  const renderContent = () => {
    return (
      <div>
        <div className={"flex flex-row justify-end sticky top-0 w-full bg-white pt-6 px-6"}>
          <CrossIcon className={"cursor-pointer"} onClick={onClosePopUp} />
        </div>

        <div className={"flex flex-col gap-6 items-center px-6 pb-6"} ref={ref}>
          {npsSubmitted ? null : (
            <>
              <FullTickIconWithCircles />
              <div className={"flex flex-col items-center gap-2"}>
                <Typography
                  text={"Your file should download now"}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  fontWeight={"700"}
                  textClasses={"!text-green-400"}
                />
                <Typography text={fileName} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM} />
              </div>{" "}
            </>
          )}
          {showNps ? (
            <>
              {npsSubmitted ? null : <div className={"w-full h-[1px] bg-black-400"}></div>}
              <NpsInput
                source={NpsInputSource.POP_UP}
                scrollCallback={scrollCallback}
                email={loggedInUserEmail}
                npsScoreInputContainerClass={"bg-black-50 p-4 rounded"}
                postNpsSubmit={postSubmit}
              />
            </>
          ) : null}
        </div>

        {showNps ? null : (
          <div className={"flex flex-row justify-center mb-6"}>
            <Button
              title={"Close"}
              type={BUTTON_TYPES.PRIMARY}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={onClosePopUp}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      open={isFiraNpsPopUpVisible}
      closeIconClick={onClosePopUp}
      outsideClick={onClosePopUp}
      containerClass={"!p-0 !w-1/2 !max-h-[550px]"}
    />
  );
};

export default FiraNpsPopUp;
