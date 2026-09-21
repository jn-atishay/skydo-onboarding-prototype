import CurrStateTitle from "../Common/CurrStateTitle";
import Locale from "../../util/locale/en";
import TextInput from "../AtomicComponents/TextInput";
import React, { useContext, useEffect, useState } from "react";
import AlphaNumericInput from "../Common/AlphaNumericInput";
import CheckIcon from "../Icons/CheckIcon";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_TYPES, TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import RadioButton from "../AtomicComponents/RadioButton";
import classNames from "classnames";
import { gql, useQuery } from "@apollo/client";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import useToastMessages from "../../store/toastMessages";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import useUserData from "../../store/useUserData";
import { BUSSINESS_TYPES, DOC_REQUIRED_BUSINESSES, INDUSTRY_TYPES } from "../../constants/onboarding";
import { BankAccountStep, ChangeBusinessNameFormValues, VerificationStep } from "../../types/Onboarding";
import CreditCardIcon from "../Icons/CreditCardIcon";
import AppContext from "../../context/AppContext";
import { TrustMarkerMobile } from "../TrustMarker";
import useChangeBankAccount from "../../util/customHooks/useChangeBankAccount";
import useBankAccountStore from "../../store/useBankAccountStore";
import useOnboardingStore from "../../store/useOnboardingStore";
import useBankStatementAnalyseStore from "../../store/useBankStatementAnalyseStore";
import ChangeBankAccountConfirmation from "./ChangeBankAccountConfirmation";
import ChangeBusinessNameModal from "./ChangeBusinessNameModal";

const FETCH_BANK_DETAILS = gql`
  query {
    exporterUser {
      fullName
      exporter {
        businessLegalName
        verificationStatus {
          verificationStep
          isVerified
        }
        exporterKyc {
          iecDetails {
            ieCode
            verifiedBy
          }
        }
        bankAccount {
          ifscCode
          accountNumber
          accountHolderName
          isValid
          retry
          bankBranch
        }
        gstList {
          id
          gstin
          entryType
          address
        }
        selectedExporterIndustry {
          industryType
        }
      }
    }
  }
`;

const INTL_PAYMENTS_RADIO_NAME = "intlPayments";
const CHANGE_BANK_ACCOUNT_SOURCE = "bank_details_form";

const INTL_PAYMENT_OPTIONS = [
  {
    id: "intl_payments_yes",
    value: true,
    title: Locale.intlPaymentYes,
    subTitle: Locale.intlPaymentYesSubtitle,
  },
  {
    id: "intl_payments_no",
    value: false,
    title: Locale.intlPaymentNo,
    subTitle: Locale.intlPaymentNoSubtitle,
  },
];

const BankDetailsForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [hasReceivedIntlPayments, setHasReceivedIntlPayments] = useState<boolean | null>(null);
  const [intlPaymentError, setIntlPaymentError] = useState(false);
  const [showBankAccountChangePopup, setShowBankAccountChangePopup] = useState(false);
  const [showChangeBusinessNamePopup, setShowChangeBusinessNamePopup] = useState(false);
  const [isGstVerified, setIsGstVerified] = useState<boolean | null>(null);
  const { setUploadingState, setSelectedOption, setIsContractRecommended, clearDocsUploaded } = useBankStatementAnalyseStore();
  const [exporterName, setExporterName] = useState("");
  const { addToast } = useToastMessages();
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const {
    bankDetails,
    accountNumb,
    ifscCode,
    isVerifyLoading,
    isSubmitLoading,
    setIsSubmitLoading,
    nameMatchError,
    setNameMatchError,
    isFormEditable,
    fieldError,
    isDocsRequired,
    setIsDocsRequired,
    setBankDetails,
    setAccountNumb,
    setIfscCode,
    setIsFormEditable,
    isNameMismatchRecoverable,
    setIsNameMismatchRecoverable,
    isBusinessNameSaving,
  } = useBankAccountStore();
  const { businessType, setUserDetails, exporterId } = useUserData();

  const onCompleted = (data: any) => {
    if (data) {
      const bankDetails = data.exporterUser?.exporter?.bankAccount;
      const exporterName = data.exporterUser?.fullName;
      const companyName = data.exporterUser?.exporter?.businessLegalName || "";
      let isBankVerified = false;
      let isGstVerifiedStatus = false;
      const verificationTable = data.exporterUser?.exporter?.verificationStatus || [];
      for (let i = 0; i < verificationTable.length; ++i) {
        const { isVerified, verificationStep } = verificationTable[i];
        if (verificationStep === VerificationStep.EXPORTER_BANK_ACCOUNT && isVerified) {
          if (useUserData.getState().bankAccountStep === BankAccountStep.CHANGE_BANK_ACCOUNT) {
            useUserData.setState({
              bankAccountStep: BankAccountStep.NOT_STARTED,
            });
          }
          isBankVerified = true;
        }
        if (verificationStep === VerificationStep.EXPORTER_GST && isVerified) {
          isGstVerifiedStatus = true;
        }
      }
      setIsGstVerified(isGstVerifiedStatus);
      const exporterIec = data.exporterUser?.exporter?.exporterKyc?.iecDetails;
      const selectedIndustryType = data.exporterUser?.exporter?.selectedExporterIndustry?.industryType;
      const isIecRequired =
        (selectedIndustryType === INDUSTRY_TYPES.E_COMMERCE || selectedIndustryType === INDUSTRY_TYPES.GOODS_EXPORT) &&
        !exporterIec;
      if (isIecRequired || DOC_REQUIRED_BUSINESSES.includes(businessType)) {
        if (businessType == BUSSINESS_TYPES.PROPRIETORSHIP) {
          const isDocsRequired = !(isGstVerifiedStatus && !!exporterIec?.ieCode);
          setIsDocsRequired(isDocsRequired);
        } else {
          setIsDocsRequired(true);
        }
      } else {
        setIsDocsRequired(false);
      }

      if (!isBankVerified && (bankDetails?.accountNumber || bankDetails?.ifscCode)) {
        const isRecoverable = businessType === BUSSINESS_TYPES.FREELANCER && !isGstVerifiedStatus;
        setIsNameMismatchRecoverable(isRecoverable);
        setNameMatchError(
          isRecoverable
            ? Locale.banknameMismatchRecoverableIntro.replace(":name", companyName)
            : Locale.banknameMatchError.replace(":companyName", companyName)
        );
      } else {
        setIsNameMismatchRecoverable(false);
      }
      setIsFormEditable(!isBankVerified);
      setCompanyName(companyName);
      setExporterName(exporterName);
      setBankDetails(bankDetails);
      setAccountNumb(bankDetails?.accountNumber);
      setIfscCode(bankDetails?.ifscCode);
    }
  };

  const { refetch } = useQuery(FETCH_BANK_DETAILS, {
    onCompleted: onCompleted,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });
  const canRecoverNameMismatch = businessType === BUSSINESS_TYPES.FREELANCER && isGstVerified === false;
  const { bankAccountChange, onIfscChange, onVerify, saveBusinessNameAndReverify } = useChangeBankAccount({
    flow: "onboarding",
    companyName,
    exporterName,
    canRecoverNameMismatch,
  });

  const analytics = useAnalytics();

  useEffect(() => {
    analytics?.trackAsync(Events.BANK_VERIFICATION_SCREEN_LOAD);
  }, [analytics]);

  const onVerifyClick = () => {
    onVerify({
      successCallback: () => {
        refetch();
      },
    });
  };

  const onSubmitClick = async () => {
    if (businessType === BUSSINESS_TYPES.FREELANCER && hasReceivedIntlPayments === null) {
      setIntlPaymentError(true);
      return;
    }
    analytics?.trackAsync(Events.BANK_VERIFICATION_SUBMIT);
    analytics?.trackAsync(Events.BANK_AC_INT_TXNS_SUBMITTED, {
      exporter_id: exporterId,
      has_received_intl_payments: hasReceivedIntlPayments,
    });
    setIsSubmitLoading(true);
    if (isDocsRequired) {
      setUserDetails({
        docUploadProps: {
          isSectionVisible: true,
          isDone: false,
        },
        bankAccountStep: BankAccountStep.STEP_COMPLETED,
      });
      setIsSubmitLoading(false);
      refetchUserState();
      return;
    }
    try {
      const res = await beCall({
        path: BE_ROUTES.BANK_ACCOUNT_SUBMIT,
        method: ALLOWED_METHODS.POST,
      });
      if (res.data == false) {
        analytics?.trackAsync(Events.ACCOUNT_PENDING);
      }
      setIsSubmitLoading(false);
      if (res.success) {
        refetchUserState();
      } else {
        throw res;
      }
    } catch (e) {
      setIsSubmitLoading(false);
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "bank_verify",
        body: Locale.wentWrongMessage,
      });
    }
  };

  const openBankAccountChangePopup = () => {
    analytics?.trackAsync(Events.CHANGE_BANK_ACCOUNT_POPUP_OPENED, { source: CHANGE_BANK_ACCOUNT_SOURCE });
    setShowBankAccountChangePopup(true);
  };

  const closeBankAccountChangePopup = () => {
    analytics?.trackAsync(Events.CHANGE_BANK_ACCOUNT_POPUP_CLOSED);
    setShowBankAccountChangePopup(false);
  };

  const onChangeBankAccountGoBack = () => {
    analytics?.trackAsync(Events.CHANGE_BANK_ACCOUNT_GO_BACK_PRESSED);
    closeBankAccountChangePopup();
  };

  const onChangeBankAccountConfirm = () => {
    analytics?.trackAsync(Events.CHANGE_BANK_ACCOUNT_CLICKED);
    setUploadingState("FIRST");
    setAccountNumb("");
    setIfscCode("");
    setIsFormEditable(true);
    setUserDetails({ bankAccountStep: BankAccountStep.CHANGE_BANK_ACCOUNT });
    setShowBankAccountChangePopup(false);
  };

  const openChangeBusinessNamePopup = () => {
    analytics?.trackAsync(Events.CHANGE_BUSINESS_NAME_CLICKED, { exporter_id: exporterId });
    analytics?.trackAsync(Events.CHANGE_BUSINESS_NAME_POPUP_SHOWN, { exporter_id: exporterId });
    setShowChangeBusinessNamePopup(true);
  };

  const closeChangeBusinessNamePopup = () => {
    analytics?.trackAsync(Events.CHANGE_BUSINESS_NAME_POPUP_CLOSED, { exporter_id: exporterId });
    setShowChangeBusinessNamePopup(false);
  };

  const onChangeBusinessNameGoBack = () => {
    analytics?.trackAsync(Events.CHANGE_BUSINESS_NAME_POPUP_GO_BACK_PRESSED, { exporter_id: exporterId });
    setShowChangeBusinessNamePopup(false);
  };

  const onBusinessNameSave = (values: ChangeBusinessNameFormValues) => {
    analytics?.trackAsync(Events.CHANGE_BUSINESS_NAME_SAVE_CLICKED, { exporter_id: exporterId });
    saveBusinessNameAndReverify(values, {
      onNameUpdated: () => {
        setCompanyName(values.businessLegalName);
        setShowChangeBusinessNamePopup(false);
      },
      onVerifySuccess: () => {
        refetch();
      },
      onUpdateBlocked: () => {
        setShowChangeBusinessNamePopup(false);
        refetch();
      },
    });
  };

  const onIntlPaymentSelect = (value: boolean) => {
    analytics?.trackAsync(
      value ? Events.BANK_AC_INT_TXNS_YES_CLICKED : Events.BANK_AC_INT_TXNS_NO_CLICKED,
      { exporter_id: exporterId }
    );
    setHasReceivedIntlPayments(value);
    setIntlPaymentError(false);
    setSelectedOption("recommended");
    setIsContractRecommended(!value);
    setUploadingState("FIRST");
    clearDocsUploaded();
  };

  const title =
    businessType === BUSSINESS_TYPES.PARTNERSHIP
      ? Locale.partnerBankAccountTitle
      : businessType === BUSSINESS_TYPES.FREELANCER
      ? Locale.freelancerBankAccountTitle
      : Locale.compBankAccountTitle;
  const subTitle =
    businessType === BUSSINESS_TYPES.PARTNERSHIP || businessType === BUSSINESS_TYPES.PROPRIETORSHIP
      ? Locale.partnerBankSubtitle
      : businessType === BUSSINESS_TYPES.FREELANCER
      ? Locale.freelancerBankSubtitle
      : Locale.companyBankSubtitle;

  const { theme } = useContext(AppContext);

  return (
    <div className={"flex-1 px-4 md:px-0 mb-[150px] md:mb-0"}>
      <CurrStateTitle title={title} subTitle={subTitle} icon={() => <CreditCardIcon stroke={theme.hexColors.white} />} />
      <CustomisedNavigationForm onSubmit={isFormEditable ? onVerifyClick : onSubmitClick}>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6"}>
          <TextInput
            isDisabled={!isFormEditable}
            label={Locale.accountNumb}
            placeholder={Locale.bankAccountEx}
            value={accountNumb}
            onChange={bankAccountChange}
            isError={!!nameMatchError || !!fieldError.accountNumber}
            footerText={!!nameMatchError ? "" : fieldError.accountNumber}
          />
          <AlphaNumericInput
            isDisabled={!isFormEditable}
            onChange={onIfscChange}
            placeholder={Locale.ifscEx}
            label={Locale.ifscCode}
            value={ifscCode}
            isError={!!nameMatchError || !!fieldError.ifscCode}
            errorText={!!nameMatchError ? "" : fieldError.ifscCode}
          />

          {!isFormEditable ? (
            <TextInput
              label={Locale.accountName}
              value={bankDetails?.accountHolderName}
              rightElement={() => <CheckIcon />}
              isDisabled={true}
              footerClass={"!text-green-400 mt-2"}
              footerText={
                businessType === BUSSINESS_TYPES.PARTNERSHIP ? Locale.accountNameMatchPartner : Locale.accountNameMatch
              }
            />
          ) : null}
          {!isFormEditable ? (
            <TextInput label={Locale.bankBranch} value={bankDetails?.bankBranch} isDisabled={true} />
          ) : null}
        </div>

        {nameMatchError && isNameMismatchRecoverable ? (
          <div className={"flex flex-col mt-2"}>
            <Typography
              text={nameMatchError}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-red-400"}
            />
            <ul className={"list-disc pl-6"}>
              <li className={"text-red-400"}>
                <Typography
                  text={Locale.banknameMismatchOptionAcNumber}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-red-400"}
                />
              </li>
              <li className={"text-red-400"}>
                <Typography
                  text={Locale.banknameMismatchOptionBusinessName}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-red-400"}
                />
              </li>
            </ul>
          </div>
        ) : nameMatchError ? (
          <Typography
            text={nameMatchError}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-red-400"}
          />
        ) : null}

        {!isFormEditable ? (
          <div className={"mt-6 flex flex-col"}>
            <Typography
              text={Locale.changeBankAccount}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-blue-400 cursor-pointer w-fit"}
              onTextClick={openBankAccountChangePopup}
            />
            <ChangeBankAccountConfirmation
              isOpen={showBankAccountChangePopup}
              onClose={closeBankAccountChangePopup}
              onGoBack={onChangeBankAccountGoBack}
              onConfirm={onChangeBankAccountConfirm}
            />
            {businessType === BUSSINESS_TYPES.FREELANCER && (
              <>
                <div className={"border-t border-black-400 mt-8"} />
                <div className={"mt-8 flex flex-col gap-y-4"}>
                  <Typography
                    text={Locale.intlPaymentQuestion}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={700}
                    textClasses={"!text-black-700 !leading-5"}
                  >
                    <Typography
                      text={"*"}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.MEDIUM}
                      fontWeight={700}
                      textClasses={"!text-red-400"}
                    />
                  </Typography>
                  <div className={"flex flex-col md:flex-row gap-4"}>
                    {INTL_PAYMENT_OPTIONS.map((option) => (
                      <RadioButton
                        key={option.id}
                        id={option.id}
                        name={INTL_PAYMENTS_RADIO_NAME}
                        checked={hasReceivedIntlPayments === option.value}
                        onChange={() => onIntlPaymentSelect(option.value)}
                        onBodyClick={() => onIntlPaymentSelect(option.value)}
                        inputClassName={classNames("!w-6 !h-6", {
                          "appearance-none rounded-full border border-red-400 bg-white": intlPaymentError,
                          "accent-blue-400": hasReceivedIntlPayments === option.value,
                        })}
                        className={classNames(
                          "flex-1 justify-between gap-4 p-4 md:p-6 border rounded-10px",
                          intlPaymentError
                            ? "border-red-400 bg-white"
                            : hasReceivedIntlPayments === option.value
                            ? "border-blue-400 bg-blue-50"
                            : "border-black-400 bg-white"
                        )}
                        label={() => (
                          <div className={"order-first flex flex-1 flex-col gap-y-1"}>
                            <Typography
                              text={option.title}
                              type={TYPOGRAPHY_TYPES.PARA}
                              size={TYPOGRAPHY_SIZES.SMALL}
                              fontWeight={700}
                              textClasses={"!text-black-700 !text-parasmall !leading-5"}
                            />
                            <Typography
                              text={option.subTitle}
                              type={TYPOGRAPHY_TYPES.PARA}
                              size={TYPOGRAPHY_SIZES.SMALL}
                              textClasses={"!text-black-500 !text-parasmall !leading-5"}
                            />
                          </div>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}

        <div className={"hide_for_mob_flex flex-row items-center gap-4 mt-10"}>
          {!isFormEditable ? (
            <Button isLoading={isSubmitLoading} title={Locale.submitandCont} onButtonClick={onSubmitClick} />
          ) : (
            <>
              <Button isLoading={isVerifyLoading} title={Locale.verify} onButtonClick={onVerifyClick} />
              {isNameMismatchRecoverable ? (
                <Button
                  title={Locale.differentBusinessName}
                  type={BUTTON_TYPES.SECONDARY}
                  onButtonClick={openChangeBusinessNamePopup}
                />
              ) : null}
            </>
          )}
        </div>

        <div className={"hide_for_desktop fixed bottom-0 left-0 right-0 bg-white p-4"}>
          <TrustMarkerMobile />
          <Button
            isLoading={isFormEditable ? isVerifyLoading : isSubmitLoading}
            title={isFormEditable ? Locale.verify : Locale.submitandCont}
            onButtonClick={isFormEditable ? onVerifyClick : onSubmitClick}
            buttonClass={"mt-2 !flex !flex-1 flex-row justify-center !w-full"}
          />
          {isFormEditable && isNameMismatchRecoverable ? (
            <Button
              title={Locale.differentBusinessName}
              type={BUTTON_TYPES.SECONDARY}
              onButtonClick={openChangeBusinessNamePopup}
              buttonClass={"mt-2 !flex !flex-1 flex-row justify-center !w-full"}
            />
          ) : null}
        </div>

        <ChangeBusinessNameModal
          isOpen={showChangeBusinessNamePopup}
          currentBusinessName={companyName}
          isSaving={isBusinessNameSaving}
          onClose={closeChangeBusinessNamePopup}
          onGoBack={onChangeBusinessNameGoBack}
          onSave={onBusinessNameSave}
        />
      </CustomisedNavigationForm>
    </div>
  );
};

export default BankDetailsForm;
