import { NextApiRequest, NextApiResponse } from "next";
import { api } from "./index";
import { getAuthSession } from "../../../authentication/TokenManagement";
import {
  INVOICE_DETAILS_QUERY,
  INVOICE_DETAILS_TEST_CONSTANTS_QUERY,
  INVOICE_DETAILS_TEST_QUERY,
  INVOICE_DETAILS_UNPARSED_QUERY,
} from "../../../util/queries";
import { ALLOWED_METHODS, SERVICES } from "../../../constants/apiConstants";
import { ALL_CURRENCIES } from "../../../constants/dashboardConstants";
import { transformTestTransactionData } from "../../../BFFServices/Transformer/testTransaction";
import { transformInstantSettlementData } from "../../../BFFServices/Transformer/instantSettlement";
import BE_ROUTES, { CHALLAN_ROUTES } from "../../../util/beRoutes";
import { generateHeaders } from "../../../BFFServices/helpers";
import { AxiosResponse } from "axios";
import withMiddleware from "../../../BFFServices/apiHelpers/withMiddleware";

async function fetchInvoiceDetails(
  token: string,
  headers = {},
  isTest: boolean,
  isUnparsed: boolean,
  invoiceId: string
) {
  const query = isUnparsed
    ? INVOICE_DETAILS_UNPARSED_QUERY
    : isTest
    ? INVOICE_DETAILS_TEST_QUERY
    : INVOICE_DETAILS_QUERY;

  const invoiceDetailsApi = api({
    url: BE_ROUTES.GRAPH_QL_DASHBOARD,
    method: ALLOWED_METHODS.POST,
    headers: { Authorization: `Bearer ${token}`, accept: "application/json", ...headers },
    data: {
      query: query,
      operationName: "FetchInvoiceDetails",
      variables: {
        invoiceId: invoiceId,
        currencyList: ALL_CURRENCIES,
      },
    },
  });

  const testTransactionConstantsApi = api({
    url: BE_ROUTES.GRAPH_QL_DASHBOARD,
    method: ALLOWED_METHODS.POST,
    headers: { Authorization: `Bearer ${token}`, accept: "application/json", ...headers },
    data: {
      query: INVOICE_DETAILS_TEST_CONSTANTS_QUERY,
      operationName: "FetchInvoiceDetails",
      variables: {},
    },
  });

  const recurringInvoiceConfigData = (): Promise<AxiosResponse<any, any> | undefined> =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await api({
          url: CHALLAN_ROUTES.GET_RECURRING_CONFIG_JOB_ID.replace(":invoiceId", invoiceId),
          method: ALLOWED_METHODS.GET,
          headers: { Authorization: `Bearer ${token}`, accept: "application/json", ...headers },
          server: SERVICES.CHALLAN,
        });
        resolve(response);
      } catch (e) {
        resolve(undefined);
      }
    });

  const responses = await Promise.all([invoiceDetailsApi, testTransactionConstantsApi, recurringInvoiceConfigData()]);
  const invoiceData = responses[0]?.data?.data;
  const testTransactionConstants = responses[1]?.data?.data?.testTransactionConstants;
  const recurringInvoiceConfigId = responses[2]?.data?.data;

  if (isUnparsed) return invoiceData?.unparsedInvoice;
  if (isTest) return transformTestTransactionData(invoiceData?.testTransaction, testTransactionConstants);
  
  // console.log('📋 Invoice details API called:', {
  //   invoiceId,
  //   hasParsedInvoice: !!invoiceData?.parsedInvoice,
  //   hasTransactions: !!invoiceData?.parsedInvoice?.transaction?.length
  // });
  
  const parsedInvoice = invoiceData?.parsedInvoice;
  
  // Set mock settlement data if nodes are not present
  // if (!parsedInvoice?.instantSettlement && parsedInvoice?.transaction?.[0]) {
  //   const firstTransaction = parsedInvoice.transaction[0];
  //   parsedInvoice.instantSettlement = {
  //     id: -1,
  //     transactionId: firstTransaction.id,
  //     type: "PRODUCT"
  //   };
  // }
  
  // if (!parsedInvoice?.transactionSettlement && parsedInvoice?.transaction?.[0]) {
  //   const firstTransaction = parsedInvoice.transaction[0];
  //   const now = new Date();
  //   parsedInvoice.transactionSettlement = {
  //     id: -1,
  //     transactionId: firstTransaction.id,
  //     interbankRate: firstTransaction?.payment?.fxDeal?.interbankRate || 80,
  //     interbankRateTimestamp: firstTransaction?.payment?.fxDeal?.bookingTimeStamp || now.toISOString(),
  //     sourceCurrencyToUsdRate: firstTransaction?.payment?.fxDeal?.sourceCurrencyToUsdRate || null,
  //     usdToInrRate: firstTransaction?.payment?.fxDeal?.usdToInrRate || 80,
  //     state: "SETTLEMENT_INITIATED",
  //     initiatedAt: now.toISOString(),
  //     settledAt: null
  //   };
  // }
  
  // Apply the instant-settlement transform to EVERY instant-settled transaction,
  // not just transaction[0]. A single invoice can have multiple transactions
  // instant-settled together (mixed eligible states), and each one needs its
  // tracker massaged to the settled view. transformInstantSettlementData spreads
  // the invoice and only rewrites the transaction it is handed, leaving the rest
  // (including already-transformed ones) intact, so chaining via reduce is safe.
  const instantSettledTransactions = (parsedInvoice?.transaction || []).filter(
    (txn: any) => txn?.instantSettlement && txn?.transactionSettlement
  );

  if (instantSettledTransactions.length > 0) {
    console.log('🔄 Instant settlement detected from GraphQL nodes, applying transformer', {
      instantSettledTransactionIds: instantSettledTransactions.map((txn: any) => txn.id),
    });
    return instantSettledTransactions.reduce(
      (invoiceAcc: any, txn: any) =>
        transformInstantSettlementData(
          invoiceAcc,
          txn,
          txn.instantSettlement,
          txn.transactionSettlement
        ),
      { ...parsedInvoice, recurringInvoiceConfigId }
    );
  }

  return { ...parsedInvoice, recurringInvoiceConfigId };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = generateHeaders(req);
  const authSession = getAuthSession({ req: req });
  const token = authSession.token;
  const isTest = req.body.isTest;
  const isUnparsed = req.body.isUnparsed;
  const invoiceId = req.body.invoiceId;
  const invoiceDetails = await fetchInvoiceDetails(token as string, headers, isTest, isUnparsed, invoiceId);
  res.status(200).json({ data: invoiceDetails });
};

export default withMiddleware(handler, ALLOWED_METHODS.POST);
