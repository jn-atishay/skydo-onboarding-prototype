import { NextComponentType, NextPageContext } from "next";
import { getMobileDetect } from "../util/functions";
import { useRouter } from "next/router";
import FE_ROUTES from "../util/feRoutes";
import { useEffect } from "react";
import {DESKTOP_MIN_WIDTH} from "../constants/atomicConstants";

const withScreenViewHandled = <P,>(
  Comp: NextComponentType<NextPageContext, {}, P>,
  showComponent: boolean = false,
  mobileSupportedRoutes: string[] = []
) => {
  const ClientDetails = (props: any) => {
    const router = useRouter();
    const mobileSupporting = showComponent || mobileSupportedRoutes.includes(router.pathname);

    useEffect(() => {
      if (!mobileSupporting && window && window?.innerWidth < DESKTOP_MIN_WIDTH) {
        try {
          router.push(FE_ROUTES.DASHBOARD);
        } catch (error) {
          console.error('Error during navigation:', error);
          // You could add additional error handling here if needed
        }
      }
    }, [mobileSupporting, router]);

    return (
      <div className={mobileSupporting ? "flex flex-1" : "hidden md:!flex w-full flex-1"}>
        <Comp {...props} />
      </div>
    );
  };

  ClientDetails.getInitialProps = async (ctx: NextPageContext) => {
    const isClientSide = !ctx.req;
    let userAgent;
    if (isClientSide) {
      userAgent = navigator.userAgent;
    } else {
      userAgent = ctx.req?.headers["user-agent"] || "SSR";
    }
    const { isMobile } = getMobileDetect(userAgent);
    const pageProps = Comp.getInitialProps && (await Comp.getInitialProps(ctx));
    return {
      isMobile: isMobile(),
      ...pageProps,
    };
  };

  return ClientDetails;
};

export default withScreenViewHandled;
