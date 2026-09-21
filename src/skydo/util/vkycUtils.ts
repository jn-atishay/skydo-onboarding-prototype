/**
 * @author Raj Sheth
 * created: 11/03/24
 */
import { OnboardingTag } from "../types/Onboarding";

export const isOldUser = (exporterTag: OnboardingTag) => {
  return exporterTag === OnboardingTag.NON_VKYC;
};
