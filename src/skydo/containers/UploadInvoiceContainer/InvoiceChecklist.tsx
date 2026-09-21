import React from "react";
import Typography from "../../components/AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import useInvoiceChecklistData from "../../hooks/useInvoiceChecklistData";
import useChecklistViewedEvent from "../../hooks/useChecklistViewedEvent";
import ChecklistTick from "../../components/UploadInvoiceContainer/ChecklistTick";

const InvoiceChecklist = () => {
  const { businessType, businessLegalName, showBusinessNameItem } = useInvoiceChecklistData();
  useChecklistViewedEvent("desktop", businessType);

  return (
    <div className="flex flex-col items-center w-full mt-8">
      <div className="w-full max-w-[526px] h-px bg-black-400" />
      <Typography
        text={Locale.invoiceMustHave}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"!text-black-500 mt-8 mb-3"}
      />
      <div className="flex items-start justify-center gap-8">
        <div className="flex items-center gap-2">
          <ChecklistTick />
          <Typography
            text={Locale.invoiceIncludeClientCountry}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-700"}
          />
        </div>
        {showBusinessNameItem && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <ChecklistTick />
              <Typography
                text={Locale.invoiceIncludeBusinessName}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-700"}
              />
            </div>
            {/* The column centres on tick + label, which leaves the name looking 16px left of the
                label. A 32px left margin (tick 24 + gap 8) on a centred item shifts it by half that,
                putting the name on the label's centre line rather than the whole item's. */}
            <Typography
              text={businessLegalName as string}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={700}
              textClasses={"!text-black-700 mt-2 ml-8"}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <ChecklistTick />
          <Typography
            text={Locale.invoiceIncludeServiceDescription}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-700"}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceChecklist;
