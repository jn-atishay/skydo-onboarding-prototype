import * as Sentry from "@sentry/nextjs";
import { create } from "./index";
import { fetchData } from "../util/beCall";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { FXRateResponse } from "../types/ApiResponses";
import {
  InstantSettlementPreview,
  InstantSettlementPreviewBreakdown,
  InstantSettlementPreviewStatus,
  InstantSettlementInrBreakdown,
} from "../types";
import { computeInstantSettlementInrBreakdown } from "../util/instantSettlementUtil";

const PREVIEW_BFF_URL = "/api/route/instant_settlement_preview";

type FetchPreviewArgs = {
  invoiceId: number;
};

// BFF returns the preview + the live FX rates in one response (FX folded server-side).
type InstantSettlementPreviewResult = {
  preview: InstantSettlementPreview | null;
  fxRates: FXRateResponse[];
};

type InstantSettlementPreviewStore = {
  invoiceId: number | null;
  status: InstantSettlementPreviewStatus | null;
  breakdown: InstantSettlementPreviewBreakdown | null;
  fxRates: FXRateResponse[];
  inrBreakdown: InstantSettlementInrBreakdown | null;
  isLoading: boolean;
  refreshCount: number;
  fetchPreview: (args: FetchPreviewArgs) => Promise<void>;
  refreshPreview: () => Promise<void>;
  reset: () => void;
};

const INITIAL_STATE = {
  invoiceId: null,
  status: null,
  breakdown: null,
  fxRates: [],
  inrBreakdown: null,
  isLoading: false,
  refreshCount: 0,
};

const useInstantSettlementPreviewStore = create<InstantSettlementPreviewStore>()((set, get) => ({
  ...INITIAL_STATE,

  fetchPreview: async ({ invoiceId }: FetchPreviewArgs) => {
    set((s) => ({ ...s, isLoading: true, invoiceId }));
    try {
      const response = await fetchData<InstantSettlementPreviewResult>({
        url: PREVIEW_BFF_URL,
        method: ALLOWED_METHODS.POST,
        body: { invoiceId },
      });

      const preview = response?.data?.preview ?? null;
      const fxRates = response?.data?.fxRates ?? [];
      if (!preview) {
        // Genuine failure (GraphQL error / bad id) — not an expected NOT_APPLICABLE fallback.
        Sentry.captureMessage("instant_settlement_preview_null", { level: "warning", extra: { invoiceId } });
        set((s) => ({ ...s, isLoading: false }));
        return;
      }

      const breakdown = preview.breakdown ?? null;
      const inrBreakdown = computeInstantSettlementInrBreakdown(breakdown, fxRates);
      if (preview.status === InstantSettlementPreviewStatus.AVAILABLE && !inrBreakdown) {
        Sentry.captureMessage("instant_settlement_preview_fx_unavailable", {
          level: "warning",
          extra: { invoiceId, currency: breakdown?.grossAmount?.currency },
        });
      }

      set((s) => ({
        ...s,
        status: preview.status,
        breakdown,
        fxRates,
        inrBreakdown,
        isLoading: false,
      }));
    } catch (error) {
      Sentry.captureException(error, { extra: { feature: "instant_settlement_preview", invoiceId } });
      set((s) => ({ ...s, isLoading: false }));
    }
  },

  // Refresh poll — re-quotes the live rate. Analytics fire once per open (in the hook), not here.
  refreshPreview: async () => {
    const { invoiceId, refreshCount } = get();
    if (invoiceId == null) return;
    set((s) => ({ ...s, refreshCount: refreshCount + 1 }));
    await get().fetchPreview({ invoiceId });
  },

  reset: () => set(() => ({ ...INITIAL_STATE })),
}));

export default useInstantSettlementPreviewStore;
