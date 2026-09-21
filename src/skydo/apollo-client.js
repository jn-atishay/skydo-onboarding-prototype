import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from "@apollo/client";
import { SERVICES } from "./constants/apiConstants";

const httpLink = new createHttpLink({
  uri: "/api/route?path=graphql",
});

const dashboardLink = new createHttpLink({
  uri: "/api/route?path=graphql/dashboard",
});

/*
 * the policy given in useQuery overrides the one configured here
 * useQuery hook uses watchQuery internally
 */

const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "dashboard",
    dashboardLink, // <= apollo will send to this if clientName is "dashboard"
    httpLink // <= otherwise will send to this
  ),
  cache: new InMemoryCache({ addTypename: false }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
  },
});

const challanClientLink = new createHttpLink({
  uri: "/api/route?path=graphql/challan",
  headers: {
    "x-server": SERVICES.CHALLAN,
  },
});

export const ChallanApolloClient = new ApolloClient({
  link: challanClientLink,
  cache: new InMemoryCache({ addTypename: false }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
  },
});

export default client;
