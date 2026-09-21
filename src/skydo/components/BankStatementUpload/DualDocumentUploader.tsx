import React, { useEffect, useRef } from 'react';
import ExporterDocFileUploader, { ExporterDocFileUploaderRef } from '../CompanyPanDetails/ExporterDocFileUploader';
import useAnalytics from '../../analytics/useAnalytics';
import { Events } from '../../analytics/EventConstants';
import useBankStatementAnalyseStore from '../../store/useBankStatementAnalyseStore';
import Locale from '../../util/locale/en';
import { DocTypesOnboarding } from '../../constants/onboarding';
import ContractChecklist from './ContractChecklist';
import ContractFileUploader from './ContractFileUploader';
import Typography from '../AtomicComponents/Typography';
import Button from '../AtomicComponents/Button';
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from '../../constants/atomicConstants';
import { Option } from '../../types/atomicComponentTypes';
import { DocOptionsType } from '../../types/Onboarding';
import CircleCheckIcon from '../Icons/CircleCheckIcon';

interface DualDocumentUploaderProps {
  docTypeOptions1: DocOptionsType[];
  docTypeOptions2: DocOptionsType[];
  exporterData?: { [key: string]: any };
  exporterIec?: {
    ieCode: string;
    verifiedBy: string;
  };
  refetchData?: () => void;
  isExtraDocRequired: () => boolean;
  docInput1Ref: React.RefObject<ExporterDocFileUploaderRef>;
  docInput2Ref?: React.RefObject<ExporterDocFileUploaderRef>;
  isIecVerificationRequired: boolean;
  setFileUploaded1: (fileUploaded: boolean) => void;
  setFileUploaded2: (fileUploaded: boolean) => void;
  setDocType1: (docType: string) => void;
  setDocType2: (docType: string) => void;
  docType1: string;
  docType2: string;
  isContractFlow?: boolean;
  /** A signed declaration is standing in for document 2, so no second file is expected. */
  isDeclarationForDocTwo?: boolean;
  /** Lets the user take the second slot back and upload a real document instead. */
  onReplaceDeclarationWithDoc?: () => void;
}

const renderContractRecommendedTag = (option: Option) =>
  option.value === DocTypesOnboarding.CONTRACT_AGREEMENT ? (
    <div className="flex shrink-0 items-center border border-black-500 rounded-sm bg-white px-1 py-0.5">
      <Typography
        text={Locale.recommended}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.X_X_SMALL}
        textClasses={"!text-black-500 uppercase whitespace-nowrap"}
      />
    </div>
  ) : (
    <></>
  );

/**
 * The parent drives docType on its own too — clearing a pair that stopped being compatible, a
 * declaration taking over slot 2, Udyam OCR resetting both slots — and none of those route through
 * onFileUploaded. Without this the counted entry outlives the document the user had selected and
 * inflates docs_uploaded on ONBOARDING_COMPLETE.
 */
const syncDocUploadedWithSlot = (lastAddedDoc: React.MutableRefObject<string | null>, docType: string) => {
  if (!lastAddedDoc.current || lastAddedDoc.current === docType) return;
  useBankStatementAnalyseStore.getState().removeDocUploaded(lastAddedDoc.current);
  lastAddedDoc.current = null;
};

const moveContractToTop = (options: DocOptionsType[]) => {
  const index = options.findIndex((option) => option.value === DocTypesOnboarding.CONTRACT_AGREEMENT);
  if (index <= 0) return options;
  const reordered = [...options];
  const [contractOption] = reordered.splice(index, 1);
  return [contractOption, ...reordered];
};

const DualDocumentUploader: React.FC<DualDocumentUploaderProps> = ({
  docTypeOptions1,
  docTypeOptions2,
  exporterData,
  exporterIec,
  refetchData = () => {},
  isExtraDocRequired,
  docInput1Ref,
  docInput2Ref,
  isIecVerificationRequired,
  setFileUploaded1,
  setFileUploaded2,
  setDocType1,
  setDocType2,
  docType1,
  docType2,
  isContractFlow = false,
  isDeclarationForDocTwo = false,
  onReplaceDeclarationWithDoc,
}) => {
  const analytics = useAnalytics();

  const isContractSelected = isContractFlow && docType1 === DocTypesOnboarding.CONTRACT_AGREEMENT;
  const docTypeOptions1Ordered = isContractFlow ? moveContractToTop(docTypeOptions1) : docTypeOptions1;

  // Pre-select Contract once on entering the contract flow, overriding the parent's generic
  // default. Applied a single time so a later manual dropdown change is not reverted.
  const contractDefaultApplied = useRef(false);
  useEffect(() => {
    if (!isContractFlow) {
      contractDefaultApplied.current = false;
      return;
    }
    const hasContractOption = docTypeOptions1.some(
      (option) => option.value === DocTypesOnboarding.CONTRACT_AGREEMENT
    );
    if (!contractDefaultApplied.current && hasContractOption) {
      contractDefaultApplied.current = true;
      setDocType1(DocTypesOnboarding.CONTRACT_AGREEMENT);
    }
  }, [isContractFlow, docTypeOptions1, setDocType1]);

  // Contract needs a single document, so the second-document gate must not block submission.
  useEffect(() => {
    if (isContractSelected) {
      setFileUploaded2(true);
    } else {
      setFileUploaded2(false);
    }
  }, [isContractSelected, setFileUploaded2]);

  // Track the docType last counted in docsUploaded per slot so switching docType (or removing the
  // file) drops the stale entry instead of leaving it to overcount docs_uploaded on ONBOARDING_COMPLETE.
  const lastAddedDoc1 = useRef<string | null>(null);
  const lastAddedDoc2 = useRef<string | null>(null);

  useEffect(() => {
    syncDocUploadedWithSlot(lastAddedDoc1, docType1);
  }, [docType1]);

  useEffect(() => {
    syncDocUploadedWithSlot(lastAddedDoc2, docType2);
  }, [docType2]);

  const handleFile1Uploaded = (uploaded: boolean) => {
    const { addDocUploaded, removeDocUploaded } = useBankStatementAnalyseStore.getState();
    if (uploaded && docType1) {
      if (lastAddedDoc1.current && lastAddedDoc1.current !== docType1) {
        removeDocUploaded(lastAddedDoc1.current);
      }
      addDocUploaded(docType1);
      lastAddedDoc1.current = docType1;
    } else if (!uploaded && lastAddedDoc1.current) {
      removeDocUploaded(lastAddedDoc1.current);
      lastAddedDoc1.current = null;
    }
    setFileUploaded1(uploaded);
  };

  const handleFile2Uploaded = (uploaded: boolean) => {
    const { addDocUploaded, removeDocUploaded } = useBankStatementAnalyseStore.getState();
    if (uploaded && docType2) {
      if (lastAddedDoc2.current && lastAddedDoc2.current !== docType2) {
        removeDocUploaded(lastAddedDoc2.current);
      }
      addDocUploaded(docType2);
      lastAddedDoc2.current = docType2;
    } else if (!uploaded && lastAddedDoc2.current) {
      removeDocUploaded(lastAddedDoc2.current);
      lastAddedDoc2.current = null;
    }
    setFileUploaded2(uploaded);
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-between md:space-x-6 space-y-6 md:space-y-0">
      <ExporterDocFileUploader
        docTypeOptions={docTypeOptions1Ordered}
        docType={docType1}
        onFileUploaded={handleFile1Uploaded}
        setDocType={setDocType1}
        exporterData={exporterData}
        isDragNDropEnabled={isContractSelected || !isExtraDocRequired()}
        headerText={!isExtraDocRequired() ? Locale.chooseDocumentType : Locale.chooseDocumentType1}
        onInputClick={() => {
          analytics?.trackAsync(Events.ONBOARDING_DOCS_DROPDOWN_1_CLICKED, { documentType: docType1 });
        }}
        exporterIec={exporterIec}
        refetchData={refetchData}
        ref={docInput1Ref}
        isIecVerificationRequired={isIecVerificationRequired}
        renderOptionTag={isContractFlow ? renderContractRecommendedTag : undefined}
        hideMobileIcon={true}
        renderAboveDocInput={
          isContractSelected ? () => <ContractChecklist wrapperClass="md:hidden" /> : undefined
        }
        renderUploadArea={
          isContractSelected ? () => <ContractFileUploader onFileUploaded={handleFile1Uploaded} /> : undefined
        }
      />
      {isContractSelected ? (
        <ContractChecklist wrapperClass="md:pt-20 hidden md:flex" />
      ) : (
        <>
          <hr className="border-black-400 w-full hide_for_desktop" />
          {isExtraDocRequired() && isDeclarationForDocTwo && (
            <div className={"flex flex-col space-y-3"}>
              <Typography
                text={Locale.chooseDocumentType2}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
              />
              <div
                className={"flex flex-row space-x-3 items-start border border-black-300 rounded-10px p-4 bg-black-50"}
              >
                <CircleCheckIcon />
                <div className={"flex flex-col space-y-1"}>
                  <Typography
                    text={Locale.declarationSignedTitle}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                  />
                  <Typography
                    text={Locale.declarationSignedSubText}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-600"}
                  />
                  <Button
                    type={BUTTON_TYPES.TERTIARY}
                    size={BUTTON_SIZES.SMALL}
                    nativeType={"button"}
                    title={Locale.declarationSignedChangeCta}
                    onButtonClick={onReplaceDeclarationWithDoc}
                    buttonClass={
                      "!h-auto !px-0 !py-0 hover:!bg-transparent focus:!bg-transparent hover:underline focus-visible:underline"
                    }
                    textClasses={"!text-blue-400"}
                  />
                </div>
              </div>
            </div>
          )}
          {isExtraDocRequired() && !isDeclarationForDocTwo && (
            <ExporterDocFileUploader
              ref={docInput2Ref}
              docTypeOptions={docTypeOptions2}
              docType={docType2}
              onFileUploaded={handleFile2Uploaded}
              setDocType={setDocType2}
              exporterData={exporterData}
              isDragNDropEnabled={false}
              headerText={Locale.chooseDocumentType2}
              onInputClick={() => {
                analytics?.trackAsync(Events.ONBOARDING_DOCS_DROPDOWN_2_CLICKED, { documentType: docType2 });
              }}
              exporterIec={exporterIec}
              refetchData={refetchData}
              hideMobileIcon={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DualDocumentUploader;
