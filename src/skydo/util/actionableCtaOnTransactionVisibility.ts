import type { SenderAlertDetails } from "../types";
import { McaDocStatus } from "../types/Exporter/ExporterUser";

/**
 * Inputs for {@link getActionableCtaBlockVisibility} — same props as {@link ActionableCtaOnTransaction} uses for branching.
 */
export type ActionableCtaStackInput = {
  vkycNeeded: boolean;
  isPCRequired: boolean;
  isSkydoInvoice: boolean;
  /** When false, PC/VKYC/MCA blocks are omitted on the transaction (e.g. shown on balance summary only). */
  showUserActionables: boolean | undefined;
  mcaDocStatus: string | undefined;
  senderAlertDetails: SenderAlertDetails | undefined;
  /**
   * Balance-invoice summary row: show only the sender alert strip (ignore PC/VKYC/MCA gating).
   */
  balanceSummarySenderRowOnly?: boolean;
};

/** Which yellow blocks render under the transaction status (VKYC → PC → MCA → sender). */
export type ActionableCtaBlockVisibility = {
  showVkyc: boolean;
  showPc: boolean;
  showMca: boolean;
  showSender: boolean;
};

/**
 * Single source of truth for ActionableCtaOnTransaction render branches.
 * Keep Transaction stacked styling in sync via {@link getHasStackedActionableBelow}.
 */
export function getActionableCtaBlockVisibility(input: ActionableCtaStackInput): ActionableCtaBlockVisibility {
  if (input.balanceSummarySenderRowOnly && input.senderAlertDetails) {
    return {
      showVkyc: false,
      showPc: false,
      showMca: false,
      showSender: true,
    };
  }

  const show = input.showUserActionables !== false;
  const mcaStripEligible =
    show &&
    (input.mcaDocStatus === McaDocStatus.REQUIRED || input.mcaDocStatus === McaDocStatus.UNDER_REVIEW) &&
    input.isSkydoInvoice;

  return {
    showVkyc: input.vkycNeeded && show,
    showPc: input.isPCRequired && !input.vkycNeeded && show,
    showMca: !input.isPCRequired && !input.vkycNeeded && mcaStripEligible,
    showSender: !input.isPCRequired && !input.vkycNeeded && !!input.senderAlertDetails,
  };
}

/** True if any actionable block renders below the green status card (stacked layout). */
export function getHasStackedActionableBelow(input: ActionableCtaStackInput): boolean {
  const v = getActionableCtaBlockVisibility(input);
  return v.showVkyc || v.showPc || v.showMca || v.showSender;
}
