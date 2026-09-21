// Stand-in for the product's login store. It keeps the same shape the login screen
// reads, but performs no authentication and no navigation.
import { create } from "zustand";

interface LoginState {
  isVerified: boolean;
  isBusy: boolean;
  resetLogin: () => void;
  register: (authResponse: any) => Promise<void>;
  login: (args: { correlationId?: string; stringOTP?: string; analytics?: any; complete?: any }) => Promise<void>;
}

const useLoginStore = create<LoginState>()((set) => ({
  isVerified: false,
  isBusy: false,
  resetLogin: () => set({ isVerified: false, isBusy: false }),
  register: async () => {
    set({ isBusy: false });
  },
  login: async ({ complete }) => {
    set({ isBusy: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ isVerified: true, isBusy: false });
    if (complete) await complete({ token: "prototype-session", provider: "OTP" });
  },
}));

export default useLoginStore;
