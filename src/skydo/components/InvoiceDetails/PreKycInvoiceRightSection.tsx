//Sep 2023

import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { getTransactionStatusWiseColorTextMapping, isArchived } from "../../util/functions";
import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import classNames from "classnames";
import InfoBox from "../Common/InfoBox";
import { formatDate } from "../../util/formatters";
import { InvoiceMetadata } from "../../types";
import MessageBox from "./MessageBox";
import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import RecievePaymentsIconInvoice from "../Icons/RecievePaymentsIconInvoice";
import DoneFieldsWithFullTick from "../Common/DoneFieldsWithFullTick";
import SampleTracker from "../SampleTracker";
import Button from "../AtomicComponents/Button";
import { redirectClientToOnboarding } from "../../util/preKycDashboardUtils";
import { useRouter } from "next/router";

interface Props {
  isSkydoInvoice: boolean;
  invoiceMetadata?: InvoiceMetadata;
  isUnpaidInvoice?: boolean;
  invoiceStatus?: string;
  reasonToArchive?: string;
}

const PreKycInvoiceRightSection = (props: Props) => {
  const { reasonToArchive, invoiceStatus, isSkydoInvoice, isUnpaidInvoice, invoiceMetadata } = props;
  const { theme } = useContext(AppContext);
  const [isSampleTrackerOpen, setIsSampleTrackerOpen] = useState<boolean>(false);

  const { textColor, bgColor, text, fullText } = getTransactionStatusWiseColorTextMapping("", theme, isSkydoInvoice);
  const router = useRouter();
  const onViewSampleTracker = () => {
    setIsSampleTrackerOpen(true);
  };

  const paymentStatusText = isSkydoInvoice ? fullText : Locale.nonSkydoProcessorInvStatus;
  return (
    <div>
      <div className={classNames("bg-white pt-6 ml-4 flex-1 rounded-10px")}>
        <div className={"pb-6"}>
          <Typography
            text={Locale.paymentsTitle}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.LARGE}
            textClasses={"px-6"}
          />
        </div>
        <div className={"px-6 pb-6"}>
          <div className={classNames("px-6 py-4 rounded-10px", {})} style={{ background: bgColor }}>
            <div className={"flex flex-col 1.5xl:flex_row_item_center"}>
              <Typography text={Locale.statusFields} textClasses={"mr-1"} />
              <div className={"flex_row_item_center"}>
                <Typography
                  text={paymentStatusText}
                  textProps={{
                    color: textColor,
                  }}
                  fontWeight="700"
                  textClasses={"mr-1 flex"}
                ></Typography>
              </div>
            </div>
          </div>
          {!isSkydoInvoice ? (
            <div className={"grid grid-cols-3 gap-y-6 gap-x-4 mt-6"}>
              <InfoBox
                header={Locale.paymentDate}
                value={
                  invoiceMetadata && invoiceMetadata.paymentDate ? String(formatDate(invoiceMetadata.paymentDate)) : "-"
                }
              />
            </div>
          ) : null}
          {isUnpaidInvoice ? <MessageBox message={Locale.preKycInvoiceInfo} /> : null}
          {isArchived(invoiceStatus) ? <MessageBox head={Locale.reason} message={reasonToArchive as string} /> : null}
          {/*Message for payment settled outside skydo*/}
          {/*{!isSkydoInvoice ? (*/}
          {/*  <MessageBox head={Locale.nonSkydoProcessorHead} message={Locale.nonSkydoProcessorMessage} />*/}
          {/*) : null}*/}
        </div>
      </div>
      <div className={"mt-4 ml-4 widget flex flex-row gap-6 justify-between"}>
        <div>
          <Typography text={Locale.useSkydotoReceive} size={TYPOGRAPHY_SIZES.LARGE} type={TYPOGRAPHY_TYPES.LABEL} />
          <div className={"my-6 gap-2 flex flex-col"}>
            <DoneFieldsWithFullTick text={Locale.payments1} typoGraphySize={TYPOGRAPHY_SIZES.MEDIUM} />
            <DoneFieldsWithFullTick text={Locale.payments2} typoGraphySize={TYPOGRAPHY_SIZES.MEDIUM} />
            <DoneFieldsWithFullTick text={Locale.payments3} typoGraphySize={TYPOGRAPHY_SIZES.MEDIUM} />
            <DoneFieldsWithFullTick
              text={Locale.payments41}
              typoGraphySize={TYPOGRAPHY_SIZES.MEDIUM}
              typographyChildren={(() => {
                return (
                  <Typography
                    text={Locale.viewSampleTracker}
                    textClasses={"!text-blue-400 cursor-pointer ml-1"}
                    onTextClick={onViewSampleTracker}
                  />
                );
              })()}
            />
          </div>
          <Button
            title={Locale.completeKyc}
            onButtonClick={() => redirectClientToOnboarding(router)}
            size={BUTTON_SIZES.SMALL}
          />
        </div>
        <RecievePaymentsIconInvoice />
      </div>
      <SampleTracker isOpen={isSampleTrackerOpen} closePopup={() => setIsSampleTrackerOpen(false)} />
    </div>
  );
};

export default PreKycInvoiceRightSection;
