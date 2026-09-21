import DashboardHeader from "./DashboardHeader";
import withScreenViewHandled from "../ScreenViewCheck";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HEADER_DISABLED_ROUTES } from "../../util/feRoutes";

const Header = () => {
  const [showHeader, setShowHeader] = useState(false);

  const router = useRouter();
  const pathname = router.pathname;

  useEffect(() => {
    if (HEADER_DISABLED_ROUTES.includes(pathname)) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [pathname]);

  if (showHeader) {
    return <DashboardHeader />;
  }
  return null;
};

export default Header;
