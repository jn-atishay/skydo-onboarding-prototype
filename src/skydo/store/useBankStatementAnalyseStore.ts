import create from "zustand";
import beCall from "../util/beCall";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import BE_ROUTES from "../util/beRoutes";
import Locale from "../util/locale/en";
import { TOAST_TYPES } from "../constants/atomicConstants";
import { BUSSINESS_TYPES, DocTypesOnboarding } from "../constants/onboarding";
import { ResponseWrapper } from "../authentication/api/AuthApiDto";
import useToastMessages from "./toastMessages";
import useOnboardingStore from "./useOnboardingStore";
import { UploadingState, VerifyingErrorState } from "../components/BankStatementUpload";
import { logApiFailureToSentry } from "../util/sentryLogger";

interface VerifyBankStatementResponse {
  success: boolean;
  message?: string;
  source?:string;
}

interface BankStatementAnalyseState {
  isVerifying: boolean;
  uploadingState: UploadingState;
  verifyingErrorState: VerifyingErrorState;
  selectedOption: 'recommended' | 'other';
  isContractRecommended: boolean;
  setUploadingState: (state: UploadingState) => void;
  setVerifyingErrorState: (state: VerifyingErrorState) => void;
  setSelectedOption: (option: 'recommended' | 'other') => void;
  setIsContractRecommended: (isContractRecommended: boolean) => void;
  verifyBankStatement: () => Promise<void>;
  verificationFailedSource: string | null;
  setVerificationFailedSource: (source?: string) => void;
  docsUploaded: string[];
  addDocUploaded: (doc: string) => void;
  removeDocUploaded: (doc: string) => void;
  clearDocsUploaded: () => void;
}

const useBankStatementAnalyseStore = create<BankStatementAnalyseState>((set: any, get: any) => ({
  isVerifying: false,
  uploadingState: 'FIRST',
  verifyingErrorState: 'INTERNAL_ERROR',
  selectedOption: 'recommended',
  isContractRecommended: false,
  verificationFailedSource:null,
  docsUploaded: [],

  addDocUploaded: (doc: string) => set((state: BankStatementAnalyseState) => ({
    docsUploaded: state.docsUploaded.includes(doc) ? state.docsUploaded : [...state.docsUploaded, doc],
  })),

  removeDocUploaded: (doc: string) => set((state: BankStatementAnalyseState) => ({
    docsUploaded: state.docsUploaded.filter((d) => d !== doc),
  })),

  clearDocsUploaded: () => set({ docsUploaded: [] }),

  setUploadingState: (state: UploadingState) => set({ uploadingState: state }),

  setVerifyingErrorState: (state: VerifyingErrorState) => set({ verifyingErrorState: state }),

  setSelectedOption: (option: 'recommended' | 'other') => set({ selectedOption: option }),

  setIsContractRecommended: (isContractRecommended: boolean) => set({ isContractRecommended }),

  setVerificationFailedSource: (state?: string) => set({ verificationFailedSource: state }),
  
  verifyBankStatement: async (): Promise<void> => {
    set({ isVerifying: true });
    set({ uploadingState: 'VERIFYING' });
    
    try {
      const response = await beCall({
        method: ALLOWED_METHODS.POST,
        path: BE_ROUTES.BANK_STATEMENT_VERIFY,
      });
      
      const verifyResponse = response?.data as VerifyBankStatementResponse;
      
      if(verifyResponse.success) {
        set({ uploadingState: 'VERIFIED' });
        // Accept KYC document
        await acceptKYCDoc();
      } else {
        set({
          verifyingErrorState: verifyResponse?.message as VerifyingErrorState || 'INTERNAL_ERROR',
          uploadingState: 'ERROR',
          verificationFailedSource: verifyResponse?.source || null,
        });
      }
    } catch (error) {
      console.error('Error verifying bank statement:', error);
      set({ verifyingErrorState: 'INTERNAL_ERROR' });
      set({ uploadingState: 'ERROR' });
    } finally {
      set({ isVerifying: false });
    }
  },
}));

// Helper function to accept KYC document
const acceptKYCDoc = async (): Promise<void> => {
  const { addToast } = useToastMessages.getState();
  const { fetchExporterUserDetails } = useOnboardingStore.getState();

  // Bank-statement verification has no docType1/docType2 selection of its own, so the active
  // document must be marked explicitly here — unlike the manual doc-upload flow (onConfirmClick
  // in ExporterDocInput), this path previously called CONFIRM_N_CONTINUE with no mark-active
  // call at all, leaving no record of which document backs the verified bank statement.
  const markActiveBody = { activeDocTypeList: [DocTypesOnboarding.BANK_STATEMENT] };
  const markRes = (await beCall({
    path: BE_ROUTES.MARK_EXPORTER_DOCS_ACTIVE,
    method: ALLOWED_METHODS.POST,
    body: markActiveBody,
  })) as ResponseWrapper<unknown>;

  if (!markRes?.success) {
    logApiFailureToSentry(
      "useBankStatementAnalyseStore.ts",
      BE_ROUTES.MARK_EXPORTER_DOCS_ACTIVE,
      markActiveBody,
      markRes
    );
    addToast({
      type: TOAST_TYPES.ERROR,
      id: "company_details_error",
      body: Locale.wentWrongMessage,
    });
    return;
  }

  const confirmBody = { businessType: BUSSINESS_TYPES.FREELANCER };
  beCall({
    path: BE_ROUTES.CONFIRM_N_CONTINUE_EXPORTER_KYC_DOC,
    method: ALLOWED_METHODS.POST,
    body: confirmBody,
    onSuccess: (data: ResponseWrapper<boolean>) => {
      if (data.success) {
        fetchExporterUserDetails();
      } else {
        logApiFailureToSentry(
          "useBankStatementAnalyseStore.ts",
          BE_ROUTES.CONFIRM_N_CONTINUE_EXPORTER_KYC_DOC,
          confirmBody,
          data
        );
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "company_details_error",
          body: Locale.wentWrongMessage,
        });
      }
    },
    onError: (error: unknown) => {
      logApiFailureToSentry(
        "useBankStatementAnalyseStore.ts",
        BE_ROUTES.CONFIRM_N_CONTINUE_EXPORTER_KYC_DOC,
        confirmBody,
        error
      );
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "company_details_error",
        body: Locale.wentWrongMessage,
      });
    },
  });
};

export default useBankStatementAnalyseStore;
