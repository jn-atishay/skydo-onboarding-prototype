import { useState } from "react";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import RequestPaymentMethods from "./RequestPaymentMethods";
import classNames from "classnames";

interface RequestOtherPaymentLinkMethodsComponentProps {
  className?: string;
}

const RequestOtherPaymentLinkMethodsComponent = (props: RequestOtherPaymentLinkMethodsComponentProps) => {
  const { className } = props;
  const [isRequestPaymentMethodsOpen, setIsRequestPaymentMethodsOpen] = useState(false);

  const onRequestClick = () => {
    setIsRequestPaymentMethodsOpen(true);
  };
  return (
    <>
      <div className={classNames("flex flex-row items-center", className)}>
        <Typography
          text={"Looking for another payment method?"}
          size={TYPOGRAPHY_SIZES.SMALL}
          type={TYPOGRAPHY_TYPES.PARA}
          textClasses={"!text-neutral-600"}
          fontWeight={400}
        >
          <Typography
            text={"Request here"}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
            textClasses={"!text-primary-300 ml-1 cursor-pointer"}
            fontWeight={400}
            onTextClick={onRequestClick}
          />
        </Typography>
      </div>
      <RequestPaymentMethods show={isRequestPaymentMethodsOpen} onClose={() => setIsRequestPaymentMethodsOpen(false)} />
    </>
  );
};

export default RequestOtherPaymentLinkMethodsComponent;
