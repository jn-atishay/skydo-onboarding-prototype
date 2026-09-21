import React from "react";
import CreditCardIconWithEllipse from "../Icons/CreditCardIconWithEllipse";
import VisaMasterCardIcon from "../Icons/VisaMasterCardIcon";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_TYPES, TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";

interface VeemCardPaymentMethodProps {
  iconWidth?: string;
  iconHeight?: string;
  bgStrokeColor?: string;
}

const VeemCardPaymentMethod: React.FC<VeemCardPaymentMethodProps> = ({
  iconWidth = "32",
  iconHeight = "32",
  bgStrokeColor = "#F0F3F7"
}) => {
  return (
    <div className={"flex flex-row gap-2 items-center"}>
      <CreditCardIconWithEllipse 
        width={iconWidth} 
        height={iconHeight} 
        bgStrokeColor={bgStrokeColor} 
      />
      <div className={"flex flex-col gap-1 items-start"}>
        <Typography 
          text={Locale.creditDebitCard} 
          type={TYPOGRAPHY_TYPES.LABEL} 
          size={TYPOGRAPHY_SIZES.MEDIUM} 
          textClasses={"!text-black-700"} 
          fontWeight={"600"} 
        />
        <VisaMasterCardIcon width={"44"} height={"16"} />
      </div>
    </div>
  );
};

export default VeemCardPaymentMethod; 