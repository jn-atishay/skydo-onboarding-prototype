import EditIcon from "../Icons/EditIcon";
import DeprecatedDropdownOptions from "../AtomicComponents/Dropdown/DeprecatedDropdownOptions";
import { Option } from "../../types/atomicComponentTypes";
import React, { forwardRef, MouseEvent, useContext } from "react";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import AppContext from "../../context/AppContext";
import Locale from "../../util/locale/en";
import CopyIcon from "../Icons/CopyIcon";
import DownloadIcon from "../Icons/DownloadIcon";

interface Props {
  isVisible: boolean;
  setActionMenuVisible: (val: boolean) => void;
  onDeleteInvoiceClick?: () => void;
  onDownloadInvoiceClick?: () => void;
  onDownloadFiraClick?: () => void;
  onDownloadSkydoReceiptClick?: () => void;
  onDownloadRefundCreditNoteClick?: () => void;
  isEInvoice?: boolean;
  onCancelRecurringInvoiceClick?: () => void;
  showDeleteInvoiceBtn?: boolean;
  showDuplicateInvoiceBtn?: boolean;
  onDuplicateInvoiceClick?: () => void;
  showEditInvoiceBtn?: boolean;
  onEditInvoiceClick?: () => void;
}

const INVOICE_DETAILS_ACTION_MENU_OPTIONS = {
  deleteInvoice: "delete_invoice",
  downloadInvoice: "download_invoice",
  downloadFira: "download_fira",
  downloadSkydoReceipt: "download_skydo_receipt",
  downloadRefundCreditNote: "download_refund_credit_note",
  stopRecurringInvoice: "stop_recurring_invoice",
  duplicateInvoice: "duplicate_invoice",
  editInvoice: "edit_invoice",
};

export const InvoiceDetailsActionMenu = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const {
    isVisible,
    setActionMenuVisible,
    onDeleteInvoiceClick,
    onDownloadInvoiceClick,
    onDownloadFiraClick,
    onDownloadSkydoReceiptClick,
    onDownloadRefundCreditNoteClick,
    showDeleteInvoiceBtn,
    showDuplicateInvoiceBtn,
    onDuplicateInvoiceClick,
    showEditInvoiceBtn,
    onEditInvoiceClick,
  } = props;
  const { theme } = useContext(AppContext);
  if (!isVisible) return null;

  const renderIcon = (value: any) => {
    switch (value) {
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.deleteInvoice:
        return <CrossIcon width={16} height={16} stroke={theme.hexColors.red[400]} />;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.stopRecurringInvoice:
        return <CrossIcon width={16} height={16} stroke={theme.hexColors.black[700]} />;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.duplicateInvoice:
        return <CopyIcon width={16} height={16} stroke={theme.hexColors.black[700]} strokeWidth={"1"} />;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.editInvoice:
        return <EditIcon stroke={theme.hexColors.black[700]} strokeWidth={1.5} />;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadInvoice:
        return <DownloadIcon width={16} height={16} />;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadFira:
        return <DownloadIcon width={16} height={16} />;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadSkydoReceipt:
        return <DownloadIcon width={16} height={16} />;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadRefundCreditNote:
        return <DownloadIcon width={16} height={16} />;
    }
  };

  const onOptionClick = (value: string, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActionMenuVisible(false);
    switch (value) {
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.deleteInvoice:
        onDeleteInvoiceClick && onDeleteInvoiceClick();
        return;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadInvoice:
        onDownloadInvoiceClick && onDownloadInvoiceClick();
        return;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadFira:
        onDownloadFiraClick && onDownloadFiraClick();
        return;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadSkydoReceipt:
        onDownloadSkydoReceiptClick && onDownloadSkydoReceiptClick();
        return;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadRefundCreditNote:
        onDownloadRefundCreditNoteClick && onDownloadRefundCreditNoteClick();
        return;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.stopRecurringInvoice:
        props.onCancelRecurringInvoiceClick && props.onCancelRecurringInvoiceClick();
        return;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.duplicateInvoice:
        onDuplicateInvoiceClick && onDuplicateInvoiceClick();
        return;
      case INVOICE_DETAILS_ACTION_MENU_OPTIONS.editInvoice:
        onEditInvoiceClick && onEditInvoiceClick();
    }
  };
  const customRowRenderer = ({ label, value, subText }: Option): JSX.Element => {
    return (
      <div
        key={value}
        className={"px-4 py-3 flex_row_item_center hover:bg-blue-50"}
        onClick={(event: MouseEvent) => onOptionClick(value, event)}
      >
        {renderIcon(value)}
        <div className={"ml-2 flex-1 flex justify-between flex-row items-center"}>
          <div className={"flex flex-col"}>
            <Typography
              text={label}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={
                value === INVOICE_DETAILS_ACTION_MENU_OPTIONS.deleteInvoice ? "!text-red-400" : "!text-black-700"
              }
            />
            <Typography
              text={subText}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={
                value === INVOICE_DETAILS_ACTION_MENU_OPTIONS.deleteInvoice ? "!text-red-400" : "!text-black-700"
              }
            />
          </div>
        </div>
      </div>
    );
  };

  let options = [];

  if (onDownloadInvoiceClick) {
    options.push({
      label: Locale.downloadInvoice,
      value: INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadInvoice,
      customRowRenderer,
    });
  }
  if (onDownloadFiraClick) {
    options.push({
      label: "Download FIRA",
      value: INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadFira,
      customRowRenderer,
    });
  }
  if (onDownloadSkydoReceiptClick) {
    options.push({
      label: "Download Skydo receipt",
      value: INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadSkydoReceipt,
      customRowRenderer,
    });
  }
  if (onDownloadRefundCreditNoteClick) {
    options.push({
      label: "Download Refund credit note",
      value: INVOICE_DETAILS_ACTION_MENU_OPTIONS.downloadRefundCreditNote,
      customRowRenderer,
    });
  }
  if (props.onCancelRecurringInvoiceClick) {
    options.push({
      label: Locale.stopRecurInvoice,
      value: INVOICE_DETAILS_ACTION_MENU_OPTIONS.stopRecurringInvoice,
      customRowRenderer,
    });
  }
  if (onDeleteInvoiceClick && showDeleteInvoiceBtn) {
    options.push({
      label: props.isEInvoice ? Locale.deleteSlashCancel : Locale.deleteInvoice,
      value: INVOICE_DETAILS_ACTION_MENU_OPTIONS.deleteInvoice,
      customRowRenderer,
    });
  }
  if (showDuplicateInvoiceBtn) {
    options.push({
      label: Locale.duplicateInvoice,
      value: INVOICE_DETAILS_ACTION_MENU_OPTIONS.duplicateInvoice,
      customRowRenderer,
    });
  }
  if (showEditInvoiceBtn) {
    options.push({
      label: Locale.editInvoice,
      value: INVOICE_DETAILS_ACTION_MENU_OPTIONS.editInvoice,
      customRowRenderer,
    });
  }

  return (
    <div className={"cursor-pointer"} ref={ref}>
      <DeprecatedDropdownOptions options={options} className={"w-[262px] left-0"} />
    </div>
  );
});

InvoiceDetailsActionMenu.displayName = "InvoiceDetailsActionMenu";
