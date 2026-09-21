import React from "react";
import Typography from "../AtomicComponents/Typography";
import StrokeTickIconWithCircle from "../Icons/StrokeTickIconWithCircle";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";

const CONTRACT_CHECKLIST = [Locale.contractIncludeNames, Locale.contractIncludeScope, Locale.contractIncludeSignatures];

interface ContractChecklistProps {
  wrapperClass?: string;
}

const ContractChecklist = ({ wrapperClass = "md:pt-20" }: ContractChecklistProps) => (
  <div className={`flex flex-1 flex-col gap-3 ${wrapperClass}`}>
    <Typography
      text={Locale.contractShouldInclude}
      type={TYPOGRAPHY_TYPES.PARA}
      size={TYPOGRAPHY_SIZES.SMALL}
      fontWeight={700}
      textClasses={"!text-black-700"}
    />
    <div className="flex flex-col gap-2">
      {CONTRACT_CHECKLIST.map((item) => (
        <div key={item} className="flex items-center gap-2">
          <StrokeTickIconWithCircle />
          <Typography
            text={item}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-600"}
          />
        </div>
      ))}
    </div>
  </div>
);

export default ContractChecklist;
