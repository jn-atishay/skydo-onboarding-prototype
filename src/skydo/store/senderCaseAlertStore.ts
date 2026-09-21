import create from 'zustand';

interface SenderCaseAlertState {
  // Document related states
  proofDocUrls: string[];
  proofDocFiles: File[];
  proofDocFileTypes: string[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  isFileDragging: boolean;
  isConfirmButtonLoading: boolean;
  isFileTypePdf: boolean;

  // Link related states
  proofLink: string;
  showSubmitButton: boolean;

  // Actions
  setProofDocUrls: (urls: string[]) => void;
  setProofDocFiles: (files: File[]) => void;
  setProofDocFileTypes: (types: string[]) => void;
  setUploadLoader: (loading: boolean) => void;
  setError: (error: boolean) => void;
  setErrorMessage: (message: string) => void;
  setFileDragging: (dragging: boolean) => void;
  setConfirmButtonLoading: (loading: boolean) => void;
  setIsFileTypePdf: (isPdf: boolean) => void;
  setProofLink: (link: string) => void;
  setShowSubmitButton: (show: boolean) => void;
  
  // Helper actions
  removeDoc: (id: number) => void;
  resetState: () => void;
}

const initialState = {
  proofDocUrls: [],
  proofDocFiles: [],
  proofDocFileTypes: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
  isFileDragging: false,
  isConfirmButtonLoading: false,
  isFileTypePdf: false,
  proofLink: "",
  showSubmitButton: false,
};

export const useSenderCaseAlertStore = create<SenderCaseAlertState>((set) => ({
  ...initialState,

  // Setters
  setProofDocUrls: (urls) => set({ proofDocUrls: urls }),
  setProofDocFiles: (files) => set({ proofDocFiles: files }),
  setProofDocFileTypes: (types) => set({ proofDocFileTypes: types }),
  setUploadLoader: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ isError: error }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setFileDragging: (dragging) => set({ isFileDragging: dragging }),
  setConfirmButtonLoading: (loading) => set({ isConfirmButtonLoading: loading }),
  setIsFileTypePdf: (isPdf) => set({ isFileTypePdf: isPdf }),
  setProofLink: (link) => set({ proofLink: link }),
  setShowSubmitButton: (show) => set({ showSubmitButton: show }),

  // Helper actions
  removeDoc: (id) => 
    set((state) => {
      const newUrls = [...state.proofDocUrls];
      const newFiles = [...state.proofDocFiles];
      const newTypes = [...state.proofDocFileTypes];
      
      newUrls.splice(id, 1);
      newFiles.splice(id, 1);
      newTypes.splice(id, 1);
      
      return {
        proofDocUrls: newUrls,
        proofDocFiles: newFiles,
        proofDocFileTypes: newTypes,
      };
    }),

  resetState: () => set(initialState),
})); 