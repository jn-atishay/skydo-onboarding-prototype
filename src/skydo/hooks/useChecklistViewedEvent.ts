import { useEffect, useRef } from "react";
import useAnalytics from "../analytics/useAnalytics";
import { Events } from "../analytics/EventConstants";
import useExporterAndExporterUserStore from "../store/useExporterAndExporterUserStore";

/**
 * Fires the checklist-viewed event once per mount, but not before the exporter store is populated.
 * The popup can mount while the dashboard fetch is still in flight, and an event sent then would
 * carry business_type: undefined with no later chance to correct itself.
 */
const useChecklistViewedEvent = (platform: string, businessType?: string) => {
  const analytics = useAnalytics();
  const { exporter } = useExporterAndExporterUserStore();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!exporter || hasTracked.current) return;
    hasTracked.current = true;
    analytics.trackAsync(Events.UPLOAD_INVOICE_CHECKLIST_VIEWED, {
      platform,
      business_type: businessType,
    });
  }, [exporter]);
};

export default useChecklistViewedEvent;
