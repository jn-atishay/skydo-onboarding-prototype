/**
 * @author Raj Sheth
 * created: 06/12/23
 */
import {
  AVG_TRANSACTION_OPTIONS,
  BUSSINESS_TYPES,
  DOC_REQUIRED_BUSINESSES,
  DOC_UPLOAD_STATE,
  INDIVIDUAL_BUSINESSES,
  USER_STATES,
  userStateJourney,
} from "../constants/onboarding";
import useUserData from "../store/useUserData";
import { BankAccountStep } from "../types/Onboarding";
import useBankAccountStore from "../store/useBankAccountStore";

interface StateProgressInfo {
  isStateDone: boolean;
  isCurrentState: boolean;
}

export const getPercentWidthMap = (businessType: string) => {
  const percentWidthMapForBusiness = {
    [USER_STATES.SIGN_UP_SUCCESS]: 0,
    [USER_STATES.COMPANY_PAN_DETAILS]: 15,
    [USER_STATES.UBO_PAN_DETAILS]: 35,
    [USER_STATES.COMPANY_MANAGEMENT_DETAILS]: 70,
    [USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS]: 90,
    [USER_STATES.BACKGROUND_VERIFICATION]: 100,
    [USER_STATES.VIRTUAL_ACCOUNT_CREATE]: 100,
    [USER_STATES.MANUAL_VERIFICATION]: 100,
  };

  const percentWidthMapForPartnershipAndHuf = {
    [USER_STATES.SIGN_UP_SUCCESS]: 0,
    [USER_STATES.COMPANY_PAN_DETAILS]: 15,
    [USER_STATES.UBO_PAN_DETAILS]: 45,
    [USER_STATES.COMPANY_MANAGEMENT_DETAILS]: 60,
    [USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS]: 75,
    [DOC_UPLOAD_STATE]: 90,
    [USER_STATES.BACKGROUND_VERIFICATION]: 100,
    [USER_STATES.VIRTUAL_ACCOUNT_CREATE]: 100,
    [USER_STATES.MANUAL_VERIFICATION]: 100,
  };

  const percentWidthMapForFreelancerAndSoleProps = {
    [USER_STATES.SIGN_UP_SUCCESS]: 0,
    [USER_STATES.COMPANY_PAN_DETAILS]: 15,
    [USER_STATES.UBO_PAN_DETAILS]: 45,
    [USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS]: 70,
    [DOC_UPLOAD_STATE]: 90,
    [USER_STATES.BACKGROUND_VERIFICATION]: 100,
    [USER_STATES.VIRTUAL_ACCOUNT_CREATE]: 100,
    [USER_STATES.MANUAL_VERIFICATION]: 100,
  };

  if (INDIVIDUAL_BUSINESSES.includes(businessType)) {
    return percentWidthMapForFreelancerAndSoleProps;
  }
  if (businessType == BUSSINESS_TYPES.HUF || businessType == BUSSINESS_TYPES.PARTNERSHIP) {
    return percentWidthMapForPartnershipAndHuf;
  }
  return percentWidthMapForBusiness;
};

export const useIsBankDetailsStateDone = (): StateProgressInfo => {
  const { userState, businessType, bankAccountStep } = useUserData();
  const { isDocsRequired } = useBankAccountStore();

  if (!DOC_REQUIRED_BUSINESSES.includes(businessType) && !isDocsRequired) {
    return {
      isStateDone:
        userStateJourney.indexOf(USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS) < userStateJourney.indexOf(userState),
      isCurrentState: userState === USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS,
    };
  }

  const isCurrentState =
    userState === USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS && bankAccountStep < BankAccountStep.STEP_COMPLETED;
  const isStateDone =
    userStateJourney.indexOf(userState) >= userStateJourney.indexOf(USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS) &&
    bankAccountStep === BankAccountStep.STEP_COMPLETED;

  return { isStateDone, isCurrentState };
};

export const useIsDocUploadStateDone = (): StateProgressInfo => {
  const { docUploadProps, bankAccountStep, userState } = useUserData();

  const isCurrentState =
    bankAccountStep === BankAccountStep.STEP_COMPLETED && userState === USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS;
  const isStateDone = docUploadProps.isDone;

  return { isStateDone, isCurrentState };
};

export const useIsUserStateDone = (state: string): boolean => {
  const { userState } = useUserData();
  const { isStateDone: isBankDetailsStateDone } = useIsBankDetailsStateDone();
  const { isStateDone: isDocUploadStateDone } = useIsDocUploadStateDone();
  if (state === DOC_UPLOAD_STATE) {
    return isDocUploadStateDone;
  }
  if (state === USER_STATES.COMPANY_BANK_ACCOUNT_DETAILS) {
    return isBankDetailsStateDone;
  }

  return userStateJourney.indexOf(state) < userStateJourney.indexOf(userState);
};

export const includeATSForConversionEvent = (averageTransaction: any): boolean => {
  if (!averageTransaction) return true;
  return (
    averageTransaction !== AVG_TRANSACTION_OPTIONS[1].value && averageTransaction !== AVG_TRANSACTION_OPTIONS[2].value
  );
};
