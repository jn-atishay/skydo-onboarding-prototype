import CurrStateTitle from "../Common/CurrStateTitle";
import Locale from "../../util/locale/en";
import {
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import beCall from "../../util/beCall";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import BE_ROUTES from "../../util/beRoutes";
import { logApiFailureToSentry } from "../../util/sentryLogger";
import useToastMessages from "../../store/toastMessages";
import Button from "../AtomicComponents/Button";
import { ResponseWrapper } from "../../authentication/api/AuthApiDto";
import ExporterDocFileUploader, { ExporterDocFileUploaderRef } from "./ExporterDocFileUploader";
import IECInput from "./IECInput";
import { getGstDetails } from "../../util/functions";
import {
  BUSSINESS_TYPES,
  DECLARATION_ELIGIBLE_DOC_TYPES,
  DOC_REQUIRED_BUSINESSES,
  DocCombinationsNotAllowed,
  DocTypesOnboarding,
  SOLE_PROP_DOCS_TO_REMOVE,
  INDIVIDUAL_BUSINESSES,
  INDUSTRY_TYPES
} from "../../constants/onboarding";
import Typography from "../AtomicComponents/Typography";
import AppContext from "../../context/AppContext";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import DeclarationPopupContainer from "../../containers/DeclarationPopupContainer";
import useDeclarationStore from "../../store/useDeclarationStore";
import InfoIcon from "../AtomicComponents/ToastMessages/InfoIcon";
import FileIcon from "../Icons/FileIcon";
import { TestimonialTrustMarkerMobile } from "../TrustMarker/TestimonialTrustMarker";
import { TrustMarkerMobile } from "../TrustMarker";
import useUdyamOcrStore from "../../store/useUdyamOcrStore";
import { TaskStatus } from "../../types/UdyamOcr";
import UdyamOcrPopup from "../UdyamOcr/UdyamOcrPopup";
import useOnboardingStore from "../../store/useOnboardingStore";
import useUserData from "../../store/useUserData";
import BankStatementUpload from "../BankStatementUpload";
import DualDocumentUploader from "../BankStatementUpload/DualDocumentUploader";
import useBankStatementAnalyseStore from "../../store/useBankStatementAnalyseStore";
import IecActivatePopup from "../../containers/IecActivatePopup";
import IecErrorNote from "../../containers/IecErrorNote";
import DocUploadHelpPopup from "../../containers/DocUploadHelpPopup";
import ShieldLineIcon from "../Icons/ShieldLineIcon";
import { DeclarationSource, DocOptionRow, DocOptionsType, DocTypeMasterEntry } from "../../types/Onboarding";
import { isBusinessTypeCompatible } from "../DocUpload/utils";
import RadioButton from "../AtomicComponents/RadioButton";
import classNames from "classnames";
import CsbShippingInfoPopup from "./CsbShippingInfoPopup";
import CircularLoader from "../UBOPanDetails/CircularLoader";

/**
 * 1. sole prop without GST
 *    a. 2 docs
 *    b. Let us know
 * 2. sole prop with GST
 *    a. 1 doc
 *    b. sign declaration
 * 3. freelancer
 *    a. 2 docs
 *    b. Let us know
 */

const EMPTY_KYC_DOC_LIST: { docType?: string; preSignedUrl?: string }[] = [];

/** Backend `ShippingMethod` enum for `MARK_EXPORTER_DOCS_ACTIVE` (values: CSB4, CSB5, I_AM_NOT_SURE) */
const AMAZON_SHIPPING_I_AM_NOT_SURE = "I_AM_NOT_SURE";

const ExporterDocInput = ({
  exporterData,
  docTypeMasterList,
  refetchData,
}: {
  exporterData?: { [key: string]: any };
  /**
   * Must be referentially stable across renders. The option lists derived from it drive the effects
   * that clear doc selections and upload flags, so a new array identity on every parent render would
   * re-run those resets and can discard a selection the user just made.
   */
  docTypeMasterList: DocTypeMasterEntry[];
  refetchData: () => void | Promise<unknown>;
}) => {
  const docInput1Ref = useRef<ExporterDocFileUploaderRef>(null);
  const docInput2Ref = useRef<ExporterDocFileUploaderRef>(null);
  const { addToast } = useToastMessages();
  const { setIsPopupVisible } = useDeclarationStore();
  const { amazonExporter: amazonExporterFromUserData } = useUserData();
  const exporterIec = exporterData?.exporterKyc?.iecDetails;
  const bankAccountNumber = exporterData?.bankAccount?.accountNumber;
  const isAmazonExporter = exporterData?.isAmazonUser ?? amazonExporterFromUserData;
  const { status: udyamOcrStatus } = useUdyamOcrStore();
  const [isConfirmButtonLoading, setConfirmButtonLoading] = useState(false);
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const compRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useContext(AppContext);
  const isIecVerifiedWithPan = exporterIec?.ieCode && exporterIec?.verifiedBy === "SKYDO";
  /** Same as IECInput `isVerified`: IEC present on exporter (any `verifiedBy`), not only Skydo-PAN */
  const hasExporterIecOnFile = !!exporterIec?.ieCode;
  const selectedIndustryType = exporterData?.selectedExporterIndustry?.industryType;
  const isIecVerificationRequired =
    (selectedIndustryType === INDUSTRY_TYPES.GOODS_EXPORT || selectedIndustryType === INDUSTRY_TYPES.E_COMMERCE) &&
    !isIecVerifiedWithPan;
  const { primaryGstId } = getGstDetails(exporterData?.gstList);
  const businessType = exporterData?.businessType;
  const analytics = useAnalytics();
  const [letUsKnowDisabled, setLetUsKnowDisabled] = useState(false);

  const isAmazonExporterAndSolePropOrFreelancer =
    (isAmazonExporter) &&
    (businessType === BUSSINESS_TYPES.PROPRIETORSHIP || businessType === BUSSINESS_TYPES.FREELANCER);

  const hasGstFetched =
    !!primaryGstId || (exporterData?.gstList?.length ?? 0) > 0;
  /**
   * Amazon sole prop only (not freelancer): GST on file + IEC Skydo-verified → auto-complete shipping/doc UI.
   * Requires `isAmazonExporterAndSolePropOrFreelancer` to be sole prop branch; freelancers always use manual flow.
   */
  const skipAmazonSolePropEligible =
    !!isAmazonExporter &&
    businessType === BUSSINESS_TYPES.PROPRIETORSHIP &&
    hasGstFetched &&
    isIecVerifiedWithPan;

  const [amazonSkipUiDismissed, setAmazonSkipUiDismissed] = useState(false);
  const skipAmazonSolePropDocUploadStep =
    skipAmazonSolePropEligible && !amazonSkipUiDismissed;

  const autoOnboardedAmazonSolePropRef = useRef(false);

  const [shippingMethod, setShippingMethod] = useState<string | null>(null);
  const [csbShippingInfoOpen, setCsbShippingInfoOpen] = useState(false);
  const openCsbShippingInfoPopup = () => {
    analytics?.trackAsync(Events.ONBOARDING_DOCS_CSB_SHIPPING_HELP_CLICKED);
    setCsbShippingInfoOpen(true);
  };
  const [iecInputValue, setIecInputValue] = useState<string>("");

  const { verifyBankStatement, isVerifying, uploadingState, selectedOption, isContractRecommended } = useBankStatementAnalyseStore();

  const selectedDocs = exporterData?.exporterKyc?.kycDocList ?? EMPTY_KYC_DOC_LIST;

  /**
   * A doc slot is satisfied only when a real file exists (preSignedUrl present) or, for IEC, a
   * self-declared IEC is on file. A docType string on its own — auto-selected (e.g. IEC for
   * e-commerce/goods-export, or a single mandatory deed) or restored from a prior selection — must
   * NOT mark the slot as uploaded; otherwise the submit button enables with zero documents provided.
   */
  const isDocProvided = (docType: string) => {
    if (!docType) return false;
    const hasUploadedFile = selectedDocs.some(
      (doc: { docType?: string; preSignedUrl?: string }) => doc.docType === docType && !!doc.preSignedUrl
    );
    const hasVerifiedIec =
      docType === DocTypesOnboarding.IEC_CERTIFICATE &&
      !!exporterIec?.ieCode &&
      exporterIec?.verifiedBy === "EXPORTER";
    return hasUploadedFile || hasVerifiedIec;
  };

  // Memoised so the effects below can depend on it: they now clear selections and upload flags, so
  // a list that changed identity every render would re-run those destructive resets on every pass.
  const businessDocTypeList: DocOptionRow[] = useMemo(() => {
    // Freelancers are additionally offered every sole-prop doc, which is what makes the
    // business-type compatibility check below meaningful for them and inert for everyone else.
    const allowedDocBusinessTypes =
      businessType === BUSSINESS_TYPES.FREELANCER ? [...INDIVIDUAL_BUSINESSES] : [businessType];

    const filteredDocs = docTypeMasterList
      .filter(({ docType }) => !(INDIVIDUAL_BUSINESSES.includes(businessType) && SOLE_PROP_DOCS_TO_REMOVE.includes(docType)))
      .map((docTypeDescription) => ({
        label: docTypeDescription.docName,
        subText:
          isAmazonExporterAndSolePropOrFreelancer &&
          docTypeDescription.docType === DocTypesOnboarding.PLATFORM_SCREENSHOT
            ? Locale.amazonSellerCentralPlatformScreenshotDescription
            : docTypeDescription.description || "",
        value: docTypeDescription.docType,
        businessType: docTypeDescription.businessType,
        isMandatory: docTypeDescription.isMandatory,
      }))
      .filter(
        (doc) =>
          allowedDocBusinessTypes.includes(doc.businessType) &&
          (isIecVerifiedWithPan ? doc.value !== DocTypesOnboarding.IEC_CERTIFICATE : true)
      );

    // Collected before the dedupe below, which keeps a single row per docType and would otherwise
    // discard the fact that a doc like IEC is offered to both Freelancers and Sole Props.
    const businessTypesByDoc = new Map<string, string[]>();
    filteredDocs.forEach((doc) => {
      const existing = businessTypesByDoc.get(doc.value) ?? [];
      if (!existing.includes(doc.businessType)) {
        businessTypesByDoc.set(doc.value, [...existing, doc.businessType]);
      }
    });

    const docByValue = new Map<string, DocOptionRow>();
    filteredDocs.forEach((doc) => {
      const isOwnBusinessTypeRow = doc.businessType === businessType;
      if (!docByValue.has(doc.value) || isOwnBusinessTypeRow) {
        docByValue.set(doc.value, isOwnBusinessTypeRow ? doc : { ...doc, isMandatory: false });
      }
    });

    return Array.from(docByValue.values()).map((doc) => ({
      ...doc,
      compatibleBusinessTypes: businessTypesByDoc.get(doc.value ?? "") ?? [],
    }));
  }, [docTypeMasterList, businessType, isIecVerifiedWithPan, isAmazonExporterAndSolePropOrFreelancer]);

  const [docType1, setDocType1] = useState("");
  const [docType2, setDocType2] = useState("");

  const [fileUploaded1, setFileUploaded1] = useState(false);
  const [fileUploaded2, setFileUploaded2] = useState(false);

  /**
   * A signed declaration standing in for document 2. Kept separate from `fileUploaded2` because the
   * doc-2 uploader resets that flag whenever `docType` changes, which would revoke the declaration
   * the moment it clears the selection.
   */
  const [isDeclarationForDocTwo, setIsDeclarationForDocTwo] = useState(false);
  const declarationSourceRef = useRef<DeclarationSource>("DOC_ONE");

  const [docTypeOptions1, setDocTypeOptions1] = useState<DocOptionsType[]>([]);
  const [docTypeOptions2, setDocTypeOptions2] = useState<DocOptionsType[]>([]);

  useEffect(() => {
    if (letUsKnowDisabled) {
      setTimeout(() => {
        setLetUsKnowDisabled(false);
      }, 2000);
    }
  }, [letUsKnowDisabled]);

  useEffect(() => {
    let docTypeOneToSet = selectedDocs.length > 0 ? selectedDocs[0].docType : "";
    let docTypeTwoToSet = selectedDocs.length > 1 ? selectedDocs[1].docType : "";
    if (isIecVerificationRequired) {
      let optionsOneToSet = businessDocTypeList.filter(
        (docType) => docType.value === DocTypesOnboarding.IEC_CERTIFICATE
      );
      setDocTypeOptions1(optionsOneToSet);
      if (optionsOneToSet.length == 1) {
        docTypeOneToSet = optionsOneToSet[0].value;
      }
      setDocType1(docTypeOneToSet);

    } else {
      let optionsOneToSet: DocOptionsType[] = businessDocTypeList.filter(
        (docTypeOption) => docTypeOption.value !== docTypeTwoToSet && docTypeOption.isMandatory
      );
      if (optionsOneToSet.length == 0) {
        optionsOneToSet = businessDocTypeList.filter((docTypeOption) => docTypeOption.value !== docTypeTwoToSet);
      }
      if (showSignDecOption()) optionsOneToSet = [...optionsOneToSet, buildSignDeclarationOption("DOC_ONE")];
      if (optionsOneToSet.length == 1) {
        docTypeOneToSet = optionsOneToSet[0].value ?? "";
      }
      setDocTypeOptions1(optionsOneToSet);
      setDocType1(docTypeOneToSet);
    }

    const optionsTwoToSet = businessDocTypeList.filter((docTypeOption) => docTypeOption.value !== docTypeOneToSet);

    setDocTypeOptions2(optionsTwoToSet);
    setDocType2(docTypeTwoToSet);
    setFileUploaded1(isDocProvided(docTypeOneToSet));
    setFileUploaded2(isDocProvided(docTypeTwoToSet));
  }, []);

  useEffect(() => {
    const selectedDocOne = businessDocTypeList.find((docTypeOption) => docTypeOption.value === docType1);
    let optionsTwoToSet: DocOptionsType[] = businessDocTypeList.filter(
      (docTypeOption) => docTypeOption.value !== docType1
    );
    for (const docCombination of DocCombinationsNotAllowed) {
      let number = docCombination.findIndex((val: string) => val == docType1);
      if (number == -1) continue;
      optionsTwoToSet = optionsTwoToSet.filter((docTypeOption) => !docCombination.includes(docTypeOption.value ?? ""));
    }
    optionsTwoToSet = optionsTwoToSet.filter((docTypeOption) =>
      isBusinessTypeCompatible(selectedDocOne, docTypeOption)
    );
    if (isIecVerificationRequired && (businessType == BUSSINESS_TYPES.HUF || businessType == BUSSINESS_TYPES.PARTNERSHIP)) {
      optionsTwoToSet = optionsTwoToSet.filter((docTypeOption) => docTypeOption.value === (businessType == BUSSINESS_TYPES.HUF ? DocTypesOnboarding.HUF_DEED : DocTypesOnboarding.PARTNERSHIP_DEED));
    }

    // Suppressed while a declaration stands in for doc 2 — otherwise a single remaining option
    // would immediately refill the slot the declaration just released.
    const autoSelectedDocTwo =
      optionsTwoToSet.length == 1 && !isDeclarationForDocTwo ? optionsTwoToSet[0].value ?? "" : null;
    if (autoSelectedDocTwo !== null) {
      // Re-derive the upload flag rather than blindly clearing it, so a restored doc that already
      // has a file on record survives the auto-select on mount.
      if (autoSelectedDocTwo !== docType2) {
        setDocType2(autoSelectedDocTwo);
        setFileUploaded2(isDocProvided(autoSelectedDocTwo));
      }
    } else if (docType2 && !optionsTwoToSet.some((docTypeOption) => docTypeOption.value === docType2)) {
      // Doc 2 no longer pairs with doc 1. Left set, it stays invisible in the dropdown yet still
      // rides into the MARK_EXPORTER_DOCS_ACTIVE payload as false business-type evidence.
      // Clearing a slot that had a real file behind it also hides the submit CTA, so say why —
      // otherwise a returning user with a now-invalid stored pair is stuck with no explanation.
      const hadUploadedFile = isDocProvided(docType2);
      setDocType2("");
      setFileUploaded2(false);
      docInput2Ref.current?.resetDropdown("");
      if (hadUploadedFile) {
        addToast({
          type: TOAST_TYPES.INFO,
          id: "doc_pair_no_longer_valid",
          body: Locale.docPairNoLongerValid,
        });
      }
    }

    if (showSignDecOptionForDocTwo(docType1)) {
      optionsTwoToSet = [...optionsTwoToSet, buildSignDeclarationOption("DOC_TWO")];
      if (isDeclarationForDocTwo && docType2) {
        // A real second document was chosen after declaring, so the declaration no longer stands in
        // for it — leaving it set would hold the gate open for a docType2 with no file behind it.
        setIsDeclarationForDocTwo(false);
      }
    } else if (isDeclarationForDocTwo) {
      // Doc 1 is no longer declaration-eligible, so the signed declaration no longer covers the
      // second slot. Without this the submit gate stays open on a one-document submission.
      // Revoking silently would remove the submit CTA with no visible cause, so say why.
      setIsDeclarationForDocTwo(false);
      addToast({
        type: TOAST_TYPES.INFO,
        id: "declaration_no_longer_applies",
        body: Locale.declarationNoLongerApplies,
      });
    }

    setDocTypeOptions2(optionsTwoToSet);
  }, [docType1, docType2, isIecVerificationRequired, businessType, businessDocTypeList, isDeclarationForDocTwo]);

  useEffect(() => {
    if (!isIecVerificationRequired) {
      const selectedDocTwo = businessDocTypeList.find((docTypeOption) => docTypeOption.value === docType2);
      let optionsOneToSet: DocOptionsType[] = businessDocTypeList.filter(
        (docTypeOption) => docTypeOption.value !== docType2 && docTypeOption.isMandatory
      );
      if (optionsOneToSet.length == 0) {
        optionsOneToSet = businessDocTypeList.filter((docTypeOption) => docTypeOption.value !== docType2);
      }
      for (const docCombination of DocCombinationsNotAllowed) {
        let number = docCombination.findIndex((val: string) => val == docType2);
        if (number == -1) continue;
        optionsOneToSet = optionsOneToSet.filter((docTypeOption) => !docCombination.includes(docTypeOption.value ?? ""));
      }
      optionsOneToSet = optionsOneToSet.filter((docTypeOption) =>
        isBusinessTypeCompatible(selectedDocTwo, docTypeOption)
      );
      // Deliberately does not clear docType1. Doc 1 is authoritative: the effect above already
      // filters doc 2's options against it, and clearing here would also wipe a legitimately
      // restored non-mandatory doc 1, since the list above is narrowed to mandatory docs first.
      if (showSignDecOption()) optionsOneToSet = [...optionsOneToSet, buildSignDeclarationOption("DOC_ONE")];
      setDocTypeOptions1(optionsOneToSet);
    }
  }, [docType2, isIecVerificationRequired, businessDocTypeList]);

  const isExtraDocRequired = () => {
    if (businessType == BUSSINESS_TYPES.FREELANCER) return true;
    if(isAmazonExporterAndSolePropOrFreelancer && primaryGstId == undefined) {
      return true;
    }
    if (businessType && !DOC_REQUIRED_BUSINESSES.includes(businessType)) return false;
    // For HUF, Sole Prop, Partnership
    if (businessType == BUSSINESS_TYPES.HUF || businessType == BUSSINESS_TYPES.PARTNERSHIP) {
      if (isIecVerificationRequired) return true;
      return !(primaryGstId || isIecVerifiedWithPan);
    }
    return !(primaryGstId || isIecVerifiedWithPan);
  };

  /**
   * Dropdown-2 declaration, standing in for the second document. Sole prop only, matching
   * `showSignDecOption()` below: the declaration copy is sole-proprietorship legal text. Freelancers
   * are offered Shop & Establishment / Trade License too, so the doc check alone would admit them.
   */
  const showSignDecOptionForDocTwo = (docTypeOne: string) =>
    businessType === BUSSINESS_TYPES.PROPRIETORSHIP && DECLARATION_ELIGIBLE_DOC_TYPES.includes(docTypeOne);

  const showSignDecOption = () => {
    if (
      businessType == BUSSINESS_TYPES.FREELANCER ||
      businessType == BUSSINESS_TYPES.HUF ||
      businessType == BUSSINESS_TYPES.PARTNERSHIP
    )
      return false;
    return primaryGstId;
  };

  useEffect(() => {
    if (compRef && compRef.current) {
      compRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  }, []);

  const onConfirmClickError = () => {
    if (skipAmazonSolePropEligible) {
      setAmazonSkipUiDismissed(true);
      autoOnboardedAmazonSolePropRef.current = false;
    }
    setConfirmButtonLoading(false);
    addToast({
      type: TOAST_TYPES.ERROR,
      id: "company_details_error",
      body: Locale.wentWrongMessage,
    });
  };

  // Built per dropdown rather than shared: the two declarations release different gates, and
  // `onDeclarationAccepted` needs to know which row was clicked to avoid touching the wrong slot.
  const buildSignDeclarationOption = (source: DeclarationSource): DocOptionsType => ({
    label: "",
    businessType: "",
    subText: "",
    value: undefined,
    isMandatory: undefined,
    customRowRenderer: () => {
      return (
        <div
          key={"key"}
          className={
            "bottom-0 bg-white sticky flex flex-col px-4 py-3 hover:bg-blue-50 cursor-pointer border-t-2 border-black-100"
          }
          onClick={() => onSignDeclarationClick(source)}
        >
          <div className={"flex flex-row space-x-3 items-center"}>
            <InfoIcon stroke={"black"} />
            <div className={"flex flex-col space-y-1"}>
              <Typography text={Locale.dontHaveDocs} size={TYPOGRAPHY_SIZES.SMALL} type={TYPOGRAPHY_TYPES.PARA} />
              <Typography
                text={Locale.clickToContinue}
                size={TYPOGRAPHY_SIZES.SMALL}
                type={TYPOGRAPHY_TYPES.LABEL}
                fontWeight={"400"}
                textClasses={"!text-blue-400"}
              />
            </div>
          </div>
        </div>
      );
    },
  });

  const resolveAmazonActiveDocTypeListSnapshot = (
    d1: string,
    d2: string,
    kycDocs: { docType?: string }[],
    docOptions: DocOptionsType[]
  ): string[] => {
    const fromState = (isIecVerificationRequired ? [d1, d2] : [d1]).filter((d) => d !== "");
    if (fromState.length > 0) return fromState;
    const fromKyc = kycDocs.map((d) => d.docType).filter(Boolean) as string[];
    if (!isIecVerificationRequired) {
      if (fromKyc.length > 0) return fromKyc.slice(0, 1);
      const mandatory = docOptions.find((d) => d.isMandatory && d.value);
      if (mandatory?.value) return [mandatory.value];
      const first = docOptions[0];
      return first?.value ? [first.value] : [];
    }
    const iec = fromKyc.find((t) => t === DocTypesOnboarding.IEC_CERTIFICATE);
    const nonIec = fromKyc.filter((t) => t !== DocTypesOnboarding.IEC_CERTIFICATE);
    const pair = [iec, nonIec[0]].filter(Boolean) as string[];
    return pair;
  };

  const resolveAmazonActiveDocTypeListForSubmit = (): string[] =>
    resolveAmazonActiveDocTypeListSnapshot(docType1, docType2, selectedDocs, businessDocTypeList);

  const businessDocTypeListRef = useRef(businessDocTypeList);
  businessDocTypeListRef.current = businessDocTypeList;

  const submitAmazonSolePropFreelancerDocs = async (shippingOverride?: string | null) => {
    setConfirmButtonLoading(true);
    const activeDocList = isAmazonExporterAndSolePropOrFreelancer
      ? resolveAmazonActiveDocTypeListForSubmit()
      : [docType1, docType2].filter((docType) => docType !== "");
    const shippingForRequest: string | undefined = isAmazonExporterAndSolePropOrFreelancer
      ? shippingMethod ?? shippingOverride ?? undefined: undefined;

    if (activeDocList.length === 0) {
      setConfirmButtonLoading(false);
      if (skipAmazonSolePropEligible) {
        setAmazonSkipUiDismissed(true);
        autoOnboardedAmazonSolePropRef.current = false;
      }
      return;
    }

    const markBody = {
      activeDocTypeList: activeDocList,
      ...(shippingForRequest ? { shippingMethod: shippingForRequest } : {}),
    };
    try {
      const markRes = (await beCall({
        path: BE_ROUTES.MARK_EXPORTER_DOCS_ACTIVE,
        method: ALLOWED_METHODS.POST,
        body: markBody,
      })) as ResponseWrapper<unknown>;

      if (!markRes?.success) {
        logApiFailureToSentry("ExporterDocInput.tsx", BE_ROUTES.MARK_EXPORTER_DOCS_ACTIVE, markBody, markRes);
        onConfirmClickError();
        return;
      }

      const confirmBody = businessType ? { businessType } : undefined;
      const confirmRes = (await beCall({
        path: BE_ROUTES.CONFIRM_N_CONTINUE_EXPORTER_KYC_DOC,
        method: ALLOWED_METHODS.POST,
        body: confirmBody,
      })) as ResponseWrapper<boolean>;

      if (confirmRes?.success) {
        analytics?.identifyTraitsAsync({ businessType: businessType });
        refetchUserState();
        try {
          const apolloResult = (await refetchData?.()) as
            | { data?: { exporterUser?: { exporter?: { onBoardingState?: string } } } }
            | undefined;
          const nextOnboardingState = apolloResult?.data?.exporterUser?.exporter?.onBoardingState;
          if (nextOnboardingState) {
            useUserData.getState().setUserDetails({ userState: nextOnboardingState });
          }
        } catch {
          /* refetch failure should not block transition; user state store may still update */
        }
        setConfirmButtonLoading(false);
      } else {
        logApiFailureToSentry("ExporterDocInput.tsx", BE_ROUTES.CONFIRM_N_CONTINUE_EXPORTER_KYC_DOC, confirmBody, confirmRes);
        onConfirmClickError();
      }
    } catch {
      onConfirmClickError();
    }
  };

  const onConfirmClickAmazonSolepropFreelancer = () => {
    void submitAmazonSolePropFreelancerDocs();
  };

  const skipAmazonDocStateRef = useRef({ docType1, docType2, selectedDocs });
  skipAmazonDocStateRef.current = { docType1, docType2, selectedDocs };
  const skipAmazonStepActiveRef = useRef(skipAmazonSolePropDocUploadStep);
  skipAmazonStepActiveRef.current = skipAmazonSolePropDocUploadStep;

  useEffect(() => {
    if (!skipAmazonSolePropDocUploadStep || autoOnboardedAmazonSolePropRef.current) return;

    const tryAutoSubmitFromLatestState = (): boolean => {
      if (!skipAmazonStepActiveRef.current || autoOnboardedAmazonSolePropRef.current) return false;
      const { docType1: d1, docType2: d2, selectedDocs: kyc } = skipAmazonDocStateRef.current;
      const docs = resolveAmazonActiveDocTypeListSnapshot(
        d1,
        d2,
        kyc,
        businessDocTypeListRef.current
      );
      if (docs.length === 0) return false;
      autoOnboardedAmazonSolePropRef.current = true;
      void submitAmazonSolePropFreelancerDocs(AMAZON_SHIPPING_I_AM_NOT_SURE);
      return true;
    };

    if (tryAutoSubmitFromLatestState()) return;

    const timeoutId = window.setTimeout(() => {
      if (tryAutoSubmitFromLatestState()) return;
      if (!skipAmazonStepActiveRef.current || autoOnboardedAmazonSolePropRef.current) return;
      setAmazonSkipUiDismissed(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [
    skipAmazonSolePropDocUploadStep,
    docType1,
    docType2,
    selectedDocs,
    isIecVerificationRequired,
    businessDocTypeList.length,
  ]);

  const onConfirmClick = async () => {
    setConfirmButtonLoading(true);
    const markActiveBody = {
      activeDocTypeList: [docType1, docType2].filter(docType => docType !== "")
    };
    const confirmBody = businessType ? { businessType } : undefined;
    try {
      const markRes = (await beCall({
        path: BE_ROUTES.MARK_EXPORTER_DOCS_ACTIVE,
        method: ALLOWED_METHODS.POST,
        body: markActiveBody,
      })) as ResponseWrapper<unknown>;

      if (!markRes?.success) {
        logApiFailureToSentry("ExporterDocInput.tsx", BE_ROUTES.MARK_EXPORTER_DOCS_ACTIVE, markActiveBody, markRes);
        onConfirmClickError();
        return;
      }

      const confirmRes = (await beCall({
        path: BE_ROUTES.CONFIRM_N_CONTINUE_EXPORTER_KYC_DOC,
        method: ALLOWED_METHODS.POST,
        body: confirmBody,
      })) as ResponseWrapper<boolean>;

      if (confirmRes?.success) {
        analytics?.identifyTraitsAsync({ businessType: businessType });
        refetchUserState();
        setConfirmButtonLoading(false);
      } else {
        logApiFailureToSentry("ExporterDocInput.tsx", BE_ROUTES.CONFIRM_N_CONTINUE_EXPORTER_KYC_DOC, confirmBody, confirmRes);
        onConfirmClickError();
      }
    } catch (error) {
      logApiFailureToSentry("ExporterDocInput.tsx", BE_ROUTES.CONFIRM_N_CONTINUE_EXPORTER_KYC_DOC, confirmBody, error);
      onConfirmClickError();
    }
  };

  async function informTeamAboutDocIssue(fireEvent: boolean = true) {
    if (letUsKnowDisabled) return;
    setLetUsKnowDisabled(true);
    const res = await beCall({
      path: BE_ROUTES.INFORM_TEAM_DOC_ISSUE,
      method: ALLOWED_METHODS.POST,
    });

    if (fireEvent) {
      analytics?.trackAsync(Events.ONBOARDING_DOCS_LETUSKNOW);
    }

    if (res.success) {
      addToast({
        type: TOAST_TYPES.SUCCESS,
        id: "team_will_contact",
        body: "Someone from our team will reach out to you shortly!",
      });
    } else {
      setLetUsKnowDisabled(false);
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "team_will_contact_err",
        body: Locale.wentWrongMessage,
      });
    }
  }

  const onSignDeclarationClick = (source: DeclarationSource) => {
    declarationSourceRef.current = source;
    analytics.trackAsync(Events.SP_SIGN_DECLARATION_CLICKED, { source });
    setIsPopupVisible(true);
  };

  /**
   * Only for the dropdown-2 declaration, where it stands in for the second document. The dropdown-1
   * declaration (GST sole prop) never needs a second doc, so its gate is already open — and acting
   * on it here would silently drop an already-uploaded doc 2 from the submit payload.
   */
  const onDeclarationAccepted = () => {
    if (declarationSourceRef.current !== "DOC_TWO") return;
    if (!showSignDecOptionForDocTwo(docType1)) return;
    setIsDeclarationForDocTwo(true);
    setDocType2("");
    setFileUploaded2(false);
    // Belt-and-braces: clearing docType2 already re-runs the effect above, whose fresh options array
    // makes Dropdown re-derive an empty label. Reset explicitly so the visible label does not depend
    // on that effect's dependency list continuing to include docType2.
    docInput2Ref.current?.resetDropdown("");
  };

  /**
   * Hands the second slot back to the uploader. The declaration stays on record backend-side; it just
   * stops standing in for a document, so the submit gate closes until a real file arrives.
   */
  const onReplaceDeclarationWithDoc = () => {
    setIsDeclarationForDocTwo(false);
  };

  const isIecOptionalForSubmit =
    isAmazonExporterAndSolePropOrFreelancer &&
    (shippingMethod === "CSB4" || businessType === BUSSINESS_TYPES.FREELANCER);
  const amazonShippingMethodSelected = shippingMethod != null;
  const iecColumnApplicableForAmazon =
    isIecVerificationRequired &&
    !(isAmazonExporterAndSolePropOrFreelancer && businessType === BUSSINESS_TYPES.FREELANCER);
  const showSkipOnboardingAmazonCta =
    isAmazonExporterAndSolePropOrFreelancer &&
    !isExtraDocRequired() &&
    iecColumnApplicableForAmazon &&
    !isIecVerifiedWithPan;
  const amazonDocType = isIecVerificationRequired ? docType2 : docType1;
  const isIecEmptyOrVerified =
    !iecInputValue?.trim() || isIecVerifiedWithPan || hasExporterIecOnFile;
  /**
   * Amazon sole prop + goods/e‑commerce: show "Skip…" only while IEC is still outstanding
   * (industry requires IEC and no IEC on exporter yet). After IEC exists or Skydo clears the step,
   * show "Confirm and continue". Do not use `isExtraDocRequired()` — it flips on GST/IEC refetch.
   */
  const isAmazonSolePropGoodsOrEcommerceIndustry =
    isAmazonExporterAndSolePropOrFreelancer &&
    businessType === BUSSINESS_TYPES.PROPRIETORSHIP &&
    (selectedIndustryType === INDUSTRY_TYPES.GOODS_EXPORT || selectedIndustryType === INDUSTRY_TYPES.E_COMMERCE);

  const amazonShowSkipStyleCtaTitle =
    isAmazonSolePropGoodsOrEcommerceIndustry &&
    isIecVerificationRequired &&
    !hasExporterIecOnFile;

  const amazonConfirmCtaTitle = amazonShowSkipStyleCtaTitle
    ? Locale.skipAndCompleteOnboarding
    : Locale.confirmAndContinue;
  const showSubmitButtonForAmazonSolepropFreelancer = isAmazonExporterAndSolePropOrFreelancer
    ? amazonShippingMethodSelected &&
      (!isIecVerificationRequired || hasExporterIecOnFile || isIecOptionalForSubmit) &&
      (isIecOptionalForSubmit ? isIecEmptyOrVerified : true) &&
      (isExtraDocRequired() ? !!amazonDocType && fileUploaded1 : true) &&
      !(
        isExtraDocRequired() &&
        businessType === BUSSINESS_TYPES.PROPRIETORSHIP &&
        [TaskStatus.IN_PROGRESS, TaskStatus.ERROR].includes(udyamOcrStatus) &&
        amazonDocType === DocTypesOnboarding.UDYAM_CERTIFICATE &&
        !isIecOptionalForSubmit
      )
    : fileUploaded1 &&
      (fileUploaded2 || isDeclarationForDocTwo || !isExtraDocRequired()) &&
      !(
        businessType === BUSSINESS_TYPES.PROPRIETORSHIP &&
        [TaskStatus.IN_PROGRESS, TaskStatus.ERROR].includes(udyamOcrStatus) &&
        [docType1, docType2].includes(DocTypesOnboarding.UDYAM_CERTIFICATE)
      );

  const isContractRecommendedFlow = isContractRecommended && selectedOption === 'recommended';

  const showSubmitButton =
      fileUploaded1 &&
      (isContractRecommendedFlow || fileUploaded2 || isDeclarationForDocTwo || !isExtraDocRequired()) &&
      !(
        businessType === BUSSINESS_TYPES.PROPRIETORSHIP &&
        [TaskStatus.IN_PROGRESS, TaskStatus.ERROR].includes(udyamOcrStatus) &&
        [docType1, docType2].includes(DocTypesOnboarding.UDYAM_CERTIFICATE)
      );

  const renderFooter = () => {
    return (
      <>
        <IecErrorNote className={"hidden md:block mt-6"} />
        {isExtraDocRequired() ? (
          <div className={"my-6"}>
            <Typography
              text={"Don't have the listed documents?"}
              size={TYPOGRAPHY_SIZES.SMALL}
              type={TYPOGRAPHY_TYPES.PARA}
            >
              <Typography
                text={"Let us know"}
                size={TYPOGRAPHY_SIZES.SMALL}
                type={TYPOGRAPHY_TYPES.LABEL}
                textClasses={`ml-1 !text-blue-400 cursor-pointer ${letUsKnowDisabled ? "!text-black-400" : ""}`}
                onTextClick={informTeamAboutDocIssue}
              />
            </Typography>
          </div>
        ) : null}
      </>
    );
  };

  const getTitle = () => {
    if (isAmazonExporterAndSolePropOrFreelancer) {
      return "";
    }
    if (!isExtraDocRequired() && businessType == BUSSINESS_TYPES.HUF) {
      return Locale.hufDocUpload;
    }
    if (!isExtraDocRequired() && businessType == BUSSINESS_TYPES.PARTNERSHIP) {
      return Locale.partnershipDocUpload;
    }

    if (businessType == BUSSINESS_TYPES.FREELANCER) {
      return Locale.freelancerDocUpload;
    }

    return Locale.youAreAlmostThere;
  };

  const getSubTitle = () => {
    if (isAmazonExporterAndSolePropOrFreelancer) {
      return "";
    }
    if (INDIVIDUAL_BUSINESSES.includes(businessType)) {
      return "";
    }
    if (businessType == BUSSINESS_TYPES.HUF || businessType == BUSSINESS_TYPES.PARTNERSHIP) {
      return (
        <Typography
          text={businessType == BUSSINESS_TYPES.HUF ? Locale.hufFirstDocLine : Locale.partnershipFirstDocLine}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          fontWeight={"700"}
        >
          {isExtraDocRequired() ? (
            <Typography
              text={Locale.hufAndPartnershipSecondDocLine}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"400"}
            />
          ) : null}
        </Typography>
      );
    }
    return Locale.prop1DocNeededSubTitle;
  };

  const shippingHelpSplit = Locale.selectMethodOfShippingHelp.split("click here");
  const shippingHelpBeforeLink = shippingHelpSplit[0].trimEnd();
  const shippingHelpAfterLink = shippingHelpSplit[1] ?? "";

  return ( isAmazonExporterAndSolePropOrFreelancer ? (
    <div className={"flex-1 flex flex-col px-4 md:px-0 mb-[150px] md:mb-0"} ref={compRef}>
    
      {isAmazonExporterAndSolePropOrFreelancer && skipAmazonSolePropDocUploadStep ? (
        <div
          className={classNames(
            "bg-white rounded-lg flex flex-col items-center justify-center w-full min-h-[240px] py-12 px-4"
          )}
          aria-busy="true"
          aria-live="polite"
        >
          <CircularLoader />
          <Typography
            text={"Completing your verification…"}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses="!text-black-500 mt-4 text-center"
          />
        </div>
      ) : isAmazonExporterAndSolePropOrFreelancer ? (
        <div
          className={classNames(
            "bg-white rounded-lg flex flex-col",
             "w-full"
          )}
        >
          {/* Section 1: Select your method of shipping */}
          <div className="flex flex-row items-start gap-3 mb-6">
            
            <div className="flex flex-col flex-1 min-w-0">
              <Typography
                text={Locale.selectMethodOfShipping}
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                fontWeight="700"
              />
              <Typography
                text={shippingHelpBeforeLink}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses="!text-black-500 mt-1 block break-words"
              >
                <span
                  className="ml-1 !text-blue-400 cursor-pointer underline"
                  onClick={openCsbShippingInfoPopup}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openCsbShippingInfoPopup()}
                >
                  click here
                </span>
                <span>{shippingHelpAfterLink}</span>
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-3 mb-6">
            <RadioButton
              id="shipping-csb4"
              name="shippingMethod"
              label={Locale.shippingOptionCsb4}
              checked={shippingMethod === "CSB4"}
              onBodyClick={() => {
                setShippingMethod("CSB4");
                analytics?.trackAsync(Events.ONBOARDING_DOCS_SHIPPING_METHOD_SELECTED, { shippingMethod: "CSB4" });
              }}
              onChange={() => {
                setShippingMethod("CSB4");
              }}
            />
            <RadioButton
              id="shipping-csb5"
              name="shippingMethod"
              label={Locale.shippingOptionCsb5}
              checked={shippingMethod === "CSB5"}
              onBodyClick={() => {
                setShippingMethod("CSB5");
                analytics?.trackAsync(Events.ONBOARDING_DOCS_SHIPPING_METHOD_SELECTED, { shippingMethod: "CSB5" });
              }}
              onChange={() => {
                setShippingMethod("CSB5");
              }}
            />
            <RadioButton
              id="shipping-not-sure"
              name="shippingMethod"
              label={Locale.shippingOptionNotSure}
              checked={shippingMethod === AMAZON_SHIPPING_I_AM_NOT_SURE}
              onBodyClick={() => {
                setShippingMethod(AMAZON_SHIPPING_I_AM_NOT_SURE);
                analytics?.trackAsync(Events.ONBOARDING_DOCS_SHIPPING_METHOD_SELECTED, {
                  shippingMethod: AMAZON_SHIPPING_I_AM_NOT_SURE,
                });
              }}
              onChange={() => {
                setShippingMethod(AMAZON_SHIPPING_I_AM_NOT_SURE);
              }}
            />
          </div>
          {amazonShippingMethodSelected ? (
            <>
              <div className="h-px bg-gray-200 mb-6" />
              {/* Section 2: You're almost there, share document(s) to verify business activity */}
              {isExtraDocRequired() ? (<>
                <Typography
                  text={Locale.freelancerDocUpload}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight="700"
                />
                <Typography
                  text={Locale.weWillAskDocsAtEnd}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses="mt-1 !text-black-500 mb-6"
                />
              </>) : null}
              <div className="flex w-full flex-col items-start gap-6 md:flex-row md:items-start">
                {isIecVerificationRequired && !(isAmazonExporterAndSolePropOrFreelancer && businessType === BUSSINESS_TYPES.FREELANCER) ? (
                  <div className="w-full min-w-0 md:flex-1">
                    <IECInput
                      exporterIec={exporterIec}
                      refetchData={refetchData}
                      onFileUploaded={() => {}}
                      isOptional={isAmazonExporterAndSolePropOrFreelancer && shippingMethod === "CSB4"}
                      onIecChange={isAmazonExporterAndSolePropOrFreelancer ? setIecInputValue : undefined}
                    />
                  </div>
                ) : null}
                <div className="w-full min-w-0 md:flex-1">
                {isExtraDocRequired() && (<ExporterDocFileUploader
                    docTypeOptions={isIecVerificationRequired ? docTypeOptions2 : docTypeOptions1}
                    docType={isIecVerificationRequired ? docType2 : docType1}
                    onFileUploaded={setFileUploaded1}
                    setDocType={isIecVerificationRequired ? setDocType2 : setDocType1}
                    exporterData={exporterData}
                    isDragNDropEnabled={true}
                    headerText={Locale.chooseDocumentType}
                    showRequiredAsterisk
                    onInputClick={() => {
                      analytics?.trackAsync(Events.ONBOARDING_DOCS_DROPDOWN_1_CLICKED, {
                        documentType: isIecVerificationRequired ? docType2 : docType1,
                      });
                    }}
                    exporterIec={exporterIec}
                    refetchData={refetchData}
                    ref={isIecVerificationRequired ? docInput2Ref : docInput1Ref}
                    isIecVerificationRequired={false}
                    fullWidth={isIecVerificationRequired && !(isAmazonExporterAndSolePropOrFreelancer && businessType === BUSSINESS_TYPES.FREELANCER)}
                    alignWithIecField={isAmazonExporterAndSolePropOrFreelancer}
                  />)}
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
      {showSubmitButtonForAmazonSolepropFreelancer &&
      isAmazonExporterAndSolePropOrFreelancer &&
      !skipAmazonSolePropDocUploadStep ? (
        <Button
          title={amazonConfirmCtaTitle}
          onButtonClick={onConfirmClickAmazonSolepropFreelancer}
          isLoading={isConfirmButtonLoading}
          buttonClass={"mt-6 hide_for_mob"}
        />
      ) : null}
      {isAmazonExporterAndSolePropOrFreelancer &&
        amazonShippingMethodSelected &&
        !skipAmazonSolePropDocUploadStep &&
        renderFooter()}
      <DeclarationPopupContainer businessType={businessType} onDeclarationAccepted={onDeclarationAccepted} />
      <div className={"hide_for_desktop mt-8"}>
        <TestimonialTrustMarkerMobile />
      </div>
      {isAmazonExporterAndSolePropOrFreelancer ? (
        skipAmazonSolePropDocUploadStep ? null : (
        <div
          className={
            "hide_for_desktop flex flex-row flex-1 fixed bottom-0 right-0 left-0 px-4 pt-4 bg-white shadow-elevation1"
          }
        >
          <TrustMarkerMobile />
          <Button
            isDisabled={!showSubmitButtonForAmazonSolepropFreelancer}
            title={amazonConfirmCtaTitle}
            onButtonClick={onConfirmClickAmazonSolepropFreelancer}
            isLoading={isConfirmButtonLoading}
            buttonClass={"mb-4 !w-full flex flex-row flex-1 justify-center"}
          />
        </div>
        )
      ) : (
        <div
          className={
            "hide_for_desktop flex flex-row flex-1 fixed bottom-0 right-0 left-0 px-4 pt-4 bg-white shadow-elevation1"
          }
        >
          <TrustMarkerMobile />
          <Button
            isDisabled={selectedOption === 'recommended' && !isContractRecommended ? uploadingState !== 'UPLOADED' : !showSubmitButton}
            title={selectedOption === 'other' ? Locale.confirmAndContinue : Locale.veryfyAndContinue}
            onButtonClick={() => {
              if (selectedOption === 'recommended' && !isContractRecommended) {
                verifyBankStatement();
              } else {
                onConfirmClick();
              }
            }}
            isLoading={isVerifying}
            buttonClass={"mb-4 !w-full flex flex-row flex-1 justify-center"}
          />
        </div>
      )}
      <UdyamOcrPopup
        businessLegalName={exporterData?.businessLegalName}
        onUploadAnotherDoc={() => {
          if (docType1 === DocTypesOnboarding.UDYAM_CERTIFICATE) {
            docInput1Ref.current && docInput1Ref.current.resetDropdown("");
            setDocType1("");
            setFileUploaded1(false);
          } else if (docType2 === DocTypesOnboarding.UDYAM_CERTIFICATE) {
            docInput2Ref.current && docInput2Ref.current.resetDropdown("");
            setDocType2("");
            setFileUploaded2(false);
          }
        }}
      />
      <IecActivatePopup />
      <DocUploadHelpPopup informTeam={informTeamAboutDocIssue} />
      <CsbShippingInfoPopup open={csbShippingInfoOpen} onClose={() => setCsbShippingInfoOpen(false)} />
    </div>
  ) : (
    <div className={"flex-1 flex flex-col px-4 md:px-0 mb-[150px] md:mb-0"} ref={compRef}>
      <CurrStateTitle
        title={getTitle()}
        subTitle={getSubTitle()}
        icon={() => <FileIcon width={24} height={24} stroke={theme.hexColors.white} />}
      />
      {businessType == BUSSINESS_TYPES.PROPRIETORSHIP ? (
        <div className={"flex flex-row items-center gap-1 -mt-4 mb-6"}>
          <ShieldLineIcon height={24} width={24} stroke={"#8898AA"} className={"shrink-0"} />
          <Typography
            text={Locale.uploadDocsNote}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
      ) : null}
      <div className={"flex flex-1 flex-col"}>
        {/* this below div is for uploading the documents so we can use this for freelancers */}
        {businessType == BUSSINESS_TYPES.FREELANCER ? (
          <div className={"flex flex-1 flex-col md:flex-row items-start justify-between md:space-x-6 space-y-6 md:space-y-0"}>
            <BankStatementUpload
              accountNumber={`XX${bankAccountNumber.slice(-4)}`}
              docTypeOptions1={docTypeOptions1}
              docTypeOptions2={docTypeOptions2}
              isExtraDocRequired={isExtraDocRequired}
              docInput1Ref={docInput1Ref}
              exporterData={exporterData}
              isIecVerificationRequired={isIecVerificationRequired}
              setFileUploaded1={setFileUploaded1}
              setFileUploaded2={setFileUploaded2}
              setDocType1={setDocType1}
              setDocType2={setDocType2}
              docType1={docType1}
              docType2={docType2}
              showSubmitButton={showSubmitButton}
              businessType={businessType}
              isConfirmButtonLoading={isConfirmButtonLoading}
              onConfirmClick={onConfirmClick}
              renderFooter={renderFooter}
              refetchData={refetchData}
              exporterIec={exporterIec}
            />
          </div>
        ) : (
          <DualDocumentUploader 
            docTypeOptions1={docTypeOptions1}
            docTypeOptions2={docTypeOptions2}
            isExtraDocRequired={isExtraDocRequired}
            docInput1Ref={docInput1Ref}
            docInput2Ref={docInput2Ref}
            isIecVerificationRequired={isIecVerificationRequired}
            refetchData={refetchData}
            exporterData={exporterData}
            exporterIec={exporterIec}
            setFileUploaded1={setFileUploaded1}
            setFileUploaded2={setFileUploaded2}
            setDocType1={setDocType1}
            setDocType2={setDocType2}
            docType1={docType1}
            docType2={docType2}
            isDeclarationForDocTwo={isDeclarationForDocTwo}
            onReplaceDeclarationWithDoc={onReplaceDeclarationWithDoc}
          />
        )}
      </div>
      {showSubmitButton && businessType !== BUSSINESS_TYPES.FREELANCER ? (
        <Button
          title={Locale.continue}
          onButtonClick={onConfirmClick}
          isLoading={isConfirmButtonLoading}
          buttonClass={"mt-6 hide_for_mob"}
        />
      ) : null}
      {businessType !== BUSSINESS_TYPES.FREELANCER && renderFooter()}
      <DeclarationPopupContainer businessType={businessType} onDeclarationAccepted={onDeclarationAccepted} />
      <div className={"hide_for_desktop mt-8"}>
        <TestimonialTrustMarkerMobile />
      </div>
      {businessType !== BUSSINESS_TYPES.FREELANCER ? (
        <div
          className={
            "hide_for_desktop flex flex-row flex-1 fixed bottom-0 right-0 left-0 px-4 pt-4 bg-white shadow-elevation1"
          }
        >
          <TrustMarkerMobile />
          <Button
            isDisabled={!showSubmitButton}
            title={Locale.continue}
            onButtonClick={onConfirmClick}
            isLoading={isConfirmButtonLoading}
            buttonClass={"mb-4 !w-full flex flex-row flex-1 justify-center"}
          />
        </div>
      ) : (
        <div
          className={
            "hide_for_desktop flex flex-row flex-1 fixed bottom-0 right-0 left-0 px-4 pt-4 bg-white shadow-elevation1"
          }
        >
          <TrustMarkerMobile />
          <Button
            isDisabled={selectedOption === 'recommended' && !isContractRecommended ? uploadingState !== 'UPLOADED' : !showSubmitButton}
            title={selectedOption === 'other' ? Locale.confirmAndContinue : Locale.veryfyAndContinue}
            onButtonClick={() => {
              if (selectedOption === 'recommended' && !isContractRecommended) {
                verifyBankStatement();
              } else {
                onConfirmClick();
              }
            }}
            isLoading={isVerifying}
            buttonClass={"mb-4 !w-full flex flex-row flex-1 justify-center"}
          />
        </div>
      )}
      <UdyamOcrPopup
        businessLegalName={exporterData?.businessLegalName}
        onUploadAnotherDoc={() => {
          if (docType1 === DocTypesOnboarding.UDYAM_CERTIFICATE) {
            docInput1Ref.current && docInput1Ref.current.resetDropdown("");
            setDocType1("");
            setFileUploaded1(false);
          } else if (docType2 === DocTypesOnboarding.UDYAM_CERTIFICATE) {
            docInput2Ref.current && docInput2Ref.current.resetDropdown("");
            setDocType2("");
            setFileUploaded2(false);
          }
        }}
      />
      <IecActivatePopup />
      <DocUploadHelpPopup informTeam={informTeamAboutDocIssue} />
    </div>
  ));
};

export default ExporterDocInput;
