import FE_ROUTES from "./feRoutes";
import { NextRouter } from "next/router";
import { destroyDashboardRoutesPublicAccess } from "../authentication/PreKycDashboardManagement";

export const redirectClientToOnboarding = (router: NextRouter) => {
  destroyDashboardRoutesPublicAccess(null);
  void router.push(FE_ROUTES.INSTANT_ONBOARDING);
};
