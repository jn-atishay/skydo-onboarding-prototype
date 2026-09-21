import Typography from "../AtomicComponents/Typography";
import { LOCATION_CODE } from "../../constants/dashboardConstants";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import ImporterLocationVsIconComp from "../Common/ImporterLocationVsIconComp";

interface CurrencyTextIconProps {
  currency: string;
  height?: number;
  width?: number;
}

const CurrencyTextIcon = ({ currency, height = 20, width = 20 }: CurrencyTextIconProps) => {
  if (currency === LOCATION_CODE.ROW) {
    return <ImporterLocationVsIconComp height={height} width={width} location={LOCATION_CODE.ROW} />;
  }
  return (
    <Typography
      text={currency}
      type={TYPOGRAPHY_TYPES.LABEL}
      size={TYPOGRAPHY_SIZES.X_SMALL}
      textClasses={"!text-blue-300 !font-[700]"}
    />
  );
};

export default CurrencyTextIcon;
