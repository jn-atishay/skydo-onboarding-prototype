import React from "react";
import { DataQualityDismissal } from "../types/Invoice/upload";

export type ConfigType = {
  exporterSystemInvoiceId?: string;
  invoiceId?: string;
};

interface UploadInvoicePopupContextInterface {
  onSuccess: (config?: ConfigType) => void;
  setAlert: (value: boolean, dataQualityDismissal?: DataQualityDismissal | null) => void;
}

const UploadInvoicePopupContext = React.createContext<UploadInvoicePopupContextInterface>({
  onSuccess: () => {},
  setAlert: () => {},
});

export default UploadInvoicePopupContext;
