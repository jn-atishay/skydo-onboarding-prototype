import { useEffect, useRef } from "react";
import useInterval from "./useInterval";
import useAnalytics from "../analytics/useAnalytics";
import { Events } from "../analytics/EventConstants";
import useInstantSettlementPreviewStore from "../store/useInstantSettlementPreviewStore";
import { INSTANT_SETTLEMENT_PREVIEW_REFRESH } from "../constants/instantSettlementConstants";
import { InstantSettlementPreviewStatus } from "../types";

type UseInstantSettlementPreviewArgs = {
  invoiceId: number | null | undefined;
  isOpen: boolean;
  source: "desktop" | "mobile";
  // Fired once the refresh cap is reached — caller closes the popup (FE decision: auto-close after 3).
  onRefreshExhausted?: () => void;
};

const useInstantSettlementPreview = ({
  invoiceId,
  isOpen,
  source,
  onRefreshExhausted,
}: UseInstantSettlementPreviewArgs) => {
  const analytics = useAnalytics();

  const status = useInstantSettlementPreviewStore((s) => s.status);
  const breakdown = useInstantSettlementPreviewStore((s) => s.breakdown);
  const inrBreakdown = useInstantSettlementPreviewStore((s) => s.inrBreakdown);
  const isLoading = useInstantSettlementPreviewStore((s) => s.isLoading);
  const refreshCount = useInstantSettlementPreviewStore((s) => s.refreshCount);
  const fetchPreview = useInstantSettlementPreviewStore((s) => s.fetchPreview);
  const refreshPreview = useInstantSettlementPreviewStore((s) => s.refreshPreview);
  const reset = useInstantSettlementPreviewStore((s) => s.reset);

  // Each analytics event fires once per open — not on the 5-min refresh re-quotes.
  const openedFiredRef = useRef(false);
  const viewedFiredRef = useRef(false);

  useEffect(() => {
    if (isOpen && invoiceId != null) {
      if (!openedFiredRef.current) {
        openedFiredRef.current = true;
        analytics.trackAsync(Events.INSTANT_SETTLEMENT.PREVIEW_OPENED, { invoiceId, source });
      }
      void fetchPreview({ invoiceId });
    }
    if (!isOpen) {
      openedFiredRef.current = false;
      viewedFiredRef.current = false;
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, invoiceId]);

  // "Breakup shown" — fires once, when an AVAILABLE breakdown first renders.
  useEffect(() => {
    if (isOpen && !viewedFiredRef.current && status === InstantSettlementPreviewStatus.AVAILABLE && inrBreakdown) {
      viewedFiredRef.current = true;
      analytics.trackAsync(Events.INSTANT_SETTLEMENT.PREVIEW_VIEWED, {
        invoiceId,
        source,
        settledInr: inrBreakdown.settledInr,
        currency: breakdown?.grossAmount?.currency,
        numberOfInvoices: breakdown?.scope?.numberOfInvoices,
        numberOfTransactions: breakdown?.scope?.numberOfTransactions,
        fxRate: inrBreakdown.fxRateUsed,
        gstSplitType: inrBreakdown.gstSplitType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, status, inrBreakdown]);

  const hasReachedRefreshCap = refreshCount >= INSTANT_SETTLEMENT_PREVIEW_REFRESH.MAX_REFRESHES;

  // Pause the poll (null delay) while closed or once the cap is reached.
  useInterval(
    () => {
      void refreshPreview();
    },
    isOpen && !hasReachedRefreshCap ? INSTANT_SETTLEMENT_PREVIEW_REFRESH.INTERVAL_MS : null
  );

  useEffect(() => {
    if (isOpen && hasReachedRefreshCap) {
      onRefreshExhausted?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasReachedRefreshCap, isOpen]);

  return { breakdown, inrBreakdown, isLoading };
};

export default useInstantSettlementPreview;
