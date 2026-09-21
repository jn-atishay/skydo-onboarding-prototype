import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import RadioButton from "../AtomicComponents/RadioButton";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { BUSSINESS_TYPES } from "../../constants/onboarding";
import Locale from "../../util/locale/en";

interface BusinessTypeSelectorProps {
  selectedBusinessType: string;
  onSelect: (businessType: string) => void;
  containerClass?: string;
}

const BUSINESS_TYPE_OPTIONS = [
  { label: Locale.partnershipFirm, value: BUSSINESS_TYPES.PARTNERSHIP },
  { label: Locale.limitedLiabilityPartnership, value: BUSSINESS_TYPES.LLP },
];

const BusinessTypeSelector = ({ selectedBusinessType, onSelect, containerClass }: BusinessTypeSelectorProps) => (
  <div className={classNames("flex flex-col gap-4 w-full", containerClass)}>
    <Typography
      text={Locale.selectBusinessType}
      type={TYPOGRAPHY_TYPES.LABEL}
      size={TYPOGRAPHY_SIZES.MEDIUM}
      textClasses={"!text-labelxsmall md:!text-labelmedium md:!font-bold"}
    >
      <Typography
        text={" *"}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        textClasses={"!text-red-400 !text-labelxsmall md:!text-labelmedium md:!font-bold"}
      />
    </Typography>
    <div className={"flex flex-col md:flex-row gap-2 md:gap-4 w-full"}>
      {BUSINESS_TYPE_OPTIONS.map((option) => (
        <div
          key={option.value}
          className={classNames(
            "flex items-center justify-between md:justify-start gap-4 px-4 py-3 bg-white border border-solid rounded-10px w-full md:w-auto cursor-pointer",
            selectedBusinessType === option.value ? "border-blue-500" : "border-black-400"
          )}
          onClick={() => onSelect(option.value)}
        >
          <Typography
            text={option.label}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={700}
            textClasses={"!text-parasmall !leading-5"}
          />
          <RadioButton
            id={`business_type_${option.value}`}
            label={() => null}
            checked={selectedBusinessType === option.value}
            onChange={() => onSelect(option.value)}
          />
        </div>
      ))}
    </div>
  </div>
);

export default BusinessTypeSelector;
