/**
 * @author Raj Sheth
 * created: 11/04/24
 */

import React, { FC, useContext, useEffect } from "react";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import FullTick from "../Icons/FullTick";
import AppContext from "../../context/AppContext";
import ExclamationIcon from "../Icons/ExclamationIcon";
import CreateInvoiceButton from "../Common/CreateInvoiceButton";
import UploadInvoiceButton from "../../containers/UploadInvoiceContainer/UploadInvoiceButton";
import RibbonWatch from "../Icons/RibbonWatch.";
import useRewardStore from "../../store/useRewardStore";
import { formatDate } from "../../util/formatters";
import Locale from "../../util/locale/en";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

const dateWithSuffix = (dateInput: string): string => {
  const date = +dateInput;
  if (date > 3 && date < 21) return `${date}th`;
  switch (date % 10) {
    case 1:
      return `${date}st`;
    case 2:
      return `${date}nd`;
    case 3:
      return `${date}rd`;
    default:
      return `${date}th`;
  }
};

const Loader = () => {
  return (
    <div className={"flex flex-1 flex-col justify-between"}>
      <div className={"w-full flex flex-row justify-between gap-x-32"}>
        <div className={"flex-5 h-8 bg-black-50 rounded-10px mb-4"} />
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
      </div>
      <div className={"w-full flex flex-row justify-between gap-x-8"}>
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
        <div className={"flex-4 h-8 bg-black-50 rounded-10px mb-4"} />
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
      </div>
      <div className={"w-full flex flex-row justify-between gap-x-8"}>
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
        <div className={"flex-4 h-8 bg-black-50 rounded-10px mb-4"} />
      </div>
      <div className={"w-full mb-4 flex flex-row justify-between gap-x-8"}>
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
        <div className={"flex-1 h-8 bg-black-50 rounded-10px mb-4"} />
      </div>
    </div>
  );
};

const ActivationBanner: FC = () => {
  const { theme } = useContext(AppContext);
  const analytics = useAnalytics();

  const { fetchExporterRewardStatus, exporterRewardStatus, isLoading } = useRewardStore();

  useEffect(() => {
    fetchExporterRewardStatus();
    analytics?.trackAsync(Events.ACTIVATION_BANNER);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className={"flex flex-1 flex-row justify-between"}>
        <RibbonWatch className={"-mt-2 -ml-[24px]"} />
        <div className={"flex flex-3 flex-row gap-x-2 justify-end"}>
          <CreateInvoiceButton source={"activation_banner"} />
          <UploadInvoiceButton source={"activation_banner"} />
        </div>
      </div>
      <div className={"flex flex-1 flex-row mt-2"}>
        <div className={"flex flex-8 flex-row"}>
          <Typography
            text={Locale.noSkydoFee}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={"bold"}
            textClasses={"!text-green-400"}
          />
          <Typography
            text={Locale.forYourFirstPayment}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={"bold"}
            textClasses={"!ml-1 !text-black-700"}
          />
        </div>
      </div>
      <div>
        <Typography
          text={Locale.shareInvoiceWithUs}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={"bold"}
          textClasses={"!text-black-700"}
        />
        <Typography
          text={dateWithSuffix(
            formatDate(exporterRewardStatus?.expiresAt, {
              day: "numeric",
            })
          )}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={"bold"}
          textClasses={"!ml-1 !text-green-400"}
        />
        <Typography
          text={formatDate(exporterRewardStatus?.expiresAt, {
            month: "long",
          })}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={"bold"}
          textClasses={"!ml-1 !text-green-400"}
        />
        <Typography
          text={Locale.availFreePayment}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={"bold"}
          textClasses={"!ml-1 !text-black-700"}
        />
      </div>
      <div className={"flex flex-row mt-4 w-[100%] max-w-[950px] flex-1"}>
        <div className={"min-w-[150px] flex flex-col items-center relative flex-1"}>
          <div className={"absolute w-[50%] left-[50%] border-t-2 border-black-400 border-dashed mt-3"} />
          <FullTick tickColor={theme.hexColors.green[400]} bgColor={theme.hexColors.green[100]} className={"z-1"} />
          <Typography
            text={Locale.videoKycOfDirector}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!text-black-700 !text-center"}
          />
        </div>
        <div className={"min-w-[150px] flex flex-col items-center relative flex-4"}>
          <div className={"absolute w-full border-t-2 border-black-400 border-dashed mt-3"} />
          <FullTick tickColor={theme.hexColors.green[400]} bgColor={theme.hexColors.green[100]} className={"z-1"} />
          <Typography
            text={Locale.testTransaction}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!text-black-700 !text-center"}
          />
        </div>
        <div className={"min-w-[180px] flex flex-col items-center relative flex-2"}>
          <div className={"absolute right-[50%] w-[50%] border-t-2 border-black-400 border-dashed mt-3"} />
          <ExclamationIcon height={24} width={24} className={"z-1"} />
          <Typography
            text={Locale.shareInvoice}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!text-black-700 !text-center"}
          >
            <Typography
              text={`(${Locale.pending})`}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!ml-1 !text-black-500 !text-center"}
            />
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ActivationBanner;
