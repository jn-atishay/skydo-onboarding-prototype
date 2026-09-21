import { useRouter } from "next/router";
import { LAYOUT_DISABLED_ROUTES } from "../../util/feRoutes";
import React from "react";
import dynamic from "next/dynamic";

const DashboardContainer = dynamic(() => import("../DashboardContainer"));

const Layout = ({ children }: { children: React.ReactElement }) => {
  const router = useRouter();
  const { pathname } = router;
  if (LAYOUT_DISABLED_ROUTES.includes(pathname)) {
    return children;
  }
  return <DashboardContainer>{children}</DashboardContainer>;
};

export default Layout;
