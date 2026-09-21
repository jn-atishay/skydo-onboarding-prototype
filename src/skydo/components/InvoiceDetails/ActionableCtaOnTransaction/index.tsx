//May 2024

import InfoIcon from "../../AtomicComponents/ToastMessages/InfoIcon";
import { VKYCStatus } from "../../../types/vkyc";
import Typography from "../../AtomicComponents/Typography";
import Locale from "../../../util/locale/en";
import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import Button from "../../AtomicComponents/Button";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../../context/AppContext";
import useVideoKycStore from "../../../store/useVideoKycStore";
import { Importer, SenderAlertDetails } from "../../../types";
import { Events } from "../../../analytics/EventConstants";
import FilePreview from "../../Common/FilePreview";
import { useRouter } from "next/router";
import useAnalytics from "../../../analytics/useAnalytics";
import SenderCaseAlertPopUp from "../../SenderCaseAlertPopUp/SenderCaseAlertPopUp";
import { formatDate, formatIncomingCurrency } from "../../../util/formatters";
import { dateFormattingOptions } from "../TransactionTracker";
import useExporterAndExporterUserStore from "../../../store/useExporterAndExporterUserStore";
import { McaDocStatus } from "../../../types/Exporter/ExporterUser";
import FE_ROUTES from "../../../util/feRoutes";
import WarningInfoIcon from "../../Icons/WarningInfoIcon";
import ExclamationIcon from "../../Icons/ExclamationIcon";
import { PURPOSE_CODE_ICON_COLORS } from "../../../constants/purposeCodeConstants";
import { getActionableCtaBlockVisibility } from "../../../util/actionableCtaOnTransactionVisibility";
import useMobileVersionHook from "../../Common/useMobileVersionHook";

interface Props {
  /** Omitted when `balanceSummarySenderRowOnly` — PC/VKYC/MCA are rendered in a sibling block. */
  vkycNeeded?: boolean;
  isPCRequired?: boolean;
  onAddPCClick?: () => void;
  senderAlertDetails?: SenderAlertDetails;
  senderCaseAlertDocUrls?: string[];
  senderCaseAlertPending?: boolean;
  transactionAmount?: number;
  transactionCurrency?: string;
  /** When the inbound amount hit the VA (audit `VIRTUAL_ACCOUNT_SUCCESS` time); shown as “received on” in sender-case popup */
  transactionReceivedOnTimestamp?: string | null;
  importer: Importer;
  /** Omitted when `balanceSummarySenderRowOnly`. */
  isSkydoInvoice?: boolean;
  invoiceAmount?: number;
  invoiceAmountMapped?: number;
  showUserActionables?: boolean;
  /** When true (e.g. above balance summary), top corners match bottom — not flush with a card above */
  standaloneRounded?: boolean;
  /** Balance summary MFV row: render only sender alert (PC/VKYC/MCA handled elsewhere). */
  balanceSummarySenderRowOnly?: boolean;
}

const ActionableCtaOnTransaction = (props: Props) => {
  const {
    vkycNeeded: vkycNeededProp,
    isPCRequired: isPCRequiredProp,
    onAddPCClick,
    senderAlertDetails,
    senderCaseAlertPending: senderCaseAlertPendingProp,
    senderCaseAlertDocUrls: senderCaseAlertDocUrlsProp,
    transactionAmount,
    transactionCurrency,
    transactionReceivedOnTimestamp,
    importer,
    isSkydoInvoice: isSkydoInvoiceProp,
    invoiceAmount,
    invoiceAmountMapped,
    showUserActionables = true,
    standaloneRounded = false,
    balanceSummarySenderRowOnly = false,
  } = props;

  const vkycNeeded = vkycNeededProp ?? false;
  const isPCRequired = isPCRequiredProp ?? false;
  const isSkydoInvoice = isSkydoInvoiceProp ?? false;
  const senderCaseAlertPending =
    senderCaseAlertPendingProp ?? senderAlertDetails?.alertStatus === "PENDING";
  const senderCaseAlertDocUrls = senderCaseAlertDocUrlsProp ?? senderAlertDetails?.alertDocUrls;
  const blockRounding = standaloneRounded ? "rounded-10px" : "rounded-b-10px";
  const INVOICE_ID_PARAM = "invoice_id";
  const { theme } = useContext(AppContext);
  const { isMobile } = useMobileVersionHook();
  const { verifStatus, onVideoVerifClick, isLoading } = useVideoKycStore();
  const router = useRouter();
  const [showSenderCaseAlertPopUp, setShowSenderCaseAlertPopUp] = useState(false);
  const analytics = useAnalytics();
  const { exporter = {} } = useExporterAndExporterUserStore();
  const { mcaDocStatus } = exporter;
  const blockVisibility = getActionableCtaBlockVisibility({
    vkycNeeded,
    isPCRequired,
    isSkydoInvoice,
    showUserActionables,
    mcaDocStatus,
    senderAlertDetails,
    balanceSummarySenderRowOnly,
  });
  const invoiceId = router.query[INVOICE_ID_PARAM];

  useEffect(() => {
    if (router.query.openDocUploadPopup === "true") {
      setShowSenderCaseAlertPopUp && senderCaseAlertPending && setShowSenderCaseAlertPopUp(true);
      analytics.trackAsync(Events.TM_POPUP_SHOWN, {
        action: "email",
      });
    } else {
      setShowSenderCaseAlertPopUp && setShowSenderCaseAlertPopUp(false);
    }
  }, [router.query.openDocUploadPopup]);

  const onUploadMcaDocClick = () => {
    void router.push(
      FE_ROUTES.DOC_UPLOAD +
        `?redirectUrl=${FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", String(invoiceId || ""))}`
    );
  };

  const renderVkycNeededBlock = () => {
    return (
      <div className={`flex flex-row p-6 bg-yellow-200 gap-x-2 ${blockRounding}`}>
        <div className={"shrink-0"}>
          <InfoIcon stroke={theme.hexColors.black[700]} />
        </div>
        <div className={"flex flex-col gap-4"}>
          {verifStatus === VKYCStatus.PENDING ? null : (
            <Typography text={Locale.actionNeeded} type={TYPOGRAPHY_TYPES.LABEL} />
          )}
          <Typography
            text={verifStatus === VKYCStatus.PENDING ? Locale.videoVerifInReview : Locale.actionNeededSubHeaderVkyc}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
          {verifStatus === VKYCStatus.PENDING ? null : (
            <Button
              title={Locale.completeVideoVerif}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={onVideoVerifClick}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    );
  };
  const renderPCRequiredBlock = () => {
    if (isMobile) {
      return (
        <div className={`flex flex-row gap-2 rounded-5px border border-alert-200 bg-alert-50 p-3`}>
          <div className={"shrink-0"}>
            <ExclamationIcon width={18} height={18} />
          </div>
          <div className={"flex flex-col gap-1"}>
            <Typography
              text={Locale.actionRequired}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!font-bold"}
            />
            <Typography text={Locale.mobilePurposeCodeRequired} size={TYPOGRAPHY_SIZES.SMALL} />
          </div>
        </div>
      );
    }

    const isInvoiceMapped = invoiceAmountMapped && invoiceAmountMapped > 0;
    const headerText = isInvoiceMapped ? Locale.urgentPaymentOnhold : Locale.PaymentOnhold;
    const bodyText = !isInvoiceMapped ? Locale.actionNeededBodyIfInvoiceNotMapped : Locale.actionNeededBodyPC;

    return (
      <div className={`flex flex-row px-6 py-6 bg-yellow-200 ${blockRounding}`}>
        <div className={"shrink-0 pr-2"}>
          {isInvoiceMapped ? (
            <WarningInfoIcon width={20} height={20} fillColor={PURPOSE_CODE_ICON_COLORS.URGENT} />
          ) : (
            <WarningInfoIcon width={20} height={20} color={PURPOSE_CODE_ICON_COLORS.DEFAULT} />
          )}
        </div>
        <div>
          <Typography text={headerText} type={TYPOGRAPHY_TYPES.LABEL} />
          <div className={"mb-4 mt-4"}>
            <Typography text={bodyText} size={TYPOGRAPHY_SIZES.SMALL} />
          </div>
          <Button title={Locale.setDefaultPcCta} size={BUTTON_SIZES.SMALL} onButtonClick={onAddPCClick} />
        </div>
      </div>
    );
  };
  const renderSenderAlertBlock = () => {
    return (
      <div className={`flex flex-row px-6 py-4 bg-yellow-200 ${blockRounding}`}>
        <div className={"shrink-0"}>
          <InfoIcon stroke={theme.hexColors.black[700]} />
        </div>
        <div className={"ml-2"}>
          <Typography
            text={senderCaseAlertPending ? Locale.actionRequired : Locale.documentsUnderReview}
            type={TYPOGRAPHY_TYPES.LABEL}
          />
          {senderCaseAlertPending ? (
            <>
              <div className={"my-4"}>
                <Typography text={Locale.senderAlertRBI} size={TYPOGRAPHY_SIZES.SMALL} />
              </div>
              <Button
                title={Locale.uploadDocument}
                size={BUTTON_SIZES.SMALL}
                onButtonClick={() => {
                  setShowSenderCaseAlertPopUp(true);
                  analytics.trackAsync(Events.TM_UPLOAD_DOCUMENT_CLICKED);
                  analytics.trackAsync(Events.TM_POPUP_SHOWN, {
                    action: "dashboard",
                  });
                }}
              />
            </>
          ) : null}
          {!senderCaseAlertPending && (
            <div className={"flex flex-col"}>
              <Typography
                text={Locale.thanksForSubmittingTheDocument}
                size={TYPOGRAPHY_SIZES.SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses={"mt-4"}
              />
              <div className={"flex flex-row mt-4 flex-wrap"}>
                {senderCaseAlertDocUrls?.map((docUrl, id) => {
                  return (
                    <div key={id} className={"w-[100px] h-[100px] relative mr-6"}>
                      <FilePreview fileLink={docUrl} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMcaDocsRequiredBlock = () => {
    return (
      <div className={`flex flex-row p-6 bg-yellow-200 gap-x-2 ${blockRounding}`}>
        <div className={"shrink-0"}>
          <InfoIcon stroke={theme.hexColors.black[700]} />
        </div>
        <div className={"flex flex-col gap-4"}>
          <Typography
            text={mcaDocStatus === McaDocStatus.REQUIRED ? Locale.actionRequired : Locale.documentsUnderReview}
            type={TYPOGRAPHY_TYPES.LABEL}
          />
          <Typography
            text={mcaDocStatus === McaDocStatus.REQUIRED ? Locale.mcaDocCtaBody : Locale.mcaDocUnderReview}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
          {mcaDocStatus === McaDocStatus.REQUIRED ? (
            <Button
              title={Locale.freelancerDocNeededTitle}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={onUploadMcaDocClick}
              isLoading={isLoading}
            />
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      {showSenderCaseAlertPopUp && senderAlertDetails ? (
        <SenderCaseAlertPopUp
          closePopUp={() => setShowSenderCaseAlertPopUp(false)}
          senderAlertDetails={senderAlertDetails}
          amountString={String(formatIncomingCurrency(transactionAmount, transactionCurrency))}
          receivedOnString={formatDate(transactionReceivedOnTimestamp ?? "", dateFormattingOptions)}
          importerName={importer.businessName}
        />
      ) : null}
      {blockVisibility.showVkyc ? renderVkycNeededBlock() : null}
      {blockVisibility.showPc ? renderPCRequiredBlock() : null}
      {blockVisibility.showMca ? renderMcaDocsRequiredBlock() : null}
      {blockVisibility.showSender ? renderSenderAlertBlock() : null}
    </>
  );
};

export default ActionableCtaOnTransaction;
