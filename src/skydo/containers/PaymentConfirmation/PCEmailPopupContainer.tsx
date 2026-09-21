/**
 * @author Raj Sheth
 * created: 16/10/23
 */

import React, { FC, useEffect } from "react";
import PCEmailPopup from "../../components/PaymentConfirmation/PCEmailPopup";
import usePaymentConfirmationStore from "../../store/usePaymentConfirmationStore";
import { Transaction } from "../../types";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  invoiceId: string;
  transaction: Transaction | null | undefined;
  importerName: string;
}

const PCEmailPopupContainer: FC<Props> = (props) => {
  const { emailPopupVisibleForTxnId, setEmailPopupVisibleForTxnId, fetchAndStorePreferredEmails } =
    usePaymentConfirmationStore();
  const analytics = useAnalytics();

  const isPopupVisible =
    emailPopupVisibleForTxnId === props.transaction?.id &&
    props.transaction?.id !== undefined &&
    emailPopupVisibleForTxnId !== undefined;

  useEffect(() => {
    if (isPopupVisible) {
      analytics.trackAsync(Events.PC_POPUP_SHOWN);
    }
  }, [emailPopupVisibleForTxnId]);

  useEffect(() => {
    fetchAndStorePreferredEmails(props.invoiceId);
  }, []);

  const togglePopupVisible = () => {
    if (isPopupVisible) {
      setEmailPopupVisibleForTxnId(undefined);
    } else {
      setEmailPopupVisibleForTxnId(props.transaction?.id);
    }
  };

  return (
    <PCEmailPopup
      isPopupVisible={isPopupVisible}
      togglePopupVisible={togglePopupVisible}
      invoiceId={props.invoiceId}
      transaction={props.transaction}
      importerName={props.importerName}
    />
  );
};

export default PCEmailPopupContainer;
