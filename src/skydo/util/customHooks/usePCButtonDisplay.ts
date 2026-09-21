/**
 * @author Raj Sheth
 * created: 30/10/23
 */

import React, { useContext, useEffect } from "react";
import { PCButtonCase } from "../../types/PaymentConfirmation";
import { BUTTON_TYPES } from "../../constants/atomicConstants";
import { UserDetailsContext } from "../../components/DashboardContainer";
import { useRouter } from "next/router";
import usePaymentConfirmationStore from "../../store/usePaymentConfirmationStore";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { getPCDisplayInfo } from "../paymentConfirmationHelper";
import { PopupOpenSource } from "../../components/PaymentConfirmation/PCButton";
import { Transaction } from "../../types";

interface Props {
  transaction: Transaction | null | undefined;
}

interface PCButtonReturn {
  buttonCase: PCButtonCase | undefined;
  sentAt: string | undefined;
  buttonType: string;
  setIsPopupVisible: (source: PopupOpenSource) => void;
  exporterUserDetails: any;
}

const DEEP_LINK_QUERY = "pc";

const usePCButtonDisplay = (props: Props): PCButtonReturn => {
  /**
   * logic:
   * 1. show / hide
   * 2. type: primary / secondary
   */
  const { exporterUserDetails } = useContext(UserDetailsContext);
  const router = useRouter();
  const showPCPopupFromDeepLink = router.query[DEEP_LINK_QUERY]?.toString() === props.transaction?.id.toString();

  const { setEmailPopupVisibleForTxnId } = usePaymentConfirmationStore();
  const [sentAt, setSentAt] = React.useState<string | undefined>();
  const { invoiceData } = usePaymentConfirmationStore();
  const [buttonCase, setButtonCase] = React.useState<PCButtonCase | undefined>();
  const [buttonType, setButtonType] = React.useState<string>(BUTTON_TYPES.SECONDARY);
  const analytics = useAnalytics();

  const setIsPopupVisible = (source: PopupOpenSource) => {
    analytics.trackAsync(Events.PC_CTA_CLICKED, {
      source,
    });
    setEmailPopupVisibleForTxnId(props.transaction?.id);
    // delete query param with key `pc`, if present
    const routerQuery = { ...router.query };
    delete routerQuery[DEEP_LINK_QUERY];
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...routerQuery,
        },
      },
      undefined,
      { shallow: false }
    );
  };

  useEffect(() => {
    let displayButtonCase;
    if (props.transaction?.collectionType == "PAYOUT") {
      setButtonCase(PCButtonCase.SHOW_NOTHING);
      return;
    }
    if (props.transaction && invoiceData) {
      displayButtonCase = getPCDisplayInfo(invoiceData, props.transaction);
      setSentAt(displayButtonCase.sentAt);
      setButtonCase(displayButtonCase.buttonCase);
      if (displayButtonCase.buttonType) setButtonType(displayButtonCase.buttonType);
      if (buttonCase === PCButtonCase.EMAIL_BTN && showPCPopupFromDeepLink) {
        setIsPopupVisible("email");
      }
    } else {
      setButtonCase(PCButtonCase.SHOW_NOTHING);
    }
  }, [props.transaction, invoiceData, router.query]);

  return {
    buttonCase,
    sentAt,
    buttonType,
    setIsPopupVisible,
    exporterUserDetails,
  };
};

export default usePCButtonDisplay;
