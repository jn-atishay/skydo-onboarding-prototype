import React, { forwardRef, MouseEvent, useContext } from "react";
import Locale from "../../util/locale/en";
import DeprecatedDropdownOptions from "../AtomicComponents/Dropdown/DeprecatedDropdownOptions";
import { Option } from "../../types/atomicComponentTypes";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import ListIcon from "../Icons/ListIcon";
import RedDeleteIcon from "../Icons/redDeleteIcon";
import { PaymentLink } from "./PaymentLinksList";
import { PAYMENT_LINK_STATUS } from "./constants";

interface Props {
  rowData: PaymentLink;
  setMenuVisibleForId: (val: string | null) => void;
  isVisible: boolean;
  onViewDetails: () => void;
  onDeleteLink: () => void;
}

export const PAYMENT_LINK_ACTION_MENU_OPTIONS = {
  viewDetails: "view_details",
  deleteLink: "delete_link",
};

const getActionMenuIcon = (value: string) => {
  switch (value) {
    case PAYMENT_LINK_ACTION_MENU_OPTIONS.viewDetails:
      return <ListIcon />;
    case PAYMENT_LINK_ACTION_MENU_OPTIONS.deleteLink:
      return <RedDeleteIcon />;
    default:
      return <ListIcon />;
  }
};

export const PaymentLinkActionMenu = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const { isVisible, rowData, setMenuVisibleForId, onViewDetails, onDeleteLink } = props;

  if (!isVisible) return null;

  const customRowRenderer = ({ label, value }: Option): JSX.Element => {
    return (
      <div
        key={value}
        className={"px-4 py-3 flex_row_item_center hover:bg-blue-50 cursor-pointer"}
        onClick={(event: MouseEvent) => onOptionClick(value, event)}
      >
        {getActionMenuIcon(value)}
        <div className={"ml-2 flex-1"}>
          <Typography
            text={label}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={value === PAYMENT_LINK_ACTION_MENU_OPTIONS.deleteLink ? "!text-warning-400" : ""}
          />
        </div>
      </div>
    );
  };

  const onOptionClick = (value: any, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuVisibleForId(null);

    switch (value) {
      case PAYMENT_LINK_ACTION_MENU_OPTIONS.viewDetails:
        onViewDetails();
        break;
      case PAYMENT_LINK_ACTION_MENU_OPTIONS.deleteLink:
        onDeleteLink();
        break;
      default:
        break;
    }
  };

  const options: Option[] = [
    {
      label: "View details",
      value: PAYMENT_LINK_ACTION_MENU_OPTIONS.viewDetails,
      customRowRenderer,
    },
  ];

  const isOutstanding =
    rowData.status === PAYMENT_LINK_STATUS.PAYMENT_ATTEMPTED || rowData.status === PAYMENT_LINK_STATUS.CREATED;

  if (isOutstanding) {
    options.push({
      label: "Delete link",
      value: PAYMENT_LINK_ACTION_MENU_OPTIONS.deleteLink,
      customRowRenderer,
    });
  }

  return (
    <div className={"cursor-pointer"} ref={ref}>
      <DeprecatedDropdownOptions options={options} className={"w-[200px]"} />
    </div>
  );
});

PaymentLinkActionMenu.displayName = "PaymentLinkActionMenu";

export default PaymentLinkActionMenu;

