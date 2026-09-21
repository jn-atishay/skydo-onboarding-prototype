import useExporterAndExporterUserStore from "../store/useExporterAndExporterUserStore";
import useExporterKnownNames from "./useExporterKnownNames";

const useInvoiceChecklistData = () => {
  const { exporter } = useExporterAndExporterUserStore();
  const { isPersonalIdentity } = useExporterKnownNames();
  const businessType = exporter?.businessType;
  const businessLegalName = exporter?.businessLegalName;

  // Only exporters the backend holds to their business legal name alone get the name up front --
  // there is no single name to put in front of anyone matched on all of their identities.
  const showBusinessNameItem = Boolean(businessType) && !isPersonalIdentity && Boolean(businessLegalName);

  return { businessType, businessLegalName, showBusinessNameItem };
};

export default useInvoiceChecklistData;
