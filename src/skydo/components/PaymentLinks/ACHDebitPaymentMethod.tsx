import React from "react";
import NetBankingIconWithEllipse from "../Icons/NetBankingIconWithEllipse";
import PlaidIcon from "../Icons/PlaidIcon";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_TYPES, TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";

interface ACHDebitPaymentMethodProps {
  iconWidth?: string;
  iconHeight?: string;
  bgStrokeColor?: string;
  plaidWidth?: number;
  plaidHeight?: number;
}

const ACHDebitPaymentMethod: React.FC<ACHDebitPaymentMethodProps> = ({
  iconWidth = "32",
  iconHeight = "32",
  bgStrokeColor = "#F0F3F7",
  plaidWidth = 39,
  plaidHeight = 15
}) => {
  return (
    <div className={"flex flex-row gap-2 items-center"}>
      <NetBankingIconWithEllipse 
        width={iconWidth} 
        height={iconHeight} 
        bgStrokeColor={bgStrokeColor} 
      />
      <div className={"flex flex-col gap-1 items-start"}>
        <Typography 
          text={Locale.netBanking} 
          type={TYPOGRAPHY_TYPES.LABEL} 
          size={TYPOGRAPHY_SIZES.MEDIUM} 
          textClasses={"!text-black-700"} 
          fontWeight={"600"} 
        />
        <div className="flex flex-row gap-1 items-center">
          <Typography 
            text={Locale.poweredBy} 
            type={TYPOGRAPHY_TYPES.PARA} 
            size={TYPOGRAPHY_SIZES.X_X_X_SMALL} 
            textClasses={"!text-black-600"} 
          />
          <PlaidIcon width={plaidWidth} height={plaidHeight} />
        </div>
      </div>
    </div>
  );
};

export default ACHDebitPaymentMethod; 