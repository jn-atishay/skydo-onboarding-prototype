import { NextComponentType, NextPageContext } from "next";
import React, { Component } from "react";
import AuthHelper from "./AuthHelper";
import { fetchSessionDataHttpToken } from "./api/AuthApi";

const withAuth = <P,>(Page: NextComponentType<NextPageContext, {}, P>, redirect: boolean = true) => {
  // eslint-disable-next-line react/display-name
  return class extends Component<P> {
    static redirectToLoginPage(ctx: NextPageContext) {
      AuthHelper.redirectToLoginPage(ctx);
    }

    static redirectToOffboardScreen(ctx: NextPageContext) {
      AuthHelper.redirectToOffboardScreen(ctx);
    }

    static async getInitialProps(ctx: NextPageContext) {
      // Check if the users is logged in

      let authenticated = true;
      try {
        const sessionData = await fetchSessionDataHttpToken(ctx);
        if (!sessionData?.isSessionValid) {
          authenticated = false;
          if (redirect) {
            this.redirectToLoginPage(ctx);
            return {};
          }
        } else {
          if (!sessionData.isAuthorized) {
            this.redirectToOffboardScreen(ctx);
            return {};
          }
        }
      } catch (e) {
        authenticated = false;
        if (redirect) {
          this.redirectToLoginPage(ctx);
          return {};
        }
      }

      const pageProps = (Page.getInitialProps && (await Page.getInitialProps(ctx))) || {};
      return { ...pageProps, authenticated: authenticated };
    }

    componentDidMount() {}

    render() {
      return <Page {...this.props} />;
    }
  };
};

// function withAuth<P> (page: NextComponentType<NextPageContext, {}, P>) {
//
// }

export default withAuth;
