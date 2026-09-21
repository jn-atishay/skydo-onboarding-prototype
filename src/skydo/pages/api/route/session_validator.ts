import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { ResponseWrapper, UserSessionWithoutAuthorizationDto } from "../../../authentication/api/AuthApiDto";
import { api } from "./index";
import { SERVICES } from "../../../constants/apiConstants";
import { getAuthSession } from "../../../authentication/TokenManagement";
import BE_ROUTES from "../../../util/beRoutes";
import { EXPORTER_ONBOARDING_STATE_QUERY } from "../../../util/queries";
import { ExporterAuthorizationGraphQLResponse } from "../../../authentication/api/AuthorizationApiDto";
import { USER_STATES } from "../../../constants/onboarding";

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const userSessionData = await fetchSessionAndCheckAuthorization({ req });

  return res.status(200).send({
    success: userSessionData.success,
    message: userSessionData.message,
    data: {
      isSessionValid: userSessionData.data.isSessionValid,
      isAuthorized: userSessionData.data.isAuthorized,
    },
  });
};

export const fetchSessionAndCheckAuthorization = async (ctx: Pick<NextPageContext, "req">) => {
  const fetchSessionPromise = fetchSessionFromAuthServer(ctx);
  const checkAuthorizationPromise = checkExporterAuthorized(ctx);
  const [sessionResponse, authorizationResponse] = await Promise.all([fetchSessionPromise, checkAuthorizationPromise]);
  return {
    success: sessionResponse.success,
    message: sessionResponse.message,
    data: {
      isSessionValid: sessionResponse.data?.isSessionValid ? sessionResponse.data?.isSessionValid : false,
      isAuthorized: authorizationResponse,
    },
  };
};

const fetchSessionFromAuthServer = async (
  ctx: Pick<NextPageContext, "req"> | { req: NextApiRequest } | null
): Promise<ResponseWrapper<UserSessionWithoutAuthorizationDto>> => {
  const token = getAuthSession(ctx).token;
  if (!token) {
    return {
      success: true,
      message: "",
      data: {
        isSessionValid: false,
      },
    };
  }
  try {
    const apiResponse = await api({
      url: `auth/session/fetch_session_data/${token}`,
      server: SERVICES.AUTH,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!apiResponse?.data) {
      throw Error("Api exception");
    }

    return apiResponse?.data;
  } catch (e) {
    console.log("Exception: ", e);
    return {
      success: true,
      message: "",
      data: {
        isSessionValid: false,
      },
    };
  }
};

const checkExporterAuthorized = async (ctx: Pick<NextPageContext, "req">) => {
  const token = getAuthSession(ctx).token;
  try {
    const onBoardingState = (
      (await api({
        url: BE_ROUTES.GRAPH_QL_DASHBOARD,
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
        data: {
          query: EXPORTER_ONBOARDING_STATE_QUERY,
          operationName: "FetchExporter",
          variables: {},
        },
      })) as ExporterAuthorizationGraphQLResponse
    ).data?.data?.exporter?.onBoardingState;
    if (onBoardingState === null) return true;
    return ![USER_STATES.BLACK_LISTED, USER_STATES.ARCHIVED].includes(onBoardingState);
  } catch (e) {
    return true;
  }
};

export default apiHandler;
