import Locale from "../../util/locale/en";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TOOLTIP_POSITION,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import { useRouter } from "next/router";
import Typography from "../AtomicComponents/Typography";
import React, { useContext, useEffect, useState } from "react";
import { TableColumn } from "../../types/atomicComponentTypes";
import Table from "../AtomicComponents/Table";
import TextInput from "../AtomicComponents/TextInput";
import { formatIncomingCurrencyWithNumber, formatUTCDate } from "../../util/formatters";
import PaginationCTAs from "../Common/PaginationCTAs";
import CopyIcon from "../Icons/CopyIcon";
import useToastMessages from "../../store/toastMessages";
import { FE_BASE_URL } from "../../config";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import Popup from "../AtomicComponents/Popup";
import { PAYMENT_LINK_STATUS } from "./constants";
import PageHeader from "../Common/PageHeader";
import Button from "../AtomicComponents/Button";
import FE_ROUTES from "../../util/feRoutes";
import HowToCreateLinkCard from "./HowToCreateLinkCard";
import usePaymentLinkStore from "../../store/usePaymentLinkStore";
import PaymentLinkSuccessfullyGeneratedPopup from "./Popups/PaymentLinkSuccessfullyGeneratedPopup";
import PaymentLinksValueProp from "./PaymentLinksValueProp";
import PaymentLinkComparison from "./PaymentLinkComparison";
import PaymentLinksBanner from "./PaymentLinksBanner";
import AvailablePaymentMethods from "./AvailablePaymentMethods";
import InstalinkUsageAccordian from "./InstalinkUsageAccordian";
import ACHDebitPaymentMethod from "./ACHDebitPaymentMethod";
import VeemCardPaymentMethod from "./VeemCardPaymentMethod";
import FAQFooterForPaymentLinks from "./FAQFooterForPaymentLinks";
import FailedSectionPaymentLink from "./FailedSectionPaymentLink";
import Tooltip from "../AtomicComponents/Tooltip";
import ExclamationIcon from "../Icons/ExclamationIcon";
import AppContext from "../../context/AppContext";
import usePhaseReleaseEligibleStore from "../../store/usePhaseReleaseEligibleStore";
import InfoIcon from "../Icons/InfoIcon";
import { UserDetailsContext } from "../DashboardContainer";
import ThreeDotsActionIcon from "../PaymentsTable/ThreeDotsActionIcon";
import PaymentLinkActionMenu from "./PaymentLinkActionMenu";
import useOutsideClickFinder from "../../hooks/useOutsideClickFinder";
import Notes from "../AtomicComponents/Notes";
import useDashboardContainerStore from "../../store/useDashboardContainerStore";

export type FailureReasonDto = {
  text: string;
  title?: string;
};

export type PaymentLink = {
  id: string;
  invoiceAmount: string;
  invoiceNumber?: string;
  currency: string;
  createdAt: string;
  clientName: string;
  description?: string;
  status?: string;
  inProgress?: boolean;
  methodsConfig?: {
    allowedMethods?: string[];
  };
  paymentVendor?: string;
  failureReason?: FailureReasonDto;
  paymentLinkDebitSuccessful?: boolean;
  paymentLinkDebitSuccessfulDate?: string;
};

interface Props {
  listOfPaymentLinks: PaymentLink[];
}

const PaymentLinksList = (props: Props) => {
  const { listOfPaymentLinks } = props;
  const router = useRouter();
  const { theme } = useContext(AppContext);
  const { openCompletePaymentLinkPopup, completedPaymentLink, closeCompletePaymentLinkPopup, deletePaymentLink } =
    usePaymentLinkStore();
  const pageSize = 5;
  const [startIndex, setStartIndex] = React.useState<number>(0);
  const [endIndex, setEndIndex] = React.useState<number>(startIndex + pageSize);
  const { addToast } = useToastMessages();
  const [selectedPaymentLink, setSelectedPaymentLink] = useState<PaymentLink | null>(null);
  const [showPaymentLinkPopup, setShowPaymentLinkPopup] = useState<boolean>(false);
  const [menuVisibleForId, setMenuVisibleForId] = useState<string | null>(null);
  const actionMenuRef = React.useRef<HTMLDivElement>(null);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [paymentLinkToDelete, setPaymentLinkToDelete] = useState<PaymentLink | null>(null);
  const [deletionReason, setDeletionReason] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const analytics = useAnalytics();
  const { isExporterEligibleForVeemCards, checkExporterEligibilityForVeemCards } = usePhaseReleaseEligibleStore();
  const { isExporterEligibleForInstalinks, isExporterIndustryEligibleForInstalinks } = useContext(UserDetailsContext);
  const { isVeemCardsSupportedForExporter } = useDashboardContainerStore();
  const isVeemCardsDisabled = !isVeemCardsSupportedForExporter;
  useEffect(() => {
    checkExporterEligibilityForVeemCards();
  }, []);

  const onBodyClick = (event: React.MouseEvent) => {
    setMenuVisibleForId(null);
  };

  useOutsideClickFinder(actionMenuRef, onBodyClick);
  // Check if we should show banner instead of header
  const shouldShowBanner = () => {
    if (isVeemCardsDisabled) {
      return false;
    }
    if (listOfPaymentLinks.length === 0) {
      return false; // New users with no payment links should see header
    }

    if (!isExporterEligibleForVeemCards) {
      return false;
    }

    // Find the most recent creation date
    const mostRecentDate = listOfPaymentLinks.reduce((latest, link) => {
      const linkDate = new Date(link.createdAt);
      return linkDate > latest ? linkDate : latest;
    }, new Date(0));

    // Check if most recent date is before July 6, 2025
    const cutoffDate = new Date("2025-08-06");

    console.log("mostRecentDate", mostRecentDate);
    console.log("cutoffDate", cutoffDate);
    if (mostRecentDate < cutoffDate) {
      analytics.trackAsync(Events.PAYPAL.INSTALINKS_PAGE_BANNER_SHOWN);
    }
    return mostRecentDate < cutoffDate;
  };

  const onCopyPaymentLink = (paymentLink: string) => {
    navigator?.clipboard
      ?.writeText(paymentLink)
      .then(() => {
        addToast({
          type: TOAST_TYPES.SUCCESS,
          id: "success_copied",
          body: Locale.copied,
          time: 2000,
        });
      })
      .catch(() => console.log("Error copying"));
    analytics?.trackAsync(Events.PAYPAL.PAYMENT_LINK_COPIED, {
      source: "payment_link_table_row",
    });
  };

  const onThreeDotsIconClick = (rowData: PaymentLink, event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuVisibleForId(rowData.id === menuVisibleForId ? null : rowData.id);
  };

  const renderActionsMenu = (rowData: PaymentLink) => {
    return (
      <div
        onClick={(event: React.MouseEvent<HTMLElement>) => onThreeDotsIconClick(rowData, event)}
        className={"cursor-pointer"}
      >
        <ThreeDotsActionIcon key={rowData?.id} />
        <div className={"relative"}>
          <PaymentLinkActionMenu
            ref={actionMenuRef}
            isVisible={menuVisibleForId === rowData.id}
            setMenuVisibleForId={setMenuVisibleForId}
            rowData={rowData}
            onViewDetails={() => {
              analytics?.trackAsync(Events.PAYPAL.VIEW_DETAILS_PAYMENT_LINK, {
                paymentLinkId: rowData.id,
              });
              setSelectedPaymentLink(rowData);
              setShowPaymentLinkPopup(true);
            }}
            onDeleteLink={() => {
              analytics?.trackAsync(Events.PAYPAL.DELETE_PAYMENT_LINK, {
                paymentLinkId: rowData.id,
              });
              setPaymentLinkToDelete(rowData);
              setShowDeletePopup(true);
              setDeletionReason("");
            }}
          />
        </div>
      </div>
    );
  };

  const tableCTA = [renderActionsMenu];

  const renderNotCompletedPaymentLinks = (status?: keyof typeof PAYMENT_LINK_STATUS) => {
    return (
      <Typography
        text={
          status === PAYMENT_LINK_STATUS.EXPIRED
            ? Locale.expired
            : status === PAYMENT_LINK_STATUS.FAILED
            ? Locale.failed
            : Locale.outstanding
        }
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={
          status === PAYMENT_LINK_STATUS.EXPIRED
            ? "!text-black-500 px-2 py-1 rounded-[30px] bg-black-50 w-fit"
            : status === PAYMENT_LINK_STATUS.FAILED
            ? "!text-red-500 px-2 py-1 rounded-[30px] bg-red-50 w-fit"
            : "!text-orange-400 px-2 py-1 rounded-[30px] bg-orange-50 w-fit"
        }
      />
    );
  };

  const renderPaymentLinkStatus = (rowData: PaymentLink, additionalPaidClasses?: string) => {
    function renderPaymentLinkAuthenticatedTooltip() {
      function renderTooltipText() {
        return (
          <div className="flex flex-col items-start w-[324px]">
            <Typography
              text={Locale.payerHasAuthenThePayment.replace(
                ":date",
                " by " + rowData.paymentLinkDebitSuccessfulDate || ""
              )}
              size={TYPOGRAPHY_SIZES.X_X_SMALL}
              type={TYPOGRAPHY_TYPES.PARA}
              textClasses={"!text-white pb-2 text-start"}
            />
            <Typography
              text={Locale.weWillNotifyFailureOrSuccess}
              size={TYPOGRAPHY_SIZES.X_X_SMALL}
              type={TYPOGRAPHY_TYPES.PARA}
              textClasses={"!text-white text-start"}
            />
          </div>
        );
      }
      return (
        <Tooltip tooltipText={renderTooltipText()} position={TOOLTIP_POSITION.BOTTOM} tooltipTheme={"dark"}>
          <ExclamationIcon
            className={"ml-1"}
            fillcolor={theme.hexColors.white}
            width={16}
            height={16}
            type="outline"
            strokeColor={theme.hexColors.black[500]}
          />
        </Tooltip>
      );
    }

    if (rowData.status === "COMPLETED") {
      if (rowData.paymentLinkDebitSuccessful) {
        return (
          <div className={"flex flex-row items-center gap-2"}>
            <Typography
              text={Locale.paidLabel}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={`!text-green-400 px-2 py-1 rounded-[30px] bg-green-50 ${additionalPaidClasses || ""}`}
            />
            {rowData.inProgress ? (
              <Typography
                text={Locale.settlementInProgress}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_X_SMALL}
                textClasses={"!text-black-500"}
              />
            ) : null}
          </div>
        );
      } else {
        return (
          <div className={"flex flex-row items-center gap-1"}>
            <Typography
              text={Locale.authenticatedLabel}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-green-400 px-2 py-1 rounded-[30px] bg-green-50"}
            />
            {renderPaymentLinkAuthenticatedTooltip()}
          </div>
        );
      }
    } else {
      return renderNotCompletedPaymentLinks(rowData.status as keyof typeof PAYMENT_LINK_STATUS);
    }
  };

  const tableColumns: TableColumn[] = [
    {
      dataKey: "id",
      headerTitle: Locale.paymentLinkId,
      widthClass: "justify-start text-center flex-[7_7_0%]",
      formattedCellData: (rowData: PaymentLink) => {
        const paymentLinkId = rowData.id;
        return <Typography text={paymentLinkId} size={TYPOGRAPHY_SIZES.SMALL} type={TYPOGRAPHY_TYPES.PARA} />;
      },
    },
    {
      dataKey: "clientName",
      headerTitle: Locale.clientName,
      widthClass: "justify-start text-center flex-[7_7_0%]",
      formattedCellData: (rowData: PaymentLink) => {
        const clientName = rowData.clientName;
        return <Typography text={clientName} size={TYPOGRAPHY_SIZES.SMALL} type={TYPOGRAPHY_TYPES.PARA} />;
      },
    },
    {
      dataKey: "status",
      headerTitle: Locale.statusStr,
      widthClass: "justify-start flex-[7_7_0%]",
      formattedCellData: (rowData: PaymentLink) => {
        return renderPaymentLinkStatus(rowData);
      },
    },
    {
      dataKey: "invoiceNumber",
      headerTitle: Locale.invoiceNumber,
      widthClass: "justify-start text-center flex-[7_7_0%]",
      formattedCellData: (rowData: PaymentLink) => {
        const invoiceNumber = rowData.invoiceNumber || "-";
        return <Typography text={invoiceNumber} size={TYPOGRAPHY_SIZES.SMALL} type={TYPOGRAPHY_TYPES.PARA} />;
      },
    },
    {
      dataKey: "invoiceAmount",
      headerTitle: Locale.invoiceAmount,
      widthClass: "justify-start text-center flex-[7_7_0%]",
      formattedCellData: (rowData: PaymentLink) => {
        const invoiceAmount = formatIncomingCurrencyWithNumber({
          value: rowData.invoiceAmount,
          currency: rowData.currency,
          maxFractionDigits: 2,
          minFractionDigits: 2,
        });
        return <Typography text={invoiceAmount} size={TYPOGRAPHY_SIZES.SMALL} type={TYPOGRAPHY_TYPES.PARA} />;
      },
    },
    {
      dataKey: "createdDate",
      headerTitle: Locale.createDateText,
      widthClass: "justify-start text-center flex-[7_7_0%]",
      formattedCellData: (rowData: PaymentLink) => {
        const createdDate = formatUTCDate(rowData.createdAt);
        return <Typography text={createdDate} size={TYPOGRAPHY_SIZES.SMALL} type={TYPOGRAPHY_TYPES.PARA} />;
      },
    },
    {
      dataKey: "paymentLink",
      headerTitle: Locale.paymentLinkText,
      widthClass: "justify-start text-center flex-[7_7_0%] overflow-hidden",
      formattedCellData: (rowData: PaymentLink) => {
        const paymentLinkText = `${FE_BASE_URL}/pay/${rowData.id}`;
        return (
          <div className={"flex flex-row items-center overflow-hidden"}>
            <Typography
              text={paymentLinkText}
              size={TYPOGRAPHY_SIZES.SMALL}
              type={TYPOGRAPHY_TYPES.PARA}
              textClasses={"truncate"}
            />
            <CopyIcon
              className={"shrink-0 cursor-pointer"}
              onClick={(e) => {
                e.stopPropagation();
                onCopyPaymentLink(paymentLinkText);
              }}
            />
          </div>
        );
      },
    },
    {
      headerTitle: Locale.actions,
      ctas: tableCTA,
      widthClass: "min-w-[50px] max-w-[50px] !justify-center shrink-0",
    },
  ];

  const handleDeletePaymentLink = async () => {
    if (!paymentLinkToDelete) return;

    analytics?.trackAsync(Events.PAYPAL.DELETE_PAYMENT_LINK_POPUP, {
      paymentLinkId: paymentLinkToDelete.id,
      hasReason: !!deletionReason,
    });

    setIsDeleting(true);
    const result = await deletePaymentLink(paymentLinkToDelete.id, deletionReason);
    setIsDeleting(false);

    if (result.success) {
      addToast({
        type: TOAST_TYPES.SUCCESS,
        id: "payment_link_deleted",
        body: Locale.paymentLinkDeletedSuccessfully,
        time: 3000,
      });
      setShowDeletePopup(false);
      setPaymentLinkToDelete(null);
      setDeletionReason("");
    } else {
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "payment_link_delete_failed",
        body: result.message || Locale.failedToDeletePaymentLink,
        time: 3000,
      });
    }
  };

  const renderDeletePopupContent = () => {
    if (!paymentLinkToDelete) return <div />;

    return (
      <div className={"flex flex-col gap-6 mb-6"}>
        <Typography
          text={Locale.areYouSureDeletePaymentLink}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-700"}
        />
        <Typography
          text={Locale.thisInstaLinkWillBeDeletedPermanentlyYouCantUndoThisAction}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-700"}
        />
        <div className={"border-t border-black-400 w-full"} />
        <div className={"flex flex-row gap-6"}>
          <div className={"flex flex-1 flex-col gap-1"}>
            <Typography
              text={Locale.paymentLinkId}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold"}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={paymentLinkToDelete.id}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold !text-black-700"}
            />
          </div>
          <div className={"flex flex-1 flex-col gap-1"}>
            <Typography
              text={Locale.clientName}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold"}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={paymentLinkToDelete.clientName}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold !text-black-700"}
            />
          </div>
        </div>
        <div className={"flex flex-row gap-6"}>
          <div className={"flex flex-1 flex-col gap-1"}>
            <Typography
              text={Locale.invoiceAmount}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold"}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={formatIncomingCurrencyWithNumber({
                value: paymentLinkToDelete.invoiceAmount,
                currency: paymentLinkToDelete.currency,
                maxFractionDigits: 2,
                minFractionDigits: 2,
              })}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold !text-black-700"}
            />
          </div>
          <div className={"flex flex-1 flex-col gap-1"}>
            <Typography
              text={Locale.createDateText}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold"}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={formatUTCDate(paymentLinkToDelete.createdAt)}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold !text-black-700"}
            />
          </div>
        </div>
        <div className={"border-t border-black-400 w-full"} />
        <TextInput
          label={Locale.reasonForDeletionOptional}
          type={"textarea"}
          inputClass={"flex-1 w-full"}
          inputProps={{ rows: 1 }}
          value={deletionReason}
          onChange={(value) => setDeletionReason(value)}
          placeholder=""
        />
      </div>
    );
  };

  const renderCreateLinkCTA = () => {
    if (!isExporterEligibleForInstalinks) {
      return (
        <div className={"flex items-center gap-2"}>
          <ExclamationIcon />
          <Typography
            text={
              isExporterIndustryEligibleForInstalinks
                ? Locale.instalinksWillBeAvailablePostKYC
                : Locale.instalinksIsNotSupportedForYourBusiness
            }
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight={700}
          />
          {!isExporterIndustryEligibleForInstalinks && (
            <Tooltip
              tooltipText={Locale.instalinksNotSupportedForBusinessTooltipText}
              position={TOOLTIP_POSITION.BOTTOM}
              tooltipTheme={"dark"}
            >
              <InfoIcon />
            </Tooltip>
          )}
        </div>
      );
    }
    return (
      <div className={"flex_row_item_center gap-2"}>
        <Button
          title={Locale.createPaymentLinkText}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={() => {
            router.push(FE_ROUTES.CREATE_PAYMENT_LINK);
            analytics?.trackAsync(Events.PAYPAL.CREATE_PAYMENT_LINK_CTA_CLICKED);
          }}
        />
      </div>
    );
  };

  const paymentLinkPopupContent = () => {
    return (
      <div className={"flex flex-col gap-6"}>
        {selectedPaymentLink?.status === "FAILED" ? (
          <FailedSectionPaymentLink
            failureReason={selectedPaymentLink?.failureReason}
            source={"payment-link-fail-popup"}
          />
        ) : (
          <div
            className={"flex flex-row items-center justify-between px-4 py-3.5 border rounded-10px border-black-400"}
          >
            <Typography
              text={`${FE_BASE_URL}/pay/${selectedPaymentLink?.id || "-"}`}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
            />
            <CopyIcon
              width={16}
              height={16}
              className={"ml-4 shrink-0 cursor-pointer"}
              onClick={() => {
                onCopyPaymentLink(`${FE_BASE_URL}/pay/${selectedPaymentLink?.id || "-"}`);
              }}
            />
          </div>
        )}
        <div className={"flex flex-row items-center gap-6"}>
          <div className={"flex flex-1 flex-col gap-1"}>
            <Typography
              text={Locale.clientName}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold"}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={selectedPaymentLink?.clientName || "-"}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"semibold"}
            />
          </div>
          <div className={"flex flex-1 flex-col gap-1"}>
            <Typography
              text={Locale.invoiceAmount}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold"}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={formatIncomingCurrencyWithNumber({
                value: selectedPaymentLink?.invoiceAmount,
                currency: selectedPaymentLink?.currency,
                maxFractionDigits: 2,
                minFractionDigits: 2,
              })}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"semibold"}
            />
          </div>
        </div>
        <div className={"flex flex-row items-center gap-6"}>
          <div className={"flex flex-1 flex-col gap-1"}>
            <Typography
              text={Locale.statusStr}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold"}
              textClasses={"!text-black-500"}
            />
            {selectedPaymentLink && renderPaymentLinkStatus(selectedPaymentLink, "w-fit")}
          </div>
          <div className={"flex flex-1 flex-col gap-1"}>
            <Typography
              text={Locale.description}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold"}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={selectedPaymentLink?.description || "-"}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"semibold"}
            />
          </div>
        </div>
        <div className={"flex flex-row items-center gap-6"}>
          <div className={"flex flex-1 flex-col gap-1"}>
            <Typography
              text={Locale.invoiceNumber}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"semibold"}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={selectedPaymentLink?.invoiceNumber || "-"}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"semibold"}
            />
          </div>
        </div>
        <div className={"border-b border-black-400 w-full"} />
        <div className={"flex flex-col gap-2 justify-start w-full"}>
          {selectedPaymentLink?.status === "COMPLETED" ? (
            <>
              <Typography
                text={Locale.paidUsingTitle}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500"}
                fontWeight={"600"}
              />
              <div className={"flex flex-row gap-2 items-center"}>
                {selectedPaymentLink?.paymentVendor === "VEEM_CARDS" && (
                  <>
                    <VeemCardPaymentMethod key={selectedPaymentLink?.paymentVendor} />
                  </>
                )}
                {selectedPaymentLink?.paymentVendor === "ACH_DEBIT" && (
                  <>
                    <ACHDebitPaymentMethod key={selectedPaymentLink?.paymentVendor} />
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {selectedPaymentLink?.methodsConfig?.allowedMethods?.some(
                (method) => method === "VEEM_CARDS" || method === "ACH_DEBIT"
              ) && (
                <>
                  <Typography
                    text={Locale.paymentMethods}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500"}
                    fontWeight={"600"}
                  />
                  <div className={"flex flex-row w-full"}>
                    {selectedPaymentLink?.methodsConfig?.allowedMethods?.map((method, index) => (
                      <div
                        key={`method-container-${index}`}
                        className={`flex ${
                          selectedPaymentLink?.methodsConfig?.allowedMethods?.length &&
                          selectedPaymentLink?.methodsConfig?.allowedMethods?.length > 1
                            ? "w-1/2"
                            : "w-full"
                        } justify-start`}
                      >
                        {method === "VEEM_CARDS" && <VeemCardPaymentMethod key={method} />}
                        {method === "ACH_DEBIT" && <ACHDebitPaymentMethod key={method} />}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {shouldShowBanner() ? (
        <PaymentLinksBanner />
      ) : (
        <PageHeader title={Locale.instaLinks} rightCTAs={renderCreateLinkCTA} />
      )}
      {/* {isVeemCardsDisabled && (
        <Notes
          text={
            "Card payments are unavailable & we sincerely apologise for the disruption. You can use Net banking for US clients. Please refer to our email to know more details about this pause."
          }
          iconHeight={24}
          iconWidth={24}
          className="border border-alert-200 mb-6"
        />
      )} */}
      <div className={"pb-6"}>
        <Table
          columns={tableColumns}
          data={listOfPaymentLinks.slice(startIndex, endIndex)}
          customTableDataClass={"!justify-start"}
          customTableRowClass={"gap-x-2 cursor-pointer"}
          onRowClick={(data: PaymentLink) => {
            setSelectedPaymentLink(data);
            setShowPaymentLinkPopup(true);
          }}
        />
        <PaginationCTAs
          isLeftDisabled={startIndex === 0}
          paginationText={`${startIndex + 1} - ${
            listOfPaymentLinks.length < endIndex ? listOfPaymentLinks.length : endIndex
          } of ${listOfPaymentLinks.length}`}
          isRightDisabled={endIndex >= listOfPaymentLinks.length}
          onLeftClick={() => {
            if (startIndex - pageSize < 0) return;
            setStartIndex(startIndex - pageSize);
            setEndIndex(endIndex - pageSize);
          }}
          onRightClick={() => {
            if (endIndex >= listOfPaymentLinks.length) return;
            setStartIndex(startIndex + pageSize);
            setEndIndex(endIndex + pageSize);
          }}
        />
      </div>
      {isExporterIndustryEligibleForInstalinks && (
        <div className={"flex flex-col gap-6"}>
          {isExporterEligibleForVeemCards && <AvailablePaymentMethods isDefaultOpen={false} />}
          {isExporterEligibleForVeemCards && (
            <InstalinkUsageAccordian
              isDefaultOpen={false}
              showYoutubeVideo={true}
              exporterEligibleForVeemCards={isExporterEligibleForVeemCards}
            />
          )}
          {!isExporterEligibleForVeemCards && <PaymentLinksValueProp isAccordion={true} showSettlementTime={true} />}
          {!isExporterEligibleForVeemCards && <HowToCreateLinkCard />}
          {/* {!isExporterEligibleForVeemCards && <PaymentLinkComparison />} */}
          <FAQFooterForPaymentLinks />
        </div>
      )}
      <Popup
        renderContent={paymentLinkPopupContent}
        isDashboardPopup={true}
        open={showPaymentLinkPopup}
        outsideClick={() => {
          setShowPaymentLinkPopup(false);
        }}
        closeIconClick={() => {
          setShowPaymentLinkPopup(false);
        }}
        isCommonHeader={true}
        title={Locale.paymentLink.paymentLinkPopupHeader.replace(":paymentLinkId", selectedPaymentLink?.id || "")}
      />
      <Popup
        outsideClick={closeCompletePaymentLinkPopup}
        isDashboardPopup={true}
        renderContent={() => (
          <PaymentLinkSuccessfullyGeneratedPopup
            invoiceAmount={completedPaymentLink.invoiceAmount || 0}
            currency={completedPaymentLink.currency}
            paymentLinkId={completedPaymentLink.id}
            clientName={completedPaymentLink.clientName}
            invoiceNumber={completedPaymentLink.invoiceNumber}
            description={completedPaymentLink.description}
            allowedMethods={completedPaymentLink.allowedMethods}
          />
        )}
        open={openCompletePaymentLinkPopup}
        closeIconClick={closeCompletePaymentLinkPopup}
        renderCTAs={() => {
          return (
            <>
              <Button
                title={Locale.previewInANewTab}
                type={BUTTON_TYPES.SECONDARY}
                size={BUTTON_SIZES.SMALL}
                onButtonClick={() => {
                  window.open(`${FE_BASE_URL}/pay/${completedPaymentLink.id}`, "_blank");
                }}
              />
              <Button
                title={Locale.done}
                type={BUTTON_TYPES.PRIMARY}
                size={BUTTON_SIZES.SMALL}
                onButtonClick={closeCompletePaymentLinkPopup}
              />
            </>
          );
        }}
      />
      <Popup
        renderContent={renderDeletePopupContent}
        isDashboardPopup={true}
        open={showDeletePopup}
        containerClass="!max-w-[448px] !w-[448px]"
        outsideClick={() => {
          if (!isDeleting) {
            analytics?.trackAsync(Events.PAYPAL.CANCEL_PAYMENT_LINK_POPUP, {
              source: "outside_click",
            });
            setShowDeletePopup(false);
            setPaymentLinkToDelete(null);
            setDeletionReason("");
          }
        }}
        renderCTAs={() => {
          return (
            <>
              <Button
                title={Locale.cancel}
                type={BUTTON_TYPES.SECONDARY}
                size={BUTTON_SIZES.SMALL}
                onButtonClick={() => {
                  analytics?.trackAsync(Events.PAYPAL.CANCEL_PAYMENT_LINK_POPUP, {
                    source: "cancel_button",
                  });
                  setShowDeletePopup(false);
                  setPaymentLinkToDelete(null);
                  setDeletionReason("");
                }}
                isDisabled={isDeleting}
              />
              <Button
                title={Locale.deleteLink}
                type={BUTTON_TYPES.PRIMARY}
                size={BUTTON_SIZES.SMALL}
                onButtonClick={handleDeletePaymentLink}
                isDisabled={isDeleting}
                buttonClass="!bg-warning-400"
              />
            </>
          );
        }}
      />
    </div>
  );
};

export default PaymentLinksList;
