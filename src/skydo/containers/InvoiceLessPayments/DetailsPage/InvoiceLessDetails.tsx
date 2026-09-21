import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import beCall from "../../../util/beCall";
import useToastMessages from "../../../store/toastMessages";
import Locale from "../../../util/locale/en";
import { TOAST_TYPES } from "../../../constants/atomicConstants";
import { Invoice } from "../../../types";
import { ResponseWrapper } from "../../../authentication/api/AuthApiDto";
import withAuth from "../../../authentication/WithAuth";
import FE_ROUTES from "../../../util/feRoutes";
import RightSection from "../../../components/InvoiceDetails/RightSection";
import useAnalytics from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";
import { PROOF_SUBMITTED, PURPOSE_CODE_UPDATE_EVENT } from "../../../constants/customeEvents";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import useCashbackStore from "../../../store/useCashbackStore";
import { getFirstRefundedTransactionAndRefundReason, getInvoiceLessPaymentDisplayId } from "../../../util/transactionHelpers";
import { getInvoiceStatusWiseColorTextMapping } from "../../../util/functions";
import AppContext from "../../../context/AppContext";
import InvoiceDetailsLoader from "../../../components/Common/InvoiceDetailsLoader";
import BE_ROUTES from "../../../util/beRoutes";
import { ALLOWED_METHODS } from "../../../constants/apiConstants";
import * as R from "remeda";
import InvoiceLessLeftSection from "../../../components/PayoutDetails/InvoiceLessLeftSection";
import useDashboardVersionStore, { SYSTEM_GENERATED } from "../../../store/useDashboardVersionStore";
import { useBalanceInvoiceSummary } from "../../../hooks/useBalanceInvoiceSummary";

const INVOICE_ID_PARAM = "payment_id";

const InvoiceLessDetails = () => {
  const analytics = useAnalytics();
  const router = useRouter();
  const { theme } = useContext(AppContext);
  const invoiceId = router.query[INVOICE_ID_PARAM];
  const isTest = invoiceId == "test";
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const { addToast } = useToastMessages((state) => ({
    addToast: state.addToast,
  }));
  const { fetchDashboardVersionData } = useDashboardVersionStore();

  const onFetchData = (response: ResponseWrapper<any>) => {
    const invoiceDataLocal = response.data;
    const { invoiceId, invoiceType } = invoiceDataLocal;
    if (invoiceData == null) {
      analytics?.trackAsync(Events.INVOICE_DETAILS_PAGE, {
        invoice_status: invoiceDataLocal?.status,
        settlement_status_is_inProgress: getInvoiceStatusWiseColorTextMapping(invoiceDataLocal as Invoice, theme)
          .isInprogress,
        invoice_id: invoiceId,
      });
      if (!(R.isObject(invoiceDataLocal) && Object.keys(invoiceDataLocal).length > 0)) {
        void router.push(FE_ROUTES.DASHBOARD);
        return;
      }
    }
    setInvoiceData(invoiceDataLocal);
  };

  const onFetchError = () => {
    addToast({
      id: "fetch_error",
      body: Locale.wentWrongMessage,
      type: TOAST_TYPES.ERROR,
    });
  };

  const fetchInvoiceData = () => {
    void beCall({
      url: BE_ROUTES.FETCH_INVOICE_DETAILS,
      method: ALLOWED_METHODS.POST,
      body: {
        isUnparsed: false,
        isTest: isTest,
        invoiceId: invoiceId,
      },
      onSuccess: onFetchData,
      onError: onFetchError,
    });
  };

  useEffect(() => {
    document.addEventListener(PURPOSE_CODE_UPDATE_EVENT, fetchInvoiceData);
    document.addEventListener(PROOF_SUBMITTED, fetchInvoiceData);
    return () => {
      document.removeEventListener(PURPOSE_CODE_UPDATE_EVENT, fetchInvoiceData);
      document.removeEventListener(PROOF_SUBMITTED, fetchInvoiceData);
    };
  }, []);

  useEffect(() => {
    fetchInvoiceData();
    fetchDashboardVersionData();
  }, [invoiceId]);

  const { setRefundPageTopStatus, refundReason, cashbackReason } = useCashbackStore();
  const isRefundable =
    (!!invoiceData?.isRefundable || !!invoiceData?.activationRewardOnInvoice?.applicable) &&
    !invoiceData?.transaction?.some((txn) => txn.collectionType === "PAYOUT");
  const importerBusinessName = invoiceData?.importer?.businessName || "";
  const isRefunded = getFirstRefundedTransactionAndRefundReason(invoiceData?.transaction);

  useEffect(() => {
    const activationRewardDetails = invoiceData?.activationRewardOnInvoice;
    let state = {
      isRefundablePageTopVisible: isRefundable,
      isRefunded,
      importerBusinessName,
      refundReason,
      cashbackReason,
      refundMetadata: activationRewardDetails,
    };
    setRefundPageTopStatus(state);
    return () => {
      setRefundPageTopStatus({
        isRefundablePageTopVisible: false,
        isRefunded: false,
        importerBusinessName: "",
        refundReason: "",
        cashbackReason: undefined,
        refundMetadata: undefined,
      });
    };
  }, [isRefundable, isRefunded, importerBusinessName, refundReason]);

  const isSystemGenerated = invoiceData?.invoiceMetadata?.source === SYSTEM_GENERATED;
  if (!isSystemGenerated && invoiceData && !isTest) {
    router.push(FE_ROUTES.INVOICE_DETAILS.replace("[invoice_id]", String(invoiceData?.id)));
  }

  const {
    data: balanceSummaryData,
    summary: balanceSummary,
    loading: balanceSummaryLoading,
  } = useBalanceInvoiceSummary(invoiceId);

  return (
    <>
      <Breadcrumb text={"Payments"} textRoute={FE_ROUTES.PAYMENTS} subText={getInvoiceLessPaymentDisplayId(invoiceData)} />
      {invoiceData ? (
        <>
          <div className={"flex flex-row"}>
            <InvoiceLessLeftSection invoiceData={invoiceData} />
            <RightSection
              isUnparsed={false}
              invoiceData={invoiceData}
              balanceSummaryData={balanceSummaryData}
              balanceSummary={balanceSummary}
              balanceSummaryLoading={balanceSummaryLoading}
            />
          </div>
        </>
      ) : (
        <InvoiceDetailsLoader />
      )}
    </>
  );
};

export default InvoiceLessDetails;
