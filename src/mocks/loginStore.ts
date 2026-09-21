// Stand-in for the product's login store. It keeps the same shape the login screen
// reads, but performs no authentication and no navigation.
import { create } from "zustand";
import { usePrototype } from "../prototype/state";

interface LoginState {
  isVerified: boolean;
  isBusy: boolean;
  resetLogin: () => void;
  register: (authResponse: any) => Promise<void>;
  login: (args: { correlationId?: string; stringOTP?: string; analytics?: any; complete?: any }) => Promise<void>;
  savePhone: (args: { onSuccess?: () => void; onError?: () => void; [k: string]: any }) => Promise<void>;
  logout: (...args: any[]) => Promise<void>;
}

const useLoginStore = create<LoginState>()((set) => ({
  isVerified: false,
  isBusy: false,
  resetLogin: () => set({ isVerified: false, isBusy: false }),
  register: async () => {
    // Signing in moves the demo on to the mobile-number screen.
    set({ isBusy: false });
    usePrototype.getState().set({ step: "mobile", variant: "" });
  },
  savePhone: async ({ onSuccess }) => {
    // Any 10-digit number is accepted; the demo moves on to the KYC intro.
    await new Promise((r) => setTimeout(r, 450));
    onSuccess?.();
    usePrototype.getState().set({ step: "kyc-intro" });
  },
  logout: async () => {
    usePrototype.getState().set({ step: "login", variant: "" });
  },
  login: async ({ complete }) => {
    set({ isBusy: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ isVerified: true, isBusy: false });
    if (complete) await complete({ token: "prototype-session", provider: "OTP" });
  },
}));

export default useLoginStore;
