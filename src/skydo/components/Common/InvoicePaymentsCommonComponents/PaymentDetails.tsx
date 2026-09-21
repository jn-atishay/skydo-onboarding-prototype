import React, { useContext, useEffect, useRef, useState } from "react";
import Typography from "../../AtomicComponents/Typography";
import Locale from "../../../util/locale/en";
import DownloadIcon from "../../Icons/DownloadIcon";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../../constants/atomicConstants";
import { formatDate, formatIncomingCurrencyWithNumber, formatINRNumber } from "../../../util/formatters";
import LongRightArrow from "../../Icons/LongRightArrow";
import Button from "../../AtomicComponents/Button";
import { MarkAsPaidIcon } from "../../InvoiceDetails/MarkAsPaidPopup";
import { ApiResponseWrapper, CashbackRecord, EmailTemplate, FileDetails, Invoice } from "../../../types";
import { Events } from "../../../analytics/EventConstants";
import useToastMessages from "../../../store/toastMessages";
import useAnalytics from "../../../analytics/useAnalytics";
import classnames from "classnames";
import InfoBox from "../InfoBox";
import { InvoiceDetailsActionMenu } from "../../InvoiceDetails/InvoiceDetailsActionMenu";
import useOutsideClickFinder from "../../../hooks/useOutsideClickFinder";
import ThreeDotsInvoiceDetailsIcon from "../../InvoiceDetails/ThreeDotsInvoiceDetailsIcon";
import downloadFile from "../../../util/downloadFile";
import BE_ROUTES from "../../../util/beRoutes";
import BellIcon from "../../Icons/BellIcon";
import EmailHistoryTrackerPopup from "../../PaymentsReminder/ReminderHistoryPopup";
import beCall from "../../../util/beCall";
import { ALLOWED_METHODS } from "../../../constants/apiConstants";
import { EmailHistory, HistoricalReminder } from "../../PaymentsReminder/EmailHistoryTable";
import { dateFormattingOptionsWithoutTimeZone } from "../../InvoiceDetails/TransactionTracker";
import { useRouter } from "next/router";
import {
  DocTypes,
  EntityTypes,
  FILE_DOWNLOAD_NO_DOCUMENT_CODE,
  INVOICE_STATUS,
} from "../../../constants/dashboardConstants";
import { getFileDownloadUrl } from "../../../util/functions";
import ReminderPopupEntry from "../../PaymentsReminder/ReminderPopupEntry";
import InvoiceOrReminderEmailParentPopUp from "../../InvoiceOrRemindEmailPopUp/InvoiceOrReminderEmailParentPopUp";
import { SKYDO_INVOICE_IDENTIFIER } from "../../BulkDownload/constants";
import CopyIcon from "../../Icons/CopyIcon";
import AppContext from "../../../context/AppContext";
import useInvoicingStore from "../../../store/useInvoicingStore";
import useFiraNpsStore from "../../../store/useFiraNpsStore";
import Link from "next/link";
import FE_ROUTES from "../../../util/feRoutes";
import EditIcon from "../../Icons/EditIcon";

interface Props {
  invoiceData?: Invoice;
  titleHeading: string;
  importerName: string;
  importerId?: number;
  sourceAmountTitle: string;
  sourceAmount: number;
  sourceCurrency: string;
  inrAmount?: number;
  inrAmountTitle: string;
  fira?: FileDetails;
  cashbackRecord?: CashbackRecord;
  showMarkAsPaidBtn?: boolean;
  onMarkAsPaidClick?: () => void;
  showMarkAsPaidPartialBtn?: boolean;
  onMarkAsPaidPartialClick?: () => void;
  prn?: string;
  settlementDate?: number;
  containerClass?: string;
  showDeleteInvoiceBtn?: boolean;
  showPaymentReminderBtn?: boolean;
  showDuplicateInvoiceBtn?: boolean;
  showEditInvoiceBtn?: boolean;
  showDownloadInvoiceBtn?: boolean;
  setIsDeleteInvoicePopupOpen?: () => void;
  onDeleteInvoiceClick?: () => void;
  isFiraAvailable?: boolean;
  invoiceId?: number;
  isPartiallyPaidInvoice?: boolean;
  renderPartialPaidInvoiceDetails?: () => JSX.Element;
  isReceiptAvailable?: boolean;
  paymentReceipt?: FileDetails;
  isCreditNoteAvailable: boolean;
  paymentId?: number;
  statusComponent?: () => JSX.Element;
  isEInvoice?: boolean;
  isTest?: boolean;
  onCancelRecurringInvoiceClick?: () => void;
  invoiceStatus?: string;
}

const PAYMENT_REMINDER_URL_QUERY = "reminder";

const deletePopupQuery = (query: { [key: string]: any }) => {
  delete query[PAYMENT_REMINDER_URL_QUERY];
};

const PaymentDetails = (props: Props) => {
  const {
    containerClass,
    titleHeading,
    importerName,
    importerId,
    sourceAmountTitle,
    sourceAmount,
    sourceCurrency,
    inrAmountTitle,
    inrAmount,
    cashbackRecord,
    showMarkAsPaidBtn,
    showMarkAsPaidPartialBtn,
    onMarkAsPaidPartialClick,
    showPaymentReminderBtn,
    showDuplicateInvoiceBtn,
    showEditInvoiceBtn,
    showDownloadInvoiceBtn,
    onMarkAsPaidClick,
    prn,
    settlementDate,
    showDeleteInvoiceBtn,
    onDeleteInvoiceClick,
    isFiraAvailable,
    invoiceId,
    isPartiallyPaidInvoice,
    renderPartialPaidInvoiceDetails,
    isReceiptAvailable,
    paymentReceipt,
    isCreditNoteAvailable,
    paymentId,
    statusComponent,
    isTest,
    onCancelRecurringInvoiceClick,
    invoiceStatus,
  } = props;
  const [isFiraLoading, setFiraLoading] = useState(false);
  const [isReceiptLoading, setReceiptLoading] = useState(false);
  const [isInvoiceDownloading, setInvoiceDownloading] = useState(false);
  const [isCreditNoteLoading, setCreditNoteLoading] = useState(false);
  const [isInvoiceReminderVisible, setIsInvoiceReminderVisible] = useState(false);

  const [threeDotMenuVisible, setThreeDotMenuVisible] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const { addToast } = useToastMessages();
  const analytics = useAnalytics();
  const { theme } = useContext(AppContext);

  const isDownloadCTA = !!isFiraAvailable || !!isReceiptAvailable || !!isCreditNoteAvailable;

  const router = useRouter();

  const isPaymentReminderEligible = showPaymentReminderBtn;

  const { createDuplicateInvoice, editInvoice } = useInvoicingStore();

  const { setFiraNpsPopVisibility, setFiraNpsPopUpFileName } = useFiraNpsStore();

  const setIsInvoiceReminderVisibleWrapper = (isVisible: boolean) => {
    if (!isVisible) {
      const routerQuery = { ...router.query };
      deletePopupQuery(routerQuery);
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...routerQuery,
          },
        },
        undefined,
        { shallow: true }
      );
    }
    setIsInvoiceReminderVisible(isVisible);
  };

  useEffect(() => {
    if (router.query[PAYMENT_REMINDER_URL_QUERY] === "true" && isPaymentReminderEligible) {
      setIsInvoiceReminderVisibleWrapper(true);
    } else {
      setIsInvoiceReminderVisibleWrapper(false);
    }
  }, [router.query[PAYMENT_REMINDER_URL_QUERY]]);

  const onDownloadError = () => {
    setFiraLoading(false);
    addToast({
      id: "downl_error",
      body: Locale.wentWrongMessage,
      type: TOAST_TYPES.ERROR,
    });
    analytics?.trackAsync("invoice_details_fira_download_error");
  };

  const onDownloadSuccess = (fileName: string) => {
    setFiraNpsPopUpFileName(fileName);
    setFiraNpsPopVisibility(true, analytics);
    setFiraLoading(false);
    analytics?.trackAsync("invoice_details_fira_download_success");
  };

  const onFiraDownloadClick = () => {
    const entityType = isTest ? EntityTypes.TEST_INVOICE : EntityTypes.INVOICE;
    setFiraLoading(true);
    downloadFile({
      url: getFileDownloadUrl({ docType: DocTypes.FIRA, entityType: entityType, entityId: invoiceId }),
      onDownloadError: onDownloadError,
      onDownloadComplete: onDownloadSuccess,
    });
  };

  const onInvoiceDownloadError = (error?: { data?: number | string | null }) => {
    setInvoiceDownloading(false);
    const hasNoDocument = error?.data === FILE_DOWNLOAD_NO_DOCUMENT_CODE;
    addToast({
      id: "download_invoice",
      body: hasNoDocument ? Locale.invoiceHasNoDocument : Locale.downloadFailed,
      type: hasNoDocument ? TOAST_TYPES.INFO : TOAST_TYPES.ERROR,
    });
  };

  const onInvoiceDownloadClick = () => {
    if (isInvoiceDownloading) {
      return;
    }
    setInvoiceDownloading(true);
    const entityType = isTest ? EntityTypes.TEST_INVOICE : EntityTypes.INVOICE;
    void downloadFile({
      url: getFileDownloadUrl({ docType: DocTypes.INVOICE, entityType: entityType, entityId: invoiceId }),
      onDownloadError: onInvoiceDownloadError,
      onDownloadComplete: () => setInvoiceDownloading(false),
    });
  };

  const onDuplicateInvoiceClick = async () => {
    analytics?.trackAsync("skydo_invoice_duplication_request", { source: "invoice_details_page" });
    if (!isInvoiceMadeViaSkydo) {
      addToast({
        id: "invoice_duplicate_error",
        body: Locale.invoiceDuplicateError,
        type: TOAST_TYPES.ERROR,
      });
      analytics?.trackAsync("non_skydo_invoice_duplication_request");
      return;
    }
    createDuplicateInvoice(invoiceId, undefined, analytics);
  };

  const onEditInvoiceClick = async () => {
    analytics?.trackAsync("skydo_invoice_edit_request", { source: "invoice_details_page" });
    if (!isInvoiceMadeViaSkydo) {
      addToast({
        id: "invoice_edit_error",
        body: Locale.invoiceEditError,
        type: TOAST_TYPES.ERROR,
      });
      analytics?.trackAsync("non_skydo_invoice_edit_request");
      return;
    }
    editInvoice(invoiceId, undefined, analytics, props.invoiceData?.exporterSystemInvoiceId, !!props.invoiceData?.paymentLink);
  };

  const onRDownloadError = () => {
    setReceiptLoading(false);
    addToast({
      id: "downl_error",
      body: Locale.wentWrongMessage,
      type: TOAST_TYPES.ERROR,
    });
    analytics?.trackAsync("invoice_details_skydo_receipt_error");
  };

  const onCreditNoteDownloadError = () => {
    setCreditNoteLoading(false);
    addToast({
      id: "downl_error",
      body: Locale.wentWrongMessage,
      type: TOAST_TYPES.ERROR,
    });
    analytics?.trackAsync("invoice_details_skydo_credit_note_error");
  };

  const onRDownloadSuccess = () => {
    setReceiptLoading(false);
    analytics?.trackAsync("invoice_details_skydo_receipt_success");
  };

  const onCreditNoteDownloadSuccess = () => {
    setCreditNoteLoading(false);
    analytics?.trackAsync("invoice_details_skydo_credit_note_success");
  };

  const onReceiptDownloadClick = () => {
    setReceiptLoading(true);
    let entityType = EntityTypes.PAYMENT;
    let entityId = paymentId;
    if (invoiceId) {
      entityType = isTest ? EntityTypes.TEST_INVOICE : EntityTypes.INVOICE;
      entityId = invoiceId;
    }
    void downloadFile({
      url: getFileDownloadUrl({ docType: DocTypes.PAYMENT_RECEIPT, entityType: entityType, entityId: entityId }),
      onDownloadError: onRDownloadError,
      onDownloadComplete: onRDownloadSuccess,
    });
  };

  const onCreditNoteDownloadClick = () => {
    setCreditNoteLoading(true);
    let entityType = EntityTypes.PAYMENT;
    let entityId = paymentId;
    if (invoiceId) {
      entityType = isTest ? EntityTypes.TEST_INVOICE : EntityTypes.INVOICE;
      entityId = invoiceId;
    }
    void downloadFile({
      url: getFileDownloadUrl({ docType: DocTypes.CASHBACK_RECORD, entityType: entityType, entityId: entityId }),
      onDownloadError: onCreditNoteDownloadError,
      onDownloadComplete: onCreditNoteDownloadSuccess,
    });
  };

  const formattedSettlementDate = settlementDate ? formatDate(settlementDate) : Locale.toBeSettled;
  const onThreeDotsIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setThreeDotMenuVisible(true);
  };

  const onBodyClick = (event: React.MouseEvent) => {
    setThreeDotMenuVisible(false);
  };

  useOutsideClickFinder(actionMenuRef, onBodyClick);

  const [isReminderHistoryVisible, setIsReminderHistoryVisible] = useState(false);
  const [reminderHistory, setReminderHistory] = useState<EmailHistory[]>([]);
  const [reminderHistorySubText, setReminderHistorySubtext] = useState("");

  const isInvoiceMadeViaSkydo = SKYDO_INVOICE_IDENTIFIER.includes(props?.invoiceData?.invoiceMetadata?.source || "");
  const noInvoiceEmailOrRemindersSent = !props?.invoiceData?.didSendInvoiceOrReminderEmail;
  const showInvoiceEmailAndReminderOption = noInvoiceEmailOrRemindersSent && isInvoiceMadeViaSkydo;

  const fetchRemindersHistory = async () => {
    if (isTest) return;
    if (props.invoiceData?.id) {
      const response = (await beCall({
        path: BE_ROUTES.REMINDERS_HISTORY.replace(":invoiceId", props.invoiceData.id.toString()),
        method: ALLOWED_METHODS.GET,
      })) as ApiResponseWrapper<HistoricalReminder[]>;
      const historicalReminders = response?.data;
      if (historicalReminders?.length > 0) {
        const lastEmailSentDetails = historicalReminders[0];
        const lastEmailType = lastEmailSentDetails.emailTemplate;
        const lastEmailSentDate = lastEmailSentDetails.sentOn;

        const reminderHistoryToSave = historicalReminders?.map((reminder) => {
          return {
            emailTemplateValue:
              reminder.emailTemplate == EmailTemplate.INVOICE_EMAIL ? Locale.invoice : Locale.reminder,
            sentOn: formatDate(reminder.sentOn, dateFormattingOptionsWithoutTimeZone),
            delivered: reminder.deliveredEmails,
            opened: reminder.openedEmails,
          };
        });

        setReminderHistory(reminderHistoryToSave);
        setReminderHistorySubtext(
          lastEmailType == EmailTemplate.INVOICE_EMAIL
            ? Locale.lastInvoiceSentOn.replace(":date", formatDate(lastEmailSentDate))
            : Locale.lastReminderSentOn.replace(":date", formatDate(lastEmailSentDate))
        );
      } else {
        setReminderHistorySubtext(isInvoiceMadeViaSkydo ? Locale.invoiceNotSentYet : Locale.reminderNotSentYet);
      }
    }
  };

  useEffect(() => {
    void fetchRemindersHistory();
  }, [props.invoiceData?.id]);

  const renderActionBar = () => {
    const downloadBtnCount = Number(isFiraAvailable) + Number(isReceiptAvailable) + Number(isCreditNoteAvailable);

    const isDownloadInvoiceAvailable = !!showDownloadInvoiceBtn && !!invoiceId;

    const collapseAllDownloads = invoiceStatus === INVOICE_STATUS.PARTIALLY_PAID;

    const showDownloadIconsIn3DotsMenu =
      (downloadBtnCount >= 2 && (isPaymentReminderEligible || showDuplicateInvoiceBtn)) ||
      isDownloadInvoiceAvailable ||
      (collapseAllDownloads && downloadBtnCount > 0);

    const anyActionIsVisible =
      isPaymentReminderEligible ||
      showMarkAsPaidBtn ||
      showMarkAsPaidPartialBtn ||
      (showDeleteInvoiceBtn && (showDuplicateInvoiceBtn || showEditInvoiceBtn)) ||
      isDownloadCTA ||
      isDownloadInvoiceAvailable ||
      ((invoiceStatus === INVOICE_STATUS.IN_PROGRESS || invoiceStatus === INVOICE_STATUS.PAID) &&
        (showDuplicateInvoiceBtn || showEditInvoiceBtn));
    if (!anyActionIsVisible) return <></>;

    return (
      <div className={"flex mt-10"}>
        {/*this section will only come if invoice is outstanding*/}

        {isPaymentReminderEligible && (
          <Button
            title={showInvoiceEmailAndReminderOption ? Locale.invoiceOrReminderEmail : Locale.sendReminderToClient}
            size={BUTTON_SIZES.SMALL}
            type={BUTTON_TYPES.PRIMARY}
            onButtonClick={() => {
              setIsInvoiceReminderVisibleWrapper(true);
              analytics.trackAsync("email_remind_cta_clicked");
            }}
            rightIcon={() => <BellIcon strokeColor={"white"} />}
            buttonClass={"mr-3"}
          />
        )}
        {showMarkAsPaidBtn ? (
          <Button
            title={Locale.markAsPaidCta}
            size={BUTTON_SIZES.SMALL}
            type={BUTTON_TYPES.SECONDARY}
            onButtonClick={onMarkAsPaidClick}
            rightIcon={MarkAsPaidIcon}
            buttonClass={"mr-3"}
          />
        ) : showMarkAsPaidPartialBtn && (
          <Button
            title={Locale.markAsPaidPartialCta}
            size={BUTTON_SIZES.SMALL}
            type={BUTTON_TYPES.SECONDARY}
            onButtonClick={onMarkAsPaidPartialClick}
            rightIcon={MarkAsPaidIcon}
            buttonClass={"mr-3"}
          />
        )}
        {showDeleteInvoiceBtn && (showDuplicateInvoiceBtn || showEditInvoiceBtn) && (
          <div
            onClick={(event: React.MouseEvent<HTMLElement>) => onThreeDotsIconClick(event)}
            className={"cursor-pointer"}
            ref={actionMenuRef}
          >
            <ThreeDotsInvoiceDetailsIcon />
            <div className={"relative"}>
              <InvoiceDetailsActionMenu
                isVisible={threeDotMenuVisible}
                setActionMenuVisible={setThreeDotMenuVisible}
                onDeleteInvoiceClick={onDeleteInvoiceClick}
                isEInvoice={props.isEInvoice}
                onCancelRecurringInvoiceClick={
                  props.invoiceData?.recurringInvoiceConfigId ? onCancelRecurringInvoiceClick : undefined
                }
                showDeleteInvoiceBtn={showDeleteInvoiceBtn}
                showDuplicateInvoiceBtn={showDuplicateInvoiceBtn}
                onDuplicateInvoiceClick={onDuplicateInvoiceClick}
                showEditInvoiceBtn={showEditInvoiceBtn}
                onEditInvoiceClick={onEditInvoiceClick}
                {...(isDownloadInvoiceAvailable ? { onDownloadInvoiceClick: onInvoiceDownloadClick } : {})}
              />
            </div>
          </div>
        )}
        {/* --------------- outstanding  -------- */}

        {isDownloadCTA ? (
          <div className={"flex_row_item_center gap-x-3"}>
            {isFiraAvailable && !collapseAllDownloads && (
              <Button
                type={isPaymentReminderEligible ? BUTTON_TYPES.SECONDARY : BUTTON_TYPES.PRIMARY}
                title={Locale.downloadFira}
                size={BUTTON_SIZES.SMALL}
                onButtonClick={onFiraDownloadClick}
                isLoading={isFiraLoading}
              />
            )}
            {isReceiptAvailable && !isPaymentReminderEligible && !collapseAllDownloads && (
              <Button
                type={!prn ? BUTTON_TYPES.SECONDARY : BUTTON_TYPES.PRIMARY}
                title={Locale.skydoReceipt}
                size={BUTTON_SIZES.SMALL}
                onButtonClick={onReceiptDownloadClick}
                isLoading={isReceiptLoading}
              />
            )}
            {isCreditNoteAvailable && !isPaymentReminderEligible && !collapseAllDownloads && (
              <Button
                title={Locale.refundCreditNote}
                size={BUTTON_SIZES.SMALL}
                type={BUTTON_TYPES.SECONDARY}
                onButtonClick={onCreditNoteDownloadClick}
                isLoading={isCreditNoteLoading}
              />
            )}
            {showDownloadIconsIn3DotsMenu && (
              <div
                onClick={(event: React.MouseEvent<HTMLElement>) => onThreeDotsIconClick(event)}
                className={"cursor-pointer"}
                ref={actionMenuRef}
              >
                <ThreeDotsInvoiceDetailsIcon />
                <div className={"relative"}>
                  <InvoiceDetailsActionMenu
                    isVisible={threeDotMenuVisible}
                    setActionMenuVisible={setThreeDotMenuVisible}
                    isEInvoice={props.isEInvoice}
                    onCancelRecurringInvoiceClick={
                      props.invoiceData?.recurringInvoiceConfigId ? onCancelRecurringInvoiceClick : undefined
                    }
                    {...(isFiraAvailable && collapseAllDownloads
                      ? {
                          onDownloadFiraClick: onFiraDownloadClick,
                        }
                      : {})}
                    {...(isReceiptAvailable && (isPaymentReminderEligible || collapseAllDownloads)
                      ? {
                          onDownloadSkydoReceiptClick: onReceiptDownloadClick,
                        }
                      : {})}
                    {...(isCreditNoteAvailable && (isPaymentReminderEligible || collapseAllDownloads)
                      ? {
                          onDownloadRefundCreditNoteClick: onCreditNoteDownloadClick,
                        }
                      : {})}
                    {...(isDownloadInvoiceAvailable ? { onDownloadInvoiceClick: onInvoiceDownloadClick } : {})}
                    onDuplicateInvoiceClick={onDuplicateInvoiceClick}
                    showDuplicateInvoiceBtn={showDuplicateInvoiceBtn}
                    onEditInvoiceClick={onEditInvoiceClick}
                    showEditInvoiceBtn={showEditInvoiceBtn}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (invoiceStatus === INVOICE_STATUS.IN_PROGRESS || invoiceStatus === INVOICE_STATUS.PAID) &&
          (showDuplicateInvoiceBtn || showEditInvoiceBtn || isDownloadInvoiceAvailable) ? (
          <div className={"flex_row_item_center gap-x-3"}>
            {isDownloadInvoiceAvailable && (
              <Button
                title={Locale.downloadInvoice}
                size={BUTTON_SIZES.SMALL}
                type={BUTTON_TYPES.SECONDARY}
                onButtonClick={onInvoiceDownloadClick}
                isLoading={isInvoiceDownloading}
                rightIcon={() => {
                  return <DownloadIcon width={16} height={16} stroke={theme.hexColors.black[700]} />;
                }}
              />
            )}
            {showDuplicateInvoiceBtn && <Button
              title={Locale.duplicateInvoice}
              size={BUTTON_SIZES.SMALL}
              type={BUTTON_TYPES.SECONDARY}
              onButtonClick={onDuplicateInvoiceClick}
              rightIcon={() => {
                return <CopyIcon width={16} height={16} stroke={theme.hexColors.black[700]} strokeWidth={"1"} />;
              }}
            />}
            {showEditInvoiceBtn && <Button
              title={Locale.editInvoice}
              size={BUTTON_SIZES.SMALL}
              type={BUTTON_TYPES.SECONDARY}
              onButtonClick={onEditInvoiceClick}
              rightIcon={() => {
                return <EditIcon width={16} height={16} stroke={theme.hexColors.black[700]} strokeWidth={1.5} />;
              }}
            />}
          </div>
        ) : null}
      </div>
    );
  };

  const renderInvoiceAmount = (className?: string) => {
    return (
      <div className={classnames("flex flex-1 flex-col", className)}>
        <Typography
          text={sourceAmountTitle}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 mb-0.5"}
        />
        <Typography
          text={formatIncomingCurrencyWithNumber({
            value: sourceAmount,
            currency: sourceCurrency,
            minFractionDigits: 2,
          })}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
        />
      </div>
    );
  };

  return (
    <div className={classnames("bg-white rounded-10px p-6 flex flex-col", containerClass)}>
      {isTest ? (
        <div className={"mb-1"}>
          <Typography
            text={Locale.trialPayment}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_X_SMALL}
            textClasses={"!text-black-700 rounded px-1 py-0.5 bg-yellow-400"}
          />
        </div>
      ) : null}
      <div className={"flex flex-row justify-between"}>
        <Typography
          text={titleHeading}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 mb-0.5"}
        />
        {statusComponent && statusComponent()}
      </div>
      {importerId ? (
        <Link href={FE_ROUTES.CLIENTS_DETAIL_PAGE.replace("[importer_id]", importerId.toString())}>
          <a className={"mb-10 w-fit"}>
            <Typography text={importerName} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />
          </a>
        </Link>
      ) : (
        <Typography
          text={importerName}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"mb-10 w-fit"}
        />
      )}
      {isPartiallyPaidInvoice ? renderInvoiceAmount("mb-4") : null}
      <>
        {isPartiallyPaidInvoice ? (
          renderPartialPaidInvoiceDetails && renderPartialPaidInvoiceDetails()
        ) : (
          <>
            <div className={"flex_row_item_center"}>
              {renderInvoiceAmount()}
              {inrAmount ? <LongRightArrow containerClass={"mt-5"} /> : null}
              {inrAmount ? (
                <div className={"flex flex-1 flex-col items-end"}>
                  <Typography
                    text={inrAmountTitle}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500 mb-0.5"}
                  />
                  <Typography
                    text={formatINRNumber({
                      value: inrAmount,
                      maximumFractionDigits: 2,
                      formatOptions: { minimumFractionDigits: 2 },
                    })}
                    type={TYPOGRAPHY_TYPES.HEADING}
                    size={TYPOGRAPHY_SIZES.SMALL}
                  />
                </div>
              ) : null}
            </div>
            {inrAmount ? (
              <div className={"flex justify-end"}>
                <Typography
                  text={Locale.postFee}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-500 mt-0.5"}
                />
              </div>
            ) : null}
          </>
        )}
      </>
      {prn ? (
        <div
          className={classnames("grid grid-cols-3 gap-x-4 py-6 border-t border-black-400 mt-10", {
            "border-b": isDownloadCTA || showMarkAsPaidBtn,
          })}
        >
          <InfoBox header={Locale.prn} value={prn} />
          <InfoBox header={Locale.settlementDate} value={formattedSettlementDate} />
        </div>
      ) : null}

      {renderActionBar()}

      {/* Below action bar */}
      {isPaymentReminderEligible && (
        <div className={"flex flex-row mt-[10px]"}>
          <Typography
            text={reminderHistorySubText}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!mr-1 !text-black-500"}
          />
          <Typography
            text={Locale.trackEmailStatus}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-blue-400 cursor-pointer"}
            onTextClick={() => {
              setIsReminderHistoryVisible(true);
              analytics.trackAsync(Events.TRACK_EMAIL_CTA_CLICK);
            }}
          />
        </div>
      )}

      {/* Popups entry */}
      {props.invoiceData &&
        !isTest &&
        isInvoiceReminderVisible &&
        (showInvoiceEmailAndReminderOption ? (
          <InvoiceOrReminderEmailParentPopUp
            invoiceData={props.invoiceData}
            closePopUp={() => setIsInvoiceReminderVisibleWrapper(false)}
            fetchRemindersHistory={fetchRemindersHistory}
          />
        ) : (
          <ReminderPopupEntry
            isVisible={isInvoiceReminderVisible}
            onClose={() => setIsInvoiceReminderVisibleWrapper(false)}
            importerName={props.importerName}
            exporterSystemInvoiceId={props.invoiceData?.exporterSystemInvoiceId ?? ""}
            invoiceData={props.invoiceData}
            fetchRemindersHistory={fetchRemindersHistory}
          />
        ))}
      <EmailHistoryTrackerPopup
        fetchDataCb={fetchRemindersHistory}
        isVisible={isReminderHistoryVisible}
        onClose={() => {
          setIsReminderHistoryVisible(false);
        }}
        title={Locale.emailStatus}
        history={reminderHistory}
        isInvoiceEmailHistoryPopUp={true}
        sentInvoiceEmailButtonClick={() => {
          setIsReminderHistoryVisible(false);
          setIsInvoiceReminderVisibleWrapper(true);
        }}
        showInvoiceEmailAndReminderOption={showInvoiceEmailAndReminderOption}
      />
      {/*<AllowedSkydoInvoicePopup isVisible={isInvoiceMadeViaSkydo && noInvoiceEmailOrRemindersSent} />*/}
    </div>
  );
};

export default PaymentDetails;
