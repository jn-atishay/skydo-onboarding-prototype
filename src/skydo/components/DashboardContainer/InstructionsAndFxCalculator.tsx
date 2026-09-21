import FirstPaymentSteps from "../VirtualAccountDetails/FirstPaymentSteps";
import FxCalculator from "./FxCalculator";
import { LOCATION_CODE, LOCATION_CURRENCY_MAP } from "../../constants/dashboardConstants";
import classNames from "classnames";

interface Props {
  classname?: string;

  manualVerificationPending?: boolean;
}

const InstructionsAndFxCalculator = (props: Props) => {
  const classname = props.classname || "";
  return (
    <div className={classNames("", classname)}>
      <div className={"flex flex-col"}>
        <FirstPaymentSteps manualVerificationPending={props.manualVerificationPending} />
        <FxCalculator inputCurrency={LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]} isHorizontalView={true} />
      </div>
    </div>
  );
};

export default InstructionsAndFxCalculator;
