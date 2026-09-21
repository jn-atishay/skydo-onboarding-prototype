import { InvoiceOrReminderPopupContentCase } from "./InvoiceOrReminderEmailPreviewPopUpChange";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import RadioButton from "../AtomicComponents/RadioButton";
import React from "react";
import Locale from "../../util/locale/en";

interface Props {
  popUpContentCase?: InvoiceOrReminderPopupContentCase;
  setPopupContentCase?: (popUpContentCase: InvoiceOrReminderPopupContentCase) => void;
}
const SelectEmailTypeToggle = (props: Props) => {
  const { popUpContentCase, setPopupContentCase } = props;

  return (
    <div className={"flex flex-row gap-6 bg-black-100 p-4 rounded-10px"}>
      <div>
        <Typography text={Locale.toggleEmailType} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} />
      </div>
      <RadioButton
        id={"invoiceemail"}
        label={Locale.toggleInvoiceEmail}
        checked={popUpContentCase == InvoiceOrReminderPopupContentCase.EMAIL}
        onChange={() => {
          setPopupContentCase && setPopupContentCase(InvoiceOrReminderPopupContentCase.EMAIL);
        }}
        className={"flex_row_item_center"}
      />
      <RadioButton
        id={"reminderemail"}
        label={Locale.toggleReminderEmail}
        checked={popUpContentCase == InvoiceOrReminderPopupContentCase.REMINDER}
        onChange={() => {
          setPopupContentCase && setPopupContentCase(InvoiceOrReminderPopupContentCase.REMINDER);
        }}
        className={"flex_row_item_center"}
      />
    </div>
  );
};

export default SelectEmailTypeToggle;
