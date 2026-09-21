import FE_ROUTES from "../../util/feRoutes";

export const AnalyticsSubNavBarRoutes: string[] = [
  FE_ROUTES.BUSINESS_ANALYTICS,
  FE_ROUTES.CLIENT_LEVEL_ANALYTICS,
  FE_ROUTES.REPORTS,
];

export const ClientLedgerSubRoutes = [
  FE_ROUTES.CLIENT_LIST,
  FE_ROUTES.CLIENT_LEDGER_DETAILS,
  FE_ROUTES.CLIENTS_DETAIL_PAGE,
] as const;

export const DraftInvoicesSubRoutes = [FE_ROUTES.DRAFT_INVOICES, FE_ROUTES.DRAFT_INVOICE_DETAILS] as const;
