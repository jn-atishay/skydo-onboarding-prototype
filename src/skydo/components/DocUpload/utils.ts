import { DOCTYPE_OPTIONS_ORDER } from "../../constants/onboarding";
import { DocOptionsType, DocTypeMasterEntry } from "../../types/Onboarding";

export function sortDocArray(docTypeMasterList: DocTypeMasterEntry[]): DocTypeMasterEntry[] {
  const orderMap: Record<string, number> = Object.fromEntries(
    DOCTYPE_OPTIONS_ORDER.map((docType, index) => [docType, index])
  );

  return [...docTypeMasterList].sort(
    (a, b) => (orderMap[a.docType] ?? Number.MAX_SAFE_INTEGER) - (orderMap[b.docType] ?? Number.MAX_SAFE_INTEGER)
  );
}

/**
 * A Freelancer-only doc (e.g. Platform Screenshot) and a Sole-Prop-only doc (e.g. Udyam) describe
 * different entities, so they cannot be submitted as a pair. Defaults to compatible when either
 * side carries no classification, so a doc type the backend adds later stays selectable.
 *
 * Only constrains Freelancers in practice: every other business type is offered docs from its own
 * business type alone, so all their `compatibleBusinessTypes` are identical and always intersect.
 * Widening `allowedDocBusinessTypes` would be a prerequisite for this to bite elsewhere.
 */
export function isBusinessTypeCompatible(selected?: DocOptionsType, candidate?: DocOptionsType): boolean {
  const selectedTypes = selected?.compatibleBusinessTypes ?? [];
  const candidateTypes = candidate?.compatibleBusinessTypes ?? [];
  if (selectedTypes.length === 0 || candidateTypes.length === 0) return true;
  return selectedTypes.some((businessType) => candidateTypes.includes(businessType));
}
