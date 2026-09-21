/**
 * @author Raj Sheth
 * created: 25/04/24
 */

import React, { useContext } from "react";
import useUdyamOcrStore from "../../store/useUdyamOcrStore";
import { INVALID_DOC, TaskStatus, UdyamTasks } from "../../types/UdyamOcr";
import CircularLoader from "../UBOPanDetails/CircularLoader";
import UdyamOcrIcon from "../Icons/UdyamOcrIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import ExclamationIcon from "../Icons/ExclamationIcon";
import Button from "../AtomicComponents/Button";
import FullTick from "../Icons/FullTick";
import AppContext from "../../context/AppContext";
import classNames from "classnames";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  businessLegalName: string;
  onUploadAnotherDoc: () => void;
  containerClass?: string;
}

const LoaderStep = ({ status, step }: { status: TaskStatus; step: string }) => {
  const { theme } = useContext(AppContext);
  return (
    <div className={"flex_row_item_center my-4"}>
      {(status === TaskStatus.SUCCESS || status === TaskStatus.COMPLETE) && (
        <>
          <FullTick />
          <Typography
            text={step}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight={"700"}
            textClasses={"!text-green-400 ml-3"}
          />
        </>
      )}
      {status === TaskStatus.IN_PROGRESS && (
        <>
          <CircularLoader />
          <Typography
            text={step}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight={"700"}
            textClasses={"!text-green-400 ml-3"}
          />
        </>
      )}
      {status === TaskStatus.NOT_STARTED && (
        <>
          <FullTick bgColor={theme.hexColors.black[400]} tickColor={theme.hexColors.black[50]} />
          <Typography text={step} size={TYPOGRAPHY_SIZES.MEDIUM} textClasses={"!text-black-500 ml-3"} />
        </>
      )}
      {status === TaskStatus.ERROR && (
        <>
          <ExclamationIcon className={"flex flex-row flex-1"} />
          <Typography text={step} size={TYPOGRAPHY_SIZES.MEDIUM} textClasses={"!text-red-400 ml-3"} />
        </>
      )}
    </div>
  );
};

const getErrorCopy = (steps: UdyamTasks, businessLegalName: string): string => {
  if (steps[0].errorReason === INVALID_DOC) {
    return Locale.invalidUdyamCertificate;
  }
  if (steps[2].errorReason === "NAME_MATCH_FAILED") {
    return Locale.invalidBusinessName.replaceAll(":businessLegalName", businessLegalName);
  }
  return Locale.invalidUdyamCertificate;
};

export const UdyamOcrContent: React.FC<Props> = (props) => {
  const { businessLegalName: businessName, onUploadAnotherDoc, containerClass = "" } = props;
  const { steps, status, reset, setPopupVisible } = useUdyamOcrStore();
  const isLoaderComplete = status !== TaskStatus.IN_PROGRESS;
  const analytics = useAnalytics();

  return (
    <div className={classNames("flex-1 flex flex-col items-center justify-center", containerClass)}>
      <div className={"relative"}>
        <div className={"absolute h-[100%] w-[100%] z-1 flex flex-row items-center justify-center"}>
          {!isLoaderComplete && <CircularLoader isWhite={true} />}
        </div>
        <UdyamOcrIcon
          className={classNames("rounded-t-10px", {
            "brightness-50": !isLoaderComplete,
          })}
        />
      </div>
      <div className={"flex flex-col mt-4"}>
        <div className={"flex items-center justify-center"}>
          <Typography
            text={Locale.validatingUdyamVerification}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-center"}
          />
        </div>
        {status === TaskStatus.ERROR ? (
          <div className={"flex flex-row items-center my-4 max-w-[95%] self-center"}>
            <ExclamationIcon className={"flex flex-row flex-1"} />
            <div className={"flex flex-row flex-9"}>
              <Typography
                text={getErrorCopy(steps, businessName)}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!text-red-400 !ml-3"}
              />
            </div>
          </div>
        ) : (
          <div className={"flex flex-col items-center"}>
            <div className={"mt-2 mb-4"}>
              <Typography
                text={Locale.udyamVerificationSubtext}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.MEDIUM}
              />
            </div>
            <div className={"flex flex-col items-start"}>
              {steps.length > 2 && (
                <>
                  <LoaderStep step={Locale.runningAuthenticityCheck} status={steps[0].status} />
                  <LoaderStep step={Locale.fetchingBusinessInformation} status={steps[1].status} />
                  <LoaderStep step={Locale.matchingBusinessName} status={steps[2].status} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {status === TaskStatus.ERROR && (
        <div>
          <Button
            title={Locale.uploadAnotherDocument}
            onButtonClick={() => {
              analytics.trackAsync(Events.UDYAM_UPLOAD_ANOTHER_DOC);
              reset();
              setPopupVisible(false);
              setTimeout(() => {
                onUploadAnotherDoc();
              }, 500);
            }}
            size={BUTTON_SIZES.MEDIUM}
            type={BUTTON_TYPES.PRIMARY}
          />
        </div>
      )}
    </div>
  );
};

export default UdyamOcrContent;
