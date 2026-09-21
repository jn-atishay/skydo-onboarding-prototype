import React, { FC } from "react";
import UploadInvoiceContainer from "./index";
import { ConfigType } from "../../context/UploadInvoicePopupContext";
import FE_ROUTES from "../../util/feRoutes";
import { useRouter } from "next/router";

interface UploadInvoiceButtonProps {
  buttonSize?: string;
  source?: string;
  buttonTitle?: string;
  buttonClass?: string;
}

const UploadInvoiceButton: FC<UploadInvoiceButtonProps> = (props) => {
  const router = useRouter();
  const onSuccess = (config?: ConfigType) => {
    let url = FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", String(config?.invoiceId));
    void router.push(url);
  };
  return (
    <UploadInvoiceContainer
      onSuccess={onSuccess}
      isButton={true}
      buttonTitle={props.buttonTitle}
      buttonSize={props.buttonSize}
      source={props.source}
      buttonClass={props.buttonClass}
    />
  );
};

export default UploadInvoiceButton;
