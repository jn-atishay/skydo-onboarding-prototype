/**
 * Bank Statement Upload Component
 * Created based on the Figma design - Onboarding RSMBLC MF
 */

import React, { useEffect, useState } from "react";
import Typography from "../AtomicComponents/Typography";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES
} from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import classNames from "classnames";
import EllipticalCapsule from "./EllipticalCapsule";
import StrokeTickIconWithCircle from "../Icons/StrokeTickIconWithCircle";
import useAnalytics from "../../analytics/useAnalytics";
import DualDocumentUploader from "./DualDocumentUploader";
import BankStatementFileUploader from "./BankStatementFileUploader";
import ContractFileUploader from "./ContractFileUploader";
import ContractChecklist from "./ContractChecklist";
import CircularLoader from "../UBOPanDetails/CircularLoader";
import DocInputIconPaid from "../Icons/DocInputIconPaid";
import { ExporterDocFileUploaderRef } from "../CompanyPanDetails/ExporterDocFileUploader";
import { BUSSINESS_TYPES, DocTypesOnboarding } from "../../constants/onboarding";
import Locale from "../../util/locale/en";
import RadioButton from "../AtomicComponents/RadioButton";
import FullTick from "../Icons/FullTick";
import useBankStatementAnalyseStore from "../../store/useBankStatementAnalyseStore";
import LoadingFiles from "../Icons/LoadingFiles";
import { Events } from "../../analytics/EventConstants";
import useUserData from "../../store/useUserData";
import { BankAccountStep, DocOptionsType } from "../../types/Onboarding";
import ChangeBankAccountConfirmation from "../BankDetails/ChangeBankAccountConfirmation";
import useBankAccountStore from "../../store/useBankAccountStore";
import useToastMessages from "../../store/toastMessages";

export type UploadingState = 'FIRST' | 'VERIFYING' | 'ERROR' | 'UPLOADING' | 'UPLOADED' | 'VERIFIED';

export type VerifyingErrorState = 'STATEMENT_NOT_FOUND' | 'INTERNAL_ERROR' | 'ACCOUNT_NUMBER_MISMATCH' | 'SUCCESS' | 'DATE_NOT_PRESENT' | 'DATE_NOT_IN_RANGE' | 'NO_INTERNATIONAL_TRANSACTIONS' | 'NOT_VALID_DOCUMENT';

interface BankStatementUploadProps {
  accountNumber: string;
  onFileSelect?: (file: File) => void;
  validationRequirements?: string[];
  docTypeOptions1?: DocOptionsType[];
  docTypeOptions2?: DocOptionsType[];
  exporterData?: { [key: string]: any };
  exporterIec?: {
    ieCode: string;
    verifiedBy: string;
  };
  refetchData?: () => void;
  isExtraDocRequired?: () => boolean;
  isIecVerificationRequired?: boolean;
  docInput1Ref: React.RefObject<ExporterDocFileUploaderRef>;
  setFileUploaded1: (fileUploaded: boolean) => void;
  setFileUploaded2: (fileUploaded: boolean) => void;
  setDocType1: (docType: string) => void;
  setDocType2: (docType: string) => void;
  docType1: string;
  docType2: string;
  showSubmitButton: boolean;
  businessType: string;
  isConfirmButtonLoading: boolean;
  onConfirmClick: () => void;
  renderFooter: () => React.ReactNode;
}

const BankStatementUpload: React.FC<BankStatementUploadProps> = ({ 
  accountNumber, 
  validationRequirements = [
    Locale.validBankStatement,
    Locale.containForeignPayments,
    Locale.statementLastThreeMonths
  ],
  docTypeOptions1 = [],
  docTypeOptions2 = [],
  exporterData,
  exporterIec,
  refetchData = () => {},
  isExtraDocRequired = () => true,
  isIecVerificationRequired = false,
  docInput1Ref,
  setFileUploaded1,
  setFileUploaded2,
  setDocType1,
  setDocType2,
  docType1,
  docType2,
  showSubmitButton,
  businessType,
  isConfirmButtonLoading,
  onConfirmClick,
  renderFooter,
}) => {
  const analytics = useAnalytics();
  const {
    uploadingState,
    verifyingErrorState,
    setUploadingState,
    setVerifyingErrorState,
    selectedOption,
    setSelectedOption,
    isContractRecommended,
    verificationFailedSource,
    setVerificationFailedSource,
    docsUploaded,
  } = useBankStatementAnalyseStore();
  const isContractFileUploaded = docsUploaded.includes(DocTypesOnboarding.CONTRACT_AGREEMENT);
  const {setAccountNumb,setIsFormEditable,setIfscCode} = useBankAccountStore()
  const {addToast} = useToastMessages()

  const { setUserDetails } = useUserData();
  const [showBankAccountChangePopup,setShowBankAccountChangePopup]=useState(false);
  const [isContractUploading, setIsContractUploading] = useState(false);

  useEffect(()=>{
    refetchData();
    analytics.trackAsync(Events.BANK_STATEMENT_UPLOAD_VIEWED, {exporter_id: exporterData?.id});
    analytics.trackAsync(Events.BANK_STATEMENT_SELECTED, {exporter_id: exporterData?.id, selected_option: 'pre-selected'});
  }, []);

  useEffect(()=>{
    if(uploadingState==='ERROR'){

      fireBankStatementErrorEvent()
      
      if(verifyingErrorState==='INTERNAL_ERROR') {
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "bank_statement_error",
          body: Locale.wentWrongMessage,
          time: 3000,
          customClass: '!items-center'
        })
      }
    }
  },[uploadingState])

  useEffect(()=>{
    if(selectedOption === 'recommended'){
      analytics.trackAsync(Events.BANK_STATEMENT_SELECTED, {exporter_id: exporterData?.id, selected_option: 're-selected'});
      if (isContractRecommended) {
        analytics.trackAsync(Events.CONTRACT_UPLOAD_OPTION_SELECTED, {exporter_id: exporterData?.id});
      }
    }
    else if(selectedOption === 'other'){
      analytics.trackAsync(Events.OTHER_DOCUMENT_SELECTED, {exporter_id: exporterData?.id});
      analytics.trackAsync(Events.CHOOSE_OTHER_DOCUMENTS_SELECTED, {exporter_id: exporterData?.id});
    }
  }, [selectedOption]);

  // Contract is a single-document flow; the "other" path removes it from options so docType1 resets clean.
  // Clearing docType2 is required too: a selection abandoned on the "other" path must not ride along in
  // the confirm payload — the backend treats active doc types as business-type evidence (ESB-115).
  // fileUploaded1 must be re-derived from the real kycDocList here as well — otherwise a genuine upload
  // made earlier under a different docType stays flagged as uploaded after switching back to this tab,
  // even though no contract was ever provided.
  useEffect(() => {
    if (!isContractRecommended) return;
    if (selectedOption === 'recommended') {
      setDocType1(DocTypesOnboarding.CONTRACT_AGREEMENT);
      setDocType2("");
      setFileUploaded2(true);
      const hasUploadedContract = (exporterData?.exporterKyc?.kycDocList ?? []).some(
        (doc: { docType?: string; preSignedUrl?: string }) =>
          doc.docType === DocTypesOnboarding.CONTRACT_AGREEMENT && !!doc.preSignedUrl
      );
      setFileUploaded1(hasUploadedContract);
    } else {
      setDocType1("");
    }
  }, [isContractRecommended, selectedOption]);

  const otherDocTypeOptions1 = isContractRecommended
    ? docTypeOptions1.filter(
        (option) =>
          option.value !== DocTypesOnboarding.CONTRACT_AGREEMENT &&
          option.value !== DocTypesOnboarding.BANK_STATEMENT
      )
    : docTypeOptions1;
  const otherDocTypeOptions2 = isContractRecommended
    ? docTypeOptions2.filter(
        (option) =>
          option.value !== DocTypesOnboarding.CONTRACT_AGREEMENT &&
          option.value !== DocTypesOnboarding.BANK_STATEMENT
      )
    : docTypeOptions2;

  const openBankAccountChangePopup = (source: string) => {
    analytics.trackAsync(Events.CHANGE_BANK_ACCOUNT_POPUP_OPENED, {
      exporter_id: exporterData?.id,
      source: source
    });
    setShowBankAccountChangePopup(true);
  };
  const closeBankAccountChangePopup = () => {
    analytics.trackAsync(Events.CHANGE_BANK_ACCOUNT_POPUP_CLOSED, { exporter_id: exporterData?.id });
    setShowBankAccountChangePopup(false);
  }

  const goBackClicked = ()=>{
    analytics.trackAsync(Events.CHANGE_BANK_ACCOUNT_GO_BACK_PRESSED, {exporter_id: exporterData?.id});
    closeBankAccountChangePopup()
  }

  const changeBankAccount = ()=>{
    analytics.trackAsync(Events.CHANGE_BANK_ACCOUNT_CLICKED, {exporter_id: exporterData?.id});
    setUploadingState("FIRST");
    setAccountNumb("");
    setIfscCode("");
    setIsFormEditable(true);
    setUserDetails({
      bankAccountStep: BankAccountStep.CHANGE_BANK_ACCOUNT,
    });
  }


  const accountChangeCta = (source: string) => {
    return (
      <div className={"flex flex-col md:flex-row items-center md:items-start gap-1"}>
        <Typography
          text={Locale.haveInternationalTransactions}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={400}
          textClasses={"!text-black-500"}
        />
        <Typography
          text={Locale.changeBankAccountDetails}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={400}
          textClasses={"!text-blue-400 cursor-pointer"}
          onTextClick={() => {
            //TODO : Add an event here to check how many people are wanting to change bank account.
            openBankAccountChangePopup(source);
          }}
        />
      </div>
    )
  }

  const renderVerifyingState = () => {
    analytics.trackAsync(Events.BANK_STATEMENT_ANALYSIS_INITIATED);
    return (
      <div className="flex flex-col justify-center items-center gap-6 bg-black-50 w-full py-16 px-6 rounded-10px">
        <div className="flex flex-col items-center gap-6">
          <Typography
            text={Locale.pleaseWaitVerification}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight="bold"
            textClasses="text-center text-black-700"
          />
          
          <div className="w-[362px] h-[135px] flex items-center justify-center bg-black-50">
            <LoadingFiles />
          </div>

          <div className="flex flex-col gap-2 w-[343px] items-center">
            <div className="flex items-center gap-2">
              <CircularLoader />
              <Typography
                text={Locale.scanningBankStatement}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVerifiedState = () => {
    analytics.trackAsync(Events.BANK_STATEMENT_ANALYSIS_SUCCESSFUL);
    return (
      <div className="flex flex-col justify-center items-center gap-6 bg-black-50 w-full py-16 px-6 rounded-10px">
        <div className="flex flex-col items-center gap-6">
          <Typography
            text={Locale.verificationSuccess}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight="bold"
            textClasses="text-center text-black-700"
          />
          
          <div className="flex justify-center items-center">
            <DocInputIconPaid />
          </div>

          <div className="flex items-center gap-2">
            <CircularLoader />
            <Typography
              text={Locale.redirectingToDashboard}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses="text-black-500"
            />
          </div>
        </div>
      </div>
    );
  };

  const handleConfirmClick = () => {
    analytics.trackAsync(Events.FREELANCER_CONTRACT_SUBMITTED, { exporter_id: exporterData?.id });
    onConfirmClick();
  };

  const fireBankStatementErrorEvent = ()=>{
    analytics.trackAsync(Events.BANK_STATEMENT_ANALYSIS_FAILED, {error_state: verifyingErrorState,source:verificationFailedSource});
    setVerificationFailedSource(undefined)
  }


  const renderErrorState = () => {
    let icon;
    let errorText;
    let errorSubText;
    let primaryButtonCtaText = Locale.uploadValidBankStatement;
    let secondaryButtonCtaText = Locale.chooseFromOtherDocuments;
    let showChangeAccountCta = false;
    const uploadAnotherBankStatement = () => {
      setUploadingState("FIRST");
    }
    const chooseFromOtherDocuments = () => {
      setUploadingState("FIRST");
      setSelectedOption("other");
      analytics.trackAsync("other_document_selected", {
        exporter_id: exporterData?.id,
        location: "error_state",
      });
    }
    let primaryCtaAction = uploadAnotherBankStatement;
    let secondaryCtaAction = chooseFromOtherDocuments;

    
    if(verifyingErrorState === 'STATEMENT_NOT_FOUND' || verifyingErrorState === 'NOT_VALID_DOCUMENT') {
      icon = <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center"><span className="text-white text-xl font-bold">!</span></div>;
      errorText = Locale.invalidBankStatement;
      errorSubText = Locale.uploadValidStatement;
      primaryButtonCtaText = Locale.uploadValidBankStatement;
    } else if(verifyingErrorState === 'ACCOUNT_NUMBER_MISMATCH') {
      icon = <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center"><span className="text-white text-xl font-bold">!</span></div>;
      errorText = Locale.accountMismatch;
      errorSubText = Locale.uploadMatchingStatement;
      primaryButtonCtaText = Locale.changeProvidedBankAccountDetails;
      secondaryButtonCtaText = Locale.chooseFromOtherDocuments;
      primaryCtaAction = () => openBankAccountChangePopup("account_mismatch_error");
      secondaryCtaAction = chooseFromOtherDocuments;
    }
    else if(verifyingErrorState === 'NO_INTERNATIONAL_TRANSACTIONS') {
      icon = <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center"><span className="text-white text-xl font-bold">!</span></div>;
      errorText = Locale.noInternationalPayments;
      errorSubText = Locale.uploadStatementWithPayments;
      primaryButtonCtaText = Locale.chooseFromOtherDocuments;
      secondaryButtonCtaText = Locale.uploadAnotherStatement
      showChangeAccountCta = true;
      primaryCtaAction = chooseFromOtherDocuments
      secondaryCtaAction = uploadAnotherBankStatement
    }
    else if(verifyingErrorState === 'DATE_NOT_PRESENT' || verifyingErrorState === 'DATE_NOT_IN_RANGE') {
      icon = <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center"><span className="text-white text-xl font-bold">!</span></div>;
      errorText = Locale.statementNotInRange;
      errorSubText = `${Locale.uploadStatementDateRange} ${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' })} ${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).getFullYear()} to ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' })} ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getFullYear()}`;
      primaryButtonCtaText = Locale.uploadAnotherStatement;
    }

    return (
      <div className={"flex flex-col w-full gap-3"}>
        <div className="flex flex-col justify-center items-center gap-6 bg-black-50 w-full py-16 px-6 rounded-10px">
          <div className="flex flex-col items-center gap-6">
            {/* Error content */}
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="flex flex-col items-center gap-4">
                {/* Warning Icon - Using a simple circular exclamation icon */}
                {icon}

                <div className="flex flex-col items-center gap-2">
                  <Typography
                    text={errorText}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight="bold"
                    textClasses="text-center"
                  />
                  <Typography
                    text={errorSubText}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="text-center text-black-500"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col items-center gap-2 w-full">
                <Button
                  title={primaryButtonCtaText}
                  type={BUTTON_TYPES.PRIMARY}
                  size={BUTTON_SIZES.MEDIUM}
                  onButtonClick={primaryCtaAction}
                />

                {/* Divider with OR */}
                <div className="flex items-center gap-2 w-full my-2">
                  <div className="flex-1 h-px bg-black-400"></div>
                  <Typography
                    text={Locale.or}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses="text-black-500"
                  />
                  <div className="flex-1 h-px bg-black-400"></div>
                </div>

                {/* Choose other documents option */}
                <Button
                  title={secondaryButtonCtaText}
                  type={BUTTON_TYPES.SECONDARY}
                  size={BUTTON_SIZES.MEDIUM}
                  onButtonClick={secondaryCtaAction}
                />
              </div>
            </div>
          </div>
        </div>
        <ChangeBankAccountConfirmation
          isOpen={showBankAccountChangePopup}
          onClose={closeBankAccountChangePopup}
          onGoBack={goBackClicked}
          onConfirm={changeBankAccount}
        />
        {showChangeAccountCta && accountChangeCta(verifyingErrorState)}
      </div>
    );
  };

  switch(uploadingState) {
    
    case 'FIRST':
      break;
    case 'UPLOADING':
      break;
    case 'VERIFYING':
      return renderVerifyingState();
    case 'VERIFIED':
      return renderVerifiedState();
    case 'ERROR':
      if(verifyingErrorState === 'INTERNAL_ERROR'){
        break;
      }else {
        return renderErrorState();
      }
  }

  

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* First Option - Recommended */}
      <div>
        <div className="md:hidden bg-green-400 h-8 flex flex-row justify-center items-center gap-1 !w-full rounded-t-10px">
          <FullTick isSmall={true} bgColor="white" tickColor="green" />
          <Typography text={Locale.recommended} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"!text-white"} />
        </div>
      <div 
        className={classNames(
          "rounded-b-md md:rounded-md border rounded-b-10px p-4 md:p-6 border-black-400",
          { "border-blue-400 bg-black-50": selectedOption === 'recommended' }
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div 
              className="flex gap-2 md:gap-4 items-start cursor-pointer"
              onClick={() => {setSelectedOption('recommended'); setUploadingState('FIRST');}}
            >
              <RadioButton
                checked={selectedOption === 'recommended'} 
                onChange={() => {setSelectedOption('recommended'); setUploadingState('FIRST');}}
                className="mt-1"
                label={() => {return <div className="ml-4 flex flex-col gap-1">
                  {isContractRecommended ? (
                    <>
                      <Typography
                        text={Locale.signedContractTitle}
                        type={TYPOGRAPHY_TYPES.LABEL}
                        size={TYPOGRAPHY_SIZES.MEDIUM}
                        fontWeight={"bold"}
                      />
                      <Typography
                        text={Locale.signedContractExamples}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.SMALL}
                        textClasses={"!text-black-500"}
                      />
                    </>
                  ) : (
                    <>
                      <Typography
                        text={`${Locale.lastThreeMonthsStatement} ${accountNumber}`}
                        type={TYPOGRAPHY_TYPES.LABEL}
                        size={TYPOGRAPHY_SIZES.MEDIUM}
                        fontWeight={"bold"}
                      />
                      <Typography
                        text={Locale.getInternationalAccounts}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.SMALL}
                        textClasses={"!text-black-500 hidden md:block"}
                      />
                      <Typography
                        text={Locale.startReceivingPayments}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.SMALL}
                        textClasses={"!text-black-500 md:hidden"}
                      />
                    </>
                  )}
                </div>}}
                id="recommended"
              />
            </div>
            <div className="hidden md:block">
              <EllipticalCapsule text={Locale.recommended} />
            </div>
          </div>
        

          {selectedOption === 'recommended' && (
            <>
            <div className="border-t border-black-400 w-full mb- md:mb-6" />
            <div className="pl-0 md:pl-10">
              {isContractRecommended ? (
                <>
                  <div className="flex flex-col-reverse md:flex-row md:items-start md:gap-6 gap-4 mb-2">
                    <ContractFileUploader onFileUploaded={setFileUploaded1} onUploadingChange={setIsContractUploading} />
                    {!isContractFileUploaded && !isContractUploading && <ContractChecklist wrapperClass="" />}
                  </div>
                  <Typography
                    text={Locale.contractFileTypeLimit}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="!text-black-500 hidden md:block"
                  />
                  {showSubmitButton && businessType === BUSSINESS_TYPES.FREELANCER ? (
                    <div className="w-full flex justify-end">
                      <Button
                        title={Locale.confirmAndContinue}
                        onButtonClick={handleConfirmClick}
                        isLoading={isConfirmButtonLoading}
                        buttonClass={"hide_for_mob"}
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  {/* Mobile view shows stacked layout */}
                  <div className="flex flex-col-reverse md:flex-row md:gap-6 gap-4 mb-2">
                    <BankStatementFileUploader />
                    { uploadingState === 'FIRST' ?
                      <div className="flex flex-col flex-1 gap-4">
                        <Typography
                          text={Locale.bankStatementChecklist}
                          type={TYPOGRAPHY_TYPES.PARA}
                          size={TYPOGRAPHY_SIZES.SMALL}
                          fontWeight={700}
                          textClasses={"!text-black-700"}
                        />
                        <div className="flex flex-col gap-2">
                          {validationRequirements.map((requirement, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <StrokeTickIconWithCircle />
                              <Typography
                                text={requirement}
                                type={TYPOGRAPHY_TYPES.PARA}
                                size={TYPOGRAPHY_SIZES.SMALL}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      : null}
                  </div>
                  {uploadingState === 'FIRST' ? <Typography
                    text={Locale.pdfMaxSize}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses="!text-black-500 hidden md:block"
                  /> : null}
                </>
              )}
            </div>
            </>
          )}
        </div>
      </div>
      </div>

      {/* Second Option */}
      <div 
        className={classNames(
          "rounded-md border p-4 md:p-6 border-black-400",
          { "border-blue-400 bg-black-50": selectedOption === 'other' }
        )}
      >
        <div className="flex flex-col gap-4">
          <div 
            className="flex gap-2 md:gap-4 items-start cursor-pointer" 
            onClick={() => setSelectedOption('other')}
          >
            <RadioButton
              id="other-option"
              name="document-option"
              checked={selectedOption === 'other'}
              onChange={() => setSelectedOption('other')}
              label={()=>{return <div className="ml-4 flex flex-col gap-1">
                <Typography 
                  text={Locale.chooseFromOtherDocuments}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight={"bold"}
                />
                <Typography 
                  text={Locale.manualVerificationMessage}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="!text-black-500"
                />
              </div>}}
              className="mt-1"
            />
            
          </div>
          
          {selectedOption === 'other' && (
            <>
              <div className="border-t border-black-400 w-full mb-4 md:mb-6" />
              <div className="pl-0 md:pl-10">
                <DualDocumentUploader
                  docTypeOptions1={otherDocTypeOptions1}
                  docTypeOptions2={otherDocTypeOptions2}
                  exporterData={exporterData}
                  exporterIec={exporterIec}
                  refetchData={refetchData}
                  isExtraDocRequired={isExtraDocRequired}
                  docInput1Ref={docInput1Ref}
                  isIecVerificationRequired={isIecVerificationRequired}
                  setFileUploaded1={setFileUploaded1}
                  setFileUploaded2={setFileUploaded2}
                  setDocType1={setDocType1}
                  setDocType2={setDocType2}
                  docType1={docType1}
                  docType2={docType2}
                  isContractFlow={!isContractRecommended && selectedOption === 'other'}
                />
              </div>
              <div className='ml-10'>{renderFooter()}</div>
              {showSubmitButton && businessType === BUSSINESS_TYPES.FREELANCER ? (
                <div className="w-full flex justify-end">
                  <Button
                    title={Locale.confirmAndContinue}
                    onButtonClick={onConfirmClick}
                    isLoading={isConfirmButtonLoading}
                    buttonClass={"hide_for_mob"}
                  />
                </div>
                ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankStatementUpload; 