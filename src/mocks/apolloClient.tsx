// Stand-in for @apollo/client. Every query and mutation is answered from fixtures,
// so no GraphQL request can leave the page.
import React, { useEffect, useMemo, useState } from "react";
import { exporterUserFixture, INDUSTRIES, INDUSTRY_QUESTIONS } from "./fixtures";
import {
  companyPanDetailsFixture,
  directorDetailsFixture,
  identityVerificationStatus,
  industryList,
  docTypeDescriptions,
} from "./onboardingFixture";

function queryText(q: any): string {
  if (!q) return "";
  if (typeof q === "string") return q;
  return q?.loc?.source?.body ?? q?.__text ?? String(q);
}

/** Answers a GraphQL document from fixture data. */
export function resolveQuery(q: any): any {
  const text = queryText(q);

  // The big business-details query asks for the industry catalogue and document menu
  // alongside the customer, so match it before the smaller exporterUser query.
  if (text.includes("FetchCompanyPanDetails") || text.includes("docTypeDescription")) {
    return companyPanDetailsFixture();
  }
  if (text.includes("FETCH_DIRECTOR_DETAILS") || text.includes("defaultAadhaarVendor")) {
    return directorDetailsFixture();
  }
  // The identity step polls a small query for its own verification flags.
  if (text.includes("sanctionCategories")) {
    return {
      exporterUser: {
        exporter: { verificationStatus: identityVerificationStatus(), sanctionCategories: [] },
      },
    };
  }
  if (text.includes("exporterUser")) return exporterUserFixture();
  if (text.includes("industry") && text.includes("riskCategory")) {
    return { industry: industryList(), docTypeDescription: docTypeDescriptions() };
  }

  if (/industr/i.test(text)) {
    return {
      industries: INDUSTRIES.map((i) => ({
        id: String(i.id),
        industryId: i.id,
        industryName: i.label,
        name: i.label,
        label: i.label,
        value: String(i.id),
        riskCategory: i.risk,
        industryRiskType: i.risk,
        searchTags: i.tags,
        questions: (INDUSTRY_QUESTIONS[i.id] ?? []).map((text, n) => ({
          id: `${i.id}-${n}`,
          question: text,
          questionText: text,
        })),
      })),
      industryList: INDUSTRIES.map((i) => ({ industryId: i.id, industryName: i.label, riskCategory: i.risk })),
    };
  }

  return {};
}

const pause = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const gql = (strings: TemplateStringsArray, ...values: any[]) => {
  const body = strings.reduce((acc, s, i) => acc + s + (values[i] ?? ""), "");
  return { __text: body, loc: { source: { body } } };
};

export function useQuery(query: any, options: any = {}) {
  const [loading, setLoading] = useState(!options?.skip);
  const [data, setData] = useState<any>(undefined);

  useEffect(() => {
    if (options?.skip) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    pause().then(() => {
      if (!alive) return;
      const result = resolveQuery(query);
      setData(result);
      setLoading(false);
      options?.onCompleted?.(result);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.skip, JSON.stringify(options?.variables ?? {})]);

  return useMemo(
    () => ({
      data,
      loading,
      error: undefined,
      called: true,
      networkStatus: loading ? 1 : 7,
      refetch: async () => {
        const r = resolveQuery(query);
        setData(r);
        return { data: r };
      },
      fetchMore: async () => ({ data }),
      startPolling: () => {},
      stopPolling: () => {},
      updateQuery: () => {},
      client: apolloClient,
    }),
    [data, loading, query]
  );
}

export function useLazyQuery(query: any, options: any = {}) {
  const [state, setState] = useState<{ data: any; loading: boolean }>({ data: undefined, loading: false });
  const run = async (runOpts: any = {}) => {
    setState({ data: undefined, loading: true });
    await pause();
    const result = resolveQuery(query);
    setState({ data: result, loading: false });
    (runOpts?.onCompleted ?? options?.onCompleted)?.(result);
    return { data: result };
  };
  return [run, { ...state, error: undefined, called: true, client: apolloClient }] as const;
}

export function useMutation(mutation: any, options: any = {}) {
  const [state, setState] = useState<{ data: any; loading: boolean }>({ data: undefined, loading: false });
  const run = async (runOpts: any = {}) => {
    setState({ data: undefined, loading: true });
    await pause();
    const result = resolveQuery(mutation);
    setState({ data: result, loading: false });
    (runOpts?.onCompleted ?? options?.onCompleted)?.(result);
    return { data: result };
  };
  return [run, { ...state, error: undefined, called: true, client: apolloClient }] as const;
}

export const apolloClient: any = {
  query: async ({ query }: any) => {
    await pause();
    return { data: resolveQuery(query), loading: false };
  },
  mutate: async ({ mutation }: any) => {
    await pause();
    return { data: resolveQuery(mutation) };
  },
  watchQuery: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
  resetStore: async () => {},
  clearStore: async () => {},
  cache: { reset: () => {}, extract: () => ({}), readQuery: () => null, writeQuery: () => {} },
};

export const ApolloProvider = ({ children }: any) => <>{children}</>;
export class ApolloClient {
  constructor(_opts?: any) {
    return apolloClient as any;
  }
}
export class InMemoryCache {
  constructor(_opts?: any) {}
}
export const createHttpLink = (_o?: any) => ({});
export const ApolloLink = { split: () => ({}), from: () => ({}) };
export const HttpLink = createHttpLink;
export type ApolloError = any;
export type QueryResult = any;
export default apolloClient;
