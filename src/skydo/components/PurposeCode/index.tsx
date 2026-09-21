import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Popup from "../AtomicComponents/Popup";
import PurposeCodePopup from "./PurposeCodePopup";
import { popupStateType } from "./constants";
import { gql, useQuery } from "@apollo/client";
import usePurposeCodeList from "../../store/usePurposeCodeList";
import classNames from "classnames";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  openPCPopup: boolean;
}

const deletePopupQuery = (query: { [key: string]: any }) => {
  delete query.openPurposeCodePopup;
  delete query.exporterSystemInvoiceId;
  delete query.isDefault;
  delete query.purposeCode;
};

const PC_LIST_QUERY = gql`
  query PC_LIST_QUERY {
    purposeCode {
      code
      description
    }
  }
`;

const PurposeCode = ({ openPCPopup }: Props) => {
  const router = useRouter();
  const { isDefault, invoice_id, payment_id, exporterSystemInvoiceId, purposeCode: defaultPC } = router.query;
  const invoiceId = invoice_id || payment_id;
  const isSystemGeneratedInvoice = (payment_id != undefined) && (invoice_id == undefined);
  const isInvoiceSpecific = invoiceId && exporterSystemInvoiceId;
  const { isAmazonUser, shippingMethod: defaultShippingMethod } = usePurposeCodeList();
  const analytics = useAnalytics();

  const getPopupType = (): string => {
    if (isInvoiceSpecific && defaultPC) return popupStateType.EDIT_PC_INVOICE;
    if (isInvoiceSpecific) return popupStateType.ADD_PC_INVOICE;
    if (isDefault && defaultPC) return popupStateType.EDIT_DEFAULT;
    if (isDefault) return popupStateType.DEFAULT;
    return "";
  };
  const [popupState, setPopupState] = useState<string>(getPopupType());

  const {
    data,
    loading: arePurposeCodesLoading,
    error: purposeCodesError,
    refetch: refetchPurposeCodes,
  } = useQuery(PC_LIST_QUERY, { fetchPolicy: "cache-and-network", notifyOnNetworkStatusChange: true });
  const { purposeCodeList, setPurposeCodeList } = usePurposeCodeList();
  useEffect(() => {
    if (data) {
      setPurposeCodeList(data.purposeCode);
    }
  }, [data]);

  useEffect(() => {
    if (openPCPopup && isAmazonUser !== undefined) {
      analytics.trackAsync(Events.PURPOSE_CODE_POPUP_OPEN, {
        exporterType: isAmazonUser ? "amazon" : "regular",
        popupType: isDefault ? "default" : "invoice",
      });
    }
  }, [openPCPopup, isAmazonUser]);

  const onClosePopup = (isRefreshRequired?: boolean, isSubmit?: boolean) => {
    if (!isSubmit) {
      analytics.trackAsync(Events.PURPOSE_CODE_POPUP_CLOSE);
    }
    const routerQuery = { ...router.query };
    deletePopupQuery(routerQuery);
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...routerQuery,
        },
      },
      undefined,
      { shallow: !isRefreshRequired }
    );
  };

  const renderContent = () => {
    return (
      <PurposeCodePopup
        popupState={popupState}
        onClosePopup={onClosePopup}
        purposeCodeOption={purposeCodeList}
        arePurposeCodesLoading={arePurposeCodesLoading && !purposeCodeList?.length}
        purposeCodesLoadFailed={!!purposeCodesError && !arePurposeCodesLoading && !purposeCodeList?.length}
        onRetryPurposeCodes={() => {
          void refetchPurposeCodes().catch(() => undefined);
        }}
        defaultPC={defaultPC as string}
        setPopupState={setPopupState}
        exporterSystemInvoiceId={exporterSystemInvoiceId as string}
        invoiceId={invoiceId as string}
        isSystemGeneratedInvoice={isSystemGeneratedInvoice}
        isAmazon={isAmazonUser}
        defaultShippingMethod={defaultShippingMethod}
      />
    );
  };

  if (!isDefault && !isInvoiceSpecific) return null;

  const isAmazonPopup =
    !!isAmazonUser && (popupState === popupStateType.DEFAULT || popupState === popupStateType.EDIT_DEFAULT);
  const isRevampedPopup =
    !isAmazonUser &&
    [
      popupStateType.DEFAULT,
      popupStateType.EDIT_DEFAULT,
      popupStateType.ADD_PC_INVOICE,
      popupStateType.EDIT_PC_INVOICE,
    ].includes(popupState);

  return (
    <Popup
      renderContent={renderContent}
      open={openPCPopup}
      outsideClick={(e) => onClosePopup()}
      containerClass={classNames("!overflow-visible", {
        dashboardPopup: !isAmazonPopup,
        "!p-0": isAmazonPopup || isRevampedPopup,
        "!rounded-10px": isRevampedPopup,
      })}
    />
  );
};

export default PurposeCode;
