/**
 * @author Raj Sheth
 * created: 21/05/24
 */

import { useRef } from "react";
import useBankAccountStore from "../../store/useBankAccountStore";
import useCompanyPanDetailsStore from "../../store/useCompanyPanDetailsStore";
import useUserData from "../../store/useUserData";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import Locale from "../locale/en";
import { BankFieldError, BankVerificationErrorCode } from "../../types";
import { ChangeBusinessNameFormValues } from "../../types/Onboarding";
import { BANK_VERIFY_FAILURE_REASONS, BUSINESS_NAME_UPDATE_BLOCKED_CODES } from "../../constants/onboarding";
import { TOAST_TYPES } from "../../constants/atomicConstants";
import useToastMessages from "../../store/toastMessages";
import * as Sentry from "@sentry/nextjs";

type SuccessCbFun = () => void;

interface SaveBusinessNameCallbacks {
  onNameUpdated?: () => void;
  onVerifySuccess?: SuccessCbFun;
  onUpdateBlocked?: () => void;
}

interface OnVerifyParams {
  successCallback?: SuccessCbFun;
  companyName?: string;
}

interface BankAccountChangeReturn {
  isValidFormFields: () => boolean;
  bankAccountChange: (value: string) => void;
  onIfscChange: (value: string) => void;

  handleVerifyError: (e: any, companyNameOverride?: string) => void;
  onVerify: (params: OnVerifyParams) => void;
  saveBusinessNameAndReverify: (values: ChangeBusinessNameFormValues, callbacks: SaveBusinessNameCallbacks) => void;
}

interface Props {
  flow: "onboarding" | "profile_page";
  companyName: string;
  exporterName: string;
  canRecoverNameMismatch?: boolean;
}

const useChangeBankAccount = (props: Props): BankAccountChangeReturn => {
  const {
    accountNumb,
    setAccountNumb,
    ifscCode,
    setIfscCode,
    setIsVerifyLoading,
    setNameMatchError,
    setIsFormEditable,
    fieldError,
    setFieldError,
    addAndVerifyBankAccount,
    setErrorCode,
    setIsNameMismatchRecoverable,
    setIsBusinessNameSaving,
  } = useBankAccountStore();
  const { updateBusinessName } = useCompanyPanDetailsStore();
  const { addToast } = useToastMessages();
  const { exporterId } = useUserData();
  const analytics = useAnalytics();
  const verifyAttemptRef = useRef(0);

  const isValidFormFields = () => {
    let isError = false;
    const errorFields: BankFieldError = {};
    if (!accountNumb) {
      errorFields.accountNumber = Locale.accountNumberRequired;
      isError = true;
    }
    if (!ifscCode) {
      errorFields.ifscCode = Locale.ifscRequired;
      isError = true;
    }
    if (isError) {
      setFieldError({ ...fieldError, ...errorFields });
    }
    return !isError;
  };

  const bankAccountChange = (value: string) => {
    const newValue = value ? value.replace(/[^0-9a-zA-Z]+/gi, "") : "";
    setAccountNumb(newValue);
    setNameMatchError("");
    setIsNameMismatchRecoverable(false);
    setFieldError({ ...fieldError, accountNumber: "" });
    verifyAttemptRef.current = 0;
  };

  const onIfscChange = (value: string) => {
    setIfscCode(value);
    setNameMatchError("");
    setIsNameMismatchRecoverable(false);
    setFieldError({ ...fieldError, ifscCode: "" });
    verifyAttemptRef.current = 0;
  };

  const handleVerifyError = (e: any, companyNameOverride?: string) => {
    setErrorCode(e.message);
    const errorCode: BankVerificationErrorCode = e.message;
    const companyName = companyNameOverride ?? props.companyName;
    analytics?.trackAsync(Events.BANK_DETAILS_FAILED, {
      exporter_id: exporterId,
      failure_reason: BANK_VERIFY_FAILURE_REASONS[errorCode ?? ""] ?? "other",
      error_code: errorCode,
      attempt_number: verifyAttemptRef.current,
    });
    const isNameMismatchCode =
      errorCode === "BANK_NAME_MATCHED_FAILED" || errorCode === "BANK_NAME_MATCHED_FAILED_INDIVIDUAL_AND_ENTITY";
    const isRecoverable = isNameMismatchCode && !!props.canRecoverNameMismatch;
    setIsNameMismatchRecoverable(isRecoverable);
    if (isRecoverable) {
      analytics?.trackAsync(Events.BANK_NAME_MISMATCH_RECOVERABLE_SHOWN, {
        exporter_id: exporterId,
        error_code: errorCode,
      });
    }
    if (isNameMismatchCode && companyNameOverride) {
      analytics?.trackAsync(Events.BANK_NAME_MISMATCH_AFTER_NAME_CHANGE, {
        exporter_id: exporterId,
        error_code: errorCode,
      });
    }
    if (isRecoverable) {
      const recoverableName =
        errorCode === "BANK_NAME_MATCHED_FAILED_INDIVIDUAL_AND_ENTITY"
          ? `${companyName} or ${props.exporterName}`
          : companyName;
      setNameMatchError(Locale.banknameMismatchRecoverableIntro.replace(":name", recoverableName));
    } else if (errorCode === "BANK_NAME_MATCHED_FAILED") {
      setNameMatchError(Locale.banknameMatchError.replace(":companyName", companyName));
    } else if (errorCode === "BANK_NAME_MATCHED_FAILED_INDIVIDUAL_AND_ENTITY") {
      setNameMatchError(
        Locale.banknameMatchErrorForSingleAndCompany.replace(
          ":companyName",
          `${companyName} or ${props.exporterName}`
        )
      );
    } else if (errorCode === "INVALID_BANK_DETAILS") {
      setNameMatchError(Locale.invalidIfscOrbank);
    } else if (errorCode === "MAX_RETRIES_EXCEEDED") {
      setNameMatchError(Locale.maxRetriesBA);
    } else if (errorCode === "INVALID_IFSC") {
      setNameMatchError(Locale.invalidIfsc);
    } else if (errorCode === "ALREADY_ACTIVE") {
      setNameMatchError(Locale.bankAccountActive);
    } else {
      setNameMatchError(Locale.wentWrongMessage);
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "bank_verify",
        body: Locale.wentWrongMessage,
      });
    }
    Sentry.captureMessage("bank_acc_verif_failed", {
      level: "info",
      extra: {
        errorCode: e.message,
        error: e,
      },
    });
  };

  const onVerify = async ({ successCallback, companyName }: OnVerifyParams) => {
    if (!isValidFormFields()) {
      setIsVerifyLoading(false);
      return;
    }
    verifyAttemptRef.current += 1;
    setNameMatchError("");
    setIsVerifyLoading(true);
    try {
      await addAndVerifyBankAccount({
        bankAccountNumber: accountNumb,
        ifscCode: ifscCode,
        markOthersAsInactive: props.flow === "onboarding",
        onSuccess: (res) => {
          if (companyName) {
            analytics?.trackAsync(Events.BANK_VERIFIED_AFTER_NAME_CHANGE, { exporter_id: exporterId });
          }
          successCallback && successCallback();
          setIsFormEditable(false);
          setErrorCode(undefined);
          setNameMatchError("");
          setIsNameMismatchRecoverable(false);
        },
        onError: (e) => {
          handleVerifyError(e, companyName);
        },
      });
    } catch (e) {
      addToast({
        id: "bank-verify",
        type: TOAST_TYPES.ERROR,
        body: Locale.wentWrongMessage,
      });
    } finally {
      setIsVerifyLoading(false);
    }
  };

  const saveBusinessNameAndReverify = async (
    values: ChangeBusinessNameFormValues,
    callbacks: SaveBusinessNameCallbacks
  ) => {
    setIsBusinessNameSaving(true);
    try {
      await updateBusinessName({
        businessLegalName: values.businessLegalName,
        shortname: values.shortname,
        onSuccess: async () => {
          analytics?.trackAsync(Events.BUSINESS_NAME_UPDATE_SUCCESS, { exporter_id: exporterId });
          setIsNameMismatchRecoverable(false);
          setNameMatchError("");
          setErrorCode(undefined);
          callbacks.onNameUpdated && callbacks.onNameUpdated();
          await onVerify({ successCallback: callbacks.onVerifySuccess, companyName: values.businessLegalName });
        },
        onError: (e) => {
          const isBlocked = BUSINESS_NAME_UPDATE_BLOCKED_CODES.includes(e?.message);
          analytics?.trackAsync(Events.BUSINESS_NAME_UPDATE_FAILED, {
            exporter_id: exporterId,
            error_code: e?.message,
            is_blocked: isBlocked,
          });
          if (isBlocked) {
            setIsNameMismatchRecoverable(false);
            setNameMatchError("");
            callbacks.onUpdateBlocked && callbacks.onUpdateBlocked();
          }
          addToast({
            id: "business_name_update",
            type: TOAST_TYPES.ERROR,
            body: isBlocked ? Locale.businessNameUpdateNotAllowed : Locale.wentWrongMessage,
          });
          Sentry.captureMessage("business_name_update_failed", {
            level: "error",
            extra: {
              errorCode: e?.message,
              error: e,
            },
          });
        },
      });
    } finally {
      setIsBusinessNameSaving(false);
    }
  };

  return {
    isValidFormFields,
    bankAccountChange,
    onIfscChange,
    handleVerifyError,
    onVerify,
    saveBusinessNameAndReverify,
  };
};

export default useChangeBankAccount;
