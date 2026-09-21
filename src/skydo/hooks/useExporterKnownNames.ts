import * as R from "remeda";
import useExporterAndExporterUserStore from "../store/useExporterAndExporterUserStore";
import { BUSSINESS_TYPES, GST_AUTH_STATUS, INDIVIDUAL_BUSINESSES } from "../constants/onboarding";

/**
 * The exporter identities the backend's invoice name-presence check verifies against. Mirrors
 * ExporterKnownNamesResolver: freelancers and sole props (with or without GST) are matched against
 * registered name, full name and business legal name (all of them), everyone else against business
 * legal name alone. Showing a name the backend does not match would tell the exporter to re-upload
 * with something that still fails, so this must not drift from that rule.
 *
 * isPersonalIdentity is narrower: a sole prop with an ACTIVE GST is still treated as a business
 * (checklist item and "registered business name" copy) even though its personal names also match.
 */
const useExporterKnownNames = () => {
  const { exporter, exporterUser } = useExporterAndExporterUserStore();
  const businessType = exporter?.businessType;
  const businessLegalName = exporter?.businessLegalName;

  const hasActiveGst = (exporter?.gstList || []).some((gst) => gst.authStatus === GST_AUTH_STATUS.ACTIVE);

  const isNameMatchedOnAllIdentities =
    businessType === BUSSINESS_TYPES.FREELANCER ||
    (businessType === BUSSINESS_TYPES.PROPRIETORSHIP && !hasActiveGst);

  const isIndividualBusiness = businessType !== undefined && INDIVIDUAL_BUSINESSES.includes(businessType);

  // Business legal name leads, matching the design. Full name precedes registered name because the
  // registered name is only a first name for some exporters, and that is the weakest thing to ask
  // them to put on an invoice. The resolver's own order is irrelevant -- it checks each name
  // independently -- so trimming this list only narrows what we suggest, never what passes.
  const candidates = isIndividualBusiness
    ? [businessLegalName, exporterUser?.fullName, exporterUser?.registeredName]
    : [businessLegalName];

  // A freelancer sees a single name (as designed); a sole prop sees its business name alongside the
  // personal one, since either is a legitimate thing to carry on the invoice.
  const maxNamesToShow = businessType === BUSSINESS_TYPES.PROPRIETORSHIP ? 2 : 1;

  const knownNames = R.uniqBy(candidates.map((candidate) => candidate?.trim()).filter(R.isTruthy), (name) =>
    name.toLowerCase()
  ).slice(0, maxNamesToShow);

  return { knownNames, isPersonalIdentity: isNameMatchedOnAllIdentities };
};

export default useExporterKnownNames;
