import { useCallback, useEffect, useState } from "react";
import beCall from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { PROOF_SUBMITTED } from "../constants/customeEvents";
import type { BalanceInvoiceSummaryResponse, BalanceInvoiceSummaryResult } from "../types/SkydoBalance";
import { summariseBalanceInvoiceSummary } from "../util/balanceInvoiceSummary";

export interface BalanceInvoiceSummaryState {
  data: BalanceInvoiceSummaryResponse | null;
  summary: BalanceInvoiceSummaryResult;
  loading: boolean;
  error: unknown;
}

/**
 * Fetches balance invoice summary (master funding verifications, balance outpays, withdrawals)
 * via beCall and computes summary values. Only fetches when invoiceId is present.
 */
export function useBalanceInvoiceSummary(invoiceId: string | string[] | undefined): BalanceInvoiceSummaryState {
  const [data, setData] = useState<BalanceInvoiceSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const id = invoiceId == null ? undefined : String(invoiceId);

  const fetchSummary = useCallback(() => {
    if (!id || id === "undefined" || id === "test") {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    void beCall({
      url: BE_ROUTES.FETCH_BALANCE_INVOICE_SUMMARY,
      method: ALLOWED_METHODS.POST,
      body: { invoiceId: id },
      onSuccess: (response: { data?: BalanceInvoiceSummaryResponse }) => {
        setData(response?.data ?? null);
        setLoading(false);
      },
      onError: (err) => {
        setError(err);
        setData(null);
        setLoading(false);
      },
    });
  }, [id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const onProofSubmitted = () => {
      fetchSummary();
    };
    document.addEventListener(PROOF_SUBMITTED, onProofSubmitted);
    return () => {
      document.removeEventListener(PROOF_SUBMITTED, onProofSubmitted);
    };
  }, [fetchSummary]);

  const summary = summariseBalanceInvoiceSummary(data);

  return {
    data,
    summary,
    loading,
    error,
  };
}
