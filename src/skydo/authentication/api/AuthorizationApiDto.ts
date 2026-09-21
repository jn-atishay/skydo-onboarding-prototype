export type ExporterAuthorizationGraphQLResponse = {
  data: { data: ExporterAuthorizationData };
};

export type ExporterAuthorizationData = {
  exporter: {
    id: string;
    onBoardingState: string;
  };
};
