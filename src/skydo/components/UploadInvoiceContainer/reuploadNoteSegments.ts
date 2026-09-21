import { NoteSegment } from "./ReuploadNote";
import Locale from "../../util/locale/en";
import {
  ServiceDescriptionPurposeCodeDto,
  ServiceDescriptionReviewReason,
  ServiceDescriptionRowVariant,
} from "../../types/Invoice";
import { SERVICE_DESCRIPTION_COMBINED_VARIANT } from "../../constants/fundingInvoiceMappingConstants";

export type ReuploadNoteKind = "country" | "bln" | "service";

export const getReuploadNoteSegments = (
  kind: ReuploadNoteKind,
  { isPersonalIdentity = false }: { isPersonalIdentity?: boolean } = {}
): NoteSegment[] => {
  if (kind === "bln") {
    // Freelancers and sole props without GST are matched on their own name, so calling it a
    // "business name" would not describe what we are asking them to put on the invoice.
    return [
      {
        text: isPersonalIdentity ? Locale.registeredNameNoteTitle : Locale.businessLegalNameNoteTitle,
        bold: true,
        weight: "bold",
      },
    ];
  }
  if (kind === "service") {
    return [{ text: Locale.invoiceIncludeServiceDescription, bold: true, weight: "bold" }];
  }
  return [{ text: Locale.clientCountryNoteTitle, bold: true, weight: "bold" }];
};

export const countryNoteDescriptionSegments: NoteSegment[] = [{ text: Locale.clientCountryNoteDescription }];

export const getBusinessLegalNameDescriptionSegments = (knownNames: string[]): NoteSegment[] => [
  { text: Locale.businessLegalNameNoteDescriptionPrefix },
  { text: knownNames.join(Locale.businessLegalNameNoteSeparator), bold: true },
  { text: Locale.businessLegalNameNoteDescriptionSuffix },
];

// The reasons arrive unranked. The only pair the backend can send is PURPOSE_CODE_MISMATCH with
// NOT_DESCRIPTIVE, which the design collapses into one sentence, so counting them is enough.
export const getServiceDescriptionRowVariant = (
  reasons: ServiceDescriptionReviewReason[]
): ServiceDescriptionRowVariant | null => {
  if (reasons.length === 0) return null;
  return reasons.length > 1 ? SERVICE_DESCRIPTION_COMBINED_VARIANT : reasons[0];
};

export const serviceDescriptionNoteDescriptionSegments: Record<ServiceDescriptionRowVariant, NoteSegment[]> = {
  NOT_FOUND: [{ text: Locale.serviceDescriptionNoteDescriptionNotFound }],
  NOT_DESCRIPTIVE: [{ text: Locale.serviceDescriptionNoteDescriptionNotDescriptive }],
  PURPOSE_CODE_MISMATCH: [{ text: Locale.serviceDescriptionNoteDescriptionPurposeCodeMismatch }],
  PURPOSE_CODE_MISMATCH_AND_NOT_DESCRIPTIVE: [{ text: Locale.serviceDescriptionNoteDescriptionCombined }],
};

const preciseTermsLine: NoteSegment[] = [{ text: Locale.serviceDescriptionGuidancePreciseTerms }];

// The bracket names the exporter's own code as judged by the backend; dropped when absent
const getPurposeCodeLine = (purposeCode: ServiceDescriptionPurposeCodeDto | null): NoteSegment[] => [
  { text: Locale.serviceDescriptionGuidancePurposeCode },
  ...(purposeCode
    ? [
        {
          text: Locale.serviceDescriptionGuidancePurposeCodeBracket
            .replace(":purposeCode", purposeCode.purposeCode)
            .replace(":purposeCodeDescription", purposeCode.purposeCodeDescription),
        },
      ]
    : []),
];

export const getServiceDescriptionGuidanceLines = (
  variant: ServiceDescriptionRowVariant,
  purposeCode: ServiceDescriptionPurposeCodeDto | null
): NoteSegment[][] => {
  if (variant === SERVICE_DESCRIPTION_COMBINED_VARIANT) return [preciseTermsLine, getPurposeCodeLine(purposeCode)];
  if (variant === "PURPOSE_CODE_MISMATCH") return [getPurposeCodeLine(purposeCode)];
  return [preciseTermsLine];
};
